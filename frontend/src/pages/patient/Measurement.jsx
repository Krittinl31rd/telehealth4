import React, { useEffect, useState } from "react";
import useWebSocket from "../../hooks/useWebsocket";
import useAuthStore from "../../store/auth";
import {
  GetMeasurementsTypes,
  ReadMeasurementsByTypeAndID,
} from "../../api/measurement";
import Modal2 from "../../components/shared/Modal2";
import { measurement_types } from "../../constant/enum";
import ResultBMI from "../../components/patient/ResultBMI";
import ResultBP from "../../components/patient/ResultBP";
import ResultBF from "../../components/patient/ResultBF";
import ResultTemp from "../../components/patient/ResultTemp";
import ResultBO from "../../components/patient/ResultBO";
import ResultBS from "../../components/patient/ResultBS";
import ResultWHR from "../../components/patient/ResultWHR";
import ResultNCG from "../../components/patient/ResultNCG";
import ResultECG from "../../components/patient/ResultECG";
import ResultXZSX from "../../components/patient/ResultXZSX";
import ResultEYE from "../../components/patient/ResultEYE";
import ResultTHXHDB from "../../components/patient/ResultTHXHDB";
import LoadinPacMan from "../../components/shared/LoadinPacMan";

const images = import.meta.glob("../../assets/img/*.png", { eager: true });
const gradients = [
  "from-blue-400 to-blue-600",
  "from-orange-400 to-orange-600",
  "from-red-400 to-red-600",
  "from-indigo-400 to-violet-600",
  "from-amber-400 to-amber-600",
  "from-sky-400 to-sky-600",
  "from-cyan-400 to-cyan-600",
  "from-rose-400 to-rose-600",
  "from-green-400 to-green-600",
  "from-yellow-400 to-yellow-600",
  "from-teal-300 to-teal-600",
  "from-violet-400 to-violet-600",
];

const Measurement = () => {
  const { token, user } = useAuthStore();
  const [message, setMessage] = useState(null);
  const [meaTypes, setMeaTypes] = useState([]);
  const [selectedType, setSelectedType] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [resultMea, setResultMea] = useState([]);
  const [loadingTypes, setLoadingTypes] = useState(false);
  const [loadingResults, setLoadingResults] = useState(false);

  const { send, statusWS } = useWebSocket(
    import.meta.env.VITE_WS_URL,
    setMessage,
    token
  );

  const fetchMeaTypes = async () => {
    setLoadingTypes(true);
    try {
      const { data } = await GetMeasurementsTypes(token);
      setMeaTypes(data);
    } catch (err) {
      console.log(err);
    } finally {
      setLoadingTypes(false);
    }
  };

  useEffect(() => {
    fetchMeaTypes();
  }, [token]);

  const handleClickType = async (item) => {
    setSelectedType(item);
    setModalOpen(true);
    setLoadingResults(true);
    try {
      const { data } = await ReadMeasurementsByTypeAndID(token, {
        patient_id: user?.id,
        type_id: item?.id,
      });
      setResultMea(data);
    } catch (err) {
      console.log(err);
    } finally {
      setTimeout(() => setLoadingResults(false), 500);
    }
  };

  useEffect(() => {
    if (!message) return;
    const { cmd, params } = message;
    console.log({ cmd, params });
    switch (cmd) {
      default:
        break;
    }
  }, [message]);

  return (
    <div className="w-full h-full p-4 bg-base-200 overflow-auto">
      <h1 className="text-2xl font-bold mb-4">Select Measurement</h1>

      {loadingTypes ? (
        <div className="text-center py-10">
          <span className="loading loading-spinner   loading-lg"></span>
          {/* <br /> */}
          {/* Loading measurement types... */}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-4">
          {meaTypes.map((item, idx) => {
            const imgSrc = images[`../../assets/img/${item.code}.png`]?.default;

            return (
              <div
                key={idx}
                onClick={() => handleClickType(item)}
                className={`
                  bg-gradient-to-br ${gradients[idx % gradients.length]}
                  h-48 w-full rounded-2xl p-4 flex flex-col items-center justify-center text-white
                  shadow-lg backdrop-blur-sm
                  transition-all duration-300 ease-out
                  hover:scale-105 hover:shadow-2xl hover:brightness-110 cursor-pointer
                `}
              >
                <div className="w-16 h-16 flex items-center justify-center bg-white/80 rounded-xl mb-2 shadow-inner">
                  <img
                    src={imgSrc}
                    alt={item?.name}
                    className="w-10 h-10 drop-shadow"
                  />
                </div>
                <p className="text-lg font-semibold tracking-wide drop-shadow-sm text-center">
                  {item?.name}
                </p>
              </div>
            );
          })}
        </div>
      )}

      <Modal2
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={`History ${selectedType?.name}`}
        width="w-4xl"
      >
        {loadingResults ? (
          <div className="text-center py-10">
            <LoadinPacMan />
            {/* <span className="loading loading-spinner   loading-lg"></span> */}
            {/* <br />
            Loading measurements... */}
          </div>
        ) : resultMea.length == 0 ? (
          <div className="text-center py-10">Not found data.</div>
        ) : (
          <div className="w-full space-y-2">
            {/* <div className="flex items-center justify-end">
              {selectedType.id == measurement_types.BP && "click"}
            </div> */}
            {resultMea.map((item, idx) => {
              switch (item.type_id) {
                case measurement_types.BMI:
                  return <ResultBMI key={idx} data={item} />;

                case measurement_types.BP:
                  return <ResultBP key={idx} data={item} />;

                case measurement_types.BF:
                  return <ResultBF key={idx} data={item} />;

                case measurement_types.temp:
                  return <ResultTemp key={idx} data={item} />;

                case measurement_types.bo:
                  return <ResultBO key={idx} data={item} />;

                case measurement_types.bs:
                  return <ResultBS key={idx} data={item} />;

                case measurement_types.whr:
                  return <ResultWHR key={idx} data={item} />;

                case measurement_types.ncg:
                  return <ResultNCG key={idx} data={item} />;

                case measurement_types.ecg:
                  return <ResultECG key={idx} data={item} />;

                case measurement_types.xzsx:
                  return <ResultXZSX key={idx} data={item} />;

                case measurement_types.eye:
                  return <ResultEYE key={idx} data={item} />;

                case measurement_types.thxhdb:
                  return <ResultTHXHDB key={idx} data={item} />;

                default:
                  return null;
              }
            })}
          </div>
        )}
      </Modal2>
    </div>
  );
};

export default Measurement;
