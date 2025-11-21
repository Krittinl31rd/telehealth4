import React, { useEffect, useState } from "react";
import useWebSocket from "../../hooks/useWebsocket";
import useAuthStore from "../../store/auth";
import {
  GetMeasurementsTypes,
  ReadMeasurementsByTypeAndID,
} from "../../api/measurement";
import Modal2 from "../../components/shared/Modal2";
import ResultMeasurements from "../../components/patient/ResultMeasurements";

const images = import.meta.glob("../../assets/img/*.png", { eager: true });
const gradients = [
  "from-sky-400 to-blue-600",
  "from-cyan-400 to-teal-600",
  "from-blue-300 to-indigo-600",
  "from-indigo-400 to-purple-600",
  "from-violet-400 to-fuchsia-600",
  "from-emerald-400 to-green-600",
  "from-teal-300 to-emerald-600",
  "from-rose-300 to-rose-600",
  "from-amber-300 to-orange-600",
  "from-yellow-300 to-amber-500",
  "from-slate-400 to-slate-600",
  "from-zinc-300 to-zinc-600",
  "from-pink-300 to-pink-600",
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
        <div className="text-center text-gray-500 py-20">
          Loading measurement types...
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
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
                <div className="w-16 h-16 flex items-center justify-center bg-white/20 rounded-xl mb-3 shadow-inner">
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
          <div className="text-center py-10 text-gray-500">
            Loading results...
          </div>
        ) : (
          <ResultMeasurements resultMea={resultMea} />
        )}
      </Modal2>
    </div>
  );
};

export default Measurement;
