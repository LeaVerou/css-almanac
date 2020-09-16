export default function compute() {

let ret = {
	total: 0,
	important: 0,
	properties: {}
};

walkDeclarations(ast, ({property, important}) => {
	ret.total++;

	if (important) {
		ret.important++;
		incrementByKey(ret.properties, property);
	}
});

ret.properties = sortObject(ret.properties);

return ret;

}
