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
    <section className="bg-[#0b1220] text-white min-h-screen flex items-center justify-center px-4">

      <div className="w-full max-w-5xl">

        {/* HEADER */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center p-4 bg-blue-500/10 rounded-2xl mb-4">
            <Calculator className="w-6 h-6 text-blue-400" />
          </div>

          <h2 className="text-2xl md:text-3xl font-bold">
            Direct Booking Savings Calculator
          </h2>

          <p className="text-slate-400 mt-2 text-sm md:text-base">
            Calculate how much you save by owning your website instead of paying commissions to marketplaces.
          </p>
        </div>

        {/* CARD */}
        <div className="bg-[#162338] border border-[#22304a] rounded-3xl p-6 md:p-10 shadow-2xl">

          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">

            {/* LEFT SIDE */}
            <div className="space-y-8">

              {/* APPOINTMENTS */}
              <div>
                <label className="text-sm text-slate-300 block mb-2">
                  Appointments Per Month:{" "}
                  <span className="text-blue-400 font-semibold text-lg">
                    {appointments}
                  </span>
                </label>

                <input
                  type="range"
                  min="10"
                  max="500"
                  value={appointments}
                  onChange={(e) => setAppointments(Number(e.target.value))}
                  className="w-full accent-blue-500"
                />
              </div>

              {/* FEE */}
              <div>
                <label className="text-sm text-slate-300 block mb-2">
                  Avg Consultation Fee:{" "}
                  <span className="text-green-400 font-semibold text-lg">
                    ${fee}
                  </span>
                </label>

                <input
                  type="number"
                  value={fee}
                  onChange={(e) => setFee(Number(e.target.value))}
                  className="w-full bg-[#0b1220] border border-slate-600 rounded-lg px-4 py-3 text-white focus:outline-none"
                />
              </div>

              {/* COMMISSION */}
              <div>
                <label className="text-sm text-slate-300 block mb-2">
                  Typical Marketplace Commission:{" "}
                  <span className="text-red-400 font-semibold text-lg">
                    {commission}%
                  </span>
                </label>

                <input
                  type="range"
                  min="0"
                  max="40"
                  value={commission}
                  onChange={(e) => setCommission(Number(e.target.value))}
                  className="w-full accent-red-500"
                />
              </div>

            </div>

            {/* RIGHT SIDE */}
            <div className="bg-[#1e3354] rounded-2xl p-8 border border-blue-500/30 text-center">

              <div className="mb-8">
                <p className="text-xs text-blue-200 uppercase tracking-wider mb-1">
                  Commission Saved Per Month
                </p>
                <h3 className="text-4xl font-bold text-white">
                  ${Math.round(monthly).toLocaleString()}
                </h3>
              </div>

              <div>
                <p className="text-xs text-blue-200 uppercase tracking-wider mb-1">
                  Commission Saved Per Year
                </p>
                <h3 className="text-5xl font-bold text-green-400">
                  ${Math.round(yearly).toLocaleString()}
                </h3>
              </div>

              <p className="text-xs text-slate-400 mt-6">
                With Clinexy, you pay $0 commission. You keep 100% of your fee.
              </p>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
};

export default CalculatorSection;