import React, { useState, useEffect } from "react";
import useAuthStore from "../store/auth";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "sonner";
import { user_role, user_sex } from "../constant/enum";
import loginImage from "../assets/img/login_img.png";

const Login = () => {
  const { token, user, actionLogin } = useAuthStore();
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    name: "",
    email: "",
    date: "",
    gender: "",
    password: "",
    passwordConfirm: "",
  });
  const [passwordError, setPasswordError] = useState("");

  const clearForm = () => {
    setForm({
      name: "",
      email: "",
      date: "",
      gender: "",
      password: "",
      passwordConfirm: "",
    });
  };

  const handleStep = async (e) => {
    e.preventDefault();

    if (!form.email) return toast.warning("Email is required.");

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(form.email)) {
      return toast.warning("Email format is invalid.");
    }

    setStep(2);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.email || !form.password) {
      toast.warning("Email or Password is required");
      return;
    }
    try {
      const res = await axios.post(`${import.meta.env.VITE_API_URL}/login`, {
        email: form.email,
        password: form.password,
      });
      const { token, user, message } = res.data;
      actionLogin({ token: token, user: user });
      clearForm();
      toast.success(message);
      if (user?.role == user_role.a) {
        navigate("/admin");
      } else if (user?.role == user_role.d) {
        navigate("/doctor");
      } else if (user?.role == user_role.p) {
        navigate("/patient");
      }
    } catch (err) {
      const msg = err.response?.data?.message;
      toast.error(msg + ", Please Registration");
      setForm({ ...form, password: "" });
      setStep(3);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    // check ""
    for (const [field, value] of Object.entries(form)) {
      if (value.trim() == "") {
        return toast.warning(`${field} is required.`);
      }
    }

    // check email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(form.email)) {
      return toast.warning("Email format is invalid.");
    }

    // check pass
    if (form.password != form.passwordConfirm) {
      return toast.warning("Password and confirm password do not match.");
    }

    const payload = {
      role: user_role.p,
      name: form.name,
      birthday: form.date,
      sex: Number(form.gender),
      email: form.email,
      password: form.password,
    };

    try {
      console.log("Registering with:", payload);
    } catch (err) {
      console.error(err);
      const msg = err.response?.data?.message;
      toast.error(msg || "Registration failed.");
    }
  };

  const handlePassword = (e) => {
    const password = e.target.value;
    setForm({ ...form, password });

    if (form.passwordConfirm && form.passwordConfirm != password) {
      setPasswordError("Password mismatch");
    } else {
      setPasswordError("");
    }
  };

  const handlePasswordConfirm = (e) => {
    const confirm = e.target.value;
    setForm({ ...form, passwordConfirm: confirm });

    if (confirm != form.password) {
      setPasswordError("Password mismatch");
    } else {
      setPasswordError("");
    }
  };

  useEffect(() => {
    if (token || user) {
      if (user?.role == user_role.a) {
        navigate("/admin");
      } else if (user?.role == user_role.d) {
        navigate("/doctor");
      } else if (user?.role == user_role.p) {
        navigate("/patient");
      }
    }
  }, [token, user]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-base to-base-100 flex items-center justify-center p-4">
      <div className="card card-side bg-base-100 shadow-xl max-w-3xl ">
        <figure className="hidden sm:block flex-1">
          <img
            src={loginImage}
            alt="Doctor"
            className="w-full h-full object-cover"
          />
        </figure>

        <div className="card-body flex-1">
          {step == 2 && (
            <div className="mb-2">
              <button
                onClick={() => setStep(1)}
                className="btn btn-link btn-neutral p-0"
              >
                {"<"} Back
              </button>
            </div>
          )}
          {step == 3 && (
            <div className="mb-0">
              <button
                onClick={() => setStep(1)}
                className="btn btn-link btn-neutral p-0"
              >
                {"<"} Back to Login page
              </button>
            </div>
          )}

          {(step == 1 || step == 2) && (
            <h2 className="text-2xl font-bold text-center mb-6 text-base-content">
              Welcome to Telehealth
            </h2>
          )}

          {step == 3 && (
            <h2 className="text-2xl font-bold text-left mb-0 text-base-content">
              Registration
            </h2>
          )}

          {(step == 1 || step == 2) && (
            <>
              {step == 1 && (
                <div className="mb-4">
                  <label htmlFor="email" className="label mb-2">
                    <span className="label-text font-bold text-base-content">
                      Please enter your email
                    </span>
                  </label>
                  <input
                    id="email"
                    type="email"
                    placeholder="Email"
                    className="input  input-neutral input-lg w-full "
                    value={form.email}
                    onChange={(e) =>
                      setForm({ ...form, email: e.target.value })
                    }
                    required
                  />
                </div>
              )}

              {step == 2 && (
                <>
                  <h2 className="font-bold text-base-content mb-4">
                    Login as {form.email}
                  </h2>
                  <div className="">
                    <input
                      type="password"
                      placeholder="Password"
                      className="input  input-neutral input-lg w-full "
                      value={form.password}
                      onChange={(e) =>
                        setForm({ ...form, password: e.target.value })
                      }
                    />
                  </div>
                </>
              )}

              <button
                onClick={step == 1 ? handleStep : step == 2 && handleSubmit}
                className="btn btn-block bg-black text-white btn-lg"
              >
                Continue
              </button>
              <div className="divider">Or</div>
              <button
                // onClick={loginGoogle}
                className="btn btn-lg btn-block border-black bg-base-100 shadow-md"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  aria-label="Google logo"
                  width="16"
                  height="16"
                  x="0px"
                  y="0px"
                  viewBox="0 0 48 48"
                >
                  <path
                    fill="#FFC107"
                    d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"
                  ></path>
                  <path
                    fill="#FF3D00"
                    d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"
                  ></path>
                  <path
                    fill="#4CAF50"
                    d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"
                  ></path>
                  <path
                    fill="#1976D2"
                    d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"
                  ></path>
                </svg>
                Continue with Google Account
              </button>
            </>
          )}

          {step == 3 && (
            <>
              <div>
                <label htmlFor="name" className="label mb-1">
                  <span className="label-text font-bold text-base-content">
                    Name
                  </span>
                </label>
                <input
                  id="name"
                  type="text"
                  placeholder="Name"
                  className="input  input-neutral input-lg w-full "
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  required
                />
              </div>
              <div>
                <label htmlFor="email_register" className="label mb-1">
                  <span className="label-text font-bold text-base-content">
                    Email
                  </span>
                </label>
                <input
                  id="email_register"
                  type="text"
                  placeholder="Name"
                  className="input  input-neutral input-lg w-full "
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  required
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <div>
                  <label htmlFor="date_of_brith" className="label mb-1">
                    <span className="label-text font-bold text-base-content">
                      Date of birth
                    </span>
                  </label>
                  <input
                    id="date_of_brith"
                    type="date"
                    placeholder="Name"
                    className="input  input-neutral input-lg w-full "
                    value={form.date}
                    onChange={(e) => setForm({ ...form, date: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <label htmlFor="gender" className="label mb-1">
                    <span className="label-text font-bold text-base-content">
                      Gender
                    </span>
                  </label>
                  <select
                    defaultValue="Pick a gender"
                    className="select select-neutral select-lg w-full"
                    onChange={(e) =>
                      setForm({ ...form, gender: e.target.value })
                    }
                    required
                  >
                    <option disabled={true}>Pick a gender</option>
                    {user_sex.map((item, idx) => (
                      <option key={idx} value={item.value}>
                        {item.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div>
                <label className="label mb-1">
                  <span className="label-text font-bold text-base-content">
                    Password
                  </span>
                </label>
                <input
                  type="password"
                  placeholder="Password"
                  className="input input-neutral input-lg w-full"
                  value={form.password}
                  onChange={handlePassword}
                  required
                />
              </div>
              <div className="">
                <input
                  type="password"
                  placeholder="Confirm Password"
                  className={`input input-neutral input-lg w-full ${
                    passwordError && "bg-red-50 border-red-500"
                  }`}
                  value={form.passwordConfirm}
                  onChange={handlePasswordConfirm}
                  required
                />
              </div>

              {passwordError && (
                <p className="text-red-500 text-xs  text-end font-bold">
                  {passwordError}
                </p>
              )}

              <button
                onClick={handleRegister}
                className="btn btn-block bg-black text-white btn-lg"
              >
                Continue
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Login;
