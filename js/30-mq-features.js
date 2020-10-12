// Returns object literal of MQ features and usage count
export default function compute() {
	let ret = {};

	walkRules(ast, rule => {
		let features = rule.media
							.replace(/\s+/g, "")
							.match(/\([\w-]+(?=[:\)])/g);

		if (features) {
			features = features.map(s => s.slice(1));
			
			for (let feature of features) {
				incrementByKey(ret, feature);
			}
		}
	}, {type: "media"});

	return ret;
}
