const express = require("express");
const bodyParser = require("body-parser");
const fs = require("fs");

const { compile_and_run } = require("./compile");

const { execSync, exec } = require('child_process');

const { do_jail } = require("./jail");

if (!fs.existsSync("./tmp")) {
	fs.mkdirSync("./tmp");
}

const port = 5050;
const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.post("/compile", async (req, res) => {
	fs.writeFileSync(req.body.file, req.body.prog);
	compile_and_run(req.body.file).then(result => {
		res.send({
			result: result
		});
	}).catch(err => {
		res.send({
			result: String(err)
		});
	});

	//res.send("{}");
});

app.post("/run", async (req, res) => {

	console.log("Runnign command: " + req.body.cmd);
	//var result = execSync(req.body.cmd).toString();
	exec(do_jail(req.body.cmd), (error, stdout, stderr) => {
		if (Boolean(error)) {
			res.send({
				result: String(error)
			});
			return;
		}

		var text = ""

		if (stderr) {
			text += "STDERR: " + stderr.toString() + "\nSTDOUT: ";
		}
		res.send({
			result: text + stdout.toString()
		});
	});
});



app.post("/run-nojail", async (req, res) => {

	console.log("Runnign command: " + req.body.cmd);
	//var result = execSync(req.body.cmd).toString();
	exec(req.body.cmd, (error, stdout, stderr) => {
		if (Boolean(error)) {
			res.send({
				result: String(error)
			});
			return;
		}

		var text = ""

		if (stderr) {
			text += "STDERR: " + stderr.toString() + "\nSTDOUT: ";
		}
		res.send({
			result: text + stdout.toString()
		});
	});
});



app.listen(port, () => {
	console.log("compiler listening at http://localhost:" + port);
});