
function interfaces() {
    //naive, just pull out any IPv4 addresses
    return new Promise(function (resolve, reject) {
        try {
            chrome.system.network.getNetworkInterfaces(function (interfaces) {
                var results = interfaces.reduce(function (acc, ifc) {
                    if (/^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/.test(ifc.address)) {
                        acc.push(ifc.address);
                    }
                    return acc;
                }, []);
                resolve(results);
            })
        } catch (err) {
            reject(err);
        }
    });
}