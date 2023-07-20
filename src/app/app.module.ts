import { Module } from '@nestjs/common';
import { DiscordModule } from 'src/discord';


@Module({
  imports: [
    DiscordModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
