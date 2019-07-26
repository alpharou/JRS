class Machine {
	
	constructor(controller) {
		
		this.controller = controller;
		this.data = [];
		this.avg = 0;
		this.machineStatus = "OFF";
		this.leftPivot = -1;
		this.rightPivot = -1;
		
	}
	
	setMachine(a, b) {
		
		this.leftPivot = a;
		this.rightPivot = b;
		
		let avg = 0;
		
		for(let i = 0; i < this.data.length; i++) {
			
			avg = avg - ((avg + this.data[i])/i);
			
		}
		
		this.avg = avg;
		
	}
	
	step() {
		
		if (this.machineStatus == "OFF") {return false;}
		
		if (this.machineStatus == "WORK") {
			
			if (leftPivot >= rightPivot) {this.machineStatus == "DONE"; return true;}
			
			if (this.data[leftPivot] > this.avg) {this.controller.swap(leftPivot, rightPivot); rightPivot--; return true;}
			
			if (this.data[leftPivot] <= this.avg) {leftPivot++; return true;}
			
		}
		
		if (this.machineStatus == "DONE") {return true;}
		
		//Step should never reach this line
		return false;
		
	}
	
}