const api = 'https://restcountries.com';

fetch(api)
.then(res => res.json())
.then(data => {
    console.log(data);
})
.catch(err => {
    console.log('Error: ' + err);
});
// const api = 'https://restcountries.com/v3.1/all';