export default function compute() {

let ret = {};

walkDeclarations(ast, ({property, value}) => {
	let key = value;

	ret[value] = ret[value] || {};

	incrementByKey(ret[value], "total");
	incrementByKey(ret[value], property);
}, {
	values: ["inherit", "initial", "unset", "revert"]
});

for (let keyword in ret) {
	ret[keyword] = sortObject(ret[keyword]);
}

return ret;

}
