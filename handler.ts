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
    console.log(message.content);
    if(!message.guild) return;
    if(message.content.startsWith(this.prefix)) {
      if(message.author.bot) return;
      const [command, ...args] = message.content.split(" ");
      if(command in this.commands) this.commands[command].call(this.commands, ...args);
    } else if(message.author.id === "159985870458322944") {
      if(!message.author.bot) return;
      const channel: any | { send: Function } = await this._client.channels.fetch(process.env.levelupChannel as string);
      const [_, level, userid] = message.content.split(" ");
      if(!(level as string in roles)) return;
      const role: discord.Role | null = await message.guild?.roles.fetch(roles[+level] as string);
      const member: discord.GuildMember = await message.guild?.members.fetch(userid);
      if(!(channel && member && role)) return;
      await member.roles.add(role);
      channel.send(member + "さんが" + level + "lvにレベルアップしました！");
    } else {
      if(message.author.bot) return;
      const regex: RegExp = /https?:\/\/([a-z]+\.)?discord(app)?\.com\/channels\/(?<guildid>\d{16,18})\/(?<channelid>\d{16,18})\/(?<messageid>\d{16,18})/;
      const match: RegExpMatchArray | null = message.content.match(regex);
      if(!match) return;
      debugger;
      const guild: discord.Guild | undefined = await this._client.guilds.fetch(match?.groups?.guildid as string).catch(e => void e);
      const channel: discord.GuildChannel | null | undefined = await guild?.channels?.fetch(match?.groups?.channelid as string).catch(e => void e);
      if(!channel || !channel.isText()) return;
      debugger;
      const target: discord.Message | undefined = await channel.messages?.fetch(match?.groups?.guildid as string).catch(e => void e);
      if(!target) return;
      debugger;
      const embed: discord.MessageEmbed = new discord.MessageEmbed()
        .setDescription(target.content || "(none)")
        .setFooter(target.author.tag, target.author.avatarURL({ size: 512, format: "png" }) as string)
        .setTimestamp(target.createdAt)
        .setURL(message.url)
        .setTitle("メッセージに飛ぶ");
      const attachments: discord.MessageAttachment[] = [...target.attachments.values()];
      if(attachments.length !== 0) embed.setURL(attachments.shift()?.url as string);
      await message.channel.send({
        embeds: [embed, ...target.embeds].slice(0,9),
        files: attachments.length === 0 ? void 0 : attachments.map(a => a.url)
      });
    }
  }
  async ready() {
    const status: string[] = Array.from(process.env.status?.split(":") as string[]);
    console.log("logged as " + this._client.user?.tag);
    this._client.user?.setActivity(status[1] as string, { type: status[0].toUpperCase() as discord.ActivityType });
    const guild: discord.Guild | null = await this._client.guilds.fetch(process.env.guildid as string);
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
