const fetch = require("node-fetch");

async function test() {
	const data_fetched = await fetch("http://localhost:5050/compile", {
		method: "POST",
		body: JSON.stringify({
			prog: "console.log(\"hello\");",
			file: "test.js"
		}),
		headers: {
			"Content-Type": "application/json"
		}
	});
	console.log(await data_fetched.json());
}

test();