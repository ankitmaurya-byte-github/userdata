import React, { useEffect, useState } from "react";
import "../style.scss";
import { Link, useNavigate } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";

import { ToastContainer, toast } from "react-toastify";
import axios from "axios";
function Register() {
  const navigate = useNavigate();

  const [unfill, setUnfill] = useState(false);
  const handelclick = async (event) => {
    event.preventDefault();
    let name = event.target[0].value;
    let Email = event.target[1].value;
    let password = event.target[2].value;
    if (name && Email && password) {
      let result = await axios.post(
        "http://localhost:5000/sinup",
        { name, Email, password },
        {
          headers: {
            authorization: `bear ${JSON.parse(localStorage.getItem("auth"))}`,
          },
        }
      );
      let data = await result.data;
      console.log(data);
      let id = data._id;
      console.log(data);
      localStorage.setItem(
        "users",
        JSON.stringify({ name, Email, password, id })
      );
      localStorage.setItem("auth", JSON.stringify(data.auth));
      toast("register succesfull");
      navigate("/");
    } else {
      console.log("write properly");
      toast("Please fill all details");
    }
  };
  return (
    <>
      <div className="register">
        <form onSubmit={handelclick}>
          <input type="text" placeholder="Usename" />
          <input type="text" placeholder="Email" />
          <input type="text" placeholder="Password" />
          <button type="submit">SIN UP</button>
        </form>
        <div className="routetologin">
          already have account <Link to={"/login"}>login here</Link>
          {unfill && <div className="alert">Please fill all the fields</div>}
        </div>
      </div>
      <ToastContainer className="toast" />
    </>
  );
}

export default Register;
