import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function Register() {
  const [formData, setFormData] = useState({
    name: "",
    age: "",
    email: "",
    mobile: "",
    role: "voter",
    aadharCardNumber: "",
    password: "",
  });
  const navigate = useNavigate();
  const api = "http://localhost:3002/user/register";

  const handleForm = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const isDisabled = !(
    formData.name &&
    formData.aadharCardNumber &&
    formData.age &&
    formData.password
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(api, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const result = await response.json();
      if (result.success) {
        setFormData({
          name: "",
          age: "",
          email: "",
          mobile: "",
          role: "voter",
          aadharCardNumber: "",
          password: "",
        });
        navigate("/login");
      }
    } catch (err) {
      console.error("Registration failed:", err);
    }
  };

  return (
    <div className="flex flex-col justify-center text-white items-center mt-10 mx-5 p-10 rounded-2xl shadow shadow-violet-300 max-w-lg sm:mx-auto">
      <h1 className="text-4xl font-bold">Registration</h1>
      <form className="flex flex-col w-full mt-8 gap-4" onSubmit={handleSubmit}>
        <input
          type="text"
          name="name"
          placeholder="Full Name"
          value={formData.name}
          onChange={handleForm}
          className="border px-3 py-1 rounded-xl text-violet-500"
        />
        <input
          type="number"
          name="age"
          placeholder="Age"
          value={formData.age}
          onChange={handleForm}
          className="border px-3 py-1 rounded-xl text-violet-500"
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleForm}
          className="border px-3 py-1 rounded-xl text-violet-500"
        />
        <input
          type="text"
          name="mobile"
          placeholder="Mobile"
          value={formData.mobile}
          onChange={handleForm}
          className="border px-3 py-1 rounded-xl text-violet-500"
        />
        <select
          name="role"
          value={formData.role}
          onChange={handleForm}
          className="border px-3 py-1 rounded-xl text-violet-500"
        >
          <option value="admin">Admin</option>
          <option value="voter">Voter</option>
        </select>
        <input
          type="text"
          name="aadharCardNumber"
          placeholder="Aadhar Number"
          value={formData.aadharCardNumber}
          onChange={handleForm}
          className="border px-3 py-1 rounded-xl text-violet-500"
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleForm}
          className="border px-3 py-1 rounded-xl text-violet-500"
        />
        <button
          disabled={isDisabled}
          className={`border px-3 py-1 rounded-xl ${
            isDisabled
              ? "bg-violet-400"
              : "bg-violet-700 border-violet-950 hover:bg-violet-900 cursor-pointer"
          }`}
        >
          Register
        </button>
      </form>
      <div className="mt-1 w-full text-sm text-center">
        <div>Already registered?</div>
        <Link to="/login" className="text-blue-600 border-b">
          Login now
        </Link>
      </div>
    </div>
  );
}
