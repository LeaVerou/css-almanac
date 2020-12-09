const css = `
:host {
	display: block;
	font: inherit;
	color: inherit;
}

::slotted(simple-tab) {
	display: none;
}

::slotted(simple-tab[selected]) {
	display: block;
}

.tab-bar {
	display: flex;
	gap: .1em;
}

.tab-bar > button {
	font: inherit;
	border: none;
	border-bottom: .2em solid transparent;
	background: none;
	cursor: pointer;
}

.tab-bar > button.selected {
	font-weight: bold;
	border-bottom-color: var(--accent-color, hsl(220, 10%, 50%));
}`;

class SimpleTab extends HTMLElement {
	constructor() {
		super();

		if (this.attachInternals) {
			this._internals = this.attachInternals();
			this._internals.role = "tabpanel";
		}
	}

	async connectedCallback() {
		if (this.parentNode instanceof Element && !this.parentNode.matches("simple-tabs")) {
			throw new Error("<simple-tab> can only be inside a <simple-tabs> element");
		}

		this.tab = document.createElement("button");
		this.tab.setAttribute("part", "tab");
		this.tab.textContent = this.label;
		this.tab.role = "tab";

		this.tab.addEventListener("click", e => {
			if (!this.selected) {
				this.select();
			}
		});

		await customElements.whenDefined("simple-tabs");
		this.parentNode.bar.append(this.tab);

	}

	get label() {
		return this.getAttribute("label");
	}

	set label(value) {
		this.setAttribute("label", value);
	}

	get selected() {
		return this.getAttribute("selected");
	}

	set selected(value) {
		if (value) {
			this.setAttribute("selected", "");
			this.tab.classList.add("selected");
			let evt = new CustomEvent("tabselect", {bubbles: true});
			this.dispatchEvent(evt);
		}
		else {
			this.removeAttribute("selected");
			this.tab.classList.remove("selected");
		}

		if (this._internals) {
			this._internals.ariaSelected = !!value;
		}
	}

	select () {
		let container = this.parentNode;

		let selectedTab = container.selectedTab;
		if (selectedTab && selectedTab !== this) {
			selectedTab.deselect();
		}

		this.selected = true;
	}

	deselect() {
		let container = this.parentNode;

		if (container.selectedTab === this) {
			this.selected = false;
		}
	}

	static get observedAttributes() {
		return ["label", "selected"];
	}

	attributeChangedCallback(name, oldValue, newValue) {
		if (oldValue === newValue) {
			return;
		}

		switch (name) {
			case "label":
				if (this.tab) {
					this.tab.textContent = this.label;
				}

				break;
			case "selected":
				this.selected = this.hasAttribute("selected");
				break;
		}
	}
};

customElements.define("simple-tab", SimpleTab);

class SimpleTabs extends HTMLElement {
	constructor() {
		super();

		let shadowRoot = this.attachShadow({mode: "open"});

		this.bar = document.createElement("div");
		this.bar.className = "tab-bar";
		this.bar.role = "tablist";

		let style = document.createElement("style");
		style.textContent = css;

		shadowRoot.append(style, this.bar, document.createElement("slot"));
	}

	connectedCallback() {
		(this.selectedTab || this.children[0]).select();
	}

	get selectedTab() {
		return [...this.children].find(e => e.hasAttribute("selected"));
	}
};

customElements.define("simple-tabs", SimpleTabs);
