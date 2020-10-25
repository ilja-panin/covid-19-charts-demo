import React, {Fragment} from "react";
import * as d3 from "d3";
import moment from "moment";
import {INLINE_CHART_MARGIN_LEFT} from "./chartConstants";

const DATE_TICKS = [
    new Date("2019-09-01T00:00:00Z"),
    new Date("2020-01-01T00:00:00Z"),
    new Date("2020-03-01T00:00:00Z"),
    new Date("2020-06-01T00:00:00Z"),
    new Date("2020-09-01T00:00:00Z"),
    new Date("2021-01-01T00:00:00Z"),
]

function AxisColumn({dataRange, xScale, xShift = 0}) {
    return (<g transform={`translate(${xShift}, 0)`}>
        {dataRange.map(
            date => {
                return <Fragment key={date}>
                    <text style={{fontSize: 10, fontFamily: 'Courier', fill: '#555555'}}
                          y={15}
                          x={xScale(date) + 5}
                    >
                        {moment(date).format("MMM")}
                    </text>
                    <text style={{fontSize: 9, fontFamily: 'Courier', fill: '#555555'}}
                          y={25}
                          x={xScale(date) + 5}
                    >
                        {moment(date).format("'YY")}
                    </text>
                    <line x1={xScale(date)}
                          y1="1"
                          x2={xScale(date)}
                          y2="1500"
                          style={{stroke: '#dddddd', strokeWidth: 1}}/>
                </Fragment>
            }
        )}

    </g>)
}

export default function DateGlobalAxises({columns, data, style}) {

    const firstLine = data[0].covidData;
    const xScale = d3.scaleTime().range([0, 130]);
    const [min, max] = d3.extent(firstLine, function (d) {
        return new Date(d.Date);
    })
    xScale.domain([min, max]);

    const dataRange = DATE_TICKS.filter(date => {
        return date.getTime() > min.getTime() && date.getTime() < max.getTime();
    })

    const cols = Array.from(Array(columns).keys());

    return (<svg style={{position: 'relative', height: "100%", width: columns * 180, top: 0, bottom: 0}}>
        <g>{
            cols.map(index => <AxisColumn key={index} dataRange={dataRange} xScale={xScale}
                                          xShift={180 * index + INLINE_CHART_MARGIN_LEFT}/>)
        }
        </g>
    </svg>);
}
