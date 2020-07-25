// Rework utility to recursively walk all declarations
export default function walkDeclarations(rules, callback) {
	if (!rules) {
		return;
	}

	for (let rule of rules) {
		if (rule.declarations) {
			for (let declaration of rule.declarations) {
				callback(declaration, rule);
			}
		}

		if (rule.rules) {
			walkDeclarations(rule.rules, callback);
		}
	}
}
