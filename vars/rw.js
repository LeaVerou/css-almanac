export default function compute() {

let ret = {
	get_only: 0,
	set_only: 0,
	get_set: 0
};

for (let property in vars.summary) {
	let rw = vars.summary[property];

	if (rw.get.length > 0) {
		if (rw.set.length > 0) {
			ret.get_set++;
		}
		else {
			ret.get_only++;
		}
	}
	else {
		ret.set_only++;
	}
}

return ret;

}
