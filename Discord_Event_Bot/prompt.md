Create for me a discord bot that utilizes the new features from discord.js v14.
Make a well designed, good looking discord bot that its purpose is to create essentially a calendar/reminder for the days activities during our long trip, allowing for everyone to be synched on a schedule and able to easily, very quickly make new events whenever is needed.
At the start of each day (which the start of the days the bot starts posting this in the calendar chat can be set as a setting), the discord bot will post todays 'calendar/timeslots' in a nice looking, well designed, markdown formatted, time schedule for the days events. The time these are sent can be changed in the bots settings menu.
 These posts should @ people under the role "The Days Remember", everyone gets this role when they join the server by default. However, if they want to remove the daily notifications, they can take themselves off the role by clicking the Mute daily reminders button under each of these "start of day" daily calendar posts.
 The bot should know what day, year, and time it is.

At any moment of the day, someone can use the command /newevent and a menu will be brought up using the new features from v14, to allow the person to set the time for when it starts and ends (or select all day), set the event as Normal or Urgent, date, name of the event that is happening, who is involved, (which you can select from a drop down list of the members in the server), and location (if applicable, which will generate a google maps link that will automatically give a link from the current location to that location if its an address). Setting the event should be very effecient to use, have little friction, modular, and designed to be interactive and look nice.
These will have a modular line or something that marks where in the day we are time wise (example: If its 10:30 AM, something shows we are at 10:30am). 

The people selected (or everyone, in the case its everyone) will be notified and pinged 1 hour, 30 minutes, and then 15 minutes before the event begins. If an event is set as URGENT, when its 15 minutes before the event begins, the event will keep pinging every minute, unless someone presses the specific button on the event notification post for urgent events, that mutes it from then on for everyone or presses the complete button which markes it complete.
These event notifications should be easy to read, well designed so it looks good and reads well and the information should work within discord, markdown format, and a quick glance be able to take in the information. On each of those posts should be a button that allows a person to mute further notifications for that specific event (and being taken off the @ notification list) for the person who clicks it, and a green button that allows for someone to checkmark complete. 
When someone checkmarks complete an event, they get a point, this updates their nickname in the server to be something along the lines of "<POINTS> | NICK NAME HERE". Even if they change their nickname, the nick name changes will change accordingly to reflect the new nickname, and still keep all their points.
The checkmark box doesn't do anything more for the person who clicks it after clicking it once, however, anyone involved with the event can click it at least once and it doesn't just disable when one person clicks it.

When an event is completed this event will show up as complete on the day calendar, with the time slots of that event visually shown as complete.

At any time a person can use the command /today, which will pull up the days calendar/timeslots.
If a person uses the command /whotoday, a new formatted, well designed version of the days calendar/timeslots, but instead of showing all events together in one calendar, it will show up under each person of the servers own column of timeslots, letting people to see easily at a glance, what each person are supposed to be doing today. If they do not have any events for the day, they do not show up when using this command.

You can also easily look at other calendars by using the command /calendar. After /calendar one can use normal text like "Next friday", or like August 22nd 2025, or like August 22nd, or an actual numbered date like 8/22/2025 in order to pull up the days calendar they selected. 

/settings pulls up all and any settings needed for the bot to work well generally, as well as locally, and buttons, menus, and any new features from v14 should be used to make this settings menu work better and seamlessly without complication.
This probably would be where you would set the time zone of the bot, but by default, its PST. 

Ensure all error handling is covered, and the code is completed well, and designed well. 

For hosting this bot, we will be using this method:

I am going to need this bot to run on the following combo, ensure all code matches the setup:
Render.com for hosting from a web service (Render.com does not allow storage of files, so things will deleted every time it restarts which is why we host the stored info on another site)
Any query based stuff, and holding the information will be done on Atlas and MongoDB
The code will be hosted on Github and be sent over to Render.
I already have four environment private variables already setup, and Render is already talking to Mongo via the url given.
Here are the four variables
'CLIENT_ID', 'DISCORD_TOKEN', 'GUILD_ID', 'MONGO_URI'.
Ensure these variables are used.
I will be using Uptimerobot.com at a 5 min interval, to keep the hosting open, by constantly pinging. Ensure it stays open utilizing this as a way to keep it open.


Below is some copy pasted text from the discord v14 docs, its not all of it, but its all that has to do with some important features. Utilize it to help build this bot out as good and functionally as you can.


[BEGIN DISCORD DOCS COPY PASTE]
Command response methods

There are multiple ways of responding to a slash command; each of these are covered in the following segments. Using an interaction response method confirms to Discord that your bot successfully received the interaction, and has responded to the user. Discord enforces this to ensure that all slash commands provide a good user experience (UX). Failing to respond will cause Discord to show that the command failed, even if your bot is performing other actions as a result.

The most common way of sending a response is by using the ChatInputCommandInteraction#reply() method, as you have done in earlier examples. This method acknowledges the interaction and sends a new message in response.

module.exports = {
	data: new SlashCommandBuilder()
		.setName('ping')
		.setDescription('Replies with Pong!'),
	async execute(interaction) {
		await interaction.reply('Pong!');
	},
};

User used /ping
Guide Bot Bot 08/19/2025
Pong!

WARNING

Initially an interaction token is only valid for three seconds, so that's the timeframe in which you are able to use the ChatInputCommandInteraction#reply() method. Responses that require more time ("Deferred Responses") are explained later in this page.
#
Ephemeral responses

You may not always want everyone who has access to the channel to see a slash command's response. Previously, you would have had to DM the user to achieve this, potentially encountering the high rate limits associated with DM messages, or simply being unable to do so, if the user's DMs were disabled.

Thankfully, Discord provides a way to hide response messages from everyone but the executor of the slash command. This is called an ephemeral message and can be set by providing flags: MessageFlags.Ephemeral in the InteractionReplyOptions, as follows:

client.on(Events.InteractionCreate, async interaction => {
	if (!interaction.isChatInputCommand()) return;

	if (interaction.commandName === 'ping') {
		await interaction.reply({ content: 'Secret Pong!', flags: MessageFlags.Ephemeral });
	}
});

Now when you run your command again, you should see something like this:
User used /ping
Guide Bot Bot 08/19/2025
Secret Pong!
Only you can see this

Ephemeral responses are only available for interaction responses; another great reason to use the new and improved slash command user interface.
#
Editing responses

After you've sent an initial response, you may want to edit that response for various reasons. This can be achieved with the ChatInputCommandInteraction#editReply() method:

WARNING

After the initial response, an interaction token is valid for 15 minutes, so this is the timeframe in which you can edit the response and send follow-up messages. You also cannot edit the ephemeral state of a message, so ensure that your first response sets this correctly.

const wait = require('node:timers/promises').setTimeout;

client.on(Events.InteractionCreate, async interaction => {
	if (!interaction.isChatInputCommand()) return;

	if (interaction.commandName === 'ping') {
		await interaction.reply('Pong!');
		await wait(2_000);
		await interaction.editReply('Pong again!');
	}
});

In fact, editing your interaction response is necessary to calculate the ping properly for this command.
#
Deferred responses

As previously mentioned, Discord requires an acknowledgement from your bot within three seconds that the interaction was received. Otherwise, Discord considers the interaction to have failed and the token becomes invalid. But what if you have a command that performs a task which takes longer than three seconds before being able to reply?

In this case, you can make use of the ChatInputCommandInteraction#deferReply() method, which triggers the <application> is thinking... message. This also acts as the initial response, to confirm to Discord that the interaction was received successfully and gives you a 15-minute timeframe to complete your tasks before responding.

const wait = require('node:timers/promises').setTimeout;

client.on(Events.InteractionCreate, async interaction => {
	if (!interaction.isChatInputCommand()) return;

	if (interaction.commandName === 'ping') {
		await interaction.deferReply();
		await wait(4_000);
		await interaction.editReply('Pong!');
	}
});

If you have a command that performs longer tasks, be sure to call deferReply() as early as possible.

Note that if you want your response to be ephemeral, utilize flags from InteractionDeferReplyOptions here:

await interaction.deferReply({ flags: MessageFlags.Ephemeral });

It is not possible to edit a reply to change its ephemeral state once sent.

TIP

If you want to make a proper ping command, one is available in our FAQ.
#
Follow-ups

The reply() and deferReply() methods are both initial responses, which tell Discord that your bot successfully received the interaction, but cannot be used to send additional messages. This is where follow-up messages come in. After having initially responded to an interaction, you can use ChatInputCommandInteraction#followUp() to send additional messages:

WARNING

After the initial response, an interaction token is valid for 15 minutes, so this is the timeframe in which you can edit the response and send follow-up messages.

client.on(Events.InteractionCreate, async interaction => {
	if (!interaction.isChatInputCommand()) return;

	if (interaction.commandName === 'ping') {
		await interaction.reply('Pong!');
		await interaction.followUp('Pong again!');
	}
});

If you run this code you should end up having something that looks like this:
User used /ping
Guide Bot Bot 08/19/2025
Pong!
Guide Bot Bot Pong!
Guide Bot Bot 08/19/2025
Pong again!

You can also pass the ephemeral flag to the InteractionReplyOptions:

await interaction.followUp({ content: 'Pong again!', flags: MessageFlags.Ephemeral });

User used /ping
Guide Bot Bot 08/19/2025
Pong!
Guide Bot Bot Pong!
Guide Bot Bot 08/19/2025
Pong again!
Only you can see this

Note that if you use followUp() after a deferReply(), the first follow-up will edit the <application> is thinking message rather than sending a new one.

That's all, now you know everything there is to know on how to reply to slash commands!

TIP

