import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function Login() {
  const [formData, setFormData] = useState({
    aadharCardNumber: "",
    password: "",
  });
  const [message, setMessage] = useState("");
  const navigate = useNavigate();
  const api = "http://localhost:3002/user/login";

  const isDisabled = !(formData.aadharCardNumber && formData.password);

  function handleForm(e) {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      const response = await fetch(api, {
        method: "POST",
        body: JSON.stringify(formData),
        headers: { "Content-Type": "application/json" },
      });
      const result = await response.json();
      setMessage(result.message);
      if (result.success) {
        setFormData({ aadharCardNumber: "", password: "" });
        localStorage.setItem("login", true);
          localStorage.setItem("token", "bearer " + result.token);
        navigate("/profile");
      }
    } catch (err) {
      setMessage("Login failed");
    }
  }

  return (
    <div className="flex flex-col items-center p-10 rounded-2xl shadow shadow-violet-300 max-w-lg mt-25 mx-auto text-white">
      <h1 className="text-4xl font-bold">Login</h1>
      <form onSubmit={handleSubmit} className="flex flex-col w-full mt-8 gap-6">
        <input
          type="text"
          name="aadharCardNumber"
          placeholder="Enter Your Aadhar Number..."
          value={formData.aadharCardNumber}
          onChange={handleForm}
          className="border px-3 py-1 rounded-xl text-violet-500"
        />
        <input
          type="password"
          name="password"
          placeholder="Enter Your Password..."
          value={formData.password}
          onChange={handleForm}
          className="border px-3 py-1 rounded-xl text-violet-500"
        />
        <button
          disabled={isDisabled}
          className={`border px-3 py-1 rounded-xl ${
            isDisabled
              ? "bg-violet-400"
              : "bg-violet-700 hover:bg-violet-900 cursor-pointer"
          }`}
        >
          Login
        </button>
      </form>
      {message && (
        <div className="text-red-600 border rounded-md text-center py-1 px-2 w-full mt-4">
          {message}
        </div>
      )}
      <div className="mt-1 w-full text-sm">
        <div>Didn't register yet?</div>
        <Link to="/register" className="text-blue-600 border-b">
          Register now
        </Link>
      </div>
    </div>
  );
}
