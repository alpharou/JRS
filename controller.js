class Controller {
	
	constructor() {
		
		this.machines = [];
		this.busyMachines = [];
		this.freeMachines = [];
		this.data = [];
		this.controllerStatus = "OFF";
		this.pivAvg = 0;
		this.queryQueue = []; //A queue entry defines a zone as:[length, starting index, end index, approximate average]
		this.zoneLimitSize = 10;
		
		/*The controller can be in states:
			DONE: Sorting done
			WORK: Waiting for step
			OFF: Waiting for all parameters and machines to be set
		*/
		
	}
	
	setZoneLimit(n) {
		
		this.zoneLimitSize = n;
		return true;
		
	}
	
	setMachines(n) {
		
		if (this.controllerStatus == "WORK") {return "Controller is not OFF";}
		
		this.machines = [];
		this.freeMachines = [];
		
		for (let i = 0; i < n; i++) {
			
			this.machines[i] = new Machine(this);
			this.freeMachines[i] = this.machines[i];
			
		}
		
		this.busyMachines = [];
		this.controllerStatus = "OFF";
		return true;
		
	}
	
	go() {
		
		if (this.busyMachines.length + this.freeMachines.length != this.machines.length) {return "Machinecount, Busy and Free machines mismatch";}
		if (this.machines.length < 1) {return "MachineCount is less that 1";}
		if (this.data.length == 0) {return "No data set";}
		
		//Create initial task
		//this.setPivot();
		this.query(this.data.length, 0, this.data.length - 1);
		
		this.controllerStatus = "WORK";
		return true;
		
	}
	
	setPivot() {
		
		let minValue = this.data[0];
		let minIndex = 0;
		
		for (let i = 0; i < this.data.length; i++) {
			
			if (abs(this.data[i] - this.pivAvg) < minValue) {
				
				minValue = abs(this.data[i] - this.pivAvg);
				minIndex = i;
				
			}
			
		}
		
		this.swap(0, minIndex);
		
	}
	
	assignQuery() {
		
		//Check for queue entries and assign free machines in order of preference
		//Greater zones first
		while ((this.queryQueue.length > 0) && (this.freeMachines.length > 0)) {
			
			let maxZone = 0;
			let maxZoneIndex = 0;
			
			for (let i = 0; i < this.queryQueue.length; i++) {
				
				if (this.queryQueue[i][0] > maxZone) {
					
					maxZone = this.queryQueue[i][0];
					maxZoneIndex = i;
					
				}
				
			}
			
			this.freeMachines[0].sendWork(this.queryQueue[maxZoneIndex]);
			this.queryQueue.splice(maxZoneIndex, 1);
			
			//Add the machine to busyMachines
			this.busyMachines.push(this.freeMachines[0]);
			
			//Remove the machine from freeMachines
			this.freeMachines.splice(0, 1);
			
		}
		
		return true;
		
	}
	
	//Move machines that finished its jobs to freeMachines
	freeTheMachines() {
		
		for(let i = this.busyMachines.length - 1; i >= 0; i--) {
			
			if (this.busyMachines[i].machineStatus == "DONE") {
				
				this.busyMachines[i].clear();
				this.freeMachines.push(this.busyMachines[i]);
				this.busyMachines.splice(i, 1);
				
			}
			
		}
		
	}
	
	//Function to be called only from machines or from shuffle
	swap(a, b) {
		
		let temp = this.data[a];
		this.data[a] = this.data[b];
		this.data[b] = temp;
		
		return true;
		
	}
	
	addData(data) {
		
		if (typeof data != "number") {return "data is not a Number";} 
		if (this.controllerStatus != "OFF") {return "Controller is not OFF";}
		
		this.data.push(data);
		
		this.pivAvg = Math.round(this.pivAvg * ((this.data.length-1)/this.data.length) + data/this.data.length);
		return true;
		
	}
	
	step() {
		
		if (this.controllerStatus == "OFF") {return "Controller is not set";}
		if (this.controllerStatus == "DONE") {return "Controller is DONE";}
		if(this.queryQueue.length == 0 && this.busyMachines.length == 0) {this.controllerStatus = "DONE"; return "Controller is DONE";}
		
		this.freeTheMachines();
		this.assignQuery();
		
		for (let i = 0; i < this.busyMachines.length; i++) {
			
			this.busyMachines[i].step();
			
		}
		
		return true;
		
	}
	
	query(n, start, end) {
		
		this.queryQueue.push([n, start, end]);
		
	}
	
}