//Preguntas, botones, puntaje

const api = 'https://restcountries.com/v3.1/all';
let paises = [];

// Cargar los países al inicio
fetch(api)
  .then(response => response.json())
  .then(data => {
    paises = data; 
    console.log("Países cargados:", paises);
  })
  .catch(error => {
    console.error("Error al cargar los países:", error);
  });

let nombreJugador = '';
let puntaje = 0;
let tiempoInicio = 0;
let respuestasCorrectas = 0;
let respuestasIncorrectas = 0;
let preguntasRespondidas = 0;
let tipoPreguntaActual = null;
let respuestaCorrecta = ""; 

const botonComenzar = document.getElementById("botonComenzar");
const nombreSec = document.getElementById("nombre-sec");
const inputNombre = document.getElementById("input-nombre");
const botonIniciar = document.getElementById("botonIniciar");
const preguntaSec = document.getElementById("pregunta-sec");
const textoPregunta = document.getElementById("pregunta");
const opcionesContenedor = document.getElementById("opciones");
const mensaje = document.getElementById("mensaje");
const resumenSec = document.getElementById("resumen-sec");
const resumenPuntaje = document.getElementById("resumen-puntaje");
const resumenTiempo = document.getElementById("resumen-tiempo");
const resumenCorrectas = document.getElementById("resumen-correctas");
const resumenIncorrectas = document.getElementById("resumen-incorrectas");
const resumenPromedioTiempo = document.getElementById("resumen-promedio-tiempo");
const botonVolver = document.getElementById("botonVolver");
const rankingSec = document.getElementById("ranking-sec");
const rankingLista = document.getElementById("ranking-lista");
const botonRanking = document.getElementById("botonRanking");
const botonVolverInicio = document.getElementById("botonVolverRanking");
const botonRankingFinal = document.getElementById("botonRankingFinal");

botonComenzar.addEventListener("click", () => {
  document.getElementById("inicio-sec").style.display = "none";
  nombreSec.style.display = "block";
});

//Iniciar el juego
botonIniciar.addEventListener("click", () => {
  if (paises.length === 0) {
    alert("Los datos aún se están cargando. Por favor, espera.");
    return;
  }
  nombreJugador = inputNombre.value.trim() || "Anónimo";
  nombreSec.style.display = "none";
  preguntaSec.style.display = "block";
  tiempoInicio = Date.now();
  obtenerPregunta();
});

function obtenerPregunta() {
  if (preguntasRespondidas >= 10) {
    mostrarResumen();
    return;
  }

  const tipoPregunta = Math.floor(Math.random()*3);
  const paisRandom = paises[Math.floor(Math.random() * paises.length)];

  let pregunta = "";
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
      respuestaCorrecta = mostrarNombreReal ? "Si" : "No";
      opciones = ["No", "Si"];

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
    return obtenerPregunta(); //cuando no se cumple la condicion
  }
  //mostramos la pregunta y opciones
  tipoPreguntaActual = tipoPregunta;
  textoPregunta.innerHTML = pregunta;
  opcionesContenedor.innerHTML = "";

  let opcionesSiNo;
  if (Array.isArray(opciones)) {
    opcionesSiNo = opciones; // para tipo Sí/No
  } else {
    opcionesSiNo = Array.from(opciones).sort(() => Math.random() - 0.5); // mezclar solo si no es Sí/No
  }

  opcionesSiNo.forEach(opcion => {
    const boton = document.createElement("button");
    boton.textContent = opcion;
    boton.addEventListener("click", () => verificarRta(opcion));
    opcionesContenedor.appendChild(boton);
  });
}

function verificarRta(respuestaSeleccionada){
    preguntasRespondidas++;
  
    if (respuestaSeleccionada === respuestaCorrecta) {
      mensaje.textContent = "¡Correcto!";
      mensaje.style.color = "green";
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
      mensaje.style.color = "red";
      respuestasIncorrectas++;
    }  

    // Desactivar botones
    const botones = opcionesContenedor.querySelectorAll("button");
    botones.forEach(btn => btn.disabled = true);

    //cuando se contesta una pregunta, se pasa automaticamnte a la siguiente
    setTimeout(() => {
      mensaje.textContent = "";
      obtenerPregunta();
    }, 1000);
}

