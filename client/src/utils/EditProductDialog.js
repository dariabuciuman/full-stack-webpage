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
import { useState, useEffect } from "react";
import { color } from "@mui/system";

export default function EditProductDialog({
  isDialogOpened,
  handleCloseDialog,
  _product,
}) {
  const [productName, setProductName] = useState("");
  const [manufacturer, setManufacturer] = useState("");
  const [description, setDescription] = useState("");
  const [categoryName, setCategoryName] = useState([]);
  const [productSize, setProductSize] = useState("");
  const [productColor, setProductColor] = useState("");
  const [productPrice, setProductPrice] = useState("");
  const [countInStock, setCountInStock] = useState("");
  const [image, setImage] = React.useState("");
  const [wereChanges, setWereChanges] = useState(false);

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
    console.log("Add name");
    setWereChanges(true);
    setProductName(event.target.value);
    console.log(productName);
  };
  const addManufacturer = (event) => {
    setWereChanges(true);
    setManufacturer(event.target.value);
  };
  const addDescription = (event) => {
    setWereChanges(true);
    setDescription(event.target.value);
  };
  const addSize = (event) => {
    setWereChanges(true);
    setProductSize(event.target.value);
  };
  const addColor = (event) => {
    setWereChanges(true);
    setProductColor(event.target.value);
  };
  const addPrice = (event) => {
    setWereChanges(true);
    setProductPrice(event.target.value);
  };
  const addStock = (event) => {
    setWereChanges(true);
    setCountInStock(event.target.value);
  };
  const addImage = (event) => {
    setWereChanges(true);
    console.log(event.target.files[0]);
    setImage(event.target.files[0]);
  };
  const addCategories = (event) => {
    setWereChanges(true);
    const {
      target: { value },
    } = event;
    setCategoryName(typeof value === "string" ? value.split(",") : value);
  };

  async function editProduct() {
    console.log(productColor);
    if (image) {
      let fileName = "product_" + _product.id + ".jpg";
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
    }

    const req = await fetch("http://localhost:5000/api/admin/editProduct", {
      method: "PUT",
      headers: {
        "admin-access-token": localStorage.getItem("token"),
        "Content-Type": "application/json",
        product_id: _product.id,
        new_name: productName,
        new_manufacturer: manufacturer,
        new_description: description,
        new_categories: categoryName,
        new_size: productSize,
        new_color: productColor,
        new_price: productPrice,
        new_stock: countInStock,
      },
    });
    const data = await req.json();
    if (data.status === "ok") {
      alert("Product added");
    } else alert(data.error);
    console.log(
      productName + " " + manufacturer + " " + description + " " + productSize
    );
    console.log(
      productColor + " " + productPrice + " " + countInStock + " " + image
    );
  }

  const handleEdit = () => {
    if (productName === "") {
      setProductName(_product.name);
      console.log("No name => " + _product.name);
    }
    if (manufacturer === "") {
      setManufacturer(_product.manufacturer);
      console.log("No manuf => " + _product.manufacturer);
    }
    if (description === "") {
      setDescription(_product.description);
      console.log("No descr => " + _product.description);
    }
    if (categoryName === []) {
      setCategoryName(_product.categories);
      console.log("No cats => " + _product.categories);
    }
    if (productSize === "") {
      setProductSize(_product.size);
      console.log("No size => " + _product.size);
    }
    if (productColor === "") {
      setProductColor(_product.color);
      console.log("No color => " + _product.color);
    }
    if (productPrice === "") {
      setProductPrice(_product.price);
    }
    if (countInStock == "") setCountInStock(_product.countInStock);

    console.log(wereChanges);
    if (wereChanges === true) {
      editProduct();
      console.log("Were changes");
      setWereChanges(false);
    } else console.log("No changes");
    handleCloseDialog(false);
  };

  const handleClose = () => {
    handleCloseDialog(false);
  };

  return (
    <div>
      <Dialog open={isDialogOpened} onClose={handleClose}>
        <DialogTitle>Edit product</DialogTitle>
        <DialogContent>
          <DialogContentText>
            To subscribe to this website, please enter your email address here.
            We will send updates occasionally.
          </DialogContentText>
          <TextField
            required
            margin="dense"
            id="id"
            label="Product ID (non-editable)"
            type="text"
            fullWidth
            variant="standard"
            value={_product.id}
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
          <p>Old: {_product.name}</p>
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
          <p>Old: {_product.manufacturer}</p>
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
          <p>Old: {_product.description}</p>
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
          <p>Old: {JSON.stringify(_product.categories)}</p>
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
          <p>Old: {_product.size}</p>
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
          <p>Old: {_product.color}</p>
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
          <p>Old: {_product.price}</p>
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
          <p>Old: {_product.countInStock}</p>
          <label htmlFor="contained-button-file">
            <input
              accept="image/*"
              id="contained-button-file"
              type="file"
              onChange={addImage}
            />
          </label>
          <p>Old: {_product.image}</p>
        </DialogContent>
        <DialogActions>
          <Button variant="outlined" onClick={handleEdit}>
            Save
          </Button>
          <Button onClick={handleClose}>Cancel</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
