export default function compute() {

let ret = {};

walkRules(ast, rule => {
	incrementByKey(ret, "total");

	let condition = rule.supports;

	// Drop whitespace around parens
	condition = condition.replace(/\s*\(\s*/g, "(").replace(/\s*\)\s*/g, ")");

	// Match property: value queries first
	for (let match of condition.matchAll(/\([\w-]+\s*:/g)) {
		let arg = parsel.gobbleParens(condition, match.index);
		incrementByKey(ret, arg);
	}

	// Then find selector queries
	for (let match of condition.matchAll(/selector\(/gi)) {
		let arg = parsel.gobbleParens(condition, match.index + match[0].length - 1);
		incrementByKey(ret, "selector" + arg);
	}
}, {type: "supports"});

ret = sortObject(ret);

return ret;

}
