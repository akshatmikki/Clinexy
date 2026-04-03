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
    <section className="bg-slate-900 text-white min-h-screen flex items-center justify-center px-4">
      <div className="max-w-4xl w-full">

        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center p-3 bg-indigo-500/20 rounded-xl mb-4 text-indigo-400">
            <Calculator className="h-7 w-7" />
          </div>
          <h2 className="text-3xl font-bold mb-2">
            Commission vs Subscription Calculator
          </h2>
          <p className="text-slate-400">
            See how much you could save by switching to a flat monthly fee.
          </p>
        </div>

        {/* Calculator Card */}
        <div className="bg-slate-800 rounded-3xl p-6 md:p-10 shadow-2xl border border-slate-700">
          <div className="grid md:grid-cols-2 gap-10">

            {/* Inputs */}
            <div className="space-y-8">

              {/* Appointments */}
              <div>
                <label className="block text-sm text-slate-300 mb-2">
                  Monthly Appointments:{" "}
                  <span className="text-indigo-400 font-bold text-lg">
                    {appointments}
                  </span>
                </label>
                <input
                  type="range"
                  min="10"
                  max="300"
                  value={appointments}
                  onChange={(e) => setAppointments(Number(e.target.value))}
                  className="w-full h-2 bg-slate-600 rounded-lg cursor-pointer accent-indigo-500"
                />
              </div>

              {/* Fee */}
              <div>
                <label className="block text-sm text-slate-300 mb-2">
                  Avg Fee (₹):{" "}
                  <span className="text-green-400 font-bold text-lg">
                    ₹{fee}
                  </span>
                </label>
                <input
                  type="number"
                  value={fee}
                  onChange={(e) => setFee(Number(e.target.value))}
                  className="w-full bg-slate-900 border border-slate-600 rounded-lg py-3 px-4 text-white"
                />
              </div>

              {/* Commission */}
              <div>
                <label className="block text-sm text-slate-300 mb-2">
                  Marketplace Commission:{" "}
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
                  className="w-full h-2 bg-slate-600 rounded-lg cursor-pointer accent-red-500"
                />
              </div>
            </div>

            {/* Output */}
            <div className="flex flex-col justify-center gap-6">

              <div className="flex justify-between items-center p-4 bg-slate-700 rounded-xl border border-slate-600">
                <div className="text-sm text-slate-400">Practo Cost/Mo</div>
                <div className="text-xl font-bold text-red-400">
                  ₹{Math.round(practoCost).toLocaleString()}
                </div>
              </div>

              <div className="flex justify-between items-center p-4 bg-slate-700 rounded-xl border border-slate-600">
                <div className="text-sm text-slate-400">Clinexy Cost/Mo</div>
                <div className="text-xl font-bold text-white">
                  ₹{clinexyCost}
                </div>
              </div>

              <div className="bg-indigo-600 p-6 rounded-xl shadow-lg text-center">
                <div className="text-sm text-indigo-200 font-bold uppercase mb-1">
                  Yearly Savings
                </div>
                <div className="text-4xl font-bold text-white">
                  ₹{Math.max(0, Math.round(yearlySavings)).toLocaleString()}
                </div>
                <p className="text-xs text-indigo-200 mt-2">
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