import discord from "discord.js";
interface ICommands {
    [index: string]: any;
    nick(): void;
}
declare class Commands implements ICommands {
    client: discord.Client;
    constructor(client: discord.Client);
    nick(...args: string[]): void;
}
export default Commands;
