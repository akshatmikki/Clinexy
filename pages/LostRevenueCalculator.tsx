import React, { useState } from "react";
import { Calculator } from "lucide-react";

const LostRevenueCalculator: React.FC = () => {
  // State
  const [calcFee, setCalcFee] = useState(500);
  const [calcAppts, setCalcAppts] = useState(40);
  const [calcNoShow, setCalcNoShow] = useState(15);

  // Calculations
  const calcLostWeekly = calcFee * calcAppts * (calcNoShow / 100);
  const calcLostYearly = calcLostWeekly * 52;
    const CLINEXY_YEARLY_COST = 11988;
    const savings = calcLostYearly - CLINEXY_YEARLY_COST;

  return (
    <section className="py-12 bg-slate-900 text-white min-h-screen flex items-center">
      <div className="max-w-4xl mx-auto px-4 w-full">
        
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center p-3 bg-red-500/20 rounded-xl mb-4 text-red-400">
            <Calculator className="h-8 w-8" />
          </div>
          <h2 className="text-2xl md:text-3xl font-bold mb-4">
            Are No-Shows Eating Your Profits?
          </h2>
          <p className="text-slate-400">
            See how much revenue you lose annually due to missed appointments.
          </p>
        </div>

        {/* Calculator Box */}
        <div className="bg-slate-800 rounded-3xl p-6 md:p-10 shadow-2xl border border-slate-700">
          <div className="grid md:grid-cols-2 gap-10">

            {/* Inputs */}
            <div className="space-y-6">

              {/* Fee */}
              <div>
                <label className="block text-sm text-slate-300 mb-2">
                  Avg Consultation Fee
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                    ₹
                  </span>
                  <input
                    type="number"
                    value={calcFee}
                    onChange={(e) => setCalcFee(Number(e.target.value))}
                    className="w-full bg-slate-900 border border-slate-600 rounded-lg py-2.5 pl-8 pr-3 text-white focus:ring-2 focus:ring-primary-500"
                  />
                </div>
              </div>

              {/* Appointments */}
              <div>
                <label className="block text-sm text-slate-300 mb-2">
                  Weekly Appointments:{" "}
                  <span className="text-primary-400 font-bold">
                    {calcAppts}
                  </span>
                </label>
                <input
                  type="range"
                  min="5"
                  max="200"
                  value={calcAppts}
                  onChange={(e) => setCalcAppts(Number(e.target.value))}
                  className="w-full h-2 bg-slate-600 rounded-lg cursor-pointer accent-primary-500"
                />
              </div>

              {/* No-show */}
              <div>
                <label className="block text-sm text-slate-300 mb-2">
                  No-Show Rate:{" "}
                  <span className="text-red-400 font-bold">
                    {calcNoShow}%
                  </span>
                </label>
                <input
                  type="range"
                  min="0"
                  max="50"
                  value={calcNoShow}
                  onChange={(e) => setCalcNoShow(Number(e.target.value))}
                  className="w-full h-2 bg-slate-600 rounded-lg cursor-pointer accent-red-500"
                />
              </div>
            </div>

            {/* Output */}
            <div className="flex flex-col justify-center space-y-5">

              <div className="bg-red-900/30 rounded-2xl p-5 border border-red-500/30 text-center">
                <div className="text-xs text-red-200 uppercase font-semibold mb-1">
                  Yearly Revenue Lost
                </div>
                <div className="text-3xl font-bold text-red-400">
                  ₹{calcLostYearly.toLocaleString()}
                </div>
                <p className="text-xs text-red-300 mt-2">
                  Money left on the table
                </p>
              </div>

              <div className="bg-secondary-600 rounded-2xl p-5 text-center shadow-lg">
                <div className="text-xs text-secondary-100 uppercase font-semibold mb-1">
                  Clinexy Cost / Year
                </div>
                <div className="text-2xl font-bold text-white">
  ₹{savings.toLocaleString()}
</div>
                <p className="text-xs text-secondary-100 mt-2">
                  Pays for itself by saving just{" "}
                  <span className="font-bold underline">
                    one missed appointment
                  </span>{" "}
                  a month.
                </p>
              </div>

            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LostRevenueCalculator;