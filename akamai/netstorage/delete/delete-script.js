const core      = require('@actions/core');

const host 		  = core.getInput('host')
const cp_code	  = core.getInput('cp_code')
const directory = encodeURIComponent(core.getInput('directory'))
const filename	= core.getInput('filename')
const keyName 	= core.getInput('upload_account')

const key       = process.env.AKAMAI_NETSTORAGE_CONTENT_API_KEY

const actionHeaders = "version=1&action=delete"
const netstoragePath = '/' + cp_code + "/" + directory + "/" + filename;

console.log("** File to delete **");
console.log("Host: " + host);
console.log("Path: /" + cp_code + "/" + directory + "/" + filename);
console.log("upload_account: " + keyName);

const crypto = require('node:crypto')

var acs_auth_data = '';
var acs_auth_sign = '';

try {
	acs_auth_data = `5, 0.0.0.0, 0.0.0.0, ${Math.floor(Date.now() / 1000)}, ${Math.floor((Math.random() * 100000))}, ${keyName}`
	const sign_string = `${netstoragePath}\nx-akamai-acs-action:${actionHeaders}\n`
	const message = acs_auth_data + sign_string

	const hmac = crypto.createHmac('sha256', key);
	acs_auth_sign = hmac.update(message).digest('base64');
} 
catch (err) {
	throw new Error(`[Auth Error] ${err} `)
}

var options = {
  host: host,
  path: netstoragePath,
  method: 'PUT',
  headers: {
  	'Host': host, 
    'X-Akamai-ACS-Action': actionHeaders, 
    'X-Akamai-ACS-Auth-Data': acs_auth_data,
    'X-Akamai-ACS-Auth-Sign': acs_auth_sign
  }
};

https = require('https');

const request = https.request(options, (response) => {
  console.log('statusCode:', response.statusCode);
  console.log('headers:', response.headers);

  response.on('data', (data) => {
    process.stdout.write(data);
  });
});

console.log("** API Request **");
console.log(request)

request.on('error', (error) => {
  console.error(error);
});
request.end();
