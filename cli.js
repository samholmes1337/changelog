#!/usr/bin/env node
const chalk = require("chalk");

const changelog = require("./changelog");
const { cli } = changelog;

const isModule = !(require.main === module);
const args = process.argv;

if (isModule) useAsModule();
else useAsCLI();

function useAsModule() {
    exports.parse = changelog.parse;
    exports.stringify = changelog.stringify;
}

function useAsCLI() {
    args.splice(0, 2); // Remove first two CLI args

    if (args.length === 0) printDocs();
    else parseArgs();
}

function parseArgs() {
    const cmd = args.splice(0, 1)[0];

    switch (cmd) {
        case "help": printDocs(); break;
        case "init": cli.init(); break;
        case "destroy": cli.destroy(); break;
        case "parse": cli.parse(); break;

        case "add":
        case "change":
        case "deprecate":
        case "remove":
        case "fix":
        case "secure":
            cli.update(cmd);
            break;

        case "bump": cli.bump(args[0]); break;
        case "copy": cli.copy(); break;
        case "status": cli.status(); break;

        default:
            console.log(chalk.red(`error: "${cmd}" is not a changelog command\n`));
            printDocs();
            break;
    }
}

function printDocs() {
    console.log(`usage: changelog <command> [<args>]
Basic Commands:
   help      List the documentation
   init      Initialize a blank CHANGELOG.md file in the current directory
   parse     Parse the CHANGELOG.md file to JSON format
   status    Get the changelog information and version status

Changelog Commands:
   add       'Added' for new features
   change    'Changed' for changes in existing functionality
   deprecate 'Deprecated' for once stable features removed in upcoming releases
   remove    'Removed' for deprecated features removed in this release
   fix       'Fixed' for any bug fixes
   secure    'Security' to invite users to upgrade in case of vulnerabilities

Version Commands:
   bump       Update 'Unreleased' section to new version
   copy       Copy the latest version to the clipboard

Danger Zone:
   destroy   Completely destroy any changelog file in the current directory
    `);
}
