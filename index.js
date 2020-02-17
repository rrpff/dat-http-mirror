const Dat = require("dat-node");
const http = require("http");
const serve = require("hyperdrive-http");
const createDebug = require("debug");
const mkdirp = require("mkdirp");

const CONFIG = {
  name: "rpf.me",
  key: process.env.ARCHIVE_KEY,
  port: parseInt(process.env.WEB_PORT, 10),
};

const debug = createDebug(CONFIG.name);

const storagePath = `./hyperdrive/${CONFIG.key}`;
mkdirp.sync(storagePath);

debug(`archiving in ${storagePath}...`);

const datOptions = {
  key: CONFIG.key,
  sparse: true,
  temp: false,
};

const webOptions = {
  port: CONFIG.port,
  live: true,
};

Dat(storagePath, datOptions, (connectErr, dat) => {
  if (connectErr) throw connectErr;

  debug("connecting...");

  dat.joinNetwork(joinErr => {
    if (joinErr) throw joinErr;

    debug("dat.network.connected", dat.network.connected);
    debug("dat.network.connecting", dat.network.connecting);
    debug(`starting on :${webOptions.port}...`);

    const server = http.createServer(serve(dat.archive, webOptions));

    server.on("connect", (req) => {
      debug(`request to: ${req.url}`);
    });

    server.listen(webOptions.port, (err) => {
      if (err) debug("error", err);
      debug(`listening on :${webOptions.port}`);
    });
  });
});