Interaction responses can use masked links (e.g. [text](http://site.com)) in the message content.
#
Fetching and deleting responses

In addition to replying to a slash command, you may also want to delete the initial reply. You can use ChatInputCommandInteraction#deleteReply() for this:

await interaction.reply('Pong!');
await interaction.deleteReply();

Lastly, you may require the Message object of a reply for various reasons, such as adding reactions. Pass withResponse: true to obtain the InteractionCallbackResponse

. You can then access the Message object like so:

const response = await interaction.reply({ content: 'Pong!', withResponse: true });
console.log(response.resource.message);

You can also use the ChatInputCommandInteraction#fetchReply() method to fetch the Message instance. Do note that this incurs an extra API call in comparison to withResponse: true:

await interaction.reply('Pong!');
const message = await interaction.fetchReply();
console.log(message);

#
Localized responses

In addition to the ability to provide localized command definitions, you can also localize your responses. To do this, get the locale of the user with ChatInputCommandInteraction#locale and respond accordingly:

client.on(Events.InteractionCreate, interaction => {
	const locales = {
		pl: 'Witaj Świecie!',
		de: 'Hallo Welt!',
	};
	interaction.reply(locales[interaction.locale] ?? 'Hello World (default is english)');
});

Advanced command creation

The examples we've covered so far have all been fairly simple commands, such as ping, server, and user which all have standard static responses. However, there's much more you can do with the full suite of slash command tools!
#
Adding options

Application commands can have additional options. Think of these options as arguments to a function, and as a way for the user to provide the additional information the command requires.

TIP

If you've already added options to your commands and need to know how to receive and parse them, refer to the Parsing options page in this section of the guide.

Options require at minimum a name and description. The same restrictions apply to option names as slash command names - 1-32 characters containing no capital letters, spaces, or symbols other than - and _. You can specify them as shown in the echo command below, which prompt the user to enter a String for the input option.

const { SlashCommandBuilder } = require('discord.js');

const data = new SlashCommandBuilder()
	.setName('echo')
	.setDescription('Replies with your input!')
	.addStringOption(option =>
		option.setName('input')
			.setDescription('The input to echo back'));

#
Option types

By specifying the type of an ApplicationCommandOption using the corresponding method you are able to restrict what the user can provide as input, and for some options, leverage the automatic parsing of options into proper objects by Discord.

The example above uses addStringOption, the simplest form of standard text input with no additional validation. By leveraging additional option types, you could change the behavior of this command in many ways, such as using a Channel option to direct the response to a specific channel:

const { SlashCommandBuilder } = require('discord.js');

const data = new SlashCommandBuilder()
	.setName('echo')
	.setDescription('Replies with your input!')
	.addStringOption(option =>
		option.setName('input')
			.setDescription('The input to echo back'))
	.addChannelOption(option =>
		option.setName('channel')
			.setDescription('The channel to echo into'));

Or a Boolean option to give the user control over making the response ephemeral.

const { SlashCommandBuilder } = require('discord.js');

const data = new SlashCommandBuilder()
	.setName('echo')
	.setDescription('Replies with your input!')
	.addStringOption(option =>
		option.setName('input')
			.setDescription('The input to echo back'))
	.addBooleanOption(option =>
		option.setName('ephemeral')
			.setDescription('Whether or not the echo should be ephemeral'));

Listed below is a short description of the different types of options that can be added. For more information, refer to the add_____Option methods in the SlashCommandBuilder

documentation.

    String, Integer, Number and Boolean options all accept primitive values of their associated type.
        Integer only accepts whole numbers.
        Number accepts both whole numbers and decimals.
    User, Channel, Role and Mentionable options will show a selection list in the Discord interface for their associated type, or will accept a Snowflake (id) as input.
    Attachment options prompt the user to make an upload along with the slash command.
    Subcommand and SubcommandGroup options allow you to have branching pathways of subsequent options for your commands - more on that later on this page.

TIP

Refer to the Discord API documentation for detailed explanations on the SUB_COMMAND and SUB_COMMAND_GROUP option types

.
#
Required options

With option types covered, you can start looking at additional forms of validation to ensure the data your bot receives is both complete and accurate. The simplest addition is making options required, to ensure the command cannot be executed without a required value. This validation can be applied to options of any type.

Review the echo example again and use setRequired(true) to mark the input option as required.

const { SlashCommandBuilder } = require('discord.js');

const data = new SlashCommandBuilder()
	.setName('echo')
	.setDescription('Replies with your input!')
	.addStringOption(option =>
		option.setName('input')
			.setDescription('The input to echo back')
			.setRequired(true));

#
Choices

The String, Number, and Integer option types can have choices. If you would prefer users select from predetermined values rather than free entry, choices can help you enforce this. This is particularly useful when dealing with external datasets, APIs, and similar, where specific input formats are required.

WARNING

If you specify choices for an option, they'll be the only valid values users can pick!

Specify choices by using the addChoices() method from within the option builder, such as SlashCommandBuilder#addStringOption()

. Choices require a name which is displayed to the user for selection, and a value that your bot will receive when that choice is selected, as if the user had typed it into the option manually.

The gif command example below allows users to select from predetermined categories of gifs to send:

const { SlashCommandBuilder } = require('discord.js');

const data = new SlashCommandBuilder()
	.setName('gif')
	.setDescription('Sends a random gif!')
	.addStringOption(option =>
		option.setName('category')
			.setDescription('The gif category')
			.setRequired(true)
			.addChoices(
				{ name: 'Funny', value: 'gif_funny' },
				{ name: 'Meme', value: 'gif_meme' },
				{ name: 'Movie', value: 'gif_movie' },
			));

If you have too many choices to display (the maximum is 25), you may prefer to provide dynamic choices based on what the user has typed so far. This can be achieved using autocomplete.
#
Further validation

Even without predetermined choices, additional restrictions can still be applied on otherwise free inputs.

    For String options, setMaxLength() and setMinLength() can enforce length limitations.
    For Integer and Number options, setMaxValue() and setMinValue() can enforce range limitations on the value.
    For Channel options, addChannelTypes() can restrict selection to specific channel types, e.g. ChannelType.GuildText.

We'll use these to show you how to enhance your echo command from earlier with extra validation to ensure it won't (or at least shouldn't) break when used:

const { SlashCommandBuilder, ChannelType } = require('discord.js');

const data = new SlashCommandBuilder()
	.setName('echo')
	.setDescription('Replies with your input!')
	.addStringOption(option =>
		option.setName('input')
			.setDescription('The input to echo back')
			// Ensure the text will fit in an embed description, if the user chooses that option
			.setMaxLength(2_000))
	.addChannelOption(option =>
		option.setName('channel')
			.setDescription('The channel to echo into')
			// Ensure the user can only select a TextChannel for output
			.addChannelTypes(ChannelType.GuildText))
	.addBooleanOption(option =>
		option.setName('embed')
			.setDescription('Whether or not the echo should be embedded'));

#
Subcommands

Subcommands are available with the .addSubcommand() method. This allows you to branch a single command to require different options depending on the subcommand chosen.

With this approach, you can merge the user and server information commands from the previous section into a single info command with two subcommands. Additionally, the user subcommand has a User type option for targeting other users, while the server subcommand has no need for this, and would just show info for the current guild.

const { SlashCommandBuilder } = require('discord.js');

const data = new SlashCommandBuilder()
	.setName('info')
	.setDescription('Get info about a user or a server!')
	.addSubcommand(subcommand =>
		subcommand
			.setName('user')
			.setDescription('Info about a user')
			.addUserOption(option => option.setName('target').setDescription('The user')))
	.addSubcommand(subcommand =>
		subcommand
			.setName('server')
			.setDescription('Info about the server'));

#
Localizations

The names and descriptions of slash commands can be localized to the user's selected language. You can find the list of accepted locales on the discord API documentation

.

Setting localizations with setNameLocalizations() and setDescriptionLocalizations() takes the format of an object, mapping location codes (e.g. pl and de) to their localized strings.

const { SlashCommandBuilder } = require('discord.js');

const data = new SlashCommandBuilder()
	.setName('dog')
	.setNameLocalizations({
		pl: 'pies',
		de: 'hund',
	})
	.setDescription('Get a cute picture of a dog!')
	.setDescriptionLocalizations({
		pl: 'Słodkie zdjęcie pieska!',
		de: 'Poste ein niedliches Hundebild!',
	})
	.addStringOption(option =>
		option
			.setName('breed')
			.setDescription('Breed of dog')
			.setNameLocalizations({
				pl: 'rasa',
				de: 'rasse',
			})
			.setDescriptionLocalizations({
				pl: 'Rasa psa',
				de: 'Hunderasse',
			}),
	);

arsing options
#
Command options

In this section, we'll cover how to access the values of a command's options. Consider the following ban command example with two options:

const { InteractionContextType, PermissionFlagsBits, SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('ban')
		.setDescription('Select a member and ban them.')
		.addUserOption(option =>
			option
				.setName('target')
				.setDescription('The member to ban')
				.setRequired(true))
		.addStringOption(option =>
			option
				.setName('reason')
				.setDescription('The reason for banning'))
		.setDefaultMemberPermissions(PermissionFlagsBits.BanMembers)
		.setContexts(InteractionContextType.Guild),
};

In the execute method, you can retrieve the value of these two options from the CommandInteractionOptionResolver as shown below:

module.exports = {
	// data: new SlashCommandBuilder()...
	async execute(interaction) {
		const target = interaction.options.getUser('target');
		const reason = interaction.options.getString('reason') ?? 'No reason provided';

		await interaction.reply(`Banning ${target.username} for reason: ${reason}`);
		await interaction.guild.members.ban(target);
	},
};

Since reason isn't a required option, the example above uses the ?? nullish coalescing operator

to set a default value in case the user does not supply a value for reason.

If the target user is still in the guild where the command is being run, you can also use .getMember('target') to get their GuildMember object.

TIP

If you want the Snowflake of a structure instead, grab the option via get() and access the Snowflake via the value property. Note that you should use const { value: name } = ... here to destructure and rename
the value obtained from the CommandInteractionOption

structure to avoid identifier name conflicts.

In the same way as the above examples, you can get values of any type using the corresponding CommandInteractionOptionResolver#get_____() method. String, Integer, Number and Boolean options all provide the respective primitive types, while User, Channel, Role, and Mentionable options will provide either the respective discord.js class instance if your application has a bot user in the guild or a raw API structure for commands-only deployments.
#
Choices

If you specified preset choices for your String, Integer, or Number option, getting the selected choice is exactly the same as the free-entry options above. Consider the gif command example you looked at earlier:

const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('gif')
		.setDescription('Sends a random gif!')
		.addStringOption(option =>
			option.setName('category')
				.setDescription('The gif category')
				.setRequired(true)
				.addChoices(
					{ name: 'Funny', value: 'gif_funny' },
					{ name: 'Meme', value: 'gif_meme' },
					{ name: 'Movie', value: 'gif_movie' },
				)),
	async execute(interaction) {
		const category = interaction.options.getString('category');
		// category must be one of 'gif_funny', 'gif_meme', or 'gif_movie'
	},
};

Notice that nothing changes - you still use getString() to get the choice value. The only difference is that in this case, you can be sure it's one of only three possible values.
#
Subcommands

If you have a command that contains subcommands, the CommandInteractionOptionResolver#getSubcommand() will tell you which subcommand was used. You can then get any additional options of the selected subcommand using the same methods as above.

The snippet below uses the same info command from the subcommand creation guide to demonstrate how you can control the logic flow when replying to different subcommands:

module.exports = {
	// data: new SlashCommandBuilder()...
	async execute(interaction) {
		if (interaction.options.getSubcommand() === 'user') {
			const user = interaction.options.getUser('target');

			if (user) {
				await interaction.reply(`Username: ${user.username}\nID: ${user.id}`);
			} else {
				await interaction.reply(`Your username: ${interaction.user.username}\nYour ID: ${interaction.user.id}`);
			}
		} else if (interaction.options.getSubcommand() === 'server') {
			await interaction.reply(`Server name: ${interaction.guild.name}\nTotal members: ${interaction.guild.memberCount}`);
		}
	},
};

Slash command permissions

Slash commands have their own permissions system. This system allows you to set the default level of permissions required for a user to execute a command when it is first deployed or your bot is added to a new server.

The slash command permissions for guilds are defaults only and can be altered by guild administrators, allowing them to configure access however best suits their moderation and server roles. Your code should not try to enforce its own permission management, as this can result in a conflict between the server-configured permissions and your bot's code.

WARNING

It is not possible to prevent users with Administrator permissions from using any commands deployed globally or specifically to their guild. Think twice before creating "dev-only" commands such as eval.
#
Member permissions

You can use SlashCommandBuilder#setDefaultMemberPermissions()

to set the default permissions required for a member to run the command. Setting it to 0 will prohibit anyone in a guild from using the command unless a specific overwrite is configured or the user has the Administrator permission flag.

For this, we'll introduce two common and simple moderation commands: ban and kick. For a ban command, a sensible default is to ensure that users already have the Discord permission BanMembers in order to use it.

const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

const data = new SlashCommandBuilder()
	.setName('ban')
	.setDescription('Select a member and ban them.')
	.addUserOption(option =>
		option
			.setName('target')
			.setDescription('The member to ban')
			.setRequired(true))
	.setDefaultMemberPermissions(PermissionFlagsBits.BanMembers);

For a kick command however, we can allow members with the KickMembers permission to execute the command, so we'll list that flag here.

TIP

You can require the user to have all of multiple permissions by merging them with the | bitwise OR operator (for example PermissionFlagsBits.BanMembers | PermissionFlagsBits.KickMembers). You cannot require any of multiple permissions. Discord evaluates against the combined permission bitfield!

If you want to learn more about the | bitwise OR operator you can check the Wikipedia
and MDN

articles on the topic.

const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

const data = new SlashCommandBuilder()
	.setName('kick')
	.setDescription('Select a member and kick them.')
	.addUserOption(option =>
		option
			.setName('target')
			.setDescription('The member to kick')
			.setRequired(true))
	.setDefaultMemberPermissions(PermissionFlagsBits.KickMembers);

In reality, you'll probably want to have an additional confirmation step before a ban actually executes. Check out the button components section of the guide to see how to add confirmation buttons to your command responses, and listen to button clicks.
#
Contexts

By default, globally-deployed commands are also available for use in DMs. You can pass in InteractionContextType

to the setContexts method of the builder to restrict the command to only be available in guilds or DMs.

It doesn't make much sense for your ban command to be available in DMs, so you can add setContexts(InteractionContextType.Guild) to the builder so that it is only available in guilds:

const { InteractionContextType, PermissionFlagsBits, SlashCommandBuilder } = require('discord.js');

const data = new SlashCommandBuilder()
	.setName('ban')
	.setDescription('Select a member and ban them.')
	.addUserOption(option =>
		option
			.setName('target')
			.setDescription('The member to ban')
			.setRequired(true))
	.setDefaultMemberPermissions(PermissionFlagsBits.BanMembers)
	.setContexts(InteractionContextType.Guild);

And that's all you need to know on slash command permissions and contexts!

Autocomplete

Autocomplete allows you to dynamically provide a selection of values to the user, based on their input, rather than relying on static choices. In this section we will cover how to add autocomplete support to your commands.

TIP

This page is a follow-up to the slash commands section covering options and option choices. Please carefully read those pages first so that you can understand the methods used in this section.
#
Enabling autocomplete

To use autocomplete with your commands, instead of listing static choices, the option must be set to use autocompletion using SlashCommandStringOption#setAutocomplete()

:

const { SlashCommandBuilder } = require('discord.js');

const data = new SlashCommandBuilder()
	.setName('guide')
	.setDescription('Search discordjs.guide!')
	.addStringOption(option =>
		option.setName('query')
			.setDescription('Phrase to search for')
			.setAutocomplete(true));

#
Responding to autocomplete interactions

To handle an AutocompleteInteraction
, use the BaseInteraction#isAutocomplete()

type guard to make sure the interaction instance is an autocomplete interaction. You can do this in a separate interactionCreate listener:

client.on(Events.InteractionCreate, interaction => {
	if (!interaction.isAutocomplete()) return;
	// do autocomplete handling
});

Or alternatively, by making a small change to your existing Command handler and adding an additional method to your individual command files.

The example below shows how this might be applied to a conceptual version of the guide command to determine the closest topic to the search input:

client.on(Events.InteractionCreate, async interaction => {
	if (interaction.isChatInputCommand()) {
		// command handling
	} else if (interaction.isAutocomplete()) {
		const command = interaction.client.commands.get(interaction.commandName);

		if (!command) {
			console.error(`No command matching ${interaction.commandName} was found.`);
			return;
		}

		try {
			await command.autocomplete(interaction);
		} catch (error) {
			console.error(error);
		}
	}
});

The command handling is almost identical, but notice the change from execute to autocomplete in the new else-if branch. By adding a separate autocomplete function to the module.exports of commands that require autocompletion, you can safely separate the logic of providing dynamic choices from the code that needs to respond to the slash command once it is complete.

TIP

You might have already moved this code to events/interactionCreate.js if you followed our Event handling guide too.
#
Sending results

The AutocompleteInteraction
class provides the AutocompleteInteraction#respond() method to send a response. Using this, you can submit an array of ApplicationCommandOptionChoiceData

objects for the user to choose from. Passing an empty array will show "No options match your search" for the user.

WARNING

Unlike static choices, autocompletion suggestions are not enforced, and users may still enter free text.

The CommandInteractionOptionResolver#getFocused()
method returns the currently focused option's value, which can be used to apply filtering to the choices presented. For example, to only display options starting with the focused value you can use the Array#filter() method, then using Array#map(), you can transform the array into an array of ApplicationCommandOptionChoiceData

objects.

module.exports = {
	data: new SlashCommandBuilder()
		.setName('guide')
		.setDescription('Search discordjs.guide!')
		.addStringOption(option =>
			option.setName('query')
				.setDescription('Phrase to search for')
				.setAutocomplete(true)),
	async autocomplete(interaction) {
		const focusedValue = interaction.options.getFocused();
		const choices = ['Popular Topics: Threads', 'Sharding: Getting started', 'Library: Voice Connections', 'Interactions: Replying to slash commands', 'Popular Topics: Embed preview'];
		const filtered = choices.filter(choice => choice.startsWith(focusedValue));
		await interaction.respond(
			filtered.map(choice => ({ name: choice, value: choice })),
		);
	},
};

#
Handling multiple autocomplete options

To distinguish between multiple options, you can pass true into CommandInteractionOptionResolver#getFocused()

, which will now return the full focused object instead of just the value. This is used to get the name of the focused option below, allowing for multiple options to each have their own set of suggestions:

module.exports = {
	data: new SlashCommandBuilder()
		.setName('guide')
		.setDescription('Search discordjs.guide!')
		.addStringOption(option =>
			option.setName('query')
				.setDescription('Phrase to search for')
				.setAutocomplete(true))
		.addStringOption(option =>
			option.setName('version')
				.setDescription('Version to search in')
				.setAutocomplete(true)),
	async autocomplete(interaction) {
		const focusedOption = interaction.options.getFocused(true);
		let choices;

		if (focusedOption.name === 'query') {
			choices = ['Popular Topics: Threads', 'Sharding: Getting started', 'Library: Voice Connections', 'Interactions: Replying to slash commands', 'Popular Topics: Embed preview'];
		}

		if (focusedOption.name === 'version') {
			choices = ['v9', 'v11', 'v12', 'v13', 'v14'];
		}

		const filtered = choices.filter(choice => choice.startsWith(focusedOption.value));
		await interaction.respond(
			filtered.map(choice => ({ name: choice, value: choice })),
		);
	},
};

#
Accessing other values

In addition to filtering based on the focused value, you may also wish to change the choices displayed based on the value of other arguments in the command. The following methods work the same in AutocompleteInteraction

:

const string = interaction.options.getString('input');
const integer = interaction.options.getInteger('int');
const boolean = interaction.options.getBoolean('choice');
const number = interaction.options.getNumber('num');

However, the .getUser(), .getMember(), .getRole(), .getChannel(), .getMentionable() and .getAttachment() methods are not available to autocomplete interactions. Discord does not send the respective full objects for these methods until the slash command is completed. For these, you can get the Snowflake value using interaction.options.get('option').value:
#
Notes

    As with other application command interactions, autocomplete interactions must receive a response within 3 seconds.
    You cannot defer the response to an autocomplete interaction. If you're dealing with asynchronous suggestions, such as from an API, consider keeping a local cache.
    After the user selects a value and sends the command, it will be received as a regular ChatInputCommandInteraction

with the chosen value.
You can only respond with a maximum of 25 choices at a time, though any more than this likely means you should revise your filter to further narrow the selections.

Action rows

With the components API, you can create interactive message components to enhance the functionality of your slash commands. To get started with this, the first component type you'll need to understand is the action row. To send any type of component, it must be placed in an action row.

Action rows are a fairly simple form of layout component. A message may contain up to five rows, each of which has a "width" of five units. This can be thought of as a flexible 5x5 grid. A button will consume one unit of width in a row, while a select menu will consume the whole five units of width. At this time, these are the only types of components that can be sent in a message.

WARNING

The "width units" referred to are not fixed - the actual width of each individual button will be dynamic based on its label contents.
#
Building action rows

To create an action row, use the ActionRowBuilder
class and the ActionRowBuilder#addComponents()

method to add buttons or a select menu.

const row = new ActionRowBuilder()
	.addComponents(component);

WARNING

If you're using TypeScript, you'll need to specify the type of components your action row holds. This can be done by specifying the component builder you will add to it using a generic parameter in ActionRowBuilder

.

- new ActionRowBuilder()
+ new ActionRowBuilder<ButtonBuilder>()

#
Sending action rows

Once one or many components are inside your row(s), send them in the components property of your InteractionReplyOptions
(extends BaseMessageOptions

).

const row = new ActionRowBuilder()
	.addComponents(component);

await interaction.reply({ components: [row] });

To learn how to create the buttons and select menus that will go inside your row, including more detailed examples on how you might use them, continue on to the other pages in this section.

Buttons

The first type of interactive component we'll cover creating is a Button. Buttons are available in a variety of styles and can be used to provide permanent interfaces, temporary confirmation workflows, and other forms of additional interaction with your bot.

TIP

This page is a follow-up to the slash commands section and action rows page. Please carefully read those pages first so that you can understand the methods used here.
#
Building buttons

Buttons are one of the MessageComponent classes, which can be sent via messages or interaction responses.

For this example, you're going to expand on the ban command that was previously covered on the parsing options page with a confirmation workflow.

To create your buttons, use the ButtonBuilder

class, defining at least the customId, style and label.

const { ButtonBuilder, ButtonStyle, SlashCommandBuilder } = require('discord.js');

module.exports = {
	// data: new SlashCommandBuilder()...
	async execute(interaction) {
		const target = interaction.options.getUser('target');
		const reason = interaction.options.getString('reason') ?? 'No reason provided';

		const confirm = new ButtonBuilder()
			.setCustomId('confirm')
			.setLabel('Confirm Ban')
			.setStyle(ButtonStyle.Danger);

		const cancel = new ButtonBuilder()
			.setCustomId('cancel')
			.setLabel('Cancel')
			.setStyle(ButtonStyle.Secondary);
	},
};

TIP

The custom id is a developer-defined string of up to 100 characters. Use this field to ensure you can uniquely define all incoming interactions from your buttons!
#
Sending buttons

To send your buttons, create an action row and add the buttons as components. Then, send the row in the components property of InteractionReplyOptions
(extends BaseMessageOptions

).

const { ActionRowBuilder, ButtonBuilder, ButtonStyle, SlashCommandBuilder } = require('discord.js');

module.exports = {
	// data: new SlashCommandBuilder()...
	async execute(interaction) {
		const target = interaction.options.getUser('target');
		const reason = interaction.options.getString('reason') ?? 'No reason provided';

		const confirm = new ButtonBuilder()
			.setCustomId('confirm')
			.setLabel('Confirm Ban')
			.setStyle(ButtonStyle.Danger);

		const cancel = new ButtonBuilder()
			.setCustomId('cancel')
			.setLabel('Cancel')
			.setStyle(ButtonStyle.Secondary);

		const row = new ActionRowBuilder()
			.addComponents(cancel, confirm);

		await interaction.reply({
			content: `Are you sure you want to ban ${target} for reason: ${reason}?`,
			components: [row],
		});
	},
};

Restart your bot and then send the command to a channel your bot has access to. If all goes well, you should see something like this:
User used /ban
Guide Bot Bot 08/19/2025
Are you sure you want to ban @User for reason: trolling?
#
Button styles

You'll notice in the above example that two different styles of buttons have been used, the grey Secondary style and the red Danger style. These were chosen specifically to support good UI/UX principles. In total, there are five button styles that can be used as appropriate to the action of the button:

    Primary style buttons are blue. These are suitable for most general purpose actions, where it's the primary or most significant action expected.
    Secondary style buttons are grey. Use these for less important actions like the "Cancel" button in the example above.
    Success style buttons are green. Similar to the Primary button, these are a good choice for "positive" confirmation actions.
    Danger style buttons are red. Where the action being confirmed is "destructive", such a ban or delete, using a red button helps alert the user to the risk of the action.
    Link style buttons are also grey, but are tagged with the "external link" symbol. These buttons will open the provided link in the browser without sending an interaction to the bot.

#
Link buttons

Link buttons are a little different to the other styles. Link buttons must have a url, cannot have a customId and do not send an interaction event when clicked.

const button = new ButtonBuilder()
	.setLabel('discord.js docs')
	.setURL('https://discord.js.org')
	.setStyle(ButtonStyle.Link);

#
Disabled buttons

If you want to prevent a button from being used, but not remove it from the message, you can disable it with the ButtonBuilder#setDisabled()

method:

const button = new ButtonBuilder()
	.setCustomId('disabled')
	.setLabel('Click me?')
	.setStyle(ButtonStyle.Primary)
	.setDisabled(true);

User used /button
Guide Bot Bot 08/19/2025
Are you even able to
#
Emoji buttons

If you want to use a guild emoji within a ButtonBuilder
, you can use the ButtonBuilder#setEmoji()

method:

const button = new ButtonBuilder()
	.setCustomId('primary')
	.setLabel('Primary')
	.setStyle(ButtonStyle.Primary)
	.setEmoji('123456789012345678');

#
Next steps

That's everything you need to know about building and sending buttons! From here you can learn about the other type of message component, select menus, or have your bot start listening to component interactions from your buttons.

Select menus are one of the MessageComponent classes, which can be sent via messages or interaction responses.

TIP

This page is a follow-up to the slash commands section and action rows page. Please carefully read those pages first so that you can understand the methods used here.
#
Building string select menus

The "standard" and most customizable type of select menu is the string select menu. To create a string select menu, use the StringSelectMenuBuilder
and StringSelectMenuOptionBuilder

classes.

If you're a Pokémon fan, you've probably made a selection pretty similar to this example at some point in your life!

const { StringSelectMenuBuilder, StringSelectMenuOptionBuilder, SlashCommandBuilder } = require('discord.js');

module.exports = {
	// data: new SlashCommandBuilder()...
	async execute(interaction) {
		const select = new StringSelectMenuBuilder()
			.setCustomId('starter')
			.setPlaceholder('Make a selection!')
			.addOptions(
				new StringSelectMenuOptionBuilder()
					.setLabel('Bulbasaur')
					.setDescription('The dual-type Grass/Poison Seed Pokémon.')
					.setValue('bulbasaur'),
				new StringSelectMenuOptionBuilder()
					.setLabel('Charmander')
					.setDescription('The Fire-type Lizard Pokémon.')
					.setValue('charmander'),
				new StringSelectMenuOptionBuilder()
					.setLabel('Squirtle')
					.setDescription('The Water-type Tiny Turtle Pokémon.')
					.setValue('squirtle'),
			);
	},
};

TIP

The custom id is a developer-defined string of up to 100 characters. Use this field to ensure you can uniquely define all incoming interactions from your select menus!
#
Sending select menus

To send your select menu, create an action row and add the buttons as components. Then, send the row in the components property of InteractionReplyOptions
(extends BaseMessageOptions

).

const { ActionRowBuilder, StringSelectMenuBuilder, StringSelectMenuOptionBuilder, SlashCommandBuilder } = require('discord.js');

module.exports = {
	// data: new SlashCommandBuilder()...
	async execute(interaction) {
		const select = new StringSelectMenuBuilder()
			.setCustomId('starter')
			.setPlaceholder('Make a selection!')
			.addOptions(
				new StringSelectMenuOptionBuilder()
					.setLabel('Bulbasaur')
					.setDescription('The dual-type Grass/Poison Seed Pokémon.')
					.setValue('bulbasaur'),
				new StringSelectMenuOptionBuilder()
					.setLabel('Charmander')
					.setDescription('The Fire-type Lizard Pokémon.')
					.setValue('charmander'),
				new StringSelectMenuOptionBuilder()
					.setLabel('Squirtle')
					.setDescription('The Water-type Tiny Turtle Pokémon.')
					.setValue('squirtle'),
			);

		const row = new ActionRowBuilder()
			.addComponents(select);

		await interaction.reply({
			content: 'Choose your starter!',
			components: [row],
		});
	},
};

TIP

Remember that if you have more than one select menu, each one will need its own action row.
#
String select menu options

String select menu options are custom-defined by the user, as shown in the example above. At a minimum, each option must have it's label and value defined. The label is shown to the user, while the value is included in the interaction sent to the bot.

In addition to these, each option can be enhanced with a description or emoji, or can be set to be selected by default.

const select = new StringSelectMenuBuilder()
	.setCustomId('select')
	.addOptions(
		new StringSelectMenuOptionBuilder()
			.setLabel('Option')
			.setValue('option')
			.setDescription('A selectable option')
			.setEmoji('123456789012345678')
			.setDefault(true),
	);

#
Auto-populating select menus

Although the String select menu with its user-defined options is the most customizable, there are four other types of select menu that auto-populate with their corresponding Discord entities, much like slash command options. These are:

    UserSelectMenuBuilder

RoleSelectMenuBuilder
MentionableSelectMenuBuilder
ChannelSelectMenuBuilder

The ChannelSelectMenuBuilder can be configured to only show specific channel types using ChannelSelectMenuBuilder#setChannelTypes()

.
#
Multi-selects

Where slash command options fall behind is in their single-select limitation on User, Role and Channel option types. Select menus can support this use case via BaseSelectMenuBuilder#setMinValues()
and BaseSelectMenuBuilder#setMaxValues()

. When these values are set, users can select multiple items, and the interaction will be sent with all selected values only when the user clicks outside the select menu.

module.exports = {
	// data: new SlashCommandBuilder()...
	async execute(interaction) {
		const userSelect = new UserSelectMenuBuilder()
			.setCustomId('users')
			.setPlaceholder('Select multiple users.')
			.setMinValues(1)
			.setMaxValues(10);

		const row1 = new ActionRowBuilder()
			.addComponents(userSelect);

		await interaction.reply({
			content: 'Select users:',
			components: [row1],
		});
	},
};

Modals

With modals you can create pop-up forms that allow users to provide you with formatted inputs through submissions. We'll cover how to create, show, and receive modal forms using discord.js!

TIP

This page is a follow-up to the interactions (slash commands) page. Please carefully read that section first, so that you can understand the methods used in this section.
#
Building and responding with modals

Unlike message components, modals aren't strictly components themselves. They're a callback structure used to respond to interactions.

TIP

You can have a maximum of five ActionRowBuilder
s per modal builder, and one TextInputBuilder within an ActionRowBuilder. Currently, you can only use TextInputBuilder

s in modal action rows builders.

To create a modal you construct a new ModalBuilder

. You can then use the setters to add the custom id and title.

const { Events, ModalBuilder } = require('discord.js');

client.on(Events.InteractionCreate, async interaction => {
	if (!interaction.isChatInputCommand()) return;

	if (interaction.commandName === 'ping') {
		const modal = new ModalBuilder()
			.setCustomId('myModal')
			.setTitle('My Modal');

		// TODO: Add components to modal...
	}
});

TIP

The custom id is a developer-defined string of up to 100 characters. Use this field to ensure you can uniquely define all incoming interactions from your modals!

The next step is to add the input fields in which users responding can enter free-text. Adding inputs is similar to adding components to messages.

At the end, we then call ChatInputCommandInteraction#showModal()

to display the modal to the user.

WARNING

If you're using typescript you'll need to specify the type of components your action row holds. This can be done by specifying the generic parameter in ActionRowBuilder

- new ActionRowBuilder()
+ new ActionRowBuilder<ModalActionRowComponentBuilder>()

const { ActionRowBuilder, Events, ModalBuilder, TextInputBuilder, TextInputStyle } = require('discord.js');

client.on(Events.InteractionCreate, async interaction => {
	if (!interaction.isChatInputCommand()) return;

	if (interaction.commandName === 'ping') {
		// Create the modal
		const modal = new ModalBuilder()
			.setCustomId('myModal')
			.setTitle('My Modal');

		// Add components to modal

		// Create the text input components
		const favoriteColorInput = new TextInputBuilder()
			.setCustomId('favoriteColorInput')
		    // The label is the prompt the user sees for this input
			.setLabel("What's your favorite color?")
		    // Short means only a single line of text
			.setStyle(TextInputStyle.Short);

		const hobbiesInput = new TextInputBuilder()
			.setCustomId('hobbiesInput')
			.setLabel("What's some of your favorite hobbies?")
		    // Paragraph means multiple lines of text.
			.setStyle(TextInputStyle.Paragraph);

		// An action row only holds one text input,
		// so you need one action row per text input.
		const firstActionRow = new ActionRowBuilder().addComponents(favoriteColorInput);
		const secondActionRow = new ActionRowBuilder().addComponents(hobbiesInput);

		// Add inputs to the modal
		modal.addComponents(firstActionRow, secondActionRow);

		// Show the modal to the user
		await interaction.showModal(modal);
	}
});

Restart your bot and invoke the /ping command again. You should see a popup form resembling the image below:

WARNING

Showing a modal must be the first response to an interaction. You cannot defer() or deferUpdate() then show a modal later.
#
Input styles

Currently there are two different input styles available:

    Short, a single-line text entry;
    Paragraph, a multi-line text entry similar to the HTML <textarea>;

#
Input properties

In addition to the customId, label and style, a text input can be customised in a number of ways to apply validation, prompt the user, or set default values via the TextInputBuilder

methods:

const input = new TextInputBuilder()
	// set the maximum number of characters to allow
	.setMaxLength(1_000)
	// set the minimum number of characters required for submission
	.setMinLength(10)
	// set a placeholder string to prompt the user
	.setPlaceholder('Enter some text!')
	// set a default value to pre-fill the input
	.setValue('Default')
	 // require a value in this input field
	.setRequired(true);

#
Receiving modal submissions
#
Interaction collectors

Modal submissions can be collected within the scope of the interaction that showed it by utilising an InteractionCollector
, or the ChatInputCommandInteraction#awaitModalSubmit() promisified method. These both provide instances of the ModalSubmitInteraction

class as collected items.

For a detailed guide on receiving message components via collectors, please refer to the collectors guide.
#
The interactionCreate event

To receive a ModalSubmitInteraction
event, attach an Client#interactionCreate event listener to your client and use the BaseInteraction#isModalSubmit()

type guard to make sure you only receive modals:

client.on(Events.InteractionCreate, interaction => {
	if (!interaction.isModalSubmit()) return;
	console.log(interaction);
});

#
Responding to modal submissions

The ModalSubmitInteraction
class provides the same methods as the ChatInputCommandInteraction

class. These methods behave equally:

    reply()
    editReply()
    deferReply()
    fetchReply()
    deleteReply()
    followUp()

If the modal was shown from a ButtonInteraction
or StringSelectMenuInteraction

, it will also provide these methods, which behave equally:

    update()
    deferUpdate()

client.on(Events.InteractionCreate, async interaction => {
	if (!interaction.isModalSubmit()) return;
	if (interaction.customId === 'myModal') {
		await interaction.reply({ content: 'Your submission was received successfully!' });
	}
});

TIP

If you're using typescript, you can use the ModalSubmitInteraction#isFromMessage()

typeguard, to make sure the received interaction was from a MessageComponentInteraction.
#
Extracting data from modal submissions

You'll most likely need to read the data sent by the user in the modal. You can do this by accessing the ModalSubmitInteraction#fields
. From there you can call ModalSubmitFields#getTextInputValue()

with the custom id of the text input to get the value.

client.on(Events.InteractionCreate, interaction => {
	if (!interaction.isModalSubmit()) return;

	// Get the data entered by the user
	const favoriteColor = interaction.fields.getTextInputValue('favoriteColorInput');
	const hobbies = interaction.fields.getTextInputValue('hobbiesInput');
	console.log({ favoriteColor, hobbies });
});

Context Menus

Context Menus are application commands which appear when right clicking or tapping a user or a message, in the Apps submenu.

TIP

This page is a follow-up to the slash commands section. Please carefully read those pages first so that you can understand the methods used in this section.
#
Registering context menu commands

To create a context menu command, use the ContextMenuCommandBuilder

class. You can then set the type of the context menu (user or message) using the setType() method.

const { ContextMenuCommandBuilder, ApplicationCommandType } = require('discord.js');

const data = new ContextMenuCommandBuilder()
	.setName('User Information')
	.setType(ApplicationCommandType.User);

#
Receiving context menu command interactions

Context menus commands, just like slash commands, are received via an interaction. You can check if a given interaction is a context menu by invoking the isContextMenuCommand() method, or the isMessageContextMenuCommand() and isUserContextMenuCommand() methods to check for the specific type of context menu interaction:

client.on(Events.InteractionCreate, interaction => {
	if (!interaction.isUserContextMenuCommand()) return;
	console.log(interaction);
});

#
Extracting data from context menus

For user context menus, you can get the targeted user by accessing the targetUser or targetMember property from the UserContextMenuCommandInteraction

.

For message context menus, you can get the targeted message by accessing the targetMessage property from the MessageContextMenuCommandInteraction

.

client.on(Events.InteractionCreate, interaction => {
	if (!interaction.isUserContextMenuCommand()) return;
	// Get the User's username from context menu
	const { username } = interaction.targetUser;
	console.log(username);
});

#
Notes

    Context menu commands cannot have subcommands or any options.
    Responding to context menu commands functions the same as slash commands. Refer to our slash command responses guide for more information.
    Context menu command permissions also function the same as slash commands. Refer to our slash command permissions guide for more information.

    Permissions

Permissions are Discord's primary feature, enabling users to customize their server's workings to their liking. Essentially, Permissions and permission overwrites tell Discord who is allowed to do what and where. Permissions can be very confusing at first, but this guide is here to explain and clarify them, so let's dive in!
#
Roles as bot permissions

If you want to keep your bot's permission checks simple, you might find it sufficient to check if the member executing the command has a specific role.

If you have the role ID, you can check if the .roles Collection on a GuildMember object includes it, using .has(). Should you not know the ID and want to check for something like a "Mod" role, you can use .some().

member.roles.cache.has('role-id-here');
// returns true if the member has the role

member.roles.cache.some(role => role.name === 'Mod');
// returns true if any of the member's roles is exactly named "Mod"

If you want to enhance this system slightly, you can include the guild owner by comparing the executing member's ID with interaction.guild.ownerId.

To include permission checks like Administrator or ManageGuild, keep reading as we will cover Discord Permissions and all their intricacies in the following sections.
#
Terminology

    Permission: The ability to execute a certain action in Discord
    Overwrite: Rule on a channel to modify the permissions for a member or role
    BitField: Binary representation of Discord permissions
    Base Permissions: Permissions for roles the member has, set on the guild level
    Final Permissions: Permissions for a member or role, after all overwrites are applied
    Flag: Human readable string in PascalCase (e.g., KickMembers) that refers to a position in the permission BitField. You can find a list of all valid flags on the PermissionsBitField#Flags

    page

TIP

You can provide permission decimals wherever we use flag literals in this guide. If you are interested in a handy permission calculator, you can look at the "Bot" section in the Discord developer portal

.
#
Base permissions
#
Setting role permissions

Base permissions are set on roles, not the guild member itself. To change them, you access a Role object (for example via member.roles.cache.first() or guild.roles.cache.random()) and use the .setPermissions() method. This is how you'd change the base permissions for the @everyone role, for example:

const { PermissionsBitField } = require('discord.js');

guild.roles.everyone.setPermissions([PermissionsBitField.Flags.SendMessages, PermissionsBitField.Flags.ViewChannel]);

Any permission not referenced in the flag array or bit field is not granted to the role.

TIP

Note that flag names are literal. Although ViewChannel grants access to view multiple channels, the permission flag is still called ViewChannel in singular form.
#
Creating a role with permissions

Alternatively you can provide permissions as a property of RoleCreateOptions

during role creation as an array of flag strings or a permission number:

const { PermissionsBitField } = require('discord.js');

guild.roles.create({ name: 'Mod', permissions: [PermissionsBitField.Flags.SendMessages, PermissionsBitField.Flags.KickMembers] });

#
Checking member permissions

To know if one of a member's roles has a permission enabled, you can use the .has() method on GuildMember#permissions

and provide a permission flag, array, or number to check for. You can also specify if you want to allow the Administrator permission or the guild owner status to override this check with the following parameters.

const { PermissionsBitField } = require('discord.js');

if (member.permissions.has(PermissionsBitField.Flags.KickMembers)) {
	console.log('This member can kick');
}

if (member.permissions.has([PermissionsBitField.Flags.KickMembers, PermissionsBitField.Flags.BanMembers])) {
	console.log('This member can kick and ban');
}

if (member.permissions.has(PermissionsBitField.Flags.KickMembers, false)) {
	console.log('This member can kick without allowing admin to override');
}

If you provide multiple permissions to the method, it will only return true if all permissions you specified are granted.

TIP

You can learn more about the .has() method here.
#
Channel overwrites

Permission overwrites control members' abilities for this specific channel or a set of channels if applied to a category with synchronized child channels.

As you have likely already seen in your desktop client, channel overwrites have three states:

    Explicit allow (true, green ✓)
    Explicit deny (false, red X)
    Default (null, gray /)

#
Adding overwrites

To add a permission overwrite for a role or guild member, you access the channel's PermissionOverwriteManager
and use the .create() method. The first parameter is the target of the overwrite, either a Role or User object (or its respective resolvable), and the second is a PermissionOverwriteOptions

object.

Let's add an overwrite to lock everyone out of the channel. The guild ID doubles as the role id for the default role @everyone as demonstrated below:

channel.permissionOverwrites.create(channel.guild.roles.everyone, { ViewChannel: false });

Any permission flags not specified get neither an explicit allow nor deny overwrite and will use the base permission unless another role has an explicit overwrite set.

You can also provide an array of overwrites during channel creation, as shown below:

const { ChannelType, PermissionsBitField } = require('discord.js');

guild.channels.create({
	name: 'new-channel',
	type: ChannelType.GuildText,
	permissionOverwrites: [
		{
			id: interaction.guild.id,
			deny: [PermissionsBitField.Flags.ViewChannel],
		},
		{
			id: interaction.user.id,
			allow: [PermissionsBitField.Flags.ViewChannel],
		},
	],
});

#
Editing overwrites

To edit permission overwrites on the channel with a provided set of new overwrites, you can use the .edit() method.

// edits overwrites to disallow everyone to view the channel
channel.permissionOverwrites.edit(guild.id, { ViewChannel: false });

// edits overwrites to allow a user to view the channel
channel.permissionOverwrites.edit(user.id, { ViewChannel: true });

#
Replacing overwrites

To replace all permission overwrites on the channel with a provided set of new overwrites, you can use the .set() method. This is extremely handy if you want to copy a channel's full set of overwrites to another one, as this method also allows passing an array or Collection of PermissionOverwrites

.

// copying overwrites from another channel
channel.permissionOverwrites.set(otherChannel.permissionOverwrites.cache);

// replacing overwrites with PermissionOverwriteOptions
channel.permissionOverwrites.set([
	{
		id: guild.id,
		deny: [PermissionsBitField.Flags.ViewChannel],
	},
	{
		id: user.id,
		allow: [PermissionsBitField.Flags.ViewChannel],
	},
]);

#
Removing overwrites

To remove the overwrite for a specific member or role, you can use the .delete() method.

// deleting the channel's overwrite for the user who interacted
channel.permissionOverwrites.delete(interaction.user.id);

#
Syncing with a category

If the permission overwrites on a channel under a category match with the parent (category), it is considered synchronized. This means that any changes in the categories overwrites will now also change the channels overwrites. Changing the child channels overwrites will not affect the parent.

To easily synchronize permissions with the parent channel, you can call the .lockPermissions() method on the respective child channel.

if (!channel.parent) {
	return console.log('This channel is not listed under a category');
}

channel.lockPermissions()
	.then(() => console.log('Successfully synchronized permissions with parent channel'))
	.catch(console.error);

#
Permissions after overwrites

There are two utility methods to easily determine the final permissions for a guild member or role in a specific channel: GuildChannel#permissionsFor()
and GuildMember#permissionsIn() - Role#permissionsIn(). All return a PermissionsBitField

object.

To check your bot's permissions in the channel the command was used in, you could use something like this:

// final permissions for a guild member using permissionsFor
const botPermissionsFor = channel.permissionsFor(guild.members.me);

// final permissions for a guild member using permissionsIn
const botPermissionsIn = guild.members.me.permissionsIn(channel);

// final permissions for a role
const rolePermissions = channel.permissionsFor(role);

WARNING

The .permissionsFor() and .permissionsIn() methods return a Permissions object with all permissions set if the member or role has the global Administrator permission and does not take overwrites into consideration in this case. Using the second parameter of the .has() method as described further down in the guide will not allow you to check without taking Administrator into account here!

If you want to know how to work with the returned Permissions objects, keep reading as this will be our next topic.
#
The Permissions object

The PermissionsBitField

object is a discord.js class containing a permissions bit field and a bunch of utility methods to manipulate it easily. Remember that using these methods will not manipulate permissions, but rather create a new instance representing the changed bit field.
#
Displaying permission flags

discord.js provides a toArray() method, which can be used to convert a Permissions object into an array containing permission flags. This is useful if you want to display/list them and it enables you to use other array manipulation methods. For example:

const memberPermissions = member.permissions.toArray();
const rolePermissions = role.permissions.toArray();
// output: ['SendMessages', 'AddReactions', 'ChangeNickname', ...]

TIP

The return value of toArray() always represents the permission flags present in the Permissions instance that the method was called on. This means that if you call the method on, for example: PermissionOverwrites#deny, you will receive an array of all denied permissions in that overwrite.

Additionally, you can serialize the Permissions object's underlying bit field by calling .serialize(). This returns an object that maps permission names to a boolean value, indicating whether the relevant "bit" is available in the Permissions instance.

const memberPermissions = member.permissions.serialize();
const rolePermissions = role.permissions.serialize();
/* output: {
SendMessages: true,
AddReactions: true,
BanMembers: false,
...
}
*/

#
Converting permission numbers

Some methods and properties in discord.js return permission decimals rather than a Permissions object, making it hard to manipulate or read them if you don't want to use bitwise operations. However, you can pass these decimals to the Permissions constructor to convert them, as shown below.

const { PermissionsBitField } = require('discord.js');

const permissions = new PermissionsBitField(268_550_160n);

You can also use this approach for other PermissionResolvable

s like flag arrays or flags.

const { PermissionsBitField } = require('discord.js');

const flags = [
	PermissionsBitField.Flags.ViewChannel,
	PermissionsBitField.Flags.EmbedLinks,
	PermissionsBitField.Flags.AttachFiles,
	PermissionsBitField.Flags.ReadMessageHistory,
	PermissionsBitField.Flags.ManageRoles,
];

const permissions = new PermissionsBitField(flags);

#
Checking for permissions

The Permissions object features the .has() method, allowing an easy way to check flags in a Permissions bit field. The .has() method takes two parameters: the first being either a permission number, single flag, or an array of permission numbers and flags, the second being a boolean, indicating if you want to allow the Administrator permission to override (defaults to true).

Let's say you want to know if the decimal bit field representation 268_550_160 has ManageChannels referenced:

const { PermissionsBitField } = require('discord.js');

const bitPermissions = new PermissionsBitField(268_550_160n);

console.log(bitPermissions.has(PermissionsBitField.Flags.ManageChannels));
// output: true

console.log(bitPermissions.has([PermissionsBitField.Flags.ManageChannels, PermissionsBitField.Flags.EmbedLinks]));
// output: true

console.log(bitPermissions.has([PermissionsBitField.Flags.ManageChannels, PermissionsBitField.Flags.KickMembers]));
// output: false

const flagsPermissions = new PermissionsBitField([
	PermissionsBitField.Flags.ManageChannels,
	PermissionsBitField.Flags.EmbedLinks,
	PermissionsBitField.Flags.AttachFiles,
	PermissionsBitField.Flags.ReadMessageHistory,
	PermissionsBitField.Flags.ManageRoles,
]);

console.log(flagsPermissions.has(PermissionsBitField.Flags.ManageChannels));
// output: true

console.log(flagsPermissions.has([PermissionsBitField.Flags.ManageChannels, PermissionsBitField.Flags.EmbedLinks]));
// output: true

console.log(flagsPermissions.has([PermissionsBitField.Flags.ManageChannels, PermissionsBitField.Flags.KickMembers]));
// output: false

const adminPermissions = new PermissionsBitField(PermissionsBitField.Flags.Administrator);

console.log(adminPermissions.has(PermissionsBitField.Flags.ManageChannels));
// output: true

console.log(adminPermissions.has(PermissionsBitField.Flags.ManageChannels, true));
// output: true

console.log(adminPermissions.has(PermissionsBitField.Flags.ManageChannels, false));
// output: false

#
Manipulating permissions

The Permissions object enables you to easily add or remove individual permissions from an existing bit field without worrying about bitwise operations. Both .add() and .remove() can take a single permission flag or number, an array of permission flags or numbers, or multiple permission flags or numbers as multiple parameters.

const { PermissionsBitField } = require('discord.js');

const permissions = new PermissionsBitField([
	PermissionsBitField.Flags.ViewChannel,
	PermissionsBitField.Flags.EmbedLinks,
	PermissionsBitField.Flags.AttachFiles,
	PermissionsBitField.Flags.ReadMessageHistory,
	PermissionsBitField.Flags.ManageRoles,
]);

console.log(permissions.has(PermissionsBitField.Flags.KickMembers));
// output: false

permissions.add(PermissionsBitField.Flags.KickMembers);
console.log(permissions.has(PermissionsBitField.Flags.KickMembers));
// output: true

permissions.remove(PermissionsBitField.Flags.KickMembers);
console.log(permissions.has(PermissionsBitField.Flags.KickMembers));
// output: false

You can utilize these methods to adapt permissions or overwrites without touching the other flags. To achieve this, you can get the existing permissions for a role, manipulating the bit field as described above and passing the changed bit field to role.setPermissions()

Discord's permission system

Discord permissions are stored in a 53-bit integer and calculated using bitwise operations. If you want to dive deeper into what's happening behind the curtains, check the Wikipedia
and MDN

articles on the topic.

In discord.js, permission bit fields are represented as either the decimal value of said bit field or its referenced flags. Every position in a permissions bit field represents one of these flags and its state (either referenced 1 or not referenced 0).

Before we get into actually assigning permissions, let's quickly go over the method Discord uses to determine a guild member's final permissions:

    Take all permissions for all roles the guild member has and add them up.
    Apply all denies for the default role (@everyone).
    Apply all allows for the default role (@everyone).
    Apply all denies for all additional roles the guild member has at once.
    Apply all allows for all additional roles the guild member has at once.
    Apply all denies for the specific guild member if they exist.
    Apply all allows for the specific guild member if they exist.

Due to this system, you cannot deny base permissions. If you grant SendMessages to @everyone and don't grant it for a muted members role, muted members will still be able to send messages unless you specify channel-based overwrites.

All additional roles allow overwrites are applied after all additional roles denies! If any of a member's roles have an overwrite to allow a permission explicitly, the member can execute the associated actions in this channel regardless of the role hierarchy.

Placing an overwrite to allow SendMessages on a role will result in members with this role not being mutable via role assignment in this channel.
#
Elevated permissions

If the guild owner enables the server's two-factor authentication option, everyone executing a specific subset of actions will need to have 2FA enabled on their account. As bots do not have 2FA themselves, you, as the application owner, will need to enable it on your account for your bot to work on those servers. Check out Discord's help article

if you need assistance with this.

The permissions assigned to these actions are called "elevated permissions" and are: KickMembers, BanMembers, Administrator, ManageChannels, ManageGuild, ManageMessages, ManageRoles, ManageWebhooks, ManageThreads, and ManageGuildExpressions.
#
Implicit permissions

Some Discord permissions apply implicitly based on logical use, which can cause unwanted behavior if you are not aware of this fact.

The prime example for implicit permissions is ViewChannel. If this flag is missing in the final permissions, you can't do anything on that channel. It makes sense, right? If you can't view the channel, you can't read or send messages in it, set the topic, or change its name. The library does not handle implicit permissions for you, so understanding how the system works is vital for you as a bot developer.

Let's say you want to send a message to a channel. To prevent unnecessary API calls, you want to make sure your bot's permissions in this channel include SendMessages (more on how to achieve this here). The check passes, but you still can't send the message and are greeted with DiscordAPIError: Missing Access.

This error means your bot is missing ViewChannel, and as such, can't send messages either.

One possible scenario causing this: the channel has permission overwrites for the default role @everyone to grant SendMessages so everyone who can see the channel can also write in it, but at the same time has an overwrite to deny ViewChannel to make it only accessible to a subset of members.

As you only check for SendMessages, the bot will try to execute the send, but since ViewChannel is missing, the API denies the request.

TIP

Causes for "Missing Access":

    Text Channels require ViewChannel as detailed above.
    Voice Channels require Connect in the same way.
    Reacting to a message requires ReadMessageHistory in the channel the message was sent.
    When deploying slash commands: Enable the applications.commands scope (for more information see the adding your bot section).
    Timing out a member requires ModerateMembers.
    Editing threads (tags, locking, closing, etc.) requires SendMessagesInThreads.

#
Limitations and oddities

    Your bot needs ManageRoles in its base permissions to change base permissions.
    It needs ManageRoles in its final permissions to change permission overwrites.
    It cannot edit permissions for roles that are higher than or equal to its highest role.
    It cannot grant permissions it doesn't have.
    It can manage overwrites for roles or users with higher roles than its own highest role.
    It can manage overwrites for permissions it doesn't have.
    Members with the Administrator permission are not affected by overwrites at all.

#
Missing permissions

During your development, you will likely run into DiscordAPIError: Missing Permissions at some point. One of the following can cause this error:

    Your bot is missing the needed permission to execute this action in its calculated base or final permissions (requirement changes based on the type of action you are trying to perform).
    You provided an invalid permission number while trying to create overwrites. (The calculator on the apps page returns decimal values while the developer documentation lists the flags in hex. Make sure you are not mixing the two and don't use the hex prefix 0x where not applicable).
    Your bot is currently timed out.
    It is trying to execute an action on a guild member with a role higher than or equal to your bot's highest role.
    It is trying to modify or assign a role higher than or equal to its highest role.
    It is trying to add a managed role to a member.
    It is trying to remove a managed role from a member.
    It is trying to timeout a member with the Administrator permission.
    It is trying to execute a forbidden action on the server owner.
    It is trying to execute an action based on another unfulfilled factor (for example, reserved for partnered guilds).
    It is trying to execute an action on a voice channel without the ViewChannel permission.
    It is trying to create a channel or channel overwrite including the ManageRoles flag but does not have the Administrator permission or an explicit ManageRoles overwrite on this channel (note that the global permission does not count).

WARNING

Granting the Administrator permission does not skip any hierarchical check!

Reacting to messages

One of the first things many people want to know is how to react with emojis, both custom and "regular" (Unicode). There are different routes you need to take for each of those, so let's look at both.

Here's the base code we'll be using:

const { Client, Events, GatewayIntentBits } = require('discord.js');

const client = new Client({
	intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.GuildMessageReactions],
});

client.once(Events.ClientReady, readyClient => {
	console.log(`Ready! Logged in as ${readyClient.user.tag}`);
});

client.on(Events.InteractionCreate, interaction => {
	// ...
});

client.login('your-token-goes-here');

#
Unicode emojis

To react with a Unicode emoji, you will need the actual Unicode character of the emoji. There are many ways to get a Unicode character of an emoji, but the easiest way would be through Discord itself. If you send a message with a Unicode emoji (such as :smile:, for example) and put a \ before it, it will "escape" the emoji and display the Unicode character instead of the standard emoji image.
User08/19/2025
Unicode emoji: :smile:
Escaped version (\:smile:): 😄

To react with an emoji, you need to use the message.react() method. Once you have the emoji character, all you need to do is copy & paste it as a string inside the .react() method!

client.on(Events.InteractionCreate, async interaction => {
	if (!interaction.isChatInputCommand()) return;

	const { commandName } = interaction;

	if (commandName === 'react') {
		const response = await interaction.reply({ content: 'You can react with Unicode emojis!', withResponse: true });
		response.resource.message.react('😄');
	}
});

User used /react
Guide Bot Bot 08/19/2025
You can react with Unicode emojis!
smile1
#
Custom emojis

For custom emojis, there are multiple ways of reacting. Like Unicode emojis, you can also escape custom emojis. However, when you escape a custom emoji, the result will be different.
User08/19/2025
Custom emoji: :blobreach:
Escaped version (\:blobreach:): <:blobreach:123456789012345678>

This format is essentially the name of the emoji, followed by its ID. Copy & paste the ID into the .react() method as a string.

client.on(Events.InteractionCreate, async interaction => {
	if (!interaction.isChatInputCommand()) return;

	const { commandName } = interaction;

	if (commandName === 'react-custom') {
		const response = await interaction.reply({ content: 'You can react with custom emojis!', withResponse: true });
		response.resource.message.react('123456789012345678');
	}
});

TIP

You can also pass different formats of the emoji to the .react() method.

message.react('<:blobreach:123456789012345678>');
message.react('blobreach:123456789012345678');
message.react('<a:blobreach:123456789012345678>');
message.react('a:blobreach:123456789012345678');

User used /react-custom
Guide Bot Bot 08/19/2025
You can react with custom emojis!
blobreach1

Great! This route may not always be available to you, though. Sometimes you'll need to react with an emoji programmatically. To do so, you'll need to retrieve the emoji object.

Two of the easiest ways you can retrieve an emoji would be:

    Use .find() on a Collection of Emojis.
    Use .get() on the client.emojis.cache Collection.

TIP

Two or more emojis can have the same name, and using .find() will only return the first entry it finds. As such, this can cause unexpected results.

Using .find(), your code would look something like this:

if (commandName === 'react-custom') {
	const response = await interaction.reply({ content: 'You can react with custom emojis!', withResponse: true });
	const message = response.resource.message;
	const reactionEmoji = message.guild.emojis.cache.find(emoji => emoji.name === 'blobreach');
	message.react(reactionEmoji);
}

Using .get(), your code would look something like this:

if (commandName === 'react-custom') {
	const response = await interaction.reply({ content: 'You can react with custom emojis!', withResponse: true });
	const reactionEmoji = client.emojis.cache.get('123456789012345678');
	response.resource.message.react(reactionEmoji);
}

Of course, if you already have the emoji ID, you should put that directly inside the .react() method. But if you want to do other things with the emoji data later on (e.g., display the name or image URL), it's best to retrieve the full emoji object.
#
Reacting in order

If you just put one message.react() under another, it won't always react in order as-is. This is because .react() is a Promise and an asynchronous operation.

client.on(Events.InteractionCreate, async interaction => {
	if (!interaction.isChatInputCommand()) return;

	const { commandName } = interaction;

	if (commandName === 'fruits') {
		const response = await interaction.reply({ content: 'Reacting with fruits!', withResponse: true });
		const { message } = response.resource;
		message.react('🍎');
		message.react('🍊');
		message.react('🍇');
	}
});

User used /fruits
Guide Bot Bot 08/19/2025
Reacting with fruits!
apple1
tangerine1
grapes1
User used /fruits
Guide Bot Bot 08/19/2025
Reacting with fruits!
apple1
grapes1
tangerine1
User used /fruits
Guide Bot Bot 08/19/2025
Reacting with fruits!
tangerine1
apple1
grapes1

As you can see, if you leave it like that, it won't display as you want. It was able to react correctly on the first try but reacts differently each time after that.

Luckily, there are two easy solutions to this. The first would be to chain .then()s in the order you want it to display.

client.on(Events.InteractionCreate, async interaction => {
	if (!interaction.isChatInputCommand()) return;

	const { commandName } = interaction;

	if (commandName === 'fruits') {
		const response = await interaction.reply({ content: 'Reacting with fruits!', withResponse: true });

		response.resource.message.react('🍎')
			.then(() => message.react('🍊'))
			.then(() => message.react('🍇'))
			.catch(error => console.error('One of the emojis failed to react:', error));
	}
});

The other would be to use the async/await keywords.

client.on(Events.InteractionCreate, async interaction => {
	if (!interaction.isChatInputCommand()) return;

	const { commandName } = interaction;

	if (commandName === 'fruits') {
		const response = await interaction.reply({ content: 'Reacting with fruits!', withResponse: true });
		const { message } = response.resource;

		try {
			await message.react('🍎');
			await message.react('🍊');
			await message.react('🍇');
		} catch (error) {
			console.error('One of the emojis failed to react:', error);
		}
	}
});

If you try again with either of the code blocks above, you'll get the result you originally wanted!
User used /fruits
Guide Bot Bot 08/19/2025
Reacting with fruits!
apple1
tangerine1
grapes1
User used /fruits
Guide Bot Bot 08/19/2025
Reacting with fruits!
apple1
tangerine1
grapes1
User used /fruits
Guide Bot Bot 08/19/2025
Reacting with fruits!
apple1
tangerine1
grapes1

TIP

If you aren't familiar with Promises or async/await, you can read more about them on MDN

or our guide page on async/await!
#
Handling multiple reactions if the order doesn't matter

However, if you don't mind the order the emojis react in, you can take advantage of Promise.all(), like so:

if (commandName === 'fruits') {
	const message = await interaction.reply({ content: 'Reacting with fruits!' });
	Promise.all([
		message.react('🍎'),
		message.react('🍊'),
		message.react('🍇'),
	])
		.catch(error => console.error('One of the emojis failed to react:', error));
}

This small optimization allows you to use .then() to handle when all of the Promises have resolved, or .catch() when one fails. You can also await it since it returns a Promise itself.
#
Removing reactions

Now that you know how to add reactions, you might be asking, how do you remove them? In this section, you will learn how to remove all reactions, remove reactions by user, and remove reactions by emoji.

WARNING

All of these methods require ManageMessages permissions. Ensure your bot has permissions before attempting to utilize any of these methods, as it will error if it doesn't.
#
Removing all reactions

Removing all reactions from a message is the easiest, the API allows you to do this through a single call. It can be done through the message.reactions.removeAll() method.

message.reactions.removeAll()
	.catch(error => console.error('Failed to clear reactions:', error));

#
Removing reactions by emoji

Removing reactions by emoji is easily done by using MessageReaction#remove()

.

message.reactions.cache.get('123456789012345678').remove()
	.catch(error => console.error('Failed to remove reactions:', error));

#
Removing reactions by user

TIP

If you are not familiar with Collection#filter()
and Map.has()

take the time to understand what they do and then come back.

Removing reactions by a user is not as straightforward as removing by emoji or removing all reactions. The API does not provide a method for selectively removing the reactions of a user. This means you will have to iterate through reactions that include the user and remove them.

const userReactions = message.reactions.cache.filter(reaction => reaction.users.cache.has(userId));

try {
	for (const reaction of userReactions.values()) {
		await reaction.users.remove(userId);
	}
} catch (error) {
	console.error('Failed to remove reactions.');
}

WARNING

Make sure not to remove reactions by emoji or by user too much; if there are many reactions or users, it can be considered API spam.
#
Awaiting reactions

A common use case for reactions in commands is having a user confirm or deny an action or creating a poll system. Luckily, we actually already have a guide page covering this! Check out that page if you want a more in-depth explanation. Otherwise, here's a basic example for reference:

message.react('👍').then(() => message.react('👎'));

const collectorFilter = (reaction, user) => {
	return ['👍', '👎'].includes(reaction.emoji.name) && user.id === interaction.user.id;
};

message.awaitReactions({ filter: collectorFilter, max: 1, time: 60_000, errors: ['time'] })
	.then(collected => {
		const reaction = collected.first();

		if (reaction.emoji.name === '👍') {
			message.reply('You reacted with a thumbs up.');
		} else {
			message.reply('You reacted with a thumbs down.');
		}
	})
	.catch(collected => {
		message.reply('You reacted with neither a thumbs up, nor a thumbs down.');
	});

#
Listening for reactions on old messages

Messages sent before your bot started are uncached unless you fetch them first. By default, the library does not emit client events if the data received and cached is not sufficient to build fully functional objects. Since version 12, you can change this behavior by activating partials. For a full explanation of partials see this page.

Make sure you enable partial structures for Message, Channel, and Reaction when instantiating your client if you want reaction events on uncached messages for both server and direct message channels. If you do not want to support direct message channels, you can exclude Channel.

TIP

If you use gateway intents but can't or don't want to use the privileged GuildPresences intent, you additionally need the User partial.

const { Client, Events, GatewayIntentBits, Partials } = require('discord.js');

const client = new Client({
	intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.GuildMessageReactions],
	partials: [Partials.Message, Partials.Channel, Partials.Reaction],
});

client.on(Events.MessageReactionAdd, async (reaction, user) => {
	// When a reaction is received, check if the structure is partial
	if (reaction.partial) {
		// If the message this reaction belongs to was removed, the fetching might result in an API error which should be handled
		try {
			await reaction.fetch();
		} catch (error) {
			console.error('Something went wrong when fetching the message:', error);
			// Return as `reaction.message.author` may be undefined/null
			return;
		}
	}

	// Now the message has been cached and is fully available
	console.log(`${reaction.message.author}'s message "${reaction.message.content}" gained a reaction!`);
	// The reaction is now also fully available and the properties will be reflected accurately:
	console.log(`${reaction.count} user(s) have given the same reaction to this message!`);
});

WARNING

Partial structures are enabled globally. You cannot only make them work for a specific event or cache, and you very likely need to adapt other parts of your code that are accessing data from the relevant caches. All caches holding the respective structure type might return partials as well! For more info, check out this page.

Webhooks

Webhooks can send messages to a text channel without having to log in as a bot. They can also fetch, edit, and delete their own messages. There are a variety of methods in discord.js to interact with webhooks. In this section, you will learn how to create, fetch, edit, and use webhooks.
#
What is a webhook

Webhooks are a utility used to send messages to text channels without needing a Discord application. Webhooks are useful for allowing something to send messages without requiring a Discord application. You can also directly edit or delete messages you sent through the webhook. There are two structures to make use of this functionality: Webhook and WebhookClient. WebhookClient is an extended version of a Webhook, which allows you to send messages through it without needing a bot client.

TIP

If you would like to read about using webhooks through the API without discord.js, you can read about them here

.
#
Detecting webhook messages

Bots receive webhook messages in a text channel as usual. You can detect if a webhook sent the message by checking if the Message.webhookId is not null. In this example, we return if a webhook sent the message.

if (message.webhookId) return;

If you would like to get the webhook object that sent the message, you can use Message#fetchWebhook()

.
#
Fetching webhooks

TIP

Webhook fetching will always make use of collections and Promises. If you do not understand either concept, revise them, and then come back to this section. You can read about collections here, and Promises here and here

.
#
Fetching all webhooks of a guild

If you would like to get all webhooks of a guild you can use Guild#fetchWebhooks()

. This will return a Promise which will resolve into a Collection of Webhooks.
#
Fetching webhooks of a channel

Webhooks belonging to a channel can be fetched using TextChannel#fetchWebhooks()
. This will return a Promise which will resolve into a Collection of Webhooks. A collection will be returned even if the channel contains a single webhook. If you are certain the channel contains a single webhook, you can use Collection#first()

on the Collection to get the webhook.
#
Fetching a single webhook
#
Using client

You can fetch a specific webhook using its id with Client#fetchWebhook()

. You can obtain the webhook id by looking at its link, the number after https://discord.com/api/webhooks/ is the id, and the part after that is the token.
#
Using the WebhookClient constructor

If you are not using a bot client, you can get a webhook by creating a new instance of WebhookClient and passing the id and token into the constructor. These credentials do not require you to have a bot application, but it also offers limited information instead of fetching it using an authorized client.

const webhookClient = new WebhookClient({ id: 'id', token: 'token' });

You can also pass in just a url:

const webhookClient = new WebhookClient({ url: 'https://discord.com/api/webhooks/id/token' });

#
Creating webhooks
#
Creating webhooks through server settings

You can create webhooks directly through the Discord client. Go to Server Settings, and you will see an Integrations tab.

Integrations tab

If you already have created a webhook, the webhooks tab will look like this; you will need to click the View Webhooks button.

Integrations tab

Once you are there, click on the Create Webhook / New Webhook button; this will create a webhook. From here, you can edit the channel, the name, and the avatar. Copy the link, the first part is the id, and the second is the token.

Creating a Webhook
#
Creating webhooks with discord.js

Webhooks can be created with the TextChannel#createWebhook()

method.

channel.createWebhook({
	name: 'Some-username',
	avatar: 'https://i.imgur.com/AfFp7pu.png',
})
	.then(webhook => console.log(`Created webhook ${webhook}`))
	.catch(console.error);

#
Editing webhooks

You can edit Webhooks and WebhookClients to change their name, avatar, and channel using Webhook#edit()

.

webhook.edit({
	name: 'Some-username',
	avatar: 'https://i.imgur.com/AfFp7pu.png',
	channel: '222197033908436994',
})
	.then(webhook => console.log(`Edited webhook ${webhook}`))
	.catch(console.error);

#
Using webhooks

Webhooks can send messages to text channels, as well as fetch, edit, and delete their own. These methods are the same for both Webhook and WebhookClient.
#
Sending messages

Webhooks, like bots, can send up to 10 embeds per message. They can also send attachments and normal content. The Webhook#send()

method is very similar to the method used for sending a message to a text channel. Webhooks can also choose how the username and avatar will appear when they send the message.

Example using a WebhookClient:

const { EmbedBuilder, WebhookClient } = require('discord.js');
const { webhookId, webhookToken } = require('./config.json');

const webhookClient = new WebhookClient({ id: webhookId, token: webhookToken });

const embed = new EmbedBuilder()
	.setTitle('Some Title')
	.setColor(0x00FFFF);

webhookClient.send({
	content: 'Webhook test',
	username: 'some-username',
	avatarURL: 'https://i.imgur.com/AfFp7pu.png',
	embeds: [embed],
});

Try to find a webhook your bot knows the token for. This makes sure your bot can execute the webhook later on.

const { Client, EmbedBuilder, Events, GatewayIntentBits } = require('discord.js');
const { token } = require('./config.json');

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

const embed = new EmbedBuilder()
	.setTitle('Some Title')
	.setColor(0x00FFFF);

client.once(Events.ClientReady, async () => {
	const channel = client.channels.cache.get('123456789012345678');
	try {
		const webhooks = await channel.fetchWebhooks();
		const webhook = webhooks.find(wh => wh.token);

		if (!webhook) {
			return console.log('No webhook was found that I can use!');
		}

		await webhook.send({
			content: 'Webhook test',
			username: 'some-username',
			avatarURL: 'https://i.imgur.com/AfFp7pu.png',
			embeds: [embed],
		});
	} catch (error) {
		console.error('Error trying to send a message: ', error);
	}
});

client.login(token);

#
Fetching messages

You can use Webhook#fetchMessage()

to fetch messages previously sent by the Webhook.

const message = await webhookClient.fetchMessage('123456789012345678');

#
Editing messages

You can use Webhook#editMessage()

to edit messages previously sent by the Webhook.

const message = await webhook.editMessage('123456789012345678', {
	content: 'Edited!',
	embeds: [embed],
});

#
Deleting messages

You can use Webhook#deleteMessage()

to delete messages previously sent by the Webhook.

await webhookClient.deleteMessage('123456789012345678');

Storing data with Sequelize

Sequelize is an object-relational-mapper, which means you can write a query using objects and have it run on almost any other database system that Sequelize supports.
#
Why use an ORM?

The main benefit of using an ORM like Sequelize is that it allows you to write code that virtually looks like native JavaScript. As a side benefit, an ORM will enable you to write code that can run in almost every database system. Although databases generally adhere very closely to SQL, they each have their slight nuances and differences. You can create a database-agnostic query using an ORM that works on multiple database systems.
#
A simple tag system

For this tutorial, we will create a simple tag system that will allow you to add a tag, output a tag, edit a tag, show tag info, list tags, and delete a tag.
To begin, you should install Sequelize into your discord.js project. We will explain SQlite as the first storage engine and show how to use other databases later. Note that you will need Node 7.6 or above to utilize the async/await operators.
#
Installing and using Sequelize

Create a new project folder and run the following:

npm install discord.js sequelize sqlite3

DANGER

Make sure you use version 5 or later of Sequelize! Version 4, as used in this guide, will pose a security threat. You can read more about this issue on the Sequelize issue tracker

.

After you have installed discord.js and Sequelize, you can start with the following skeleton code. The comment labels will tell you where to insert code later on.

// Require Sequelize
const Sequelize = require('sequelize');
// Require the necessary discord.js classes
const { Client, Events, GatewayIntentBits } = require('discord.js');

// Create a new client instance
const client = new Client({ intents: [GatewayIntentBits.Guilds] });

// When the client is ready, run this code (only once)
client.once(Events.ClientReady, readyClient => {
	console.log(`Ready! Logged in as ${readyClient.user.tag}`);
});

client.on(Events.InteractionCreate, async interaction => {
	if (!interaction.isChatInputCommand()) return;

	const { commandName } = interaction;
	// ...
});

// Login to Discord with your client's token
client.login('your-token-goes-here');

#
Connection information

The first step is to define the connection information. It should look something like this:

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

const sequelize = new Sequelize('database', 'user', 'password', {
	host: 'localhost',
	dialect: 'sqlite',
	logging: false,
	// SQLite only
	storage: 'database.sqlite',
});

host tells Sequelize where to look for the database. For most systems, the host will be localhost, as the database usually resides with the application. If you have a remote database, however, then you can set it to that connection address. Otherwise, don't touch this unless you know what you're doing.
dialect refers to the database engine you are going to use. For this tutorial, it will be sqlite.
logging enables verbose output from Sequelize–useful for when you are trying to debug. You can disable it by setting it to false.
storage is a sqlite-only setting because sqlite is the only database that stores all its data to a single file.
#
Creating the model

In any relational database, you need to create tables to store your data. This simple tag system will use four fields. The table in the database will look something like this:
name	description	username	usage_count
bob	is the best	bob	0
tableflip	(╯°□°）╯︵ ┻━┻	joe	8

To do that in Sequelize, define a model based on this structure below the connection information, as shown below.

/*
 * equivalent to: CREATE TABLE tags(
 * name VARCHAR(255) UNIQUE,
 * description TEXT,
 * username VARCHAR(255),
 * usage_count  INT NOT NULL DEFAULT 0
 * );
 */
const Tags = sequelize.define('tags', {
	name: {
		type: Sequelize.STRING,
		unique: true,
	},
	description: Sequelize.TEXT,
	username: Sequelize.STRING,
	usage_count: {
		type: Sequelize.INTEGER,
		defaultValue: 0,
		allowNull: false,
	},
});

The model mirrors very closely what the database defines. There will be a table with four fields called name, description, username, and usage_count.
sequelize.define() takes two parameters. 'tags' are passed as the name of our table, and an object that represents the table's schema in key-value pairs. Keys in the object become the model's attributes, and the values describe the attributes.

type refers to what kind of data this attribute should hold. The most common types are number, string, and date, but other data types are available depending on the database.
unique: true will ensure that this field will never have duplicated entries. Duplicate tag names are disallowed in this database.
defaultValue allows you to set a fallback value if there's no initial value during the insert.
allowNull is not all that important, but this will guarantee in the database that the attribute is never unset. You could potentially set it to be a blank or empty string, but it has to be something.

TIP

Sequelize.STRING vs. Sequelize.TEXT: In most database systems, the string's length is a fixed length for performance reasons. Sequelize defaults this to 255. Use STRING if your input has a max length, and use TEXT if it does not. For sqlite, there is no unbounded string type, so it will not matter which one you pick.
#
Syncing the model

Now that your structure is defined, you need to make sure the model exists in the database. To make sure the bot is ready and all the data you might need has arrived, add this line in your code.

client.once(Events.ClientReady, readyClient => {
	Tags.sync();
	console.log(`Logged in as ${readyClient.user.tag}!`);
});

The table does not get created until you sync it. The schema you defined before was building the model that lets Sequelize know how the data should look. For testing, you can use Tags.sync({ force: true }) to recreate the table every time on startup. This way, you can get a blank slate each time.
#
Adding a tag

After all this preparation, you can now write your first command! Let's start with the ability to add a tag.

client.on(Events.InteractionCreate, async interaction => {
	if (!interaction.isChatInputCommand()) return;

	const { commandName } = interaction;

	if (commandName === 'addtag') {
		const tagName = interaction.options.getString('name');
		const tagDescription = interaction.options.getString('description');

		try {
			// equivalent to: INSERT INTO tags (name, description, username) values (?, ?, ?);
			const tag = await Tags.create({
				name: tagName,
				description: tagDescription,
				username: interaction.user.username,
			});

			return interaction.reply(`Tag ${tag.name} added.`);
		}
		catch (error) {
			if (error.name === 'SequelizeUniqueConstraintError') {
				return interaction.reply('That tag already exists.');
			}

			return interaction.reply('Something went wrong with adding a tag.');
		}
	}
});

Tags.create() uses the models that you created previously. The .create() method inserts some data into the model. You are going to insert a tag name, description, and the author name into the database.
The catch (error) section is necessary for the insert because it will offload checking for duplicates to the database to notify you if an attempt to create a tag that already exists occurs. The alternative is to query the database before adding data and checking if a result returns. If there are no errors or no identical tag is found, only then would you add the data. Of the two methods, it is clear that catching the error is less work for you.
Although if (error.name === 'SequelizeUniqueConstraintError') was mostly for doing less work, it is always good to handle your errors, especially if you know what types of errors you will receive. This error comes up if your unique constraint is violated, i.e., duplicate values are inserted.

WARNING

Do not use catch for inserting new data. Only use it for gracefully handling things that go wrong in your code or logging errors.
#
Fetching a tag

Next, let's fetch the inserted tag.

if (commandName === 'addtag') {
	// ...
}
else if (command === 'tag') {
	const tagName = interaction.options.getString('name');

	// equivalent to: SELECT * FROM tags WHERE name = 'tagName' LIMIT 1;
	const tag = await Tags.findOne({ where: { name: tagName } });

	if (tag) {
		// equivalent to: UPDATE tags SET usage_count = usage_count + 1 WHERE name = 'tagName';
		tag.increment('usage_count');

		return interaction.reply(tag.get('description'));
	}

	return interaction.reply(`Could not find tag: ${tagName}`);
}

This is your first query. You are finally doing something with your data; yay!
.findOne() is how you fetch a single row of data. The where: { name: tagName } makes sure you only get the row with the desired tag. Since the queries are asynchronous, you will need to use await to fetch it. After receiving the data, you can use .get() on that object to grab the data. If no data is received, then you can tell the user that the query returned no data.
#
Editing a tag

else if (command === 'edittag') {
	const tagName = interaction.options.getString('name');
	const tagDescription = interaction.options.getString('description');

	// equivalent to: UPDATE tags (description) values (?) WHERE name='?';
	const affectedRows = await Tags.update({ description: tagDescription }, { where: { name: tagName } });

	if (affectedRows > 0) {
		return interaction.reply(`Tag ${tagName} was edited.`);
	}

	return interaction.reply(`Could not find a tag with name ${tagName}.`);
}

It is possible to edit a record by using the .update() function. An update returns the number of rows that the where condition changed. Since you can only have tags with unique names, you do not have to worry about how many rows may change. Should you get that the query didn't alter any rows, you can conclude that the tag did not exist.
#
Display info on a specific tag

else if (commandName == 'taginfo') {
	const tagName = interaction.options.getString('name');

	// equivalent to: SELECT * FROM tags WHERE name = 'tagName' LIMIT 1;
	const tag = await Tags.findOne({ where: { name: tagName } });

	if (tag) {
		return interaction.reply(`${tagName} was created by ${tag.username} at ${tag.createdAt} and has been used ${tag.usage_count} times.`);
	}

	return interaction.reply(`Could not find tag: ${tagName}`);
}

This section is very similar to the previous command, except you will be showing the tag metadata. tag contains your tag object. Notice two things: firstly, it is possible to access the object's properties without the .get() function. This is because the object is an instance of a Tag, which you can treat as an object and not just a row of data. Second, you can access a property that was not defined explicitly, createdAt. This is because Sequelize automatically adds that column to all tables. Passing another object into the model with { createdAt: false } can disable this feature, but in this case, it was useful to have.
#
Listing all tags

The next command will enable you to fetch a list of all the created tags.

else if (command === 'showtags') {
	// equivalent to: SELECT name FROM tags;
	const tagList = await Tags.findAll({ attributes: ['name'] });
	const tagString = tagList.map(t => t.name).join(', ') || 'No tags set.';

	return interaction.reply(`List of tags: ${tagString}`);
}

Here, you can use the .findAll() method to grab all the tag names. Notice that instead of having where, the optional field, attributes, is set. Setting attributes to name will let you get only the names of tags. If you tried to access other fields, like the tag author, you would get an error. If left blank, it will fetch all of the associated column data. It will not affect the results returned, but from a performance perspective, you should only grab the necessary data. If no results return, tagString will default to 'No tags set'.
#
Deleting a tag

else if (command === 'deletetag') {
	const tagName = interaction.options.getString('name');
	// equivalent to: DELETE from tags WHERE name = ?;
	const rowCount = await Tags.destroy({ where: { name: tagName } });

	if (!rowCount) return interaction.reply('That tag doesn\'t exist.');

	return interaction.reply('Tag deleted.');
}

.destroy() runs the delete operation. The operation returns a count of the number of affected rows. If it returns with a value of 0, then nothing was deleted, and that tag did not exist in the database in the first place

Making a Currency System

A common feature of Discord bots is a currency system. It's possible to do everything in one object, but we can also abstract that in terms of relations between objects. This is where the power of a RDBMS (Relational Database Management System) truly shines. Sequelize calls these associations, so we'll be using that term from now on.
#
File overview

There will be multiple files: a DB init script, your models, and your bot script. In the previous Sequelize guide, we placed all of these in the same file. Having everything in one file isn't an ideal practice, so we'll correct that.

This time we'll have six files.

    app.js is where we'll keep the main bot code.
    dbInit.js is the initialization file for the database. We run this once and forget about it.
    dbObjects.js is where we'll import the models and create associations here.
    models/Users.js is the Users model. Users will have a currency attribute in here.
    models/CurrencyShop.js is the Shop model. The shop will have a name and a price for each item.
    models/UserItems.js is the junction table between the users and the shop. A junction table connects two tables. Our junction table will have an additional field for the amount of that item the user has.

#
Create models

Here is an entity relation diagram of the models we'll be making:

Currency database structure diagram

Users have a user_id, and a balance. Each user_id can have multiple links to the UserItems table, and each entry in the table connects to one of the items in the CurrencyShop, which will have a name and a cost associated with it.

To implement this, begin by making a models folder and create a Users.js file inside which contains the following:

module.exports = (sequelize, DataTypes) => {
	return sequelize.define('users', {
		user_id: {
			type: DataTypes.STRING,
			primaryKey: true,
		},
		balance: {
			type: DataTypes.INTEGER,
			defaultValue: 0,
			allowNull: false,
		},
	}, {
		timestamps: false,
	});
};

Like you see in the diagram above, the Users model will only have two attributes: a user_id primary key and a balance. A primary key is a particular attribute that becomes the default column used when joining tables together, and it is automatically unique and not null.

Balance also sets allowNull to false, which means that both values have to be set in conjunction with creating a primary key; otherwise, the database would throw an error. This constraint guarantees correctness in your data storage. You'll never have null or empty values, ensuring that if you somehow forget to validate in the application that both values are not null, the database would do a final validation.

Notice that the options object sets timestamps to false. This option disables the createdAt and the updatedAt columns that sequelize usually creates for you. Setting user_id to primary also eliminates the id primary key that Sequelize usually generates for you since there can only be one primary key on a table.

Next, still in the same models folder, create a CurrencyShop.js file that contains the following:

module.exports = (sequelize, DataTypes) => {
	return sequelize.define('currency_shop', {
		name: {
			type: DataTypes.STRING,
			unique: true,
		},
		cost: {
			type: DataTypes.INTEGER,
			allowNull: false,
		},
	}, {
		timestamps: false,
	});
};

Like the Users model, timestamps aren't needed here, so you can disable it. Unlike the Users model, however, the unique field is set to true here, allowing you to change the name without affecting the primary key that joins this to the next object. This gets generated automatically by sequelize since a primary key isn't set.

The next file will be UserItems.js, the junction table.

module.exports = (sequelize, DataTypes) => {
	return sequelize.define('user_item', {
		user_id: DataTypes.STRING,
		item_id: DataTypes.INTEGER,
		amount: {
			type: DataTypes.INTEGER,
			allowNull: false,
			'default': 0,
		},
	}, {
		timestamps: false,
	});
};

The junction table will link user_id and the id of the currency shop together. It also contains an amount number, which indicates how many of that item a user has.
#
Initialize database

Now that the models are defined, you should create them in your database to access them in the bot file. We ran the sync inside the ready event in the previous tutorial, which is entirely unnecessary since it only needs to run once. You can make a file to initialize the database and never touch it again unless you want to remake the entire database.

Create a file called dbInit.js in the base directory (not in the models folder).

DANGER

Make sure you use version 5 or later of Sequelize! Version 4, as used in this guide, will pose a security threat. You can read more about this issue on the Sequelize issue tracker

.

const Sequelize = require('sequelize');

const sequelize = new Sequelize('database', 'username', 'password', {
	host: 'localhost',
	dialect: 'sqlite',
	logging: false,
	storage: 'database.sqlite',
});

const CurrencyShop = require('./models/CurrencyShop.js')(sequelize, Sequelize.DataTypes);
require('./models/Users.js')(sequelize, Sequelize.DataTypes);
require('./models/UserItems.js')(sequelize, Sequelize.DataTypes);

const force = process.argv.includes('--force') || process.argv.includes('-f');

sequelize.sync({ force }).then(async () => {
	const shop = [
		CurrencyShop.upsert({ name: 'Tea', cost: 1 }),
		CurrencyShop.upsert({ name: 'Coffee', cost: 2 }),
		CurrencyShop.upsert({ name: 'Cake', cost: 5 }),
	];

	await Promise.all(shop);
	console.log('Database synced');

	sequelize.close();
}).catch(console.error);

Here you pull the two models and the junction table from the respective model declarations, sync them, and add items to the shop.

A new function here is the .upsert() function. It's a portmanteau for update or insert. upsert is used here to avoid creating duplicates if you run this file multiple times. That shouldn't happen because name is defined as unique, but there's no harm in being safe. Upsert also has a nice side benefit: if you adjust the cost, the respective item should also have their cost updated.

TIP

Execute node dbInit.js to create the database tables. Unless you make a change to the models, you'll never need to touch the file again. If you change a model, you can execute node dbInit.js --force or node dbInit.js -f to force sync your tables. It's important to note that this will empty and remake your model tables.
#
Create associations

Next, add the associations to the models. Create a file named dbObjects.js in the base directory, next to dbInit.js.

const Sequelize = require('sequelize');

const sequelize = new Sequelize('database', 'username', 'password', {
	host: 'localhost',
	dialect: 'sqlite',
	logging: false,
	storage: 'database.sqlite',
});

const Users = require('./models/Users.js')(sequelize, Sequelize.DataTypes);
const CurrencyShop = require('./models/CurrencyShop.js')(sequelize, Sequelize.DataTypes);
const UserItems = require('./models/UserItems.js')(sequelize, Sequelize.DataTypes);

UserItems.belongsTo(CurrencyShop, { foreignKey: 'item_id', as: 'item' });

Reflect.defineProperty(Users.prototype, 'addItem', {
	value: async item => {
		const userItem = await UserItems.findOne({
			where: { user_id: this.user_id, item_id: item.id },
		});

		if (userItem) {
			userItem.amount += 1;
			return userItem.save();
		}

		return UserItems.create({ user_id: this.user_id, item_id: item.id, amount: 1 });
	},
});

Reflect.defineProperty(Users.prototype, 'getItems', {
	value: () => {
		return UserItems.findAll({
			where: { user_id: this.user_id },
			include: ['item'],
		});
	},
});

module.exports = { Users, CurrencyShop, UserItems };

Note that the connection object could be abstracted in another file and had both dbInit.js and dbObjects.js use that connection file, but it's not necessary to overly abstract things.

Another new method here is the .belongsTo() method. Using this method, you add CurrencyShop as a property of UserItem so that when you do userItem.item, you get the respectively attached item. You use item_id as the foreign key so that it knows which item to reference.

You then add some methods to the Users object to finish up the junction: add items to users, and get their current inventory. The code inside should be somewhat familiar from the last tutorial. .findOne() is used to get the item if it exists in the user's inventory. If it does, increment it; otherwise, create it.

Getting items is similar; use .findAll() with the user's id as the key. The include key is for associating the CurrencyShop with the item. You must explicitly tell Sequelize to honor the .belongsTo() association; otherwise, it will take the path of the least effort.
#
Application code

Create an app.js file in the base directory with the following skeleton code to put it together.

const { Op } = require('sequelize');
const { Client, codeBlock, Collection, Events, GatewayIntentBits } = require('discord.js');
const { Users, CurrencyShop } = require('./dbObjects.js');

const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages] });
const currency = new Collection();

