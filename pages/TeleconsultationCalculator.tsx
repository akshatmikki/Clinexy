import React, { useState } from "react";
import { Calculator } from "lucide-react";

const TeleconsultationCalculator: React.FC = () => {
  const [fee, setFee] = useState(500);
  const [consults, setConsults] = useState(10);

  const weekly = fee * consults;
  const monthly = weekly * 4;
  const yearly = weekly * 52;

  return (
    <section className="w-full min-h-screen bg-[#0b1220] text-white flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-5xl">

        {/* HEADER */}
        <div className="text-center mb-10">
          <div className="inline-flex p-3 bg-indigo-500/20 rounded-xl mb-4">
            <Calculator className="text-indigo-400 w-6 h-6" />
          </div>

          <h2 className="text-2xl md:text-3xl font-bold">
            Teleconsultation Potential Calculator
          </h2>

          <p className="text-slate-400 mt-2 text-sm md:text-base">
            See how much extra revenue you could generate by offering remote consultations.
          </p>
        </div>

        {/* CARD */}
        <div className="bg-[#1a2438] border border-[#2a3550] rounded-2xl p-6 md:p-10 shadow-xl">

          <div className="grid md:grid-cols-2 gap-8 items-center">

            {/* LEFT SIDE */}
            <div className="space-y-6">

              {/* FEE */}
              <div>
                <label className="text-sm text-slate-300">
                  Average Consultation Fee
                </label>

                <div className="relative mt-2">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                    ₹
                  </span>
                  <input
                    type="number"
                    value={fee}
                    onChange={(e) => setFee(Number(e.target.value) || 0)}
                    className="w-full bg-[#0b1220] border border-slate-600 rounded-lg pl-8 pr-3 py-3 outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              {/* CONSULTS */}
              <div>
                <label className="text-sm text-slate-300">
                  Expected Online Consults per Week:{" "}
                  <span className="text-indigo-400 font-bold">
                    {consults}
                  </span>
                </label>

                <input
                  type="range"
                  min="1"
                  max="50"
                  value={consults}
                  onChange={(e) => setConsults(Number(e.target.value))}
                  className="w-full mt-3 accent-indigo-500 cursor-pointer"
                />

                <div className="flex justify-between text-xs text-slate-500 mt-1">
                  <span>1</span>
                  <span>50</span>
                </div>
              </div>

            </div>

            {/* RIGHT SIDE RESULT */}
            <div className="bg-gradient-to-br from-indigo-600 to-purple-600 rounded-xl p-6 text-center shadow-lg">

              <p className="text-sm text-indigo-100">
                Potential Yearly Revenue
              </p>

              <h3 className="text-4xl md:text-5xl font-bold my-3">
                ₹{yearly.toLocaleString()}
              </h3>

              <p className="text-indigo-200 text-sm mb-6">
                That's{" "}
                <span className="text-white font-semibold">
                  ₹{monthly.toLocaleString()}
                </span>{" "}
                per month
              </p>

              <a
                href="https://rishabhkumar.clinexy.com/signup"
                target="_blank"
                className="block bg-white text-indigo-700 py-3 rounded-lg font-semibold hover:bg-gray-100 transition"
              >
                Start Earning
              </a>
            </div>

          </div>

          <p className="text-center text-xs text-slate-500 mt-6">
            *Estimates based on your inputs. Actual results may vary.
          </p>
        </div>
      </div>
    </section>
  );
};

export default TeleconsultationCalculator;