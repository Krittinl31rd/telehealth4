import React, { useState } from "react";
import { Upload, User } from "lucide-react";
import { user_role, user_sex } from "../constant/enum";
import useAuthStore from "../store/auth";

const Profile = () => {
  const { user } = useAuthStore();
  const [userImage, setUserImage] = useState(null);
  const [authenImage, setAuthenImage] = useState(null);
  const [formData, setFormData] = useState({
    name: user.name,
    email: user.email,
    idCard: user.id_card,
    dateOfBirth: "",
    gender: user.user_sex,
    address: "",
  });

  const handleImageUpload = (e, type) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (type === "user") {
          setUserImage(reader.result);
        } else {
          setAuthenImage(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSave = () => {
    console.log("Form Data:", formData);
    console.log("User Image:", userImage);
    console.log("Authen Image:", authenImage);
    alert("Profile saved successfully!");
  };

  const ImageUploadSection = ({ image, onUpload, label, inputId }) => (
    <div className="w-full flex flex-col justify-center items-center">
      <div className="relative group">
        <div className="w-36 h-36 rounded-full overflow-hidden bg-base-100 flex items-center justify-center border-4 border-base-content/20">
          {image ? (
            <img
              src={image}
              alt={label}
              className="w-full h-full object-cover"
            />
          ) : (
            <User className="w-16 h-16 text-base-content/50" />
          )}
        </div>
        <label
          htmlFor={inputId}
          className="absolute inset-0 rounded-full bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 cursor-pointer transition-opacity"
        >
          <Upload className="w-8 h-8 text-white" />
        </label>
        <input
          id={inputId}
          type="file"
          accept="image/*"
          onChange={(e) => onUpload(e)}
          className="hidden"
        />
      </div>
      <p className="text-xl mt-4">{label}</p>
    </div>
  );

  return (
    <div className="w-full min-h-screen p-2 sm:p-4 bg-base-200 overflow-auto">
      <div className="max-w-7xl mx-auto rounded-lg bg-base-100 p-3 sm:p-6">
        <div className="text-xl sm:text-2xl font-semibold mb-4 sm:mb-6">
          Setting Profile
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 lg:gap-8 w-full">
          {/* Image Upload Section */}
          <div className="lg:col-span-2 space-y-8 sm:space-y-12">
            <ImageUploadSection
              image={userImage}
              onUpload={(e) => handleImageUpload(e, "user")}
              label="User Profile"
              inputId="user-upload"
            />
            <ImageUploadSection
              image={authenImage}
              onUpload={(e) => handleImageUpload(e, "authen")}
              label="Authen Profile"
              inputId="authen-upload"
            />
          </div>

          {/* Form Section */}
          <div className="lg:col-span-3">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
              {/* Left Column */}
              <div className="space-y-4 sm:space-y-6">
                <div className="flex flex-col">
                  <label className="text-lg mb-2">Name</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="input input-bordered h-12 text-lg"
                    placeholder="Enter your name"
                  />
                </div>

                <div className="flex flex-col">
                  <label className="text-lg mb-2">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="input input-bordered h-12 text-lg"
                    placeholder="Enter your email"
                  />
                </div>

                <div className="flex flex-col">
                  <label className="text-lg mb-2">ID Card</label>
                  <input
                    type="text"
                    name="idCard"
                    value={formData.idCard}
                    onChange={handleInputChange}
                    className="input input-bordered h-12 text-lg"
                    placeholder="Enter your ID card"
                  />
                </div>
              </div>

              {/* Right Column */}
              <div className="space-y-4 sm:space-y-6">
                <div className="flex flex-col">
                  <label className="text-lg mb-2">Date of Birth</label>
                  <input
                    type="date"
                    name="dateOfBirth"
                    value={formData.dateOfBirth}
                    onChange={handleInputChange}
                    className="input h-12 text-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="flex flex-col">
                  <label className="text-lg mb-2">Gender</label>
                  <select
                    name="gender"
                    value={formData.gender}
                    onChange={handleInputChange}
                    className="select h-12 text-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="" disabled>
                      Pick a gender
                    </option>
                    {user_sex.map((item, idx) => (
                      <option key={idx} value={item.value}>
                        {item.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex flex-col">
                  <label className="text-lg mb-2">Address</label>
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    className="input h-12 text-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter your address"
                  />
                </div>
              </div>

              <div className="grid col-span-2  md:grid-cols-4 gap-4 sm:gap-6">
                <div className="md:col-span-3 mt-4">
                  <button
                    // onClick={loginGoogle}
                    className="btn btn-lg btn-block border-base-content/30 bg-base-100 shadow-md"
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
                    Link with Google
                  </button>
                </div>
                <div className="flex md:col-span-1 mt-4 justify-start items-center ">
                  Enable
                </div>
              </div>

              {/* Save Button */}
              <div className="md:col-span-2 mt-4">
                <button
                  onClick={handleSave}
                  className="btn btn-lg btn-block border-base-content/30 bg-base-100 shadow-md"
                >
                  Save Profile
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
