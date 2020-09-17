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
	let tokens = parsel.tokenize(selector);

	let first = tokens[0];

	if (first.type === "pseudo-class" && first.name === "root") {
		ret.root_descendant++;
	}
	else if (first.type === "type" && first.name === "html") {
		ret.html_descendant++;
	}
	else if (first.type === "pseudo-class" && first.name === "not" && first.argument.startsWith("#")) {
		ret.not_id_descendant++;
	}

	// Is it BEM?
	// We only count "hardcore" BEM for this metric, with no nesting.
	if (sast.type === "compound") {
		// Only one BEM class, and pseudos
		let nonPseudos = sast.list.filter(node => !node.type.startsWith("pseudo-"));

		if (nonPseudos.length === 1 && nonPseudos[0].type === "class" && bem.test(nonPseudos[0].name)) {
			ret.bem++;
		}
	}
	else if (sast.type === "class" && bem.test(sast.name)) {
		ret.bem++;
	}

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
	});
});

return ret;

}
