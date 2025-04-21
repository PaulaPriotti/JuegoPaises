//Preguntas, botones, puntaje

const api = 'https://restcountries.com/v3.1/all';

fetch(api)
  .then(res => res.json())
  .then(data => {
    console.log(data);
    const datoPais = data.map(pais => {
      nombre = pais.name.common;
      capital = pais.capital ? pais.capital[0] : 'No tiene capital';
      frontera = pais.borders ? pais.borders.join(', ') : 'No tiene fronteras'; //la consigna pide la cantidad de fronteras, pero la API no devuelve la cantidad, sino los nombres de los países que limitan
      return {
        nombre: nombre,
        capital: capital,
        frontera: frontera
      };
    });
    console.log(datoPais); 
})
  .catch(err => {
    console.log('Error: ' + err);
});

//se espera respuesta de API
async function obtenerPreguntas() {
    const response = await fetch(api);
    const data = await response.json();

    //Hay paises sin capital
    const paisesConCapital = data.filter(p => p.capital && p.capital.length > 0);

    const rtaCorrecta = paisesConCapital[Math.floor(Math.random() * paisesConCapital.length)];

    const capital = rtaCorrecta.capital[0];
    const paisCorrecto = rtaCorrecta.name.common;

    const opciones = new Set();
    //Agrego pais correcto
    opciones.add(paisCorrecto);
    //Deben haber 4 opciones
    while (opciones.size < 4) {
        const paisRandom = paisesConCapital[Math.floor(Math.random() * paisesConCapital.length)].name.common;
        opciones.add(paisRandom);
    }

    return {
        pregunta: `¿Cuál es la capital de ${capital}?`,
        opciones: Array.from(opciones),
        respuestaCorrecta: paisCorrecto
    }
}
