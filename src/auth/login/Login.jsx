import React, { useEffect, useState } from "react";
import { Link, Navigate, json, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import Spinner from "../../layouts/Spinner";
function Login() {
  const [unfill, setUnfill] = useState(false);
  const navigate = useNavigate();
  const [loading, setloading] = useState(false);

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
        let id = data.data._id;
        data.data.id = id;
        localStorage.setItem("users", JSON.stringify(data.data));
        localStorage.setItem("auth", JSON.stringify(data.auth));
        setloading(false);

        toast("Login succesfull");
        navigate("/");
      } else {
        setloading(false);
        console.log(data.error);
        toast(data.error);
      }
    } else {
      setloading(false);
      console.log("write properly");
      toast("fill all details");
    }
  };
  useEffect(() => {
    document.title = "Login";
  }, []);
  return (
    <>
      <div className="register">
        {loading && <Spinner />}
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
