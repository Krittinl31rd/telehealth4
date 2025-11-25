import React from "react";
import dayjs from "dayjs";

const getCategory = (value, low, high) => {
  if (value < low) return { label: "Pear shape", color: "text-blue-500" };
  if (value > high) return { label: "Apple shape", color: "text-red-500" };
  return { label: "Normal", color: "text-green-500" };
};

const ResultWHR = ({ data }) => {
  const { waistline, hipline, ratio } = data.values;

  // ranges
  const hip_ratio = getCategory(ratio, 0, 0.85);

  return (
    <div className="w-full bg-base-100 rounded-xl shadow-md p-4">
      <div className="flex justify-end items-center mb-4">
        <p className="text-sm text-base-content font-semibold">
          {dayjs(data.created_at).format("YYYY-MM-DD HH:mm:ss")}
        </p>
      </div>

      <div className="grid grid-cols-3 gap-4 text-center">
        <div className="p-2 bg-base-300 rounded-lg">
          <p className="text-xs text-base-content">Waist</p>
          <p className="text-lg font-bold">{waistline} cm/L</p>
        </div>
        <div className="p-2 bg-base-300 rounded-lg">
          <p className="text-xs text-base-content">Hipline acid</p>
          <p className="text-lg font-bold">{hipline} cm</p>
        </div>
        <div className="p-2 bg-base-300 rounded-lg">
          <p className="text-xs text-base-content">Waist hip ratio</p>
          <p className="text-lg font-bold">{ratio}</p>
        </div>
      </div>

      <p className="text-sm font-semibold mt-4">
        Health analysis: your waist circumference is {waistline}cm, hip
        circumference is {hipline}cm, waist hip ratio is {ratio} [
        <span className={`font-normal ${hip_ratio.color}`}>
          {hip_ratio.label}
        </span>
        ]
      </p>
    </div>
  );
};

export default ResultWHR;
