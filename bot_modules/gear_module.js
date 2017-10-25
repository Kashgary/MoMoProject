// Important Stuff!
const Discord = require('discord.js');
const fs = require("fs");
const config = require('../json/config.json');

// SQLLite
const sql = require("sqlite");
sql.open("./members.sqlite");

// Variables
const prefix = config.prefix;

function isURL(s) {
	var checkURL = /(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/
	return checkURL.test(s);
}

exports.run = (client, message, args) => {
	if(message.content.startsWith(prefix + "gear")) {
		let member = message.mentions.members.first();

		if (member == undefined) {
			sql.get(`SELECT * FROM members WHERE userId = "${message.author.id}"`).then(row=> {
				const embed = new Discord.RichEmbed()
				embed.setAuthor(`${message.author.username}`, message.author.avatarURL);
				embed.setTitle(`Gear Display`);
				embed.setColor(0xff8040)
				embed.setDescription(`Level: **${row.LEVEL}** \nGear Score: **${row.AP + row.DP + row.AWAP}**`); // Add AP/DP together here.

				embed.addField("AP", `${row.AP}`, true);
				embed.addField("Awakened AP", `${row.AWAP}`, true);
				embed.addField("DP", `${row.DP}`, true);
				embed.addField("Accuracy", `${row.ACCURACY}`, true);

				if(isURL(row.GEARIMAGE)) {
					embed.setImage(`${row.GEARIMAGE}`);
				}

				embed.setTimestamp();
				embed.setFooter("© JJ173");

				message.channel.send({embed});
			}).catch(() => {
				console.error;
				return message.reply("Sorry! It's likely I couldn't find an entry for your gear. Don't worry though! I've created one for you, you can now use the `!gear` command!");
			});
		} else {
			sql.get(`SELECT * FROM members WHERE userId = "${member.id}"`).then(row=> {
				const embed = new Discord.RichEmbed()
				embed.setAuthor(`${member.user.username}`, member.user.avatarURL);
				embed.setTitle(`Gear Display`);
				embed.setColor(0xff8040)
				embed.setDescription(`Level: **${row.LEVEL}** \nGear Score: **${row.AP + row.DP + row.AWAP}**`); // Add AP/DP together here.

				embed.addField("AP", `${row.AP}`, true);
				embed.addField("Awakened AP", `${row.AWAP}`, true);
				embed.addField("DP", `${row.DP}`, true);
				embed.addField("Accuracy", `${row.ACCURACY}`, true);

				if(isURL(row.GEARIMAGE)) {
					embed.setImage(`${row.GEARIMAGE}`);
				}

				embed.setTimestamp();
				embed.setFooter("© JJ173");

				message.channel.send({embed});
			}).catch(() => {
				console.error;
				return message.reply("Sorry! It's likely I couldn't find an entry for this user. Don't worry though! I've created one for them, they can now use the `!gear` command!");
			});
		}
	}

	if(message.content.startsWith(prefix + "setap")) {
		let AP = args[1];

		if (AP == 0 || AP == undefined || AP == NaN) {
			return message.reply("I'm unable to add that value to your database.");
		} else {
			sql.get(`SELECT * FROM members WHERE userId = "${message.author.id}"`).then(row=> {
				sql.run(`UPDATE members SET AP = ${AP} WHERE userId = ${message.author.id}`).catch(() => {
					console.error;
					return message.reply("I'm unable to add that value to your database.");
				});
			})
		}
	}

	if(message.content.startsWith(prefix + "setdp")) {
		let DP = args[1];

		if (DP == 0 || DP == undefined || DP == NaN) {
			return message.reply("I'm unable to add that value to your database.");
		} else {
			sql.get(`SELECT * FROM members WHERE userId = "${message.author.id}"`).then(row=> {
				sql.run(`UPDATE members SET DP = ${DP} WHERE userId = ${message.author.id}`).catch(() => {
					console.error;
					return message.reply("I'm unable to add that value to your database.");
				});
			})
		}
	}

	if(message.content.startsWith(prefix + "setacc")) {
		let acc = args[1];

		if (acc == 0 || acc == undefined || acc == NaN) {
			return message.reply("I'm unable to add that value to your database.");
		} else {
			sql.get(`SELECT * FROM members WHERE userId = "${message.author.id}"`).then(row=> {
				sql.run(`UPDATE members SET ACCURACY = ${acc} WHERE userId = ${message.author.id}`).catch(() => {
					console.error;
					return message.reply("I'm unable to add that value to your database.");
				});
			})
		}
	}

	if(message.content.startsWith(prefix + "setawap")) {
		let AWAP = args[1];

		if (AWAP == 0 || AWAP == undefined || AWAP == NaN) {
			return message.reply("I'm unable to add that value to your database.");
		} else {
			sql.get(`SELECT * FROM members WHERE userId = "${message.author.id}"`).then(row=> {
				sql.run(`UPDATE members SET AWAP = ${AWAP} WHERE userId = ${message.author.id}`).catch(() => {
					console.error;
					return message.reply("I'm unable to add that value to your database.");
				});
			})
		}
	}

	if(message.content.startsWith(prefix + "setlvl")) {
		let lvl = args[1];

		if (lvl == 0 || lvl == undefined || lvl == NaN) {
			return message.reply("I'm unable to add that value to your database.");
		} else {
			sql.get(`SELECT * FROM members WHERE userId = "${message.author.id}"`).then(row=> {
				sql.run(`UPDATE members SET LEVEL = ${lvl} WHERE userId = ${message.author.id}`).catch(() => {
					console.error;
					return message.reply("I'm unable to add that value to your database.");
				});
			})
		}
	}

	if(message.content.startsWith(prefix + "setimg")) {
		let img = args[1];

		if (img == 0 || img == undefined || img == NaN) {
			return message.reply("I'm unable to add that value to your database.");
		} else {
			sql.get(`SELECT * FROM members WHERE userId = "${message.author.id}"`).then(row=> {
				sql.run(`UPDATE members SET GEARIMAGE = "${img}" WHERE userId = ${message.author.id}`).catch(() => {
					console.error;
					return message.reply("I'm unable to add that value to your database.");
				});
			})
		}
	}
}