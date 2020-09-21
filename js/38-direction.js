export default function compute() {

let ret = {
	html: {},
	body: {},
	other: {}
};

walkDeclarations(ast, ({value}, rule) => {
	if (rule.selectors) {
		for (let selector of rule.selectors) {
			let sast = parsel.parse(selector, {list: false});

			let node = sast.type === "complex"? sast.right : sast;
			let list = node.type === "compound"? node.list : [node];
			if (list.find(n => n.content === "html" || n.content === ":root")) {
				incrementByKey(ret.html, value);
			}
			else if (list.find(n => n.content === "body")) {
				incrementByKey(ret.body, value);
			}
			else {
				incrementByKey(ret.other, value);
			}
		}
	}
}, {properties: "direction"});

for (let type in ret) {
	ret[type].total = sumObject(ret[type]);
}

return ret;

}
