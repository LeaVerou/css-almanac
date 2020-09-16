export default function compute() {

let ret = {
	byProperty: {}
};

const lengths = /(?<!-)\b(?<number>-?\d*\.?\d+)(?<unit>%|[a-z]{1,4}\b|(?=\s|$|,|\*|\/)\b)/gi;

walkDeclarations(ast, ({property, value}) => {
	for (let length of value.matchAll(lengths)) {
		let {number, unit} = length.groups;
		ret.byProperty[property] = ret.byProperty[property] || {};

		if (unit) {
			incrementByKey(ret, unit);
			incrementByKey(ret.byProperty[property], unit);
		}
		else {
			if (number === "0") {
				// Unitless 0
				incrementByKey(ret, "0");
				incrementByKey(ret.byProperty[property], "0");
			}
			else {
				incrementByKey(ret, "<number>");
				incrementByKey(ret.byProperty[property], "<number>");
			}
		}

		incrementByKey(ret, "total"); // for calculating %
		incrementByKey(ret.byProperty[property], "total"); // for calculating %
	}
}, {
	// Properties that take one or more lengths
	// We avoid shorthands because they're a mess to parse
	// This helped: https://codepen.io/leaverou/pen/rNergbW?editors=0010
	properties: [
		"baseline-shift",
		"vertical-align",
		/^column[s-]|^inset\b/g,
		"contain-intrinsic-size",
		"cx",
		"cy",
		"flex",
		"flex-basis",
		"letter-spacing",
		"perspective",
		"perspective-origin",
		"r",
		"row-gap",
		"rx",
		"ry",
		"tab-size",
		"text-indent",
		"translate",
		"vertical-align",
		"word-spacing",
		"x",
		"y",
		/\b(?:width|height|thickness|offset|origin|padding|border|margin|outline|top|right|bottom|left|(inline|block)-(start|end)|gap|size|position)\b/g
	],
	not: {
		// Drop prefixed properties and custom properties
		properties: /^-/
	}
});

ret = sortObject(ret);

for (let property in ret.byProperty) {
	ret.byProperty[property] = sortObject(ret.byProperty[property]);
}

return ret;

}
