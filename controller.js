class Controller {
	
	constructor() {
		
		this.machines = [new Machine(this)];
		this.machineCount = 1;
		this.busyMachines = [];
		this.freeMachines = this.machines;
		this.data = [];
		this.dataStatus = [];
		this.controllerStatus = "OFF";
		this.avg = 0;
		this.queryQueue = [];
		
		/*The controller can be in states:
		DONE: Sorting done
		WORK: Waiting for step
		OFF: Waiting for all parameters and machines to be set
		*/
		
	}
	
	setMachines(n) {
		
		if (this.controllerStatus != "OFF") {return false;}
		
		for (let i = 0; i < n; i++) {
			
			this.machines[i] = new Machine(this);
			this.machines[i].setZone();			
		}
		
		this.controllerStatus = "OFF";
		return true;
		
	}
	
	set(n) {
		
		this.setMachines();
		if (this.busyMachines.length + this.freeMachines.length != this.machines.length) {return false;}
		if (this.data.length == 0) {return false;}
		if (this.dataStatus.length != this.data.length) {return false;}
		
		this.controllerStatus = "WORK";
		return true;
		
	}
	
	assignQuery() {
		
		//Check for queue entries and assign free machines in order of preference
		//Greater zones first
		while (this.queryQueue.length > 0 && this.freeMachines.length > 0) {
			
			let maxZone = 0;
			let maxZoneIndex = 0;
			
			for (let i = 0; i < this.queryQueue.length; i++) {
				
				if (this.queryQueue[i][0] > maxZone) {
					
					maxZone = this.queryQueue[i][0];
					maxZoneIndex = i;
					
				}
				
			}
			
			this.freeMachines[0].sendWork(this.queryQueue[maxZoneIndex]);
			
			//Add the machine to busyMachines
			this.busyMachines.push(this.freeMachines[0]);
			
			//Remove the machine from freeMachines
			this.freeMachines.splice(0, 1);
			
		}
		
	}
	
	//Move machines that finished its jobs to freeMachines
	freeTheMachines() {
		
		for(let i = this.busyMachines.length; i > 0; i--) {
			
			if (this.busyMachines[i].machineStatus == "DONE") {
				
				this.freeMachines.push(this.busyMachines[i]);
				this.busyMachines.splice(i, 1);
				
			}
			
		}
		
	}
	
	//Function to be called from all different machines
	swap(a, b) {
		
		//Swap the value if both are in the same zone
		if (this.dataStatus[a] != this.dataStatus[b]) {return false;}
		
		let temp = this.data[a];
		this.data[a] = this.data[b];
		this.data[b] = temp;
		
		return true;
		
	}
	
	step() {
		
		if (this.controllerStatus == "OFF") {this.set(); return false;}
		if (this.controllerStatus == "DONE") {return false;}
		
		for (let i = 0; i < this.machines.length; i++) {
			
			if (this.machines[i].step() == false) {return false;}
			
		}
		
		return true;
		
	}
	
	query(n, machine) {
		
		this.queryQueue.push([n, machine]);
		
	}
	
}