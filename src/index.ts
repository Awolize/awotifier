import dotenv from "dotenv";
dotenv.config();

import { Client, Events, GatewayIntentBits, Presence } from "discord.js";
import { printOnLive } from "./events/presenceUpdate";

const client = new Client({
	intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildPresences],
});

client.once(Events.ClientReady, (c) => {
	console.log(`Ready! Logged in as ${c.user.tag}`);
});

client.on(Events.PresenceUpdate, async (oldEvent, event) =>
	printOnLive(client, oldEvent as Presence, event as Presence),
);

client.login(process.env.TOKEN);