client.once(Events.ClientReady, readyClient => {
	console.log(`Ready! Logged in as ${readyClient.user.tag}`);
});

client.on(Events.MessageCreate, async message => {
	if (message.author.bot) return;
	addBalance(message.author.id, 1);
});

client.on(Events.InteractionCreate, async interaction => {
	if (!interaction.isChatInputCommand()) return;

	const { commandName } = interaction;
	// ...
});

client.login('your-token-goes-here');

Nothing special about this skeleton. You import the Users and CurrencyShop models from our dbObjects.js file and add a currency Collection. Every time someone talks, add 1 to their currency count. The rest is just standard discord.js code and a simple if/else command handler. A Collection is used for the currency variable to cache individual users' currency, so you don't have to hit the database for every lookup. An if/else handler is used here, but you can put it in a framework or command handler as long as you maintain a reference to the models and the currency collection.
#
Helper methods

const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages] });
const currency = new Collection();

async function addBalance(id, amount) {
	const user = currency.get(id);

	if (user) {
		user.balance += Number(amount);
		return user.save();
	}

	const newUser = await Users.create({ user_id: id, balance: amount });
	currency.set(id, newUser);

	return newUser;
}

function getBalance(id) {
	const user = currency.get(id);
	return user ? user.balance : 0;
}

