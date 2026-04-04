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
    <section className="min-h-screen flex items-center py-16 md:py-24 bg-[#0b1220] text-white">
      <div className="max-w-5xl mx-auto px-4 w-full">

        {/* HEADER */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center p-3 bg-blue-500/20 rounded-xl mb-4">
            <Calculator className="w-6 h-6 text-blue-400" />
          </div>

          <h2 className="text-2xl md:text-3xl font-bold">
            Direct Booking Savings Calculator
          </h2>

          <p className="text-sm md:text-base text-slate-400 mt-2">
            Calculate how much you save by owning your website instead of paying commissions.
          </p>
        </div>

        {/* CARD */}
        <div className="bg-[#121a2b] border border-[#1f2a44] rounded-2xl p-6 md:p-10 shadow-xl">

          <div className="grid md:grid-cols-2 gap-8">

            {/* LEFT */}
            <div className="space-y-6">

              {/* APPOINTMENTS */}
              <div>
                <label className="text-sm text-slate-300">
                  Appointments Per Month:{" "}
                  <span className="text-blue-400 font-bold text-lg">
                    {appointments}
                  </span>
                </label>

                <input
                  type="range"
                  min="10"
                  max="500"
                  value={appointments}
                  onChange={(e) => setAppointments(Number(e.target.value))}
                  className="w-full mt-2 accent-blue-500 cursor-pointer"
                />
              </div>

              {/* FEE */}
              <div>
                <label className="text-sm text-slate-300">
                  Avg Consultation Fee:{" "}
                  <span className="text-green-400 font-bold text-lg">
                    ₹{fee}
                  </span>
                </label>

                <input
                  type="number"
                  value={fee}
                  onChange={(e) => setFee(Number(e.target.value) || 0)}
                  className="w-full mt-2 bg-[#0b1220] border border-slate-600 rounded-lg px-3 py-2 outline-none focus:border-blue-500"
                />
              </div>

              {/* COMMISSION */}
              <div>
                <label className="text-sm text-slate-300">
                  Typical Marketplace Commission:{" "}
                  <span className="text-red-400 font-bold text-lg">
                    {commission}%
                  </span>
                </label>

                <input
                  type="range"
                  min="0"
                  max="40"
                  value={commission}
                  onChange={(e) => setCommission(Number(e.target.value))}
                  className="w-full mt-2 accent-red-500 cursor-pointer"
                />
              </div>
            </div>

            {/* RIGHT RESULT */}
            <div className="bg-[#1b2a4a] rounded-xl p-6 text-center border border-blue-500/30 flex flex-col justify-center">

              <div className="mb-6">
                <p className="text-xs text-blue-200 uppercase tracking-wide">
                  Commission Saved Per Month
                </p>
                <h3 className="text-3xl md:text-4xl font-bold mt-1">
                  ₹{Math.round(monthly).toLocaleString()}
                </h3>
              </div>

              <div>
                <p className="text-xs text-blue-200 uppercase tracking-wide">
                  Commission Saved Per Year
                </p>
                <h3 className="text-4xl md:text-5xl font-bold text-green-400 mt-1">
                  ₹{Math.round(yearly).toLocaleString()}
                </h3>
              </div>

              <p className="text-xs text-slate-400 mt-4">
                With Clinexy, you pay ₹0 commission. You keep 100% of your fee.
              </p>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
};

export default CalculatorSection;