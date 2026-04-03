import React, { useState } from "react";
import { Calculator, Layout, Zap, Check } from "lucide-react";

const ValueCostCalculator: React.FC = () => {
  const [region, setRegion] = useState<"India" | "Global">("India");
  const [needsWebsite, setNeedsWebsite] = useState(true);
  const [needsTelehealth, setNeedsTelehealth] = useState(true);

  const clinexyPrice = region === "India" ? 999 : 99;

  const spBasePriceUSD = 29;
  const spPlusPriceUSD = 99;
  const exchangeRate = 83;

  let spEstimatedUSD = spBasePriceUSD;
  if (needsWebsite || needsTelehealth) {
    spEstimatedUSD = spPlusPriceUSD;
  }

  const spCost =
    region === "India" ? spEstimatedUSD * exchangeRate : spEstimatedUSD;

  const monthlySavings = spCost - clinexyPrice;
  const yearlySavings = monthlySavings * 12;

  return (
    <section className="bg-slate-900 text-white h-screen flex items-center justify-center px-3 overflow-hidden">
      <div className="w-full max-w-4xl">

        {/* Header */}
        <div className="text-center mb-6">
          <div className="inline-flex p-2 bg-teal-500/20 rounded-lg mb-2 text-teal-400">
            <Calculator className="h-5 w-5" />
          </div>
          <h2 className="text-xl md:text-2xl font-bold">
            Value & Cost Calculator
          </h2>
          <p className="text-slate-400 text-xs md:text-sm">
            See the price difference based on your location and needs.
          </p>
        </div>

        {/* Card */}
        <div className="bg-slate-800 rounded-2xl p-4 md:p-6 border border-slate-700">

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

            {/* LEFT */}
            <div className="space-y-4">

              {/* Toggle */}
              <div className="bg-slate-700 p-1 rounded-lg flex">
                <button
                  onClick={() => setRegion("India")}
                  className={`flex-1 py-2 text-sm rounded ${
                    region === "India"
                      ? "bg-teal-600"
                      : "text-slate-300"
                  }`}
                >
                  🇮🇳 India
                </button>

                <button
                  onClick={() => setRegion("Global")}
                  className={`flex-1 py-2 text-sm rounded ${
                    region === "Global"
                      ? "bg-teal-600"
                      : "text-slate-300"
                  }`}
                >
                  🌍 Global
                </button>
              </div>

              {/* Options */}
              <div className="space-y-3">

                <div
                  onClick={() => setNeedsWebsite(!needsWebsite)}
                  className="flex justify-between p-3 bg-slate-700 rounded cursor-pointer"
                >
                  <span className="flex items-center gap-2">
                    <Layout className="h-4 w-4 text-teal-400" />
                    Website
                  </span>
                  {needsWebsite && <Check className="text-teal-400" />}
                </div>

                <div
                  onClick={() => setNeedsTelehealth(!needsTelehealth)}
                  className="flex justify-between p-3 bg-slate-700 rounded cursor-pointer"
                >
                  <span className="flex items-center gap-2">
                    <Zap className="h-4 w-4 text-teal-400" />
                    Telehealth
                  </span>
                  {needsTelehealth && <Check className="text-teal-400" />}
                </div>

              </div>
            </div>

            {/* RIGHT */}
            <div className="flex flex-col justify-center gap-3">

              <div className="bg-slate-700 p-4 rounded">
                <div className="flex justify-between">
                  <span>SimplePractice</span>
                  <span>
                    {region === "India" ? "₹" : "$"}
                    {Math.round(spCost).toLocaleString()}/mo
                  </span>
                </div>
              </div>

              <div className="bg-slate-700 p-4 rounded">
                <div className="flex justify-between">
                  <span>Clinexy</span>
                  <span>
                    {region === "India" ? "₹" : "$"}
                    {clinexyPrice}/mo
                  </span>
                </div>
              </div>

              <div className="bg-teal-600 p-4 rounded text-center">
                <div className="text-xs uppercase">
                  Yearly Savings
                </div>
                <div className="text-xl font-bold">
                  {region === "India" ? "₹" : "$"}
                  {Math.max(0, Math.round(yearlySavings)).toLocaleString()}
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ValueCostCalculator;