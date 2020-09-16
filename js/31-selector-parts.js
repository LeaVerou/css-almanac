export default function compute() {

let ret = {
	class: {},
	id: {},
	attribute: {},
	"pseudo-class": {},
	"pseudo-element": {}
};

walkSelectors(ast, selector => {
	let sast = parsel.parse(selector, {list: false});

	parsel.walk(sast, node => {
		if (node.type in ret) {
			incrementByKey(ret[node.type], node.name);
		}
	}, {subtree: true});
});

for (let type in ret) {
	ret[type] = sortObject(ret[type]);
}

return ret;

}
