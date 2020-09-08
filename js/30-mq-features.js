// Returns object literal of MQ features and usage count
export default function compute() {
	let ret = {};

	walkRules(ast, rule => {
		console.log(rule.media);
		let features = rule.media
							.replace(/\s+/g, "")
							.match(/\([\w-]+(?=[:\)])/g)
							?.map(s => s.slice(1));

		if (features) {
			for (let feature of features) {
				ret[feature] = (ret[feature] || 0) + 1;
			}
		}
	}, {rules: r => r.type === "media"});

	return ret;
}
