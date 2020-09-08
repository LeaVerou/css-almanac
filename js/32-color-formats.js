let usage = {
	hex: {},
	functions: {}
	keywords: {},
	args: {commas: 0, nocommas: 0},
	spaces: {},
	inSRGBGamut: {in: 0, out: 0}
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
const functionNameRegex = /(?<name>rgba?|hsla?|color|lab|lch|hwb)\\(/gi;

function countMatches(haystack, needle) {
	let ret = 0;

	haystack.replaceAll(needle, r => {
		ret++;
		return r;
	});
	return ret;
}

walkDeclarations(ast, ({property, value}) => {
	usage.hex = {
		"3": countMatches(value, /#[a-f0-9]{3}\b/gi),
		"4": countMatches(value, /#[a-f0-9]{4}\b/gi),
		"6": countMatches(value, /#[a-f0-9]{6}\b/gi),
		"8": countMatches(value, /#[a-f0-9]{8}\b/gi)
	};

	for (let match of value.matchAll(functionNameRegex)) {
		let {index, groups} = match;
		let paren = index + match[0].length;
		let args = parsel.gobbleParens(value, index).slice(1, -1).trim();

		usage.functions[name] = (usage.functions[name] || 0) + 1;
		usage[(args.indexOf(",") > -1? "" : "no") + "commas"]++;

		if (name === "color") {
			// Let's look at color() more closely
			let g = args.match(/^(?<name>[\w-]+)\s+(?<params>.+)$/)?.groups;

			if (g) {
				let {space, params} = g;

				usage.spaces[space] = (usage.spaces[space] || 0) + 1;

				if (/^[\d.+%\s]+$/.test(params)) {
					let percents = params.indexOf("%") > -1;
					let coords = params.trim().split(/\s+/).map(c => parseFloat(percents) / (percents? 100 : 1));

					usage.inSRGBGamut[inSRGBGamut(space, coords)? "in" : "out"]++;
				}
			}
		}
	}

	value.match(keywordRegex).forEach(k => usage.keywords[k] = (usage.keywords[k] || 0) + 1);
}, {
	properties: /color$|^border|^background(-image)?$|\-shadow$|filter$/
});

function inSRGBGamut(space, coords) {
	// TODO implement this
	return true;
}
