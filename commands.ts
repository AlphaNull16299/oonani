import discord from "discord.js"

interface ICommands {
  [index: string]: any
  nick(): void
}

class Commands implements ICommands {
  client: discord.Client;
  constructor(client: discord.Client) {
    this.client = client;
  }
  nick(...args: string[]) {
    
  }
}

export default Commands