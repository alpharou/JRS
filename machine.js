class Machine {
	
	constructor(controller) {
		
		this.controller = controller;
		this.start = -1;
		this.end = -1;
		this.avg = 0;
		this.machineStatus = "OFF";
		this.leftPivot = -1;
		this.rightPivot = -1;
		this.bestBubbleIndex = -1;
		this.bestBubbleValue;
		
	}
	
	sendWork(queueTask) {
		
		this.start = queueTask[1];
		this.end = queueTask[2];
		this.avg = queueTask[3];
		
		this.leftPivot = this.start;
		this.rightPivot = this.end;
		
		if(this.end - this.start > this.controller.zoneLimitSize) {this.machineStatus = "WORK(JRS)";}
		else {this.machineStatus = "WORK(BBL)";}
		
		return true;
		
	}
	
	step() {
		
		if (this.machineStatus == "OFF") {return false;}
		
		if (this.machineStatus == "WORK(JRS)") {
			
			if (this.leftPivot >= this.rightPivot) {this.machineStatus == "DONE"; return true;}
			
			if (this.data[leftPivot] > this.avg) {this.controller.swap(leftPivot, rightPivot); rightPivot--; return true;}
			
			if (this.data[leftPivot] <= this.avg) {leftPivot++; return true;}
			
		}
		
		if(this.machineStatus == "WORK(BBL)") {
			
			if(this.rightIndex <= this.leftIndex) {
				
				this.controller.swap(this.rightIndex, this.bestBubble); 
				this.leftIndex++; 
				this.rightIndex = this.end;
				return true;
				
			}
			
			//AQUI ME HE QUEDADO
			
		}
		
		if (this.machineStatus == "DONE") {return true;}
		
		//Step should never reach this line
		return false;
		
	}
	
}