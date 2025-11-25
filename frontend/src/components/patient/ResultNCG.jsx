import React from "react";
import dayjs from "dayjs";

const getUAStatusPerField = (values) => {
  const { leu, bld, ph, pro, ubg, nit, vc, glu, bil, ket } = values;

  const results = {};

  // Helper
  const isNegative = (val) =>
    val.toLowerCase().includes("negative") || val == "-" || val == "–";

  // Reference and names
  const reference = {
    leu: { name: "White blood cells", ref: "Negative (-)" },
    bld: { name: "Occult blood", ref: "Negative (-)" },
    pro: { name: "Protein", ref: "Negative (-)" },
    ubg: { name: "Urobilinogen", ref: "Negative (-)" },
    nit: { name: "Nitrite", ref: "Negative (-)" },
    vc: { name: "Vitamin C", ref: "Negative (-)" },
    glu: { name: "Glucose", ref: "Negative (-)" },
    bil: { name: "Bilirubin", ref: "Negative (-)" },
    ket: { name: "Ketone body", ref: "Negative (-)" },
    ph: { name: "pH value", ref: "4.5 - 8.0" },
  };

  const negativeFields = { leu, bld, pro, ubg, nit, vc, glu, bil, ket };

  for (const key in negativeFields) {
    const val = negativeFields[key];
    results[key] = {
      parameter: reference[key].name,
      value: val,
      ref_value: reference[key].ref,
      status: isNegative(val) ? "Normal" : "Abnormal",
    };
  }

  const phVal = parseFloat(ph);
  results["ph"] = {
    parameter: reference.ph.name,
    value: ph,
    ref_value: reference.ph.ref,
    status: phVal >= 4.5 && phVal <= 8.0 ? "Normal" : "Abnormal",
  };

  return results;
};

const ResultNCG = ({ data }) => {
  const uaStatuses = getUAStatusPerField(data.values);

  return (
    <div className="w-full bg-base-100 rounded-xl shadow-md p-4">
      <div className="flex justify-end items-center mb-4">
        <p className="text-sm text-base-content font-semibold">
          {dayjs(data.created_at).format("YYYY-MM-DD HH:mm:ss")}
        </p>
      </div>

      <div className="overflow-x-auto">
        <table className="table">
          {/* head */}
          <thead>
            <tr>
              <th>Parameters</th>
              <th>Measured Value</th>
              <th>Reference Value</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {Object.entries(uaStatuses).map(([key, result]) => (
              <tr key={key}>
                <th>{result.parameter}</th>
                <td>{result.value}</td>
                <td>{result.ref_value}</td>
                <td>{result.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ResultNCG;
