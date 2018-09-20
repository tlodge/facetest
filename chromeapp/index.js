window.resizeTo(300, 352);

function $(id) {
  return document.getElementById(id);
}



function umSuccess(stream) {
  console.log("successfully captured some video!!!");
  if (vid.mozCaptureStream) {
    vid.mozSrcObject = stream;
  } else {
    vid.src = (window.URL && window.URL.createObjectURL(stream)) ||
      stream;
  }
  vid.play();
  vidReady = true;
  //sendFrameLoop();
}

var port = 9999;
var isServer = false;
if (http.Server && http.WebSocketServer) {
  // Listen for HTTP connections.
  var server = new http.Server();
  var wsServer = new http.WebSocketServer(server);
  server.listen(port);
  isServer = true;

  server.addEventListener('request', function (req) {
    var url = req.headers.url;
    if (url == '/')
      url = '/index.html';
    // Serve the pages of this chrome application.
    req.serveUrl(url);
    return true;
  });

  // A list of connected websockets.
  var connectedSockets = [];

  wsServer.addEventListener('request', function (req) {
    log('Client connected');
    var socket = req.accept();
    //connectedSockets.push(socket);

    // When a message is received on one socket, rebroadcast it on all
    // connected sockets.
    socket.addEventListener('message', function (e) {
      const msg = JSON.parse(e.data);
      if (msg.type === "fetch") {
        var data = latest();
        socket.send(data);
      }
      else if (msg.type === "result") {
        console.log("would do something with result!!");
        //console.log(msg.image);
        //var htmlImg = '<img src=data:image/jpeg;base64,' + outBase64 + '>';
        try {
          var img = document.createElement("img");
          img.src = msg.image;
          var imgdiv = document.getElementById("images");
          imgdiv.appendChild(img)
        } catch (err) {
          console.log(err);
        }
      }
      //for (var i = 0; i < connectedSockets.length; i++) {
      //console.log("sending", latest())
      //var data = JSON.stringify(latest());
      //console.log(data);
      //  connectedSockets[i].send(data);
      // }
    });

    // When a socket is closed, remove it from the list of connected sockets.
    socket.addEventListener('close', function () {
      log('Client disconnected');
      //for (var i = 0; i < connectedSockets.length; i++) {
      //  if (connectedSockets[i] == socket) {
      //    connectedSockets.splice(i, 1);
      //    break;
      //  }
      //}
    });
    return true;
  });
}

document.addEventListener('DOMContentLoaded', function () {

  navigator.getUserMedia = navigator.getUserMedia ||
    navigator.webkitGetUserMedia ||
    (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) ?
    function (c, os, oe) {
      navigator.mediaDevices.getUserMedia(c).then(os, oe);
    } : null ||
    navigator.msGetUserMedia;

  window.URL = window.URL ||
    window.webkitURL ||
    window.msURL ||
    window.mozURL;


  interfaces().then(function (ifaces) {
    var idiv = document.getElementById("interfaces");
    ifaces.forEach(function (iface) {
      var addr = document.createElement("h2");
      addr.innerHTML = iface;
      idiv.appendChild(addr);
    })
  });
});
