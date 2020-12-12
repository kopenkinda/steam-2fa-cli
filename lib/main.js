/* eslint-disable no-console */
const fs = require('fs');
const mkdirp = require('mkdirp');
const touch = require('touch');
const { getMessage } = require('./messages');
const {
  listCodes, addAccount, removeAccount, secrets, listAccounts,
} = require('./2fa');
const { getArgs } = require('./cli');

/**
 * @return {Promise<void>}
 */
function checkForSecretsStore() {
  return new Promise((res) => fs.stat(secrets.path(), (err) => {
    if (err && err.code === 'ENOENT') {
      mkdirp(secrets.folder())
        .then(() => {
          touch(secrets.path());
          fs.writeFileSync(secrets.path(), '[]');
          console.log(getMessage('NO_CONFIG_FOUND', secrets.path()));
          res();
        });
    } else {
      res();
    }
  }));
}

function handleCli() {
  const args = getArgs();
  if (args.includes('--add') || args.includes('-a')) {
    const name = args.find((arg) => arg[0] === '--name');
    const secret = args.find((arg) => arg[0] === '--secret');
    if (args.length !== 3 || name === undefined || !secret === undefined) {
      console.log(getMessage('INVALID_ADD_FORMAT'));
      return;
    }
    addAccount({
      name: name[1],
      secret: secret[1],
    });
    return;
  }
  if (args.includes('--remove') || args.includes('-r')) {
    if (args.length !== 2) {
      console.log(getMessage('INVALID_REMOVE_FORMAT'));
      return;
    }
    removeAccount(args[1]);
    return;
  }
  if (args.includes('--list') || args.includes('-l')) {
    listAccounts();
    return;
  }
  listCodes();
}
checkForSecretsStore()
  .then(handleCli);
