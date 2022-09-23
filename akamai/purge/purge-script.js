const core      = require('@actions/core');
const github    = require('@actions/github');
const edgegrid  = require('akamai-edgegrid');

try {

  const accessToken = process.env.AKAMAI_PURGE_ACCESS_TOKEN
  const clientSecret = process.env.AKAMAI_PURGE_CLIENT_SECRET
  const clientToken = process.env.AKAMAI_PURGE_CLIENT_TOKEN
  const purgeHost = process.env.AKAMAI_PURGE_HOST

  const cache_tag = core.getInput('cache_tag')

  var data = 'bodyData';

  var api = new edgegrid(clientToken, clientSecret, accessToken, purgeHost);

  data = {"objects":[cache_tag]}

  api.auth({
    path: '/ccu/v3/invalidate/tag/production',
    method: 'POST',
    headers: {
      accept: 'application/json',
      'content-type': 'application/json'
    },
    body: data
  });

  api.send(function(error, response, body) {
    console.log(error);
    console.log(response);
    console.log(body);
});

} catch (error) {
  core.setFailed(error.message);
}