This defines the addBalance() helper function, since it'll be used quite frequently. A getBalance() function is also defined, to ensure that a number is always returned.
#
Ready event data sync

client.once(Events.ClientReady, async readyClient => {
	const storedBalances = await Users.findAll();
	storedBalances.forEach(b => currency.set(b.user_id, b));

	console.log(`Logged in as ${readyClient.user.tag}!`);
});

In the ready event, sync the currency collection with the database for easy access later.
#
Show user balance

client.on(Events.InteractionCreate, async interaction => {
	if (!interaction.isChatInputCommand()) return;

	const { commandName } = interaction;

	if (commandName === 'balance') {
		const target = interaction.options.getUser('user') ?? interaction.user;

		return interaction.reply(`${target.tag} has ${getBalance(target.id)}💰`);
	}
});

Nothing tricky here. The getBalance() function is used to show either the author's or the mentioned user's balance.
#
Show user inventory

if (commandName === 'balance') {
	// ...
}
else if (commandName === 'inventory') {
	const target = interaction.options.getUser('user') ?? interaction.user;
	const user = await Users.findOne({ where: { user_id: target.id } });
	const items = await user.getItems();

	if (!items.length) return interaction.reply(`${target.tag} has nothing!`);

	return interaction.reply(`${target.tag} currently has ${items.map(i => `${i.amount} ${i.item.name}`).join(', ')}`);
}

