import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const [user, setUser] = useState({});
  const navigate = useNavigate();
  const api = "http://localhost:3002/user/profile";

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await fetch(api, {
          headers: { authorization: localStorage.getItem("token") },
        });
        const data = await response.json();
        if (data.success) setUser(data.getUser);
      } catch (err) {
        console.error("Error fetching profile:", err);
      }
    };
    fetchProfile();
  }, []);

  const fields = [
    { label: "Name", value: user.name },
    { label: "Age", value: user.age },
    { label: "Email", value: user.email },
    { label: "Mobile", value: user.mobile },
    { label: "Aadhar No.", value: user.aadharCardNumber },
    { label: "Voted", value: user.isVoted ? "✅ Yes" : "❌ No" },
  ];

  return (
    <>
      <h1 className="text-5xl text-center mt-12 font-extrabold bg-linear-to-r from-violet-600 to-pink-400 bg-clip-text text-transparent">
        Profile
      </h1>

      <div className="flex flex-col justify-center items-center w-[90vw] sm:w-[600px] mx-auto mt-16 rounded-2xl py-10 px-6 backdrop-blur-md bg-white/10 shadow-lg shadow-violet-500/40 gap-6 relative">
        {fields.map((f, i) => (
          <div
            key={i}
            className="grid grid-cols-2 gap-6 items-center text-lg w-full"
          >
            <div className="text-gray-400">{f.label}</div>
            <div className="font-semibold text-white">{f.value}</div>
          </div>
        ))}

        <button
          className="bg-blue-600 text-white absolute -bottom-15 right-2 px-5 py-2 rounded-lg hover:bg-blue-500"
          onClick={() => navigate("/changepassword")}
        >
          Change Password
        </button>
      </div>
    </>
  );
};

export default Profile;