function mostrarResumen() {
  preguntaSec.style.display = "none";
  const tiempoFinal = Math.floor((Date.now() - tiempoInicio) / 1000);
  const promedioTiempo = (tiempoFinal / preguntasRespondidas).toFixed(2);
  resumenSec.style.display = "block";
  resumenPuntaje.textContent = `Puntaje: ${puntaje}`;
  resumenTiempo.textContent = `Tiempo: ${tiempoFinal} segundos`;
  resumenPromedioTiempo.textContent = `Promedio de tiempo por pregunta: ${promedioTiempo} segundos`;
  resumenCorrectas.textContent = `Respuestas correctas: ${respuestasCorrectas}/10`;
  resumenIncorrectas.textContent = `Respuestas incorrectas: ${respuestasIncorrectas}`;

  botonVolver.style.display = "flex";
  botonRankingFinal.style.display = "flex";
  guardarPartida(nombreJugador, puntaje, tiempoFinal, respuestasCorrectas, respuestasIncorrectas, promedioTiempo); // Guardar partida
  verRanking(); // Reiniciar preguntas
};

function guardarPartida(nombre, puntaje, tiempo, correctas, incorrectas, promedioTiempo) {
  const partida = {
    nombre, 
    puntaje, 
    tiempo, 
    correctas,
    incorrectas,
    promedioTiempo
  };
  fetch('/guardarJuego', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(partida)
  })
  .then(res => res.json())
  .then(data => console.log("Partida guardada:", data))
  .catch(error => {
    console.error("Error al guardar la partida:", error);
    alert("No se pudo guardar la partida.");
  });
}

function mostrarRanking() {
  rankingSec.style.display = "block";
  resumenSec.style.display = "none";
  botonVolverInicio.style.display = "flex";
  document.getElementById("inicio-sec").style.display = "none";
  verRanking();
}

botonRanking.addEventListener("click", mostrarRanking);
botonRankingFinal.addEventListener("click", mostrarRanking);

function verRanking() {
  botonComenzar.style.display = "none";
  botonRanking.style.display = "none";
  fetch('https://juegodepaises.onrender.com/ranking')
    .then(res => res.json())
    .then(ranking => {
      rankingLista.innerHTML = "";
      if (!Array.isArray(ranking)) throw new Error("Ranking inválido");

      ranking.forEach((item, index) => {
        if (item.nombre && item.puntaje !== undefined && item.tiempo !== undefined) {
          const fila = document.createElement("tr");
          fila.innerHTML = `
            <td>${index + 1}</td>
            <td>${item.nombre}</td>
            <td>${item.puntaje}</td>
            <td>${item.correctas ?? '-'}</td>
            <td>${item.incorrectas ?? '-'}</td>
            <td>${item.tiempo}s</td>
            <td>${item.promedioTiempo ? item.promedioTiempo + ' seg' : '-'}</td>
          `;
          rankingLista.appendChild(fila);
        }
      });
    })
    .catch(error => {
      console.error("Error al obtener el ranking:", error);
      const filaError = document.createElement("tr");
      filaError.innerHTML = `<td colspan="7">Error al cargar el ranking.</td>`;
      rankingLista.appendChild(filaError);
    });
}

function volverAlInicio() {
  // Reiniciar variables
  puntaje = 0;
  preguntasRespondidas = 0;
  respuestasCorrectas = 0;
  respuestasIncorrectas = 0;
  tiempoInicio = 0;
  respuestaCorrecta = "";
  tipoPreguntaActual = null;

  // Limpiar interfaz
  mensaje.textContent = "";
  opcionesContenedor.innerHTML = "";
  inputNombre.value = "";

  // Mostrar pantalla inicial
  resumenSec.style.display = "none";
  rankingSec.style.display = "none";
  document.getElementById("inicio-sec").style.display = "flex";
  botonComenzar.style.display = "flex";
  botonRanking.style.display = "flex";
}

botonVolver.addEventListener("click", volverAlInicio);
botonVolverInicio.addEventListener("click", volverAlInicio);
