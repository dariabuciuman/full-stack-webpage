import React from "react";
import { useState, useEffect } from "react";
import "./Products.css";
import { useNavigate } from "react-router-dom";
import Header from "../utils/Header";
import jwt from "jsonwebtoken";
import MaterialTable from "material-table";
import tableIcons from "../utils/MaterialTableIcons";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";

const Orders = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [idPos, setIdPos] = useState(0);
  const [orders, setOrders] = useState([]);
  const [orderProducts, setOrderProducts] = useState([]);

  const columns = [
    { title: "ID", field: "_id" },
    { title: "Total Quantity", field: "totalQuantity" },
    { title: "Types Of Products", field: "numOfProducts" },
    { title: "User", field: "userName" },
    { title: "Total Price", field: "totalPrice" },
    { title: "Country", field: "country" },
  ];

  async function getOrders() {
    const req = await fetch("http://localhost:5000/api/admin/getOrders", {
      method: "GET",
      headers: {
        "admin-access-token": localStorage.getItem("token"),
      },
    });
    const data = await req.json();
    if (data.status === "ok") {
      var newData = data.orders.map((order, index) => {
        order.userName = data.users[index].name;
        var q = 0;
        var p = 0;
        order.products.map((product, i) => {
          console.log(product);
          q += product.quantity;
          p += 1;
        });
        order.totalQuantity = q;
        order.numOfProducts = p;
      });
      console.log(data.orders);
      console.log(data.users);
      console.log(data.products);
      setOrders(data.orders);
      setProducts(data.products);
    } else alert("Couldn't get orders");
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
        getOrders();
      }
    } else {
      console.log("else");
      navigate("/login", { replace: true });
    }
  }, []);

  function infoButton(id) {
    console.log(id);
    let pos = orders
      .map(function(e) {
        return e._id;
      })
      .indexOf(id);
    console.log("Index of '_id'  is = " + pos);
    setIdPos(pos);
    var prods = [];
    orders[idPos].products.map((product, i) => {
      products[idPos].at(i).quantity = product.quantity;
      prods.push(products[idPos].at(i));
    });
    console.log(prods);
    setOrderProducts(prods);
    setIsOpen(true);
  }

  function loadProducts(event) {
    event.preventDefault();
    getOrders();
  }

  const handleClose = () => {
    setIsOpen(false);
  };

  return (
    <div>
      <Header />
      <div className="page">
        <MaterialTable
          actions={[
            {
              icon: tableIcons.InfoIcon,
              tooltip: "Order Info",
              onClick: (event, row) => {
                infoButton(row._id);
              },
            },
          ]}
          icons={tableIcons}
          title="Orders List"
          columns={columns}
          data={orders}
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
        <Dialog open={isOpen} onClose={handleClose}>
          <DialogTitle>ORDER INFO</DialogTitle>
          <DialogContent>
            <h5>Products</h5>
            {orderProducts.map((product, i) => (
              <div key={i}>
                <h6>{product.name}</h6>
                <p>
                  Color: {product.color}, Quantity: {product.quantity}, Price:{" "}
                  {product.price * product.quantity} RON
                </p>
              </div>
            ))}
          </DialogContent>
        </Dialog>
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
export default Orders;
