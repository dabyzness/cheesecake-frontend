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
  name: string;
  value: number;
  fill: string;
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
        name: category,
        value: field === "calories" ? total : parseFloat(total.toFixed(2)),
        fill: colors[i],
      };
    } else {
      const total: number = Object.values(
        (data.menu[category] as SubCategory).subcategories
      ).reduce(
        (total, curr) =>
          (total += curr.reduce(
            (total, curr) => (total += Object.values(curr)[0][field]),
            0
          )),
        0
      );

      return {
        name: category,
        value: field === "calories" ? total : parseFloat(total.toFixed(2)),
        fill: colors[i],
      };
    }
  });
}

function App() {
  return (
    <div className="App">
      <TotalCalories data={computeTotal(cheesecakeMenu, "calories")} />
      {/* <TotalCost data={computeTotal(cheesecakeMenu, "price")} /> */}
    </div>
  );
}

export default App;
