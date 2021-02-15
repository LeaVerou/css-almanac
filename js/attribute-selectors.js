export default function compute() {

let ret = {
	total: 0,
	operators: {},
	caseSensitive: {}
};

walkSelectors(ast, selector => {
	let sast = parsel.parse(selector, {list: false});

	parsel.walk(sast, node => {
		if (node.type === "attribute") {
			ret.total++;
			incrementByKey(ret.operators, node.operator);

			if (ret.caseSensitive) {
				incrementByKey(ret.caseSensitive, node.caseSensitive);
			}
		}
	}, {subtree: true});
});

ret.operators = sortObject(ret.operators);

return ret;

}
