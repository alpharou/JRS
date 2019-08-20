function windowResized() {
	
	resizeCanvas(windowWidth, windowHeight);
	wW = windowWidth;
	wH = windowHeight;
	barWidth = wW/jrs.data.length;
  
}

function mousePressed() {
	
	noLoop();
	redraw();
	
}

function shuffleJRS() {
	
	var curr = jrs.data.length - 1;
	
	while (0 !== curr) {

		jrs.swap(curr, Math.floor(Math.random() * curr));
		curr--;
		
	}
	
}

function setup() {
	
	//Graphical stuff
	frameRate(60);
	createCanvas(windowWidth, windowHeight);
  
	wW = windowWidth;
	wH = windowHeight;
	barWidth = 0;
	
	//Sorty stuff
	jrs = new Controller();
	data = [];
	leftPivots = [];
	rightPivots = [];
	bestBubbleIndexes = [];
	deltaIndexes = [];
	bestDeltaIndexes = [];
	starts = [];
	ends = [];
	
	let n = 400;
	
	for (let i = 0; i < n; i++) {
		
		value = ceil(100 * (1/(1+Math.pow(Math.E, ((-i)+(n/2))/(n/6)))));
		data.push(value);
		jrs.addData(value);
		
	}
	
	shuffleJRS();
	
	jrs.setZoneLimit(10);
	jrs.setMachines(10);
	jrs.go();
	
	barWidth = wW/jrs.data.length;
	noStroke();
	
}

function draw() {
	
	//noLoop();
	
	background(0);
	
	//clear and gather data from the jrs
	leftPivots = [];
	rightPivots = [];
	bestBubbleIndexes = [];
	deltaIndexes = [];
	bestDeltaIndexes = [];
	starts = [];
	ends = [];
	
	for (machine of jrs.machines) {
		
		if (machine.leftPivot != -1) {leftPivots.push(machine.leftPivot);}
		if (machine.rightPivot != -1) {rightPivots.push(machine.rightPivot);}
		if (machine.bestBubbleIndex != -1) {bestBubbleIndexes.push(machine.bestBubbleIndex);}
		if (machine.deltaIndex != -1) {deltaIndexes.push(machine.deltaIndex);}
		if (machine.bestDeltaIndex != -1) {bestDeltaIndexes.push(machine.bestDeltaIndex);}
		if (machine.start != -1) {starts.push(machine.start);}
		if (machine.end != -1) {ends.push(machine.end);}
		
	}
	
	//Draw the initial data SORTED
	fill(255);
	for (let i = 0; i < data.length; i++) {
		
		let y = map(data[i], 100, 0, wH/2, 0);
		let x = i * barWidth;
		rect(x, wH/2, barWidth, -y);
		
	}
	
	//Draw the JRS data
	let rampCheck = jrs.data[0];
	for (let i = 0; i < jrs.data.length; i++) {
		
		//for (let query of jrs.queryQueue) {if (i >= query[1] && i <= query[2]) {fill(155,155,255);}}
		if (jrs.data[i] >= rampCheck) {fill(255); rampCheck = jrs.data[i];}
		for (let check of leftPivots) {if (i == check) {fill(0, 255, 255);}}
		for (let check of rightPivots) {if (i == check) {fill(255, 0, 255);}}
		for (let check of bestBubbleIndexes) {if (i == check) {fill(155,155,255);}}
		for (let check of deltaIndexes) {if (i == check) {fill(0, 255, 255);}}
		for (let check of bestDeltaIndexes) {if (i == check) {fill(155,255,155);}}
		for (let check of starts) {if (i == check) {fill(0,0,255);}}
		for (let check of ends) {if (i == check) {fill(255,0,0);}}
		
		let y = map(jrs.data[i], 100, 0, wH/2, 0);
		let x = i * barWidth;
		rect(x, wH, barWidth, -y);
		fill(155);
		
	}
	
	//Stop redraws when JRS is DONE
	if (jrs.step() == "Controller is DONE") {noLoop();}
	
}