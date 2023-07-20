import { NecordModule } from 'necord';
import { Module } from '@nestjs/common';
import { IntentsBitField } from 'discord.js';
import { configs } from 'src/configs';
import { PingPongCommand } from '../commands/pingpong.command';
import { VerifyCommand } from '../commands/verify.command';

@Module({
    imports: [
        NecordModule.forRootAsync({
            useFactory: () => ({
                token:  configs.DISCORD_BOT_TOKEN,
                intents: [
                    IntentsBitField.Flags.Guilds,
                ],
            })
        })
    ],
    providers: [PingPongCommand, VerifyCommand],
    exports: [],
})
export class DiscordModule {}
