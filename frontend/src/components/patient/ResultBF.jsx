import React, { useState } from "react";
import dayjs from "dayjs";
import useAuthStore from "../../store/auth";

const list_result = [
  "Intracellular fluid",
  "Extracellular fluid",
  "Fat content",
  "Inorganic salt content",
  "Muscle content",
  "Protein content",
  "Body water content",
];

const ranges = {
  fm: { 1: { low: 8.0, high: 19.0 }, 2: { low: 21.0, high: 33.0 } }, // body fat mass %
  fp: { 1: { low: 11, high: 17 }, 2: { low: 21, high: 33 } }, // body fat percentage %
  vfal: { 1: { low: 1, high: 9 }, 2: { low: 1, high: 9 } }, // Visceral fat level
  bmr: { 1: { low: 1600, high: 2200 }, 2: { low: 1400, high: 2000 } }, // Basal metabolism Kcal
  sfm: { 1: { low: 5, high: 15 }, 2: { low: 8, high: 20 } }, // Subcutaneous fat mass kg
  sfr: { 1: { low: 10, high: 20 }, 2: { low: 15, high: 25 } }, // Subcutaneous fat rate %
  tbw: { 1: { low: 45, high: 60 }, 2: { low: 35, high: 50 } }, // Body water content kg
  tbwc: { 1: { low: 50, high: 65 }, 2: { low: 45, high: 60 } }, // Body water %
  sm: { 1: { low: 2.5, high: 4.0 }, 2: { low: 2.0, high: 3.5 } }, // Bone mass kg
  mm: { 1: { low: 50, high: 65 }, 2: { low: 35, high: 50 } }, // Muscle mass kg
  mml: { 1: { low: 40, high: 55 }, 2: { low: 30, high: 45 } }, // Muscle rate %
  proteinRate: { 1: { low: 15, high: 25 }, 2: { low: 15, high: 25 } }, // Protein rate %
  protein: { 1: { low: 10, high: 15 }, 2: { low: 8, high: 12 } }, // Protein kg
  lbm: { 1: { low: 55, high: 70 }, 2: { low: 40, high: 55 } }, // Lean body mass
  ecf: { 1: { low: 12, high: 20 }, 2: { low: 10, high: 18 } }, // Extracellular fluid kg
  icf: { 1: { low: 25, high: 40 }, 2: { low: 20, high: 35 } }, // Intracellular fluid kg
  minerals: { 1: { low: 1.5, high: 2.5 }, 2: { low: 1.2, high: 2.0 } }, // Mineral content kg
};

const getRateCategory = (value, { low, high }) => {
  const v = parseFloat(value);

  if (v < low) return { label: "Low", color: "text-blue-500" };
  if (v > high) return { label: "High", color: "text-red-500" };
  return { label: "Normal", color: "text-green-600" };
};

const renderCard = (header, value, category) => {
  return (
    <div className="bg-base-300 h-20 rounded-lg flex flex-col items-center justify-center">
      <p className="text-xs text-base-content">{header}</p>
      <p className="text-lg font-bold">
        {value}{" "}
        <span className={`text-xs font-semibold ${category.color}`}>
          {category.label}
        </span>
      </p>
    </div>
  );
};

const renderTiltle = (title, color, label, value, range) => {
  return (
    <div className="space-y-2">
      <p className="text-xl text-base-content">
        {title} <br />
        <span className={`${color}`}>({label})</span>
      </p>
      <p className="text-lg font-bold">{value} kg</p>
      {renderBar({ value, range })}
    </div>
  );
};

// const renderBar = (value) => {
//   return (
//     <div className="w-full space-y-1">
//       <div className="flex justify-between text-xs text-base-content">
//         <span>{value.low}</span>
//         <span>{value.high}</span>
//       </div>

//       <div className="h-4 w-full flex rounded-full overflow-hidden">
//         <div className="flex-1 bg-blue-400"></div>
//         <div className="flex-1 bg-green-400"></div>
//         <div className="flex-1 bg-red-400"></div>
//       </div>

//       <div className="flex justify-between text-xs font-medium mt-1">
//         <span>Low</span>
//         <span>Normal</span>
//         <span>High</span>
//       </div>
//     </div>
//   );
// };

const renderBar = ({ value, range }) => {
  const pos = Math.min(
    100,
    Math.max(0, ((value - range.low) / (range.high - range.low)) * 100)
  );

  return (
    <div className="w-full space-y-1">
      <div className="flex justify-between text-xs text-base-content">
        <span>{range.low}</span>
        <span>{range.high}</span>
      </div>

      <div className="relative h-4 w-full rounded-full overflow-hidden bg-base-300">
        <div
          className="absolute top-0 left-0 h-full"
          style={{
            width: `${pos}%`,
            background: pos < 33 ? "#3b82f6" : pos < 66 ? "#10b981" : "#ef4444",
            transition: "width 0.3s",
          }}
        ></div>

        <div
          className="absolute top-0 h-full w-0.5 bg-base-content"
          style={{ left: `${pos}%` }}
        ></div>
      </div>

      <div className="flex justify-between text-xs font-medium mt-1">
        <span>Low</span>
        <span>Normal</span>
        <span>High</span>
      </div>
    </div>
  );
};

