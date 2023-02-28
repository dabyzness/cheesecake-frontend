import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import { ChangeEvent, useEffect, useState } from "react";
import { ScatterPlotData } from "../App";

interface TopThreeProps {
  data: ScatterPlotData[];
}

interface FormData {
  direction: number;
  property: string;
  category: string;
}

function TopThree(props: TopThreeProps) {
  const { data } = props;

  const allItems = Object.entries(data)
    .map((item) => {
      const data = item[1].data.map((curr) => ({
        ...curr,
        category: item[1].id,
      }));

      return [...data];
    })
    .flat();

  const [formData, setFormData] = useState<FormData>({
    direction: 1,
    property: "price",
    category: "all",
  });
  const [sorted, setSorted] = useState<
    { x: number; y: number; id: string; category: string }[] | null
  >(null);

  function sortData(
    allItems: {
      category: string;
      x: number;
      y: number;
      id: string;
    }[],
    direction: number,
    category: string,
    value: string
  ) {
    if (category === "gluten-free") {
      const items = allItems.filter((item) => item.id.includes("**"));
      const sorted = items.sort((a, b) =>
        a.id > b.id ? 1 * direction : -1 * direction
      );

      return sorted.filter(
        (item, i) =>
          sorted.findIndex((duplicate) => duplicate.id === item.id) === i
      );
    }

    const items =
      category === "all"
        ? allItems
        : allItems.filter((item) => item.category === category);

    if (value === "cpd") {
      return items
        .sort((a, b) =>
          a.y / a.x < b.y / b.x ? 1 * direction : -1 * direction
        )
        .slice(0, 5);
    }

    const property = value === "calories" ? "y" : "x";

    const sorted = items.sort((a, b) =>
      a[property] < b[property] ? 1 * direction : -1 * direction
    );

    return sorted.slice(0, 5);
  }

  const handleChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  useEffect(() => {
    setSorted(
      sortData(
        allItems,
        formData.direction,
        formData.category,
        formData.property
      )
    );
  }, [formData]);

  return (
    <div>
      <form action="">
        <label htmlFor="category">Category: </label>
        <select
          name="category"
          id="category"
          value={formData.category}
          onChange={handleChange}
        >
          <option value="all">All Items</option>
          <option value="gluten-free">Gluten Free</option>
          {Object.values(data).map((item) => (
            <option key={item.id} value={item.id}>
              {item.id}
            </option>
          ))}
        </select>

        <label htmlFor="direction">Direction: </label>
        <select
          name="direction"
          id="direction"
          value={formData.direction}
          onChange={handleChange}
          disabled={formData.category === "gluten-free"}
        >
          <option value="1">Highest</option>
          <option value="-1">Lowest</option>
        </select>

        <label htmlFor="property">Property: </label>
        <select
          name="property"
          id="property"
          value={formData.property}
          disabled={formData.category === "gluten-free"}
          onChange={handleChange}
        >
          <option value="price">Price</option>
          <option value="calories">Calories</option>
          <option value="cpd">Calories / $</option>
        </select>
      </form>
      <div>{formData.category === "all" ? "All Items" : formData.category}</div>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              {formData.category === "gluten-free" ? (
                <>
                  <TableCell align="right">Price</TableCell>
                  <TableCell align="right">Calories</TableCell>
                </>
              ) : formData.property === "cpd" ? (
                <TableCell align="right">Calories Per Dollar (CPD)</TableCell>
              ) : (
                <TableCell align="right">
                  {formData.property[0].toUpperCase() +
                    formData.property.slice(1)}
                </TableCell>
              )}
            </TableRow>
          </TableHead>
          <TableBody>
            {sorted &&
              sorted.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>{item.id}</TableCell>
                  {formData.category === "gluten-free" ? (
                    <>
                      <TableCell align="right">
                        {`$${item.x.toFixed(2)}`}
                      </TableCell>
                      <TableCell align="right">{item.y}</TableCell>
                    </>
                  ) : formData.property === "cpd" ? (
                    <TableCell align="right">
                      {(item.y / item.x).toFixed(2)}
                    </TableCell>
                  ) : (
                    <TableCell align="right">
                      {formData.property === "price"
                        ? `$${item.x.toFixed(2)}`
                        : item.y}
                    </TableCell>
                  )}
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
}

export { TopThree };
