export default function compute() {

let ret = {
	properties: [],
	timingFunctions: new Set(),
	animationNames: new Set()
};

walkDeclarations(ast, ({property, value}) => {
	if (["inherit", "initial", "unset", "revert"].includes(value)) {
		return;
	}
	
	if (property === "transition-property") {
		ret.properties.add(value);
	}
	else if (property === "transition-timing-functon") {
		let name = value.match(/^[a-z-]+)/)[0];
		ret.timingFunctions
	}
	else if (property === "transition") {
		// Extract property name and timing function
		let keywords = (value.match(/(^|\s)(d|r|[cr]?x|[cr]?y|[a-z-]{3,})(?=\s|$)/) || []);
		let properties = [], easings = [];

		for (let keyword of keywords) {

		}
						// Drop timing functions and global values
		                 .filter(p => !/^(?:ease(-in|-out)?|)$/.test(p));
		ret.properties.push(...properties);
	}
}, {
	properties: /^(transition|animation)(?=$|-)/g
})

// Animation names
walkRules(ast, rule => {
	ret.animationNames.add(rule.name);
}, {type: "keyframes"});

ret.properties = [...new Set(ret.properties)];
ret.animationNames = [...ret.animationNames];

return ret;

}
