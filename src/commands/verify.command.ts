import { Injectable } from "@nestjs/common";
import { Context, Options, SlashCommand, SlashCommandContext } from 'necord';
import { Colors, Role } from 'discord.js';
import { LengthDto  } from '../discord/discord.options';

@Injectable()
export class VerifyCommand {
    @SlashCommand({
        name: 'verify',
        description: 'Verify yourself!',

    })

    public async onVerify(
        @Context() [interaction]: SlashCommandContext, @Options() { text }: LengthDto
      ) {
        const discordUserId = interaction?.member?.user.id

        if(!discordUserId) {
            interaction.editReply({ content: "Please try again later."});
            throw new Error('No discord user id provided');
        }

        try {
            interaction.editReply({ content: `You have been verified as ${text}` });
        } catch (error) {
            console.error(error);
            
            if (interaction) {
                await interaction.editReply({ content: 'There was an error while executing this command!' });
            }
            return null;
        }

    }
}

