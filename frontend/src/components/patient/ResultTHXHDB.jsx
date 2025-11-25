import React from "react";
import dayjs from "dayjs";

const getCategory = (value, low, high) => {
  if (value < low) return { label: "Low", color: "text-blue-500" };
  if (value > high) return { label: "High", color: "text-red-500" };
  return { label: "Normal", color: "text-green-500" };
};

const ResultTHXHDB = ({ data }) => {
  const { value } = data.values;

  const hemoglobin_range = getCategory(value, 0, 150);

  return (
    <div className="w-full bg-base-100 rounded-xl shadow-md p-4">
      <div className="flex justify-end items-center mb-4">
        <p className="text-sm text-base-content font-semibold">
          {dayjs(data.created_at).format("YYYY-MM-DD HH:mm:ss")}
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 text-center">
        <div className="p-2 bg-base-300 rounded-lg">
          <p className="text-xs text-base-content">Hemoglobin</p>
          <p className="text-lg font-bold">{value} g/L</p>
        </div>
      </div>

      <p className="text-sm font-semibold mt-4">
        Health analysis: your Hemoglobin is {value}g/L [
        <span className={`font-normal ${hemoglobin_range.color}`}>
          {hemoglobin_range.label}
        </span>
        ]
      </p>
    </div>
  );
};

export default ResultTHXHDB;
