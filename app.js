const express = require('express');
const ordenRoutes = require('./routes/orden.routes');

const app = express();
const PORT = 3000;

app.use(express.json());
app.use('/api', orden.routes);
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
