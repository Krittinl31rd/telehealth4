import React from "react";
import dayjs from "dayjs";

const getTempCategory = (temp) => {
  const t = Number(temp);

  if (t <= 35.4) return { category: "Low fever", color: "text-blue-500" };
  if (t >= 35.5 && t <= 37.8)
    return { category: "Normal", color: "text-green-500" };
  if (t >= 37.9) return { category: "Fever", color: "text-red-500" };

  return { category: "Unknown", color: "text-gray-500" };
};

const renderTempBar = (temp) => {
  const t = Number(temp);

  const pos =
    t <= 35.4
      ? (t / 35.4) * 33
      : t <= 37.8
      ? 33 + ((t - 35.5) / (37.8 - 35.5)) * 45
      : 78 + ((t - 37.9) / 5) * 22;

  return (
    <div className="w-full mt-4">
      <div className="relative h-6 w-full rounded-full overflow-hidden bg-base-300 flex">
        <div className="w-1/3 bg-blue-400 text-xs flex items-center justify-center gap-1">
          Low <span className="font-semibold">≤35.4℃</span>
        </div>
        <div className="w-[45%] bg-green-400 text-xs flex items-center justify-center gap-1">
          Normal <span className="font-semibold">35.5~37.8℃</span>
        </div>
        <div className="flex-1 bg-red-400 text-xs flex items-center justify-center gap-1">
          Fever <span className="font-semibold">≥37.9℃</span>
        </div>

        <div
          className="absolute top-0 h-full w-0.5 bg-base-content"
          style={{ left: `${pos}%` }}
        ></div>
      </div>
    </div>
  );
};

const ResultTemp = ({ data }) => {
  const { ttype, tempv, dw, tw_normal } = data.values;
  const { category, color } = getTempCategory(tempv);
  return (
    <div className="w-full bg-base-100 rounded-xl shadow-md p-4">
      <div className="flex justify-end items-center mb-4">
        <p className="text-sm text-base-content font-semibold">
          {dayjs(data.created_at).format("YYYY-MM-DD HH:mm:ss")}
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 text-center">
        <div className="p-2 bg-base-300 rounded-lg">
          <p className="text-xs text-base-content">Body temperature</p>
          <p className="text-lg font-bold">
            {tempv} {dw}
          </p>
        </div>
      </div>

      {renderTempBar(tempv)}

      <p className="text-sm font-semibold mt-4">
        Health analysis: your temperature is {tempv} {dw} [
        <span className={`font-normal ${color}`}>{category}</span>]
      </p>
    </div>
  );
};

export default ResultTemp;
