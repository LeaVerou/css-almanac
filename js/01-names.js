// This is not an actual metric. In Web Almanac, this is computed from the custom metric, not the AST
export default function compute() {

let ret = {
	set: {},
	get: {}
};

walkDeclarations(ast, ({property, value}) => {
	if (property.startsWith("--")) {
		incrementByKey(ret.set, property);
	}

	for (let varCall of value.matchAll(/var\((--[\w-]+)/g)) {
		incrementByKey(ret.get, varCall[1]);
	}
}, {

});

ret.set = sortObject(ret.set);
ret.get = sortObject(ret.get);

return ret;

}
