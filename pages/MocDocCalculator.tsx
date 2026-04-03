import React, { useState } from "react";
import { Calculator, CheckCircle } from "lucide-react";

const MocDocCalculator: React.FC = () => {
  const [softwareCost, setSoftwareCost] = useState(1500);
  const [websiteCost, setWebsiteCost] = useState(1000);
  const [smsCost, setSmsCost] = useState(500);

  const total = softwareCost + websiteCost + smsCost;
  const clinexyCost = 999;
  const monthlySavings = total - clinexyCost;
  const yearlySavings = monthlySavings * 12;

  return (
    <section className="bg-slate-900 text-white h-screen flex items-center justify-center px-3 overflow-hidden">
      <div className="w-full max-w-4xl">

        {/* Header */}
        <div className="text-center mb-6">
          <div className="inline-flex p-2 bg-blue-500/20 rounded-lg mb-2 text-blue-400">
            <Calculator className="h-5 w-5" />
          </div>
          <h2 className="text-xl md:text-2xl font-bold">
            True Cost of Ownership Calculator
          </h2>
          <p className="text-slate-400 text-xs md:text-sm">
            Compare traditional clinic stack vs Clinexy pricing.
          </p>
        </div>

        {/* Card */}
        <div className="bg-slate-800 rounded-2xl p-4 md:p-6 border border-slate-700">

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

            {/* LEFT INPUTS */}
            <div className="space-y-4">

              <div>
                <label className="text-sm text-slate-400">
                  Clinic Software (₹)
                </label>
                <input
                  type="number"
                  value={softwareCost}
                  onChange={(e) => setSoftwareCost(Number(e.target.value))}
                  className="w-full bg-slate-700 border border-slate-600 rounded p-2 mt-1"
                />
              </div>

              <div>
                <label className="text-sm text-slate-400">
                  Website Cost (₹)
                </label>
                <input
                  type="number"
                  value={websiteCost}
                  onChange={(e) => setWebsiteCost(Number(e.target.value))}
                  className="w-full bg-slate-700 border border-slate-600 rounded p-2 mt-1"
                />
              </div>

              <div>
                <label className="text-sm text-slate-400">
                  SMS Cost (₹)
                </label>
                <input
                  type="number"
                  value={smsCost}
                  onChange={(e) => setSmsCost(Number(e.target.value))}
                  className="w-full bg-slate-700 border border-slate-600 rounded p-2 mt-1"
                />
              </div>

              <div className="flex justify-between pt-2 border-t border-slate-600 text-red-400">
                <span>Total</span>
                <span className="font-bold">₹{total}</span>
              </div>
            </div>

            {/* RIGHT OUTPUT */}
            <div className="flex flex-col justify-center gap-4">

              <div className="bg-blue-600 p-4 rounded text-white">
                <div className="text-sm mb-1">Clinexy Plan</div>
                <div className="text-2xl font-bold">₹{clinexyCost}</div>

                <div className="mt-2 text-xs space-y-1">
                  <div className="flex gap-2">
                    <CheckCircle className="h-4 w-4" /> Software
                  </div>
                  <div className="flex gap-2">
                    <CheckCircle className="h-4 w-4" /> Website
                  </div>
                  <div className="flex gap-2">
                    <CheckCircle className="h-4 w-4" /> WhatsApp
                  </div>
                </div>
              </div>

              <div className="bg-white text-slate-900 p-4 rounded text-center">
                <div className="text-xs text-slate-500">
                  Monthly Savings
                </div>
                <div className="text-xl font-bold text-green-600">
                  ₹{Math.max(0, monthlySavings)}
                </div>

                <div className="text-xs text-slate-400">
                  ₹{Math.max(0, yearlySavings).toLocaleString()} yearly
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MocDocCalculator;