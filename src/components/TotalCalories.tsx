import { useState } from "react";
import {
  Cell,
  Legend,
  Pie,
  PieChart,
  PieProps,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import { PieChartData } from "../App";

interface TotalCaloriesProps {
  data: PieChartData[];
}

function TotalCalories(props: TotalCaloriesProps) {
  const { data } = props;
  const [hover, setHover] = useState<string | null>(null);

  // console.log(data.reduce((total, curr) => (total += curr.value), 0));

  function handleMouseEnter(o: any) {
    console.log(o);
  }

  return (
    <div>
      <ResponsiveContainer height={500} width="100%">
        <PieChart width={400} height={400}>
          <Pie
            data={data}
            dataKey="value"
            cx="50%"
            cy="50%"
            paddingAngle={1}
            onMouseEnter={(o) => {
              handleMouseEnter(o);
            }}
            // legendType="line"
            label
          >
            {data.map((entry, i) => (
              <Cell key={`cell-${i}`} fill={hover || entry.fill} />
            ))}
          </Pie>
          <Legend
            layout="vertical"
            align="right"
            verticalAlign="middle"
            iconType="circle"
          />
          <Tooltip />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}

export { TotalCalories };
