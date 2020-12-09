import * as parsel from "https://projects.verou.me/parsel/parsel.js";

const fetchOptions = {
	headers: new Headers({
		"X-Requested-With": "fetch"
	})
};

window.parsel = parsel;
window.AST = undefined;

window.testQuery = async function(name) {
	let filename = name.indexOf(".js") > -1? name : name + ".js?" + Date.now();
	let module = await import("../js/" + filename);
	let ret = module.default();
	console.log(ret);
	return ret;
}

// Get previously entered CSS code
if (localStorage.cssCode) {
	cssCode.value = localStorage.cssCode;
}

if (localStorage.selectQuery) {
	selectQuery.value = localStorage.selectQuery;
}

if (localStorage.selectedTab) {
	document.querySelector(`simple-tab[label="${localStorage.selectedTab}"]`)?.select();
}

// Get URL field from the URL, if it exists
let url = new URL(location)?.searchParams?.get("url");
if (url) {
	cssURL.value = url;
}

cssForm.elements.cssInput.value = cssCode.value? "text" : "url";

queryRerun.onclick = async e => {
	if (!window.AST) {
		return;
	}

	let query = selectQuery.value;
	let result = await testQuery(query);
	queryResults.textContent = JSON.stringify(result, null, "\t");
}

async function update() {
	let css;

	if (cssForm.elements.cssInput.value === "text") {
		css = cssCodeDisplay.textContent = cssCode.value;

		try {
			AST = parse(cssCode.value);
			cssCode.setCustomValidity("");
		}
		catch (e) {
			cssCode.setCustomValidity(e.message);
		}
	}
	else if (cssForm.elements.cssInput.value === "url" && cssURL.value) {
		let url = cssURL.value;
		cssURL.classList.add("loading");
		let response;

		try {
			response = await fetch('https://cors-anywhere.herokuapp.com/' + url, fetchOptions);
		}
		catch (e) {
			cssURL.classList.remove("loading");
			return;
		}

		let mime = response.headers.get("Content-Type");

		if (url.endsWith(".css") || mime?.startsWith("text/css")) {
			css = await response.text();
		}
		else {
			// URL to a website
			let html = await response.text();
			let doc = new DOMParser().parseFromString(html, "text/html");
			css = await Promise.all([...doc.querySelectorAll("link[rel=stylesheet], style")]
				.map(async l => {
					if (l.nodeName === "STYLE") {
						return l.textContent;
					}

					let href = new URL(l.getAttribute("href"), url);
					let res = await fetch('https://cors-anywhere.herokuapp.com/' + href, fetchOptions);
					return await res.text();
				}));
			css = css.join("\n")
		}

		cssURL.classList.remove("loading");
	}

	cssCodeDisplay.textContent = css;

	try {
		AST = parse(css);
		astDisplay.classList.remove("error");
		astDisplay.textContent = JSON.stringify(AST, null, "\t");
	}
	catch (e) {
		astDisplay.classList.add("error");
		astDisplay.innerHTML = `<details><summary>${e}</summary>${e.stack.replace(e, "")}</details>`;
	}

	window.ast = AST;

	selectQuery.onchange();
}

for (let radio of cssForm.elements.cssInput) {
	radio.onclick = update;
}

cssCode.oninput = cssURL.onchange = update;

cssURL.oninput = e => {
	let url = new URL(location);
	url.searchParams.set("url", cssURL.value);
	history.replaceState(null, "", url);
	cssForm.elements.cssInput.value = "url";
}

cssCode.addEventListener("input", evt => {
	cssForm.elements.cssInput.value = "text";
})

cssForm.onsubmit = evt => {
	evt.preventDefault();
	update();
}

cssCode.addEventListener("input", evt => {
	let lines = cssCode.value.split("\n").length || 0;
	cssCode.style.setProperty("--lines", lines);
	localStorage.cssCode = cssCode.value;
});

selectQuery.onchange = e => {
	localStorage.selectQuery = selectQuery.value;
	let issue = parseFloat(selectQuery.value.substring(0, 2));
	readMore.href = "https://github.com/LeaVerou/css-almanac/issues/" + issue;
	queryRerun.onclick();
};

tabs.addEventListener("tabselect", e => {
	localStorage.selectedTab = e.target.label;
});

update();
