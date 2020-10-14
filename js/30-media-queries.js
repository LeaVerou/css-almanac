// Returns object literal of MQ features and usage count
export default function compute() {
	let ret = {};

	walkRules(ast, rule => {
		let queries = rule.media
							.replace(/\s+/g, "")
							.match(/\(.+?\)/g);

		if (queries) {
			for (let query of queries) {
				incrementByKey(ret, query);
			}
		}
	}, {type: "media"});

	return ret;
}
