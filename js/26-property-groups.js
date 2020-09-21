export default function compute() {
// let properties = [];
//
// walkRules(ast, rule => {
// 	properties.push(rule.declarations.map(d => d.property).sort());
// }, {type: "rule"});
//
// let apriori = new Apriori.Algorithm(.15, .1);
// let result = apriori.analyze(properties);
// console.log(result.associationRules, result.frequentItemSets);
// return result.map(a => { return {lhs: a.lhs, rhs: a.rhs}})

let usedTogether = {};

walkRules(ast, rule => {
	let props = new Set();

	for (let d of rule.declarations) {
		props.add(d.property)
	}

	for (let prop of props) {
		usedTogether[prop] = usedTogether[prop] || {};

		for (let prop2 of props) {
			if (prop === prop2) {
				continue;
			}

			incrementByKey(usedTogether[prop], prop2);
		}
	}

}, {rules: r => r.declarations});

// Now sort by usage count
for (let prop in usedTogether) {
	let obj = usedTogether[prop];

	// Remove properties that are only used together once
	for (let p in obj) {
		if (obj[p] === 1) {
			delete obj[p];
		}
	}

	let sortedEntries = sortObject(obj);
}

return usedTogether;

}
