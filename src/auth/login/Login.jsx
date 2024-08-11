import React, { useEffect, useState } from "react";
import { Link, Navigate, json, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
function Login() {
  const [unfill, setUnfill] = useState(false);
  const navigate = useNavigate();

  const handelclick = async (event) => {
    event.preventDefault();
    let Email = event.target[0].value;
    let password = event.target[1].value;
    console.log(Email, password);
    if (Email && password) {
      let result = await axios.post(
        "http://localhost:5000/login",
        { Email, password },
        {
          headers: {
            authorization: `bear ${JSON.parse(localStorage.getItem("auth"))}`,
          },
        }
      );
      let data = await result.data;
      console.log(data);
      if (data.auth) {
        let id = data.data._id;
        data.data.id = id;
        localStorage.setItem("users", JSON.stringify(data.data));
        localStorage.setItem("auth", JSON.stringify(data.auth));
        toast("Login succesfull");
        navigate("/");
      } else {
        console.log(data.error);
        toast(data.error);
      }
    } else {
      console.log("write properly");
      toast("fill all details");
    }
  };
  return (
    <>
      <div className="register">
        <form onSubmit={handelclick}>
          <input type="text" placeholder="Email" />
          <input type="text" placeholder="Password" />
          <button type="submit">LOG IN</button>
        </form>
        <div className="routetologin">
          New here <Link to={"/register"}>register here</Link>
          {unfill && <div className="alert">Please fill all the fields</div>}
        </div>
      </div>
      <ToastContainer className="toast" />
    </>
  );
}

export default Login;
