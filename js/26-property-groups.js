export default function compute() {

// Total number of rules to descend and try to extend the subset by one
const MIN_TOTAL_FOR_DESCENT = 5;

// Min % of rules child property appears in compared to parent combination to
// try to extend the subset by one
const MIN_PERCENT_FOR_DESCENT = .35;

// Properties or combinations used this many times will be pruned
const MAX_TOTAL_FOR_PRUNE = 2;

// Child properties used in that many instances of the parent combination will be pruned
const MAX_PERCENT_FOR_PRUNE = .2;

let sets = [];
let frequent = {};
let allUsage = {};
let rules = Symbol("rules");
let totalRules = 0;

walkRules(ast, rule => {
	let ruleProps = rule.declarations
			// Ignore custom properties and prefixed ones. CP because they don't generalize
			// and prefixed ones because they will trivially correlate with each other and the non-prefixed version
			.filter(d => !d.property.startsWith("-"))
			.map(d => d.property);

	let props = new Set(ruleProps);
	sets.push(props);
	totalRules++;
}, {
	rules: r => r.declarations,
	not: {
		type: "font-face"
	}
});

function countProps(usage, sets, property, parent) {
	for (let rule of sets) {
		for (let prop of rule) {
			if (prop <= property) {
				continue;
			}

			usage[prop] = usage[prop] || {total: 0, [rules]: []};
			usage[prop].total++;

			let p = new Set(rule);
			p.delete(prop);

			if (p.size > 0) {
				usage[prop][rules].push(p);
			}
		}
	}

	for (let prop in usage) {
		if (prop === "total") {
			continue;
		}

		let u = usage[prop];

		if (u.total > 5 && (!usage.total || u.total > usage.total * .4)) {
			countProps(u, u[rules], prop, usage);
		}
		else if (u.total < 3 || u.total < usage.total * .2) {
			delete usage[prop];
		}
	}
}

function walkUsage(usage, properties = []) {
	for (let property in usage) {
		if (property === "total") {
			continue;
		}

		let u = usage[property];
		let path = [...properties, property];

		if (path.length >= 2) {
			frequent[path.join(", ")] = 100 * u.total / totalRules;
		}

		if (Object.keys(u).length <= 1) {
			// Replace {total: N} with number
			usage[property] = u.total;
		}
		else {
			walkUsage(u, path);
		}
	}
}

countProps(allUsage, sets);
walkUsage(allUsage);

// return allUsage;
return sortObject(frequent);

}
