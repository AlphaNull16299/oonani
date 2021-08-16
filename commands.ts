import discord from "discord.js"
import { inspect } from "util"
import * as ts from "typescript"

class Commands {
  client: discord.Client;
  [index: string]: any;
  constructor(client: discord.Client) {
    this.client = client;
  }
  async nick(message: discord.Message, ...args: string[]) {
    if(!message.member?.permissions.has("MANAGE_NICKNAMES")) return message.reply("おまえの権限たりねぇばか");
    args.shift();
    if(!args[0]) return message.reply("引数たりねぇばか");
    await message.mentions.members?.first()?.setNickname(args.join(" "));
    message.reply("success!");
  }
  async pin(message: discord.Message, ...args: string[]) {
    if(!message.member?.permissions.has("MANAGE_MESSAGES")) return message.reply("おまえの権限たりねぇばか");
    if(!args[0]) return message.reply("引数たりねぇばか");
    const target: discord.Message = await message.channel.messages.fetch(String(args.pop()));
    target.pin();
  }
  async eval(message: discord.Message, ...args: string[]) {
    const code: RegExpMatchArray | null = args.join(" ").match(/```(?<codeType>[a-z])(?<code>.+)```/);
    const owner: discord.Team | discord.User | null | undefined = (await this.client.application?.fetch())?.owner;
    if(!owner) return;
    let isOwner: boolean = false;
    let result: string;
    if(owner instanceof discord.Team) isOwner = owner.members.has(message.author.id);
    if(owner instanceof discord.User) isOwner = message.author.equals(owner);
    if(!isOwner) return message.reply("使えるとでも、思ってたんですか？バカデスネー。");
    if(code?.groups?.codeType === "ts" || code?.groups?.codeType === "js") return message.reply("不明なコードタイプです。jsかtsが実行できます。");
    try {
      result = inspect(
        new Function("client", "message",
          code?.groups?.codeType === "ts" ? ts.transpile(code?.groups?.code) : code?.groups?.code as string
      )(this.client, message));
    } catch(e) {
      result = e.message + "";
    }
    message.reply("```" + result + "```");
  }
}

export default Commands