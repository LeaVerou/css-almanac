export default function compute() {

let ret = {

};

walkDeclarations(ast, ({property, value}) => {
	for (let area of value.matchAll(/(['"])(?<names>[-\w\s.]+?)\1/g)) {
		let names = area.groups.names.split(/\s+/);

		for (let name of names) {
			incrementByKey(ret, name);
		}
	}
}, {
	properties: /^grid(-template(-areas)?)?$/
});

ret = sortObject(ret);

return ret;

}
