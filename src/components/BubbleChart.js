import React from "react";
import * as d3 from "d3";
import {formatValue} from "./chartsUtil";
import AxisX from "./AxisX";
import AxisY from "./AxisY";
import {BUBBLE_CHART_HEIGHT, BUBBLE_CHART_WIDTH} from "./chartConstants";

const CHART_WIDTH = BUBBLE_CHART_WIDTH - 130;
const CHART_HEIGHT = BUBBLE_CHART_HEIGHT - 60;

function CountryPoint({x, y, onClick, id}) {
  return <circle className="data-point" cx={x} cy={y} r="3" fill="#a65628" fillOpacity={0.3} onClick={onClick} id={id}/>
}

function SelectedCountryPoint({x, y, onClick, id}) {
  return <circle className="data-point" cx={x} cy={y} r="4" fill="#0ff" fillOpacity={0.8} onClick={onClick} id={id}/>
}

function CountryOutRangePoint({x, y, direction = '', ...props}) {

 const angle = direction === "SE" ? 45 : direction === "E" ? 90 : 0
 const dx = direction.indexOf('E') > -1 ? 8 : 0;
 const dy = direction.indexOf('S') > -1 ? 8 : 0;

 return (<g transform={`translate(${x+dx},${y-dy})`} {...props} className="data-point">
    <path transform={`rotate(${angle})`} d="M 0,-3 4,8 0,6 -4,8 z"  fill="#ff0000" fillOpacity={0.6}/>
 </g>)
}

function SelectedCountryOutRangePoint({x, y, direction='', ...props}) {

  const angle = direction === "SE" ? 45 : direction === "E" ? 90 : 0
  const dx = direction.indexOf('E') > -1 ? 8 : 0;
  const dy = direction.indexOf('S') > -1 ? 8 : 0;

  return (<g transform={`translate(${x+dx},${y-dy})`} {...props} className="data-point">
    <path transform={`rotate(${angle})`} d="M 0,-4 4.5,9 0,7 -4.5,9 z"  fill="#0ff" fillOpacity={0.8}/>
  </g>)
}

function CountryDetails(props) {
  const {x, y, country, total, value} = props
  return <>
    <g transform={`translate(${x + 1},${y + 1})`}>
      <text y="8" textAnchor="end"
            style={{fontSize: 11, fontFamily: 'Courier', fill: `rgb(255, 255, 255)`}}>{country}</text>
      <text y="20" textAnchor="end" style={{fontSize: 11, fontFamily: 'Courier', fill: `rgb(255, 255, 255)`}}>
        {formatValue(total)}
      </text>
      <text y="32" textAnchor="end" style={{fontSize: 11, fontFamily: 'Courier', fill: `rgb(255, 255, 255)`}}>
        {formatValue(value)}
      </text>
    </g>
    <g transform={`translate(${x},${y})`}>
      <text y="8" textAnchor="end"
            style={{fontSize: 11, fontFamily: 'Courier', fill: `rgb(66, 66, 66)`}}>{country}</text>
      <text y="20" textAnchor="end" style={{fontSize: 11, fontFamily: 'Courier', fill: `rgb(66, 66, 66)`}}>
        {formatValue(total)}
      </text>
      <text y="32" textAnchor="end" style={{fontSize: 11, fontFamily: 'Courier', fill: `rgb(66, 66, 66)`}}>
        {formatValue(value)}
      </text>
    </g>

  </>
}

const getOutRangeRender = ( getValue, getTotal, xmax, ymax, xScale, yScale, setSelectedCountry ) => country => {
  let direction = '';

  let yValue = getValue(country);
  if (yValue > ymax) {
    direction += "S";
    yValue = ymax;
  }

  let xValue = getTotal(country);
  if (xValue > xmax) {
    direction += "E";
    xValue = xmax;
  }

  return (
    <CountryOutRangePoint
      onClick={() => setSelectedCountry(country.Country)}
      key={country.Country}
      id={country.Country}
      x={xScale(xValue)}
      y={yScale(yValue)}
      direction={direction}
    />
  )
}

