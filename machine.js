class Machine {
	
	constructor(controller) {
		
		this.controller = controller;
		this.start = -1;
		this.end = -1;
		this.machineStatus = "OFF";
		this.leftPivot = -1;
		this.rightPivot = -1;
		this.bestBubbleIndex = -1;
		this.bestBubbleValue;
		
	}
	
	clear() {
		
		this.start = -1;
		this.end = -1;
		this.machineStatus = "OFF";
		this.leftPivot = -1;
		this.rightPivot = -1;
		this.bestBubbleIndex = -1;
		this.bestBubbleValue = NaN;
		
	}
	
	sendWork(queueTask) {
		
		this.start = queueTask[1];
		this.end = queueTask[2];
		
		this.leftPivot = this.start;
		this.rightPivot = this.end;
		
		this.bestBubbleValue = this.controller.data[this.end];
		this.bestBubbleIndex = this.end;
		
		if(this.end - this.start > this.controller.zoneLimitSize) {this.machineStatus = "WORK(JRS)";}
		else {this.machineStatus = "WORK(BBL)";}
		
		return true;
		
	}
	
	step() {
		
		if (this.machineStatus == "OFF") {return "Machine is OFF";}
		if (this.machineStatus == "DONE") {return true;}
		
		if (this.machineStatus == "WORK(JRS)") {
			
			if (this.leftPivot == this.rightPivot) {
				
				//Create two queries and go DONE
				if(this.leftPivot - this.start > 1) {this.controller.query(this.leftPivot - this.start, this.start, this.leftPivot);}
				if(this.end - this.leftPivot + 1 > 1) {this.controller.query(this.end - this.leftPivot + 1, this.leftPivot +1, this.end);}
				
				this.machineStatus = "DONE";
				return true;
				
			}
			
			if (this.controller.data[this.leftPivot] > this.controller.data[this.leftPivot + 1]) {this.controller.swap(this.leftPivot, this.leftPivot+1); this.leftPivot++; return true;}
			
			if (this.controller.data[this.leftPivot] <= this.controller.data[this.leftPivot + 1]) {this.controller.swap(this.leftPivot + 1, this.rightPivot); this.rightPivot--; return true;}
			
		}
		
		if(this.machineStatus == "WORK(BBL)") {
			
			//Walk downwards and record lowest value
			this.rightPivot--;
			if (this.controller.data[this.rightPivot] < this.bestBubbleValue) {
				
				this.bestBubbleValue = this.controller.data[this.rightPivot];
				this.bestBubbleIndex = this.rightPivot;
				
			}
			
			//Swap when walker reaches the leftPivot
			if(this.rightPivot == this.leftPivot) {
				
				this.controller.swap(this.rightPivot, this.bestBubbleIndex); 
				this.bestBubbleValue = this.controller.data[this.end];
				this.bestBubbleIndex = this.end;
				this.leftPivot++; 
				this.rightPivot = this.end;
				return true;
				
			}
			
			//Stop when done
			if (this.leftPivot == this.end) {
				
				this.machineStatus = "DONE";
				return true;
				
			}
			
			return true;
			
		}
		
		//Step should never reach this line
		return "Machine reached an illegal state";
		
	}
	
}