	var tabsstuff = angular.module('assembly', ['ui.bootstrap'])
	
	.provider('assembler', function(){
		
	var assembler = function(tableName, varTable, figureMode){
		this.tableName = tableName;
		
		var parser = this;
		this.intervalID;
		// Determines if in Figure or Architecture mode
		// True for Figure, False if Architecture
		this.figureMode = figureMode;
		
		// Has the table been edited recently?
		// Set to true by default
		this.edited = true;
		
		// A flag indicating whether the program has been run before
		// Primarily used for checking if values should be reset
		this.done = false;
		
		// Initial program counter
		// Increased when .Block and .Word is used/modified
		this.programCounter = 0;
		
		this.previousCounter = 0;
		
		this.offSet = 0;
		
		// Current program counter
		// Kept constant
		this.startCounter = this.programCounter;
		
		// Flag for Overflow
		// Set whenever a register goes over 32767
		this.overflowFlag = 0;
		
		// Flag for Negative
		// Set whenever a register has stored a negative value
		this.negativeFlag = 0;
		
		// Flag for Carry
		// Set when ???
		this.carryFlag = 0;
		
		// Flag for Zero
		// Set whenever a register holds a zero value
		this.zeroFlag = 0;
		
		// Alerts the controller that the program has finished
		this.stop = false;
		
		// List of used variables
		// More important in figure mode
		this.variables = [];
		
		// List of memory labels
		// Helps with memory lookup
		this.labels = [];
		
		// For ease of adjustment later
		// References to Column # of each attribute
		this.labelNum = 2;
		this.cmdNum = 3;
		this.arg1Num = 4;
		this.arg2Num = 5;
		this.arg3Num = 6;
		
		// Information Storage for Registers
		// Also gives flag about if Registers are used
		// Initial firstChild.nodeValues set to 0 and false
		this.register = [
		                 ["Reg0", 0, false], // Reg0
		                 ["Reg1", 0, false], // Reg1
		                 ["Reg2", 0, false], // Reg2
		                 ["Reg3", 0, false], // Reg3
		                 ["Reg4", 0, false], // Reg4
		                 ["Reg5", 0, false], // Reg5
		                 ["Reg6", 0, false], // Reg6
		                 ["Reg7", 0, false], // Reg7
		                 ["Reg8", 0, false], // Reg8
		                 ["Reg9", 0, false], // Reg9
		                 ["RegA", 0, false], // RegA
		                 ["RegB", 0, false], // RegB
		                 ["RegC", 0, false], // RegC
		                 ["RegD", 0, false], // RegD
		                 ["RegE", 0, false], // RegE
		                 ["RegF", 0, false]  // RegF
		                 ];
		
		// Memory storage
		// Initially zero before starting
		this.memory = new Array(256);
		  for (var i = 0; i < 256; i++) {
		    this.memory[i] = [0,0,0,0];
		  }
		
		// Stores initial values for memory
		// Used in resetting the program
		this.initMemory = [];
		
		// Stores initial values for variables
		// Used in resetting the program
		this.initVariables = [];

		// Converts a number to a hexidecimal with defined padding
		this.decimalToHex = function(d, padding) {
		  var hex = Number(d).toString(16);
		  padding = typeof (padding) === "undefined" || padding === null ? padding = 2 : padding;

		  while (hex.length < padding) {
		    hex = "0" + hex;
		  }

		  return hex;
		};
		
		// Performs the size checking of a register at index to ensure 16bit functionality
		// If overflow occurs, handles accordingly
		this.checkRegister = function(index) {
			var regValue = this.register[index][1];
			if(regValue > 32768){
				this.overflow = 1;
				var hex = this.decimalToHex(this.register[index][1]);
				var length = hex.length;
				var value = "";
				for(var i = 8; i >= 1; i--){
					value = value + hex[length-i];
				}
				this.register[index][1] = parseInt(value, 16);
			}
			if(regValue < -32768){
				var hex = this.decimalToHex(this.register[index][1]);
				var length = hex.length;
				var value = "";
				for(var i = 8; i >= 1; i--){
					value = value + hex[length-i];
				}
				this.register[index][1] = parseInt(value, 16);
			}
		};

		// Clears the values of the registers
		this.clearRegister = function() {
			for(var i = 0; i < 16; i++){
				this.register[i][1] = 0;
			}
		};
		
		// Goes through and checks through the table for changes
		// as well as which variables are in use.
		// Initializes the Registers and Variable arrays if needed.
		// If on figure tab, also populates Variable Table.
		this.init = function(){
			var table = document.getElementById(tableName);
			// "Compile"
			var progLine = 0;
			var memLine = 0;
			var refLine = 0;
			var index = 0;
			
			// Populate the labels array for memory lookup
			while(progLine<table.rows.length){
				if(table.rows[progLine].cells[this.labelNum].firstChild != null && table.rows[progLine].cells[this.labelNum].firstChild.nodeValue != null){
					var ref = table.rows[progLine].cells[this.labelNum].firstChild.nodeValue;
					this.labels[refLine++] = [ref, progLine + this.offSet];
					if(table.rows[progLine].cells[this.cmdNum].firstChild.nodeValue == ".Block") {
						this.offSet+=parseInt(table.rows[progLine].cells[this.arg1Num].firstChild.nodeValue, 10)-1;
					}
				}
				progLine++;
			}
			
			// Begin "assembling" into Machine code in this.memory
			progLine=0;
			while(progLine<table.rows.length){
				switch(table.rows[progLine].cells[this.cmdNum].firstChild.nodeValue){
				case ".Word": // .Word before program
					// Store firstChild.nodeValue based on argument
					var arg1 = table.rows[progLine].cells[this.arg1Num].firstChild.nodeValue;
					
					var hex = parseInt(arg1,10);
					// hex length checking goes here.
					hex = this.decimalToHex(hex, 4);
				    // Store in memory and update program counter
					this.memory[memLine] = [hex[0], hex[1], hex[2], hex[3]];
					this.initMemory[memLine++] = [hex[0], hex[1], hex[2], hex[3]];
					this.programCounter++;
					this.startCounter = this.programCounter;
					// Store variable for display
					this.variables[index] = [table.rows[progLine].cells[this.labelNum].firstChild.nodeValue, arg1];
					this.initVariables[index] = [this.variables[index][0], this.variables[index++][1]];
					break;
				
				case ".Block": // .Block before program
					// Reserve number of rows indicated by argument
					var arg1 = table.rows[progLine].cells[this.arg1Num].firstChild.nodeValue;
					for(var i = 0; i < arg1; i++) {
						this.memory[memLine] = ['0', '0', '0', '0'];
						this.initMemory[memLine++] = ['0', '0', '0', '0'];
						this.programCounter++;
					}
					// Store variable for display
					// Note: May behave strangely with multiple Words
					this.variables[index] = [table.rows[progLine].cells[this.labelNum].firstChild.nodeValue, 0];
					this.initVariables[index] = [this.variables[index][0], this.variables[index++][1]];
					break;
					
				case "LoadImm":  // 0000b LoadImm
					// Find and flag specified register
					var arg1, arg2;
					for(var i = 0; i < 16; i++){
						if(this.register[i][0] === table.rows[progLine].cells[this.arg1Num].firstChild.nodeValue){
							arg1 = i;
							this.register[i][2] = true;
							break;
						}
					}
					// Get value to be stored in Register
					arg2 = table.rows[progLine].cells[this.arg2Num].firstChild.nodeValue;
					var hex = parseInt(arg2,10);
					// hex length checking goes here.
					hex = this.decimalToHex(hex, 2);
				    // Store in memory
					this.memory[memLine++] = [0, arg1, hex[0], hex[1]];
					break;	
					
				case "Load":  // 0001b Load
					// Find and flag specified register
					var arg1, arg2, label;
					for(var i = 0; i < 16; i++){
						if(this.register[i][0] === table.rows[progLine].cells[this.arg1Num].firstChild.nodeValue){
							arg1 = i;
							this.register[i][2] = true;
							break;
						}
					}
					// Find correct memory location via label
					label = table.rows[progLine].cells[this.arg2Num].firstChild.nodeValue;
					for(var i = 0; i < this.labels.length; i++){
						if(this.labels[i][0] === label) {
							arg2 = this.labels[i][1];
							i+=this.labels.length;
						}
					}
					// Break memory up into hex location
					var hex = parseInt(arg2,10);
					hex = this.decimalToHex(hex, 2);
				    // Store in memory and update program counter
					this.memory[memLine++] = [1, arg1, hex[0], hex[1]];
					break;
					
				case "Store":  // 0010b Store
					// Find and flag specified register
					var arg1, arg2, label;
					for(var i = 0; i < 16; i++){
						if(this.register[i][0] === table.rows[progLine].cells[this.arg1Num].firstChild.nodeValue){
							arg1 = i;
							this.register[i][2] = true;
							break;
						}
					}
					// Find correct memory location via label
					label = table.rows[progLine].cells[this.arg2Num].firstChild.nodeValue;
					for(var i = 0; i < this.labels.length; i++){
						if(this.labels[i][0] === label) {
							arg2 = this.labels[i][1];
							i+=this.labels.length;
						}
					}
					// Convert decimal memory location to hex
					var hex = parseInt(arg2,10);
					hex = this.decimalToHex(hex, 2);
				    // Store in memory and update program counter
					this.memory[memLine++] = [2, arg1, hex[0], hex[1]];
					break;	
					
				case "LoadInd":  // 0011b LoadInd
					var arg1, arg2;
					// Find and flag specified Registers
					for(var i = 0; i < 16; i++){
						if(this.register[i][0] === table.rows[progLine].cells[this.arg1Num].firstChild.nodeValue){
							arg1 = i;
							this.register[i][2] = true;
							break;
						}
					}
					for(var i = 0; i < 16; i++){
						if(this.register[i][0] === table.rows[progLine].cells[this.arg2Num].firstChild.nodeValue){
							arg2 = i;
							this.register[i][2] = true;
							break;
						}
					}
					// Store in memory
					this.memory[memLine++] = [3, arg1, arg2, 0];
					break;
					
				case "StoreInd":  // 0100b StoreInd
					var arg1, arg2;
					// Find and flag specified registers
					for(var i = 0; i < 16; i++){
						if(this.register[i][0] === table.rows[progLine].cells[this.arg1Num].firstChild.nodeValue){
							arg1 = i;
							this.register[i][2] = true;
							break;
						}
					}
					for(var i = 0; i < 16; i++){
						if(this.register[i][0] === table.rows[progLine].cells[this.arg2Num].firstChild.nodeValue){
							arg2 = i;
							this.register[i][2] = true;
							break;
						}
					}
					// Store in memory
					this.memory[memLine++] = [4, arg1, arg2, 0];
					break;	
					
				case "Add":  // 0101b Add
					var arg1, arg2, arg3;
					// Find and flag the specified registers
					for(var i = 0; i < 16; i++){
						if(this.register[i][0] === table.rows[progLine].cells[this.arg1Num].firstChild.nodeValue){
							arg1 = i;
							this.register[i][2] = true;
							break;
						}
					}
					for (var i = 0; i < 16; i++){
						if(this.register[i][0] === table.rows[progLine].cells[this.arg2Num].firstChild.nodeValue){
							arg2 = i;
							this.register[i][2] = true;
							break;
						}
					}
					for (var i = 0; i < 16; i++){
						if(this.register[i][0] === table.rows[progLine].cells[this.arg3Num].firstChild.nodeValue){
							arg3 = i;
							this.register[i][2] = true;
							break;
						}
					}
					// Store in memory
					this.memory[memLine++] = [5, arg1, arg2, arg3];
					break;
					
				case "Sub":  // 0110b Subtract
					var arg1, arg2, arg3;
					// Find and flag specified registers
					for(var i = 0; i < 16; i++){
						if(this.register[i][0] === table.rows[progLine].cells[this.arg1Num].firstChild.nodeValue){
							arg1 = i;
							this.register[i][2] = true;
							break;
						}
					}
					for (var i = 0; i < 16; i++){
						if(this.register[i][0] === table.rows[progLine].cells[this.arg2Num].firstChild.nodeValue){
							arg2 = i;
							this.register[i][2] = true;
							break;
						}
					}
					for (var i = 0; i < 16; i++){
						if(this.register[i][0] === table.rows[progLine].cells[this.arg3Num].firstChild.nodeValue){
							arg3 = i;
							this.register[i][2] = true;
							break;
						}
					}
					// Store in memory
					this.memory[memLine++] = [6, arg1, arg2, arg3];
					break;
					
				
				case "And":  // 0111b And
					var arg1, arg2, arg3;
					// Find and flag specified registers
					for(var i = 0; i < 16; i++){
						if(this.register[i][0] === table.rows[progLine].cells[this.arg1Num].firstChild.nodeValue){
							arg1 = i;
							this.register[i][2] = true;
							break;
						}
					}
					for (var i = 0; i < 16; i++){
						if(this.register[i][0] === table.rows[progLine].cells[this.arg2Num].firstChild.nodeValue){
							arg2 = i;
							this.register[i][2] = true;
							break;
						}
					}
					for (var i = 0; i < 16; i++){
						if(this.register[i][0] === table.rows[progLine].cells[this.arg3Num].firstChild.nodeValue){
							arg3 = i;
							this.register[i][2] = true;
							break;
						}
					}
					// Store in memory
					this.memory[memLine++] = [7, arg1, arg2, arg3];
					break;
					
				case "Or":  // 1000b Or
					var arg1, arg2, arg3;
					// find and flag specified registers
					for(var i = 0; i < 16; i++){
						if(this.register[i][0] === table.rows[progLine].cells[this.arg1Num].firstChild.nodeValue){
							arg1 = i;
							this.register[i][2] = true;
							break;
						}
					}
					for (var i = 0; i < 16; i++){
						if(this.register[i][0] === table.rows[progLine].cells[this.arg2Num].firstChild.nodeValue){
							arg2 = i;
							this.register[i][2] = true;
							break;
						}
					}
					for (var i = 0; i < 16; i++){
						if(this.register[i][0] === table.rows[progLine].cells[this.arg3Num].firstChild.nodeValue){
							arg3 = i;
							this.register[i][2] = true;
							break;
						}
					}
					// Store in memory
					this.memory[memLine++] = [8, arg1, arg2, arg3];
					break;
					
				case "Not":  // 1001b Not
					var arg1, arg2;
					// Find and flag specified registers
					for(var i = 0; i < 16; i++){
						if(this.register[i][0] === table.rows[progLine].cells[this.arg1Num].firstChild.nodeValue){
							arg1 = i;
							this.register[i][2] = true;
							break;
						}
					}
					for (var i = 0; i < 16; i++){
						if(this.register[i][0] === table.rows[progLine].cells[this.arg2Num].firstChild.nodeValue){
							arg2 = i;
							this.register[i][2] = true;
							break;
						}
					}
					// Store in memory
					this.memory[memLine++] = [9, arg1, arg2, 0];
					break;
					
				case "ASL": // 1010b ASL
					var arg1, arg2, arg3;
					// Find and flag specified registers
					for(var i = 0; i < 16; i++){
						if(this.register[i][0] === table.rows[progLine].cells[this.arg1Num].firstChild.nodeValue){
							arg1 = i;
							this.register[i][2] = true;
							break;
						}
					}
					for (var i = 0; i < 16; i++){
						if(this.register[i][0] === table.rows[progLine].cells[this.arg2Num].firstChild.nodeValue){
							arg2 = i;
							this.register[i][2] = true;
							break;
						}
					}
					// Grab # of bits to shift
					arg3 = table.rows[progLine].cells[this.arg3Num].firstChild.nodeValue;
					// Store in memory
					this.memory[memLine++] = [10, arg1, arg2, arg3];
					break;
					
				case "ASR": // 1011b ASR
					var arg1, arg2, arg3;
					// Find and flag specified registers
					for(var i = 0; i < 16; i++){
						if(this.register[i][0] === table.rows[progLine].cells[this.arg1Num].firstChild.nodeValue){
							arg1 = i;
							this.register[i][2] = true;
							break;
						}
					}
					for (var i = 0; i < 16; i++){
						if(this.register[i][0] === table.rows[progLine].cells[this.arg2Num].firstChild.nodeValue){
							arg2 = i;
							this.register[i][2] = true;
							break;
						}
					}
					// Grab # of bits to shift
					arg3 = table.rows[progLine].cells[this.arg3Num].firstChild.nodeValue;
					// Store in memory
					this.memory[memLine++] = [11, arg1, arg2, arg3];
					break;
					
				case "Compare": // 1100b Compare
					var arg1, arg2, arg3;
					arg1 = 0;
					// Find and flag specified registers
					for(var i = 0; i < 16; i++){
						if(this.register[i][0] === table.rows[progLine].cells[this.arg1Num].firstChild.nodeValue){
							arg2 = i;
							this.register[i][2] = true;
							break;
						}
					}
					for (var i = 0; i < 16; i++){
						if(this.register[i][0] === table.rows[progLine].cells[this.arg2Num].firstChild.nodeValue){
							arg3 = i;
							this.register[i][2] = true;
							break;
						}
					}
					// Store in memory
					this.memory[memLine++] = [12, arg1, arg2, arg3];
					break;
					
				case "Branch": // 1101b Branch
					var arg1, arg2, label;
					// Determine boolean test
					switch(table.rows[progLine].cells[this.arg1Num].firstChild.nodeValue){
						case 'EQ':
							arg1 = 0;
							break;
						case 'NE':
							arg1 = 1;
							break;
						case 'LT':
							arg1 = 2;
							break;
						case 'LE':
							arg1 = 3;
							break;
						case 'GT':
							arg1 = 4;
							break;
						case 'GE':
							arg1 = 5;
							break;
						case 'CARRY':
							arg1 = 6;
							break;
						case 'NEG':
							arg1 = 7;
							break;
						case 'ZERO':
							arg1 = 8;
							break;
						case 'OVER':
							arg1 = 9;
							break;
					}
					// Find memory location to jump to
					label = table.rows[progLine].cells[this.arg2Num].firstChild.nodeValue;
					for(var i = 0; i < this.labels.length; i++){
						if(this.labels[i][0] === label) {
							arg2 = this.labels[i][1];
							i+=this.labels.length;
						}
					}
					// Convert to hex to store in memory
					var hex = parseInt(arg2,10);
					// hex length checking goes here.
					hex = this.decimalToHex(hex, 2);
				    // Store in memory
					this.memory[memLine++] = [13, arg1, hex[0], hex[1]];
					break;
					
				case "Jump": // 1110b Jump
					var arg1, arg2, label;
					arg1 = 0;
					// Find memory location to jump to
					label = table.rows[progLine].cells[this.arg1Num].firstChild.nodeValue;
					for(var i = 0; i < this.labels.length; i++){
						if(this.labels[i][0] == label) {
							arg2 = this.labels[i][1];
							i+=this.labels.length;
						}
					}
					// convert to hex to store in memory
					var hex = parseInt(arg2,10);
					console.log(hex);
					// hex length checking goes here.
					hex = this.decimalToHex(hex, 2);
				    // Store in memory
					this.memory[memLine++] = [14, arg1, hex[0], hex[1]];
					break;
					
				case "Halt": // 1111b Halt
					this.memory[memLine++] = [15, 0, 0, 0];
					break;
				}
			progLine++;	
			}
			// Iterate over registers to see which ones are used
			// Create cells in variable array for these registers
			for(var i = 0; i < 16; i++){
				if(this.register[i][2]){
					this.variables[index] = [this.register[i][0], 0];
					this.initVariables[index] = [this.variables[index][0], this.variables[index++][1]];
				}
			}
			// Signal that program has been parsed
			this.edited = false;
		};
		
		// Add two registers and store in the first
		// Logically: Reg1 = Reg2 + Reg3
		this.add = function(reg1, reg2, reg3){
			this.register[reg1][1] = this.register[reg2][1]+this.register[reg3][1];
			// Value/Flag checking
			this.checkRegister(reg1);
			if(this.register[reg1][1] === 0){
				this.zeroFlag = 1;
			} else { 
				this.zeroFlag = 0;
			}
			if(this.register[reg1][1] >= -1){
				this.negativeFlag = 1;
			} else {
				this.negativeFlag = 1;
			}
			// Update value in Variable array
			for(var i = 0; i < this.variables.length; i++){
				if(this.variables[i][0] == this.register[reg1][0]){
					this.variables[i][1] = this.register[reg1][1];
					break;
				}
			}
			// Debugging/Demo code
			console.log("Add " + this.register[reg2][0] + " and " + this.register[reg3][0]);
			console.log(this.register[reg1][0]+ "= " +this.register[reg1][1]);
		};

		// Subtract two registers and store in the first
		// Logically: Reg1 = Reg2 - Reg3
		this.sub = function(reg1, reg2, reg3){
			this.register[reg1][1] = this.register[reg2][1]-this.register[reg3][1];
			// Value/Flag checking
			this.checkRegister(reg1);
			if(this.register[reg1][1] === 0){
				this.zeroFlag = 1;
			} else { 
				this.zeroFlag = 0;
			}
			if(this.register[reg1][1] <= -1){
				this.negativeFlag = 1;
			} else {
				this.negativeFlag = 0;
			}

			// Update value in Variable array
			for(var i = 0; i < this.variables.length; i++){
				if(this.variables[i][0] == this.register[reg1][0]){
					this.variables[i][1] = this.register[reg1][1];
				}
			}
			// Debugging/Demo code
			console.log("Subtract " + this.register[reg2][0] + " and " + this.register[reg3][0]);
			console.log(this.register[reg1][0]+ "= " +this.register[reg1][1]);
		};

		//Store the data in reg into memory at location pointed to by value1 and value2
		// value1 and value2 are in hex
		this.store = function(reg, value1, value2){
			// Convert data from register into hex
			var hex = this.decimalToHex(this.register[reg][1], 4);
			// Store register data in hex in memory
			this.memory[parseInt(value1 + value2, 16)] = [hex[0],hex[1],hex[2],hex[3]];
			// Update value in Variable array
			var x = parseInt(value1 + value2,16);
			for(var i = 0; i < this.labels.length; i++){
				// Find variable name by memory location
				if(x == this.labels[i][1]){
					for(var j = 0; j < this.variables.length;j++){
						// Find variable by label
						if(this.variables[j][0]==this.labels[i][0]){
							this.variables[j][1] = this.register[reg][1];
						}
					}
				}
			}
			// Debug/Demo code
			console.log("Store " + this.register[reg][0] + " in Memory");
			console.log("Memory @" +x+ " = " + this.memory[x]);
		};

		// Performs Binary And on two registers and stores into the first
		// Logically: Reg1 = Reg2 AND Reg3
		this.and = function(reg1, reg2, reg3){
			this.register[reg1][1]=this.register[reg2][1]&this.register[reg3][1];
			this.checkRegister(reg1);
			// Update Variable array
			for(var i = 0; i < this.variables.length; i++){
				if(this.variables[i][0] == this.register[reg1][0]){
					this.variables[i][1] = this.register[reg1][1];
				}
			}
		};

		// Performs Binary Or on two registers and stores into the first
		// Logically: Reg1 = Reg2 OR Reg3
		this.or = function(reg1, reg2, reg3){
			this.register[reg1][1]=this.register[reg2][1]|this.register[reg3][1];
			this.checkRegister(reg1);
			// Update the Variable array
			for(var i = 0; i < this.variables.length; i++){
				if(this.variables[i][0] == this.register[reg1][0]){
					this.variables[i][1] = this.register[reg1][1];
				}
			}
		};

		// Performs Binary Not on a register and stores it into another
		// Logically: Reg1 = NOT Reg2
		this.not = function(reg1, reg2){
			this.register[reg1][1] = ~this.register[reg2][1];
			this.checkRegister(reg1);
			// Update the Variable array
			for(var i = 0; i < this.variables.length; i++){
				if(this.variables[i][0] == this.register[reg1][0]){
					this.variables[i][1] = this.register[reg1][1];
				}
			}
		};

		// Performs the Arithmetic Shift Left on the given register by #bits
		// Logically: Reg1 = ASL Reg2 #Bits
		this.asl = function(reg1, reg2, bits){
			// Parse number of bits (in hex)
			var tBits = parseInt(bits,16);
			this.register[reg1][1] = this.register[reg2][1] << tBits;
			this.checkRegister(reg1);
			// Update the variable array
			for(var i = 0; i < 16; i++){
				if(this.variables[i][0] == this.register[reg1][0]){
					this.variables[i][1] = this.register[reg1][1];
				}
			}
		};

		// Performs the Arithmetic Shift Right on the given register by #bits
		// Logically: Reg1 = ASR Reg2 #Bits
		this.asr = function(reg1, reg2, bits){
			// Parse number of bits (in hex)
			var tBits = parseInt(bits,16);
			this.register[reg1][1] = this.register[reg2][1] >>> tBits;
			this.checkRegister(reg1);
			// Update the variable array
			for(var i = 0; i < this.variables.length; i++){
				if(this.variables[i][0] == this.register[reg1][0]){
					this.variables[i][1] = this.register[reg1][1];
				}
			}
		};

		// Store a value in memory pointed at by another register
		this.storeInd = function(reg1, reg2){
			this.memory[this.register[reg2][1]] = this.register[reg1][1];
			// Updating of the Variable array
			var x = parseInt(this.register[reg2][1],16);
			for(var i = 0; i < this.labels.length; i++){
				// Find memory name via location
				if(x == this.labels[i][1]){
					for(var j = 0; j < this.labels.length;j++){
						// Update via label name
						if(this.variables[j][0]==this.labels[i][0]){
							this.variables[j][1] = this.register[reg1][1];
						}
					}
				}
			}
		};

		// Load value stored in memory into register
		// mem1 and mem2 are in hex
		this.load = function(reg, mem1, mem2){
			// Get value from memory
			var num = this.memory[parseInt(mem1 + mem2, 16)];
			// Store value into register
			this.register[reg][1] = parseInt(num[0]+num[1]+num[2]+num[3], 16);
			// Update Variable array
			for(var i = 0; i < this.variables.length; i++){
				if(this.variables[i][0] == this.register[reg][0]){
					this.variables[i][1] = this.register[reg][1];
				}
			}
			// Debug/Demo Code
			console.log("Load " + this.register[reg][0]);
			console.log(this.register[reg][0]+ "= " +this.register[reg][1]);
		};

		// Load a given value into a register
		// value1 and value2 are in hex
		this.loadImm = function(reg, value1, value2){
			// Parse and store value into register
			this.register[reg][1] = parseInt(value1 + value2, 16);
			// Update Variable array
			for(var i = 0; i < this.variables.length; i++){
				if(this.variables[i][0] == this.register[reg][0]){
					this.variables[i][1] = this.register[reg][1];
				}
			}
			// Debug/Demo code
			console.log("LoadImm " + this.register[reg][0]);
			console.log(this.register[reg][0]+ "= " +this.register[reg][1]);
		};

		// Load into a register the value in memory pointed to by another register
		this.loadInd = function(reg1, reg2){
			// Reference and store value
			this.register[reg1][1] = this.memory[this.register[reg2][1]];
			// Update Variable Array
			for(var i = 0; i < this.variables.length; i++){
				if(this.variables[i][0] == this.register[reg1][0]){
					this.variables[i][1] = this.register[reg1][1];
				}
			}
		};

		// Compares two registers and sets flags accordingly
		this.compare = function(reg1, reg2){
				var number = this.register[reg1][1] - this.register[reg2][1];

				if (number < 0){
					this.negativeFlag = 1;
				}else{
					this.negativeFlag = 0;
				}
				if(number == 0){
					this.zeroFlag = 1;
				}else{
					this.zeroFlag = 0;
				}
				console.log("Compare "+this.register[reg1][0]+" and "+this.register[reg2][0]);
		};

		// Observes flags set by Compare and adjusts program counter accordingly
		this.branch = function(cond, addr1, addr2){
			console.log("Branch "+cond);
			console.log("Neg "+this.negativeFlag);
			console.log("Zero "+this.zeroFlag);
			if (cond == "0"){
			//EQ
				if(this.zeroFlag == 1){
					this.jump(addr1, addr2);
					return;
				}
			}
			else if (cond == "1"){
			//NE
				if(this.zeroFlag == 0){
					this.jump(addr1, addr2);
					return;
				}
			}
			else if (cond == "2"){
			//LT
				if(this.negativeFlag == 1){
					this.jump(addr1, addr2);
					return;
				}
			}
			else if (cond == "3"){
			//LE
				if(this.zeroFlag == 1 || this.negativeFlag == 1){
					this.jump(addr1, addr2);
					return;
				}
			}
			else if (cond == "4"){
			//GT
				if(this.zeroFlag == 0 && this.negativeFlag == 0){
					this.jump(addr1, addr2);
					return;
				}
			}
			else if (cond == "5"){
			//GE
				if(this.negativeFlag == 0){
					this.jump(addr1, addr2);
					return;
				}
			}
			else if (cond == "6"){
			//CARY
				if(this.carryFlag == 1){
					this.jump(addr1, addr2);
					return;
				}
			}
			else if (cond == "7"){
			//Neg
				if(this.negativeFlag == 1){
					this.jump(addr1, addr2);
					return;
				}
			}
			else if (cond == "8"){
			//Zero
				if(this.zeroFlag == 1){
					this.jump(addr1, addr2);
					return;
				}
			}
			else if (cond == "9"){
			//over
				if(this.overflowFlag == 1){
					this.jump(addr1, addr2);
					return;
				}
			}
			this.programCounter++;
				
		};
		
		// Sets program counter to be equal to the given memory address
		this.jump = function(addr1, addr2){
			this.programCounter = parseInt(addr1+addr2, 16);
			console.log("Jump "+addr1+addr2);
		};
		
		// Sets the stop flag to true.
		// Essentially tells the program to stop.
		// Also resets the program counter.
		this.halt = function() {
			clearInterval(this.intervalID);
			this.stop = true;
			var table = document.getElementById(tableName);
			var numCells = table.rows[this.programCounter].cells.length;
			for (var i = 0; i < numCells; i++) {										// iterate throughout the cells
				table.rows[this.programCounter].cells[i].style.color = '#000000';			// highlight all cells black
			}
			this.done = true;
		};
		
		// Evaluates the command at the given line.
		// Essentially the core interpreter of the program
		// Changes RegN values into index numbers
		this.eval = function(line){
			switch(this.memory[line][0]){
				case 0:  // 0000b LoadImm
					this.loadImm(this.memory[line][1],this.memory[line][2],this.memory[line][3]);
					this.programCounter++;
					break;
				case 1:  // 0001b Load
					this.load(this.memory[line][1],this.memory[line][2],this.memory[line][3]);
					this.programCounter++;
					break;
				case 2:  // 0010b Store
					this.store(this.memory[line][1],this.memory[line][2],this.memory[line][3]);
					this.programCounter++;
					break;
				case 3:  // 0011b LoadInd
					this.loadInd(this.memory[line][1],this.memory[line][2]);
					this.programCounter++;
					break;
				case 4:  // 0100b StoreInd
					this.storeInd(this.memory[line][1],this.memory[line][2]);
					this.programCounter++;
					break;
				case 5:  // 0101b Add
					this.add(this.memory[line][1],this.memory[line][2],this.memory[line][3]);
					this.programCounter++;
					break;	
				case 6:  // 0110b Subtract
					this.sub(this.memory[line][1],this.memory[line][2],this.memory[line][3]);
					this.programCounter++;
					break;
				case 7:  // 0111b And
					this.and(this.memory[line][1],this.memory[line][2],this.memory[line][3]);
					this.programCounter++;
					break;
				case 8:  // 1000b Or
					this.or(this.memory[line][1],this.memory[line][2],this.memory[line][3]);
					this.programCounter++;
					break;
				case 9:  // 1001b Not
					this.not(this.memory[line][1],this.memory[line][2],this.memory[line][3]);
					this.programCounter++;
					break;	
				case 10: // 1010b ASL
					this.asl(this.memeory[line][1],this.memory[line][2],this.memory[line][3]);
					this.programCounter++;
					break;
				case 11: // 1011b ASR
					this.asr(this.memory[line][1],this.memory[line][2],this.memory[line][3]);
					this.programCounter++;
					break;
				case 12: // 1100b Compare
					this.compare(this.memory[line][2],this.memory[line][3]);
					this.programCounter++;
					break;
				case 13: // 1101b Branch
					this.branch(this.memory[line][1],this.memory[line][2],this.memory[line][3]);
					break;
				case 14: // 1110b Jump
					console.log(this.memory[line][2] + "" + this.memory[line][3]);
					this.jump(this.memory[line][2],this.memory[line][3]);
					break;
				case 15: // 1111b Halt
					this.halt();
					break;	
			}
		};
		
		// Walks through one step of the program
		this.walk = function() {
			var table = document.getElementById(this.tableName);
			var numCells = table.rows[this.programCounter-this.offSet].cells.length;
			if(this.edited) {
				this.init();
				this.previousCounter = this.programCounter;
				console.log("Program Initialized");
			} 
			if(this.done){
				this.reset();
			}
			if(!this.stop) {
				
				for (var i = 0; i < numCells; i++) {										// iterate throughout the cells
					table.rows[this.previousCounter-this.offSet].cells[i].style.color = '#000000';			// highlight all cells black
				}					// grab the number of cells for this row
				this.previousCounter = this.programCounter;
				for (var i = 0; i < numCells; i++) {										// iterate throughout the cells
					table.rows[this.programCounter-this.offSet].cells[i].style.color = '#FF0000';		// highlight all cells red
				}
				parser.eval(this.programCounter);
				
			} else {
				this.stop = false;
			}
			
		};
		
		// Runs through the program
		// First checks if the code has recently been edited.
		this.run= function() {
			if(this.edited) {
				this.init();
				console.log("Program Initialized");
			}
			if(this.done) {
				this.reset();
			}
			//this.intervalID = setInterval(function() {parser.walk();}, 1000);
			console.log(this.variables.toString());
			// Convert Run button to Pause and Walk to Reset
		};	
			

		// Pauses execution of program
		this.pause = function() {
			//clearInterval(this.intervalID);
			// Convert Pause button to Run and Reset to Walk
		};
		
		// Resets the program counter and restores program to original state
		this.reset = function() {
			this.programCounter = this.startCounter;
			// Need to reset Memory
			for(var i = 0; i < this.programCounter; i++) {
				this.memory[i][0] = this.initMemory[i][0];
				this.memory[i][1] = this.initMemory[i][1];
				this.memory[i][2] = this.initMemory[i][2];
				this.memory[i][3] = this.initMemory[i][3];
			}
			for(var i = 0; i < this.variables.length; i ++) {
				this.variables[i][0] = this.initVariables[i][0];
				this.variables[i][1] = this.initVariables[i][1];
			}
			//this.clearRegister();
			this.done = false;
		};
		
		// Returns the current value of the program counter
		this.returncounter = function(){
			console.log(this.programCounter);
			var progcount = this.programCounter;
			return progcount;
			
		};
		
	};
	
	this.$get = function(){
		return assembler;
	};
	
	});
	
	tabsstuff.controller('assemblycontroller', function($scope, assembler, $interval){
		
			$scope.tabs = [];
			
			$scope.error = function() {document.write('<h1>you broke it.</h1>');};
			

			var tableName = "program";
			var varTable = "variables";
			var bool = false;
			

			$scope.assembler = new assembler(tableName, varTable, bool);
			
			$scope.architecture = function(){
				var variables = $scope.assembler.variables;
				$scope.variables = [{title: variables[0], titletoo: variables[5]}, 
									{title: variables[1], titletoo: variables[6]},
				                    {title: variables[2], titletoo: variables[7]}, 
									{title: variables[3], titletoo: variables[8]},
				                    {title: variables[4], titletoo: variables[9]}, 
				                    ];
				var register = $scope.assembler.register;
				$scope.register = [{content: register[0][0], value: register[0][1]},
				                   {content: register[1][0], value: register[1][1]},
				                   {content: register[2][0], value: register[2][1]},
				                   {content: register[3][0], value: register[3][1]},
				                   {content: register[4][0], value: register[4][1]},
				                   {content: register[5][0], value: register[5][1]},
				                   {content: register[6][0], value: register[6][1]},
				                   {content: register[7][0], value: register[7][1]},
				                   {content: register[8][0], value: register[8][1]},
				                   {content: register[9][0], value: register[9][1]},
				                   {content: register[10][0], value: register[10][1]},
				                   {content: register[11][0], value: register[11][1]},
				                   {content: register[12][0], value: register[12][1]},
				                   {content: register[13][0], value: register[13][1]},
				                   {content: register[14][0], value: register[14][1]},
				                   {content: register[15][0], value: register[15][1]},
				                   ];
				var carryFlag = $scope.assembler.carryFlag;
				$scope.carryFlag = [{content:carryFlag}];
				var negativeFlag = $scope.assembler.negativeFlag;
				$scope.negativeFlag = [{content:negativeFlag}];
				var zeroFlag = $scope.assembler.zeroFlag;
				$scope.zeroFlag = [{content:zeroFlag}];
				var overflowFlag = $scope.assembler.overflowFlag;
				$scope.overflowFlag = [{content:overflowFlag}];
				var counter = $scope.assembler.returncounter();
				$scope.counter = [{content:counter}];
				var memory = $scope.assembler.memory;
				$scope.memory = [{memno: 0, content: memory[0], code: "Total"},{memno: 1, content: memory[1], code: "ABC"},{memno: 2, content: memory[2], code: "XYZ"},{memno: 3, content: memory[3]},
				                {memno: 4, content: memory[4]},{memno: 5, content: memory[5]},{memno: 6, content: memory[6]},{memno: 7, content: memory[7]},{memno: 8, content: memory[8]},{memno: 9, content: memory[9]},{memno: 0, content: memory[10]},
								{memno: 0, content: memory[11]},{memno: 0, content: memory[12]},{memno: 0, content: memory[13]},{memno: 0, content: memory[14]},{memno: 0, content: memory[15]},{memno: 0, content: memory[16]},
								{memno: 0, content: memory[17]},{memno: 0, content: memory[18]},{memno: 0, content: memory[19]},{memno: 0, content: memory[20]},{memno: 0, content: memory[21]},{memno: 0, content: memory[22]},{memno: 0, content: memory[23]},
								{memno: 0, content: memory[24]},{memno: 0, content: memory[25]},{memno: 0, content: memory[26]},{memno: 0, content: memory[27]},{memno: 0, content: memory[28]},{memno: 0, content: memory[29]},
								{memno: 0, content: memory[30]},{memno: 0, content: memory[31]},{memno: 32, content: memory[32]},{memno: 33, content: memory[33]},{memno: 0, content: memory[34]},{memno: 0, content: memory[35]},
								{memno: 0, content: memory[36]},{memno: 0, content: memory[37]},{memno: 0, content: memory[38]},{memno: 0, content: memory[39]},{memno: 0, content: memory[40]},{memno: 0, content: memory[41]},
								{memno: 0, content: memory[42]},{memno: 0, content: memory[43]},{memno: 0, content: memory[44]},{memno: 0, content: memory[45]},{memno: 0, content: memory[46]},{memno: 0, content: memory[47]},
								{memno: 0, content: memory[48]},{memno: 0, content: memory[49]},{memno: 0, content: memory[50]},{memno: 0, content: memory[51]},{memno: 0, content: memory[52]},{memno: 0, content: memory[53]},
								{memno: 0, content: memory[54]},{memno: 0, content: memory[55]},{memno: 0, content: memory[56]},{memno: 0, content: memory[57]},{memno: 0, content: memory[58]},{memno: 0, content: memory[59]},{memno: 0, content: memory[60]},
								{memno: 0, content: memory[61]},{memno: 0, content: memory[62]},{memno: 0, content: memory[63]},{memno: 0, content: memory[64]},{memno: 0, content: memory[65]},{memno: 0, content: memory[66]},
								{memno: 0, content: memory[67]},{memno: 0, content: memory[68]},{memno: 0, content: memory[69]},{memno: 0, content: memory[70]},{memno: 0, content: memory[71]},{memno: 0, content: memory[72]},
								{memno: 0, content: memory[73]},{memno: 0, content: memory[74]},{memno: 0, content: memory[75]},{memno: 0, content: memory[76]},{memno: 0, content: memory[77]},{memno: 0, content: memory[78]},
								{memno: 0, content: memory[79]},{memno: 0, content: memory[80]},{memno: 0, content: memory[81]},{memno: 0, content: memory[82]},{memno: 0, content: memory[83]},{memno: 0, content: memory[84]},
								{memno: 0, content: memory[85]},{memno: 0, content: memory[86]},{memno: 0, content: memory[87]},{memno: 0, content: memory[88]},{memno: 0, content: memory[89]},{memno: 0, content: memory[90]},
								{memno: 0, content: memory[91]},{memno: 0, content: memory[92]},{memno: 0, content: memory[93]},{memno: 0, content: memory[94]},{memno: 0, content: memory[95]},{memno: 0, content: memory[96]},
								{memno: 0, content: memory[97]},{memno: 0, content: memory[98]},{memno: 0, content: memory[99]},{memno: 0, content: memory[100]},{memno: 0, content: memory[101]},{memno: 0, content: memory[102]},
								{memno: 0, content: memory[103]},{memno: 0, content: memory[104]},{memno: 0, content: memory[105]},{memno: 0, content: memory[106]},{memno: 0, content: memory[107]},{memno: 0, content: memory[108]},
								{memno: 0, content: memory[109]},{memno: 0, content: memory[110]},{memno: 0, content: memory[111]},{memno: 0, content: memory[112]},{memno: 0, content: memory[113]},{memno: 0, content: memory[114]},
								{memno: 0, content: memory[115]},{memno: 0, content: memory[116]},{memno: 0, content: memory[117]},{memno: 0, content: memory[118]},{memno: 0, content: memory[119]},{memno: 0, content: memory[120]},
								{memno: 0, content: memory[121]},{memno: 0, content: memory[122]},{memno: 0, content: memory[123]},{memno: 0, content: memory[124]},{memno: 0, content: memory[125]},{memno: 0, content: memory[126]},
								{memno: 0, content: memory[127]},{memno: 0, content: memory[128]},{memno: 0, content: memory[129]},{memno: 0, content: memory[120]},{memno: 0, content: memory[121]},{memno: 0, content: memory[122]},
								{memno: 0, content: memory[123]},{memno: 0, content: memory[124]},{memno: 0, content: memory[125]},{memno: 0, content: memory[126]},{memno: 0, content: memory[127]},{memno: 0, content: memory[128]},
								{memno: 0, content: memory[129]},{memno: 0, content: memory[130]},{memno: 0, content: memory[131]},{memno: 0, content: memory[132]},{memno: 0, content: memory[133]},{memno: 0, content: memory[134]},
								{memno: 0, content: memory[135]},{memno: 0, content: memory[136]},{memno: 0, content: memory[137]},{memno: 0, content: memory[138]},{memno: 0, content: memory[139]},{memno: 0, content: memory[140]},
								{memno: 0, content: memory[141]},{memno: 0, content: memory[142]},{memno: 0, content: memory[143]},{memno: 0, content: memory[144]},{memno: 0, content: memory[145]},{memno: 0, content: memory[146]},
								{memno: 0, content: memory[147]},{memno: 0, content: memory[148]},{memno: 0, content: memory[149]},{memno: 0, content: memory[150]},{memno: 0, content: memory[151]},{memno: 0, content: memory[152]},
								{memno: 0, content: memory[153]},{memno: 0, content: memory[154]},{memno: 0, content: memory[155]},{memno: 0, content: memory[156]},{memno: 0, content: memory[157]},{memno: 0, content: memory[158]},
								{memno: 0, content: memory[159]},{memno: 0, content: memory[160]},{memno: 0, content: memory[161]},{memno: 0, content: memory[162]},{memno: 0, content: memory[163]},{memno: 0, content: memory[164]},
								{memno: 0, content: memory[165]},{memno: 0, content: memory[166]},{memno: 0, content: memory[167]},{memno: 0, content: memory[168]},{memno: 0, content: memory[169]},{memno: 0, content: memory[170]},
								{memno: 0, content: memory[171]},{memno: 0, content: memory[172]},{memno: 0, content: memory[173]},{memno: 0, content: memory[174]},{memno: 0, content: memory[175]},{memno: 0, content: memory[176]},
								{memno: 0, content: memory[177]},{memno: 0, content: memory[178]},{memno: 0, content: memory[179]},{memno: 0, content: memory[180]},{memno: 0, content: memory[181]},{memno: 0, content: memory[182]},
								{memno: 0, content: memory[183]},{memno: 0, content: memory[184]},{memno: 0, content: memory[185]},{memno: 0, content: memory[186]},{memno: 0, content: memory[187]},{memno: 0, content: memory[188]},
								{memno: 0, content: memory[189]},{memno: 0, content: memory[190]},{memno: 0, content: memory[191]},{memno: 0, content: memory[192]},{memno: 0, content: memory[193]},{memno: 0, content: memory[194]},
								{memno: 0, content: memory[195]},{memno: 0, content: memory[196]},{memno: 0, content: memory[197]},{memno: 0, content: memory[198]},{memno: 0, content: memory[199]},{memno: 0, content: memory[200]},
								{memno: 0, content: memory[201]},{memno: 0, content: memory[202]},{memno: 0, content: memory[203]},{memno: 0, content: memory[204]},{memno: 0, content: memory[205]},{memno: 0, content: memory[206]},
								{memno: 0, content: memory[207]},{memno: 0, content: memory[208]},{memno: 0, content: memory[209]},{memno: 0, content: memory[210]},{memno: 0, content: memory[211]},{memno: 0, content: memory[212]},
								{memno: 0, content: memory[213]},{memno: 0, content: memory[214]},{memno: 0, content: memory[215]},{memno: 0, content: memory[216]},{memno: 0, content: memory[217]},{memno: 0, content: memory[218]},
								{memno: 0, content: memory[219]},{memno: 0, content: memory[220]},{memno: 0, content: memory[221]},{memno: 0, content: memory[222]},{memno: 0, content: memory[223]},{memno: 0, content: memory[224]},
								{memno: 0, content: memory[225]},{memno: 0, content: memory[226]},{memno: 0, content: memory[227]},{memno: 0, content: memory[228]},{memno: 0, content: memory[229]},{memno: 0, content: memory[220]},
								{memno: 0, content: memory[221]},{memno: 0, content: memory[222]},{memno: 0, content: memory[223]},{memno: 0, content: memory[224]},{memno: 0, content: memory[225]},{memno: 0, content: memory[226]},
								{memno: 0, content: memory[227]},{memno: 0, content: memory[228]},{memno: 0, content: memory[229]},{memno: 0, content: memory[230]},{memno: 0, content: memory[231]},{memno: 0, content: memory[232]},
								{memno: 0, content: memory[233]},{memno: 0, content: memory[234]},{memno: 0, content: memory[235]},{memno: 0, content: memory[236]},{memno: 0, content: memory[237]},{memno: 0, content: memory[238]},
								{memno: 0, content: memory[239]},{memno: 0, content: memory[240]},{memno: 0, content: memory[241]},{memno: 0, content: memory[242]},{memno: 0, content: memory[243]},{memno: 0, content: memory[244]},
								{memno: 0, content: memory[245]},{memno: 0, content: memory[246]},{memno: 0, content: memory[247]},{memno: 0, content: memory[248]},{memno: 0, content: memory[249]},{memno: 0, content: memory[250]},
								{memno: 0, content: memory[251]},{memno: 0, content: memory[252]},{memno: 0, content: memory[253]},{memno: 0, content: memory[254]},{memno: 0, content: memory[255]}
								];
			};
			
			$scope.architecture();
			
			$scope.pause = function(){
				$scope.assembler.pause();
				$scope.architecture();
				$interval.cancel(intervalId);
			};
			
			
			
			$scope.reset = function(){
				$scope.assembler.reset();
				$scope.architecture();
				$interval.cancel(intervalId);

			};
			
			$scope.walk = function(){
				$scope.done = $scope.assembler.done;
				if($scope.done == true){
					$interval.cancel(intervalId);
				};	
				if($scope.done == false){
					$scope.assembler.walk();
				};
				$scope.architecture();
				
			};
		
			var intervalId;
			
			$scope.run = function(){
				$scope.assembler.run();
				$scope.architecture();
				intervalId = $interval($scope.walk, 1000);
			};
			

	});
