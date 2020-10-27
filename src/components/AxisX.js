import React, {useMemo} from "react";
import * as d3 from "d3";

const AxisX = ({
                domain=[0, 100],
                range=[10, 290],
                pixelsPerTick = 50,
                name = ''
              }) => {
  const ticks = useMemo(() => {
    const xScale = d3.scaleLinear()
      .domain(domain)
      .range(range)

    const width = range[1] - range[0]
    const numberOfTicksTarget = Math.max(
      1,
      Math.floor(
        width / pixelsPerTick
      )
    )

    return xScale.ticks(numberOfTicksTarget)
      .map(value => ({
        value,
        xOffset: xScale(value)
      }))
  }, [
    domain.join("-"),
    range.join("-")
  ])

  return (
    <>
      <line x1={range[0]}
            x2={range[1]} fill="none"
            stroke="#aaa" />
      {ticks.map(({ value, xOffset }) => (
        <g
          key={value}
          transform={`translate(${xOffset}, 0)`}
        >
          <line
            y2="6"
            stroke="#aaa"
          />
          <text
            key={value}
            style={{
              fontSize: "10px",
              textAnchor: "middle",
              transform: "translateY(20px)",
              fill: "#aaa"
            }}>
            { value }
          </text>
        </g>
      ))}
      <g transform ={ `translate( ${(range[0] + range[1]) / 2}, 45 )`} >
        <text
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
export default AxisX;
