import { getChannel, QUEUE_NAME } from "../mq.js";
import { provisionLb } from "./provision-lb.js";

async function startWorker() {
  const channel = await getChannel();

  channel.consume(QUEUE_NAME, async (msg) => {
    if (!msg) return;

    try {
      const payload = JSON.parse(msg.content.toString());
      const { lbId, jobId } = payload;

      await provisionLb(lbId, jobId);

      channel.ack(msg);
    } catch (err) {
      console.error(`err: ${err}`);
    }
  });

  return;
}

export { startWorker };
