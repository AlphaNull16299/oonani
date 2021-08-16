import { WebhookClient } from "discord.js"

const webhook: WebhookClient = new WebhookClient({
  url: process.env.webhookUrl as string
});

webhook.send("botが起動したよ！！！");

process.on("uncaughtExceptionMonitor", (error: Error, origin: string) => {
  webhook.send(origin + "(Error): " + error.message);
});

process.on("beforeExit", code => {
  webhook.send("プロセスがクラッシュしました。終了コード:" + code);
});

export default webhook