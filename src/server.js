const axios = require('axios');
const bodyParser = require('body-parser');
const express = require('express');
const morgan = require('morgan');
const path = require('path');

const uris = require('./config/uris');

// Create the server
const app = express();

// Configuration
app.use(morgan('tiny'));

app.use('/static', express.static(path.join(__dirname, 'assets')));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const getPageIdForPath = (path) => {
    switch (path) {
        case '/': return 1;
        case '/about': return 2;
        case '/minance': return 3;
        case '/todos': return 4;
        default: return 404;
    }
};

app.get('/widgets/*', async (req, res) => {
    res.sendStatus(404);
});

app.get('*', async (req, res) => {

    const pageId = getPageIdForPath(req.path);
    console.log(`page id resolved to ${pageId} for path "${req.path}"`);

    const pResp = await axios.post(`http://${uris.ASSEMBLER_SERVICE_URI}`, { pageId }, { params: { ...req.query } });
    res.send(pResp.data);

});

// Start the server
const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`server is up and running on port: ${port}`);
});
