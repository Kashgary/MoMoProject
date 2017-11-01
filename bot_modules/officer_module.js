// Important Stuff!
const Discord = require('discord.js');
const fs = require("fs");
const config = require('../json/config.json');

// Variables
const prefix = config.prefix;

let officerRoles = ["Leader", "Officer", "ADMIN"];

exports.run = (client, message, args) => {
	if(message.member && !message.member.roles.some(r=>officerRoles.includes(r.name))) return;
	if(message.author.bot) return;

	if(message.content.startsWith(prefix + "purge")) {
		const user = message.mentions.users.first();
		const amount = !!parseInt(message.content.split(' ')[1]) ? parseInt(message.content.split(' ')[1]) : parseInt(message.content.split(' ')[2])

		if(!amount) return message.reply("Please specify an amount of messages to purge");
		if(!amount && !user) return message.reply("Please specify a user and amount, or just an amount of message to purge.");

		message.channel.fetchMessages({
			limit: amount,
		}).then((messages) => {
			if(user) {
				const filterBy = user ? user.id : Client.user.id;
				messages = messages.filter(m => m.author.id === filterBy).array().slice(0, amount);
			}
			message.channel.bulkDelete(messages).catch(error => console.log(error.stack));
		});
	}
}
