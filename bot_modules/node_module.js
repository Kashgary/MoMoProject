// Important Stuff!
const Discord = require('discord.js');
const fs = require("fs");
const config = require('../json/config.json');

// SQLLite
const sql = require("sqlite");
sql.open("./members.sqlite");

// Store the list if we crash.
sql.open("list.sqlite");

// Variables
const prefix = config.prefix;

aMemberList = [];
mMemberList = [];
naMemberList = [];
missingList = [];

aMemberCount = 0;
mMemberCount = 0;
naMemberCount = 0;
missingCount = 0;

function removeFromArray(array, element) {
	const index = array.indexOf(element); 

	if(index !== -1) {
		array.splice(index, 1);
	}
}

function refreshList(message, channel) {
	message.channel.fetchMessages({
		limit: 100,
	}).then((messages) => {
		message.channel.bulkDelete(messages).catch(error => console.log(error.stack));
	});

	channel.send({embed: {
		color: 0xff8040,
		author: {
			name: `MoMo Bot`,
			icon_url: message.guild.iconURL
		},
		title: `Node War Attendance`,
		description: "Please sign up for Node Wars using !yes, !no or !maybe.",
		fields: [{
				name: `Attending`, 
				value: `${aMemberCount}`,
				inline: true
			},
			{
				name: `May Attend`,
				value: `${mMemberCount}`,
				inline: true
			},
			{
				name: `Not Attending`,
				value: `${naMemberCount}`,
				inline: true
			},
			{
				name: `Missing`,
				value: `${missingCount}`,
				inline: true
			}],
		}
	});

	const embed = new Discord.RichEmbed()
	embed.setTitle("Node War Attendance")
	embed.setColor(0xff8040)
	embed.setDescription("Current list of attending members")

	if(aMemberList.length == 0) {
		embed.addField("Attending", `Nobody`, true);
	} else {
		embed.addField("Attending", `${aMemberList.map(g => g).join("\n")}`, true);
	}

	if(mMemberList.length == 0) {
		embed.addField("May Attend", `Nobody`, true);
	} else {
		embed.addField("May Attend", `${mMemberList.map(g => g).join("\n")}`, true);
	}

	if(naMemberList.length == 0) {
		embed.addField("Not Attending", `Nobody`, true);
	} else {
		embed.addField("Not Attending", `${naMemberList.map(g => g).join("\n")}`, true);
	}

	if(missingList.length == 0) {
		embed.addField("Missing", `Nobody`, true);
	} else {
		embed.addField("Missing", `${missingList.map(g => g).join("\n")}`, true);
	}

	embed.setTimestamp();
	embed.setFooter("© JJ173");

	channel.send({embed});
}

function removeFromList(list1, list2, list3, name) {
	if(list1.indexOf(name) > -1) {
		removeFromArray(list1, name);
		if(list1 == aMemberList) {
			aMemberCount--;
		} else if(list1 == naMemberList) {
			naMemberCount--;
		} else if(list1 == mMemberList) {
			mMemberCount--;
		} else if(list1 == missingList) {
			missingCount--;
		}
	} else if(list2.indexOf(name) > -1) {
		removeFromArray(list2, name);
		if(list2 == aMemberList) {
			aMemberCount--;
		} else if(list2 == naMemberList) {
			naMemberCount--;
		} else if(list2 == mMemberList) {
			mMemberCount--;
		} else if(list2 == missingList) {
			missingCount--;
		}
	} else if(list3.indexOf(name) > -1) {
		removeFromArray(list3, name);
		if(list3 == aMemberList) {
			aMemberCount--;
		} else if(list3 == naMemberList) {
			naMemberCount--;
		} else if(list3 == mMemberList) {
			mMemberCount--;
		} else if(list3 == missingList) {
			missingCount--;
		}
	} 
}

function updateList(list1, list2, list3, user) {
	if(list1 == aMemberList) {
		if (user.nickname == undefined) {
			aMemberList.push(user.username);
			removeFromList(naMemberList, mMemberList, missingList, user.username);
		} else {
			aMemberList.push(user.nickname);
			removeFromList(naMemberList, mMemberList, missingList, user.nickname);
		}
		aMemberCount += 1
	} else if(list1 == mMemberList) {
		if (user.nickname == undefined) {
			mMemberList.push(user.username);
			removeFromList(aMemberList, naMemberList, missingList, user.username);
		} else {
			mMemberList.push(user.nickname);
			removeFromList(aMemberList, naMemberList, missingList, user.nickname);
		}
		mMemberCount += 1
	} else if(list1 == naMemberList) {
		if (user.nickname == undefined) {
			naMemberList.push(user.username);
			removeFromList(aMemberList, mMemberList, missingList, user.username);
		} else {
			naMemberList.push(user.nickname);
			removeFromList(aMemberList, mMemberList, missingList, user.nickname);
		}
		naMemberCount += 1
	}
}

