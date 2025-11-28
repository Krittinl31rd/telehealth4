import React, { useEffect, useState } from "react";
import {
  MoreVertical,
  Download,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { toast } from "sonner";
import { user_role, user_sex } from "../../constant/enum";
import { UsersAll, UserDelete } from "../../api/usermanagement";
import Pagination from "../../components/Pagination";
import useAuthStore from "../../store/auth";
import Modal from "../../components/shared/Modal";
import Modal2 from "../../components/shared/Modal2";
import { calculateAge } from "../../hooks/helper";
const Usermanagement = () => {
  const [currentUsers, setCurrentUsers] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [focusUser, setFocusUser] = useState(null);
  const [loadingTypes, setLoadingTypes] = useState([]);
  const { token } = useAuthStore();
  const [modalOpen, setModalOpen] = useState(false);
  const [modalOpenDetail, setModalOpenDetail] = useState(false);
  const [openMenuUserId, setOpenMenuUserId] = useState(null);

  const fetchUsers = async () => {
    try {
      const res = await UsersAll(token);
      console.log("Success:", res.data);
      setAllUsers(res.data);
    } catch (err) {
      console.log("Upload error:", err);
    } finally {
      setLoadingTypes(false);
    }
  };

  useEffect(() => {
    console.log(focusUser);
  }, []);

  const handleUsersDelete = async (id) => {
    try {
      console.log(id);

      const res = await UserDelete(id, token);
      setModalOpen(false);
      toast.success(res.data.message);
      fetchUsers();
      // setAllUsers(res.data);
    } catch (err) {
      toast.error(err.response.data);
      setModalOpen(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return loadingTypes ? (
    <div className="text-center py-10">
      <span className="loading loading-spinner   loading-lg"></span>
      {/* <br /> */}
      {/* Loading measurement types... */}
    </div>
  ) : (
    <div className="w-full h-full p-0 bg-base-200 overflow-auto">
      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-xl sm:text-2xl font-semibold text-base-900">
              Manage Users
            </h1>
            <p className="text-sm text-base-500 mt-1">
              {allUsers.length} total
              <span className="hidden sm:inline">
                {" "}
                • {currentUsers.length} per page
              </span>
            </p>
          </div>
        </div>

        {/* Users Table - Desktop View */}
        <div className="hidden lg:block bg-base-100 rounded-lg shadow-sm border border-base-200">
          {/* Table Header */}
          <div className="grid grid-cols-12 gap-4 px-6 py-3 border-b border-base-200 text-xs font-medium text-base-500 uppercase">
            <div className="col-span-4">Name</div>
            <div className="col-span-4">Email</div>
            <div className="col-span-3">Role</div>
            <div className="col-span-1"></div>
          </div>

          {/* Table Body */}
          <div className="divide-y divide-base-300">
            {currentUsers.map((user) => (
              <div
                key={user.id}
                className="grid grid-cols-12 gap-4 px-6 py-4 hover:bg-base-900 transition-colors items-center relative"
              >
                <div className={`w-1 h-full absolute left-0 `}></div>

                {/* Name */}
                <div className="col-span-4 flex items-center gap-3">
                  {user.profile_image_url ? (
                    <div
                      className={`w-10 h-10 rounded-full bg-primary flex items-center justify-center overflow-hidden flex-shrink-0`}
                    >
                      <img
                        src={`${import.meta.env.VITE_API_URL}${
                          user.profile_image_url
                        }`}
                        alt={user.name[0]}
                        className="w-10 h-10 rounded-full object-cover flex-shrink-0"
                        onError={(e) => {
                          e.target.style.display = "none";
                          const fallback = document.createElement("div");
                          fallback.className =
                            "w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white font-semibold text-sm flex-shrink-0";
                          fallback.innerText = user.name[0];
                          e.target.parentNode.appendChild(fallback);
                        }}
                      />
                    </div>
                  ) : (
                    <div
                      className={`w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white font-semibold text-sm flex-shrink-0`}
                    >
                      {user.name[0]}
                    </div>
                  )}
                  <div>
                    <span className="font-medium text-base-900">
                      {user.name}
                    </span>
                  </div>
                </div>

                {/* Email */}
                <div className="col-span-4 text-base-700 text-sm">
                  {user.email}
                </div>

                {/* Role */}
                <div className="col-span-3">
                  <span className={`text-sm  `}>
                    {" "}
                    {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                  </span>
                  {user.roleLabel && (
                    <span className="text-gray-500 text-sm ml-1">
                      {user.roleLabel}
                    </span>
                  )}
                </div>

                {/* Actions */}
                <div className="col-span-1 flex justify-end">
                  {/* Desktop More Button */}
                  <div className="col-span-1 relative flex justify-end">
                    <button
                      className="p-2 hover:bg-gray-100 rounded-md transition-colors"
                      onClick={() =>
                        setOpenMenuUserId(
                          openMenuUserId === user.id ? null : user.id
                        )
                      }
                    >
                      <MoreVertical size={16} className="text-gray-400" />
                    </button>

                    {/* Dropdown */}
                    {openMenuUserId === user.id && (
                      <div className="absolute right-7 top-0 bg-base-100 border border-gray-100 rounded-md shadow-md z-50 w-40">
                        <button
                          className="w-full text-left px-4 py-2 hover:bg-gray-100 hover:text-gray-500 text-sm"
                          onClick={() => {
                            setOpenMenuUserId(null);
                            setFocusUser(user);
                            setModalOpenDetail(true);
                          }}
                        >
                          View Details
                        </button>
                        <button
                          className="w-full text-left px-4 py-2 hover:bg-gray-100 text-sm text-red-600"
                          onClick={() => {
                            setOpenMenuUserId(null);
                            setFocusUser(user);
                            setModalOpen(true);
                          }}
                        >
                          Delete User
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          {allUsers.length > 0 && (
            <Pagination
              items={allUsers}
              itemsPerPage={8}
              onChange={setCurrentUsers}
            />
          )}
        </div>

        {/* Users Cards - Mobile/Tablet View */}
        <div className="lg:hidden space-y-4">
          {currentUsers.map((user) => (
            <div
              key={user.id}
              className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 relative overflow-hidden"
            >
              <div className={`w-1 h-full absolute left-0 top-0  `}></div>

              <div className="flex items-start justify-between gap-4 ml-3">
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  {user.avatar ? (
                    <div
                      className={`w-12 h-12 rounded-full bg-primary flex items-center justify-center overflow-hidden flex-shrink-0`}
                    >
                      <img
                        src={`https://i.pravatar.cc/48?img=${user.id}`}
                        alt={user.name[0]}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ) : (
                    <div
                      className={`w-12 h-12 rounded-full bg-primary flex items-center justify-center text-white font-semibold flex-shrink-0`}
                    >
                      {user.name[0]}
                    </div>
                  )}

                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-gray-900">{user.name}</div>
                    <div className="text-sm text-gray-600 truncate mt-1">
                      {user.email}
                    </div>
                    <div className="mt-2">
                      <span className={`text-xs`}>
                        {user.role[0].toUpperCase()}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Desktop More Button */}
                <div className="col-span-1 relative flex justify-end">
                  <button
                    className="p-2 hover:bg-gray-100 rounded-md transition-colors"
                    onClick={() =>
                      setOpenMenuUserId(
                        openMenuUserId === user.id ? null : user.id
                      )
                    }
                  >
                    <MoreVertical size={16} className="text-gray-400" />
                  </button>

                  {/* Dropdown */}
                  {openMenuUserId === user.id && (
                    <div className="absolute right-6 top-1 bg-white border border-gray-200 rounded-md shadow-md z-50 w-40">
                      <button
                        className="w-full text-left px-4 py-2 hover:bg-gray-100 text-sm"
                        onClick={() => {
                          setOpenMenuUserId(null);
                          setFocusUser(user);
                          setModalOpenDetail(true);
                        }}
                      >
                        View Details
                      </button>
                      <button
                        className="w-full text-left px-4 py-2 hover:bg-gray-100 text-sm text-red-600"
                        onClick={() => {
                          setOpenMenuUserId(null);
                          setFocusUser(user);
                          setModalOpen(true);
                        }}
                      >
                        Delete User
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}

          {/* Mobile Pagination */}
          {allUsers.length > 0 && (
            <Pagination
              items={allUsers}
              itemsPerPage={8}
              onChange={setCurrentUsers}
            />
          )}
        </div>
      </div>
      {/* DELETE MODAL */}

      <Modal2
        title="View Profile"
        open={modalOpenDetail}
        onClose={() => setModalOpenDetail(false)}
      >
        <div className="bg-white p-6 rounded-xl shadow-lg w-full max-w-sm mx-auto">
          <div className="flex flex-col items-center text-center space-y-3">
            {/* Avatar */}
            <div className="avatar">
              <div className="w-24 h-24 rounded-full ring ring-primary ring-offset-2 shadow-md">
                <img
                  src={`${import.meta.env.VITE_API_URL}${
                    focusUser?.profile_image_url
                  }`}
                  alt={focusUser?.name[0]}
                  onError={(e) => {
                    e.target.style.display = "none";
                    const fallback = document.createElement("div");
                    fallback.className =
                      "w-24 h-24 rounded-full bg-primary flex items-center justify-center text-white font-semibold text-3xl";
                    fallback.innerText = focusUser.name[0];
                    e.target.parentNode.appendChild(fallback);
                  }}
                />
              </div>
            </div>

            {/* Info */}
            <div className="space-y-3 w-full">
              <div>
                <p className="text-sm text-gray-500 uppercase tracking-wide">
                  Name
                </p>
                <p className="text-lg font-medium">{focusUser?.name}</p>
              </div>

              <div className="w-full h-px bg-gray-200"></div>

              <div>
                <p className="text-sm text-gray-500 uppercase tracking-wide">
                  ID Card
                </p>
                <p>
                  {focusUser?.id_card.slice(0, 2) +
                    "XXXXXX" +
                    focusUser?.id_card.slice(9, 13)}
                </p>
              </div>

              <div className="w-full h-px bg-gray-200"></div>

              <div>
                <p className="text-sm text-gray-500 uppercase tracking-wide">
                  Sex
                </p>
                <p>
                  {
                    user_sex.find((x) => x.value.toString() == focusUser?.sex)
                      ?.label
                  }
                </p>
              </div>

              <div className="w-full h-px bg-gray-200"></div>

              <div>
                <p className="text-sm text-gray-500 uppercase tracking-wide">
                  Email
                </p>
                <p>{focusUser?.email}</p>
              </div>

              <div className="w-full h-px bg-gray-200"></div>

              <div>
                <p className="text-sm text-gray-500 uppercase tracking-wide">
                  Role
                </p>
                <p className="capitalize">{focusUser?.role}</p>
              </div>

              <div className="w-full h-px bg-gray-200"></div>

              <div>
                <p className="text-sm text-gray-500 uppercase tracking-wide">
                  Birthday
                </p>
                <p>{focusUser?.birthday}</p>
              </div>

              <div className="w-full h-px bg-gray-200"></div>

              <div>
                <p className="text-sm text-gray-500 uppercase tracking-wide">
                  Age
                </p>
                <p>{calculateAge(focusUser?.birthday)}</p>
              </div>
            </div>
          </div>
        </div>
      </Modal2>

      <Modal
        title={`Delete ${focusUser?.name}?`}
        children="Are you sure?"
        show={modalOpen}
        onClose={() => setModalOpen(false)}
        confirm={() => handleUsersDelete(focusUser?.id)}
      ></Modal>
    </div>
  );
};

export default Usermanagement;
