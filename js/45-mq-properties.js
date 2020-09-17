export default function compute() {

let ret = {};

walkRules(ast, rule => {
	walkDeclarations(rule.rules, ({property, value}) => {
		incrementByKey(ret, property);
	});
}, {
	type: "media"
});

return sortObject(ret);

}
