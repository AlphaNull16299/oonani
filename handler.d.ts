import discord from "discord.js";
import Commands from "./commands";
declare type Handler = {
    [T in keyof discord.ClientEvents]?: (...args: discord.ClientEvents[T]) => Promise<void>;
};
declare class EventHandler implements Handler {
    _client: discord.Client;
    commands: Commands;
    prefix: string;
    constructor(client: discord.Client, commands: Commands);
    messageCreate(message: discord.Message): Promise<void>;
    ready(): Promise<void>;
    error(error: Error): Promise<void>;
}
export default EventHandler;
