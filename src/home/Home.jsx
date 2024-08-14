import React, { useState } from "react";
import "./home.scss";
import { ToastContainer, toast } from "react-toastify";
import { HiOutlineLogout } from "react-icons/hi";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import ClipLoader from "react-spinners/ClipLoader";
const Home = () => {
  const navigate = useNavigate();
  const [loading, setloading] = useState(false);
  const [formData, setFormData] = useState({
    department: "",
    dob: "",
  });

  const [errors, setErrors] = useState({});

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };
  const override = {
    position: "absolute",
    top: "20px",

    left: "50%",
    transform: "translateX(-50%)",
    margin: "0 auto",
  };
  const validateForm = () => {
    let tempErrors = {};
    let isValid = true;

    if (!formData.department) {
      isValid = false;
      tempErrors["department"] = "Please select a department";
    }

    if (!formData.dob) {
      isValid = false;
      tempErrors["dob"] = "Date of birth is required";
    } else {
      const today = new Date();
      const dob = new Date(formData.dob);
      console.log(dob);
      console.log(today.getFullYear());
      const age = today.getFullYear() - dob.getFullYear();
      if (age < 18) {
        isValid = false;
        tempErrors["dob"] = "You must be at least 18 years old";
      }
    }

    setErrors(tempErrors);
    return isValid;
  };
  const logout = () => {
    localStorage.clear();
    navigate("/login");
  };
  const handleSubmit = async (event) => {
    event.preventDefault();
    console.log(formData);
    setloading(true);
    if (validateForm()) {
      try {
        await axios.post(
          "http://localhost:5000/submituser",
          {
            department: formData.department,
            dob: formData.dob,
            user: JSON.parse(localStorage.getItem("users")).id,
          },
          {
            headers: {
              authorization: `bear ${JSON.parse(localStorage.getItem("auth"))}`,
            },
          }
        );
        setloading(false);
        setFormData({
          department: "",
          dob: "",
        });
        toast("form submited");
        navigate("/menu");
      } catch (err) {
        setloading(false);
        toast(err.message);
      }
    } else {
      setloading(false);
      toast("Please fix the errors in the form.");
    }
  };

  return (
    <div className="form-container">
      <ClipLoader
        // color={color}
        loading={loading}
        cssOverride={override}
        size={50}
        aria-label="Loading Spinner"
        data-testid="loader"
      />
      <HiOutlineLogout onClick={logout} className="logout-icon" />

      <h1>Form Page</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Department:</label>
          <div className="input-group">
            <input
              type="radio"
              value="HR"
              checked={formData.department === "HR"}
              onChange={handleInputChange}
              name="department"
            />{" "}
            HR
            <input
              type="radio"
              value="Marketing"
              checked={formData.department === "Marketing"}
              onChange={handleInputChange}
              name="department"
            />{" "}
            Marketing
            <input
              type="radio"
              value="Engineering"
              checked={formData.department === "Engineering"}
              onChange={handleInputChange}
              name="department"
            />{" "}
            Engineering
          </div>
          {errors.department && (
            <p className="error-message" style={{ color: "red" }}>
              {errors.department}
            </p>
          )}
        </div>
        <div>
          <label>Date of Birth:</label>
          <input
            type="date"
            name="dob"
            value={formData.dob}
            onChange={handleInputChange}
          />
          {errors.dob && (
            <p className="error-message" style={{ color: "red" }}>
              {errors.dob}
            </p>
          )}
        </div>
        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export default Home;
