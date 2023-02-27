import {
  ResponsiveScatterPlot,
  ScatterPlotLayerProps,
  ScatterPlotNodeProps,
} from "@nivo/scatterplot";
import { useCallback, useEffect, useState } from "react";
import { createSemanticDiagnosticsBuilderProgram } from "typescript";
import { ScatterPlotData } from "../App";
import { animated } from "@react-spring/web";
import { useTooltip } from "@nivo/tooltip";
import { createElement } from "react";

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

  return (
    <div className="pie-chart">
      <ResponsiveScatterPlot
        data={data}
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
        legends={[
          {
            anchor: "bottom-right",
            direction: "column",
            justify: false,
            translateX: 130,
            translateY: 0,
            itemWidth: 100,
            itemHeight: 12,
            itemsSpacing: 5,
            itemDirection: "left-to-right",
            symbolSize: 12,
            symbolShape: "circle",
            effects: [
              {
                on: "hover",
                style: {
                  itemOpacity: 1,
                },
              },
            ],
            onClick: handleClick,
          },
        ]}
      />
    </div>
  );
}

export { ScatterPlot };
