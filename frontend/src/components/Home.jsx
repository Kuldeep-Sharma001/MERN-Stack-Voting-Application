import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

export default function Home() {
  const navigate = useNavigate();
  const isLogin = useSelector((state) => state.user.isLogin);

  return (
    <div className="flex flex-col lg:flex-row items-center justify-between min-h-[calc(100vh-8rem)] px-6 lg:px-20 py-10 max-w-7xl mx-auto">
      {/* Text Section */}
      <div className="lg:w-1/2 flex flex-col gap-6 text-center lg:text-left z-10">
        <h1 className="text-5xl lg:text-7xl font-extrabold leading-tight">
          <span className="text-white">Your Voice,</span> <br />
          <span className="bg-linear-to-r from-orange-400 to-red-500 bg-clip-text text-transparent">
            Our Future.
          </span>
        </h1>
        <p className="text-gray-300 text-lg lg:text-xl max-w-lg mx-auto lg:mx-0 leading-relaxed">
          Secure, transparent, and digital voting is now at your fingertips. 
          Participate in building the nation's destiny today.
        </p>
        
        <div className="mt-4">
          {!isLogin && (
            <button 
              onClick={() => navigate('/login')}
              className="bg-white text-violet-900 font-bold px-8 py-3 rounded-full hover:bg-gray-200 transition-all shadow-[0_0_20px_rgba(255,255,255,0.3)] active:scale-95"
            >
              Get Started
            </button>
          )}
          {isLogin && (
            <button 
              onClick={() => navigate('/vote')}
              className="bg-linear-to-r from-violet-600 to-indigo-600 text-white font-bold px-8 py-3 rounded-full hover:shadow-lg transition-all shadow-violet-500/30 active:scale-95"
            >
              Go Vote Now
            </button>
          )}
        </div>
      </div>


      <div className="lg:w-1/2 mt-10 lg:mt-0 relative flex justify-center">
        <div className="absolute inset-0 bg-violet-500/20 blur-[100px] rounded-full"></div>
        <img
          src="/image.png"
          alt="Voting illustration"
          className="relative z-10 w-full max-w-[500px] drop-shadow-2xl rounded-2xl hover:scale-105 transition-transform duration-500"
        />
      </div>
    </div>
  );
}