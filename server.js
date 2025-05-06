//Guardado de resultados, ranking, conexión con base de datos.

const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const cors = require('cors');
app.use(cors());
app.use(cors({
  origin: 'http://localhost:3000'
}));
const PORT = process.env.PORT || 3000;
const dataPath = path.join(__dirname, 'data.json');

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

const corsOptions = {
  origin: ['http://localhost:3000', 'https://juegodepaises.onrender.com']
};

app.use(cors(corsOptions));

app.post('/guardarJuego', (req, res) => {
  const nuevaPartida = req.body;
  if (typeof nuevaPartida.promedioTiempo !== 'number' || isNaN(nuevaPartida.promedioTiempo)) {
    nuevaPartida.promedioTiempo = 0;  // O cualquier valor predeterminado
  }

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
    
    })
  });
});

app.get('/ranking', (req, res) => {
  fs.readFile(dataPath, 'utf8', (err, data) => {
    if (err) {
      console.error("Error al leer el archivo:", err);
      return res.status(500).json({ error: 'No se pudo obtener el ranking' });
    }
    const partidas = JSON.parse(data);
    //ver si podemos poner el promedio de tiempo en el ranking
    partidas.forEach(partida => {
      const tiempoTotal = parseFloat(partida.tiempo); // Tiempo en segundos
      const numeroDePreguntas = partida.respuestasCorrectas + partida.respuestasIncorrectas; // Total de preguntas contestadas
      if (numeroDePreguntas > 0 && !isNaN(tiempoTotal)) {
        partida.promedioTiempo = (tiempoTotal / numeroDePreguntas).toFixed(2) + " seg"; // Calculamos el promedio de tiempo por pregunta
      } else {
        partida.promedioTiempo = '-'; // Si no hay preguntas contestadas, asignamos '-'
      }
    });


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