const { AccountManager } = require('./AccountsManager');
const { CLI } = require('./CLI');
const { MessageController } = require('./MessageController');

AccountManager.check()
  .then(() => {
    const args = CLI.getArgs();
    switch (true) {
      case (args.includes('-a')):
      case (args.includes('--add')): {
        if (args.length !== 3) {
          MessageController.log('INVALID_ADD_PARAMETERS');
          break;
        }
        AccountManager.create(args[1], args[2]);
        break;
      }
      case (args.includes('-r')):
      case (args.includes('--remove')): {
        if (args.length !== 2) {
          MessageController.log('INVALID_REMOVE_PARAMETERS');
          break;
        }
        AccountManager.remove(args[1]);
        break;
      }
      case (args.includes('-l')):
      case (args.includes('--list')): {
        AccountManager.raw();
        break;
      }
      case (args.length === 0): {
        AccountManager.list();
        break;
      }
      case (args.includes('-?')):
      case (args.includes('-h')):
      case (args.includes('--help')):
      default: {
        MessageController.log('HELP_MESSAGE');
      }
    }
  });
