import React, { useState } from "react";
import { Calculator } from "lucide-react";

const CalculatorSection: React.FC = () => {
  const [appointments, setAppointments] = useState(100);
  const [fee, setFee] = useState(500);
  const [commission, setCommission] = useState(15);

  const total = appointments * fee;
  const monthly = total * (commission / 100);
  const yearly = monthly * 12;

  return (
    <section className="w-full min-h-screen bg-[#0B1B34] text-white flex items-center justify-center px-4">

      <div className="w-full max-w-5xl">

        {/* HEADER */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center p-3 bg-blue-500/20 rounded-xl mb-3">
            <Calculator className="h-6 w-6 text-blue-400" />
          </div>

          <h2 className="text-xl md:text-3xl font-bold">
            Direct Booking Savings Calculator
          </h2>

          <p className="text-slate-400 text-sm mt-2">
            Calculate how much you save by owning your website instead of paying commissions.
          </p>
        </div>

        {/* CARD */}
        <div className="bg-[#1E2A3B] rounded-2xl p-4 md:p-8 border border-slate-700 shadow-xl">

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10">

            {/* LEFT */}
            <div className="space-y-5">

              {/* APPOINTMENTS */}
              <div>
                <label className="text-sm text-slate-400">
                  Appointments Per Month
                </label>

                <input
                  type="range"
                  min="10"
                  max="500"
                  value={appointments}
                  onChange={(e) => setAppointments(Number(e.target.value))}
                  className="w-full mt-2 accent-blue-500"
                />

                <div className="text-blue-400 font-bold text-right">
                  {appointments}
                </div>
              </div>

              {/* FEE */}
              <div>
                <label className="text-sm text-slate-400">
                  Avg Consultation Fee
                </label>

                <div className="relative mt-2">
                  <span className="absolute left-3 top-2 text-slate-400">
                    ₹
                  </span>

                  <input
                    type="number"
                    value={fee}
                    onChange={(e) => setFee(Number(e.target.value))}
                    className="w-full bg-[#0F172A] border border-slate-600 rounded-lg py-2 pl-8 pr-3"
                  />
                </div>
              </div>

              {/* COMMISSION */}
              <div>
                <label className="text-sm text-slate-400">
                  Marketplace Commission
                </label>

                <div className="flex items-center gap-4 mt-2">
                  <input
                    type="range"
                    min="0"
                    max="40"
                    value={commission}
                    onChange={(e) => setCommission(Number(e.target.value))}
                    className="w-full accent-red-500"
                  />

                  <span className="text-red-400 font-bold">
                    {commission}%
                  </span>
                </div>
              </div>

            </div>

            {/* RIGHT */}
            <div className="flex flex-col justify-center gap-4">

              <div className="bg-slate-700/50 p-5 rounded-xl border border-slate-600">
                <p className="text-sm text-slate-400">
                  Commission Saved Per Month
                </p>
                <h2 className="text-2xl font-bold text-white">
                  ₹{Math.round(monthly).toLocaleString()}
                </h2>
              </div>

              <div className="bg-blue-600 p-6 rounded-xl shadow-lg text-center">
                <p className="text-sm uppercase text-blue-200 font-bold">
                  Yearly Savings
                </p>

                <h1 className="text-4xl font-bold text-green-300">
                  ₹{Math.round(yearly).toLocaleString()}
                </h1>
              </div>

            </div>

          </div>
        </div>

      </div>
    </section>
  );
};

export default CalculatorSection;