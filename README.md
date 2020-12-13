# Steam 2FA CLI

CLI tool to generate Steam 2FA codes.

Listing codes:
```shell
$ steam2fa
```

Listing accounts with secrets:
```shell
$ steam2fa -l     #or
$ steam2fa --list
```

Adding an account:
```shell
$ steam2fa -a    "name" "secret" #or
$ steam2fa --add "name" "secret" 
$ #Example: steam2fa -a "My personal account" "8cr0T+zCLiaSdo1E+Alp7nzAPno="
```

Removing an account:
```shell
$ steam2fa -r "secret part"       #or
$ steam2fa --remove "secret part"
$ #Example: steam2fa -r "8cr0"
```

Show help message:
```shell
$ steam2fa -h     #or
$ steam2fa -?     #or
$ steam2fa --help
```