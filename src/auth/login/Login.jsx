import React, { useEffect, useState } from "react";
import { Link, Navigate, json, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import ClipLoader from "react-spinners/ClipLoader";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
function Login() {
  const [unfill, setUnfill] = useState(false);
  const navigate = useNavigate();
  const [loading, setloading] = useState(false);
  const override = {
    position: "absolute",
    top: "20px",

    left: "50%",
    transform: "translateX(-50%)",
    margin: "0 auto",
  };
  const handelclick = async (event) => {
    event.preventDefault();
    setloading(true);
    let Email = event.target[0].value;
    let password = event.target[1].value;
    console.log(Email, password);
    if (Email && password) {
      let result = await axios.post("http://localhost:5000/login", {
        Email,
        password,
      });
      let data = await result.data;
      console.log(data);
      if (data.auth) {
        setloading(false);

        let id = data.data._id;
        data.data.id = id;
        localStorage.setItem("users", JSON.stringify(data.data));
        localStorage.setItem("auth", JSON.stringify(data.auth));
        toast("Login succesfull");
        navigate("/");
      } else {
        setloading(false);
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
        <ClipLoader
          // color={color}
          loading={loading}
          cssOverride={override}
          size={50}
          aria-label="Loading Spinner"
          data-testid="loader"
        />
        <form onSubmit={handelclick}>
          <input type="text" placeholder="Email" />
          <input type="text" placeholder="Password" />
          <button type="submit">LOG IN</button>
        </form>
        <div className="routetologin">
          New here <Link to={"/register"}>register here</Link>
          {unfill && <div className="alert">Please fill all the fields</div>}
        </div>
        {/* <ToastContainer className="toast" /> */}
      </div>
    </>
  );
}

export default Login;
