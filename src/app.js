const express = require('express');
const app = express();
const rawBodyParser = require('./middleware/rawBodyParser');
const apiRoutes = require('./routes/apiRoutes');

app.use(express.json({ verify: rawBodyParser }));
app.use('/api', apiRoutes);

app.listen(8080, () => console.log('alive on http://localhost:8080'));
