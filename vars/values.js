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
	values: {},
	types: {},
	properties: {}
};

const propertyTypes = {
	"color": "color",
	"width": "length",
	"background-image": "image",
	"content": "string"
};

walkElements(vars.computed, node => {
	if (node.declarations) {
		for (let property in node.declarations) {
			let value;
			let o = node.declarations[property];

			if (property.startsWith("--")) {
				// Custom property set to a value that doesn't depend on other variables
				value = o.computed || o.value;
				value = value.trim(); // whitespace is prserved in custom props
			}
			else {
				incrementByKey(ret.properties, property);

				if (o.references) {
					let varCall = extractFunctionCalls(o.value, {names: "var"});

					if (varCall.length === 1 && varCall[0].pos[1] === o.value.length) {
						// The entire value is one var() call
						value = o.computed || o.value;
					}
				}
			}

			if (value) {
				incrementByKey(ret.values, value);

				// What type of value is it?
				let type;

				for (let property in propertyTypes) {
					if (CSS.supports(property, value)) {
						type = propertyTypes[property];
						break;
					}
				}

				if (!type) {
					if (CSS.supports("font-family", value) && /^font(-family)$/.test(property)) {
						type = "font_stack";
					}
				}

				if (type) {
					incrementByKey(ret.types, type);
				}
			}
		}
	}
});

for (let type in ret) {
	ret[type] = sortObject(ret[type]);
}

return ret;

}
