export default function compute() {

let ret = {
	selectorCount: 0,
	ruleCount: 0,
	specificityCount: {},
	maxSpecifity: [0, 0, 0]
};

let ss = [0, 0, 0];

walkRules(ast, rule => {
	ret.ruleCount++;

	for (let selector of rule.selectors) {
		ret.selectorCount++;
		let s = parsel.specificity(selector);
		ss = ss.map((a, i) => a + s[i]);
		let max = Math.max(...s);

		incrementByKey(ret.specificityCount, max <= 5? s + "" : "higher");

		let base = Math.max(...ret.maxSpecifity, ...s);
		if (parsel.specificityToNumber(s, base) > parsel.specificityToNumber(ret.maxSpecifity, base)) {
			ret.maxSpecifity = s;
			ret.maxSpecifitySelector = selector;
		}
	}
}, {type: "rule"});

ret.selectorsPerRule = ret.selectorCount / ret.ruleCount;
ret.avgSpecificity = ss.map(s => s / ret.selectorCount);

return ret;

}
