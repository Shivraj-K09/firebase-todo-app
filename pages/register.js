import React, { useEffect, useState } from "react";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { useRouter } from "next/router";

import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import Link from "next/link";

import { auth } from "@/firebase/firebase";
import { useAuth } from "@/firebase/auth";

import Loader from "@/components/Loader";

const RegisterForm = () => {
  const [userName, setUserName] = useState(null);
  const [email, setEmail] = useState(null);
  const [password, setPassword] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [emailError, setEmailError] = useState(null);
  const [passwordError, setPasswordError] = useState(null);
  const [userNameError, setUserNameError] = useState(null);

  const { authUser, isLoading, setAuthUser } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && authUser) {
      router.push("/");
    }
  }, [authUser, isLoading, router]);

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const signupHandler = async () => {
    if (!email || !userName || !password) return;
    try {
      const { user } = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      await updateProfile(auth.currentUser, {
        displayName: userName,
      });
      setAuthUser({
        uid: user.id,
        email: user.email,
        userName,
      });
    } catch (error) {
      console.error("An Error Occurred", error);
      if (error.code === "auth/invalid-email") {
        setEmailError("Please enter a valid email address.");
        setPasswordError(null);
        setUserNameError(null);
      } else if (error.code === "auth/weak-password") {
        setPasswordError(
          "The password is too weak. Please choose a password that is at least 6 characters long."
        );
        setEmailError(null);
        setUserNameError(null);
      } else if (error.code === "auth/invalid-display-name") {
        setUserNameError("Please enter a valid user name.");
        setEmailError(null);
        setPasswordError(null);
      } else {
        setEmailError("An unknown error occurred. Please try again.");
        setPasswordError("An unknown error occurred. Please try again.");
        setUserNameError("An unknown error occurred. Please try again.");
      }
    }
  };

  return isLoading || (!isLoading && !!authUser) ? (
    <Loader />
  ) : (
    <main className="relative flex items-center justify-center h-[100vh]">
      <div className="md:w-auto md:p-14 flex items-center justify-center w-full p-8">
        <div className="p-10 rounded-[14px] md:rounded-[25px] bg-white w-[475px] shadow-lg">
          <h1 className="text-3xl font-semibold text-center underline">
            Register
          </h1>

          <p className="text-center mt-4 font-[400]">
            {`Ready to jump in? Just a few quick details and you're in`}
          </p>

          {/* Register Form Starts here */}

          <form onSubmit={(e) => e.preventDefault()}>
            {/* UserName Input  */}
            <div className="relative flex flex-col pl-1 mt-10">
              <input
                type="text"
                id="floating_outlined"
                className=" px-4 py-4 w-full text-sm text-gray-900 bg-transparent rounded-[12px] border  dark:text-black  dark:focus:border-blue-500 focus:outline-none focus:ring-0  peer font-medium outline-transparent"
                autoComplete="off"
                placeholder=" "
                required
                onChange={(e) => setUserName(e.target.value)}
              />
              <label
                htmlFor="floating_outlined"
                className="absolute dark:text-gray-400 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white  px-2 peer-focus:px-2 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-1 peer-focus:scale-75 peer-focus:-translate-y-4 left-3 text-black font-medium"
              >
                Name
              </label>
            </div>

            {/* Email Input  */}
            <div
              className={`relative mt-4 pl-1 flex flex-col ${
                emailError ? "error" : ""
              }`}
            >
              <input
                type="email"
                id="floating_email"
                className={`px-4 py-4 w-full text-sm text-gray-900 bg-transparent rounded-[12px] border  dark:text-black  dark:focus:border-blue-500 focus:outline-none focus:ring-0  peer font-medium outline-transparent ${
                  emailError ? "border-red-500" : ""
                }`}
                autoComplete="off"
                placeholder=" "
                required
                onChange={(e) => {
                  setEmail(e.target.value);
                  setEmailError(null); // clear email error on input
                }}
              />
              <label
                htmlFor="floating_email"
                className={`absolute dark:text-gray-400 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white  px-2 peer-focus:px-2 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 ${
                  emailError ? "text-red-500" : ""
                }  peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-1 peer-focus:scale-75 peer-focus:-translate-y-4 left-3 text-black font-medium`}
              >
                Email ID
              </label>
            </div>

            {/* Password Input  */}
            <div
              className={`relative mt-4 pl-1 flex flex-col ${
                passwordError ? "error" : ""
              }`}
            >
              <input
                type={showPassword ? "text" : "password"}
                id="floating_pass"
                className={`px-4 py-4 w-full text-sm text-gray-900 bg-transparent rounded-[12px] border dark:text-black  dark:focus:border-blue-500 focus:outline-none focus:ring-0  peer font-medium outline-transparent ${
                  passwordError ? "border-red-500" : ""
                }`}
                placeholder=" "
                required
                onChange={(e) => {
                  setPassword(e.target.value);
                  setPasswordError(null); // clear password error on input
                }}
              />
              <label
                htmlFor="floating_pass"
                className={`absolute dark:text-gray-400 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white  px-2 peer-focus:px-2 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 ${
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

            {/* Render error messages if they exist */}
            {emailError || passwordError || userNameError ? (
              <div className="mt-2 text-sm text-center text-red-500">
                {emailError || passwordError || userNameError}
              </div>
            ) : null}

            <button
              className="bg-[#fdc886] text-black font-bold w-full p-4 mt-5 rounded-[12px] transition-transform hover:bg-black/[0.5] hover:text-white active:scale-90"
              onClick={signupHandler}
            >
              Sign Up
            </button>
          </form>
          {/* Register Form Starts here */}

          <p className="mt-4 ml-1 text-sm text-center">
            {`Already have an Account?`}{" "}
            <Link
              href="/login"
              className="hover:underline hover:text-blue-600 text-sm text-blue-400 cursor-pointer"
            >
              Login
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
};

export default RegisterForm;
