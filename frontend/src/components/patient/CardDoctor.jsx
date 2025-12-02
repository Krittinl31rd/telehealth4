import React, { useEffect, useState } from "react";
import Modal2 from "../../components/shared/Modal2";
import { User } from "lucide-react";
const CardDoctor = ({ doctors, setStep }) => {
  const path_img = import.meta.env.VITE_API_URL;
  const [selectDoctor, setSelectDoctor] = useState(null);
  const [viewProfile, setViewProfile] = useState(false);

  const handleSelect = (item) => {
    setSelectDoctor(item);
    setViewProfile(true);
  };

  return (
    <>
      {doctors.length == 0 ? (
        <div className="flex flex-col items-center justify-center">
          <p className="px-10 text-center">Sorry, Not found doctor online.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {doctors.map((item, idx) => (
            <div
              key={idx}
              className="w-full flex flex-col items-center justify-center p-4 rounded-field h-52 bg-base-100 shadow-lg space-y-2"
            >
              {/* head */}
              <div className="w-full flex items-center gap-4">
                <div className="w-20 h-20 relative">
                  <div
                    className={`absolute w-4 h-4 right-[2%] bottom-[10%]  rounded-full border border-base-100 ${
                      item.status == 0 ? "bg-red-600" : "bg-green-600"
                    }`}
                  ></div>
                  <div className="w-full h-full rounded-full overflow-hidden  flex items-center justify-center bg-base-200 ">
                    {item.profile_image_url ? (
                      <img
                        src={`${path_img}${item?.profile_image_url}`}
                        alt="Profile"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <User className="w-20 h-20 text-gray-400" />
                    )}
                  </div>
                </div>
                <div className="flex-1">
                  <h1 className="font-bold text-lg">Dr. {item?.name}</h1>
                  <h6 className="font-semibold text-primary text-sm">
                    {item?.sep_name}
                  </h6>
                </div>
              </div>
              {/* body */}
              <div className="flex-1 overflow-auto">
                <p className="text-xs font-semibold">{item?.profile_detail}</p>
              </div>
              {/* foot */}
              <div className="w-full grid grid-cols-2 gap-2">
                <button
                  onClick={() => handleSelect(item)}
                  className="btn btn-sm btn-outline btn-primary "
                >
                  View Profile
                </button>
                <button className="btn btn-sm btn-primary">Schedule</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {setViewProfile && (
        <Modal2
          open={viewProfile}
          onClose={() => setViewProfile(false)}
          title={`View Profile Dr.${selectDoctor?.name}`}
          width="w-xl"
        >
          <div className="w-full space-y-2">
            <div className="w-full flex items-center justify-center gap-4">
              <div className="avatar">
                <div className="w-24 rounded-full ">
                  <img
                    src={`${path_img}${selectDoctor?.profile_image_url}`}
                    alt="Profile"
                  />
                </div>
              </div>
              <ul className="flex-1">
                <li>
                  <span className="font-semibold">Specialization:</span>{" "}
                  {selectDoctor?.sep_name || "-"}
                </li>
                <li>
                  <span className="font-semibold">License Number:</span>{" "}
                  {selectDoctor?.license_number || "-"}
                </li>
                <li>
                  <span className="font-semibold">Years of Experience:</span>{" "}
                  {selectDoctor?.years_of_experience || "-"}
                </li>
                <li>
                  <span className="font-semibold">Affiliated Hospital:</span>{" "}
                  {selectDoctor?.affiliated_hospital || "-"}
                </li>
              </ul>
            </div>

            <h1 className="text-xl font-bold">About Dr.{selectDoctor?.name}</h1>
            <p className="font-semibold text-sm text-base-content/80">
              {selectDoctor?.profile_detail}
            </p>
          </div>
        </Modal2>
      )}
    </>
  );
};

export default CardDoctor;
