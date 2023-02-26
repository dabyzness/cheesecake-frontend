import { Legend, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import { PieChartData } from "../App";

interface TotalCostProps {
  data: PieChartData[];
}

function TotalCost(props: TotalCostProps) {
  const { data } = props;

  console.log(data.reduce((total, curr) => (total += curr.value), 0));

  return (
    <div>
      <ResponsiveContainer height={500} width="100%">
        <PieChart width={400} height={400}>
          <Pie data={data} dataKey="value" cx="50%" cy="50%" label />
          <Legend />
          <Tooltip />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}

export { TotalCost };
