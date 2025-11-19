import React from "react";
import { Link } from "react-router-dom";
import { Ban } from "lucide-react";

const UnauthPlatform = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-base-200 text-center p-6">
      <div className="text-error text-6xl mb-4">
        <Ban className="w-16 h-16" />
      </div>
      <h1 className="text-3xl font-bold mb-2">Access Denied</h1>
      <p className="text-lg text-gray-500 mb-6">
        You don't have the required platform role to access this page.
      </p>
      <Link to="/" className="btn btn-error btn-outline">
        Back to Home
      </Link>
    </div>
  );
};

export default UnauthPlatform;