This is where you begin to see the power of associations. Even though users and the shop are different tables, and the data is stored separately, you can get a user's inventory by looking at the junction table and join it with the shop; no duplicated item names that waste space!
#
Transfer currency to another user

else if (commandName === 'transfer') {
	const currentAmount = getBalance(interaction.user.id);
	const transferAmount = interaction.options.getInteger('amount');
	const transferTarget = interaction.options.getUser('user');

	if (transferAmount > currentAmount) return interaction.reply(`Sorry ${interaction.user}, you only have ${currentAmount}.`);
	if (transferAmount <= 0) return interaction.reply(`Please enter an amount greater than zero, ${interaction.user}.`);

	addBalance(interaction.user.id, -transferAmount);
	addBalance(transferTarget.id, transferAmount);

	return interaction.reply(`Successfully transferred ${transferAmount}💰 to ${transferTarget.tag}. Your current balance is ${getBalance(interaction.user.id)}💰`);
}

As a bot creator, you should always be thinking about how to make the user experience better. Good UX makes users less frustrated with your commands. If your inputs are different types, don't make them memorize which parameters come before the other.

You'd ideally want to allow users to do both !transfer 5 @user and !transfer @user 5. To get the amount, you can grab the first non-mention text in the command. In the second line of the above code: split the command by spaces and look for anything that doesn't match a mention; you can assume that's the transfer amount. Then do some checking to make sure it's a valid input. You can also do error checking on the transfer target, but we won't include that here because of its triviality.

