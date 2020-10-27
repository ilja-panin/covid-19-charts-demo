import React from "react";
import BubbleChart from "./BubbleChart";
import {BUBBLE_CHART_HEIGHT, BUBBLE_CHART_WIDTH} from "./chartConstants";

const chardContainerStyle = {
  minHeight: BUBBLE_CHART_HEIGHT,
  height: BUBBLE_CHART_HEIGHT,
  width: BUBBLE_CHART_WIDTH,
  minWidth: BUBBLE_CHART_WIDTH,
  margin: 5,
}

export default function Charts(props) {
  return (
    <div className='charts-column'>
      <div className='charts-row'>
        <div style={chardContainerStyle}>
          <BubbleChart
            {...props}
            measureX="Deaths"
            axisXName="Total deaths per 100k"
            measureY="GDP"
            axisYName="GDP"
          />
        </div>
        <div style={chardContainerStyle}>
          <BubbleChart
            {...props}
            measureY="GDP"
            axisYName="GDP"
            measureX="Confirmed"
            axisXName="Total confirmed cases per 100k"
          />
        </div>
      </div>
      <div className='charts-row'>
        <div style={chardContainerStyle}>
          <BubbleChart
            {...props}
            measureY="Density"
            axisYName="Population density, km²"
            measureX="Deaths"
            axisXName="Total deaths per 100k"
          />
        </div>
        <div style={chardContainerStyle}>
          <BubbleChart
            {...props}
            measureY="Density"
            axisYName="Population density, km²"
            measureX="Confirmed"
            axisXName="Total confirmed cases per 100k"
          />
        </div>
      </div>
    </div>
  );
}
