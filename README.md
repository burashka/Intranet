Intranet
========

Description
-----------

The engine for building an intranet site of the company. At the current stage, you can display the map of the office with the search for employees on it. You can search by name, surname, workplace number and team. You can also search for meeting rooms.
Information about employees is exported from Office 365 and a special file with a list of seats.

<img src='https://raw.githubusercontent.com/burashka/Intranet/master/img/map.jpg'>

Preparation
-----------

1. Register Office 365 app.
Good article about it: https://docs.microsoft.com/en-us/outlook/rest/node-tutorial.
You should set redirect URI: https://localhost:8443/sync.
2. Create config/production.json and fill it in as default.json
	```json
	{
		"o365": {
			"id": 		"YOUR APP ID HERE",
			"secret": 	"YOUR APP PASSWORD HERE"
		},
		"company": {
			"name": 	"YOUR COMPANY NAME HERE",
			"location": "YOUR OFFICE LOCATION HERE"
		},
		"files": {
			"seats": "EXCEL FILE WITH USERS SEATS"
		}
	}
	```
3. Create in directory 'data' file from field 'files.seats'.
File should contains fields "Last Name", "First Name", "Seat". Format seat: 1.001.
<img src='https://raw.githubusercontent.com/burashka/Intranet/master/img/excel.jpg'>

4. Add a description of the office floor scheme to the file data/mapTemplate.js

5. Add SSL certificates: sslcert/cert.pem и sslcert/key.pem. You can generate self-signed certificates for development: http://blog.mgechev.com/2014/02/19/create-https-tls-ssl-application-with-express-nodejs/

Run
---

1. Install process manager for Node.js: https://www.npmjs.com/package/pm2
2. pm2 start pm2-config.json
3. Open in browser https://localhost:8443/sync and login to Office 365.
4. If everything went well, then you should see the text 'Synced'.
5. Open localhost. You should see a map of your office. Congratulations!
