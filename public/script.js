const api = 'https://restcountries.com/v3.1/all';

fetch(api)
  .then(res => res.json())
  .then(data => {
    console.log(data); // Esto ahora sí te va a dar un array de países
    const datoPais = data.map(pais => {
      return {
        nombre: pais.name.common,
        capital: pais.capital ? pais.capital[0] : 'No tiene capital',
        bandera: pais.flags.png
      };
    });
    console.log(datoPais); // Esto ahora sí te va a dar un array de países
})
  .catch(err => {
    console.log('Error: ' + err);
});
