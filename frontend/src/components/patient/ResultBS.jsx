import React from "react";
import dayjs from "dayjs";

const getCategory = (value, low, high) => {
  if (value < low) return { label: "Low", color: "text-blue-500" };
  if (value > high) return { label: "High", color: "text-red-500" };
  return { label: "Normal", color: "text-green-500" };
};

const ResultBS = ({ data }) => {
  const {
    value,
    value_normal,
    value_type,
    ua,
    ua_normal,
    chol,
    chol_normal,
    hb,
    hb_normal,
  } = data.values;

  // ranges
  const glucose = getCategory(value, 3.9, 6.2);
  const uric = getCategory(ua, 0.15, 0.42);
  const cholesterol = getCategory(chol, 3.1, 5.17);

  return (
    <div className="w-full bg-base-100 rounded-xl shadow-md p-4">
      <div className="flex justify-end items-center mb-4">
        <p className="text-sm text-base-content font-semibold">
          {dayjs(data.created_at).format("YYYY-MM-DD HH:mm:ss")}
        </p>
      </div>

      <div className="grid grid-cols-3 gap-4 text-center">
        <div className="p-2 bg-base-300 rounded-lg">
          <p className="text-xs text-base-content">Blood glucose</p>
          <p className="text-lg font-bold">{value} mmol/L</p>
        </div>
        <div className="p-2 bg-base-300 rounded-lg">
          <p className="text-xs text-base-content">Uric acid</p>
          <p className="text-lg font-bold">{ua} mmol/L</p>
        </div>
        <div className="p-2 bg-base-300 rounded-lg">
          <p className="text-xs text-base-content">Total cholesterol</p>
          <p className="text-lg font-bold">{chol} mmol/L</p>
        </div>
      </div>

      <p className="text-sm font-semibold mt-4">
        Health analysis: your Fasting blood glucose is {value}mmol/L [
        <span className={`font-normal ${glucose.color}`}>{glucose.label}</span>
        ], Uric acid is {ua}mmol/L [
        <span className={`font-normal ${uric.color}`}>{uric.label}</span>],
        Total cholesterol is {chol}mmol/L [
        <span className={`font-normal ${cholesterol.color}`}>
          {cholesterol.label}
        </span>
        ]
      </p>
    </div>
  );
};

export default ResultBS;
