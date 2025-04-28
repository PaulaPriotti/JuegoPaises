//Preguntas, botones, puntaje

const api = 'https://restcountries.com/v3.1/all';

let paises = [];
let puntaje = 0;
let pregContestadas = 0;
let respCorrectas = 0;
let respIncorrectas = 0;

// fetch(api)
//   .then(res => res.json())
//   .then(data => {
//     console.log(data);
//     const datoPais = data.map(pais => {
//       nombre = pais.name.common;
//       capital = pais.capital ? pais.capital[0] : 'No tiene capital';
//       frontera = pais.borders ? pais.borders.join(', ') : 'No tiene fronteras'; //la consigna pide la cantidad de fronteras, pero la API no devuelve la cantidad, sino los nombres de los países que limitan
//       return {
//         nombre: nombre,
//         capital: capital,
//         frontera: frontera
//       };
//     });
//     console.log(datoPais); 
// })
//   .catch(err => {
//     console.log('Error: ' + err);
// });

async function cargarPaises() {
    const response = await fetch(api);
    const data = await response.json();
    paises = data.filter(pais => pais.name && pais.name.common);
    // console.log(paises);
}

function obtenerPreguntas(){
    const tipoPregunta = Math.floor(Math.random * 3);
    const paisesRandom = paises[Math.floor(Math.random() * paises.length)];

    let pregunta = "";
    let respuestaCorrecta = "";
    let opciones = new Set();

  //pregunta capital
    if(tipoPregunta === 0 && paisesRandom.capital && paisesRandom.capital.length > 0){
      pregunta = `¿Cuál es el país de la siguiente ciudad capital: ${paisRandom.capital[0]}?`;
      respuestaCorrecta = paisesRandom.name.common;
      opciones.add(respuestaCorrecta);

      while (opciones.size < 4) {
        const pais = paises[Math.floor(Math.random() * paises.length)];
        if (pais.name.common !== respuestaCorrecta){
          opciones.add(pais.name.common);
        }      
      }
      // Pregunta de Bandera
    } else if (tipoPregunta === 1 && paisRandom.flags && paisRandom.flags.png) {
      pregunta = `El país ${paisRandom.name.common} está representado por la siguiente bandera:<br><img src="${paisRandom.flags.png}" alt="Bandera" style="width: 100px;">`;
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
  }

}
// let puntaje = 0;

// async function proximaPregunta(){
//     const preg = await obtenerPreguntas();

//     document.getElementById("pregunta").textContent = preg.pregunta;

//     const opcionesSec = document.getElementById("opciones-sec");
//     opcionesSec.innerHTML = "";
//     preg.opciones.forEach(op => {
//       const boton = document.createElement("button");
//       boton.textContent = op;
//       boton.onclick = () => verificarRta(op, preg.respuestaCorrecta);
//       opcionesSec.appendChild(boton);

//     });
// }

function verificarRta(seleccion, correcta){
  if(seleccion == correcta){
    puntaje += 3;
    alert("¡Correcto!")
  } else {
    alert( `¡Incorrecto! La respuesta correcta es ${correcta}`);
  }

  document.getElementById("puntaje").textContent = puntaje;
}