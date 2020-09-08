// How many instances of box-sizing:border-box are there?

export default function compute() {
  let props = countProperties(ast.stylesheet.rules, {properties: /box-sizing/, values: /border-box/});
  return props['box-sizing']?.length || 0;
}
