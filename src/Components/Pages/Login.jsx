import React, { useState, useContext, useEffect } from "react";
import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Typography,
} from "@material-tailwind/react";
import { Input } from "@material-tailwind/react";
import { Button } from "@material-tailwind/react";
import { Link, useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import ClipLoader from "react-spinners/ClipLoader";
import { AuthContext } from "../AppContext/AppContext";
import { auth, onAuthStateChanged } from "../firebase/firebase";
import parodyLogo from "../../assets/images/parodyLogo.png";

const Login = () => {
  const [loading, setLoading] = useState(false);
  const { signInWithGoogle, loginWithEmailAndPassword } =
    useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    setLoading(true);
    onAuthStateChanged(auth, (user) => {
      if (user) {
        navigate("/");
        setLoading(false);
      } else {
        setLoading(false);
      }
    });
  }, [navigate]);

  let initialValues = {
    email: "",
    password: "",
  };

  const validationSchema = Yup.object({
    email: Yup.string().email("Invalid email address").required("Required"),
    password: Yup.string()
      .required("Required")
      .min("6", "Must be at least 6 characters long")
      .matches(/^[a-zA-Z]+$/, "Password can only contain letters"),
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    const { email, password } = formik.values;
    if (formik.isValid === true) {
      loginWithEmailAndPassword(email, password);
      setLoading(true);
    } else {
      setLoading(false);
      alert("Check your input fields");
    }

    console.log("formik", formik);
  };

  const formik = useFormik({ initialValues, validationSchema, handleSubmit });

  return (
    <>
      {loading ? (
        <div className="grid grid-cols-1 justify-items-center items-center h-screen">
          <ClipLoader color="#367fd6" size={150} speedMultiplier={0.5} />
        </div>
      ) : (
        <div className="grid grid-cols-1 h-screen justify-items-center items-center">
          <Card className="w-96 glow-card bg-black">
              <div className="flex items-center" style={{marginLeft:'40px'}}>
                <img src={parodyLogo} alt="" className="w-40 h-auto m-0" style={{ marginRight: '-70px', marginBottom: '-20px' , marginTop:'-50px'}} />
                <div className="text-3xl text-white font-orbitron glitch" style={{ marginBottom: '-10px' }}>
                arody
              </div>
              </div>
            <CardBody className="flex flex-col justify-center items-centergap-4">
              <form onSubmit={handleSubmit}>
                <div className="mb-2">
                  <Input
                    name="email"
                    type="email"
                    label="Email"
                    size="lg"
                    {...formik.getFieldProps("email")}
                  />
                </div>
                <div>
                  {formik.touched.email && formik.errors.email && (
                    <Typography variant="small" color="red">
                      {formik.errors.email}
                    </Typography>
                  )}
                </div>
                <div className="mt-4 mb-2">
                  <Input
                    name="password"
                    type="password"
                    label="Password"
                    size="lg"
                    {...formik.getFieldProps("password")}
                  />
                  <div>
                    {formik.touched.password && formik.errors.password && (
                      <Typography variant="small" color="red">
                        {formik.errors.password}
                      </Typography>
                    )}
                  </div>
                </div>
                <button
                  className="btn btn-sm mb-4 bg-accent text-black font-thin"
                  style={{ marginLeft: "110px", width: "100px", marginBottom: "-20px" }}
                  type="submit"
                >
                  Login
                </button>
              </form>
            </CardBody>
            <CardFooter className="pt-0">
              <button
                className="mb-4 text-center font-orbitron text-accent font-thin"
                style={{ marginLeft: "80px" }}
                onClick={signInWithGoogle}
              >
                Sign In with Google
              </button>
              <Link to="/reset">
                <p className="ml-0 font-bold font-orbitron font-thin text-xs text-yellow-500 text-center " style={{marginBottom:'-20px', marginTop:'20px'}}>
                  Reset the password
                </p>
              </Link>
              <div className="mt-6 flex items-center text-xs font-orbitron text-yellow-200 justify-center">
                Don't have an account?
                <Link to="/register">
                  <p className="ml-1 font-bold font-orbitron text-sm text-accent text-center ">
                    Register
                  </p>
                </Link>
              </div>
            </CardFooter>
          </Card>
        </div>
      )}
    </>
  );
};

export default Login;
