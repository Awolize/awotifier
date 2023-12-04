import { ActivityType, Client, Message, Presence, TextChannel } from "discord.js";
import { GUILD_ID, TEXT_CHANNEL_ID } from "../config";

interface MemberActivities {
    [userId: string]: ActivityType;
}

interface GoneLiveMessages {
    [userId: string]: Message;
}

const memberActivities: MemberActivities = {};
const goneLiveMessages: GoneLiveMessages = {};

export const printOnLive = async (client: Client, oldPresence: Presence, presence: Presence): Promise<void> => {
    try {
        const { user, guild, activities } = presence;
        const textChannel = client.channels.cache.get(TEXT_CHANNEL_ID) as TextChannel;

        if (!user || !guild) {
            console.log("no user or guild?", user, guild);
            
            return;}

        // only run once no matter the server, The Cave
        if (guild.id !== GUILD_ID) {
            return;
        }

        const isStreaming = activities?.some((activity) => activity.type === ActivityType.Streaming);
        const wasStreaming = oldPresence?.activities?.some((activity) => activity.type === ActivityType.Streaming);

        // If the user just started streaming, send a message in the text channel.
        if (isStreaming && !wasStreaming) {
            memberActivities[user.id] = ActivityType.Streaming;
            const activity = activities?.find((activity) => activity.type === ActivityType.Streaming);

            if (activity) {
                goneLiveMessages[user.id] = await textChannel.send(
                    `${user.toString()} is now live! <t:${Math.round(new Date().getTime() / 1000)}>\n\n${activity?.details}\n**in** ${activity?.state}\n**at** ${activity?.url}`
                );
                console.log(`${user.tag} is now live in ${activity?.state}`);
            }
        }

        // If the user stopped streaming, update the message in the text channel.
        if (!isStreaming && wasStreaming) {
            const message = goneLiveMessages[user.id]
            if (message) {
                message.edit(message.content + `\n\n**Stream ended at <t:${Math.round(new Date().getTime() / 1000)}>**`);
            }
        }
    } catch (error) {
        console.error(error);
    }
};
