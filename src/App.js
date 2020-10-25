import React, {useState} from "react";

import './App.css';
import countryData from "./data/filtered-country-data.json"
import CountryList from "./components/CountryList";
import {addMaxMetadataToCountries, getMaxValues} from "./components/chartsUtil";

const sorted = countryData
    .filter( c => c.Country !== "United Kingdom" && c.Country !== "Monaco" )
    .sort(( b, a) =>{
        if (a.Country > b.Country) {
            return -1;
        }
        if (b.Country > a.Country) {
            return 1;
        }
        return 0;
})

const preparedCountryData = addMaxMetadataToCountries(sorted);
const chartMaxMetadata = getMaxValues(preparedCountryData);

function App() {
    const [selectedCountry, setSelectedCountry] = useState(null);
    return (
        <div className="App">
            <CountryList
                countries={preparedCountryData}
                maxValues={chartMaxMetadata}
                setSelectedCountry={setSelectedCountry}
                selectedCountry={selectedCountry}
            />
        </div>
    );
}

export default App;
