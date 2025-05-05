//Guardado de resultados, ranking, conexión con base de datos.

const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;
const dataPath = path.join(__dirname, 'data.json');

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

app.post('/guardarJuego', (req, res) => {
  const nuevaPartida = req.body;
  fs.readFile(dataPath, 'utf8', (err, data) => {
    let partidas = [];
    if (!err && data) {
      partidas = JSON.parse(data);
    }
    partidas.push(nuevaPartida);
    fs.writeFile(dataPath, JSON.stringify(partidas, null, 2), err => {
      if (err) {
        console.error("Error al guardar la partida:", err);
        return res.status(500).json({ error: 'No se pudo guardar la partida' });
      }
      res.status(200).json({ mensaje: 'Partida guardada con éxito' });
    });
  });
});

app.get('/ranking', (req, res) => {
  fs.readFile(dataPath, 'utf8', (err, data) => {
    if (err) {
      console.error("Error al leer el archivo:", err);
      return res.status(500).json({ error: 'No se pudo obtener el ranking' });
    }
    const partidas = JSON.parse(data);
    const top20 = partidas
      .sort((a, b) => {
        if (b.puntaje === a.puntaje) {
          return a.tiempo - b.tiempo;
        }
        return b.puntaje - a.puntaje;
      })
      .slice(0, 20);
    res.status(200).json(top20);
  });
});
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});