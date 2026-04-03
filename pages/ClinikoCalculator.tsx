import React, { useState } from "react";
import { Calculator, Layout, Star, Activity, CheckCircle } from "lucide-react";

const ClinikoCalculator: React.FC = () => {
  const [region, setRegion] = useState<"India" | "Global">("Global");

  const clinikoBaseUSD = 49;
  const websiteCostUSD = 25;
  const reviewToolUSD = 49;

  const clinikoBaseINR = 2800;
  const websiteCostINR = 1500;
  const reviewToolINR = 3000;

  const clinexyCost = region === "Global" ? 99 : 999;

  const totalCliniko =
    region === "Global"
      ? clinikoBaseUSD + websiteCostUSD + reviewToolUSD
      : clinikoBaseINR + websiteCostINR + reviewToolINR;

  const yearlySavings = (totalCliniko - clinexyCost) * 12;
  const symbol = region === "Global" ? "$" : "₹";

  return (
    <section className="bg-slate-900 text-white h-screen flex items-center justify-center px-3 overflow-hidden">
      <div className="w-full max-w-4xl">

        {/* Header */}
        <div className="text-center mb-6">
          <div className="inline-flex p-2 bg-emerald-500/20 rounded-lg mb-2 text-emerald-400">
            <Calculator className="h-5 w-5" />
          </div>
          <h2 className="text-xl md:text-2xl font-bold">
            True Cost Calculator
          </h2>
          <p className="text-slate-400 text-xs md:text-sm">
            Compare Cliniko stack vs Clinexy all-in-one cost.
          </p>
        </div>

        {/* Card */}
        <div className="bg-slate-800 rounded-2xl p-4 md:p-6 border border-slate-700">

          {/* Toggle */}
          <div className="flex justify-center mb-4">
            <div className="bg-slate-700 p-1 rounded-lg flex">
              <button
                onClick={() => setRegion("Global")}
                className={`px-4 py-2 text-sm rounded ${
                  region === "Global" ? "bg-emerald-600" : "text-slate-300"
                }`}
              >
                Global ($)
              </button>

              <button
                onClick={() => setRegion("India")}
                className={`px-4 py-2 text-sm rounded ${
                  region === "India" ? "bg-emerald-600" : "text-slate-300"
                }`}
              >
                India (₹)
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

            {/* LEFT (Cliniko Stack) */}
            <div className="space-y-3">

              <div className="flex justify-between p-3 bg-slate-700 rounded">
                <span className="flex gap-2 items-center">
                  <Activity className="h-4 w-4 text-slate-400" />
                  Cliniko
                </span>
                <span>{symbol}{region==="Global"?clinikoBaseUSD:clinikoBaseINR}</span>
              </div>

              <div className="flex justify-between p-3 bg-slate-700 rounded">
                <span className="flex gap-2 items-center">
                  <Layout className="h-4 w-4 text-slate-400" />
                  Website
                </span>
                <span className="text-red-400">
                  +{symbol}{region==="Global"?websiteCostUSD:websiteCostINR}
                </span>
              </div>

              <div className="flex justify-between p-3 bg-slate-700 rounded">
                <span className="flex gap-2 items-center">
                  <Star className="h-4 w-4 text-slate-400" />
                  Reviews
                </span>
                <span className="text-red-400">
                  +{symbol}{region==="Global"?reviewToolUSD:reviewToolINR}
                </span>
              </div>

              <div className="flex justify-between p-3 border-t border-slate-600">
                <span>Total</span>
                <span className="text-red-400 font-bold">
                  {symbol}{totalCliniko}
                </span>
              </div>
            </div>

            {/* RIGHT (Clinexy) */}
            <div className="flex flex-col justify-center gap-4">

              <div className="bg-emerald-900/30 p-4 rounded border border-emerald-500/30">
                <div className="mb-2 font-bold text-emerald-300">
                  Clinexy (All-in-One)
                </div>

                <div className="space-y-1 text-sm">
                  <div className="flex gap-2">
                    <CheckCircle className="h-4 w-4 text-green-400" /> Software
                  </div>
                  <div className="flex gap-2">
                    <CheckCircle className="h-4 w-4 text-green-400" /> Website
                  </div>
                  <div className="flex gap-2">
                    <CheckCircle className="h-4 w-4 text-green-400" /> Reviews
                  </div>
                </div>

                <div className="mt-4 text-xl font-bold">
                  {symbol}{clinexyCost}
                </div>
              </div>

              <div className="bg-white text-slate-900 p-4 rounded text-center">
                <div className="text-xs uppercase text-emerald-700">
                  Yearly Savings
                </div>
                <div className="text-xl font-bold">
                  {symbol}{yearlySavings.toLocaleString()}
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ClinikoCalculator;