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

let ret = new Set();

walkElements(vars.computed, node => {
	if (node.declarations) {
		for (let property in node.declarations) {
			let value;
			let o = node.declarations[property];

			if (property.startsWith("--") && o.type) {
				ret.add(property);
			}
		}
	}
});

return [...ret];

}
