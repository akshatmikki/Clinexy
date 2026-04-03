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
    <section className="bg-slate-900 text-white h-screen flex items-center justify-center px-3 overflow-hidden">
      
      <div className="w-full max-w-4xl h-full flex flex-col justify-center">

        {/* Header */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center p-2 bg-indigo-500/20 rounded-lg mb-2 text-indigo-400">
            <Calculator className="h-5 w-5" />
          </div>

          <h2 className="text-xl md:text-2xl font-bold">
            Commission vs Subscription Calculator
          </h2>

          <p className="text-slate-400 text-xs md:text-sm">
            See how much you could save by switching to a flat monthly fee.
          </p>
        </div>

        {/* Card */}
        <div className="bg-slate-800 rounded-2xl p-4 md:p-6 shadow-2xl border border-slate-700 overflow-hidden">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">

            {/* Inputs */}
            <div className="space-y-4">

              <div>
                <label className="text-sm text-slate-300">
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

              <div>
                <label className="text-sm text-slate-300">
                  Avg Fee (₹):{" "}
                  <span className="text-green-400 font-bold">₹{fee}</span>
                </label>

                <input
                  type="number"
                  value={fee}
                  onChange={(e) => setFee(Number(e.target.value))}
                  className="w-full bg-slate-900 border border-slate-600 rounded-lg px-3 py-2"
                />
              </div>

              <div>
                <label className="text-sm text-slate-300">
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
            <div className="flex flex-col justify-center gap-3">

              <div className="flex justify-between p-3 bg-slate-700 rounded-lg">
                <span className="text-slate-400 text-xs">
                  Practo Cost/Mo
                </span>
                <span className="text-red-400 font-bold text-sm">
                  ₹{Math.round(practoCost).toLocaleString()}
                </span>
              </div>

              <div className="flex justify-between p-3 bg-slate-700 rounded-lg">
                <span className="text-slate-400 text-xs">
                  Clinexy Cost/Mo
                </span>
                <span className="font-bold text-sm">
                  ₹{clinexyCost}
                </span>
              </div>

              <div className="bg-indigo-600 p-4 rounded-lg text-center">
                <div className="text-xs uppercase text-indigo-200">
                  Yearly Savings
                </div>

                <div className="text-xl md:text-2xl font-bold">
                  ₹{Math.max(0, Math.round(yearlySavings)).toLocaleString()}
                </div>
              </div>

            </div>
          </div>

        </div>

      </div>
    </section>
  );
};

export default PractoVsClinexyCalculator;