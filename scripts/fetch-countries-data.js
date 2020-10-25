const path = require('path');
const fs = require('fs');
const fetch = require("node-fetch");
const countryCodes = require("./country-codes.json");
const countryData =  require("../src/data/country-data.json");

const data = fs.readFileSync(process.cwd()+'/scripts/GDP-usd.population-density.databank.worldbank.org.csv').toString();

const rows = data.split('\n');
rows.shift() // remove title

const getNumberValue = (...strValues) => {
    for (let i=0; i<strValues.length; i++) {
        if (parseFloat(strValues[i])) return parseFloat(strValues[i]);
    }
    return null;
}

const reducer = (acc, row) => {
   const [country, gdp19, gdp18, gdp17, d18, d17] = row.split(',');

   const gdp = getNumberValue(gdp19, gdp18, gdp17);
   const density = getNumberValue(d18, d17);

   if (gdp && density && isFinite(gdp) && isFinite(density)) {
       acc[country.replace(/"/g, '').toLowerCase()] = {gdp, density}
   }
   return acc;
};

const dataByCountry = rows.reduce( reducer, {} );

//const countryData = JSON.stringify(dataByCountry);
var requestOptions = {
    method: 'GET',
    redirect: 'follow'
};

countryCodes.forEach( countryObject => {
    const countryName =  countryObject.Country.toLowerCase();
    if (dataByCountry[countryName]){
        countryObject.GDP = dataByCountry[countryName].gdp;
        countryObject.Density = dataByCountry[countryName].density;
    }
})

const foundCountries = countryCodes.filter(country => !!country.GDP);

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

const fetchedMap = countryData
    .filter(country => Array.isArray(country.covidData))
    .reduce( (acc, item) => { acc[item.Slug] = item.covidData; return acc }, {} );

async function fetchCountriesData(countries) {
    for(let i=0;i<countries.length; i++) {
        const country = countries[i];
        if (fetchedMap[country.Slug]) {
            country.covidData = fetchedMap[country.Slug];
            continue;
        }
        try {
            console.log(`fetching ${country.Slug}` );
            const countryDataCV19 = await fetch(`https://api.covid19api.com/country/${country.Slug}`, requestOptions)
            country.covidData = await countryDataCV19.json();
            await sleep(15000);
        } catch (e) {
            console.log( `fetch error for ${country.Country}` )
        }
    }
    const countryData = JSON.stringify(countries);
    fs.writeFileSync(process.cwd() + '/src/data/country-data2.json', countryData);

    console.log("Fetch Done");
}

fetchCountriesData(foundCountries); //.then( () => {console.log('Done!')}).catch((e) => {console.log(e)});
