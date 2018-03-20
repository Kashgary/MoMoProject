const Discord = require('discord.js');
const client = new Discord.Client();
const fs = require("fs");

// Config Files
const config = require('./json/config.json');

// Variables
const prefix = config.prefix;

// SQLLite
const sql = require("sqlite");
sql.open("./members.sqlite");

// Modules
let nodeMod = require('./bot_modules/node_module.js');
let gearMod = require('./bot_modules/gear_module.js');
let eventMod = require('./bot_modules/event_module.js');
let officerMod = require('./bot_modules/officer_module.js');

let commands = ["!setap", "!setdp", "!setacc", "!setlvl", "!setimg", "!setawap", "!gear"];

client.on('ready', ()=> {
	console.log("I am ready!");
	client.user.setGame(`Version 0.6.1b`);

});

client.on('message', message => {
	if(message.author.bot) return;

	const args = message.content.slice(prefix.length).trim().split(/ +/g);
	const command = message.content.toLowerCase();

	// Create our databases if they don't exist.
	sql.run("CREATE TABLE IF NOT EXISTS members (userId TEXT, AP INTEGER, DP INTEGER, AWAP INTEGER, ACCURACY INTEGER, GEARIMAGE TEXT, LEVEL INTEGER, ATTENDED INTEGER, NOT_ATTENDED INTEGER)").then(() => {
		var members = message.guild.members;
		members.forEach(function(member) {
			sql.run("INSERT INTO members (userId, AP, DP, AWAP, ACCURACY, GEARIMAGE, LEVEL, ATTENDED, NOT_ATTENDED) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)", [member.id, 0, 0, 0, 0, `place`, 0, 0, 0]);
		});
	});

	if(message.content.startsWith(prefix + "help")) {
		message.author.send(`Here are my commands: \n${commands.map(g => g).join("\n")} \nThis is only temporary, a website with documentation will be ready soon.`);
	}

	// Handle Message Filtering
	if(message.channel.id == "") {
		nodeMod.run(client, message, args);
	}

	if(message.channel.id == "") {
		eventMod.run(client, message, args);
	}

	if(message.channel.id == "425767790226440192") {
		gearMod.run(client, message, args);
	}

	officerMod.run(client, message, args);
});

client.on("guildMemberAdd", (member) => {
	const embed = new Discord.RichEmbed()
	embed.setTitle(`A new challenger approaches!`);
	embed.setColor(0xff8040);

	embed.addField("Member Name", `${member.user.username}`, true);
	embed.setTimestamp();

	member.addRole(member.guild.roles.find("name", "Guests"));
});

/*client.on("guildMemberUpdate", (oldMember, newMember) => {
	// Get some list references from the Node War Module.
	let attendingList = aMemberList;
	let mayAttendList = nodeMod.mMemberList;
	let notAttendingList = nodeMod.naMemberList;
	let missingList = nodeMod.missingList;

	// Run a check to see if the old user is in a list.
	if(missingList.indexOf(oldMember.user.username) > -1 || missingList.indexOf(oldMember.nickname) > -1) {

	} else if(notAttendingList.indexOf(oldMember.user.username) > -1 || notAttendingList.indexOf(oldMember.nickname) > -1) {

	} else if(mayAttendList.indexOf(oldMember.user.username) > -1 || mayAttendList.indexOf(oldMember.nickname) > -1) {

	} else if(attendingList.indexOf(oldMember.user.username) > -1 || attendingList.indexOf(oldMember.nickname) > -1) {

	}
})*/

client.on("error", (e) => console.error(e));
client.on("warn", (e) => console.warn(e));
client.on("debug", (e) => console.info(e));

client.login(process.env.BOT_TOKEN);
