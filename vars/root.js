export default function compute() {

function walkElements(node, callback) {
	if (Array.isArray(node)) {
		for (let n of node) {
			walkElements(n, callback);
		}
	}
	else {
		callback(node);

		if (node.children) {
			walkElements(node.children, callback);
		}
	}
}

let ret = {
	root: 0,
	body: 0,
	descendants: 0
};

walkElements(vars.computed, node => {
	if (node.declarations) {
		for (let property in node.declarations) {
			let value;
			let o = node.declarations[property];

			if (property.startsWith("--")) {
				if (/^HTML\b/.test(node.element)) {
					ret.root++;
				}
				else if (/^BODY\b/.test(node.element)) {
					ret.body++;
				}
				else {
					ret.descendants++;
				}
			}
		}
	}
});

return ret;

}
