import discord from "discord.js";
declare class Commands {
    client: discord.Client;
    [index: string]: any;
    constructor(client: discord.Client);
    nick(message: discord.Message, ...args: string[]): Promise<discord.Message | undefined>;
    pin(message: discord.Message, ...args: string[]): Promise<discord.Message | undefined>;
}
export default Commands;
