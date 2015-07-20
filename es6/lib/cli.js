#!/usr/bin/env node
import Liftoff from "liftoff";
import Promise from "bluebird";
import commander from "commander";
import chalk from "chalk";
import packageJson from "../../package.json";
import interpret from "interpret";
import v8flags from "v8flags";

const liftoff = new Liftoff({
  name: "almaden",
  extensions: interpret.jsVariants,
  v8flags: v8flags
});

function exit(text) {
  if (text instanceof Error) {
    throw text;
    // chalk.red(console.error(text.stack));
  } else {
    throw new Error(text);
    // chalk.red(console.error(text));
  }
  // process.exit(1);
}

function success(text) {
  chalk.green(text);
  // process.exit(0);
  throw 0;
}

liftoff.launch({cwd: __dirname},
  function invoke() {
    let pending;

    commander
      .version(chalk.blue(`Almaden CLI Version ${packageJson.version}\n`))
      .option("--debug", "Run with debugging");

    commander.command("migrate:make <name>")
      .description("       Create a named migration file.")
      .action(function (name) {
        pending = initKnex(env)
          .migrate
          .make(name, { extension: "js" })
          .then(function successMake(migrationName) {
              success(chalk.green("Created Migration: " + migrationName));
          })
          .catch(function exitMake() {

          });
    });

    // commander.command("migrate:latest").description("        Run all migrations that have not yet been run.").action(function () {
    //   pending = initKnex(env).migrate.latest().spread(function (batchNo, log) {
    //     if (log.length === 0) {
    //       success(chalk.cyan("Already up to date"));
    //     }
    //     success(chalk.green("Batch " + batchNo + " run: " + log.length + " migrations \n" + chalk.cyan(log.join("\n"))));
    //   })["catch"](exit);
    // });

    commander.parse(process.argv);

    Promise
      .resolve(pending)
      .then(() => {
        commander.help();
      });
  }
);
