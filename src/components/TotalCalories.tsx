import { PieChartData, ViewValues } from "../App";
import { ResponsivePie } from "@nivo/pie";

// Component to display in center of Pie chart
const CenteredMetric = ({ dataWithArc, centerX, centerY }: any) => {
  let total = 0;
  dataWithArc.forEach((datum: PieChartData) => {
    total += datum.value;
  });

  return (
    <text
      x={centerX}
      y={centerY}
      textAnchor="middle"
      dominantBaseline="central"
      style={{
        fontSize: "48px",
        fontWeight: 600,
      }}
    >
      {dataWithArc[0].data?.type === "price" ? `$${total.toFixed(2)}` : total}
    </text>
  );
};

const CustomToolTip = ({ datum }: any) => {
  return (
    <div
      className="tooltip-container"
      style={{ backgroundColor: "#222222", display: "flex" }}
    >
      <h4 className="tooltip-title" style={{ color: datum.data.color }}>
        {datum.data.id}
      </h4>
      <div className="tooltip-values">
        <div className="tooltip-columns">
          {datum.data?.children && (
            <>
              {Object.keys(datum.data.children).map((child) => (
                <p className="tooltip-row" style={{ color: datum.data.color }}>
                  {child}
                </p>
              ))}
              <p
                className="tooltip-row"
                style={{
                  color: datum.data.color,
                  borderBottom: "2px solid",
                  width: "100%",
                }}
              ></p>
            </>
          )}

          <p className="tooltip-row" style={{ color: datum.data.color }}>
            Total:
          </p>
        </div>
        <div className="tooltip-columns" style={{ textAlign: "right" }}>
          {datum.data?.children && (
            <>
              {Object.values(datum.data.children).map((child) => (
                <p className="tooltip-row" style={{ color: datum.data.color }}>
                  {datum.data?.type === "price"
                    ? `$${((child as any).value as number).toFixed(2)}`
                    : `${(child as any).value} cal`}
                </p>
              ))}
              <p
                className="tooltip-row"
                style={{
                  color: datum.data.color,
                  borderBottom: "2px solid",
                  width: "100%",
                }}
              ></p>
            </>
          )}
          <p className="tooltip-row" style={{ color: datum.data.color }}>
            {datum.data?.type === "price"
              ? `$${datum.data.value.toFixed(2)}`
              : `${datum.data.value} cal`}
          </p>
        </div>
      </div>
    </div>
  );
};

interface TotalCaloriesProps {
  data: PieChartData[];
  title: string;
}

function TotalCalories(props: TotalCaloriesProps) {
  const { data, title } = props;

  return (
    <div className="pie-chart">
      <h2 className="pie-title">{title}</h2>
      <ResponsivePie
        data={data}
        innerRadius={0.6}
        margin={{ top: 40, right: 80, bottom: 80, left: 80 }}
        sortByValue={true}
        padAngle={1}
        enableArcLabels={false}
        arcLinkLabelsColor={{ from: "color" }}
        arcLinkLabelsSkipAngle={10}
        arcLinkLabelsThickness={3}
        cornerRadius={4}
        colors={{ datum: "data.color" }}
        activeOuterRadiusOffset={8}
        activeInnerRadiusOffset={2}
        motionConfig="wobbly"
        transitionMode="startAngle"
        tooltip={CustomToolTip}
        layers={[
          "arcs",
          "arcLabels",
          "arcLinkLabels",
          "legends",
          CenteredMetric,
        ]}
      />
    </div>
  );
}

export { TotalCalories };
