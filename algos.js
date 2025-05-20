function fifoPageReplacement(pages, capacity) {
	let memory = [];
	let pageFaults = 0;
	let index = 0;
	let memoryStates = [];

	for (let page of pages) {
		if (!memory.includes(page)) {
			pageFaults++;
			if (memory.length < capacity) {
				memory.push(page);
			} else {
				memory[index] = page;
				index = (index + 1) % capacity;
			}
		}
		memoryStates.push([...memory]);
	}

	return { pageFaults, memoryStates };
}

function lruPageReplacement(pages, capacity) {
	let memory = [];
	let pageFaults = 0;
	let recent = new Map();
	let memoryStates = [];

	for (let i = 0; i < pages.length; i++) {
		let page = pages[i];

		if (!memory.includes(page)) {
			pageFaults++;
			if (memory.length < capacity) {
				memory.push(page);
			} else {
				let lruIndex = 0;
				let lruTime = Infinity;
				for (let j = 0; j < memory.length; j++) {
					let time = recent.get(memory[j]) ?? -1;
					if (time < lruTime) {
						lruTime = time;
						lruIndex = j;
					}
				}
				memory[lruIndex] = page;
			}
		}
		recent.set(page, i);
		memoryStates.push([...memory]);
	}

	return { pageFaults, memoryStates };
}

function optimalPageReplacement(pages, capacity) {
	let memory = [];
	let pageFaults = 0;
	let memoryStates = [];

	for (let i = 0; i < pages.length; i++) {
		let page = pages[i];

		if (!memory.includes(page)) {
			pageFaults++;
			if (memory.length < capacity) {
				memory.push(page);
			} else {
				let indexToReplace = -1;
				let farthest = -1;
				for (let j = 0; j < memory.length; j++) {
					let nextUse = pages.slice(i + 1).indexOf(memory[j]);
					if (nextUse === -1) {
						indexToReplace = j;
						break;
					} else if (nextUse > farthest) {
						farthest = nextUse;
						indexToReplace = j;
					}
				}
				memory[indexToReplace] = page;
			}
		}
		memoryStates.push([...memory]);
	}

	return { pageFaults, memoryStates };
}
function displayMemoryStates(memoryStates, containerId) {
	const container = document.getElementById(containerId);
	container.innerHTML = "";
	memoryStates.forEach((state) => {
		const row = document.createElement("div");
		row.className = "memory-row";
		state.forEach((value) => {
			const cell = document.createElement("div");
			cell.className = "cell";
			cell.textContent = value;
			row.appendChild(cell);
		});
		container.appendChild(row);
	});
}

function runAlgorithms() {
	const capacity = parseInt(document.getElementById("frameInput").value);
	const pages = document
		.getElementById("pageInput")
		.value.split(",")
		.map(Number);

	const fifo = fifoPageReplacement(pages, capacity);
	const optimal = optimalPageReplacement(pages, capacity);
	const lru = lruPageReplacement(pages, capacity);

	displayMemoryStates(fifo.memoryStates, "fifoOutput");
	displayMemoryStates(optimal.memoryStates, "optimalOutput");
	displayMemoryStates(lru.memoryStates, "lruOutput");

	document.getElementById("fifoFaults").textContent = fifo.pageFaults;
	document.getElementById("optimalFaults").textContent = optimal.pageFaults;
	document.getElementById("lruFaults").textContent = lru.pageFaults;

	document.getElementById("tableFifoFaults").textContent = fifo.pageFaults;
	document.getElementById("tableOptimalFaults").textContent =
		optimal.pageFaults;
	document.getElementById("tableLruFaults").textContent = lru.pageFaults;
}