const getOutSelectedRangeRender = ( getValue, getTotal, xmax, ymax, xScale, yScale, setSelectedCountry ) => country => {
  let direction = ''
  let yValue = getValue(country);
  if (yValue > ymax) {
    direction += "S";
    yValue = ymax;
  }

  let xValue = getTotal(country);
  if (xValue > xmax) {
    direction += "E";
    xValue = xmax;
  }

  return (
    <SelectedCountryOutRangePoint
      onClick={() => setSelectedCountry(null)}
      key={country.Country}
      id={country.Country}
      x={xScale(xValue)}
      y={yScale(yValue)}
      direction={direction}
    />
  )
}

export default function BubbleChart(props) {
  const {
    selectedCountry,
    countries,
    setSelectedCountry,
    measureX,
    measureY,
    axisXName,
    axisYName,
  } = props;

  const getTotal = country => country.covidData[country.covidData.length - 1][measureX] / (country.population / 100000)
  const getValue = country => country[measureY];

  let countiesForRender = [].concat(countries);

  countiesForRender.sort((a, b) => {
    if (getTotal(a) > getTotal(b)) return 1;
    if (getTotal(b) > getTotal(a)) return -1;
    return 0;
  })

  const topTotal5 = [countiesForRender.pop(),
    countiesForRender.pop(),
    countiesForRender.pop(),
    countiesForRender.pop(),
    countiesForRender.pop()];

  countiesForRender.sort((a, b) => {
    if (getValue(a) > getValue(b)) return 1;
    if (getValue(b) > getValue(a)) return -1;
    return 0;
  })
  const topValue5 = [countiesForRender.pop(),
    countiesForRender.pop(),
    countiesForRender.pop(),
    countiesForRender.pop(),
    countiesForRender.pop()];

  const outRange = [].concat(topTotal5, topValue5)
  const data = countiesForRender;

  const yScale = d3.scaleLinear().rangeRound([CHART_HEIGHT, 0]);

  const xScale = d3.scaleTime().range([0, CHART_WIDTH]);
  let [xmin, xmax] = d3.extent(data, getTotal);
  xmax *=1.0;
  xScale.domain([xmin, xmax]);

  let [ymin, ymax] = d3.extent(data, getValue);
  ymax *=1.0;
  yScale.domain([ymin, ymax]);

  let selected = null;
  let selectedOutRange = null;

  if (selectedCountry) {
    selected = data.find(country => country.Country === selectedCountry);
    selectedOutRange = outRange.find(country => country.Country === selectedCountry);
  }

  const renderOutCountry = getOutRangeRender(getValue, getTotal, xmax, ymax, xScale, yScale, setSelectedCountry);
  const renderSelectedOutCountry = getOutSelectedRangeRender(getValue, getTotal, xmax, ymax, xScale, yScale, setSelectedCountry);

  return (
    <svg width={BUBBLE_CHART_WIDTH} height={BUBBLE_CHART_HEIGHT}>
      <g transform="translate(110, 10)">
        <g transform={`translate(0, ${CHART_HEIGHT})`}>
          <AxisX domain={[xmin, xmax]} range={[0, CHART_WIDTH]} name={axisXName}/>
        </g>
        <g transform={`translate(0, 0)`}>
          <AxisY domain={[ymin, ymax]} range={[CHART_HEIGHT, 0]} name={axisYName}/>
        </g>
        {countiesForRender.map(country => (
          <CountryPoint onClick={() => setSelectedCountry(country.Country)}
                        key={country.Country}
                        id={country.Country}
                        x={xScale(getTotal(country))}
                        y={yScale(getValue(country))}
          />
        ))}
        {selected && <>
          <SelectedCountryPoint key={selected.Country}
                                onClick={() => setSelectedCountry(null)}
                                x={xScale(getTotal(selected))}
                                y={yScale(getValue(selected))}
          />
          <CountryDetails country={selected.Country}
                          x={xScale(getTotal(selected)) - 7}
                          y={yScale(getValue(selected))}
                          total={getTotal(selected)}
                          value={getValue(selected)}/>
        </>
        }
        {/* render out rangers */}

        {outRange.map(renderOutCountry)}
        {selectedOutRange && <>
          {renderSelectedOutCountry(selectedOutRange)}
          <CountryDetails country={selectedOutRange.Country}
                          x={xScale(Math.min(getTotal(selectedOutRange), xmax)) - 7}
                          y={yScale(Math.min(getValue(selectedOutRange), ymax))}
                          total={getTotal(selectedOutRange)}
                          value={getValue(selectedOutRange)}/>
        </>
        }
      </g>
    </svg>

  );
}
