import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function ChangePassword() {
    const [data, setData] = useState({ currentPassword: "", newPassword: "" });
    const navigate = useNavigate();
  const [message, setMessage] = useState("");
  const [changed, setChanged] = useState(false);
  const api = "http://localhost:3002/user/profile/password";

  const isDisabled = !(data.currentPassword && data.newPassword);

  async function handleForm(e) {
    e.preventDefault();
    try {
      const response = await fetch(api, {
        method: "PUT",
        body: JSON.stringify(data),
        headers: {
          "Content-Type": "application/json",
          authorization: localStorage.getItem("token"),
        },
      });
      const result = await response.json();
      if (result.success) {
        setChanged(true);
          setData({ currentPassword: "", newPassword: "" });
          setTimeout(() => {
            navigate('/profile')  
          },1000)
      }
      setMessage(result.message);
    } catch (err) {
      setMessage("Error updating password");
    }
  }

  return (
    <form
      onSubmit={handleForm}
      className="flex flex-col items-center py-5 px-10 gap-5 rounded-2xl shadow shadow-violet-300 max-w-lg mx-auto"
    >
      <h1 className="text-5xl font-extrabold text-transparent bg-clip-text bg-linear-to-r from-violet-600 to-pink-400">
        Change Password
      </h1>
      <input
        type="password"
        name="currentPassword"
        placeholder="Enter Current Password"
        value={data.currentPassword}
        onChange={(e) => setData({ ...data, currentPassword: e.target.value })}
        className="border px-3 py-1 rounded-xl text-violet-500 w-full"
      />
      <input
        type="password"
        name="newPassword"
        placeholder="Enter New Password"
        value={data.newPassword}
        onChange={(e) => setData({ ...data, newPassword: e.target.value })}
        className="border px-3 py-1 rounded-xl text-violet-500 w-full"
      />
      <button
        disabled={isDisabled}
        className={`border px-3 py-1 rounded-xl w-full ${
          isDisabled
            ? "bg-violet-400"
            : "bg-violet-700 hover:bg-violet-900 cursor-pointer"
        }`}
      >
        Change Password
      </button>
      {message && (
        <div
          className={`border rounded-md text-center py-1 px-2 w-full mt-4 ${
            changed ? "text-green-700" : "text-red-700"
          }`}
        >
          {message}
        </div>
      )}
    </form>
  );
}
