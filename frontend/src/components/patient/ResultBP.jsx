import React from "react";
import dayjs from "dayjs";

const getBloodPressureCategory = (sbp, dbp) => {
  const s = Number(sbp);
  const d = Number(dbp);

  if (s >= 180 || d >= 120)
    return { category: "Hypertensive Crisis", color: "text-red-600" };
  if (s >= 140 || d >= 90)
    return { category: "Hypertension Stage 2", color: "text-rose-500" };
  if (s >= 130 || d >= 80)
    return { category: "Hypertension Stage 1", color: "text-orange-500" };
  if (s >= 120 && d < 80)
    return { category: "Elevated", color: "text-yellow-500" };
  if (s < 90 || d < 60)
    return { category: "Low Blood Pressure", color: "text-blue-500" };
  return { category: "Normal", color: "text-green-600" };
};

const ResultBP = ({ data }) => {
  const { sbp, dbp, hr } = data.values;
  const { category, color } = getBloodPressureCategory(sbp, dbp);

  return (
    <div className="w-full bg-base-100 rounded-xl shadow-md p-4 hover:shadow-lg transition-all duration-200">
      <div className="flex justify-end items-center mb-4">
        <p className="text-sm text-base-content font-semibold">
          {dayjs(data.created_at).format("YYYY-MM-DD HH:mm:ss")}
        </p>
      </div>

      <div className="grid grid-cols-3 gap-4 text-center">
        <div className="p-2 bg-base-300 rounded-lg">
          <p className="text-xs text-base-content">High pressure</p>
          <p className="text-lg font-bold">{sbp} mmHg</p>
        </div>
        <div className="p-2 bg-base-300 rounded-lg">
          <p className="text-xs text-base-content">Low pressure</p>
          <p className="text-lg font-bold">{dbp} mmHg</p>
        </div>
        <div className="p-2 bg-base-300 rounded-lg">
          <p className="text-xs text-base-content">Pulse pressure</p>
          <p className="text-lg font-bold">{hr} bpm</p>
        </div>
      </div>

      <p className="text-sm font-semibold mt-4">
        Health analysis: your pressure is [
        <span className={`font-normal ${color}`}>{category}</span>], low
        pressure is [<span className={`font-normal ${color}`}>{category}</span>
        ], and pulse is [
        <span className={`font-normal ${color}`}>{category}</span>]
      </p>
    </div>
  );
};

export default ResultBP;
