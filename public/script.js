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
  const mensajeSec = document.getElementById("mensaje-sec");
  mensajeSec.innerHTML = "";
  preguntaSec.innerHTML = pregunta.pregunta;
  opcionesSec.innerHTML = "";

  pregunta.opciones.forEach(opcion => {
    const boton = document.createElement("button");
    boton.textContent = opcion;
    boton.onclick = () => {
      verificarRta(opcion, pregunta.respuestaCorrecta, mensajeSec, boton);
      boton.disabled = true;
    };
    opcionesSec.appendChild(boton);
  });
}

function verificarRta(seleccion, correcta, mensaje, boton){
  pregContestadas++;
  if (seleccion === correcta){
    respCorrectas++;
    mensaje.innerHTML = `¡Respuesta correcta!`;
  } else {
    respIncorrectas++;
    mensaje.innerHTML = `¡Respuesta incorrecta! La respuesta correcta es ${correcta}`;
  }

  document.getElementById("puntaje").textContent = puntaje;
  boton.disabled = true;
  setTimeout(mostrarPregunta, 1000);
}

function finDelJuego(){
  const finTiempo = Date.now();
  const duracionTotal = (finTiempo - inicioTiempo) / 1000; // en segundos
  const promedio = (duracionTotal / pregContestadas).toFixed(2)
  const resultadoFinal =`
    <h2>Fin del juego</h2>
    <p>Tu puntaje final es: ${puntaje}</p>
    <p>Respuestas correctas: ${respCorrectas}</p>
    <p>Respuestas incorrectas: ${respIncorrectas}</p>
    <p>Tiempo promedio por pregunta: ${promedio} segundos
    <p>Duración total: ${duracionTotal.toFixed(2)} segundos</p>`;
  document.getElementById("pregunta-sec").innerHTML = resultadoFinal;
  document.getElementById("opciones-sec").innerHTML = "";

  //envio datos de partida al servidor
  const nombreJugador = document.getElementById("nombreJugador").value || "Anonimo";
  const partida = {
    nombre : nombreJugador,
    puntaje,
    respCorrectas,
    respIncorrectas,
    duracionSegundos: duracionTotal,
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

function volver() {
  iniciarJuego();
}

