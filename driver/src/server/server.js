import https from 'https';
import http from "http";
import express from "express";
import bodyParser from "body-parser";
import databox from 'node-databox';
import WebSocket from 'ws';

const imageSchema = {
    ...databox.NewDataSourceMetadata(),
    Description: 'Webcam: chrome app Images',
    ContentType: 'application/json',
    Vendor: 'Databox Inc.',
    DataSourceType: 'browserWebcamImage',
    DataSourceID: 'browserWebcamImage',
    StoreType: 'kv',
}

const configSchema = {
    ...databox.NewDataSourceMetadata(),
    Description: 'Webcam: chrome app IP address',
    ContentType: 'application/json',
    Vendor: 'Databox Inc.',
    DataSourceType: 'browserWebcamIP',
    DataSourceID: 'browserWebcamIP',
    StoreType: 'kv',
}

const DATABOX_ZMQ_ENDPOINT = "tcp://0.0.0.0:4444";// ;//process.env.DATABOX_ZMQ_ENDPOINT
const credentials = databox.getHttpsCredentials();

const PORT = process.env.port || '8080';

console.log("creating kvc and tsc clients");
const kvc = databox.NewKeyValueClient(DATABOX_ZMQ_ENDPOINT, false);
console.log("done!");

const connect = (ip) => {

    console.log("connecting to chrome app with ip", ip);

    const connectws = () => {
        let ws;
        try {
            ws = new WebSocket(`ws://${ip}:9999`, { perMessageDeflate: false });
        } catch (err) {
            console.log("error connecting, trying again in 1s", err);
            setTimeout(connectws, 1000);
        }

        ws.on('open', function open() {
            const fetch = () => {
                console.log("fetching new image");
                ws.send(JSON.stringify({ type: "fetch" }));
                setTimeout(fetch, 1000);
            }
        });

        ws.on('message', function incoming(msg) {
            console.log("writing image to kv store");
            try {
                const data = JSON.parse(msg);
                kvc.Write(imageSchema.DataSourceID, "image", { data: data.image }).then((body) => {
                    console.log("successfully written image");
                }).catch((error) => {
                    console.log("failed to write image", error);
                });
            } catch (err) {
                console.log(err);
            }
        });
    }
    connectws();
}

console.log("registering datasource", JSON.stringify(configSchema, null, 4));

kvc.RegisterDatasource(configSchema).then(() => {

    console.log("finished registering webcam config datasource");
    console.log("registering image datasource", JSON.stringify(imageSchema, null, 4));
    kvc.RegisterDatasource(imageSchema).then(() => {
        console.log("finished registering webcam image datasource!");
    });
})

console.log("[Creating https server]", PORT);
const app = express();

app.set('views', './views');
app.set('view engine', 'html');
app.engine('html', require('ejs').renderFile);
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use('/', express.static('./www'));

app.get('/', (req, res) => {
    console.log("in ui endpoint!!");
    res.render('index');
});

app.get('/ui/getConfiguration', (req, res) => {
    console.log("getting driver config");

    kvc.Read(configSchema.DataSourceID, "config").then((result) => {
        console.log("result:", configSchema.DataSourceID, result);
        res.send({ ip: result.value });
    });
});

app.post('/ui/setConfiguration', (req, res) => {
    console.log("setting camera IP");
    console.log(JSON.stringify(req.body));

    if (!req.body || !req.body.attributes) {
        res.send({ success: true });
        return;
    }

    const ip = req.body.ip;

    return new Promise((resolve, reject) => {
        kvc.Write(configSchema.DataSourceID, "config", { key: configSchema.DataSourceID, value: ip }).then(() => {
            console.log("successfully written!");
            connect(ip);
            resolve();
        }).catch((err) => {
            console.log("failed to write", err);
            reject(err);
        });
    })
});

app.get("/status", function (req, res) {
    res.send("active");
});


//https.createServer(credentials, app).listen(PORT);
http.createServer(app).listen(PORT);