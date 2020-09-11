export default function compute() {
// Returns object of paint worklet names.
// Object.keys(ret).length > 0 can give us a plain boolean on whether the Paint API is used on the website.
let ret = {};

walkDeclarations(ast, ({property, value}) => {
	for (let paint of extractFunctionCalls(value, {names: "paint"})) {
		let name = paint.args.match(/^[-\w+]+/)[0];

		if (name) {
			incrementByKey(ret, name);
		}
	}
}, {
	properties: /^--|-image$|^background$|^content$/,
	values: /\bpaint\(/
});

return sortObject(ret);

}
