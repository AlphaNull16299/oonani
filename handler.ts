import discord from "discord.js"
import Commands from "./commands"

type Handler = {[T in keyof discord.ClientEvents]?: (...args: discord.ClientEvents[T]) => Promise<void>}

let beforeTime: number = new Date().getUTCHours() + 9;
const roles: Array<undefined | string> = [];
process.env.roleid?.split(",").forEach(v => {
  const [level, roleid] = v.split(":");
  roles[+level] = roleid;
});

class EventHandler implements Handler {
  _client: discord.Client;
  commands: Commands;
  prefix: string;
  constructor(client: discord.Client, commands: Commands) {
    this.prefix = process.env.prefix || "<";
    this.commands = commands;
    this._client = client;
  }
  async messageCreate(message: discord.Message) {
    if(!message.guild) return;
    if(message.author.bot) return;
    if(message.content.startsWith(this.prefix)) {
      const [command, ...args] = message.content.split(" ");
      if(command in this.commands) this.commands[command].call(this.commands, ...args);
    } else if(message.author.id === "159985870458322944") {
      const channel: discord.Channel | null = await this._client.channels.fetch(process.env.levelupChannel as string);
      const [_, level, userid] = message.content.split(" ");
      if(!(level as string in roles)) return;
      const role: discord.Role | null = await message.guild?.roles.fetch(roles[+level]);
      const member: discord.GuildMember = await message.guild?.members.fetch(userid);
      if(!(channel && member && role)) return;
      await member.roles.add(role);
      channel.send(member + "さんが" + level + "lvにレベルアップしました！");
    };
  }
  async ready() {
    console.log("logged as " + this._client.user?.tag);
    const guild: discord.Guild | null = await client.guilds.fetch(process.env.guildid as string);
    if(!guild) return;
    setInterval(() => {
      const time: number = new Date().getUTCHours() + 9;
      if(time === beforeTime) return;
      beforeTime = time;
      if(guild.name.match(/\s\d{1,2}時/)){
        guild.setName(guild.name + " " + time + "時");
      } else {
        guild.setName(guild.name.replace(/\s\d{1,2}時/, " " + time + "時"));
      };
    });
  }
  async error(error: Error) {
    console.error(error);
  }
}

export default EventHandler