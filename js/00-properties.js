export default function compute() {

let ret = {};

walkDeclarations(ast, ({property, value}) => {
	if (!property.startsWith("--")) { // Custom props are case sensitive
		property = property.toLowerCase();
	}

	incrementByKey(ret, property);
});

return sortObject(ret);

}
