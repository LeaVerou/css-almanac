export default function compute() {

let ret = {};

walkDeclarations(ast, ({property, value}) => {
	if (!value.includes("(") || !value.includes(")")) {
		return;
	}

	for (let {name} of extractFunctionCalls(value)) {
		incrementByKey(ret, name);
	}
});

return sortObject(ret);

}
