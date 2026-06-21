import amqp, { type Channel } from "amqplib";

const QUEUE_NAME = "provision_resource";

let channel: Channel | null = null;

/**
 * RabbitMQ singleton
 * @returns channel instance
 */
async function getChannel() {
  if (channel) return channel;

  const connection = await amqp.connect("amqp://guest:guest@localhost:5672");

  channel = await connection.createChannel();

  await channel.assertQueue(QUEUE_NAME, { durable: true });

  return channel;
}

export { getChannel, QUEUE_NAME };
