export default function compute() {

function walkElements(node, callback, parent) {
	if (Array.isArray(node)) {
		for (let n of node) {
			walkElements(n, callback, node);
		}
	}
	else {
		callback(node, parent);

		if (node.children) {
			walkElements(node.children, callback, node);
		}
	}
}

let ret = {

};

function countDependencyLength(declarations, property) {
	let o = declarations[property];

	if (o === undefined) {
		return 0;
	}

	if (!o.references || o.references.length === 0) {
		return 0;
	}

	let lengths = o.references.map(p => countDependencyLength(declarations, p));

	return 1 + Math.max(...lengths);
}

walkElements(vars.computed, (node, parent) => {
	if (node.declarations) {
		// Make inheritance explicit
		if (parent && parent.declarations) {
			for (let property in parent.declarations) {
				if (!(property in node.declarations)) {
					node.declarations[property] = Object.assign({inherited: true}, parent.declarations[property]);
				}
			}
		}

		for (let property in node.declarations) {

			let o = node.declarations[property];
			if (o.computed && o.computed.trim() === "initial" && o.value.trim() !== "initial") {
				// Cycle or missing ref
				incrementByKey(ret, "initial");
			}
			else if (o.references) {
				let depth = countDependencyLength(node.declarations, property);
				incrementByKey(ret, depth);
			}
		}
	}
});

return ret;

}
