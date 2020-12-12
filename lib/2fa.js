const fs = require('fs');
const path = require('path');
const totp = require('steam-totp');
const { getMessage } = require('./messages');

const secrets = {
  file: () => 'secrets',
  folder: () => path.resolve(process.env.HOME, '.config', 'steam2fa-cli'),
  path() {
    return path.resolve(this.folder(), this.file());
  },
};

/**
 * @return {[]|[[string, string]]}
 */
function loadAccounts() {
  const buffer = fs.readFileSync(secrets.path(), 'utf-8');
  try {
    const json = JSON.parse(buffer);
    return json;
  } catch {
    console.log(getMessage('FILE_CORRUPTED'));
    return [];
  }
}

function listCodes() {
  const accounts = loadAccounts();
  accounts.forEach((account, i) => {
    console.log(`[${i + 1}] "${account[0]}": ${totp.generateAuthCode(account[1])}`);
  });
}

function listAccounts() {
  const accounts = loadAccounts();
  accounts.forEach((account, i) => {
    console.log(`[${i + 1}] "${account[0]}": ${account[1]}`);
  });
}

function addAccount({ name, secret }) {
  const accounts = loadAccounts();
  const newAccount = [name, secret];
  accounts.push(newAccount);
  fs.writeFileSync(secrets.path(), JSON.stringify(accounts));
  console.log(getMessage('ACCOUNT_CREATED', newAccount));
}

function removeAccount(i) {
  if (Number.isNaN(i)) {
    console.log(getMessage('INVALID_REMOVE_PARAMETER'));
    return;
  }
  const accounts = loadAccounts();
  if (i < 0 || i > accounts.length) {
    console.log(getMessage('INVALID_REMOVE_PARAMETER'));
    return;
  }
  const deletedAccount = accounts.splice(i - 1, 1)[0];
  fs.writeFileSync(secrets.path(), JSON.stringify(accounts));
  console.log(getMessage('ACCOUNT_DELETED', deletedAccount));
}

module.exports = {
  secrets,
  listCodes,
  listAccounts,
  addAccount,
  removeAccount,
};
