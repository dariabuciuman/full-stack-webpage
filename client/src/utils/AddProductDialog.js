import * as React from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { useTheme, styled } from "@mui/material/styles";
import Box from "@mui/material/Box";
import OutlinedInput from "@mui/material/OutlinedInput";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import Chip from "@mui/material/Chip";

export default function AddProductDialog({
  isDialogOpened,
  handleCloseDialog,
}) {
  const [productID, setProductID] = React.useState("");
  const [productName, setProductName] = React.useState("");
  const [manufacturer, setManufacturer] = React.useState("");
  const [description, setDescription] = React.useState("");
  const [categoryName, setCategoryName] = React.useState([]);
  const [productSize, setProductSize] = React.useState("");
  const [productColor, setProductColor] = React.useState("");
  const [productPrice, setProductPrice] = React.useState("");
  const [countInStock, setCountInStock] = React.useState("");
  const [image, setImage] = React.useState("");

  const ITEM_HEIGHT = 48;
  const ITEM_PADDING_TOP = 8;
  const MenuProps = {
    PaperProps: {
      style: {
        maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
        width: 250,
      },
    },
  };
  const Input = styled("input")({
    display: "none",
  });

  const categories = [
    "Cables",
    "CPUs",
    "Gaming",
    "Memory",
    "Motherboards",
    "Monitors",
    "Network accessories",
    "Peripherals",
    "Video cards",
  ];

  function getStyles(category, categoryName, theme) {
    return {
      fontWeight:
        categoryName.indexOf(category) === -1
          ? theme.typography.fontWeightRegular
          : theme.typography.fontWeightMedium,
    };
  }
  const theme = useTheme();

  const addID = (event) => {
    setProductID(event.target.value);
  };
  const addName = (event) => {
    setProductName(event.target.value);
  };
  const addManufacturer = (event) => {
    setManufacturer(event.target.value);
  };
  const addDescription = (event) => {
    setDescription(event.target.value);
  };
  const addSize = (event) => {
    setProductSize(event.target.value);
  };
  const addColor = (event) => {
    setProductColor(event.target.value);
  };
  const addPrice = (event) => {
    setProductPrice(event.target.value);
  };
  const addStock = (event) => {
    setCountInStock(event.target.value);
  };
  const addImage = (event) => {
    console.log(event.target.files[0]);
    setImage(event.target.files[0]);
  };
  const addCategories = (event) => {
    const {
      target: { value },
    } = event;
    setCategoryName(typeof value === "string" ? value.split(",") : value);
  };

  async function addProduct() {
    let fileName = "product_" + productID + ".jpg";
    const formData = new FormData();
    formData.append("image", image, fileName);

    const res = await fetch("http://localhost:5000/api/admin/uploadImage", {
      method: "POST",
      body: formData,
      headers: {
        Accept: "multipart/form-data",
        "admin-access-token": localStorage.getItem("token"),
      },
      credentials: "include",
    })
      .then((res) => res.json())
      .then((res) => {
        console.log("Uploaded");
      })
      .catch((err) => console.error(err));

    const req = await fetch("http://localhost:5000/api/admin/addProduct", {
      method: "POST",
      headers: {
        "admin-access-token": localStorage.getItem("token"),
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id: productID,
        name: productName,
        manufacturer: manufacturer,
        description: description,
        image: fileName,
        categories: categoryName,
        size: productSize,
        color: productColor,
        price: productPrice,
        countInStock: countInStock,
      }),
    });
    const data = await req.json();
    if (data.status === "ok") {
      console.log("Product added");
    } else alert(data.error);
    console.log(
      productName + " " + manufacturer + " " + description + " " + productSize
    );
    console.log(
      productColor + " " + productPrice + " " + countInStock + " " + image
    );
  }

  const handleAdd = () => {
    alert("Add product");
    addProduct();
    handleCloseDialog(false);
  };

  const handleClose = () => {
    handleCloseDialog(false);
  };

  return (
    <div>
      <Dialog open={isDialogOpened} onClose={handleClose}>
        <DialogTitle>Add product</DialogTitle>
        <DialogContent>
          <DialogContentText>
            To subscribe to this website, please enter your email address here.
            We will send updates occasionally.
          </DialogContentText>
          <TextField
            required
            margin="dense"
            id="id"
            label="Product ID"
            type="text"
            fullWidth
            variant="standard"
            onChange={addID}
          />
          <TextField
            required
            margin="dense"
            id="name"
            label="Product name"
            type="text"
            fullWidth
            variant="standard"
            onChange={addName}
          />
          <TextField
            required
            margin="dense"
            id="manufacturer"
            label="Product manufacturer"
            type="text"
            fullWidth
            variant="standard"
            onChange={addManufacturer}
          />
          <TextField
            required
            margin="dense"
            id="description"
            label="Description"
            type="text"
            fullWidth
            variant="standard"
            onChange={addDescription}
          />
          <InputLabel id="categories">Categories</InputLabel>
          <Select
            labelId="categories"
            id="multiple-categories"
            multiple
            value={categoryName}
            onChange={addCategories}
            input={
              <OutlinedInput
                required
                id="select-multiple-categories"
                label="Categories"
              />
            }
            renderValue={(selected) => (
              <Box
                sx={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: 0.5,
                }}
              >
                {selected.map((value) => (
                  <Chip key={value} label={value} />
                ))}
              </Box>
            )}
            MenuProps={MenuProps}
          >
            {categories.map((category) => (
              <MenuItem
                key={category}
                value={category}
                style={getStyles(category, categoryName, theme)}
              >
                {category}
              </MenuItem>
            ))}
          </Select>
          <TextField
            required
            margin="dense"
            id="size"
            label="Size"
            type="text"
            fullWidth
            variant="standard"
            onChange={addSize}
          />
          <TextField
            required
            margin="dense"
            id="color"
            label="Color"
            type="text"
            fullWidth
            variant="standard"
            onChange={addColor}
          />
          <TextField
            required
            margin="dense"
            id="price"
            label="Price"
            type="text"
            fullWidth
            variant="standard"
            onChange={addPrice}
          />
          <TextField
            required
            margin="dense"
            id="count"
            label="Count in stock"
            type="number"
            fullWidth
            variant="standard"
            onChange={addStock}
          />
          <label htmlFor="contained-button-file">
            <input
              accept="image/*"
              id="contained-button-file"
              type="file"
              onChange={addImage}
            />
          </label>
        </DialogContent>
        <DialogActions>
          <Button variant="outlined" onClick={handleAdd}>
            Add
          </Button>
          <Button onClick={handleClose}>Cancel</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
