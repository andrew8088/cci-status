const { exec } = require('child_process');

module.exports = {
  pull: git('pull'),
  branch: git('branch'),
  remote: git('remote'),
  checkout: git('checkout'),
  rebase: git('rebase')
};

function git(cmd) {
  return (...args) => execute(`git ${cmd} ${args.join(' ')}`);
}

function execute(cmd) {
  return new Promise((resolve, reject) => {
    // console.log(cmd);
    const gb = exec(cmd);

    let allData = "";
    let allError = "";

    gb.stdout.on('data', (data) => {
      allData += data.toString();
    });

    gb.stderr.on('data', (err) => {
      allError += err.toString();
    });

    gb.on('close', (code) => {
      if (code === 0) {
        resolve(allData);
      } else {
        reject(allError);
      }
    });
  })
}
