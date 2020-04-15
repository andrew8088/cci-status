const https = require('https');

// reference: https://circleci.com/docs/api/v2/

const BASE_URL = 'https://circleci.com/api/v2';
const TOKEN = process.env.CIRCLE_CI_TOKEN;

module.exports = {
  getPipelines,
  getWorkflows,
  getJobs
};

function getPipelines(project, branch) {
  const url = `${BASE_URL}/project/${project}/pipeline?branch=${branch}`;
  return get(url);
}

function getWorkflows(pipelineId) {
  return get(`${BASE_URL}/pipeline/${pipelineId}/workflow`);
}

function getJobs(workflowId) {
  return get(`${BASE_URL}/workflow/${workflowId}/job`);
}

function get(url, options = { headers: {} }, body = undefined) {
  return new Promise((resolve, reject) => {
    const req = https.request(url, {
      ...options,

      headers: {
        ...options.headers,
        'Circle-Token': TOKEN
      }
    }, (res) => {
      let response = {
        statusCode: res.statusCode,
        headers: res.headers,
        body: ''
      };

      res.setEncoding('utf8');

      res.on('data', (chunk) => {
        response.body += chunk.toString();
      });

      res.on('end', () => {
        resolve(response);
      });
    });

    req.on('error', (e) => {
      reject(e);
    });

    if(body) {
      req.write(body);
    }

    req.end();
  });
}
