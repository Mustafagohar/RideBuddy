import styles from "../../index";
import { Link, useNavigate } from "react-router-dom";
import {
  loadingEnd,
  signInFailure,
  signInStart,
  signInSuccess,
} from "../../redux/user/userSlice";
import { useDispatch, useSelector } from "react-redux";
import OAuth from "../../components/OAuth";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const schema = z.object({
  email: z
    .string()
    .min(1, { message: "email required" })
    .refine((value) => /\S+@\S+\.\S+/.test(value), {
      message: "Invalid email address",
    }),
  password: z.string().min(1, { message: "password required" }),
});

function SignIn() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
  });

  const { isLoading, isError } = useSelector((state) => state.user);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const onSubmit = async (formData, e) => {
    e.preventDefault();

    const BASE_URL = "https://ridebuddy-18zk.onrender.com";

    try {
      dispatch(signInStart());

      console.log("Sending Login Request...");
      console.log(formData);

      const res = await fetch(`${BASE_URL}/api/auth/signin`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      console.log("Response Status:", res.status);
      console.log("Response Data:", data);

      if (data?.accessToken) {
        localStorage.setItem("accessToken", data.accessToken);
      }

      if (data?.refreshToken) {
        localStorage.setItem("refreshToken", data.refreshToken);
      }

      if (!res.ok || data.success === false) {
        dispatch(loadingEnd());
        dispatch(signInFailure(data));
        return;
      }

      dispatch(signInSuccess(data));
      dispatch(loadingEnd());

      if (data.isAdmin) {
        navigate("/adminDashboard");
      } else if (data.isUser) {
        navigate("/");
      } else {
        navigate("/");
      }
    } catch (error) {
      console.log("SIGNIN ERROR");
      console.log(error);

      dispatch(loadingEnd());
      dispatch(signInFailure(error));
    }
  };

  return (
    <>
      <div className="max-w-[340px] pb-10 md:max-w-md min-h-[500px] mx-auto mt-[70px] md:mt-[80px] rounded-lg overflow-hidden shadow-2xl">
        <div className="green px-6 py-2 rounded-t-lg flex justify-between items-center">
          <h1 className={`${styles.heading2} text-normal`}>Sign In</h1>

          <Link to={"/"} onClick={() => dispatch(loadingEnd())}>
            <div className="px-3 font-bold hover:bg-green-300 rounded-md shadow-inner">
              x
            </div>
         
