// How many instances of box-sizing:border-box are there?

export default function countBorderBoxDeclarations(ast) {
  const declarations = countDeclarationsByProperty(ast.stylesheet.rules, {properties: /^(-(o|moz|webkit|ms)-)?box-sizing$/, values: 'border-box'});
  return declarations['box-sizing'] || 0;
}
