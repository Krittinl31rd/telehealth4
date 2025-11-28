import React, { useEffect, useState } from "react";
import useAuthStore from "../../store/auth";
import { GetDoctors } from "../../api/doctor";
import LoadingScreen from "../../components/shared/LoadingScreen";
import CardDoctor from "../../components/patient/CardDoctor";
import { toast } from "sonner";

const Consult = () => {
  const { token, user } = useAuthStore();
  const [doctors, setDoctors] = useState([]);
  const [loadingDoctors, setLoadingDoctors] = useState(false);
  const [step, setStep] = useState(1);

  const [symptomForm, setSymptomForm] = useState({
    symptoms: "",
    duration: "",
    severity: "mild",
    additional: "",
  });

  const fetchDoctors = async () => {
    setLoadingDoctors(true);
    try {
      const { data } = await GetDoctors(token);
      setDoctors(data);
    } catch (err) {
      console.log(err);
    } finally {
      setTimeout(() => setLoadingDoctors(false), 500);
    }
  };

  useEffect(() => {
    if (step == 2) fetchDoctors();
  }, [token, step]);

  const handleNext = () => {
    if (!symptomForm.symptoms) {
      toast.warning("Please fill in your symptoms.");
      return;
    }
    console.log(symptomForm);
    setStep(2);
  };

  return (
    <div className="w-full h-full p-4 bg-base-200 overflow-auto space-y-4">
      <h1 className="text-2xl font-bold">Find your Doctor</h1>

      {step == 1 && (
        <div className="grid grid-cols-1 gap-2 bg-base-100 p-4 rounded-xl shadow">
          <h2 className="col-span-1 text-xl font-semibold">Initial symptoms</h2>

          <div className="flex flex-col">
            <label className="label">
              <span className="label-text font-medium">Symptoms found</span>
            </label>
            <textarea
              className="textarea textarea-bordered w-full"
              placeholder="Headache, fever, cough..."
              value={symptomForm.symptoms}
              onChange={(e) =>
                setSymptomForm({ ...symptomForm, symptoms: e.target.value })
              }
            />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div className="flex flex-col">
              <label className="label">
                <span className="label-text font-medium">
                  Time of onset of symptoms
                </span>
              </label>
              <input
                type="text"
                className="input input-bordered w-full"
                placeholder="Such as 2 days, 1 week"
                value={symptomForm.duration}
                onChange={(e) =>
                  setSymptomForm({ ...symptomForm, duration: e.target.value })
                }
              />
            </div>

            <div className="flex flex-col">
              <label className="label">
                <span className="label-text font-medium">
                  Severity of symptoms
                </span>
              </label>
              <select
                className="select select-bordered w-full"
                value={symptomForm.severity}
                onChange={(e) =>
                  setSymptomForm({ ...symptomForm, severity: e.target.value })
                }
              >
                <option value="mild">a little</option>
                <option value="moderate">moderate</option>
                <option value="severe">severe</option>
              </select>
            </div>
          </div>

          <div className="flex flex-col">
            <label className="label">
              <span className="label-text font-medium">
                Additional information (if any)
              </span>
            </label>
            <textarea
              className="textarea textarea-bordered w-full"
              placeholder="Provide additional history, such as drug allergies or chronic illnesses."
              value={symptomForm.additional}
              onChange={(e) =>
                setSymptomForm({ ...symptomForm, additional: e.target.value })
              }
            />
          </div>

          <button onClick={handleNext} className="btn btn-primary w-full mt-2">
            Find a doctor who is ready to provide advice.
          </button>
        </div>
      )}

      {step == 2 &&
        (loadingDoctors ? (
          <LoadingScreen />
        ) : (
          <CardDoctor
            doctors={doctors}
            setStep={() => setStep}
            //   symptomForm={symptomForm}
          />
        ))}
    </div>
  );
};

export default Consult;