addBalance() is used for both removing and adding currency. Since transfer amounts below zero are disallowed, it's safe to apply the transfer amount's additive inverse to their balance.
#
Buying an item

else if (commandName === 'buy') {
	const itemName = interaction.options.getString('item');
	const item = await CurrencyShop.findOne({ where: { name: { [Op.like]: itemName } } });

	if (!item) return interaction.reply(`That item doesn't exist.`);
	if (item.cost > getBalance(interaction.user.id)) {
		return interaction.reply(`You currently have ${getBalance(interaction.user.id)}, but the ${item.name} costs ${item.cost}!`);
	}

	const user = await Users.findOne({ where: { user_id: interaction.user.id } });
	addBalance(interaction.user.id, -item.cost);
	await user.addItem(item);

	return interaction.reply(`You've bought: ${item.name}.`);
}

For users to search for an item without caring about the letter casing, you can use the $iLike modifier when looking for the name. Keep in mind that this may be slow if you have millions of items, so please don't put a million items in your shop.
#
Display the shop

else if (commandName === 'shop') {
	const items = await CurrencyShop.findAll();
	return interaction.reply(codeBlock(items.map(i => `${i.name}: ${i.cost}💰`).join('\n')));
}

There's nothing special here; just a regular .findAll() to get all the items in the shop and .map() to transform that data into something nice looking.
#
Display the leaderboard

