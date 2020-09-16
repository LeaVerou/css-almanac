export default function compute() {

let ret = {
	class: {},
	id: {},
	attribute: {}
};

walkSelectors(ast, selector => {
	let sast = parsel.parse(selector, {list: false});

	parsel.walk(sast, node => {
		if (node.type === "id" || node.type === "class" || node.type === "attribute") {
			incrementByKey(ret[node.type], node.name);
		}
	}, {subtree: true});
});

for (let type in ret) {
	ret[type] = sortObject(ret[type]);
}

return ret;

}
