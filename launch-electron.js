const path = require("path");
const { spawn } = require("child_process");

const electronBinary = require("electron");
const appPath = __dirname;
const args = process.argv.slice(2);

const childEnv = { ...process.env };
delete childEnv.ELECTRON_RUN_AS_NODE;

const child = spawn(electronBinary, args.length ? args : [appPath], {
  env: childEnv,
  stdio: "inherit",
  windowsHide: false
});

child.on("exit", (code) => {
  process.exit(code || 0);
});
