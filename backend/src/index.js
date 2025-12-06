require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const port = process.env.APP_PORT || 4000;

app.use(cors());
app.use(express.json({ limit: '1mb' }));

const tenants = require('./routes/tenants');
const ingest = require('./routes/ingest');
const metrics = require('./routes/metrics');
const auth = require('./routes/auth');

app.use('/api/tenants', tenants);
app.use('/api/ingest', ingest);
app.use('/api/metrics', metrics);
app.use('/api/auth', auth);

app.get('/', (req, res) => res.send('Xeno demo backend running'));

app.listen(port, () => console.log(`backend listening on ${port}`));
