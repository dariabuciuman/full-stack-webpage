async function verifyPermissions() {
  let admin = fetch("http://localhost:5000/api/admin", {
    headers: {
      "admin-acces-token": localStorage.getItem("token"),
    },
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.status === "ok" && data.authorized === "true") admin = true;
      else admin = false;
    });
  // const data = await req.json();
  // if (data.status === "ok" && data.authorized === "true") return true;
  // return false;
  return admin;
}
export default verifyPermissions();
