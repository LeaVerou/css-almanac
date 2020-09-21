export default function compute() {

let ret = {
	total: 0,
	properties: {},
	units: {},
	number_of_different_units: {},
	operators: {},
	number_of_operators: {},
	number_of_parens: {},
	constants: new Set()
};

walkDeclarations(ast, ({property, value}) => {
	for (let calc of extractFunctionCalls(value, {names: "calc"})) {
		incrementByKey(ret.properties, property);
		ret.total++;

		let args = calc.args.replace(/calc\(/g, "(");

		let units = args.match(/[a-z]+|%/g) || [];
		units.forEach(e => incrementByKey(ret.units, e));
		incrementByKey(ret.number_of_different_units, new Set(units).size);

		let ops = args.match(/[-+\/*]/g) || [];
		ops.forEach(e => incrementByKey(ret.operators, e));
		incrementByKey(ret.number_of_operators, ops.length);

		let parens = args.match(/\(/g) || [];
		incrementByKey(ret.number_of_parens, parens.length);

		if (units.length === 0) {
			ret.constants.add(args);
		}
	}
}, {
	values: /calc\(/,
	not: {
		values: /var\(--/
	}
});

ret.constants = [...ret.constants];

for (let type in ret) {
	if (ret[type].constructor === Object) {
		ret[type] = sortObject(ret[type]);
	}
}

return ret;

}
