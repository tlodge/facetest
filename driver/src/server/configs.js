import databox from 'node-databox';
const metaData = databox.NewDataSourceMetadata();

const configs = {

    webcamIP: {
        ...metaData,
        Description: 'Webcam: chrome app IP address',
        ContentType: 'application/json',
        Vendor: 'Databox Inc.',
        DataSourceType: 'webcamIP',
        DataSourceID: 'webcamIP',
        StoreType: 'kv',
    }
}

export default configs;