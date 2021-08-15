import discord from "discord.js"
import Commands from "./commands"

type Handler = {[T in keyof discord.ClientEvents]?: (...args: discord.ClientEvents[T]) => Promise<void>}

class EventHandler implements Handler {
  _client?: discord.Client;
  commands: Commands;
  prefix: string;
  constructor(client: discord.Client, commands: Commands) {
    this.prefix = process.env.prefix || "<";
    this.commands = commands;
    Object.defineProperty(this, "_client", {
      value: client
    });
  }
  async messageCreate(message: discord.Message) {
    if(message.author.bot) return;
    if(message.content.startsWith(this.prefix)) {
      const [command, ...args] = message.content.split(" ");
      if(command in this.commands) this.commands[command].call(this.commands, ...args);
    };
  }
  async ready() {
    console.log("logged as " + this._client.user.tag);
  }
}

export default EventHandler