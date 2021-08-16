import { WebhookClient } from "discord.js"

const webhook: WebhookClient = new WebhookClient({
  url: process.env.webhookUrl as string
});

send("botが起動したよ！！！");

process.on("uncaughtExceptionMonitor", (error: Error, origin: string) => {
  send(origin + "(Error): " + error.message);
  process.exit(127);
});

process.on("exit", code => {
  switch(code) {
    case 0:
      send("プロセスが正常終了しました。終了コード:" + code);
      break;
    default:
      send("プロセスがエラー落ちしました。終了コード:" + code);
  };
});

function send(content: string) {
  const date: Date = new Date();
  const time: string = `[${date.getUTCFullYear()}/${String(date.getUTCMonth()+1).padStart(2, "0")}/${String(date.getUTCDate()).padStart(2, "0")} ${String(date.getUTCHours()+9).padStart(2, "0")}:${String(date.getUTCMinutes()).padStart(2, "0")}]`;
  webhook.send(time + " " + content);
}

export default webhook