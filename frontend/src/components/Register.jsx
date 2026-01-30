import { useState, useEffect } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { toast } from "react-hot-toast";
import api from '../apiConfig.js';

export default function Register() {
  const [formData, setFormData] = useState({
    name: "",
    age: "",
    email: "",
    mobile: "",
    aadharCardNumber: "",
    password: "",
  });

  const [params] = useSearchParams();
  const voterId = params.get("id");
  const token = useSelector((state) => state.user.token);
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  // Fetch Logic
  useEffect(() => {
    if (voterId) {
      const getVoterData = async () => {
        const loadingToast = toast.loading("Loading voter details...");
        try {
          const response = await fetch(
            `${api}/user/get-voter/${voterId}`,
            {
              headers: { authorization: token },
            },
          );
          const result = await response.json();
          if (result.success) {
            toast.dismiss(loadingToast);
            setFormData({ ...result.voter, password: "********" });
          } else {
            throw new Error(result.message);
          }
        } catch (error) {
          toast.error("Failed to load data", { id: loadingToast });
        }
      };
      getVoterData();
    }
  }, [voterId, token]);

  const handleForm = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const loadingToast = toast.loading(
      voterId ? "Updating..." : "Registering...",
    );

    try {
      const payload = { ...formData };
      if (voterId && payload.password === "********") {
        delete payload.password;
      }

      const url = voterId
        ? `${api}/user/update-voter/${voterId}`
        : `${api}/user/register`;

      const method = voterId ? "PUT" : "POST";
      const headers = {
        "Content-Type": "application/json",
        ...(voterId && { authorization: token }),
      };

      const response = await fetch(url, {
        method,
        headers,
        body: JSON.stringify(payload),
      });
      const result = await response.json();

      if (result.success) {
        toast.success(result.message, { id: loadingToast });

        if (voterId) {
          navigate("/voter-list");
        } else {
          setFormData({
            name: "",
            age: "",
            email: "",
            mobile: "",
            aadharCardNumber: "",
            password: "",
          });
          navigate("/login");
        }
      } else {
        throw new Error(result.message);
      }
    } catch (err) {
      toast.error(err.message || "Operation failed", { id: loadingToast });
    }
  };

  const inputClass =
    "w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-violet-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed";

  return (
    <div className="flex justify-center items-center min-h-[85vh] py-10">
      <div className="w-full max-w-2xl bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl">
        <h1 className="text-3xl font-bold text-center mb-8 bg-linear-to-r from-violet-400 to-pink-400 bg-clip-text text-transparent">
          {voterId ? "Update Voter Details" : "Create Account"}
        </h1>

        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          <div className="md:col-span-2">
            <input
              type="text"
              name="name"
              placeholder="Full Name"
              value={formData.name}
              onChange={handleForm}
              className={inputClass}
              required
            />
          </div>

          <input
            type="number"
            name="age"
            placeholder="Age"
            value={formData.age}
            onChange={handleForm}
            className={inputClass}
            required
          />
          <input
            type="text"
            name="mobile"
            placeholder="Mobile Number"
            value={formData.mobile}
            onChange={handleForm}
            className={inputClass}
          />

          <div className="md:col-span-2">
            <input
              type="email"
              name="email"
              placeholder="Email Address"
              value={formData.email}
              onChange={handleForm}
              className={inputClass}
            />
          </div>

          <input
            type="number"
            name="aadharCardNumber"
            placeholder="Aadhar Number"
            disabled={!!voterId}
            value={formData.aadharCardNumber}
            onChange={handleForm}
            className={inputClass}
            required
          />
            <div className="relative">
              <input
            type={showPassword?"text":"password"}
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleForm}
            className={inputClass}
            required={!voterId}
            disabled={!!voterId}
          />
              {!voterId && <div
                onClick={() => setShowPassword(!showPassword)}
                className="text-xs absolute right-6 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors cursor-pointer"
              >
                {showPassword ? "HIDE" : "SHOW"}
              </div>}
            </div>
          <button className="md:col-span-2 mt-4 w-full bg-violet-600 hover:bg-violet-700 text-white font-bold py-3 rounded-xl transition-all shadow-lg shadow-violet-600/30 active:scale-95">
            {voterId ? "Update Data" : "Register"}
          </button>
        </form>

        {!voterId && (
          <div className="mt-6 text-center text-sm text-gray-400">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-violet-400 hover:text-violet-300 font-medium border-b border-violet-400/50 pb-0.5"
            >
              Login here
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
