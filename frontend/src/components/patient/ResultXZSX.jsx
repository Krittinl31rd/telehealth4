import React from "react";
import dayjs from "dayjs";

const getCategory = (value, low, high) => {
  if (value < low) return { label: "Low", color: "text-blue-500" };
  if (value > high) return { label: "High", color: "text-red-500" };
  return { label: "Normal", color: "text-green-500" };
};

const ResultXZSX = ({ data }) => {
  const { chol, hdl, ldl, trig } = data.values;

  const ranges = {
    chol: { low: 0, high: 5.2 }, // < 5.2 mmol/L
    hdl: { low: 1.0, high: 1.55 }, // 1.0–1.55 mmol/L
    ldl: { low: 0, high: 3.4 }, // < 3.4 mmol/L
    trig: { low: 0.3, high: 1.7 }, // 0.3–1.7 mmol/L
  };

  const cholCat = getCategory(chol, ranges.chol.low, ranges.chol.high);
  const hdlCat = getCategory(hdl, ranges.hdl.low, ranges.hdl.high);
  const ldlCat = getCategory(ldl, ranges.ldl.low, ranges.ldl.high);
  const trigCat = getCategory(trig, ranges.trig.low, ranges.trig.high);

  const data_list = [
    { name: "Total cholesterol", value: chol, unit: "mmol/L" },
    { name: "Triglycerides", value: trig, unit: "mmol/L" },
    { name: "High density lipoprotein", value: hdl, unit: "mmol/L" },
    { name: "Low density lipoprotein", value: ldl, unit: "mmol/L" },
  ];

  return (
    <div className="w-full bg-base-100 rounded-xl shadow-md p-4">
      <div className="flex justify-end items-center mb-4">
        <p className="text-sm text-base-content font-semibold">
          {dayjs(data.created_at).format("YYYY-MM-DD HH:mm:ss")}
        </p>
      </div>

      <div className="grid grid-cols-4 gap-4 text-center">
        {data_list.map((item, idx) => (
          <div key={idx} className="p-2 bg-base-300 rounded-lg">
            <p className="text-xs text-base-content">{item.name}</p>
            <p className="text-lg font-bold">
              {item.value} {item.unit}
            </p>
          </div>
        ))}
      </div>

      <p className="text-sm font-semibold mt-4">
        Health analysis: your total cholesterol is {chol} mmol/L [
        <span className={`font-normal ${cholCat.color}`}>{cholCat.label}</span>
        ], triglycerides is {trig} mmol/L [
        <span className={`font-normal ${trigCat.color}`}>{trigCat.label}</span>
        ], high-density lipoprotein is {hdl} mmol/L [
        <span className={`font-normal ${hdlCat.color}`}>{hdlCat.label}</span>],
        low-density lipoprotein is {ldl} mmol/L [
        <span className={`font-normal ${ldlCat.color}`}>{ldlCat.label}</span>].
      </p>
    </div>
  );
};

export default ResultXZSX;
