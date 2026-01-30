import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

// Helper sub-component
const InfoRow = ({ label, value, font = "" }) => (
  <div className="flex justify-between items-center py-3 border-b border-white/5">
    <span className="text-gray-400">{label}</span>
    <span className={`text-white font-medium ${font}`}>{value}</span>
  </div>
);

const Profile = () => {
  const navigate = useNavigate();
  const user = useSelector(state => state.user.user);
  if (!user) return null;

  return (
    <div className="flex flex-col items-center mt-2 px-4">
      <div className="relative w-full max-w-md">
        
        <div className="absolute -inset-1 bg-linear-to-r from-violet-600 to-pink-600 rounded-2xl blur opacity-75"></div>
        
        {/* Card Content */}
        <div className="relative bg-gray-900 rounded-2xl p-8 border border-white/10 shadow-2xl">
          <div className="text-center mb-8">
            <div className="w-20 h-20 bg-linear-to-tr from-violet-500 to-fuchsia-500 rounded-full mx-auto flex items-center justify-center text-3xl mb-4 shadow-lg shadow-violet-500/30">
              👤
            </div>
            <h1 className="text-3xl font-bold text-white">{user.name}</h1>
            <p className="text-gray-400 font-mono text-sm tracking-widest">{user.role === 'admin' ? 'ADMINISTRATOR' : 'REGISTERED VOTER'}</p>
          </div>

          <div className="space-y-4">
            <InfoRow label="Aadhar ID" value={user.aadharCardNumber} font="font-mono" />
            <InfoRow label="Email" value={user.email || 'N/A'} />
            <InfoRow label="Mobile" value={user.mobile || 'N/A'} />
            <InfoRow label="Age" value={`${user.age} Years`} />
            
            <div className="flex justify-between items-center py-3 border-b border-white/5">
              <span className="text-gray-400">Voting Status</span>
              <span className={`px-3 py-1 rounded-full text-sm font-bold ${user.isVoted ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                {user.role==='admin'?"Admin Can't Vote":(user.isVoted ? "Has Voted" : "Not Voted")}
              </span>
            </div>
          </div>

          <button
            onClick={() => navigate("/changepassword")}
            className="w-full mt-8 border border-white/20 hover:bg-white/5 text-white py-2 rounded-xl transition-colors text-sm font-medium"
          >
            Change Password
          </button>
        </div>
      </div>
    </div>
  );
};



export default Profile;