// tower.js - Tower of Mystery text adventure game

// Set up at text box for a screen.
const SIZE = 25;
var text = new TextBox("field", SIZE);

const exits = ["n", "s", "e", "w", "u", "d",
				"north", "south", "east", "west", "up", "down"];

// Clear the screen
for (var i = 0; i < SIZE; i++)
	text.println("");

class Room {
	constructor(description, contents, exits) {
		this.description = description;
		this.contents = contents;
		this.exits = exits;
	}

	describe() {
		text.println(this.description);

		if (this.contents.length > 0) {
			text.println("You see:");

			for (var item of this.contents)
				text.println(item.description);
		}

		if (this.exits.length > 0) {
			var exitstr = "";

			text.println("Exits are:");

			for (var i = 0; i < exits.length / 2; i++)
				if (this.exits[i] != -1)
					exitstr += exits[i].toUpperCase() + " ";
				
			text.println(exitstr);
		}
	}
}

class Thing {
	constructor(description, takable=true) {
		this.description = description;
		this.takable = takable
	}
}

class Player {
	constructor(start=null) {
		this.inventory = [];
		this.room = start;
		this.counter = 0;
	}

	go(direction) {
		if (!exits.includes(direction))
			return true;

		var i = exits.indexOf(direction[0]);

		if (player.room.exits[i] == -1) {
			text.println("You can't go that way.")
		} else if (player.room == rooms[3] && !flags.ratsAsleep) {
			text.println("The rats look too fierce.")
		} else {
			player.room = rooms[player.room.exits[i]];
			flags.wantDescription = true;
		}

		return true;
	}

	take(object) {
		if (object == null) {
			text.println("Please give an object.");
			return false;
		} else if (!object.takable) {
			text.println("That's beyond your ability.");
			return true;
		} else if (this.inventory.includes(object)) {
			text.println("You already have it!");
			return false;
		} else {
			// FIXME -- ?
			if (object == things["termi"] && !flags.coinFound) {
				text.println("There was a coin under it.");
				player.room.contents.push(things["coin"]);
				flags.coinFound = true;
			} else if (object == things["tape"]) {
				flags.mountedTape = false;
			}

			this.room.contents.remove(object);
			this.inventory.push(object);
			text.println("O.K.");
		}

		return true;
	}

	eat(object) {
		if (object != things["candy"]) {
			text.println("That's silly!");
		} else {
			text.println("GAG! COUGH! CHOKE! PUKE!");
			if (player.room.contents.includes(things["candy"]))
				player.room.contents.remove(things["candy"]);

			if (player.inventory.includes(things["candy"]))
				player.inventory.remove(things["candy"]);
		}
	}

	kick(object) {
		if (object == null) {
			text.println("Please give an object.");
			return false;
		} else if (object != things["compu"] || flags.computerDead) {
			text.println("Nothing happens.");
		} else if (flags.computerActive) {
			player.counter = 9;
		} else {
			text.println("The computer starts up!");
			text.println("The console displays: 'PLEASE LOG IN.'");
			flags.computerActive = true;
		}

		return true;
	}

	inser(object) {
		if (object == null) {
			text.println("Please give an object.");
			return false;
		} else if (object != things["coin"]) {
			text.println("That's silly!");
			return false;
		} else if (player.room != rooms[5]) {
			text.println("You can't do that now.");
		} else {
			player.inventory.remove(things["coin"]);
			player.room.contents.push(things["candy"]);
			text.println("A candy bar comes out.");
		}

		return true;
	}

	type(word) {
		if (word == null) {
			text.println("Please give a word.");
			return false;
		} else if (player.room != rooms[9]) {
			text.println("You can't do that now.");
		} else if (!flags.computerActive) {
			text.println("The computer isn't running.");
		} else if (!flags.loggedIn) {
			if (word == 'road') {
				text.println("'ROAD' logged in.'");
				flags.loggedIn = true;
			} else {
				text.println("'Invalid login ID.'");
			}
		} else if (!flags.copyRunning) {
			if (word == "dir") {
				text.println("'COPY LOGOU ADVEN'");
			} else if (word == "adven") {
				text.println("'Welcome to Adventure! W#uld Y#$*'");
				player.counter = 9;
			} else if (word == "copy") {
				text.println("Mount tape then type filename.");
				flags.copyRunning = true;
			} else {
				text.println("'Invalid command.'");
			}
		} else {
//			flags.copyRunning = false;
			if (flags.mountedTape) {
				if (["copy", "dir", "adven"].includes(word)) {
					text.println("The tape spins...");
					text.println("'File copied.'");

					if (word == "adven") {
						text.println("Congratulations, you've done it!");
						flags.gameOver = true;
					}
				} else {
					text.println("'No such file'");
				}
			} else {
				text.println("'Error: tape not mounted'");
			}
		}
 
		return true;
	}

