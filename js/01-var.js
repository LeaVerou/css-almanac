export default function compute() {

let ret = {
	properties: {},
	functions: {},
	supports: {}
};

walkRules(ast, rule => {
	for (let match of rule.supports.matchAll(/\(--(?<name>[\w-]+)\s*:/g)) {
		incrementByKey(ret.supports, match.groups.name);
	}
}, {type: "supports"});

walkDeclarations(ast, ({property, value}) => {
	if (!property.startsWith("--")) {
		incrementByKey(ret.properties, property);
	}

	for (let call of extractFunctionCalls(value)) {
		if (call.name !== "var" && call.args.includes("var(--")) {
			incrementByKey(ret.functions, call.name);
		}
	}

}, {values: /var\(\s*--/});

for (let type in ret) {
	ret[type] = sortObject(ret[type]);
}

return ret;

}
