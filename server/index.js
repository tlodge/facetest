const WebSocket = require('ws');
const cv = require('opencv4nodejs');
const classifier = new cv.CascadeClassifier(cv.HAAR_FRONTALFACE_ALT2);

const ws = new WebSocket('ws://127.0.0.1:9999', {
  perMessageDeflate: false
});

//let socketReady = false;

ws.on('open', function open() {
  socketReady = true;
  ws.send(JSON.stringify({ type: "fetch" }));
  /*var send = () => {
    ws.send("latest");
    setTimeout(() => {
      send();
    }, 1500);
  }
send();*/
});

ws.on('message', function incoming(msg) {
  console.log("processing image!");
  try {
    const data = JSON.parse(msg);
    const imgdata = data.image.replace(/^data:image\/\w+;base64,/, "");
    const buffer = Buffer.from(imgdata, 'base64');
    const img = cv.imdecode(buffer);
    const grayImg = img.bgrToGray();

    classifier.detectMultiScaleAsync(grayImg, (err, res) => {
      if (err) {
        console.log(err);
      }

      const { objects, numDetections } = res;

      if (!objects.length) {
        console.log("failed to detect any faces!");
      } else {
        console.log(objects[0]);
        const face = grayImg.getRegion(objects[0]);
        const outBase64 = cv.imencode('.jpg', face).toString('base64');
        //ws.send(JSON.stringify({ type: "result" }));
        ws.send(JSON.stringify({ type: "result", image: `data:image/jpeg;base64,${outBase64}` }));
      }
      //console.log(objects, numDetections);
      setTimeout(() => ws.send(JSON.stringify({ type: "fetch" })), 1000);
    });
  } catch (err) {
    console.log(err);
  }
});
