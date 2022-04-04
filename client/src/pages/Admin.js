import React, { useEffect } from "react";
import MaterialTable from "material-table";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import tableIcons from "../utils/MaterialTableIcons";

const Admin = () => {
  const [users, setUsers] = useState("");
  const navigate = useNavigate();
  const columns = [
    { title: "name", field: "name" },
    { title: "email", field: "email" },
    { title: "role", field: "role" },
  ];
  async function getUsers(event) {
    event.preventDefault();
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
  const data = [
    { name: "Mohammad", surname: "Faisal", birthYear: 1995 },
    { name: "Nayeem Raihan ", surname: "Shuvo", birthYear: 1994 },
  ];

  return (
    <div>
      <h1>Admin Page</h1>
      <button
        onClick={() => {
          localStorage.removeItem("token");
          navigate("/", { replace: true });
        }}
        type="button"
      >
        Log Out
      </button>
      <form onSubmit={getUsers}>
        <input type={"submit"} value="Get users"></input>
      </form>
      {users && (
        <MaterialTable
          icons={tableIcons}
          title="User list"
          columns={columns}
          data={users}
        />
      )}
    </div>
  );
};
export default Admin;
