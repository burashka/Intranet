const authHelper = require('./authHelper');
const microsoftGraph = require("@microsoft/microsoft-graph-client");

function setCookie(token, response) {
	response.cookie('intranet-token', 			token.token.access_token, 4000);
	response.cookie('intranet-refresh-token', 	token.token.refresh_token, 4000);
	response.cookie('intranet-token-expires', 	token.token.expires_at.getTime(), 4000);
}

function getRidirectUri(req){
	return 'https://' + req.header('Host') + req.baseUrl;
}

async function getUserEmail(token) {
	// Create a Graph client
	const client = microsoftGraph.Client.init({
		authProvider: (done) => {
			// Just return the token
			done(null, token);
		}
	});

	// Get the Graph /Me endpoint to get user email address
	const res = await client
		.api('/me')
		.get();

	return res.mail;
}

async function tokenReceived(response, token, redirectUri) {
	try {
		const email = await getUserEmail(token.token.access_token);

		setCookie(token, response);
		response.cookie('intranet-email', email, 4000);
		response.redirect(redirectUri);
	} catch(error){
		console.log('getUserEmail returned an error: ' + error);
		response.write('<p>ERROR: ' + error + '</p>');
		response.end();
	}
}

async function getAccessToken(request) {
	const expiration = new Date(parseFloat(request.cookies['intranet-token-expires']));

	if (expiration > new Date()) {
		// Return cached token
		return {
			token: request.cookies['intranet-token'],
			email: request.cookies['intranet-email']
		};
	}

	// refresh token
	console.log('TOKEN EXPIRED, REFRESHING');
	const 	refresh_token = request.cookies['intranet-refresh-token'];
	let 	token = await authHelper.refreshAccessToken(refresh_token);

	token = token.token.access_token;
	const email = await	getUserEmail(token);

	return { token, email };
}

async function authorize(req, res) {
	try {
		return await getAccessToken(req);
	} catch(error){
		if (req.query.code){
			try {
				const redirectUri = getRidirectUri(req);
				const token = await authHelper.getTokenFromCode(req.query.code, redirectUri);
				await tokenReceived(res, token, redirectUri);
			} catch(err){
				console.log('Access token error: ', error.message);
				res.send(`<p>ERROR: ${error}</p>`);
			}
		} else {
			res.send(`<p>Please <a href="${authHelper.getAuthUrl(getRidirectUri(req))}">sign in</a> with your Office 365 or Outlook.com account.</p>`);
		}

		return {};
	}
}

module.exports = authorize;