import React from "react";
import dayjs from "dayjs";

const getBMICategory = (bmi) => {
  const value = parseFloat(bmi);

  if (value < 18.5)
    return { category: "Underweight", color: "text-yellow-300" };
  if (value < 25) return { category: "Normal", color: "text-blue-500" };
  if (value < 30) return { category: "Overweight", color: "text-green-500" };
  if (value < 35)
    return { category: "Obesity Grade 1", color: "text-yellow-500" };
  if (value < 40)
    return { category: "Obesity Grade 2", color: "text-orange-500" };
  return { category: "Obesity Grade 3", color: "text-red-700" };
};

const ResultBMI = ({ data }) => {
  const { height, weight, bmi } = data.values;
  const { category, color } = getBMICategory(bmi);

  return (
    <div className="w-full bg-base-100 rounded-xl shadow-md p-4 hover:shadow-lg transition-all duration-200">
      <div className="flex justify-end items-center mb-4">
        <p className="text-sm text-base-content font-semibold">
          {dayjs(data.created_at).format("YYYY-MM-DD HH:mm:ss")}
        </p>
      </div>

      <div className="grid grid-cols-3 gap-4 text-center">
        <div className="p-2 bg-base-300 rounded-lg">
          <p className="text-xs text-base-content">Height</p>
          <p className="text-lg font-bold">{height} cm</p>
        </div>

        <div className="p-2 bg-base-300 rounded-lg">
          <p className="text-xs text-base-content">Weight</p>
          <p className="text-lg font-bold">{weight} kg</p>
        </div>

        <div className="p-2 bg-base-300 rounded-lg">
          <p className="text-xs text-base-content">BMI</p>
          <p className="font-bold text-lg">{bmi}</p>
        </div>
      </div>

      <p className="text-sm font-semibold mt-4">
        Health analysis: your weight is [
        <span className={`font-normal ${color}`}>{category}</span>], BMI is [
        <span className={`font-normal ${color}`}>{category}</span>], and figure
        is [<span className={`font-normal ${color}`}>{category}</span>]
      </p>
    </div>
  );
};

export default ResultBMI;
