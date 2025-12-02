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
      toast.error("Failed to load doctors. Please try again.");
    } finally {
      setTimeout(() => setLoadingDoctors(false), 400);
    }
  };

  useEffect(() => {
    if (step == 1) {
      setSymptomForm({
        symptoms: "",
        duration: "",
        severity: "mild",
        additional: "",
      });
    }
    if (step == 2) fetchDoctors();
  }, [step]);

  const handleNext = () => {
    if (!symptomForm.symptoms) {
      toast.warning("Please describe your symptoms.");
      return;
    }
    setStep(2);
  };

  return (
    <div className="w-full h-full p-4 bg-base-200 overflow-auto space-y-4">
      {/* STEP 1 – Symptom Intake */}
      {step == 1 && (
        <>
          <h1 className="text-3xl font-bold text-primary">Consult a Doctor</h1>
          <p className="text-base-content/70">
            Answer a few questions so we can match you with the right
            specialist.
          </p>
          <div className="bg-base-100 p-4 rounded-2xl shadow space-y-4 border border-base-300">
            <h2 className="text-xl font-semibold border-b pb-2">
              Patient Symptom Intake
            </h2>

            {/* Symptoms */}
            <div className="flex flex-col gap-1">
              <label className="font-medium">Symptoms</label>
              <textarea
                className="textarea textarea-bordered w-full resize-none"
                rows={3}
                placeholder="e.g., headache, fever, cough"
                value={symptomForm.symptoms}
                onChange={(e) =>
                  setSymptomForm({ ...symptomForm, symptoms: e.target.value })
                }
              />
            </div>

            {/* Duration + Severity */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1">
                <label className="font-medium">Symptom Duration</label>
                <select
                  className="select select-bordered w-full"
                  value={symptomForm.duration}
                  onChange={(e) =>
                    setSymptomForm({ ...symptomForm, duration: e.target.value })
                  }
                >
                  <option value="">Select duration</option>
                  <option value="1-2 days">1–2 days</option>
                  <option value="3-5 days">3–5 days</option>
                  <option value="1 week">1 week</option>
                  <option value="more than 1 week">More than 1 week</option>
                </select>
              </div>

              <div className="flex flex-col gap-1">
                <label className="font-medium">Symptom Severity</label>

                <div className="flex items-center gap-3">
                  {["mild", "moderate", "severe"].map((level) => (
                    <label
                      key={level}
                      className="flex items-center gap-2 cursor-pointer"
                    >
                      <input
                        type="radio"
                        className="radio radio-primary"
                        value={level}
                        checked={symptomForm.severity == level}
                        onChange={(e) =>
                          setSymptomForm({
                            ...symptomForm,
                            severity: e.target.value,
                          })
                        }
                      />
                      <span className="capitalize">{level}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            {/* Additional Info */}
            <div className="flex flex-col gap-1">
              <label className="font-medium">Additional Information</label>
              <textarea
                className="textarea textarea-bordered w-full resize-none"
                rows={2}
                placeholder="Drug allergies, chronic conditions, medications..."
                value={symptomForm.additional}
                onChange={(e) =>
                  setSymptomForm({ ...symptomForm, additional: e.target.value })
                }
              />
            </div>

            <button
              onClick={handleNext}
              className="btn btn-primary w-full mt-2"
            >
              Find Available Doctors
            </button>
          </div>
        </>
      )}

      {/* STEP 2 – Doctor List */}
      {step == 2 && (
        <div className="space-y-4">
          <button
            onClick={() => setStep(1)}
            className="btn btn-link btn-neutral p-0"
          >
            {"<"} Go Back
          </button>
          <div>
            <h2 className="text-xl font-semibold">
              Doctors Available for Consultation
            </h2>
            <p className="text-base-content/70">
              Based on your symptoms, the following doctors are recommended:
            </p>
          </div>

          {loadingDoctors ? (
            <LoadingScreen />
          ) : (
            <CardDoctor doctors={doctors} setStep={setStep} />
          )}
        </div>
      )}
    </div>
  );
};

export default Consult;
