import React from "react";
import "./App.css";
import { TotalCalories } from "./components/TotalCalories";
import { TotalCost } from "./components/TotalCost";
import {
  cheesecakeMenu,
  isItemArr,
  Item,
  Menu,
  SubCategory,
} from "./data/cheesecakeMenu";

export interface PieChartData {
  id: string;
  value: number;
  color: string;
  children?: { [key: string]: number };
}

const colors: string[] = [
  "#c4d6a4",
  "#840b55",
  "#fdaa63",
  "#c5cfda",
  "#ce0058",
  "#623b2a",
  "#b58150",
  "#5b3427",
  "#d3bc8d",
  "#ddcba4",
  "#b58150",
  "#c4d6a4",
  "#840b55",
  "#fdaa63",
  "#c5cfda",
  "#ce0058",
];

function computeTotal(data: Menu, field: "price" | "calories") {
  return Object.keys(data.menu).map((category, i) => {
    if (isItemArr(data.menu[category])) {
      const total: number = (data.menu[category] as Item[]).reduce(
        (total, curr) => (total += Object.values(curr)[0][field]),
        0
      );

      return {
        id: category,
        value: field === "calories" ? total : parseFloat(total.toFixed(2)),
        color: colors[i],
      };
    } else {
      const children: { [key: string]: number } = Object.entries(
        (data.menu[category] as SubCategory).subcategories
      ).reduce((total, curr, i) => {
        console.log(curr[0]);
        const totalValue = curr[1].reduce(
          (total, curr) => (total += Object.values(curr)[0][field]),
          0
        );
        return { ...total, [curr[0]]: totalValue };
      }, {});

      const total = Object.values(children).reduce(
        (total, curr) => (total += curr),
        0
      );

      return {
        id: category,
        value: field === "calories" ? total : parseFloat(total.toFixed(2)),
        color: colors[i],
        children,
      };
    }
  });
}

function App() {
  return (
    <div className="App">
      <div className="chart-container">
        <TotalCalories
          data={computeTotal(cheesecakeMenu, "calories")}
          title="Total Calories"
        />
      </div>

      {/* <TotalCost data={computeTotal(cheesecakeMenu, "price")} /> */}
    </div>
  );
}

export default App;
