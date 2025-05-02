//Guardado de resultados, ranking, conexión con base de datos.

const express = require('express');
const fs = require('fs');
const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.static('public'));
const rutaDatos = path.join(__dirname, 'datos', 'datos.json');

app.post('/guardarJuego', (req, res) => {
    const nuevaPartida = req.body;
    let partidas = [];
    if (fs.existsSync(rutaDatos)) {
        const data = fs.readFileSync(rutaDatos);
        partidas = JSON.parse(data);
    }

    partidas.push(nuevaPartida);

    partidas.sort((a, b) => b.puntaje - a.puntaje);
    partidas = partidas.slice(0, 20);
    fs.writeFileSync(rutaDatos, JSON.stringify(partidas, null, 2));
    res.json({ mensaje: 'Partida guardada correctamente' });
});

app.get('/ranking', (req, res) => {
    if (fs.existsSync(rutaDatos)) {
        const data = fs.readFileSync(rutaDatos);
        const partidas = JSON.parse(data);
        res.json(partidas);
    } else {
        res.json([]);
    }
});

app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});