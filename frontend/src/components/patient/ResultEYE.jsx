import React from "react";
import dayjs from "dayjs";

const getStatus = (value, type) => {
  if (type == "vision") {
    return value >= 1.0
      ? { label: "Normal", color: "text-green-500" }
      : { label: "Abnormal", color: "text-red-500" };
  }

  if (type == "astig") {
    return value == 0
      ? { label: "Normal", color: "text-green-500" }
      : { label: "Abnormal", color: "text-red-500" };
  }

  if (type == "color") {
    const num = Number(value);
    if (num == 0) {
      return { label: "Normal", color: "text-green-500", probability: "0%" };
    }
    return {
      label: "Possibility",
      color: "text-yellow-500",
      probability: `${num}%`,
    };
  }

  return { label: "-", color: "" };
};

const ResultEYE = ({ data }) => {
  const { eLeft, eRight, lLeft, lRight, color } = data.values;

  const data_list = [
    {
      name: "Right eye vision",
      value: eRight,
      ...getStatus(eRight, "vision"),
    },
    {
      name: "Left eye vision",
      value: eLeft,
      ...getStatus(eLeft, "vision"),
    },
    {
      name: "Right eye astigmatism",
      value: lRight,
      ...getStatus(lRight, "astig"),
    },
    {
      name: "Left eye astigmatism",
      value: lLeft,
      ...getStatus(lLeft, "astig"),
    },
    {
      name: "Color blindness probability",
      value: color,
      ...getStatus(color, "color"),
    },
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
              {item.name.includes("Color") ? item.probability : item.value}
            </p>
            <p className={`font-semibold ${item.color}`}>{item.label}</p>
          </div>
        ))}
        <div className="col-span-3 text-left space-y-1 text-sm">
          <p>
            Right eye vision:{" "}
            <span className="font-semibold">Normal ≥ 1.0</span>
          </p>
          <p>
            Left eye vision: <span className="font-semibold">Normal ≥ 1.0</span>
          </p>
          <p>
            Color blindness:{" "}
            <span className="font-semibold">
              0% = Normal, 1–100% = Probability
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ResultEYE;
