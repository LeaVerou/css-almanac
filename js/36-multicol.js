export default function compute() {
	let props = countDeclarationsByProperty(ast.stylesheet.rules, {propeties: /^column[s-]/});
	return Object.keys(props).length > 0;
}
