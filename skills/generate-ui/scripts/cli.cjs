//#region \0rolldown/runtime.js
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __copyProps = (to, from, except, desc) => {
	if (from && typeof from === "object" || typeof from === "function") for (var keys = __getOwnPropNames(from), i = 0, n = keys.length, key; i < n; i++) {
		key = keys[i];
		if (!__hasOwnProp.call(to, key) && key !== except) __defProp(to, key, {
			get: ((k) => from[k]).bind(null, key),
			enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable
		});
	}
	return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", {
	value: mod,
	enumerable: true
}) : target, mod));
//#endregion
let http = require("http");
http = __toESM(http, 1);
let fs = require("fs");
fs = __toESM(fs, 1);
let path = require("path");
path = __toESM(path, 1);
let child_process = require("child_process");
//#region cli/index.ts
var isUpdateComponentsMsg = (m) => m !== null && typeof m === "object" && "updateComponents" in m;
var PORT = 5173;
var SCRIPT_DIR = __dirname;
var UI_JSON_PATH = path.default.join(SCRIPT_DIR, "ui.json");
var rawArgs = process.argv.slice(2);
var remaining = [];
for (let i = 0; i < rawArgs.length; i++) if (rawArgs[i] === "--ui-json" && rawArgs[i + 1]) UI_JSON_PATH = rawArgs[++i];
else remaining.push(rawArgs[i]);
var [subcommand, ...rest] = remaining;
function readUiJsonRaw() {
	try {
		return fs.default.readFileSync(UI_JSON_PATH, "utf8");
	} catch {
		return "[]";
	}
}
function safeParseJson(raw, label) {
	try {
		return JSON.parse(raw);
	} catch (e) {
		process.stderr.write(`Error: invalid JSON${label ? " (" + label + ")" : ""} — ${e.message}\n`);
		process.exit(1);
	}
}
function cmdRead() {
	process.stdout.write(readUiJsonRaw() + "\n");
}
function cmdSet(args) {
	const raw = args[0];
	if (!raw) {
		process.stderr.write("Error: set requires a JSON argument\n");
		process.exit(1);
	}
	const parsed = safeParseJson(raw, "set argument");
	fs.default.writeFileSync(UI_JSON_PATH, JSON.stringify(parsed, null, 2), "utf8");
	console.log("ui.json updated (set)");
}
function cmdUpdate(args) {
	const raw = args[0];
	if (!raw) {
		process.stderr.write("Error: update requires a JSON argument\n");
		process.exit(1);
	}
	const incoming = safeParseJson(raw, "update argument");
	if (!Array.isArray(incoming)) {
		process.stderr.write("Error: update argument must be a JSON array\n");
		process.exit(1);
	}
	const messages = safeParseJson(readUiJsonRaw(), "existing ui.json");
	if (!Array.isArray(messages)) {
		process.stderr.write("Error: existing ui.json is not an array — use \"set\" to reinitialise\n");
		process.exit(1);
	}
	const updateMsg = messages.find(isUpdateComponentsMsg);
	if (!updateMsg) {
		process.stderr.write("Error: ui.json has no updateComponents message — use \"set\" to initialise\n");
		process.exit(1);
	}
	const components = updateMsg.updateComponents.components;
	for (const comp of incoming) {
		const idx = components.findIndex((c) => c.id === comp.id);
		if (idx !== -1) components[idx] = comp;
		else components.push(comp);
	}
	fs.default.writeFileSync(UI_JSON_PATH, JSON.stringify(messages, null, 2), "utf8");
	console.log("ui.json updated (update)");
}
function cmdOpen() {
	(0, child_process.exec)(`open http://localhost:${PORT}`, (err) => {
		if (err) process.stderr.write(`Warning: could not open browser — ${err.message}\n`);
	});
}
var MIME = {
	".html": "text/html; charset=utf-8",
	".js": "application/javascript; charset=utf-8",
	".css": "text/css; charset=utf-8",
	".json": "application/json; charset=utf-8",
	".svg": "image/svg+xml",
	".png": "image/png",
	".ico": "image/x-icon",
	".woff2": "font/woff2",
	".woff": "font/woff",
	".ttf": "font/ttf"
};
function cmdServe() {
	const DIST = SCRIPT_DIR;
	const DIST_PREFIX = DIST + path.default.sep;
	const server = http.default.createServer((req, res) => {
		res.setHeader("Access-Control-Allow-Origin", "*");
		if (req.url === "/ui.json" || req.url?.startsWith("/ui.json?")) {
			try {
				const data = fs.default.readFileSync(UI_JSON_PATH, "utf8");
				res.writeHead(200, { "Content-Type": "application/json; charset=utf-8" });
				res.end(data);
			} catch {
				res.writeHead(200, { "Content-Type": "application/json; charset=utf-8" });
				res.end("[]");
			}
			return;
		}
		const urlPath = (req.url ?? "/").split("?")[0];
		const resolved = path.default.join(DIST, urlPath === "/" ? "index.html" : urlPath);
		if (!resolved.startsWith(DIST_PREFIX) && resolved !== DIST) {
			res.writeHead(403);
			res.end("Forbidden");
			return;
		}
		let filePath = resolved;
		if (!fs.default.existsSync(filePath)) filePath = path.default.join(DIST, "index.html");
		const contentType = MIME[path.default.extname(filePath)] || "application/octet-stream";
		try {
			const data = fs.default.readFileSync(filePath);
			res.writeHead(200, { "Content-Type": contentType });
			res.end(data);
		} catch {
			res.writeHead(404);
			res.end("Not found");
		}
	});
	server.on("error", (err) => {
		if (err.code === "EADDRINUSE") {
			process.stderr.write(`Error: port ${PORT} is already in use.\nIf the server is already running, use: node cli.cjs open\n`);
			process.exit(1);
		}
		throw err;
	});
	server.listen(PORT, () => {
		console.log(`A2UI app running → http://localhost:${PORT}`);
		cmdOpen();
	});
}
function printUsage() {
	process.stderr.write(`Usage: node cli.cjs [--ui-json <path>] <subcommand> [args]

Subcommands:
  serve              Start static server on port ${PORT} and open browser\n  open               Open http://localhost:${PORT} in default browser\n  read               Print current ui.json to stdout\n  set '<json>'       Replace ui.json with provided JSON\n  update '<json>'    Merge components by ID into ui.json\n`);
	process.exit(1);
}
switch (subcommand) {
	case "serve":
		cmdServe();
		break;
	case "open":
		cmdOpen();
		break;
	case "read":
		cmdRead();
		break;
	case "set":
		cmdSet(rest);
		break;
	case "update":
		cmdUpdate(rest);
		break;
	default:
		if (subcommand) process.stderr.write(`Unknown subcommand: ${subcommand}\n\n`);
		printUsage();
}
//#endregion
