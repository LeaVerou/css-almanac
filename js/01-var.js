export default function compute() {

let ret = {
	properties: {},
	functions: {},
	supports: {},
	"pseudo-classes": {},
	fallback: {
		none: 0,
		literal: 0,
		var: 0
	}
};

walkRules(ast, rule => {
	for (let match of rule.supports.matchAll(/\(--(?<name>[\w-]+)\s*:/g)) {
		incrementByKey(ret.supports, match.groups.name);
	}
}, {type: "supports"});

let parsedSelectors = {};

walkDeclarations(ast, ({property, value}, rule) => {
	if (matches(value, /\bvar\(\s*--/)) {
		if (!property.startsWith("--")) {
			incrementByKey(ret.properties, property);
		}

		for (let call of extractFunctionCalls(value)) {
			if (call.name === "var") {
				let fallback = call.args.split(",").slice(1).join(",");

				if (matches(fallback, /\bvar\(\s*--/)) {
					ret.fallback.var++;
				}
				else if (fallback) {
					ret.fallback.literal++;
				}
				else {
					ret.fallback.none++;
				}
			}
			else if (call.args.includes("var(--")) {
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
