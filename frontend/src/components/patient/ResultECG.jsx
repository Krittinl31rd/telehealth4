import React from "react";
import dayjs from "dayjs";

const getCategory = (value, low, high) => {
  if (value < low) return { label: "Low", color: "text-blue-500" };
  if (value > high) return { label: "High", color: "text-red-500" };
  return { label: "Normal", color: "text-green-500" };
};

const getECGResult = (hr) => {
  const rate = Number(hr);

  if (rate < 60) return { label: "Sinus Bradycardia", color: "text-blue-500" };

  if (rate > 100) return { label: "Sinus Tachycardia", color: "text-red-500" };

  return { label: "Normal Sinus Rhythm", color: "text-green-500" };
};

const ResultECG = ({ data }) => {
  const { hr } = data.values;

  // ranges
  const heart_rate = getCategory(hr, 0, 100);
  const analysis = getECGResult(hr);

  return (
    <div className="w-full bg-base-100 rounded-xl shadow-md p-4">
      <div className="flex justify-end items-center mb-4">
        <p className="text-sm text-base-content font-semibold">
          {dayjs(data.created_at).format("YYYY-MM-DD HH:mm:ss")}
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4 text-center">
        <div className="p-2 bg-base-300 rounded-lg">
          <p className="text-xs text-base-content">Heart rate</p>
          <p className="text-lg font-bold">{hr} bpm</p>
        </div>
        <div className="p-2 bg-base-300 rounded-lg">
          <p className="text-xs text-base-content">Analysis result</p>
          <p className="text-lg font-bold">{analysis.label}</p>
        </div>
      </div>

      <p className="text-sm font-semibold mt-4">
        Health analysis: your Heart rate is [
        <span className={`font-normal ${heart_rate.color}`}>
          {heart_rate.label}
        </span>
        ], ECG analysis results is [
        <span className={`font-normal ${analysis.color}`}>
          {analysis.label}
        </span>
        ]
      </p>
    </div>
  );
};

export default ResultECG;
