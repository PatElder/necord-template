require("dotenv").config();

interface EnvironmentVariables {
  DISCORD_CLIENT_ID: string;
  DISCORD_BOT_TOKEN: string;
  DISCORD_GUILD_ID: string;
}

// Load the environment variables and validate their presence
const environmentVariables: EnvironmentVariables = {
  DISCORD_CLIENT_ID: process.env.DISCORD_CLIENT_ID!,
  DISCORD_BOT_TOKEN: process.env.DISCORD_BOT_TOKEN!,
  DISCORD_GUILD_ID: process.env.DISCORD_GUILD_ID!,

};

// Check if any of the environment variables are missing and throw an error if so
for (const [key, value] of Object.entries(environmentVariables)) {
  if (!value) {
    throw new Error(`Missing environment variable ${key}`);
  }
}

export const configs: EnvironmentVariables = environmentVariables;
