// Recursively walk all "normal" rules, i.e. rules with selectors
export default function walkRules(rules, callback, test = () => true) {
	if (!rules) {
		return;
	}

	for (let rule of rules) {
		if (test(rule)) {
			callback(rule);
		}

		if (rule.rules) {
			walkRules(rule.rules, callback);
		}
	}
}
