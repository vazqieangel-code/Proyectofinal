require('dotenv').config();

const app = require('./src/app');

const PORT = process.env.PORT || 3000;

console.log("DEBUG VERSION FCE9643");

app.listen(PORT, () => {
    console.log(`Servidor ejecutándose en puerto ${PORT}`);
});