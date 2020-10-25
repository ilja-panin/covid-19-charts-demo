import React from 'react'
import * as d3 from "d3";
import {formatValue} from "./chartsUtil";
import {CURRENT_COLOR, INLINE_CHART_MARGIN_LEFT, MAX_COLOR} from "./chartConstants";

const CHART_WIDTH = 130;
const CHART_HEIGHT = 35;

function InlineLinearChart({currentCountry, country, maxValue, measure}) {
    const data = country.covidData;

    const xScale = d3.scaleTime().range([0, CHART_WIDTH]);
    const yScale = d3.scaleLinear().rangeRound([CHART_HEIGHT, 0]);

    xScale.domain(d3.extent(data, function (d) {
        return new Date(d.Date)
    }));

    yScale.domain([0, maxValue]);
    //yScale.domain(d3.extent(data, d  => d[measure]));

    const line = d3.line()
        // .curve(d3.curveNatural)
        .x(function (d) {
            return xScale(new Date(d.Date));
        })
        .y(function (d) {
            return yScale(d[measure]);
        });

    const [min, max] = d3.extent(data, d => d[measure]);
    const current = data[data.length - 1][measure];
    const currentY = yScale(current);
    const maxPoint = data.find(d => d[measure] === max);

    const maxY = yScale(max);
    const maxX = xScale(new Date(maxPoint.Date));


    return (
        <div style={{display: "flex", width: 180, height: 40}}>
            <svg style={{width: 180, height: 50}}>
                <g transform={`translate(${INLINE_CHART_MARGIN_LEFT},5)`}>
                    <g>
                        <path d={line(data)} style={{fill: 'none', stroke: '#777777', strokeWidth: 1}}/>
                        <circle cx="130" cy={currentY} r="4" fill={CURRENT_COLOR} fillOpacity={0.8}/>
                        {(maxY > -4)
                            ? (<circle cx={maxX} cy={maxY} r="3" fill={MAX_COLOR} fillOpacity={0.8}/>)
                            : (<g transform={`translate(${maxX}, -3)`}>
                                <line x1="0"
                                      y1="-10"
                                      x2="0"
                                      y2="40"
                                      strokeDasharray="4"
                                      style={{stroke: MAX_COLOR, strokeWidth: 1}}/>

                            </g>)
                        }
                    </g>
                    <g transform="translate(135,2)">
                        <text textAnchor="end" style={{fontSize: 10, fontFamily: 'Courier', fill: CURRENT_COLOR}} y={25}
                              x="40">{formatValue(current)}</text>
                        <text textAnchor="end" style={{fontSize: 10, fontFamily: 'Courier', fill: MAX_COLOR}} y="15"
                              x="40">{formatValue(max)}</text>
                    </g>
                </g>
            </svg>
        </div>
    );
}

export default InlineLinearChart;
