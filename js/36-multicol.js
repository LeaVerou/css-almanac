let props = countProperties(ast.stylesheet.rules, {propeties: /^column[s-]/});
let usesMulticol = Object.keys(props).length > 0;
