import express from 'express';
import bodyParser from 'body-parser';

import incomingCall from '../api/incoming-call';
import incomingCallAction from '../api/incoming-call-action';
import outgoingCall from '../api/outgoing-call';

const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: false }));

app.post('/incoming-call', incomingCall);
app.post('/incoming-call-action', incomingCallAction);
app.post('/outgoing-call/:sid', outgoingCall);

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
