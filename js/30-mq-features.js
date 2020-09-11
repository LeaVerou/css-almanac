// Returns object literal of MQ features and usage count
export default function compute() {
	let ret = {};

	walkRules(ast, rule => {
		let features = rule.media
							.replace(/\s+/g, "")
							.match(/\([\w-]+(?=[:\)])/g)
							?.map(s => s.slice(1));

		if (features) {
			for (let feature of features) {
				incrementByKey(ret, feature);
			}
		}
	}, {rules: r => r.type === "media"});

	return ret;
}
