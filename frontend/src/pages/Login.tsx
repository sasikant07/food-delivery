import axios from "axios";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { authService } from "../main";
import toast from "react-hot-toast";
import { useGoogleLogin } from "@react-oauth/google";
import {FcGoogle} from "react-icons/fc";

const Login = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const responseGoogle = async (authResult: any) => {
    setLoading(true);
    try {
      const result = await axios.post(`${authService}/api/auth/login`, {
        code: authResult["code"],
      });

      localStorage.setItem("token", result.data.token);
      toast.success(result.data.message);
      setLoading(false);
      navigate("/");
    } catch (error) {
      console.error(error);
      toast.error("Login failed. Please try again.");
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };

  const googlelogin = useGoogleLogin({
    onSuccess: responseGoogle,
    onError: responseGoogle,
    flow: "auth-code",
  });

  return (
    <div className="flex min-h-screen items-center justify-center bg-white px-4">
      <div className="w-full max-w-sm space-y-6">
        <h1 className="text-center text-3xl font-bold text-[#E23774]">
          Tomato
        </h1>
        <p className="text-center text-sm text-gray-500">
          Log in or sign up to continue to Tomato
        </p>
        <button onClick={googlelogin} disabled={loading} className="flex w-full items-center justify-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 text-md font-medium text-gray-700 shadow-sm">
          <FcGoogle  size={20}/>
          {loading ? "Signing in..." : "Continue with Google"}
        </button>

        <p className="text-center text-sm text-gray-400">
          By continuing, you agree to our {" "} <span className="text-[#E23774]">Terms of Service</span> & {" "} <span className="text-[#E23774]">Privacy Policy</span>.
        </p>
      </div>
    </div>
  );
};

export default Login;
