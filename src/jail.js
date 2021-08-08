var default_jail = [
	"-l 0",
	"-Mo",
	"--user 0",
	"--group 99999",
	"-R /bin/",
	"-R /lib",
	"-R /usr/",
	"-R /sbin/",
	"-R /compiler/tmp/",
	"-T /dev/",
	"--keep_caps"
];

var filter = [
	"$",
	"(",
	")",
	"'",
	"\"",
	"|",
	"<",
	">",
	"`",
	"/",
	"\\"
];

function do_filter(str) {
	for (i in filter) {
		if (str.indexOf(filter[i]) != -1) {
			throw new Error("This looks like code injection don't do that owo!");
		}
	}
}

function do_jail(command) {
	command = command.replace(/\'/g, "\"");
	var cmd = "echo \'" + command + "\' | /bin/nsjail " + default_jail.join(" ") + " -- /bin/bash";
	return cmd;
}

exports.do_jail = do_jail;
exports.do_filter = do_filter;