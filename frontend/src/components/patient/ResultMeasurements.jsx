import React from "react";

const ResultMeasurements = ({ resultMea = [] }) => {
  return (
    <div className="w-full space-y-2">
      {resultMea.length == 0 ? (
        <p className="text-center">Not found data.</p>
      ) : (
        resultMea.map((item, idx) => (
          <ul key={idx}>
            <li>{item?.device_id}</li>
            <li>
              {item?.field} | {item?.value}
            </li>
            <li>{item?.created_at}</li>
          </ul>
        ))
      )}
    </div>
  );
};

export default ResultMeasurements;
