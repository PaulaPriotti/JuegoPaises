//Preguntas, botones, puntaje

const api = 'https://restcountries.com/v3.1/all';

let nombreJugador = '';
let puntaje = 0;
let tiempoInicio = 0;
let respuestasCorrectas = 0;
let respuestasIncorrectas = 0;
let preguntasRespondidas = 0;
let tipoPreguntaActual = null;

const botonComenzar = document.getElementById("botonComenzar");
const nombreSec = document.getElementById("nombre-sec");
const inputNombre = document.getElementById("input-nombre");
const botonIniciar = document.getElementById("botonIniciar");
const preguntaSec = document.getElementById("pregunta-sec");
const textoPregunta = document.getElementById("pregunta");
const opcionesContenedor = document.getElementById("opciones");
const resultadoSec = document.getElementById("resultado-sec");
const mensaje = document.getElementById("mensaje");
const botonSiguiente = document.getElementById("botonSiguiente");
const resumenSec = document.getElementById("resumen-sec");
const resumenPuntaje = document.getElementById("resumen-puntaje");
const resumenTiempo = document.getElementById("resumen-tiempo");
const resumenCorrectas = document.getElementById("resumen-correctas");
const resumenIncorrectas = document.getElementById("resumen-incorrectas");
const resumenPromedioTiempo = document.getElementById("resumen-promedio-tiempo");
const botonVolver = document.getElementById("botonVolver");
const rankingLista = document.getElementById("ranking-lista");

botonComenzar.addEventListener("click", () => {
  document.getElementById("inicio-sec").style.display = "none";
  nombreSec.style.display = "block";
});

//Iniciar el juego
botonIniciar.addEventListener("click", () => {
  nombreJugador = inputNombre.value.trim() || "Anónimo";
  nombreSec.style.display = "none";
  preguntaSec.style.display = "block";
  puntaje = 0;
  respuestasCorrectas = 0;
  respuestasIncorrectas = 0;
  tiempoInicio = Date.now();
  obtenerPregunta();
});

//Obtengo y muestro la pregunta (antes tenia una funcion para cada pregunta)
function obtenerPregunta(){
    const tipoPregunta = Math.floor(Math.random()*3);
    const paisRandom = paises[Math.floor(Math.random() * paises.length)];

    let pregunta = "";
    let respuestaCorrecta = "";
    let opciones = new Set();

  //pregunta capital
    if(tipoPregunta === 0 && paisRandom.capital && paisRandom.capital.length > 0){
      pregunta = `¿Cuál es el país de la siguiente ciudad capital: ${paisRandom.capital[0]}?`;
      respuestaCorrecta = paisRandom.name.common;
      opciones.add(respuestaCorrecta);

      while (opciones.size < 4) {
        const pais = paises[Math.floor(Math.random() * paises.length)];
        if (pais.name.common !== respuestaCorrecta){
          opciones.add(pais.name.common);
        }      
      }
      // Pregunta de Bandera
    } else if (tipoPregunta === 1 && paisRandom.flags && paisRandom.flags.png) {
      const mostrarNombreReal = Math.random() < 0.5;
      const nombreMostrado = mostrarNombreReal
          ? paisRandom.name.common
          : paises[Math.floor(Math.random() * paises.length)].name.common;

      pregunta = `¿El país ${nombreMostrado} esta representado por la siguiente bandera?<br><br><img src="${paisRandom.flags.png}" alt="Bandera" style="width: 100px;">`;
      respuestaCorrecta = mostrarNombreReal ? "Sí" : "No";
      opciones = new Set(["Sí", "No"]);
  
      //pregunta de frontera
  } else if (tipoPregunta === 2 && paisRandom.borders && paisRandom.borders.length > 0){
    const cantidadFronteras = paisRandom.borders ? paisRandom.borders.length : 0;
    pregunta = `¿Cuántos países limítrofes tiene ${paisRandom.name.common}?`;
    respuestaCorrecta = cantidadFronteras.toString();
    opciones.add(respuestaCorrecta);

    while (opciones.size < 4){
      const numRandom = Math.floor(Math.random() * 10).toString();
      opciones.add(numRandom);
    }
  } else {
    tipoPreguntaActual = tipoPregunta;
    return obtenerPregunta(); //cuando no se cumple la condicion
  }
  //mostramos la pregunta y opciones
  textoPregunta.innerHTML = pregunta;
  opcionesContenedor.innerHTML = "";
  Array.from(opciones).sort(() => Math.random() - 0.5).forEach(opcion => {
    const btn = document.createElement("button");
    btn.textContent = opcion;
    btn.addEventListener("click", () => verificarRta(opcion));
    opcionesContenedor.appendChild(btn);
  });
}

function verificarRta(respuestaSeleccionada){
    seccionResultado.style.display = "block";
    seccionPregunta.style.display = "none";
    preguntasRespondidas++;
  
    if (respuestaSeleccionada === respuestaCorrecta) {
      mensaje.textContent = "¡Correcto!";
  
      // Asignar puntaje según el tipo de pregunta
      if (tipoPreguntaActual === 0) {
        puntaje += 3; // capital
      } else if (tipoPreguntaActual === 1) {
        puntaje += 5; // bandera
      } else if (tipoPreguntaActual === 2) {
        puntaje += 3; // fronteras
      }

      respuestasCorrectas++;
    } else {
      mensaje.textContent = `Incorrecto. La respuesta correcta era: ${respuestaCorrecta}`;
    }  
}

//se agrega momentaneamente un boton para continuar
botonSiguiente.addEventListener("click", () => {
  resultadoSec.style.display = "none";

  if (preguntasRespondidas < 10) {
    seccionPregunta.style.display = "block";
    obtenerPregunta();
  } else {
    mostrarResumen();
  }
});

function mostrarResumen() {
  const tiempoFinal = Math.floor((Date.now() - tiempoInicio) / 1000);
  const promedioTiempo = (tiempoFinal / preguntasRespondidas).toFixed(2);
  resumenSec.style.display = "block";
  resumenPuntaje.textContent = `Puntaje: ${puntaje}`;
  resumenTiempo.textContent = `Tiempo: ${tiempoFinal} segundos`;
  resumenCorrectas.textContent = `Respuestas correctas: ${respuestasCorrectas}/10`;
  resumenIncorrectas.textContent = `Respuestas incorrectas: ${respuestasIncorrectas}`;

  guardarPartida(nombreJugador, puntaje, tiempoFinal); // Guardar partida
  obtenerRanking(); // Reiniciar preguntas
};

botonVolver.addEventListener("click", () => {
  resumenSec.style.display = "none";
  document.getElementById("inicio").style.display = "block";
});  

function guardarPartida(nombre, puntaje, tiempo) {
  fetch('/guardarJuego', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      nombre,
      puntaje,
      tiempo
    })
  })
  // .then(response => response.json())
  // .then(data => {
  //   console.log("Partida guardada:", data);
  //   mostrarResultado(); // o lo que uses para mostrar resultados
  // })
  // .catch(error => {
  //   console.error("Error al guardar la partida:", error);
  // });
}

function verRanking() {
  fetch('/ranking')
    .then(res => res.json())
    .then(ranking => {
      rankingLista.innerHTML = "";
      ranking.forEach(item => {
        const li = document.createElement("li");
        li.textContent = `${item.nombre} - Puntaje: ${item.puntaje} - Tiempo: ${item.tiempo}s`;
        rankingLista.appendChild(li);
      });
    });
}
