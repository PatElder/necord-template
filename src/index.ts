// Require the necessary discord.js classes
import { ApplicationCommandData, Client, Events, GatewayIntentBits, Colors, Role  } from 'discord.js';
import fs from 'node:fs';
import path from 'node:path';
import { configs } from './configs';

const token = configs.DISCORD_BOT_TOKEN;
const pattern = /\.(js|ts)$/;

class SlashCommandClient extends Client {
	commands = new Map();
	constructor() {
	  super({
		intents: [GatewayIntentBits.Guilds],
	  });
	}
  
	registerCommand(command: ApplicationCommandData) {
	  this.application?.commands.create(command);
	}
}

// Create a new client instance
const client = new SlashCommandClient();

const commandsPath = path.join(__dirname, '../src/commands/verify');
const commandFiles = fs.readdirSync(commandsPath).filter(file => pattern.test(file));

for (const file of commandFiles) {
	const filePath = path.join(commandsPath, file);
	const command = require(filePath);
	// Set a new item in the Collection with the key as the command name and the value as the exported module
	if ('data' in command && 'execute' in command) {
		client.commands.set(command.data.name, command);
	} else {
		console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
	}
}

// When the client is ready, run this code (only once)
// We use 'c' for the event parameter to keep it separate from the already defined 'client'
client.once(Events.ClientReady, c => {
	console.log(`Ready! Logged in as ${c.user.tag}`);
});


client.on(Events.InteractionCreate, async interaction  => {
	
	if (!interaction.isCommand() || !interaction.isChatInputCommand()) return;
	const deferedInteraction = await interaction.deferReply({ ephemeral: true });
	const command = client.commands.get(interaction.commandName);

	if (!command) {
		console.error(`No command matching ${interaction.commandName} was found.`);
		return;
	}

	try {

		await command.execute(deferedInteraction);
		const userId = interaction.member?.user.id;
		if(!userId){
			throw new Error('No user id')
		}

		const guildId = interaction.guildId;

		if(!guildId){
			deferedInteraction.edit({ content: 'Please use the command within a Trophy enabled server, not a DM.' });
			throw new Error('No guild id')
		}

		client.guilds.fetch(guildId).then(async guild => {
			let verifiedRole: Role | undefined;
			await guild.roles.fetch().then(async roles => {
				 verifiedRole = roles.find(role => role.name === 'Verified');
				if(!verifiedRole){
					verifiedRole = await guild.roles.create({
					name: 'Verified',
					color: Colors.Gold,
				})
			}
			if(!verifiedRole){
				throw new Error('No verified role and unable to create it.')
			}
			
			await guild.members.fetch(userId).then(member => {
				member.roles.add(verifiedRole!.id);
	
		});
	})
});
	} catch (error) {
		console.error(error);
		
		if (deferedInteraction) {
			await deferedInteraction.edit({ content: 'There was an error while executing this command!' });
		} else {
			await interaction.reply({ content: 'There was an error while executing this command!' });
		}
	}
});

// Log in to Discord with your client's token
client.login(token);





