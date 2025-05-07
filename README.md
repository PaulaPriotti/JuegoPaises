# JuegoPaises
Este repositorio es para subir el practico integrador de Programación Web II (primer cuatri 2025)

Objetivo
Poner a prueba tus conocimientos sobre países, capitales, banderas y fronteras. Al final, se muestra un resumen con tu puntaje, el tiempo empleado y un ranking con las mejores 20 partidas.

Tecnologías utilizadas
HTML, CSS, JavaScript (Vanilla)
Node.js (servidor backend)
API restcountries.com

Instalación y ejecución
Clona el repositorio:
git clone https://github.com/tu-usuario/juego-paises.git
Instala las dependencias del servidor:
npm install
node server.js


Funcionalidades
Preguntas aleatorias sobre:
Capitales
Banderas
Países limítrofes
Múltiples opciones de respuesta
Puntuación dinámica
Cronómetro de duración de la partida
Ranking con las 20 mejores partidas

Estructura del proyecto
juego-paises/
├── public
    ├── index.html         // Página principal
    ├── style.css          // Estilos del juego
    ├── script.js          // Lógica del juego (frontend)
├── server.js          // Servidor backend en Node.js
├── data.json      // Archivo que almacena el ranking
└── README.md          // Documentación del proyecto
Historias de usuario implementadas
US1: El usuario puede comenzar una partida ingresando su nombre.

US2: El juego presenta preguntas con 4 opciones.

US3: Se muestra mensaje de acierto/error al responder.

US4: Al finalizar, se muestra puntaje, respuestas correctas y tiempo.

US5: Las partidas se almacenan en un archivo partidas.json.

US6: Se muestra un ranking con las 20 mejores partidas.

Licencia
Este proyecto se distribuye bajo la licencia MIT.