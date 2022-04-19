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

export default function AddProductDialog() {
  const [open, setOpen] = React.useState(false);
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

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  async function addProduct() {
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
    setOpen(false);
  };

  return (
    <div>
      <Button variant="outlined" onClick={handleClickOpen}>
        Add Product
      </Button>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Add product</DialogTitle>
        <DialogContent>
          <DialogContentText>
            To subscribe to this website, please enter your email address here.
            We will send updates occasionally.
          </DialogContentText>
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
              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
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
            <Input
              accept="image/*"
              id="contained-button-file"
              multiple
              type="file"
              onChange={addImage}
            />
            <Button variant="contained" component="span">
              Upload Image
            </Button>
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