else if (commandName === 'leaderboard') {
	return interaction.reply(
		codeBlock(
			currency.sort((a, b) => b.balance - a.balance)
				.filter(user => client.users.cache.has(user.user_id))
				.first(10)
				.map((user, position) => `(${position + 1}) ${(client.users.cache.get(user.user_id).tag)}: ${user.balance}💰`)
				.join('\n'),
		),
	);
}

Nothing extraordinary here either. You could query the database for the top ten currency holders, but since you already have access to them locally inside the currency variable, you can sort the Collection and use .map() to display it in a friendly format. The filter is in case the users no longer exist in the bot's cache.

Storing data with Keyv

Keyv

is a simple key-value store that works with multiple backends. It's fully scalable for sharding and supports JSON storage.
#
Installation

npm install keyv

Keyv requires an additional package depending on which persistent backend you would prefer to use. If you want to keep everything in memory, you can skip this part. Otherwise, install one of the below.

npm install @keyv/redis
npm install @keyv/mongo
npm install @keyv/sqlite
npm install @keyv/postgres
npm install @keyv/mysql

Create an instance of Keyv once you've installed Keyv and any necessary drivers.

const { Keyv } = require('keyv');

// One of the following
const keyv = new Keyv(); // for in-memory storage
const keyv = new Keyv('redis://user:pass@localhost:6379');
const keyv = new Keyv('mongodb://user:pass@localhost:27017/dbname');
const keyv = new Keyv('sqlite://path/to/database.sqlite');
const keyv = new Keyv('postgresql://user:pass@localhost:5432/dbname');
const keyv = new Keyv('mysql://user:pass@localhost:3306/dbname');

