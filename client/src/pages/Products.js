import React from "react";
import { useState, useEffect } from "react";
import "./Products.css";
import { useNavigate } from "react-router-dom";
import AddProductDialog from "../utils/AddProductDialog";
import Header from "../utils/Header";
import jwt from "jsonwebtoken";
import MaterialTable from "material-table";
import tableIcons from "../utils/MaterialTableIcons";
import EditProductDialog from "../utils/EditProductDialog";

import TextField from "@mui/material/TextField";

const Products = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isOpenEdit, setIsOpenEdit] = useState(false);
  const [product, setProduct] = useState([]);
  const [productName, setProductName] = React.useState("");
  const [productID, setProductID] = useState(0);

  const columns = [
    { title: "ID", field: "id" },
    { title: "Name", field: "name" },
    { title: "Manufacturer", field: "manufacturer" },
    { title: "Stock", field: "countInStock" },
  ];

  async function populateProducts() {
    const req = await fetch("http://localhost:5000/api/getProducts", {
      headers: {
        "x-acces-token": localStorage.getItem("token"),
      },
    });
    const data = await req.json();
    if (data.status === "ok") {
      setProducts(data.products);
      console.log(data.products);
    } else {
      alert(data.error);
    }
  }

  async function getProduct(id) {
    const req = await fetch("http://localhost:5000/api/admin/getProduct", {
      method: "GET",
      headers: {
        "admin-access-token": localStorage.getItem("token"),
        product_id: id,
      },
    });
    const data = await req.json();
    if (data.status === "ok") {
      console.log(data.product);
      setProduct(data.product);
      setProductName(data.product.name);
    } else alert("Couldn't get product");
  }

  async function deleteProduct(id) {
    const req = await fetch("http://localhost:5000/api/admin/deleteUser", {
      method: "DELETE",
      headers: {
        "admin-access-token": localStorage.getItem("token"),
        product_id: id,
      },
    });
    const data = await req.json();
    if (data.status === "ok") {
      alert("User has been deleted");
      populateProducts();
    } else alert("Couldn't delete user");
  }

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const user = jwt.decode(token);
      console.log(user);
      if (!user) {
        console.log(localStorage.getItem("token"));
        localStorage.removeItem("token");
        navigate("/login", { replace: true });
      } else {
        populateProducts();
      }
    } else {
      console.log("else");
      navigate("/login", { replace: true });
    }
  }, []);

  function deleteButton(id) {
    deleteProduct(id);
  }

  function editButton(id) {
    getProduct(id);
    setProductID(id);
    console.log(product);
    setIsOpenEdit(!isOpenEdit);
  }

  function loadProducts(event) {
    event.preventDefault();
    populateProducts();
  }

  const handleOpen = () => {
    setIsOpen(!isOpen);
  };

  const addName = (event) => {
    setProductName(event.target.value);
  };

  return (
    <div>
      <Header />
      <div className="page">
        <MaterialTable
          actions={[
            {
              icon: tableIcons.Delete,
              tooltip: "Delete Product",
              onClick: (event, row) => {
                alert("You want to delete " + row.id);
                deleteButton(row.id);
              },
            },
            {
              icon: tableIcons.Edit,
              tooltip: "Edit Product",
              onClick: (event, row) => {
                editButton(row.id);
              },
            },
            {
              icon: tableIcons.Add,
              tooltip: "Add Product",
              isFreeAction: true,
              onClick: (event) => {
                handleOpen();
              },
            },
          ]}
          icons={tableIcons}
          title="Products List"
          columns={columns}
          data={products}
          options={{
            grouping: true,
            headerStyle: {
              backgroundColor: "#21252904",
              color: "#000",
              fontSize: "1rem",
              fontWeight: "500",
            },
            rowStyle: {
              fontSize: "0.9rem",
            },
          }}
        />
        <TextField
          required
          margin="dense"
          id="name"
          label="Product name"
          type="text"
          fullWidth
          variant="standard"
          value={productName}
          onChange={addName}
        />
        <AddProductDialog
          isDialogOpened={isOpen}
          handleCloseDialog={() => setIsOpen(false)}
        ></AddProductDialog>
        <EditProductDialog
          isDialogOpened={isOpenEdit}
          handleCloseDialog={() => setIsOpenEdit(false)}
          _product={product}
          _productID={productID}
        ></EditProductDialog>
        <form className="form" onSubmit={loadProducts}>
          <input
            className="refresh-button"
            type={"submit"}
            value="Refresh"
          ></input>
        </form>
      </div>
    </div>
  );
};
export default Products;
