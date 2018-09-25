


navigator.getUserMedia = navigator.getUserMedia ||
    navigator.webkitGetUserMedia ||
    (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) ?
    function (c, os, oe) {
        navigator.mediaDevices.getUserMedia(c).then(os, oe);
    } : null ||
    navigator.msGetUserMedia;

var video;
var _latest = "";

var storeFrameLoop = function () {
    var canvas = document.createElement('canvas');
    canvas.width = video.width;
    canvas.height = video.height;
    //console.log(video.width, video.height);
    var cc = canvas.getContext('2d');
    cc.drawImage(video, 0, 0, video.width, video.height);
    //var apx = cc.getImageData(0, 0, video.width, video.height);
    _latest = JSON.stringify({
        ts: Date.now(),
        image: canvas.toDataURL('image/jpeg', 0.6)
    })
    setTimeout(storeFrameLoop, 1000);
}

var latest = function () {
    return _latest;
}

document.addEventListener('DOMContentLoaded', function () {
    window.resizeTo(300, 348);
    if (navigator.getUserMedia) {
        //var vid = document.getElementById('vid');

        video = document.querySelector('video');
        navigator.mediaDevices.getUserMedia({ video: true }).then((stream) => { video.srcObject = stream });
        storeFrameLoop()
        //navigator.getUserMedia({ video: true }, umSuccess, function (err) {
        //    console.log("Error fetching video from webcam", err);
        //});
    } else {
        console.log("No webcam detected.");
    }
});

