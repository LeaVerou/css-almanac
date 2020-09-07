// Are named grid lines in use?
// TODO extract names to see what names are most popular
let props = countProperties(ast.stylesheet.rules, {properties: /^grid($|\-)/, values: /\[([\w-]+)\]/});
let usesNamedGridLines = Object.keys(props).length > 0;
