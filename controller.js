class Controller {
	
	constructor() {
		
		this.machines = [new Machine];
		this.data = [];
		this.dataStatus = [];
		this.controllerStatus = "OFF";
		this.avg = 0;
		
		/*The controller can be in:
		DONE: Sorting done
		WORK: Waiting for step
		OFF: Waiting for all parameters and machines to be set
		*/
		
	}
	
	setMachines(n) {
		
		if (this.controllerStatus != "OFF") {return false;}
		
		for (let i = 0; i < n; i++) {
			
			this.machines[i] = new Machine;
			
		}
		
		this.controllerStatus = "OFF";
		return true;
		
	}
	
	check() {
		
		if (this.machines.length == 0) {return false;}
		if (this.data.length == 0) {return false;}
		if (this.dataStatus.length != this.data.length) {return false;}
		
	}
	
	step() {
		
		for (let i = 0; i < this.machines.length) {this.machines[i].step();}
		
	}
	
}