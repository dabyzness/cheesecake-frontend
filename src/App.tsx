import { Button, InputLabel, MenuItem, Select } from "@mui/material";
import React, { useState } from "react";
import "./App.css";
import { ScatterPlot } from "./components/ScatterPlot";
import { TopThree } from "./components/TopThree";
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
  data: { x: number; y: number; id: string }[];
  color: string;
}

function formatScatterPlot(data: Menu): ScatterPlotData[] {
  return Object.keys(data.menu).map((category, i) => {
    if (isItemArr(data.menu[category])) {
      const categoryData: { x: number; y: number; id: string }[] = (
        data.menu[category] as Item[]
      ).reduce((total, curr) => {
        const price = Object.values(curr)[0].price;
        const calories = Object.values(curr)[0].calories;
        total.push({ x: price, y: calories, id: Object.keys(curr)[0] });
        return total;
        // No clue why I had to assert the type of the array.
        // The array kept saying --> type: never[]
      }, [] as { x: number; y: number; id: string }[]);

      return { id: category, data: categoryData, color: colors[i] };
    }

    const categoryData = Object.entries(
      (data.menu[category] as SubCategory).subcategories
    ).reduce((total, curr, i) => {
      const totalValue = curr[1].reduce((total, curr) => {
        const price = Object.values(curr)[0].price;
        const calories = Object.values(curr)[0].calories;
        total.push({ x: price, y: calories, id: Object.keys(curr)[0] });
        return total;
        // No clue why I had to assert the type of the array.
        // The array kept saying --> type: never[]
      }, [] as { x: number; y: number; id: string }[]);

      total.push(...totalValue);

      return total;
    }, [] as { x: number; y: number; id: string }[]);

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
  const [scatter, setScatter] = useState<boolean>(false);
  return (
    <div className="App">
      <div className="app-heading">
        <h1>The Cheesecake FACTory</h1>
      </div>
      <div className="app-body">
        <div className="chart-container">
          <div className="row">
            <TotalCalories
              data={computeTotal(cheesecakeMenu, "price")}
              title={`Total Cost of Menu`}
            />
            <TotalCalories
              data={computeTotal(cheesecakeMenu, "calories")}
              title={`Total Calories of Menu`}
            />
          </div>
          <div className="row">
            <ScatterPlot data={formatScatterPlot(cheesecakeMenu)} />
          </div>
          <div className="row">
            <TopThree data={formatScatterPlot(cheesecakeMenu)} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
