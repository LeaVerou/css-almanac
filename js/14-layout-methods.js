export default function compute() {

let ret = {};

walkDeclarations(ast, ({property, value}) => {
	let key;

	if (property === "float") {
		key = "floats";
	}
	else if (/^table(-|$)/.test(value)) {
		key = "css-tables";
	}
	else {
		key = value.replace(/-(webkit|moz|o|webkit|khtml)-|!.+$/g, "").toLowerCase();
	}

	incrementByKey(ret, key);
}, {
	properties: ["display", "position", "float"],
	not: {
		values: [
			"inherit", "initial", "unset", "revert",
			/\bvar\(--/,
			"static", "relative", "none"
		]
	}
});

ret = sortObject(ret);

return ret;

}
