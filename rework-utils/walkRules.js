// Recursively walk all rules with selectors
export default function walkRules(rules, callback) {
	if (!rules) {
		return;
	}

	for (let rule of rules) {
		if (rule.type === "rule" && rule.selectors && rule.declarations) {
			callback(rule);
		}

		if (rule.rules) {
			walkRules(rule.rules, callback);
		}
	}
}
