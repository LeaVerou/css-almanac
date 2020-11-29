export default function compute() {

let ret = {total: 0};

let unique = new Set();

walkDeclarations(ast, ({property, value}) => {
	if (!property.startsWith("--")) { // Custom props are case sensitive
		property = property.toLowerCase();
	}

	ret.total++;
	unique.add(`${property}: ${value}`);
});

ret.unique = unique.size;
ret.ratio = ret.unique / ret.total;

return ret;

}
