import discord from "discord.js"
import dotenv from "dotenv"
import fs from "fs"
import EventHandler from "./handler"
import Commands from "./commands"
dotenv.config();

type Handler = {[T in keyof discord.ClientEvents]?: (...args: discord.ClientEvents[T]) => Promise<void>}

const client: discord.Client = new discord.Client({
  intents: new discord.Intents(Object.keys(discord.Intents.FLAGS).filter(v => !v.match(/direct_.*/i) && !v.match(/.*_typing/i)) as discord.IntentsString[])
});
const commands: Commands = new Commands(client);
const eventHandler: Handler = new EventHandler(client, commands);

Object.keys(eventHandler).forEach(func => {
  eventHandler[func] = eventHandler[func].bind(eventHandler);
  eventHandler[func].name = eventHandler[func].name.replace("bound ", "");
});

client.on("ready", eventHandler.ready);
client.on("messageCreate", eventHandler.messageCreate);
client.on("error", eventHandler.error);