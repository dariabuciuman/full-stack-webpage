import React from "react";
import MaterialTable from "material-table";
import { useState } from "react";
import tableIcons from "../utils/MaterialTableIcons";
import "./Admin.css";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import AddProductDialog from "../utils/AddProductDialog";
import Header from "../utils/Header";

const Admin = () => {
  const [users, setUsers] = useState("");
  const [open, setOpen] = React.useState(false);
  const [role, setRole] = React.useState("");
  const [email, setEmail] = React.useState("");

  const handleClickOpen = (email, role) => {
    setRole(role);
    setEmail(email);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleChange = (event) => {
    setRole(event.target.value);
  };

  const saveChange = () => {
    changeUser(email, role);
  };

  const columns = [
    { title: "Name", field: "name" },
    { title: "Email", field: "email" },
    { title: "Role", field: "role" },
  ];
  async function getUsers() {
    const req = await fetch("http://localhost:5000/api/admin/getUsers", {
      headers: {
        "admin-access-token": localStorage.getItem("token"),
      },
    });
    const data = await req.json();
    if (data.status === "ok") {
      setUsers(data.users);
      console.log(users);
      console.log(columns);
    } else console.log(data.error);
  }

  async function deleteUser(email) {
    const req = await fetch("http://localhost:5000/api/admin/deleteUser", {
      method: "DELETE",
      headers: {
        "admin-access-token": localStorage.getItem("token"),
        user_email: email,
      },
    });
    const data = await req.json();
    if (data.status === "ok") {
      alert("User has been deleted");
      getUsers();
    } else alert("Couldn't delete user");
  }

  async function changeUser(email, role) {
    const req = await fetch("http://localhost:5000/api/admin/changeUser", {
      method: "PUT",
      headers: {
        "admin-access-token": localStorage.getItem("token"),
        user_email: email,
        new_role: role,
      },
    });
    const data = await req.json();
    if (data.status === "ok") {
      alert("User role updated");
      getUsers();
    } else alert(data.error);
  }

  function loadUsers(event) {
    event.preventDefault();
    getUsers();
  }

  function deleteButton(email) {
    deleteUser(email);
  }

  return (
    <div>
      <Header />
      <div className="page">
        <form onSubmit={loadUsers}>
          <input type={"submit"} value="Get users"></input>
        </form>
        {users && (
          <div>
            <MaterialTable
              actions={[
                {
                  icon: tableIcons.Delete,
                  tooltip: "Delete User",
                  onClick: (event, rowData) => {
                    alert("You want to delete " + rowData.email);
                    deleteButton(rowData.email);
                  },
                },
                {
                  icon: tableIcons.Edit,
                  tooltip: "Change User",
                  onClick: (event, rowData) => {
                    handleClickOpen(rowData.email, rowData.role);
                  },
                },
              ]}
              icons={tableIcons}
              title="User list"
              columns={columns}
              data={users}
            />
            <React.Fragment>
              <Dialog
                fullWidth={100}
                maxWidth="md"
                open={open}
                onClose={handleClose}
              >
                <DialogTitle>Edit user role</DialogTitle>
                <DialogContent>
                  <DialogContentText>
                    Select the role you want for the user. You cannot change
                    your own role.
                  </DialogContentText>
                  <Box
                    noValidate
                    component="form"
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      m: "auto",
                      width: "fit-content",
                    }}
                  >
                    <FormControl sx={{ mt: 2, minWidth: 120, maxWidth: 200 }}>
                      <InputLabel htmlFor="max-width">role</InputLabel>
                      <Select
                        autoFocus
                        value={role}
                        onChange={handleChange}
                        label="maxWidth"
                        inputProps={{
                          name: "max-width",
                          id: "max-width",
                        }}
                      >
                        <MenuItem value="user">user</MenuItem>
                        <MenuItem value="admin">admin</MenuItem>
                      </Select>
                    </FormControl>
                  </Box>
                </DialogContent>
                <DialogActions>
                  <Button onClick={saveChange}>Save</Button>
                  <Button onClick={handleClose}>Cancel</Button>
                </DialogActions>
              </Dialog>
            </React.Fragment>
          </div>
        )}
        <AddProductDialog></AddProductDialog>
      </div>
    </div>
  );
};
export default Admin;
