const COLORS = {
  RESET: '\x1b[0m',
  BRIGHT: '\x1b[1m',
  DIM: '\x1b[2m',
  UNDERSCORE: '\x1b[4m',
  BLINK: '\x1b[5m',
  REVERSE: '\x1b[7m',
  HIDDEN: '\x1b[8m',
  FG_BLACK: '\x1b[30m',
  FG_RED: '\x1b[31m',
  FG_GREEN: '\x1b[32m',
  FG_YELLOW: '\x1b[33m',
  FG_BLUE: '\x1b[34m',
  FG_MAGENTA: '\x1b[35m',
  FG_CYAN: '\x1b[36m',
  FG_WHITE: '\x1b[37m',
  BG_BLACK: '\x1b[40m',
  BG_RED: '\x1b[41m',
  BG_GREEN: '\x1b[42m',
  BG_YELLOW: '\x1b[43m',
  BG_BLUE: '\x1b[44m',
  BG_MAGENTA: '\x1b[45m',
  BG_CYAN: '\x1b[46m',
  BG_WHITE: '\x1b[47m',
};

/** @type {Map<string, string | (o)=>string>} */
const storage = new Map();

/**
 * @param {string} messageCode
 * @param {*} options
 * @returns {string}
 */
function get(messageCode, options) {
  const code = messageCode.toUpperCase();
  if (!storage.has(code)) return storage.get('NOT_YET_IMPLEMENTED')(code);
  const message = storage.get(code);
  if (typeof message === 'function') return message(options);
  return message;
}

/**
 * @param {string} messageCode
 * @param {*} options
 * @returns {void}
 */
function log(messageCode, options) {
  return console.log(get(messageCode, options));
}

const MessageController = {
  log,
};

// storage.set('', () => ``);
storage.set('NOT_YET_IMPLEMENTED', (messageCode) => `[${messageCode}] Is not yet implemented...`);
storage.set('BROKEN_CONFIG', () => 'Seems like your config file is corrupted...');
storage.set('NO_CONFIG_FOUND', ({ path }) => `There was no config file found, creating one in ${path}`);
storage.set('ERROR_OCCURRED', ({ error }) => `Unexpected error ${error.stack()}`);

storage.set('ACCOUNT_CREATED', ({ name }) => `Account "${name}" was successfully created`);
storage.set('ACCOUNT_DELETED', ({ account }) => `Account "${account}" was successfully removed`);
storage.set('NO_ACCOUNTS_TO_DELETE', ({ partial }) => `No accounts found with secret containing "${partial}"`);
storage.set('NO_ACCOUNTS_TO_DELETE', ({ partial }) => `No accounts found with secret containing "${partial}"`);
storage.set('MULTIPLE_ACCOUNTS_TO_DELETE', () => 'Multiple matching secrets found...');
storage.set('SHOW_ACCOUNT', ({ account: [name, code], position }) => ` ${position} | ${name} ${COLORS.BG_WHITE}${COLORS.FG_BLACK} ${code} ${COLORS.RESET}`);

storage.set('INVALID_ADD_PARAMETERS', () => [
  'Usage: steam2fa -a "name" "secret"',
  'Example: steam2fa -a "My personal account" "8cr0T+zCLiaSdo1E+Alp7nzAPno="',
].join('\n'));

storage.set('INVALID_REMOVE_PARAMETERS', () => [
  'Usage: steam2fa -r "secret part"',
  'Example: steam2fa -r "b8cA"',
].join('\n'));

storage.set('HELP_MESSAGE', () => [
  'Steam 2FA CLI',
  '',
  'Listing codes:',
  'Usage: steam2fa',
  '',
  'Listing accounts with secrets:',
  'Usage: steam2fa -l',
  '',
  'Adding an account:',
  'Usage: steam2fa -a "name" "secret"',
  'Example: steam2fa -a "My personal account" "8cr0T+zCLiaSdo1E+Alp7nzAPno="',
  '',
  'Removing an account:',
  'Usage: steam2fa -r "secret part"',
  'Example: steam2fa -r "b8cA"',
  '',
  'Show this message:',
  'Usage: steam2fa -h',
].join('\n'));

module.exports = { MessageController };
