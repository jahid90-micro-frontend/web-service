const axios = require('axios');

const { traceAsync } = require('@jahiduls/lib-tracing');

const uris = require('../config/uris');

const fetchAssembledPage = (data, options) => {
    return axios.post(`http://${uris.ASSEMBLER_SERVICE_URI}`, data, options);
}

module.exports = {
    get: fetchAssembledPage,
    tracedGet: traceAsync(fetchAssembledPage, 'assembler-service--assembled-page--get')
};
