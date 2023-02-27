import React, { useState } from "react";
import "./App.css";
import { ScatterPlot } from "./components/ScatterPlot";
import { TotalCalories } from "./components/TotalCalories";
import {
  cheesecakeMenu,
  isItemArr,
  Item,
  ItemInfo,
  Menu,
  SubCategory,
} from "./data/cheesecakeMenu";

export interface PieChartData {
  id: string;
  value: number;
  color: string;
  type: ViewValues;
  numItems: number;
  children?: { [key: string]: { value: number; numItems: number } };
}

export interface ScatterPlotData {
  id: string;
  data: { x: number; y: number }[];
  color: string;
}

function formatScatterPlot(data: Menu): ScatterPlotData[] {
  return Object.keys(data.menu).map((category, i) => {
    if (isItemArr(data.menu[category])) {
      const categoryData: { x: number; y: number }[] = (
        data.menu[category] as Item[]
      ).reduce((total, curr) => {
        const price = Object.values(curr)[0].price;
        const calories = Object.values(curr)[0].calories;
        total.push({ x: price, y: calories });
        return total;
        // No clue why I had to assert the type of the array.
        // The array kept saying --> type: never[]
      }, [] as { x: number; y: number }[]);

      return { id: category, data: categoryData, color: colors[i] };
    }

    const categoryData = Object.entries(
      (data.menu[category] as SubCategory).subcategories
    ).reduce((total, curr, i) => {
      const totalValue = curr[1].reduce((total, curr) => {
        const price = Object.values(curr)[0].price;
        const calories = Object.values(curr)[0].calories;
        total.push({ x: price, y: calories });
        return total;
        // No clue why I had to assert the type of the array.
        // The array kept saying --> type: never[]
      }, [] as { x: number; y: number }[]);

      total.push(...totalValue);

      return total;
    }, [] as { x: number; y: number }[]);

    return { id: category, data: categoryData, color: colors[i] };
  });
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

export type ViewValues = "price" | "calories";

function computeTotal(data: Menu, field: ViewValues) {
  return Object.keys(data.menu).map((category, i) => {
    if (isItemArr(data.menu[category])) {
      const total: number = (data.menu[category] as Item[]).reduce(
        (total, curr) => (total += Object.values(curr)[0][field]),
        0
      );

      const numItems: number = (data.menu[category] as Item[]).length;

      return {
        id: category,
        value: field === "calories" ? total : parseFloat(total.toFixed(2)),
        color: colors[i],
        type: field,
        numItems,
      };
    } else {
      const children: { [key: string]: { value: number; numItems: number } } =
        Object.entries(
          (data.menu[category] as SubCategory).subcategories
        ).reduce((total, curr, i) => {
          const totalValue = curr[1].reduce(
            (total, curr) => (total += Object.values(curr)[0][field]),
            0
          );

          const child: { [key: string]: number; numItems: number } = {
            value: totalValue,
            numItems: curr[1].length,
          };

          return { ...total, [curr[0]]: child };
        }, {});

      const total = Object.values(children).reduce(
        (total, curr) => (total += curr.value),
        0
      );

      const numItems: number = Object.values(children).reduce(
        (total, curr) => (total += curr.numItems),
        0
      );

      return {
        id: category,
        value: field === "calories" ? total : parseFloat(total.toFixed(2)),
        color: colors[i],
        children,
        numItems,
        type: field,
      };
    }
  });
}

function App() {
  const [value, setValue] = useState<ViewValues>("price");
  return (
    <div className="App">
      {/* <select
        name="view-by"
        id="view-by"
        onChange={(e) => {
          setValue(e.target.value as ViewValues);
        }}
      >
        <option value="price">Price</option>
        <option value="calories">Calories</option>
      </select>
      <div className="chart-container">
        <TotalCalories
          data={computeTotal(cheesecakeMenu, value)}
          title={`Total ${value[0].toUpperCase() + value.slice(1)}`}
        />
      </div> */}

      <div className="chart-container">
        <ScatterPlot data={formatScatterPlot(cheesecakeMenu)} />
      </div>
    </div>
  );
}

export default App;