	get(object) {
		this.take(object)
	}

	drop(object) {
		if (object == null) {
			text.println("Please give an object.");
			return false;
		} else if (!this.inventory.includes(object)) {
			text.println("You don't have it.");
		} else {
			this.inventory.remove(object);
			this.room.contents.push(object);

			if (player.room == rooms[3] && object == things["candy"]) {
				text.println("The rats devour the candy and get sleepy.");
				player.room.contents.remove(things["candy"]);
				things["rats"].description = "Sleepy rats";
				flags.ratsAsleep = true;
			}
		}

		return true;
	}

	look(object) {
		flags.wantDescription = true;
		return false;
	}

	inven(object) {
		text.println("You are carrying:");
		if (this.inventory.length == 0)
			text.println("Nothing.");
		else
			for (var thing of this.inventory)
				text.println(thing.description);

		return true;
	}

	mount(object) {
		if (object == null) {
			text.println("Please give an object.");
			return false;
		} else if (object != things["tape"]) {
			text.println("That's silly!");
			return false;
		} else if (player.room != rooms[9] || flags.mountedTape) {
			text.println("You can't do that now.");
		} else {
			player.inventory.remove(things["tape"]);
			player.room.contents.push(things["tape"]);
			flags.mountedTape = true;
			text.println("O.K.");
		}

		return true;
	}

	read(object) {
		if (object == null) {
			text.println("Please give an object.");
			return false;
		} else if (object == things["machi"]) {
			text.println("'INSERT COIN'");
		} else if (object == things["manua"]) {
			text.println("'...USER ID IS ROAD...'");
			text.println("'TYPE DIR FOR LIST OF COMMANDS...'");
			text.println("The rest is illegible.");
		} else {
			text.println("Nothing is written on it.");
		}

		return true;
	}

	fight(object) {
		text.println("That won't work.");
	}

	start(object) {
		if (object == null) {
			text.println("Please give an object.");
			return false;
		} else if (object == things["compu"]) {
			text.println("Nothing happens.");
		} else {
			text.println("That's silly!");
			return false;
		}

		return true;
	}

	open(object) {
		if (object == null) {
			text.println("Please give an object.");
			return false;
		} else if (object == things["desk"]) {
			if (flags.manualFound) {
				text.println("It already is.");
			} else {
				player.room.contents.push(things["manua"]);
				flags.manualFound = true;
				text.println("Inside it is a manual.");
			}
		} else {
			text.println("That's silly!");
			return false;
		}

		return true;
	}

	wind(object) {
		if (object == things["clock"]) {
			if (flags.bats) {
				text.println("The clock chimes deafeningly and something flies past.");
				rooms[12].contents.remove(things["bats"]);
				flags.bats = false;
			} else {
				text.println("It's fully wound.");
			}
		} else {
			text.println("That's silly!");
		}

		return true;	
	}

	exami(object) {
		if (object == things["machi"] || object ==  things["manua"])
			text.println("Something is written there.");
		else if (object == things["desk"] && !flags.manualFound)
			text.println("It is closed.");
		else if (object == things["termi"])
			text.println("it looks beyond repair.");
		else if (object == things["compu"])
			text.println("This is an ancient mainframe with a console.");
		else if (object == things["clock"])
			text.println("There is a large handle for winding the clock.");
		else if (object == things["tape"] && flags.mountedTape)
			text.println("It is mounted on the computer.");
		else
			text.println("You see nothing special.");

		return true;
	}
}

var flags = {
	wantDescription:	true,
	coinFound:			false,
	ratsAsleep:			false,
	computerActive:		false,
	manualFound:		false,
	computerDead:		false,
	loggedIn:			false,
	bats:				true,
	mountedTape:		false,
	copyRunning:		false,
	gameOver:			false
};

