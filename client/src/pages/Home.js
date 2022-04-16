import React from "react";
import "./Home.css";
import Header from "../utils/Header";

function Home() {
  console.log(localStorage.getItem("token"));
  return (
    <div className="home">
      <Header></Header>
      <div className="dashboard">
        <div className="hello">
          <div className="typewriter1">
            <h1>Hello.</h1>
          </div>
          <div className="typewriter2">
            <h1>
              Welcome to the place where you can get your best PC components.
            </h1>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
