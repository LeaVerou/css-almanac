export default function compute() {
	let props = countDeclarationsByProperty(ast.stylesheet.rules, {properties: /^column[s-]/});
	return Object.keys(props).length > 0;
}
