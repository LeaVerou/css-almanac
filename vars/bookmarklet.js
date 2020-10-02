/**
 * This is not a metric. This is for testing the metrics in this folder on a real website.
 * Add this bookmarklet: javascript:import("https://projects.verou.me/css-almanac/vars/bookmarklet.js?"+Date.now());undefined;
 * then invoke it on any page, and experiment in the console with the `vars` object and `testQuery("filenameWithoutJS")`
 */

console.clear();

function addScript(url) {
	let script = document.createElement("script");
	script.src = new URL(url, import.meta.url);
	document.head.append(script);
	return new Promise(r => script.onload = r);
}

addScript("../../parsel/parsel_nomodule.js");
addScript("../../rework-utils/rework-utils.js");
addScript("../runtime/var-tree.js").then(() => {
	let data = analyzeVariables({serializeElements: true});
	window.vars = data;

	if (Object.keys(data.summary).length === 0 && data.computed.length === 0) {
		console.log("This page does not appear to use CSS custom properties");
	}
	else {
		console.info(vars);
	}
});

window.testQuery = async function(name) {
	let filename = name.indexOf(".js") > -1? name : name + ".js?" + Date.now();
	let module = await import(new URL("./" + filename, import.meta.url));
	let ret = module.default();
	console.log(ret);
	return ret;
}
