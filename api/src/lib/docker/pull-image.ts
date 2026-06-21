import { docker } from "./docker.js";

async function pullImage(image: string) {
  const stream = await docker.pull(image);

  await new Promise<void>((resolve, reject) => {
    docker.modem.followProgress(stream, (err) => {
      if (err) {
        reject(err);
        return;
      }

      resolve();
    });
  });
}

export { pullImage };
