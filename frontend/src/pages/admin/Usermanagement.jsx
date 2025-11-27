import React, { useEffect, useState } from "react";
import {
  MoreVertical,
  Download,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { user_role } from "../../constant/enum";
import { UsersAll } from "../../api/usermanagement";
import Pagination from "../../components/Pagination";
import useAuthStore from "../../store/auth";

const Usermanagement = () => {
  const [currentUsers, setCurrentUsers] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [loadingTypes, setLoadingTypes] = useState([]);
  const { token } = useAuthStore();

  useEffect(() => {
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

    fetchUsers();
  }, []);

  return loadingTypes ? (
    <div></div>
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
                        alt={user.name}
                        className="w-full h-full object-cover"
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
                  <button className="p-2 hover:bg-gray-100 rounded-md transition-colors">
                    <MoreVertical size={16} className="text-gray-400" />
                  </button>
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
                        alt={user.name}
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

                <button className="p-2 hover:bg-gray-100 rounded-md transition-colors flex-shrink-0">
                  <MoreVertical size={16} className="text-gray-400" />
                </button>
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
    </div>
  );
};

export default Usermanagement;