Make sure to handle connection errors.

keyv.on('error', err => console.error('Keyv connection error:', err));

For a more detailed setup, check out the Keyv readme

.
#
Usage

Keyv exposes a familiar Map

-like API. However, it only has set, get, delete, and clear methods. Additionally, instead of immediately returning data, these methods return Promises that resolve with the data.

(async () => {
	// true
	await keyv.set('foo', 'bar');

	// bar
	await keyv.get('foo');

	// undefined
	await keyv.clear();

	// undefined
	await keyv.get('foo');
})();

#
Application

Although Keyv can assist in any scenario where you need key-value data, we will focus on setting up a per-guild prefix configuration using Sqlite.

TIP

This section will still work with any provider supported by Keyv. We recommend PostgreSQL for larger applications.
#
Setup

const { Keyv } = require('keyv');
const { Client, Events, GatewayIntentBits } = require('discord.js');
const { globalPrefix, token } = require('./config.json');

const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent] });
const prefixes = new Keyv('sqlite://path/to.sqlite');

#
Command handler

This guide uses a very basic command handler with some added complexity to allow for multiple prefixes. Look at the command handling guide for a more robust command handler.

client.on(Events.MessageCreate, async message => {
	if (message.author.bot) return;

	let args;
	// handle messages in a guild
	if (message.guild) {
		let prefix;

		if (message.content.startsWith(globalPrefix)) {
			prefix = globalPrefix;
		} else {
			// check the guild-level prefix
			const guildPrefix = await prefixes.get(message.guild.id);
			if (message.content.startsWith(guildPrefix)) prefix = guildPrefix;
		}

		// if we found a prefix, setup args; otherwise, this isn't a command
		if (!prefix) return;
		args = message.content.slice(prefix.length).trim().split(/\s+/);
	} else {
		// handle DMs
		const slice = message.content.startsWith(globalPrefix) ? globalPrefix.length : 0;
		args = message.content.slice(slice).split(/\s+/);
	}

	// get the first space-delimited argument after the prefix as the command
	const command = args.shift().toLowerCase();
});

#
Prefix command

Now that you have a command handler, you can make a command to allow people to use your prefix system.

client.on(Events.MessageCreate, async message => {
	// ...
	if (command === 'prefix') {
		// if there's at least one argument, set the prefix
		if (args.length) {
			await prefixes.set(message.guild.id, args[0]);
			return message.channel.send(`Successfully set prefix to \`${args[0]}\``);
		}

		return message.channel.send(`Prefix is \`${await prefixes.get(message.guild.id) || globalPrefix}\``);
	}
});

You will probably want to set up additional validation, such as required permissions and maximum prefix length.
#
Usage
User08/19/2025
.prefix
Guide Bot Bot 08/19/2025
Prefix is .
User08/19/2025
.prefix $
Guide Bot Bot 08/19/2025
Successfully set prefix to $
User08/19/2025
$prefix
Guide Bot Bot 08/19/2025
Prefix is $
#
Next steps

Various other applications can use Keyv, such as guild settings; create another instance with a different namespace
for each setting. Additionally, it can be extended

to work with whatever storage backend you prefer.

Check out the Keyv repository

for more information.


