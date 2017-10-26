// Important Stuff!
const Discord = require('discord.js');
const fs = require("fs");
const config = require('../json/config.json');

// Variables
const prefix = config.prefix;

usersAttending = 0;
userNames = [];

function refresh(message, channel) {
	message.channel.fetchMessages({
		limit: 100,
	}).then((messages) => {
		message.channel.bulkDelete(messages).catch(error => console.log(error.stack));
	});
	
	const embed = new Discord.RichEmbed()
	embed.setTitle("PVP Roster")
	embed.setColor(0xff8040)
	embed.setDescription("Please sign-up if you wish to participate in a PVP session.")

	embed.addField("Roster Count", `${usersAttending}`, true);

	if(userNames.length == 0) {
		embed.addField("Registered Users", `Nobody`, true);
	} else {
		embed.addField("Registered Users", `${userNames.map(g => g).join("\n")}`, true);
	}

	embed.setTimestamp();
	embed.setFooter("© JJ173");

	channel.send({embed});
}

exports.run = (client, message, args) => {
	if(message.author.bot) return;

	if(message.content.startsWith(prefix + "npvp")) {
		if(message.member.roles.some(r=>["Leader", "Officer", "ADMIN"].includes(r.name))) {
			usersAttending = 0;
			userNames = [];

			message.channel.send("A new event has started! Please sign-up by typing `+`. If you need additional information, please inform an Officer.");
			refresh(message, message.channel);
		}
	}

	if(message.content.startsWith("+")) {
		if(userNames.indexOf(message.member.username) > -1 || userNames.indexOf(message.member.nickname) > -1) return;

		if(message.member.nickname == undefined) {
			userNames.push(message.member.username);
		} else {
			userNames.push(message.member.nickname);
		}
		usersAttending += 1;
		refresh(message, message.channel);
	}
}
