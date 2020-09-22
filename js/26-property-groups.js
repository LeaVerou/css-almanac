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
let rules = [];

walkRules(ast, rule => {
	let ruleProps = rule.declarations
			// Ignore custom properties and prefixed ones. CP because they don't generalize
			// and prefixed ones because they will trivially correlate with each other and the non-prefixed version
			.filter(d => !d.property.startsWith("-"))
			.map(d => d.property);

	let props = new Set(ruleProps);
	rules.push(props);
}, {rules: r => r.declarations});

for (let props of rules) {
	for (let prop of props) {
		usedTogether[prop] = usedTogether[prop] || {total: 0};
		usedTogether[prop].total++;

		for (let prop2 of props) {
			if (prop !== prop2) {
				usedTogether[prop][prop2] = usedTogether[prop][prop2] || 0;
				usedTogether[prop][prop2]++;
			}
		}
	}
}


for (let property in usedTogether) {
	let obj = usedTogether[property];
	let total = obj.total.length;

	for (let prop in obj) {
		if (prop === "total") {
			continue;
		}

		let f = obj[prop];

		if (f < Math.max(3, obj.total * .15)) {
			// Prune those appearing together in less than 15% of rules or in fewer than 3 rules
			delete obj[prop];
		}
	}

	if (Object.keys(obj).length <= 1) {
		delete usedTogether[property];
	}
	else {
		usedTogether[property] = sortObject(obj);
	}
}

return usedTogether;

}
