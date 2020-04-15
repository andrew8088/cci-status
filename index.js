#!/usr/bin/env node

const git = require('./git');
const cci = require('./cci');
const helpers = require('./helpers');

async function main() {
  if (!process.env.CIRCLE_CI_TOKEN) {
    console.error('Please set the environment variable CIRCLE_CI_TOKEN');
    process.exit(1);
  }

  const [,, remoteName, ...args] = process.argv;
  const project = await getProjectSlugFromRemote(remoteName);
  const branch = await getCurrentBranch();

  const pipelines = await getPipelines(project, branch);
  const workflows = await getWorkflows(pipelines[0].id);
  const jobs = await getJobs(workflows[0].id);
  const rows = jobs.map(helpers.transformJob);

  console.log(helpers.getTable(branch, rows, ['name', 'status', 'runtime']));
}

main();

async function getProjectSlugFromRemote(remoteName = "origin") {
  const remotes = await git.remote("show", remoteName, "-n");
  const fetchUrlLine = remotes.split('\n').find(line => line.includes('Fetch URL'));
  const project = fetchUrlLine.match(/:(\S*\/\S*)\./)[1];
  return `gh/${project}`;
}

async function getCurrentBranch() {
  const branches = await git.branch();
  return branches.split('\n').find(line => line.startsWith('*')).slice(2);
}

function getPipelines(project, branch) {
  return cci.getPipelines(project, branch).then(items);
}

function getWorkflows(pipelineId) {
  return cci.getWorkflows(pipelineId).then(items);
}

function getJobs(workflowId) {
  return cci.getJobs(workflowId).then(items);
}

function items(res) {
  return JSON.parse(res.body).items;
}