exports.run = (client, message, args) => {
	if(message.author.bot) return;

	if(message.content.startsWith(prefix + "yes")) {
		if(aMemberList.indexOf(message.member.username) > -1 || aMemberList.indexOf(message.member.nickname) > -1) return;

		updateList(aMemberList, mMemberList, naMemberList, message.member);
		refreshList(message, message.channel);
	}

	if(message.content.startsWith(prefix + "maybe")) {
		if(mMemberList.indexOf(message.member.username) > -1 || mMemberList.indexOf(message.member.nickname) > -1) return;

		updateList(mMemberList, aMemberList, naMemberList, message.member);
		refreshList(message, message.channel);
	}

	if(message.content.startsWith(prefix + "no")) {
		if(naMemberList.indexOf(message.member.username) > -1 || naMemberList.indexOf(message.member.nickname) > -1) return;

		updateList(naMemberList, aMemberList, mMemberList, message.member);
		refreshList(message, message.channel);
	}

	if(message.content.startsWith(prefix + "refresh")) {
		refreshList(message, message.channel);
	}

	// Mod Commands
	if(message.content.startsWith(prefix + "force_yes")) {
		let member = message.mentions.members.first();

		if(message.member.roles.some(r=>["Leader", "Officer", "ADMIN"].includes(r.name))) {
			if(aMemberList.indexOf(member.username) > -1) {
				return message.reply("User is already in that list!");
			} else if(aMemberList.indexOf(member.nickname) > -1) {
				return message.reply("User is already in that list!");
			}
			
			updateList(aMemberList, mMemberList, naMemberList, member);
			refreshList(message, message.channel);
		} else {
			return message.reply("You do not have permission to do that.");
		}
	}

	if(message.content.startsWith(prefix + "force_no")) {
		let member = message.mentions.members.first();

		console.log(member.nickname);

		if(message.member.roles.some(r=>["Leader", "Officer", "ADMIN"].includes(r.name))) {
			if(naMemberList.indexOf(member.username) > -1) {
				return message.reply("User is already in that list!");
			} else if(naMemberList.indexOf(member.nickname) > -1) {
				return message.reply("User is already in that list!");
			}
			
			updateList(naMemberList, mMemberList, aMemberList, member);
			refreshList(message, message.channel);
		} else {
			return message.reply("You do not have permission to do that.");
		}
	}

	if(message.content.startsWith(prefix + "remind")) {
		var members = message.guild.members;

		var reminder = message.content.split("!remind ")[1];

		if(message.member.roles.some(r=>["Leader", "Officer", "ADMIN"].includes(r.name))) {
			members.forEach(function(member) {
				if(member.roles.some(r=>["Leader", "Officer", "Member"].includes(r.name))) {
					if(missingList.indexOf(member.username) > -1 || missingList.indexOf(member.nickname) > -1) {
						member.send(`${reminder} - ${message.author.username}`);
					}
				}
			});
		} else {
			return message.reply("You do not have permission to do that.");
		}
	}

	if(message.content.startsWith(prefix + "new")) {
		if(message.member.roles.some(r=>["Leader", "Officer", "ADMIN"].includes(r.name))) {
			aMemberCount = 0;
			naMemberCount = 0;
			mMemberCount = 0;
			missingCount = 0;

			aMemberList = [];
			mMemberList = [];
			naMemberList = [];
			missingList = [];

			// Add all of the users to the missing list.
			var members = message.guild.members;

			members.forEach(function(member) {
				if(member.roles.some(r=>["Leader", "Officer", "Member"].includes(r.name))) {
					if(member.nickname == undefined) {
						missingList.push(member.user.username);
					} else {
						missingList.push(member.nickname);
					}
					missingCount += 1;
				} else {
					return;
				}
			});

			refreshList(message, message.channel);
		} else {
			return message.reply("You do not have permission to do that.");
		}
	}
}