import React from 'react'
import InlineLinearChart from "./InlineLinearChart";
import DateGlobalAxises from "./DateGlobalAxises";
import {formatValue} from "./chartsUtil";

function CountryRow({selectedCountry, country, maxValues, setSelectedCountry}) {
    const population = (country.population/1000).toLocaleString('en-US', {maximumFractionDigits:2})
    const className = selectedCountry === country.Country ? 'country-list-row country-list-row-selected' : 'country-list-row';

    const onClick = () => {
        selectedCountry === country.Country ? setSelectedCountry(null) :  setSelectedCountry(country.Country);
    }

    return (<div className={className}  onClick={onClick}>
        <div className='country-cell'>
            <div>{country.Country}</div>
            <div className='country-cell-population'>{population}k</div>
        </div>
        <div>
            <InlineLinearChart country={country} maxValue={maxValues.maxNDeltaConfirmed} measure="nDeltaConfirmed"/>
        </div>
        <div>
            <InlineLinearChart country={country} maxValue={maxValues.maxNDeltaDeaths} measure="nDeltaDeaths"/>
        </div>
        <div>
            <InlineLinearChart country={country} maxValue={maxValues.maxDeath2ConfPercent} measure="death2ConfPercent"/>
        </div>
    </div>);
}

function CountryListHeader({maxValues}) {
    return (<div className='county-list-header'>
        <div style={{width: 180}}>
        </div>
        <div className='inline-chat-header'>
            Weekly confirmed cases
            <div className='inline-chat-header-details'>
                per 100k population
                <br/>( maximum {formatValue(maxValues.maxNDeltaConfirmed)} )
            </div>
        </div>
        <div className='inline-chat-header'>
            Weekly confirmed deaths
            <div className='inline-chat-header-details'>
                per 100k population
                <br/>( maximum {formatValue(maxValues.maxNDeltaDeaths)} )
            </div>
        </div>
        <div className='inline-chat-header'>
            % of lethal cases, weekly
            <div className='inline-chat-header-details'>
                ( maximum value shown {maxValues.maxDeath2ConfPercent}% )
            </div>
        </div>
    </div>);
}

function CountryList({selectedCountry, countries, maxValues, setSelectedCountry}) {
    return (
        <div className='county-list'>
            <CountryListHeader maxValues={maxValues}/>
            <div className='county-list-global-axis'>
                <DateGlobalAxises columns={3} data={countries}/>
            </div>
            <div className='county-list-content'>
                {countries.map(countryData => <CountryRow key={countryData.Slug}
                                                          selectedCountry = {selectedCountry}
                                                          setSelectedCountry={setSelectedCountry}
                                                          maxValues={maxValues}
                                                          country={countryData}/>)}
            </div>
        </div>
    );
}

export default CountryList;
