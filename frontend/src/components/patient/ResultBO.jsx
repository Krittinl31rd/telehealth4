import React from "react";
import dayjs from "dayjs";

const getBOCategory = (os) => {
  const o = Number(os);
  if (o < 95) return { category: "Low", color: "text-red-500" };
  return { category: "Normal", color: "text-green-500" };
};

const getBPMCategory = (bpm) => {
  const b = Number(bpm);
  if (b < 60) return { category: "Bradycardia", color: "text-blue-500" };
  if (b <= 100) return { category: "Normal", color: "text-green-500" };
  return { category: "Tachycardia", color: "text-red-500" };
};

const ResultBO = ({ data }) => {
  const { os, os_normal, bpm, bpm_normal } = data.values;
  const { category: osCategory, color: osColor } = getBOCategory(os);
  const { category: bpmCategory, color: bpmColor } = getBPMCategory(bpm);

  return (
    <div className="w-full bg-base-100 rounded-xl shadow-md p-4">
      <div className="flex justify-end items-center mb-4">
        <p className="text-sm text-base-content font-semibold">
          {dayjs(data.created_at).format("YYYY-MM-DD HH:mm:ss")}
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4 text-center">
        <div className="p-2 bg-base-300 rounded-lg">
          <p className="text-xs text-base-content">Blood oxygen saturation</p>
          <p className="text-lg font-bold">{os} %</p>
        </div>
        <div className="p-2 bg-base-300 rounded-lg">
          <p className="text-xs text-base-content">Pluse rate</p>
          <p className="text-lg font-bold">{bpm} bpm</p>
        </div>
      </div>

      <p className="text-sm font-semibold mt-4">
        Health analysis: your blood oxygen saturation is {os}% [
        <span className={`font-normal ${osColor}`}>{osCategory}</span>], pulse
        rate is {bpm} times/minute [
        <span className={`font-normal ${bpmColor}`}>{bpmCategory}</span>]
      </p>
    </div>
  );
};

export default ResultBO;
