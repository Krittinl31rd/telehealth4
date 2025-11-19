import React, { useState, useEffect } from "react";
import useAuthStore from "../store/auth";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "sonner";
// import { role } from "../constant/enum";

const Login = () => {
  const { token, user, actionLogin } = useAuthStore();
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    if (!username || !password) {
      toast.warning("Please fill in all fields");
      return;
    }

    try {
      const form = { username, password };
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/login`,
        form
      );
      const { token, user, message } = res.data;
      actionLogin({ token: token, user: user });
      setUsername("");
      setPassword("");
      toast.success(message);
      // if (user?.role_id == role.admin) {
      //   navigate("/admin");
      // } else {
      //   navigate("/user");
      // }
    } catch (err) {
      const msg = err.response?.data?.message;
      toast.error(msg);
    } finally {
      setIsLoading(false);
    }
  };

  // useEffect(() => {
  //   if (token || user) {
  //     if (user.role_id == role.admin) {
  //       navigate("/admin");
  //     } else {
  //       navigate("/user");
  //     }
  //   }
  // }, [token, user]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-base to-base-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="card bg-base-300 shadow-xl">
          <div className="card-body">
            <h2 className="card-title text-2xl font-bold text-center mb-6 text-base-content">
              Login
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Username Field */}
              <div className="form-control w-full">
                <label className="label">
                  <span className="label-text font-semibold text-base-content">
                    Username
                  </span>
                </label>
                <input
                  type="text"
                  placeholder="Enter your username"
                  className="input input-bordered w-full "
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </div>

              {/* Password Field */}
              <div className="form-control w-full">
                <label className="label">
                  <span className="label-text font-semibold text-base-content">
                    Password
                  </span>
                </label>
                <input
                  type="password"
                  placeholder="Enter your password"
                  className="input input-bordered w-full "
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>

              <button
                onClick={handleSubmit}
                className="btn btn-primary w-full mt-6"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <span className="loading loading-spinner loading-sm"></span>
                    Logging in...
                  </>
                ) : (
                  "Login"
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