const ResultBF = ({ data }) => {
  const { user } = useAuthStore();
  const gender = user?.sex || 1;
  const [selectResult, setSelectResult] = useState(0);
  const {
    fm,
    fp,
    vfal,
    bmr,
    sfm,
    sfr,
    tbw,
    tbwc,
    sm,
    mm,
    mml,
    proteinRate,
    protein,
    lbm,
    ecf,
    icf,
    minerals,
    other,
    fmAdjus,
    mmAdjus,
    bodyAge,
    bodyScore,
  } = data.values;

  const fatRate = getRateCategory(fp, ranges.fp[gender]);
  const bmrRate = getRateCategory(bmr, ranges.bmr[gender]);
  const vfalRate = getRateCategory(vfal, ranges.vfal[gender]);
  const sfrRate = getRateCategory(sfr, ranges.sfr[gender]);
  const boneRate = getRateCategory(sm, ranges.mm[gender]);
  const icfRate = getRateCategory(icf, ranges.icf[gender]);
  const ecfRate = getRateCategory(ecf, ranges.ecf[gender]);
  const fmRate = getRateCategory(fm, ranges.fm[gender]);
  const mineralsRate = getRateCategory(minerals, ranges.minerals[gender]);
  const mmRate = getRateCategory(mm, ranges.mm[gender]);
  const proteinRates = getRateCategory(protein, ranges.protein[gender]);
  const tbwRate = getRateCategory(tbw, ranges.tbw[gender]);

  return (
    <div className="w-full bg-base-100 rounded-xl shadow-md pr-4 hover:shadow-lg transition-all duration-200">
      <div className="grid grid-cols-[25%_75%] gap-2">
        <div className="join join-vertical ">
          {list_result.map((item, idx) => (
            <button
              onClick={() => setSelectResult(idx)}
              key={idx}
              className={`btn btn-sm  join-item rounded-none ${
                selectResult == idx && "bg-primary text-white"
              }`}
            >
              {item}
            </button>
          ))}
        </div>

        <div className="py-2 pr-2 overflow-y-auto max-h-[250px] flex  gap-2">
          {/* Dynamic content */}
          <div className="w-68">
            {selectResult == 0 &&
              renderTiltle(
                "Intracellular fluid",
                icfRate.color,
                icfRate.label,
                icf,
                ranges.icf[gender]
              )}
            {selectResult == 1 &&
              renderTiltle(
                "Extracellular fluid",
                ecfRate.color,
                ecfRate.label,
                ecf,
                ranges.ecf[gender]
              )}
            {selectResult == 2 &&
              renderTiltle(
                "Fat content",
                fmRate.color,
                fmRate.label,
                fm,
                ranges.fm[gender]
              )}
            {selectResult == 3 &&
              renderTiltle(
                "Inorganic salt content",
                mineralsRate.color,
                mineralsRate.label,
                minerals,
                ranges.minerals[gender]
              )}
            {selectResult == 4 &&
              renderTiltle(
                "Muscle content",
                mmRate.color,
                mmRate.label,
                mm,
                ranges.mm[gender]
              )}
            {selectResult == 5 &&
              renderTiltle(
                "Protein content",
                proteinRates.color,
                proteinRates.label,
                protein,
                ranges.protein[gender]
              )}
            {selectResult == 6 &&
              renderTiltle(
                "Body water content",
                tbwRate.color,
                tbwRate.label,
                tbw,
                ranges.tbw[gender]
              )}
          </div>

          {/* Summary cards */}
          <div className="w-full">
            <div className="flex justify-end items-center mb-1.5">
              <p className="text-sm text-base-content font-semibold">
                {dayjs(data.created_at).format("YYYY-MM-DD HH:mm:ss")}
              </p>
            </div>
            <div className="grid grid-cols-3 gap-2 items-center justify-center ">
              {renderCard("Body fat rate", `${fp} %`, fatRate)}
              {renderCard("Basic metabolism", `${bmr} Kcal`, bmrRate)}
              {renderCard("Visceral fat grade", vfal, vfalRate)}
              {renderCard("Bone content", `${sm} kg`, boneRate)}
              {renderCard("Subcutaneous Fat Rate", `${sfr} %`, sfrRate)}

              <div className="h-20 rounded-lg  flex flex-col items-center justify-center">
                <div className="w-full flex items-center justify-between">
                  <span className="text-xs">Fat control</span>
                  <span className="font-semibold">{fmAdjus}</span>
                </div>
                <div className="w-full flex items-center justify-between">
                  <span className="text-xs">Biological age</span>
                  <span className="font-semibold">{bodyAge}</span>
                </div>
                <div className="w-full flex items-center justify-between">
                  <span className="text-xs">Body score</span>
                  <span className="font-semibold">{bodyScore}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResultBF;
