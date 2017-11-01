# HaakuBotProject

Welcome to the Haaku Bot Git Repository. This bot is tailored to work for the Haaku Discord Server.

# Contributing
If you wish to contribute to MoMo, you can do so by talking to Vedu or JJ. When contributing, please make sure that this repository is kept up-to-date with the latest features that you have developed. Please upload any changes you wish to make via a Pull Request with a description of what the feature does. Pull Requests will be reviewed and merged once approved by JJ or Vedu. If you have any issues with the bot, please post an issue so we can fix it.

Anyone who has any suggestions or ideas can PM JJ on Discord.

## Installing and Developing
To develop for MoMo, you'll need to setup your own development environment.

First, you'll need to install:
* https://nodejs.org/en/

Once installed, create a directory for MoMo and clone this repository. You'll need to create a config file in order to run the bot. The config file will follow this structure:

```
{
  "token": "bot_token_here",
  "prefix": "!",
  "ownerID": "your_discord_id"
}
```

Open up the Node Command Prompt and type `cd path_to_your_momo_directory`. Then, you'll need to install a few prerequisites before launching the bot.

Once you've navigated to your development environment, type these commands in to your Node Command Prompt (Node may ask for your permission to install these modules):
* npm install --save discord.js
* npm install sqlite --save

When Node has finished installing these modules, you can test the bot by putting your bot token in your config file and typing `node init_bot.js` in to your Node Command Prompt. 

If you don't know how to create a Discord Bot application, please research it here: https://twentysix26.github.io/Red-Docs/red_guide_bot_accounts/

If there are any issues, or you're struggling to understand this guide, please let us know.

# Change Log

## Version 0.1
* Added basic bot features
* Added attendance features
* Added a general function for war declaration
* Added the moderation class
* Created a list that appends missing users for the Node War function
* Fixed some formatting issues with the bot embedding
* Added the "!new" command for officers and leaders to create a new Node War attendance list
* War declarations are now stored in a file instead of in an array 
* Added version number to the bot
* Minor fixes and updates

## Version 0.2
* Moved the missing list from the Node War class to the initial class to prevent duplicate name listing
* Added an event that fires when a new user joins the server
* Automatically give new members the "Guest" role
* Polished up the functionality of the Node War Class
* Added a feature that sends a custom message to all of the users on the missing list
* Added a "!refresh" command
* Added some moderator functions that allow Officers to force users to "yes" or "no" on the attendance list
* Removed outdated code
* Fixed issues with the "!force_no" command
* Minor fixes and updates

## Version 0.3
* Fixed the duplication list issues in the Node War channel
* Minor fixes and updates

## Version 0.4
* Changed the attendance !new command to support a date
* Added very basic music feature (this is not finished)
* Started work on the PVP features for the bot
* The bot will now post when it comes back online, so we are aware if it breaks.
* Music commands will produce errors for me to look at
* Changed the version number to a variable to make things easier
* Fixed nickname changes for users in the attendance list
* Added the !changes command
* Added requirements for the bot to run on the server

## Version 0.5
* Removed Music Commands until fully fixed
* Added !maybe command to attendance list
* Added !help command for all users
* Added !mhelp command for officers
* Added officer specific commands
* Cleaned up code for better functioanlity
* Officers can now lock in the attendance list
* Changes nicknames no longer causes issues with the attendance list
* Fixed minor bugs

## Version 0.6
* Added Events Module to handle PVP events.
* Gear Module has been added so users can store their gear in the bot to show it off in the server.
* Added a purge function for officers to be able to bulk-clear a channel.
* Bot has been changed to JS for better reasons.
