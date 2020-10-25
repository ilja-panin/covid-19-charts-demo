// This code contains some "bad practice" like object mutation.
// Please don't use it as production code.

const _ = require('lodash');
const path = require('path');
const fs = require('fs');
const fetch = require("node-fetch");
const countryData = require("./../src/data/country-data.json");
const populationByCountry = require("./population.json");

const reduceStats = (mergedStats, currentRecord) => {
    mergedStats.Confirmed += currentRecord.Confirmed;
    mergedStats.Recovered += currentRecord.Recovered;
    mergedStats.Active += currentRecord.Active;
    mergedStats.Deaths += currentRecord.Deaths;
    mergedStats.Date = currentRecord.Date;
    return mergedStats;
}

const mergeProvinceData = (stats) => {
    if (!stats) return null;
    return stats.reduce(reduceStats, {
        Confirmed: 0,
        Recovered: 0,
        Active: 0,
        Deaths: 0,
    });
}

const clearCovidData = (days) => {
    const groupedByDate = _.groupBy(days, 'Date');
    const mondays = _.keys(groupedByDate).filter(item => new Date(item).getDay() === 1)
    const weekStats = mondays.map(item => {
        return mergeProvinceData(groupedByDate[item])
    });

    return weekStats;
}

const calculateVelocities = (covidData) => {
    for(let i=1; i<covidData.length; i++ ){
        const  prev = covidData[i-1];
        const item =  covidData[i];
        item.deltaConfirmed = item.Confirmed - prev.Confirmed;
        item.deltaDeaths = item.Deaths - prev.Deaths;
        item.death2ConfPercent = item.deltaDeaths / item.deltaConfirmed * 100 || 0;
    }
    covidData.shift();
    return covidData;
}

const normalizeCovidData = (covidData, population) => {
    const p100k = population / 100000;
    covidData.forEach(item => {
        item.nConfirmed = item.Confirmed / p100k;
        item.nRecovered = item.Recovered / p100k;
        item.nActive = item.Active / p100k;
        item.nDeaths = item.Deaths / p100k;
        item.nDeltaConfirmed = item.deltaConfirmed / p100k;
        item.nDeltaDeaths = item.deltaDeaths / p100k;
    })

    return covidData;
}

const clearCountryData = (country) => {
    let covidData = clearCovidData(country.covidData);
    covidData = calculateVelocities( covidData );
    covidData = normalizeCovidData(covidData, country.population);
    country.covidData = covidData;
    return country;
}

let countryWithPopulation = countryData.map(country => {
    country.population = populationByCountry[country.Country.toLowerCase()];
    return country;
})

countryWithPopulation = countryWithPopulation
    .filter(country => !!country.population)
    .filter(country => Array.isArray(country.covidData)); //filter countries with fetch error :(

let filteredData = _.take(countryWithPopulation, 200).map(clearCountryData)

filteredData = filteredData.filter( data => data.covidData.length > 0 );

const cd = JSON.stringify(filteredData, null, '  ');
fs.writeFileSync(process.cwd() + '/src/data/filtered-country-data.json', cd);
