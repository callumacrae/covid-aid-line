import express from 'express';
import bodyParser from 'body-parser';

import incomingCall from '../api/incoming-call';
import outgoingCall from '../api/outgoing-call';
import test from '../api/test';

const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: false }));

app.post('/incoming-call', incomingCall);
app.post('/outgoing-call/:sid', outgoingCall);
app.get('/test', test);

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
