import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import {
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";

import { FcGoogle } from "react-icons/fc";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";

import { auth } from "@/firebase/firebase";
import { useAuth } from "@/firebase/auth";

import Loader from "@/components/Loader";

const LoginForm = () => {
  const [email, setEmail] = useState(null);
  const [password, setPassword] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const { authUser, isLoading } = useAuth();
  const [emailError, setEmailError] = useState(null);
  const [passwordError, setPasswordError] = useState(null);
  const { push } = useRouter();

  const router = useRouter();

  useEffect(() => {
    if (!isLoading && authUser) {
      router.push("/");
    }
  }, [authUser, isLoading, router]);

  // Login Button
  const handlerSubmit = async (e) => {
    e.preventDefault();

    if (!email || !password) return;

    try {
      const user = await signInWithEmailAndPassword(auth, email, password);
    } catch (error) {
      if (error.code === "auth/user-not-found") {
        setEmailError("This email address is not registered.");
        setPasswordError(null);
      } else if (error.code === "auth/invalid-email") {
        setEmailError("Please enter a valid email address.");
        setPasswordError(null);
      } else if (error.code === "auth/wrong-password") {
        setPasswordError("The password is incorrect.");
        setEmailError(null);
      } else if (error.code === "auth/too-many-requests") {
        setPasswordError(
          "Your account has been temporarily disabled due to too many failed login attempts. Please try again later after some time."
        );
        setEmailError(null);
      } else {
        console.error("An Error Occurred", error);
        setEmailError("An unknown error occurred. Please try again.");
        setPasswordError("An unknown error occurred. Please try again.");
      }
    }
  };

  // Show and Hide Password
  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const clearErrors = () => {
    setEmailError(null);
    setPasswordError(null);
  };

  // Sign In With Google
  const provider = new GoogleAuthProvider();
  const handleGoogleSignIn = async () => {
    try {
      const user = await signInWithPopup(auth, provider);
    } catch (error) {
      console.error("An Error Occurred", error);
      setEmailError("An unknown error occurred. Please try again.");
      setPasswordError("An unknown error occurred. Please try again.");
    }
  };

  return isLoading || (!isLoading && authUser) ? (
    <Loader />
  ) : (
    <main className="relative flex items-center justify-center h-[100vh]">
      <div className="md:w-auto md:p-14 flex items-center justify-center w-full p-8">
        <div className="p-10 rounded-[14px] md:rounded-[25px] bg-white w-[475px] shadow-lg">
          <h1 className="text-3xl font-semibold text-center underline">
            Login
          </h1>

          <p className="text-center mt-4 font-[400]">
            Hey, Enter your details to get Sign in to your account.
          </p>

          <form onSubmit={handlerSubmit}>
            <div
              className={`relative mt-10 pl-1 flex flex-col ${
                emailError ? "error" : ""
              }`}
            >
              <input
                type="email"
                id="floating_outlined"
                className={`px-4 py-4 w-full text-sm text-gray-900 bg-transparent rounded-[12px] border dark:text-black dark:focus:border-blue-500 focus:outline-none focus:ring-0 peer font-medium outline-transparent ${
                  emailError ? "border-red-500" : ""
                }`}
                placeholder=" "
                required
                onChange={(e) => {
                  setEmail(e.target.value);
                  clearErrors();
                }}
              />
              <label
                htmlFor="floating_outlined"
                className={`absolute duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white  px-2 peer-focus:px-2 peer-focus:text-blue-600 dark:text-gray-400 peer-focus:dark:text-blue-500 ${
                  emailError ? "text-red-500" : "" // Add className condition here
                }  peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-1 peer-focus:scale-75 peer-focus:-translate-y-4 left-3 font-medium text-black`}
              >
                Email ID
              </label>
            </div>

            <div
              className={`relative mt-4 pl-1 flex flex-col ${
                passwordError ? "error" : ""
              }`}
            >
              <input
                type={showPassword ? "text" : "password"}
                className={`px-4 py-4 w-full text-sm text-gray-900 bg-transparent rounded-[12px] border dark:text-black  dark:focus:border-blue-500 focus:outline-none focus:ring-0  peer font-medium outline-transparent ${
                  passwordError ? "border-red-500" : ""
                }`}
                placeholder=" "
                required
                onChange={(e) => {
                  setPassword(e.target.value);
                  clearErrors();
                }}
              />
              <label
                htmlFor="floating_pass"
                className={`absolute duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white  px-2 peer-focus:px-2 peer-focus:text-blue-600 dark:text-gray-400 peer-focus:dark:text-blue-500 ${
                  passwordError ? "text-red-500" : ""
                }  peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-1 peer-focus:scale-75 peer-focus:-translate-y-4 left-3 font-medium text-black`}
              >
                Password
              </label>
              <div
                className="right-4 absolute inset-y-0 flex items-center cursor-pointer"
                onClick={toggleShowPassword}
              >
                {showPassword ? (
                  <AiOutlineEyeInvisible size={22} title="Hide Password" />
                ) : (
                  <AiOutlineEye size={22} title="Show Password" />
                )}
              </div>
            </div>

            <p className="mt-2 text-sm text-right">
              <Link
                href="#"
                className="hover:underline hover:text-blue-600 cursor-pointer"
              >
                {` Forgot Password ?`}{" "}
              </Link>
            </p>

            {emailError || passwordError ? (
              <div className="mt-4 text-center">
                <div
                  className={`text-red-500 mt-2 text-sm ${
                    emailError ? "text-red-500" : "" // Add className condition here
                  }`}
                >
                  {emailError || passwordError}
                </div>
              </div>
            ) : null}

            <button
              className="bg-[#fdc886] text-black font-bold w-full p-4 mt-5 rounded-[12px] transition-transform hover:bg-black/[0.5] hover:text-white active:scale-90"
              type="submit"
            >
              Log in
            </button>
          </form>

          <div
            className="border text-white w-full py-4 mt-4 rounded-[12px] transition-transform hover:bg-black/[0.8] active:scale-90 flex justify-center items-center gap-4 cursor-pointer group"
            onClick={handleGoogleSignIn}
          >
            <FcGoogle size={22} />
            <span className="group-hover:text-white font-medium text-black">
              Login with Google
            </span>
          </div>

          <p className="mt-4 ml-1 text-sm text-center">
            {` Don't have an Account ?`}{" "}
            <Link
              href="/register"
              className="hover:underline hover:text-blue-600 text-sm text-blue-400 cursor-pointer"
            >
              Register
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
};

export default LoginForm;
