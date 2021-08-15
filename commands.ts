import discord from "discord.js"

class Commands {
  client: discord.Client;
  [index: string]: any;
  constructor(client: discord.Client) {
    this.client = client;
  }
  async nick(message: discord.Message, ...args: string[]) {
    args.pop();
    if(!args[0]) return message.reply("引数たりねぇばか");
    await message.mentions.members?.first()?.setNickname(args.join(" "));
    message.reply("success!");
  }
  async pin(message: discord.Message, ...args: string[]) {
    if(!args[0]) return message.reply("引数たりねぇばか");
    const target: discord.Message = await message.channel.messages.fetch(String(args.pop()));
    target.pin();
  }
}

export default Commands