// Measure flex-grow: 0 and flex-shrink: 0, both as longhands and in the flex shorthand,
// in rules where either flex-basis is set in percentages (individually or via flex)
// or width is set to percentages and flex-basis is auto.

let gridlikeFlex = walkRules(ast, rule => {
	let d = Object.fromEntries(rule.declarations.map(d => [d.property, d.value]));

	if (d["flex-grow"] === "0" && d["flex-shrink"] === "0" || /^0 0($|\s)/.test(d.flex)) {
		if (/%$/.test(d["flex-basis"]) || /%$/.test(d.flex) || /%$/.test(d.width) && (!d["flex-basis"] || d["flex-basis"] === "auto")) {
			return true; // break
		}
	}
}, {rules: r => r.type === "rule"}) || false;
