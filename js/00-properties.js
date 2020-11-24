export default function compute() {

let ret = {};

walkRules(ast, rule => {
	walkDeclarations(rule.rules, ({property, value}) => {
		incrementByKey(ret, property);
	});
});

return sortObject(ret);

}
