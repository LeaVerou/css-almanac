// Are named grid lines in use?
// TODO extract names to see what names are most popular?

export default function compute() {
	let props = countDeclarations(ast.stylesheet.rules, {
		properties: /^grid($|\-)/,
		values: /\[([\w-]+)\]/
	});
	return Object.keys(props).length > 0;
}
