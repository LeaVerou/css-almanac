export default function compute() {

let ret = {
	logical: {},
	physical: {}
};


walkDeclarations(ast, ({property, value}) => {
	let isLogical = property.match(/\b(block|inline|start|end)\b/);
	let obj = ret[isLogical? "logical" : "physical"];

	let size = property.match(/^(min-|max-)?((block|inline)-size|width|height)$/);

	if (size) {
		incrementByKey(obj, (size[1] || "") + "size");
		return;
	}

	let borderRadius = property.match(/^border-([a-z]-)?radius$/);

	if (borderRadius) {
		incrementByKey(obj, "border-radius");
	}

	let boxModel = property.match(/^(border|margin|padding)(?!-width|-style|-color|$)\b/);

	if (boxModel) {
		incrementByKey(obj, boxModel[1]);
	}

	if (/^overflow-/.test(property)) {
		incrementByKey(obj, "overflow");
	}

	if (matches(property, [/^inset\b/, "top", "right", "bottom", "left"])) {
		incrementByKey(ret[property.startsWith("inset")? "logical" : "physical"], "inset");
	}

	if (matches(property, ["clear", "float", "caption-side", "resize", "text-align"])) {
		isLogical = value.match(/\b(block|inline|start|end)\b/);
		let obj = ret[isLogical? "logical" : "physical"];
		incrementByKey(obj, property);
	}


}, {
	properties: [
		"clear", "float", "caption-side", "resize", "text-align",
		/^overflow-/,
		"inset",
		/\b(block|inline|start|end|top|right|bottom|left|width|height)\b/,
	]
});

ret.logical.total = sumObject(ret.logical);
ret.physical.total = sumObject(ret.physical);

ret.logical = sortObject(ret.logical);
ret.physical = sortObject(ret.physical);


return ret;

}
