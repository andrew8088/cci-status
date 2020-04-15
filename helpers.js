const AsciiTable = require('ascii-table')

function transformJob(job) {
  return {
    name: job.name,
    status: job.status,
    runtime: getRuntime(job)
  };
}

function getRuntime({ started_at, stopped_at }) {
  if (!started_at) return '';
  if (!stopped_at) return '';

  const end = new Date(stopped_at);
  const start = new Date(started_at);

  return formatTime(end - start);
}

function formatTime(ms) {
  let s = ms / 1000;

  const m = Math.floor(s / 60);
  s = s % 60;

  return `${m}m ${s}s`;
}

function getTable(branch, data, heading) {
  const table = AsciiTable.factory({
    title: `CircleCI Workflow for ${branch}`,
    heading,
    rows: data.map(record => heading.map(key => record[key]))
  })

  return table.toString();
}

module.exports = {
  getTable,
  transformJob
};
