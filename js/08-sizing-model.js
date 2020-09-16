// How many instances of box-sizing:border-box are there?

export default function countBorderBoxDeclarations(ast) {
	return countDeclarations(ast, {
		properties: /^(-(o|moz|webkit|ms)-)?box-sizing$/,
		values: "border-box"
	});
}
