import request from 'superagent';

export function get(url = "", query = {}) {

    console.log("getting", url, query);
    return new Promise((resolve, reject) => {
        request
            .get(url)
            .query(query)
            .set('Accept', 'application/json')
            .end(function (err, res) {
                if (err || !res) {
                    console.log(err);
                    reject()
                } else {
                    console.log("got", res);
                    resolve(res.body);
                }
            });
    })
}

export function post(url = "", data = {}) {
    console.log("posting", url, data);
    return new Promise((resolve, reject) => {
        request
            .post(url)
            .send(data)
            .timeout(4000)
            .set('Accept', 'application/json')
            .end(function (err, res) {
                if (err || !res) {
                    reject()
                } else {
                    console.log("got", res.body);
                    resolve(res.body);
                }
            });
    })
}