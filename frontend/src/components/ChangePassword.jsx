import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";
import api from '../apiConfig.js';

export default function ChangePassword() {
  const [data, setData] = useState({ currentPassword: "", newPassword: "" });
  const navigate = useNavigate();
  const token = useSelector(state => state.user.token);

  async function handleForm(e) {
    e.preventDefault();
    const loadToast = toast.loading('Updating password...');
    try {
      const response = await fetch(`${api}/user/profile/password`, {
        method: "PUT",
        body: JSON.stringify(data),
        headers: { "Content-Type": "application/json", authorization: token },
      });
      const result = await response.json();
      
      if (result.success) {
        toast.success("Password Updated!", { id: loadToast });
        setData({ currentPassword: "", newPassword: "" });
        setTimeout(() => navigate('/profile'), 1000);
      } else {
        throw new Error(result.message);
      }
    } catch (err) {
      toast.error(err.message || "Update failed", { id: loadToast });
    }
  }

  return (
    <div className="flex justify-center items-center min-h-[70vh]">
      <div className="w-full max-w-md bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl p-8">
        <h1 className="text-2xl font-bold text-center mb-6 text-white">Security Settings</h1>
        <form onSubmit={handleForm} className="space-y-4">
          <input
            type="password"
            placeholder="Current Password"
            value={data.currentPassword}
            onChange={(e) => setData({ ...data, currentPassword: e.target.value })}
            className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500 transition-colors"
          />
          
          <input
            type="password"
            placeholder="New Password"
            value={data.newPassword}
            onChange={(e) => setData({ ...data, newPassword: e.target.value })}
            className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500 transition-colors"
          />
          <button 
            disabled={!data.currentPassword || !data.newPassword}
            className="w-full mt-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white font-bold py-3 rounded-xl transition-all"
          >
            Update Password
          </button>
        </form>
      </div>
    </div>
  );
}