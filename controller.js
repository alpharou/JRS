class Controller {
	
	constructor() {
		
		this.machines = [];
		this.busyMachines = [];
		this.freeMachines = [];
		this.data = [];
		this.controllerStatus = "OFF";
		this.avg = 0;
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
		
		if (this.controllerStatus == "WORK") {return false;}
		
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
		
		if (this.busyMachines.length + this.freeMachines.length != this.machines.length) {return false;}
		if (this.machines.length < 1) {return false;}
		if (this.data.length == 0) {return false;}
		if (this.dataStatus.length != this.data.length) {return false;}
		
		//Create initial task
		this.query(this.data.length, 0, this.data.length - 1, this.avg);
		
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
		
		return true;
		
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
	
	//Function to be called only from machines
	swap(a, b) {
		
		let temp = this.data[a];
		this.data[a] = this.data[b];
		this.data[b] = temp;
		
		return true;
		
	}
	
	addData(data) {
		
		if (this.controllerStatus != "OFF") {return false;}
		
		this.data.push(data);
		return true;
		
	}
	
	step() {
		
		if (this.controllerStatus == "OFF") {return false;}
		if (this.controllerStatus == "DONE") {return false;}
		
		this.freeTheMachines();
		this.assignQuery();
		
		for (let i = 0; i < this.machines.length; i++) {
			
			if (this.machines[i].step() == false) {return false;}
			
		}
		
		return true;
		
	}
	
	query(n, start, end, avg) {
		
		this.queryQueue.push([n, start, end, avg]);
		
	}
	
}