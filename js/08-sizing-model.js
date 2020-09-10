// How many instances of box-sizing:border-box are there?

export default function countBorderBoxDeclarations(ast) {
  return countDeclarations(ast.stylesheet.rules, {properties: /^(-(o|moz|webkit|ms)-)?box-sizing$/, values: 'border-box'});
}
