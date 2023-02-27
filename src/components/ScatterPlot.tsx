import { ResponsiveScatterPlot } from "@nivo/scatterplot";
import { useState, MouseEvent } from "react";

import { ScatterPlotData } from "../App";
import { animated } from "@react-spring/web";

const ScatterTooltip = ({ node }: any) => {
  return (
    <div
      className="tooltip-container"
      style={{ backgroundColor: "#222222", display: "flex" }}
    >
      <h4 className="tooltip-title" style={{ color: node.color }}>
        {node.data.id}
      </h4>
      <div className="tooltip-values">
        <div className="tooltip-columns">
          <p className="tooltip-row" style={{ color: node.color }}>
            Category
          </p>
          <p className="tooltip-row" style={{ color: node.color }}>
            Price
          </p>
          <p className="tooltip-row" style={{ color: node.color }}>
            Calories
          </p>
        </div>
        <div className="tooltip-columns" style={{ textAlign: "right" }}>
          <p className="tooltip-row" style={{ color: node.color }}>
            {node.serieId}
          </p>
          <p className="tooltip-row" style={{ color: node.color }}>
            ${node.data.x}
          </p>
          <p className="tooltip-row" style={{ color: node.color }}>
            {node.data.y}
          </p>
        </div>
      </div>
    </div>
  );
};

interface ScatterPlotProps {
  data: ScatterPlotData[];
}

function ScatterPlot(props: ScatterPlotProps) {
  const { data } = props;

  const [filteredData, setFilteredData] = useState<ScatterPlotData[]>(data);
  const [isClicked, setIsClicked] = useState<boolean[]>(
    new Array(data.length).fill(true)
  );

  const RenderNode = (props: any) => {
    const parentIndex = data.findIndex(
      (item) => props.node.serieId === item.id
    );

    if (!isClicked[parentIndex]) {
      return <></>;
    }

    return (
      <animated.circle
        cx={props.style.x}
        cy={props.style.y}
        r={props.style.size.to((size: number) => size / 2)}
        fill={props.style.color}
        style={{ mixBlendMode: props.blendMode }}
        onMouseEnter={(event) => props.onMouseEnter?.(props.node, event)}
        onMouseMove={(event) => props.onMouseMove?.(props.node, event)}
        onMouseLeave={(event) => props.onMouseLeave?.(props.node, event)}
        onClick={(event) => props.onClick?.(props.node, event)}
      />
    );
  };

  const handleClick = (datum: any) => {
    const parentIndex = data.findIndex((item) => datum.id === item.id);

    setIsClicked(
      isClicked.map((item, i) => (i === parentIndex ? !item : item))
    );
  };

  const handleInputClick = (e: MouseEvent) => {
    const index = parseInt(e.currentTarget.id.split("-")[0]);
    setIsClicked(isClicked.map((item, i) => (i === index ? !item : item)));
  };

  return (
    <div className="scatter-chart">
      <ResponsiveScatterPlot
        data={data}
        animate={true}
        motionConfig="gentle"
        margin={{ top: 60, right: 140, bottom: 70, left: 90 }}
        colors={(node) => {
          return data.find((item) => item.id === node.serieId)?.color as string;
        }}
        useMesh={false}
        xScale={{ type: "linear", min: 5, max: 40 }}
        yScale={{ type: "linear", min: 0, max: 2800 }}
        layers={[
          "grid",
          "axes",
          "nodes",
          "markers",
          "mesh",
          "legends",
          "annotations",
        ]}
        nodeComponent={RenderNode}
        tooltip={ScatterTooltip}
        legends={[
          {
            anchor: "bottom-right",
            direction: "column",
            justify: false,
            translateX: 130,
            translateY: 0,
            itemWidth: 100,
            itemHeight: 12,
            itemsSpacing: 12,
            itemDirection: "left-to-right",
            symbolSize: 12,
            symbolShape: "circle",
            effects: [
              {
                on: "hover",
                style: {
                  itemOpacity: 6,
                  symbolSize: 16,
                  symbolBorderWidth: 10,
                },
              },
            ],
            onClick: handleClick,
          },
        ]}
      />
      <div className="scatter-checkbox">
        {data.map((item, i) => (
          <input
            type="checkbox"
            value={item.id}
            checked={isClicked[i]}
            id={`${i}-category`}
            style={{ margin: "0", padding: "0" }}
            onClick={handleInputClick}
          />
        ))}
      </div>
    </div>
  );
}

export { ScatterPlot };
