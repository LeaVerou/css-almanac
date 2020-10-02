export default function compute() {

let ret = {
	properties: {},
	functions: {},
	supports: {},
	"pseudo-classes": {}
};

walkRules(ast, rule => {
	for (let match of rule.supports.matchAll(/\(--(?<name>[\w-]+)\s*:/g)) {
		incrementByKey(ret.supports, match.groups.name);
	}
}, {type: "supports"});

let parsedSelectors = {};

walkDeclarations(ast, ({property, value}, rule) => {
	if (matches(value, /var\(\s*--/)) {
		if (!property.startsWith("--")) {
			incrementByKey(ret.properties, property);
		}

		for (let call of extractFunctionCalls(value)) {
			if (call.name !== "var" && call.args.includes("var(--")) {
				incrementByKey(ret.functions, call.name);
			}
		}
	}

	if (property.startsWith("--") && rule.selectors) {
		for (let selector of rule.selectors) {
			let sast = parsedSelectors[selector] = parsedSelectors[selector] || parsel.parse(selector);
			parsel.walk(sast, node => {
				if (node.type === "pseudo-class") {
					incrementByKey(ret["pseudo-classes"], node.name);
				}
			})
		}
	}
});

for (let type in ret) {
	ret[type] = sortObject(ret[type]);
}

return ret;

}
