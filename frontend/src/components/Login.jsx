import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from 'react-redux';
import { setLogin, setToken, setUser } from "../app/slice/user";
import toast from "react-hot-toast";
import api from '../apiConfig.js';

export default function Login() {
  const [formData, setFormData] = useState({ aadharCardNumber: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleForm = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  async function handleSubmit(e) {
    e.preventDefault();
    const loadingToast = toast.loading("Verifying credentials...");
    try {
      const response = await fetch(`${api}/user/login`, {
        method: "POST",
        body: JSON.stringify(formData),
        headers: { "Content-Type": "application/json" },
      });
      const result = await response.json();
      console.log(result);
      if (result.success) {
        toast.success("Login Successful!", { id: loadingToast });
        dispatch(setUser(result.user));
        dispatch(setLogin());
        dispatch(setToken('bearer ' + result.token));
        
        localStorage.setItem('userv', JSON.stringify(result.user));
        localStorage.setItem("isLoginv", true);
        localStorage.setItem("tokenv", "bearer " + result.token);
        
        navigate("/profile");
      } else {
        toast.error(result.message || "Login failed", { id: loadingToast });
      }
    } catch (err) {
      toast.error("Server error. Please try again.", { id: loadingToast });
    }
  }

  return (
    <div className="flex items-center justify-center min-h-[80vh]">
      <div className="w-full max-w-md p-8 rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 shadow-2xl">
        <h1 className="text-3xl font-bold text-center mb-8 bg-linear-to-r from-violet-400 to-pink-400 bg-clip-text text-transparent">
          Welcome Back
        </h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm text-gray-400 ml-1">Aadhar Number</label>
            <input
              type="number"
              name="aadharCardNumber"
              value={formData.aadharCardNumber}
              onChange={handleForm}
              className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-violet-500 transition-colors"
              placeholder="Aadhar Number"
            />
          </div>
         <div className="space-y-2">
  <label className="text-sm text-gray-400 ml-1">Password</label>
  <div className="relative">
    <input
      type={showPassword ? "text" : "password"}
      name="password"
      value={formData.password}
      onChange={handleForm}
      className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-violet-500 transition-colors pr-10"
      placeholder="Password"
    />
    <div
      onClick={() => setShowPassword(!showPassword)}
      className="text-xs absolute right-6 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors cursor-pointer"
    >
      {showPassword ? 'HIDE' : 'SHOW' }
    </div>
  </div>
</div>
          <button
            type="submit"
            className="w-full bg-violet-600 hover:bg-violet-700 text-white font-semibold py-3 rounded-xl transition-all shadow-lg shadow-violet-600/30 active:scale-95"
          >
            Login
          </button>
        </form>
        <div className="mt-6 text-center text-sm text-gray-400">
          New here? <Link to="/register" className="text-violet-400 hover:text-violet-300 font-medium">Create an account</Link>
        </div>
      </div>
    </div>
  );
}