export default function compute() {

let ret = {
	bem: 0,
	attribute_id: 0,
	duplicate_classes: 0,
	root_descendant: 0,
	html_descendant: 0,
	not_id_descendant: 0,
};

const bem = /^(?=.+--|.+__)[a-z0-9-]+(__[\w-]+)?(--[\w-]+)?$/i;

walkSelectors(ast, selector => {
	let sast = parsel.parse(selector, {list: false, recursive: false});

	parsel.walk(sast, (node, parent) => {
		if (node.type === "attribute" && node.name === "id" && node.operator === "=") {
			ret.attribute_id++;
		}
		else if (node.type === "compound") {
			// Look for duplicate classes
			let classes = new Set();

			for (let s of node.list) {
				if (s.type === "class") {
					if (classes.has(s.name)) {
						// Found a duplicate class
						ret.duplicate_classes++;
						break;
					}

					classes.add(s.name);
				}
			}
		}
		else if (!parent && node.type === "complex") {
			let first = node;
			// Find the firstmost compound
			while ((first = first.left) && first.type === "complex");

			if (first.combinator === " ") {
				first = first.left;
			}

			if (first.type === "pseudo-class" && first.name === "root") {
				ret.root_descendant++;
			}
			else if (first.type === "type" && first.name === "html") {
				ret.html_descendant++;
			}
			else if (first.type === "pseudo-class" && first.name === "not" && first.argument.startsWith("#")) {
				ret.not_id_descendant++;
			}
		}
		else if (node.type === "class" && (!parent || parent.type === "complex" && parent.combinator === " ")) {
			if (bem.test(node.name)) {
				ret.bem++;
			}
		}
	}, {subtree: true});
});

return ret;

}
