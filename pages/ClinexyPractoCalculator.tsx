import React, { useState } from "react";
import { Calculator } from "lucide-react";

const PractoVsClinexyCalculator: React.FC = () => {
  const [appointments, setAppointments] = useState(60);
  const [fee, setFee] = useState(500);
  const [commission, setCommission] = useState(20);

  const practoCost = (appointments * fee * commission) / 100;
  const clinexyCost = 999;
  const yearlySavings = (practoCost - clinexyCost) * 12;

  return (
    <section className="bg-slate-900 text-white min-h-screen flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-4xl">

        {/* Header */}
        <div className="text-center mb-8 md:mb-10">
          <div className="inline-flex items-center justify-center p-3 bg-indigo-500/20 rounded-xl mb-4 text-indigo-400">
            <Calculator className="h-6 w-6 md:h-7 md:w-7" />
          </div>

          <h2 className="text-2xl md:text-3xl font-bold mb-2 leading-tight">
            Commission vs Subscription Calculator
          </h2>

          <p className="text-slate-400 text-sm md:text-base px-2">
            See how much you could save by switching to a flat monthly fee.
          </p>
        </div>

        {/* Card */}
        <div className="bg-slate-800 rounded-2xl md:rounded-3xl p-4 md:p-8 shadow-2xl border border-slate-700">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10">

            {/* Inputs */}
            <div className="space-y-6 md:space-y-8">

              {/* Appointments */}
              <div>
                <label className="block text-sm text-slate-300 mb-2">
                  Monthly Appointments:{" "}
                  <span className="text-indigo-400 font-bold">
                    {appointments}
                  </span>
                </label>

                <input
                  type="range"
                  min="10"
                  max="300"
                  value={appointments}
                  onChange={(e) => setAppointments(Number(e.target.value))}
                  className="w-full accent-indigo-500"
                />
              </div>

              {/* Fee */}
              <div>
                <label className="block text-sm text-slate-300 mb-2">
                  Avg Fee (₹):{" "}
                  <span className="text-green-400 font-bold">₹{fee}</span>
                </label>

                <input
                  type="number"
                  value={fee}
                  onChange={(e) => setFee(Number(e.target.value))}
                  className="w-full bg-slate-900 border border-slate-600 rounded-lg px-3 py-2 md:py-3"
                />
              </div>

              {/* Commission */}
              <div>
                <label className="block text-sm text-slate-300 mb-2">
                  Marketplace Commission:{" "}
                  <span className="text-red-400 font-bold">
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

            {/* Output */}
            <div className="flex flex-col justify-center gap-4 md:gap-6 mt-2 md:mt-0">

              <div className="flex justify-between items-center p-3 md:p-4 bg-slate-700 rounded-xl border border-slate-600">
                <span className="text-slate-400 text-sm">
                  Practo Cost/Mo
                </span>
                <span className="text-red-400 font-bold text-base md:text-lg">
                  ₹{Math.round(practoCost).toLocaleString()}
                </span>
              </div>

              <div className="flex justify-between items-center p-3 md:p-4 bg-slate-700 rounded-xl border border-slate-600">
                <span className="text-slate-400 text-sm">
                  Clinexy Cost/Mo
                </span>
                <span className="font-bold text-base md:text-lg">
                  ₹{clinexyCost}
                </span>
              </div>

              <div className="bg-indigo-600 p-4 md:p-6 rounded-xl text-center shadow-lg">
                <div className="text-xs md:text-sm uppercase text-indigo-200 font-semibold mb-1">
                  Yearly Savings
                </div>

                <div className="text-2xl md:text-4xl font-bold">
                  ₹{Math.max(0, Math.round(yearlySavings)).toLocaleString()}
                </div>

                <p className="text-xs text-indigo-200 mt-2 hidden md:block">
                  More patients = More income for you.
                </p>
              </div>

            </div>
          </div>
        </div>

      </div>
    </section>
  );
};

export default PractoVsClinexyCalculator;