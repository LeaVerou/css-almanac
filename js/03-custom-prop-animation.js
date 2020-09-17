export default function compute() {

let ret = new Set();

walkRules(ast, rule => {
	walkDeclarations(rule.keyframes, ({property, value}) => {
		ret.add(property);
	}, {
		properties: /^--/
	});
}, {
	type: "keyframes"
});

return [...ret];

}
