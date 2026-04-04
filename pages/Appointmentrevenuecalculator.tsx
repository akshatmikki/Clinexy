import React, { useState } from "react";

const RevenueCalculator = () => {
  const [consultFee, setConsultFee] = useState(500);
  const [appointmentsPerWeek, setAppointmentsPerWeek] = useState(30);
  const [noShowRate, setNoShowRate] = useState(20);

  const revenuePerWeek = consultFee * appointmentsPerWeek;
  const lostRevenueWeekly = revenuePerWeek * (noShowRate / 100);
  const lostRevenueYearly = lostRevenueWeekly * 52;
  const savedWithClinexy = lostRevenueYearly * 0.4;

  return (
    <div className="min-h-screen bg-slate-900 text-white flex items-center justify-center">
      <section className="w-full max-w-5xl px-4 py-16">
        
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">
            Lost Revenue Calculator
          </h2>
          <p className="text-slate-400">
            See how much money "no-shows" are costing your clinic every year.
          </p>
        </div>

        {/* Card */}
        <div className="bg-slate-800 rounded-3xl p-8 md:p-12 shadow-2xl border border-slate-700">
          <div className="grid md:grid-cols-2 gap-12">

            {/* Left Inputs */}
            <div className="space-y-8">

              {/* Consultation Fee */}
              <div>
                <label className="block text-sm text-slate-300 mb-2">
                  Consultation Fee:{" "}
                  <span className="text-green-400 font-bold text-lg">
                    ₹{consultFee}
                  </span>
                </label>
                <input
                  type="number"
                  value={consultFee}
                  onChange={(e) => setConsultFee(Number(e.target.value))}
                  className="w-full bg-slate-900 border border-slate-600 rounded-lg py-3 px-4 text-white"
                />
              </div>

              {/* Appointments */}
              <div>
                <label className="block text-sm text-slate-300 mb-2">
                  Appointments Per Week:{" "}
                  <span className="text-blue-400 font-bold text-lg">
                    {appointmentsPerWeek}
                  </span>
                </label>
                <input
                  type="range"
                  min="5"
                  max="200"
                  value={appointmentsPerWeek}
                  onChange={(e) =>
                    setAppointmentsPerWeek(Number(e.target.value))
                  }
                  className="w-full"
                />
              </div>

              {/* No-show */}
              <div>
                <label className="block text-sm text-slate-300 mb-2">
                  No-Show Rate:{" "}
                  <span className="text-red-400 font-bold text-lg">
                    {noShowRate}%
                  </span>
                </label>
                <input
                  type="range"
                  min="0"
                  max="50"
                  value={noShowRate}
                  onChange={(e) => setNoShowRate(Number(e.target.value))}
                  className="w-full"
                />
              </div>
            </div>

            {/* Right Output */}
            <div className="flex flex-col justify-center space-y-6">

              {/* Lost Revenue */}
              <div className="bg-red-900/30 rounded-2xl p-6 border border-red-500/30 text-center">
                <div className="text-sm text-red-200 mb-1">
                  Money Lost Per Year
                </div>
                <div className="text-3xl font-bold text-red-400">
                  ₹{lostRevenueYearly.toLocaleString()}
                </div>
              </div>

              {/* Saved Revenue */}
              <div className="bg-green-900/30 rounded-2xl p-6 border border-green-500/30 text-center">
                <div className="text-sm text-green-200 mb-1">
                  Recoverable with Clinexy
                </div>
                <div className="text-3xl font-bold text-green-400">
                  ₹{savedWithClinexy.toLocaleString()}
                </div>
              </div>
            </div>
          </div>

          {/* CTA */}
          <div className="mt-8 text-center">
            <a
              href="https://rishabhkumar.clinexy.com/signup"
              target="_blank"
              rel="noreferrer"
            >
              <button className="bg-white text-slate-900 px-6 py-3 rounded-lg font-semibold hover:bg-slate-200">
                Stop Losing Revenue
              </button>
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};

export default RevenueCalculator;