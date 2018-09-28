const express 			= require('express');
const router 			= express.Router();
const microsoftGraph 	= require("@microsoft/microsoft-graph-client");
const convertExcel 		= require("excel-as-json").processFile;
const fs 				= require('fs');
const config 			= require('config');

const authorize 		= require("./authorize");

const mapTemplate 	= require("../../data/mapTemplate");
const mainTemplate 	= require("../../data/mainTemplate");
const roomsData 	= require("../../data/roomsData.json");

const companyName 		= config.get("company.name");
const seatsFile 		= config.get("files.seats");
const analytics 		= config.get("analytics");

function getPeople({ token, email }){
	// Create a Graph client
	const client = microsoftGraph.Client.init({
		authProvider: (done) => {
			// Just return the token
			done(null, token);
		}
	});

	return client
		.api('/me/people')
		.version("beta")
		.select("displayName", "givenName", "surname", "title", "companyName", "department", "officeLocation", "phones", "emailAddresses")
		.header('X-AnchorMailbox', email)
		.top(1000)
		.orderby('givenName ASC')
		.get()
		.then((res) => {
			return res.value;
		});
}

function getSpaces() {
	return new Promise((resolve, reject) => {
		convertExcel(`data/${seatsFile}`, undefined, { isColOriented: false }, (err, data) => {
			if (err){
				reject(err);
			} else {
				resolve(data);
			}
		});
	});
}

function serialize(template, users) {
	let itemsStr = "";
	let listStr = "";

	roomsData.concat(users).forEach(function ({ category, space, displayName, email, department, title, phone, mobile }) {
		let itemHtml;

		switch(category){
			case 0:		// men
				itemHtml = `
					<div class="content__item" data-space="${space}" data-category="${category}">
						<h3 class="content__item-title">${displayName}</h3>
						<div class="content__item-details">
							<p class="content__meta">
								<span class="content__meta-item"><strong>${department}</strong> ${title}</span>
							</p>
							<ul class="content__desc">
								<li data-attr="Email:"><a href="mailto:${email}">${email}</a></li>
								<li data-attr="Ext. Phone:">${phone}</li>
								<li data-attr="Mobile Phone:">${mobile}</li>
							</ul>
						</div>
					</div>
				`;
				break;
			case 1:		// meeting room
				itemHtml = `
					<div class="content__item" data-space="${space}" data-category="${category}">
						<h3 class="content__item-title"><span>${space}</span>${displayName}</h3>
						<div class="content__item-details">
							<ul class="content__desc">
								<li data-attr="Email:"><a href="mailto:${email}">${email}</a></li>
								<li data-attr="Room Phone:">+7495 1234623 Ext. 00${space}</li>
								<li data-attr="Scheduled:"><a target="_blank" href="https://outlook.office365.com/owa/?realm=odin.com&exsvurl=1&ll-cc=1033&modurl=1">Look</a></li>
							</ul>
						</div>
					</div>
				`;
				break;
			default:
				itemHtml = `
					<div class="content__item" data-space="${space}" data-category="${category}">
						<h3 class="content__item-title"><span>${space}</span>${displayName}</h3>
						<div class="content__item-details"></div>
					</div>
				`;
		}

		listStr += `
			<li class="list__item" data-level="${space[0]}" data-category="${category}" data-space="${space}">
				<a href="javascript:void()" class="list__link"><span>${!category ? "" : space}<i>${email}||${phone}||${department}||${title}</i></span>${displayName}</a>
			</li>
		`;

		itemsStr += itemHtml;
	}, "");

	return template.replace("{ITEMS}", itemsStr).replace("{LIST}", listStr);
}

function write(html){
	return new Promise(function (resolve, reject) {
		fs.writeFile("public/index.html", html, function(err) {
			if (err){
				reject(err);
			} else {
				resolve();
			}
		});
	});
}

function normalize(str) {
	return (str || "").toLowerCase().trim();
}

router.get('/', async (req, res) => {
	let indexHTML = mainTemplate;
	indexHTML = indexHTML.replace(/{COMPANY NAME}/gi, companyName);
	indexHTML = indexHTML.replace("{MAP}", mapTemplate);
	indexHTML = indexHTML.replace("{ANALYTICS}", analytics);

	roomsData.sort((a, b) => a.category - b.category);

	try {
		const { token, email } 	= await authorize(req, res);

		if (!token){
			console.log("Not authorized");
			return;
		}

		const usersData 		= await getPeople({ token, email });
		const usersSpaces 		= await getSpaces();

		const users = [];
		usersSpaces.forEach((userSpace) => {
			let user = usersData.find((userData) => (
				normalize(userData.displayName) === `${normalize(userSpace["First Name"])} ${normalize(userSpace["Last Name"])}`
				|| normalize(userData.displayName) === `${normalize(userSpace["First Name"])}, ${normalize(userSpace["Last Name"])}`
				|| (
					normalize(userData.givenName) === normalize(userSpace["First Name"])
					&& normalize(userData.surname) === normalize(userSpace["Last Name"])
				)
			));

			if (!user || !userSpace.Seat) {
				if (userSpace["Last Name"] !== "Vacant" && userSpace["Last Name"] !== "Архив" && !!userSpace["Last Name"]){
					console.log(JSON.stringify(userSpace));
				}
				return;
			}

			user.space = userSpace.Seat.toPrecision(4);

			const workPhone 	= user.phones.find((phone) => phone.type === "business");
			const mobilePhone 	= user.phones.find((phone) => phone.type === "mobile");
			user.phone 			= (workPhone ? workPhone.number : "").split("ext. ").pop();
			user.mobile 		= mobilePhone ? mobilePhone.number : "";
			user.email 			= user.emailAddresses[0].address;
			user.category 		= 0;

			users.push(user);
		});

		await write(serialize(indexHTML, users));
		res.send("synced");
	} catch (err){
		console.log(err);
		res.send("Failed: " + err);
	}
});

module.exports = router;