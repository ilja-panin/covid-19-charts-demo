import React from "react";
import * as d3 from "d3";

const AxisY = ({
                domain=[0, 100],
                range=[10, 290],
                pixelsPerTick = 50,
                name = ''
              }) => {

    const yScale = d3.scaleLinear()
      .domain(domain)
      .range(range)


    const height = range[1] - range[0];
    const numberOfTicksTarget = Math.max(
      1,
      Math.abs(Math.floor(
        height / pixelsPerTick
      ))
    )

    const ticks = yScale.ticks(numberOfTicksTarget)
      .map(value => ({
        value,
        yOffset: yScale(value)
      }))

  return (
    <>
      <line x1 = "0"
            y1={range[0]}
            y2={range[1]} fill="none"
            stroke="#aaa" />
      {ticks.map(({ value, yOffset }) => (
        <g
          key={value}
          transform={`translate(0, ${yOffset} )`}
        >
          <line
            x2="-6"
            stroke="#aaa"
          />
          <text
            key={value}
            x = "-10"
            y = "4"
            style={{
              fontSize: "10px",
              textAnchor: "end",
              fill: "#aaa"
            }}>
            { value }
          </text>
        </g>
      ))}
      <g transform ={ `translate( -50, ${(range[0] + range[1]) / 2} )`} >
        <text
          transform="rotate(-90)"
          style={{
            fontSize: "12px",
            textAnchor: "middle",
            fill: "#777"
          }}>
          {name}
        </text>
      </g>
    </>
  )
}
export default AxisY;
