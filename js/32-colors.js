export default function compute() {

let usage = {
	hex: {
		"3": 0, "4": 0,
		"6": 0, "8": 0
	},
	functions: {},
	keywords: {},
	args: {commas: 0, nocommas: 0},
	spaces: {},
	p3: {sRGB_in: 0, sRGB_out: 0}
};

const keywords = [
	"aliceblue","antiquewhite","aqua","aquamarine","azure","beige","bisque","black","blanchedalmond","blue","blueviolet","brown","burlywood","cadetblue","chartreuse",
	"chocolate","coral","cornflowerblue","cornsilk","crimson","cyan","darkblue","darkcyan","darkgoldenrod","darkgray","darkgreen","darkgrey","darkkhaki","darkmagenta",
	"darkolivegreen","darkorange","darkorchid","darkred","darksalmon","darkseagreen","darkslateblue","darkslategray","darkslategrey","darkturquoise","darkviolet",
	"deeppink","deepskyblue","dimgray","dimgrey","dodgerblue","firebrick","floralwhite","forestgreen","fuchsia","gainsboro","ghostwhite","gold","goldenrod","gray",
	"green","greenyellow","grey","honeydew","hotpink","indianred","indigo","ivory","khaki","lavender","lavenderblush","lawngreen","lemonchiffon","lightblue","lightcoral",
	"lightcyan","lightgoldenrodyellow","lightgray","lightgreen","lightgrey","lightpink","lightsalmon","lightseagreen","lightskyblue","lightslategray","lightslategrey",
	"lightsteelblue","lightyellow","lime","limegreen","linen","magenta","maroon","mediumaquamarine","mediumblue","mediumorchid","mediumpurple","mediumseagreen",
	"mediumslateblue","mediumspringgreen","mediumturquoise","mediumvioletred","midnightblue","mintcream","mistyrose","moccasin","navajowhite","navy","oldlace",
	"olive","olivedrab","orange","orangered","orchid","palegoldenrod","palegreen","paleturquoise","palevioletred","papayawhip","peachpuff","peru","pink","plum",
	"powderblue","purple","rebeccapurple","red","rosybrown","royalblue","saddlebrown","salmon","sandybrown","seagreen","seashell","sienna","silver","skyblue",
	"slateblue","slategray","slategrey","snow","springgreen","steelblue","tan","teal","thistle","tomato","turquoise","violet","wheat","white","whitesmoke",
	"yellow","yellowgreen","transparent","currentcolor"
];

// Lookbehind to prevent matching on e.g. var(--color-red)
const keywordRegex = RegExp(`\\b(?<!\-)(?:${keywords.join("|")})\\b`, "gi");
const functionNames = /^(?:rgba?|hsla?|color|lab|lch|hwb)$/gi;

function countMatches(haystack, needle) {
	let ret = 0;

	haystack.replaceAll(needle, r => {
		ret++;
		return r;
	});
	return ret;
}

// Is a P3 color within sRGB?
function P3inSRGB(coords) {
// given an array of display-p3 RGB values in range [0-1],
// return true if inside sRGB gamut
	let srgb = lin_P3_to_sRGB(linearize_p3(coords));
	// Note, we don't need to apply the sRGB transfer function
	// because it does not affect whether a value is out of gamut
	return srgb.every(c => c >= 0 && c <= 1);
}

function linearize_p3 (P3) {
// given an array of display-p3 RGB values in range [0-1],
// undo gamma correction to get linear light values
	return P3.map(function (val) {
	if (val < 0.04045) {
		return val / 12.92;
	}
	return Math.pow((val + 0.055) / 1.055, 2.4);
	});
}

function lin_P3_to_sRGB (linP3) {
// given an array of linear-light display-p3 RGB values in range [0-1],
// convert to CIE XYZ and then to linear-light sRGB
// The two linear operations are combined into a single matrix.
// The matrix multiply is hard-coded, for efficiency
	let [r, g, b] = linP3;
	return [
		1.2247452561927687 * r + -0.22490435913073928 * g + 1.8500279863609137e-8 * b,
		-0.04205792199232122 * r + 1.0420810071506164 * g + -1.585738278880866e-8 * b,
		-0.019642279587426013 * r + -0.07865491660582305 * g + 1.098537193883219 * b
    ];
}

walkDeclarations(ast, ({property, value}) => {
	usage.hex[3] += countMatches(value, /#[a-f0-9]{3}\b/gi);
	usage.hex[4] += countMatches(value, /#[a-f0-9]{4}\b/gi);
	usage.hex[6] += countMatches(value, /#[a-f0-9]{6}\b/gi);
	usage.hex[8] += countMatches(value, /#[a-f0-9]{8}\b/gi);

	for (let f of extractFunctionCalls(value, {names: functionNames})) {
		let {name, args} = f;

		incrementByKey(usage.functions, name);
		incrementByKey(usage.args, (args.indexOf(",") > -1? "" : "no") + "commas");

		if (name === "color") {
			// Let's look at color() more closely
			let match = args.match(/^(?<space>[\w-]+)\s+(?<params>.+)$/);

			if (match) {
				let {space, params} = match.groups;

				incrementByKey(usage.spaces, space);

				if (/^[\d.+%\s]+$/.test(params) && space === "display-p3") {
					let percents = params.indexOf("%") > -1;
					let coords = params.trim().split(/\s+/).map(c => parseFloat(percents) / (percents? 100 : 1));

					usage.p3["sRGB_" + (P3inSRGB(coords)? "in" : "out")]++;
				}
			}
		}
	}

	value.match(keywordRegex)?.forEach(k => incrementByKey(usage.keywords, k));
	usage.keywords = sortObject(usage.keywords);
}, {
	properties: /^--|color$|^border|^background(-image)?$|\-shadow$|filter$/
});

return usage;

}
