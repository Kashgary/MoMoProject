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

let commands = ["!yes", "!no", "!maybe", "!new", "!refresh", "!remind", "!setap", "!setdp", "!setacc", "!setlvl", "!setimg", "!setawap", "!gear"];

client.on('ready', ()=> {
	console.log("I am ready!");
	client.user.setGame(`Version 0.6`);

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
	if(message.channel.id == "334464352717504523") {
		nodeMod.run(client, message, args);
	}

	if(message.channel.id == "334446381098074112") {
		eventMod.run(client, message, args);
	}

	if(message.channel.id == "372849205149958166") {
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
})

client.login(config.token);