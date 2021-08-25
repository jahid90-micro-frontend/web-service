const express = require('express');
const morgan = require('morgan');
const path = require('path');

const assemblerService = require('./clients/assembler-service-client');

// Create the server
const app = express();

// Configuration
app.use(morgan('tiny'));

app.use('/static', express.static(path.join(__dirname, 'assets')));

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

const getPageIdForPath = (path) => {
    switch (path) {
        case '/': return 1;
        case '/about': return 2;
        case '/minance': return 3;
        case '/todos': return 4;
        default: return 404;
    }
};

app.get('/widgets/*', async (_, res) => {
    res.sendStatus(404);
});

app.get('/modules/*', async (_, res) => {
    res.sendStatus(404);
});

app.get('/favicon.ico', (_, res) => {
    res.sendStatus(404);
});

app.get('*', async (req, res) => {

    try {

        const pageId = getPageIdForPath(req.path);

        console.debug(`Request: {path: ${req.path}}`);

        const response = await assemblerService.tracedGet({ pageId }, { params: { ...req.query } });
        res.send(response.data);

    } catch(err) {

        console.error(err.message);

        res.sendStatus(500);
    }

});

module.exports = app;
