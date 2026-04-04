import React, { useState, useEffect } from "react";
import { Calculator } from "lucide-react";

const SavingsCalculator: React.FC = () => {
  const [currency, setCurrency] = useState<"INR" | "USD">("INR");
  const [appointments, setAppointments] = useState(30);
  const [fee, setFee] = useState(500);
  const [commission, setCommission] = useState(20);

  const clinexyCost = currency === "INR" ? 999 : 99;

  useEffect(() => {
    setFee(currency === "INR" ? 500 : 50);
  }, [currency]);

  const platformCost = (appointments * fee * commission) / 100;
  const monthlySavings = platformCost - clinexyCost;
  const yearlySavings = monthlySavings * 12;

  const symbol = currency === "INR" ? "₹" : "$";

  return (
    // ✅ FULL HEIGHT + FULL COLOR FIX
    <section className="w-full min-h-screen bg-[#0B1B34] text-white flex items-center justify-center px-4">

      <div className="w-full max-w-5xl">

        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center p-3 bg-blue-500/20 rounded-xl mb-4 text-blue-400">
            <Calculator className="h-8 w-8" />
          </div>

          <h2 className="text-2xl md:text-4xl font-bold">
            Commission Savings Calculator
          </h2>

          <p className="text-slate-400 text-sm md:text-base mt-2">
            See how much you save by using Clinexy vs commission-based platforms.
          </p>
        </div>

        {/* Card */}
        <div className="bg-[#1E2A3B] rounded-2xl p-4 md:p-8 border border-slate-700 shadow-xl">

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10">

            {/* LEFT */}
            <div className="space-y-6">

              {/* Currency */}
              <div className="flex bg-slate-700 rounded-lg p-1 w-fit">
                <button
                  onClick={() => setCurrency("INR")}
                  className={`px-4 py-1 text-sm rounded-md ${
                    currency === "INR"
                      ? "bg-blue-600 text-white"
                      : "text-slate-300"
                  }`}
                >
                  INR (₹)
                </button>

                <button
                  onClick={() => setCurrency("USD")}
                  className={`px-4 py-1 text-sm rounded-md ${
                    currency === "USD"
                      ? "bg-blue-600 text-white"
                      : "text-slate-300"
                  }`}
                >
                  USD ($)
                </button>
              </div>

              {/* Appointments */}
              <div>
                <label className="text-sm text-slate-400">
                  Monthly Appointments (Online)
                </label>

                <input
                  type="range"
                  min="10"
                  max="200"
                  value={appointments}
                  onChange={(e) => setAppointments(Number(e.target.value))}
                  className="w-full mt-2 accent-purple-500"
                />

                <div className="text-right text-purple-400 font-bold">
                  {appointments}
                </div>
              </div>

              {/* Fee */}
              <div>
                <label className="text-sm text-slate-400">
                  Avg Fee per Consultation
                </label>

                <div className="relative mt-2">
                  <span className="absolute left-3 top-2 text-slate-400">
                    {symbol}
                  </span>

                  <input
                    type="number"
                    value={fee}
                    onChange={(e) => setFee(Number(e.target.value))}
                    className="w-full bg-[#0F172A] border border-slate-600 rounded-lg py-2 pl-8 pr-3"
                  />
                </div>
              </div>

              {/* Commission */}
              <div>
                <label className="text-sm text-slate-400">
                  Platform Commission
                </label>

                <div className="flex items-center gap-4 mt-2">
                  <input
                    type="range"
                    min="0"
                    max="50"
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

              <div className="bg-slate-700/50 p-6 rounded-xl border border-slate-600">
                <p className="text-sm text-slate-400">
                  Platform Cost per Month
                </p>
                <h2 className="text-2xl font-bold text-red-400">
                  {symbol}{Math.round(platformCost).toLocaleString()}
                </h2>
              </div>

              <div className="bg-slate-700/50 p-6 rounded-xl border border-slate-600">
                <p className="text-sm text-slate-400">
                  Clinexy Cost per Month
                </p>
                <h2 className="text-2xl font-bold">
                  {symbol}{clinexyCost}
                </h2>
              </div>

              <div className="bg-blue-600 p-6 rounded-xl shadow-lg">
                <p className="text-sm uppercase text-blue-200 font-bold">
                  Your Monthly Savings
                </p>

                <h1 className="text-4xl font-bold">
                  {symbol}{Math.max(0, Math.round(monthlySavings)).toLocaleString()}
                </h1>

                <p className="text-xs text-blue-200 mt-2">
                  Save {symbol}{Math.max(0, Math.round(yearlySavings)).toLocaleString()} per year
                </p>
              </div>

            </div>

          </div>
        </div>

      </div>
    </section>
  );
};

export default SavingsCalculator;