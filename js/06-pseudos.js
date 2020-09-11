export default function compute() {

let ret = {
	pseudoClasses: {},
	pseudoEls: {}
};

walkRules(ast, rule => {
	let pseudos = rule.selectors.flatMap(r => r.match(/::?[\w-]+/g) || []);

	for (let pseudo of pseudos) {
		let type = "pseudo" + (pseudo.indexOf("::") === 0? "Els" : "Classes");
		incrementByKey(ret[type], pseudo);
	}
}, {rules: r => r.type === "rule"});

ret.pseudoClasses = sortObject(ret.pseudoClasses);
ret.pseudoEls = sortObject(ret.pseudoEls);

return ret;

}
