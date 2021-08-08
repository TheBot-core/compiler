const { execSync } = require('child_process');
const Util = require('./util');

const { do_jail, do_filter } = require("./jail");

async function compile_and_run(what) {
	const compilers = Util.readConfigSync("compiler");

	do_filter(what);

	for (i in compilers) {
		if (what.endsWith(compilers[i].file_extension, what.length)) {
			console.log(i);
			const comp = compilers[i];

			if (comp.is_interpreted) {
				var exec_cmd = i + " /compiler/" + comp.flags;
				exec_cmd = exec_cmd.replace(/%in%/g, what);
				console.log("Compiler run: " + exec_cmd);
				var res = execSync(do_jail(exec_cmd)).toString();

				console.log("Compiler result: " + res);

				return res;
			} else {
				// compile file to object or executable
				var step0_cmd = i + " " + comp.flags;
				step0_cmd = step0_cmd.replace(/%in%/g, what);
				step0_cmd = step0_cmd.replace(/%out%/g, what + ".elf");
				console.log("Compiler step 0: " + step0_cmd);
				execSync(step0_cmd);

				// link file to executable if necessary
				var step1_cmd = comp.post_compile;
				step1_cmd = step1_cmd.replace(/%in%/g, what);
				step1_cmd = step1_cmd.replace(/%out%/g, what + ".elf");
				console.log("Compiler step 1: " + step1_cmd);
				execSync(step1_cmd);

				// execute file
				var res = execSync(do_jail("/compiler/" + what + ".elf")).toString();

				console.log("Compiler result: " + res);

				// cleanup
				var cleanup_cmd = comp.cleanup;
				cleanup_cmd = cleanup_cmd.replace(/%in%/g, what);
				cleanup_cmd = cleanup_cmd.replace(/%out%/g, what + ".elf");
				console.log("Compiler cleanup 1: " + cleanup_cmd);
				execSync(cleanup_cmd);

				return res;
			}
		}
	}
	throw new Error("No matching compiler found!");
}

exports.compile_and_run = compile_and_run;