var things = {
	"rats" :	new Thing("Hungry rats", false),
	"tape" :	new Thing("Computer tape", true), 
	"machi":	new Thing("Vending machine", false), 
	"termi":	new Thing("Broken-down terminal", true), 
	"coin" :	new Thing("Coin", true), 
	"candy":	new Thing("Candy Bar", true), 
	"compu":	new Thing("Computer", false), 
	"bats" :	new Thing("Bats", false), 
	"desk" :	new Thing("Desk", false), 
	"manua":	new Thing("Computer Manual", true), 
	"clock":	new Thing("Elaborate Clockwork", false)
};

var rooms = [
	new Room("You are in front of an old factory with a clock tower.", [], [1, -1, -1, -1, -1, -1]),
	new Room("You are at the bottom of the stairwell.", [], [2, 0, -1, -1, 6, -1]),
	new Room("You are at the top of some basement steps.", [], [-1, 1, -1, -1, -1, 3]),
	new Room("You are in a damp cellar.", [things["rats"]], [-1, -1, 4, -1, 2, -1]),
	new Room("You are in a storeroom.", [things["tape"]], [-1, -1, -1, 3, -1, -1]),
	new Room("You are in the cafeteria.", [things["machi"]], [-1, -1, 6, -1, -1, -1]),
	new Room("You're at a landing on the stairs.", [], [-1, -1, 7, 5, 8, 1]),
	new Room("Around you is a manufacturing area.", [things["termi"]], [-1, -1, -1, 6, -1, -1]),
	new Room("You're at a landing on the third floor.", [], [-1, -1, 9, -1, 11, 6]), 
	new Room("You are in the computer room.", [things["compu"]], [-1, -1, -1, 8, -1, -1]),
	new Room("You are inside the clock tower.", [things["clock"]], [-1, 11, -1, -1, -1, -1]),
	new Room("You're at the top of the stairs.", [], [10, -1, 12, -1, -1, 8]), 
	new Room("You are in a long corridor going east.", [things["bats"]], [-1, -1, 13, 11, -1, -1]),
	new Room("You're at the east end of the corridor.", [things["desk"]], [-1, -1, -1, 12, -1, -1])
];

// create a player with a starting location
var player = new Player(rooms[0]);
player.room.describe();

function parse(command) {
	var verb, noun;

	if (command == "")
		return;

	// Split the words into a list, then convert to uppercase and shorten to 5 characters.
	var words = command.toLowerCase().split(" ");
	for (var i = 0; i < words.length; i++)
		words[i] = words[i].toLowerCase().substring(0, 5);

	// Return now if the command was blank.
	if (words.length <= 0) {
		return;
	} else {
		// Determine the verb and the noun.
		verb = words[0];

		if (exits.includes(verb)) {
			// Special case: treat directions as verbs
			noun = verb;
			verb = "go";
		} else if (words.length > 1) {
			// Commands might have a verb only and not a noun. E.g., "look"
			if (verb == "go" || verb == "type") {
				noun = words[1];
			} else {
				if (words[1] in things)  {
					noun = things[words[1]];

					// noun is in the game, but not visible to player
					if (noun != null
						&& !player.room.contents.includes(noun)
						&& !player.inventory.includes(noun)) {

						text.println("It isn't here.");
						return false;
					}
				} else {
					// player entered a word, but it is not in the game
					text.println("I don't know the object " + words[1] + ".");
					return false;
				}
			}
		} else {
			noun = null;
		}
	}

	// look up and dispatch commands
	if (verb in player) {
		return player[verb](noun);
	} else {
		text.println("I don't know the verb " + verb + ".");
		return true;
	}
}

function doTurn() {
	var command = document.getElementById("command").value;

	text.println("> " + command.toLowerCase());

	if (flags.gameOver) {
		text.println("You win!");
		return;
	}

	var complete = parse(command);
	
	if (flags.wantDescription)
		player.room.describe();

	flags.wantDescription = false;

	document.getElementById("command").value = "";

	if (complete && flags.computerActive) {
		player.counter += 1;
		if (player.counter >= 10 && player.room == rooms[9]) {
			flags.computerDead = true;
			flags.computerActive = false;
			things["compu"].description = "Dead computer";
			text.println("The computer dies with a loud pop.");
		}
	} 

	if (player.room.contents.includes(things["bats"])) {
		text.println("A horde of bats carries you out.");
		player.room = rooms[0];
		player.wantDescription = false;
	}
}
