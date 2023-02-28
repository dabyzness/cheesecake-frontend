import {
  InputLabel,
  MenuItem,
  Paper,
  Select,
  SelectChangeEvent,
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

  const handleChange = (e: SelectChangeEvent) => {
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
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <h2 className="pie-title" style={{ marginBottom: "16px" }}>
        Top Five
      </h2>
      <form
        action=""
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          columnGap: "16px",
          marginBottom: "16px",
        }}
      >
        {/* <label htmlFor="category">Category: </label> */}
        <div>
          <InputLabel id="category">Category</InputLabel>
          <Select
            name="category"
            id="category"
            value={formData.category}
            onChange={handleChange}
          >
            <MenuItem value="all">All Items</MenuItem>
            <MenuItem value="gluten-free">Gluten Free</MenuItem>
            {Object.values(data).map((item) => (
              <MenuItem key={item.id} value={item.id}>
                {item.id}
              </MenuItem>
            ))}
          </Select>
        </div>
        <div>
          <InputLabel id="direction">Direction: </InputLabel>
          <Select
            name="direction"
            id="direction"
            value={`${formData.direction}`}
            onChange={handleChange}
            disabled={formData.category === "gluten-free"}
          >
            <MenuItem value="1">Highest</MenuItem>
            <MenuItem value="-1">Lowest</MenuItem>
          </Select>
        </div>
        <div>
          <InputLabel id="property">Property: </InputLabel>
          <Select
            name="property"
            id="property"
            value={formData.property}
            disabled={formData.category === "gluten-free"}
            onChange={handleChange}
          >
            <MenuItem value="price">Price</MenuItem>
            <MenuItem value="calories">Calories</MenuItem>
            <MenuItem value="cpd">Calories / $</MenuItem>
          </Select>
        </div>
      </form>

      <TableContainer component={Paper} sx={{ height: "322px" }}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontWeight: "bold" }}>Name</TableCell>
              {formData.category === "gluten-free" ? (
                <>
                  <TableCell align="right" sx={{ fontWeight: "bold" }}>
                    Price
                  </TableCell>
                  <TableCell align="right" sx={{ fontWeight: "bold" }}>
                    Calories
                  </TableCell>
                </>
              ) : formData.property === "cpd" ? (
                <TableCell align="right" sx={{ fontWeight: "bold" }}>
                  Calories Per Dollar (CPD)
                </TableCell>
              ) : (
                <TableCell align="right" sx={{ fontWeight: "bold" }}>
                  {formData.property[0].toUpperCase() +
                    formData.property.slice(1)}
                </TableCell>
              )}
            </TableRow>
          </TableHead>
          <TableBody sx={{ overflowY: "scroll", maxHeight: "500px" }}>
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
