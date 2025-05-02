//Preguntas, botones, puntaje

const api = 'https://restcountries.com/v3.1/all';

let paises = [];
let puntaje = 0;
let pregContestadas = 0;
let respCorrectas = 0;
let respIncorrectas = 0;
let inicioTiempo;
let finTiempo;

async function cargarPaises() {
    const response = await fetch(api);
    const data = await response.json();
    paises = data.filter(pais => pais.name && pais.name.common);
    // console.log(paises);
}

function obtenerPreguntas(){
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
      pregunta = `El país ${paisRandom.name.common} está representado por la siguiente bandera:<br><br><img src="${paisRandom.flags.png}" alt="Bandera" style="width: 100px;">`;
      respuestaCorrecta = paisRandom.name.common;
      opciones.add(respuestaCorrecta);
  
      while (opciones.size < 4) {
          const pais = paises[Math.floor(Math.random() * paises.length)];
          if (pais.name.common !== respuestaCorrecta) opciones.add(pais.name.common);
      }
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
    return obtenerPreguntas(); //cuando no se cumple la condicion
  }
  return {
    pregunta,
    opciones: Array.from(opciones).sort(() => Math.random() - 0.5), // Mezclar opciones
    respuestaCorrecta,
    tipoPregunta
  };
}

//mostrar pregunta
async function mostrarPregunta(){
  if (pregContestadas >= 10) {
    finDelJuego();
    return;
  }

  const pregunta = await obtenerPreguntas();
  const preguntaSec = document.getElementById("pregunta-sec");
  const opcionesSec = document.getElementById("opciones-sec");
  preguntaSec.innerHTML = pregunta.pregunta;
  opcionesSec.innerHTML = ""; // Limpiar opciones anteriores

  pregunta.opciones.forEach(opcion => {
    const boton = document.createElement("button");
    boton.textContent = opcion;
    boton.onclick = () => {
      verificarRta(opcion, pregunta.respuestaCorrecta, pregunta.tipoPregunta);
    };
    opcionesSec.appendChild(boton);
  });
  document.getElementById("siguiente-sec").style.display = "none";
}

function verificarRta(seleccion, correcta, tipoPregunta){
  pregContestadas++;
  if (seleccion === correcta){
    respCorrectas++;
    if (tipoPregunta === 0) puntaje += 3; // Capital
    if (tipoPregunta === 1) puntaje += 5; // Bandera
    if (tipoPregunta === 2) puntaje += 3; // Fronteras
    alert("¡Respuesta correcta!");
  } else{
    respIncorrectas++;
    alert(`Respuesta incorrecta. La respuesta correcta era: ${correcta}`);
  }

  document.getElementById("puntaje").textContent = puntaje;
  mostrarPregunta();
}

function finDelJuego(){
  const finTiempo = Date.now();
  const duracionSegundos = Math.round((tiempoFin - tiempoInicio) / 1000);
  const promedio = (duracionSegundos / 10).toFixed(2);
  const resultadoFinal =`
    <h2>Fin del juego</h2>
    <p>Tu puntaje final es: ${puntaje}</p>
    <p>Respuestas correctas: ${respCorrectas}</p>
    <p>Respuestas incorrectas: ${respIncorrectas}</p>
    <p>Tiempo promedio por pregunta: ${promedio} segundos`;
  document.getElementById("pregunta-sec").innerHTML = resultadoFinal;
  document.getElementById("opciones-sec").innerHTML = "";

  //envio datos de partida al servidor
  const nombreJugador = document.getElementById("nombreJugador").value || "Anonimo";
  const partida = {
    nombre : nombreJugador,
    puntaje,
    respCorrectas,
    respIncorrectas,
    duracionSegundos,
    promedio : Number(promedio)
  }

  fetch('/guardarJuego', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(partida)
  })
    .then(res => res.json())
    .then(data => console.log('Partida guardada:', data))
    .catch(err => console.error('Error al guardar la partida:', err));
}

async function iniciarJuego() {
  await cargarPaises();
  puntaje = 0;
  pregContestadas = 0;
  respCorrectas = 0;
  respIncorrectas = 0;
  inicioTiempo = Date.now();
  document.getElementById("puntaje").textContent = puntaje;
  document.getElementById("inicio-sec").style.display = "none";
  document.getElementById("juego-sec").style.display = "block";
  document.getElementById("ranking-sec").style.display = "none";
  mostrarPregunta();
}

function volver() {
  iniciarJuego();
}

