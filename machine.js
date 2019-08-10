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
	
	setPivot() {
		
		let avg = (this.controller.data[this.start] + this.controller.data[this.end])/2;
		let minDelta = abs(avg - this.controller.data[this.leftPivot]);
		let deltaIndex = this.leftPivot;
		
		for (let i = this.leftPivot; i < this.end; i++) {
			
			if (abs(avg - this.controller.data[i]) < minDelta) {
				
				minDelta = abs(avg - this.controller.data[i]);
				deltaIndex = i;
				
			}
			
		}
		
		this.controller.swap(this.leftPivot, deltaIndex);
		return true;
		
	}
	
	sendWork(queueTask) {
		
		this.start = queueTask[1];
		this.end = queueTask[2];
		
		this.leftPivot = this.start + 1;
		this.rightPivot = this.end - 1;
		
		this.bestBubbleValue = this.controller.data[this.rightPivot];
		this.bestBubbleIndex = this.rightPivot;
		
		if(this.end - this.start > this.controller.zoneLimitSize) {
			
			this.setPivot();
			this.machineStatus = "WORK(JRS)";
			
		}
		else {this.machineStatus = "WORK(BBL)";}
		
		return true;
		
	}
	
	step() {
		
		if (this.machineStatus == "OFF") {return "Machine is OFF";}
		if (this.machineStatus == "DONE") {return true;}
		
		if (this.machineStatus == "WORK(JRS)") {
			
			if (this.leftPivot == this.rightPivot) {
				
				//Create two queries and go DONE
				if(this.leftPivot - this.start > 3) {this.controller.query(this.leftPivot - this.start, this.start, this.leftPivot);}
				if(this.end - this.leftPivot + 1 > 3) {this.controller.query(this.end - this.leftPivot, this.leftPivot, this.end);}
				
				this.machineStatus = "DONE";
				return true;
				
			}
			
			if (this.controller.data[this.leftPivot] > this.controller.data[this.leftPivot + 1]) {this.controller.swap(this.leftPivot, this.leftPivot+1); this.leftPivot++; return true;}
			
			if (this.controller.data[this.leftPivot] <= this.controller.data[this.leftPivot + 1]) {this.controller.swap(this.leftPivot + 1, this.rightPivot); this.rightPivot--; return true;}
			
		}
		
		if(this.machineStatus == "WORK(BBL)") {
			
			//Stop when done
			if (this.leftPivot >= this.end - 1) {
				
				this.machineStatus = "DONE";
				return true;
				
			}
			
			this.rightPivot--;
			//record lowest value
			if (this.controller.data[this.rightPivot] < this.bestBubbleValue) {
				
				this.bestBubbleValue = this.controller.data[this.rightPivot];
				this.bestBubbleIndex = this.rightPivot;
				
			}
			
			//Swap when walker reaches the leftPivot
			if(this.rightPivot <= this.leftPivot) {
				
				this.controller.swap(this.leftPivot, this.bestBubbleIndex); 
				this.bestBubbleValue = this.controller.data[this.end - 1];
				this.bestBubbleIndex = this.end - 1;
				this.leftPivot++; 
				this.rightPivot = this.end - 1;
				return true;
				
			}
			
			return true;
			
		}
		
		//Step should never reach this line
		return "Machine reached an illegal state";
		
	}
	
}