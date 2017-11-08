const Discord = require('discord.js');
const client = new Discord.Client();
const fs = require("fs");

// SQLLite
const sql = require("sqlite");
sql.open("./scores.sqlite");

//Config Files
const config = require('./json/config.json');

//QAI's Sub-Routines.
let chatGame = require('./games/cbetGame.js');
//let pubQuiz = require('./games/pubQuiz.js');
let modFile = require('./utils/modFile.js');

//Variables
const prefix = config.prefix;

function HandlePoints(user, message) {
	if (message.content.startsWith(prefix)) return;
	if(message.channel.type !== "text") return;

	sql.get(`SELECT * FROM scores WHERE userId = "${message.author.id}"`).then(row => {
		if (!row) {
			sql.run("INSERT INTO scores (userID, points, level, bid) VALUES (?, ?, ?, ?)", [message.author.id, 1, 1, 0]);
		} else {
			let curLevel = Math.floor(0.1 * Math.sqrt(row.points + 1));
			if (curLevel > row.level) {
				row.level = curLevel;
				sql.run(`UPDATE scores SET points = ${row.points + 1}, level = ${row.level} WHERE userId = ${message.author.id}`);
			}
			sql.run(`UPDATE scores SET points = ${row.points + 1} WHERE userId = ${message.author.id}`);
		}
	}).catch(() => {
		console.error;
		sql.run("CREATE TABLE IF NOT EXISTS scores (userId TEXT, points INTEGER, level INTEGER, bid INTEGER)").then(() => {
			sql.run("INSERT INTO scores (userId, points, level, bid) VALUES (?, ?, ?, ?)", [message.author.id, 1, 1, 0]);
		});
	});
}

client.on('ready', () => {
	console.log("I am ready!");
	client.user.setGame(`with the Seven Hand Node.`);
});

client.on('message', message => {
	if(message.author.bot) return;

	const args = message.content.slice(prefix.length).trim().split(/ +/g);
	const command = message.content.toLowerCase();

	// Give Points Per Message //
	HandlePoints(message.author.id, message);

	// GAMES //
	chatGame.run(client, message, args);
	//pubQuiz.run(client, message, args);

	// MOD STUFF //
	modFile.run(client, message, args);

	// If a player wants to know their level.
	if (message.content.startsWith(prefix + "level")) {
		let member = message.mentions.members.first();

		if(member == undefined) {
			sql.get(`SELECT * FROM scores WHERE userId = "${message.author.id}"`).then(row=> {
				if (!row) return message.reply("Your current level is 0");
				message.channel.send({embed: {
					color: 3447003,
					title: `Stats Table for ${message.author.username}`,
					description: "Here are your stats.",
					fields: [{
						name: "LEVEL", 
						value: `${row.level}`,
						inline: true
					},
					{
						name: "POINTS",
						value: `${row.points}`,
						inline: true
					}
					],
				}})
			});
		} else {
				sql.get(`SELECT * FROM scores WHERE userId = "${member.id}"`).then(row=> {
				if (!row) return message.reply("Current level is 0");
				message.channel.send({embed: {
					color: 3447003,
					title: `Stats Table for ${member.user.username}`,
					description: "Here are their stats.",
					fields: [{
						name: "LEVEL", 
						value: `${row.level}`,
						inline: true
					},
					{
						name: "POINTS",
						value: `${row.points}`,
						inline: true
					}
					],
				}})
			});
		}
	}

	// If a player wants to tip someone.
	if (message.content.startsWith(prefix + "tip")) {
		let tUser = message.mentions.members.first();
		let tAmount = parseInt(args[2]);

		if (tUser == undefined) {
			return;
		} else if (tUser.user.username == message.author.username || tAmount == 0 || tAmount == undefined) {
			return message.reply("Your efforts are futile");
		}

		sql.get(`SELECT * FROM scores WHERE userId = "${message.author.id}"`).then(row => {
			if (row.points >= tAmount){
				sql.run(`UPDATE scores SET points = ${row.points - tAmount} WHERE userId = ${message.author.id}`);
				sql.get(`SELECT * FROM scores WHERE userId = "${tUser.id}"`).then(row => {
					sql.run(`UPDATE scores SET points = ${row.points + tAmount} WHERE userId = ${tUser.id}`);
				});

				message.reply("Tip confirmed.");
			} else {
				message.reply("You don't have enough points to tip that amount.");
			}
		});
	}
});


client.login(config.token);