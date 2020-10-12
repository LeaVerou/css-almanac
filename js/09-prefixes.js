export default function compute() {
	let ret = {
		pseudo_classes: {},
		pseudo_elements: {},
		properties: {},
		functions: {},
		keywords: {},
		media: {}
	};

	walkRules(ast, rule => {
		// Prefixed pseudos
		if (rule.selectors) {
			let pseudos = rule.selectors.flatMap(r => r.match(/::?-[a-z]+-[\w-]+/g) || []);

			for (let pseudo of pseudos) {
				let type = "pseudo_" + (pseudo.indexOf("::") === 0? "elements" : "classes");
				incrementByKey(ret[type], pseudo);
			}
		}

		if (rule.declarations) {
			walkDeclarations(rule, ({property, value}) => {
				// Prefixed properties
				if (/^-[a-z]+-.+/.test(property)) {
					incrementByKey(ret.properties, property);
				}

				// -prefix-function()
				for (let call of extractFunctionCalls(value, {names: /^-[a-z]+-.+/})) {
					incrementByKey(ret.functions, call.name);
				}

				// Prefixed keywords
				for (let k of value.matchAll(/(?<![-a-z])-[a-z]+-[a-z-]+(?=;|\s|,|\/)/g)) {
					incrementByKey(ret.keywords, k);
				}
			});
		}

		// Prefixed media features
		if (rule.media) {
			let features = rule.media
								.replace(/\s+/g, "")
								.match(/\(-[a-z]+-[\w-]+(?=[:\)])/g);

			if (features) {
				features = features.map(s => s.slice(1));

				for (let feature of features) {
					incrementByKey(ret.media, feature);
				}
			}
		}


	});

	for (let type in ret) {
		ret[type] = sortObject(ret[type]);
	}

	return ret;
}
