const fs = require('fs');
const mkdirp = require('mkdirp');
const path = require('path');
const { generateAuthCode } = require('steam-totp');
const touch = require('touch');
const { MessageController } = require('./MessageController');

/** @type {Map<string, string>} */
const storage = new Map();

const file = (
  function getFilePath(platform) {
    const fp = { name: 'secrets.txt' };
    const home = process.env.APPDATA || (platform === 'darwin' ? `${process.env.HOME}/Library/Preferences` : `${process.env.HOME}/.config`);
    fp.folder = path.resolve(home, 'steam2fa-cli');
    fp.path = path.resolve(fp.folder, fp.name);
    return fp;
  }(process.platform)
);

function load() {
  const buffer = fs.readFileSync(file.path, 'utf-8');
  try {
    const json = JSON.parse(buffer);
    json.forEach(([name, secret]) => {
      storage.set(secret, name);
    });
  } catch {
    MessageController.log('BROKEN_CONFIG');
  }
}

function save() {
  const data = [...storage].map((x) => x.reverse());
  console.log(data);
  fs.writeFileSync(file.path, JSON.stringify(data));
}

function check() {
  return new Promise((res, rej) => {
    fs.stat(file.path, (err) => {
      if (err && err.code === 'ENOENT') {
        mkdirp(file.folder)
          .then(() => {
            touch(file.path);
            fs.writeFileSync(file.path, '[]');
            MessageController.log('NO_CONFIG_FOUND', { path: file.path });
            res();
          })
          .catch((error) => {
            MessageController.log('ERROR_OCCURRED', { error });
            rej();
          });
      } else {
        res();
      }
    });
  });
}

function create(name, secret) {
  load();
  storage.set(secret, name);
  MessageController.log('ACCOUNT_CREATED', { name });
  save();
}

function remove(partial) {
  load();
  const keys = [...storage.keys()];
  const haveFound = [];
  keys.forEach((key) => {
    if (key.includes(partial)) {
      haveFound.push(key);
    }
  });
  if (haveFound.length === 1) {
    MessageController.log('ACCOUNT_DELETED', { account: haveFound[0] });
    storage.delete(haveFound[0]);
    save();
  } else if (haveFound.length === 0) {
    MessageController.log('NO_ACCOUNTS_TO_DELETE', { partial });
  } else {
    MessageController.log('MULTIPLE_ACCOUNTS_TO_DELETE', { accounts: haveFound });
  }
}

function list() {
  load();
  const data = [...storage];
  const longest = data.reduce((acc, v) => (v[1].length > acc ? v[1].length : acc), 0);
  data.forEach(([secret, name], i) => MessageController.log('SHOW_ACCOUNT', {
    position: i + 1,
    account: [name.padEnd(longest), generateAuthCode(secret)],
  }));
}

function raw() {
  load();
  const data = [...storage];
  const longest = data.reduce((acc, v) => (v[1].length > acc ? v[1].length : acc), 0);
  data.forEach(([secret, name], i) => MessageController.log('SHOW_ACCOUNT', {
    position: i + 1,
    account: [name.padEnd(longest), secret],
  }));
}

const AccountManager = {
  file,
  check,
  load,
  save,
  create,
  remove,
  list,
  raw,
};

module.exports = {
  AccountManager,
};
