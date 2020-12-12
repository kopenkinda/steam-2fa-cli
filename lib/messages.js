const messages = new Map();

messages.set('NYI', (msg) => `This message is not implemented yet: "${msg}"`);

messages.set('NO_CONFIG_FOUND', (pwd) => `There was no config file found, creating one in ${pwd || ''}`);

messages.set('INVALID_ADD_FORMAT', () => [
  'Usage: steam2fa [-a|--add] --name="" --secret=""',
  'Example: steam2fa -a --name="My personal account" --secret="8cr0T+zCLiaSdo1E+Alp7nzAPno="',
].join('\n'));

messages.set('ACCOUNT_DELETED', (deletedAccount) => `Account "${deletedAccount[0]}" was successfully removed`);

function getMessage(message, ...args) {
  if (messages.has(message)) {
    return messages.get(message)(...args);
  }
  return messages.get('NYI')(message);
}

module.exports = {
  getMessage,
};
