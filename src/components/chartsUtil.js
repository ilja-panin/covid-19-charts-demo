const reduceCountryMaxMeasures  = (acc, dataPoint ) => {
    acc.maxNDeltaConfirmed = Math.max(acc.maxNDeltaConfirmed, dataPoint.nDeltaConfirmed);
    acc.maxNDeltaDeaths = Math.max(acc.maxNDeltaDeaths, dataPoint.nDeltaDeaths);
    acc.maxDeath2ConfPercent = 25 // Math.max(acc.maxDeath2ConfPercent, dataPoint.death2ConfPercent);
    return acc;
}

export function addMaxMetadataToCountries(countryData ) {
    countryData.forEach( country => {
        const maxMeasures = country.covidData.reduce( reduceCountryMaxMeasures, {
            maxNDeltaConfirmed: 0,
            maxNDeltaDeaths: 0,
            maxDeath2ConfPercent: 0,
        })

        country.maxNDeltaConfirmed = maxMeasures.maxNDeltaConfirmed;
        country.maxNDeltaDeaths = maxMeasures.maxNDeltaDeaths;
        country.maxDeath2ConfPercent = maxMeasures.maxDeath2ConfPercent;
    });
    return countryData;
}

const reduceMaxMeasures = ( acc, dataPoint ) => {
    acc.maxNDeltaConfirmed = Math.max(acc.maxNDeltaConfirmed, dataPoint.maxNDeltaConfirmed);
    acc.maxNDeltaDeaths = Math.max(acc.maxNDeltaDeaths, dataPoint.maxNDeltaDeaths);
    acc.maxDeath2ConfPercent = Math.max(acc.maxDeath2ConfPercent, dataPoint.maxDeath2ConfPercent);
    return acc;
}
export function getMaxValues(countryData) {
    const maxValues = countryData.reduce(reduceMaxMeasures, {
        maxNDeltaConfirmed: 0,
        maxNDeltaDeaths: 0,
        maxDeath2ConfPercent: 0,
    });
    return maxValues;
}

export function formatValue(value) {
    return value.toFixed(2);
}
