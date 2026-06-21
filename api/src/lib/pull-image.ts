import { docker } from "./docker.js";

function pullImage(image: string) {
  //followProgress(stream, onFinished, [onProgress])
  docker.pull(image, function (err, stream) {
    //...
    docker.modem.followProgress(stream, () => {

    });


  });
}
