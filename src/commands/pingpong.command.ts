import { Injectable } from '@nestjs/common';
import { Context, SlashCommand, SlashCommandContext } from 'necord';
import { configs } from 'src/configs';

@Injectable()
export class PingPongCommand {
    @SlashCommand({
        name: 'ping',
        description: 'Ping-Pong Command',
        guilds: [configs.DISCORD_GUILD_ID],
    })
    public async onPing(@Context() [interaction]: SlashCommandContext) {
        return interaction.reply({ content: 'Pong!' });
    }
}
