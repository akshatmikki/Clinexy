import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  CheckCircle, XCircle, Minus, ArrowRight, Check,
  Users, Calendar, Globe, Star, Wallet, Calculator,
  TrendingUp, Shield, Layout, Zap, Activity
} from 'lucide-react';
import { Button } from '../components/Button';

export const CompareCliniko: React.FC = () => {
  // Calculator State
  const [region, setRegion] = useState<'India' | 'Global'>('Global');
  
  // Costs
  // Global ($)
  const clinikoBaseUSD = 49; // Approx base plan
  const websiteCostUSD = 25; // Squarespace/Wix approx
  const reviewToolUSD = 49; // Podium/Birdeye entry level approx
  
  // India (₹)
  const clinikoBaseINR = 2800; // Approx conversion
  const websiteCostINR = 1500;
  const reviewToolINR = 3000;

  const clinexyCost = region === 'Global' ? 99 : 999;
  
  const totalClinikoStack = region === 'Global' 
    ? clinikoBaseUSD + websiteCostUSD + reviewToolUSD
    : clinikoBaseINR + websiteCostINR + reviewToolINR;

  const savings = totalClinikoStack - clinexyCost;
  const yearlySavings = savings * 12;

  const currencySymbol = region === 'Global' ? '$' : '₹';

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 bg-slate-50 border-b border-slate-200">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-emerald-100 text-emerald-700 px-4 py-1.5 rounded-full text-sm font-semibold mb-8">
             <span className="uppercase tracking-wider">Comparison Guide</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6 leading-tight">
            Clinexy vs Cliniko: <br/>
            <span className="text-emerald-600">Which Is Better for Solo Doctors?</span>
          </h1>
          <p className="text-xl text-slate-600 mb-8 leading-relaxed max-w-3xl mx-auto">
            Cliniko is a popular tool for clinic operations. But solo doctors today need more than clean scheduling—they need patient ownership, simple workflows, and automatic growth without marketing effort.
          </p>
        </div>
      </section>

      {/* Quick Comparison Table */}
      <section className="py-20 bg-white">
        <div className="max-w-5xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-slate-900 text-center mb-12">Quick Comparison</h2>
          
          <div className="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
            <div className="grid grid-cols-3 bg-slate-900 text-white p-6 text-sm font-bold uppercase tracking-wider">
              <div>Feature</div>
              <div className="text-center text-emerald-300">Clinexy</div>
              <div className="text-center text-slate-400">Cliniko</div>
            </div>

            {[
              { feature: "Built specifically for solo doctors", clinexy: "Yes", cliniko: "No (general clinic)" },
              { feature: "Doctor personal website", clinexy: "Included", cliniko: "Not included" },
              { feature: "Reviews & reputation tools", clinexy: "Included", cliniko: "Not included" },
              { feature: "Growth & recall features", clinexy: "Included", cliniko: "Limited" },
              { feature: "Pricing model", clinexy: "Flat & affordable", cliniko: "Per-user / tiered" },
              { feature: "Global onboarding", clinexy: "Simple", cliniko: "Moderate" },
            ].map((row, i) => (
              <div key={i} className="grid grid-cols-3 border-b border-slate-100 last:border-0 hover:bg-slate-50 transition-colors py-5 px-6 items-center">
                <div className="font-semibold text-slate-900">{row.feature}</div>
                <div className="text-center font-bold text-emerald-700 bg-emerald-50 rounded py-1 mx-4">{row.clinexy}</div>
                <div className="text-center text-slate-500">{row.cliniko}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Value Stack Calculator */}
      <section className="py-24 bg-slate-900 text-white">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center p-3 bg-emerald-500/20 rounded-xl mb-4 text-emerald-400">
               <Calculator className="h-8 w-8" />
            </div>
            <h2 className="text-3xl font-bold mb-4">
              True Cost of Ownership Calculator
            </h2>
            <p className="text-slate-400">
              Cliniko handles operations. But to get what Clinexy offers (Growth + Website + Reviews), you'd need multiple tools.
            </p>
          </div>

          <div className="bg-slate-800 rounded-3xl p-8 md:p-12 shadow-2xl border border-slate-700">
             {/* Region Toggle */}
             <div className="flex justify-center mb-10">
                <div className="bg-slate-700 p-1 rounded-lg inline-flex">
                   <button 
                     onClick={() => setRegion('Global')} 
                     className={`py-2 px-6 rounded-md text-sm font-bold transition-all ${region === 'Global' ? 'bg-emerald-600 text-white shadow' : 'text-slate-300 hover:text-white'}`}
                   >
                     Global ($)
                   </button>
                   <button 
                     onClick={() => setRegion('India')} 
                     className={`py-2 px-6 rounded-md text-sm font-bold transition-all ${region === 'India' ? 'bg-emerald-600 text-white shadow' : 'text-slate-300 hover:text-white'}`}
                   >
                     India (₹)
                   </button>
                </div>
             </div>

            <div className="grid md:grid-cols-2 gap-12">
              {/* Cliniko Stack */}
              <div className="space-y-6">
                <h3 className="text-lg font-bold text-slate-300 mb-4 border-b border-slate-700 pb-2">To Match Clinexy's Features with Cliniko:</h3>
                
                <div className="flex justify-between items-center p-4 bg-slate-700/30 rounded-lg border border-slate-600">
                   <div className="flex items-center gap-3">
                      <Activity className="h-5 w-5 text-slate-400" />
                      <span>Clinic Software (Cliniko)</span>
                   </div>
                   <div className="font-bold">{currencySymbol}{region === 'Global' ? clinikoBaseUSD : clinikoBaseINR}</div>
                </div>

                <div className="flex justify-between items-center p-4 bg-slate-700/30 rounded-lg border border-slate-600">
                   <div className="flex items-center gap-3">
                      <Layout className="h-5 w-5 text-slate-400" />
                      <span>Website Builder & Hosting</span>
                   </div>
                   <div className="font-bold text-red-300">+ {currencySymbol}{region === 'Global' ? websiteCostUSD : websiteCostINR}</div>
                </div>

                <div className="flex justify-between items-center p-4 bg-slate-700/30 rounded-lg border border-slate-600">
                   <div className="flex items-center gap-3">
                      <Star className="h-5 w-5 text-slate-400" />
                      <span>Review Management Tool</span>
                   </div>
                   <div className="font-bold text-red-300">+ {currencySymbol}{region === 'Global' ? reviewToolUSD : reviewToolINR}</div>
                </div>

                <div className="pt-4 border-t border-slate-600 flex justify-between items-center">
                   <span className="text-slate-400 font-medium">Total Monthly Cost</span>
                   <span className="text-2xl font-bold text-red-400">{currencySymbol}{totalClinikoStack}</span>
                </div>
              </div>

              {/* Clinexy Stack */}
              <div className="flex flex-col justify-center space-y-6">
                 <div className="bg-emerald-900/20 rounded-2xl p-6 border border-emerald-500/50 relative overflow-hidden">
                    <div className="absolute top-0 right-0 bg-emerald-500 text-white text-xs font-bold px-3 py-1 rounded-bl-lg">All-In-One</div>
                    
                    <h3 className="text-lg font-bold text-emerald-100 mb-6">With Clinexy Solo Plan</h3>
                    
                    <div className="space-y-3 mb-8">
                       <div className="flex items-center gap-2 text-sm text-emerald-200"><CheckCircle className="h-4 w-4"/> Clinic Software</div>
                       <div className="flex items-center gap-2 text-sm text-emerald-200"><CheckCircle className="h-4 w-4"/> Personal Doctor Website</div>
                       <div className="flex items-center gap-2 text-sm text-emerald-200"><CheckCircle className="h-4 w-4"/> Review & Growth Tools</div>
                    </div>

                    <div className="flex justify-between items-end">
                       <span className="text-emerald-200 font-medium">Total Cost</span>
                       <span className="text-4xl font-bold text-white">{currencySymbol}{clinexyCost}</span>
                    </div>
                 </div>

                 <div className="bg-white text-slate-900 p-6 rounded-xl shadow-lg text-center transform scale-105">
                    <div className="text-sm font-bold uppercase tracking-wider mb-1 text-emerald-700">Yearly Value Savings</div>
                    <div className="text-3xl font-bold text-slate-900">{currencySymbol}{yearlySavings.toLocaleString()}</div>
                    <p className="text-xs text-slate-500 mt-2">Plus hours saved on managing multiple tools.</p>
                 </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Deep Dive Comparison */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-5xl mx-auto px-4 space-y-20">
          
          {/* 1. Branding */}
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold">1</div>
                <h2 className="text-2xl font-bold text-slate-900">Personal Branding & Online Presence</h2>
              </div>
              <p className="text-slate-600 mb-6 font-medium italic">"Patients trust doctors they can easily find and recognise online."</p>
              
              <div className="space-y-6">
                <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                  <h3 className="text-slate-500 font-bold mb-3">Cliniko</h3>
                  <ul className="space-y-2 text-slate-600">
                    <li className="flex items-start gap-2"><Check className="h-4 w-4 mt-1 text-slate-400" /> Strong internal clinic tools</li>
                    <li className="flex items-start gap-2"><XCircle className="h-4 w-4 mt-1 text-red-400" /> No personal doctor website</li>
                    <li className="flex items-start gap-2"><XCircle className="h-4 w-4 mt-1 text-red-400" /> No branding or visibility focus</li>
                  </ul>
                </div>

                <div className="bg-white p-6 rounded-xl border-l-4 border-emerald-500 shadow-sm">
                  <h3 className="text-emerald-700 font-bold mb-3">Clinexy</h3>
                  <ul className="space-y-2 text-slate-700 font-medium">
                    <li className="flex items-start gap-2"><Check className="h-4 w-4 mt-1 text-green-500" /> Personal doctor website included</li>
                    <li className="flex items-start gap-2"><Check className="h-4 w-4 mt-1 text-green-500" /> Online booking and patient login</li>
                    <li className="flex items-start gap-2"><Check className="h-4 w-4 mt-1 text-green-500" /> Reviews and trust-building tools</li>
                  </ul>
                </div>
              </div>
            </div>
            <div className="hidden md:flex justify-center">
              <Globe className="h-64 w-64 text-slate-200" />
            </div>
          </div>

          {/* 2. Growth */}
          <div className="grid md:grid-cols-2 gap-12 items-center md:flex-row-reverse">
            <div className="hidden md:flex justify-center">
              <TrendingUp className="h-64 w-64 text-slate-200" />
            </div>
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold">2</div>
                <h2 className="text-2xl font-bold text-slate-900">Growth vs Operations-Only Software</h2>
              </div>
              <p className="text-slate-600 mb-6 font-medium italic">"Operations keep clinics running. Growth keeps them thriving."</p>

              <div className="space-y-6">
                <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                  <h3 className="text-slate-500 font-bold mb-3">Cliniko</h3>
                  <ul className="space-y-2 text-slate-600">
                    <li className="flex items-start gap-2"><Check className="h-4 w-4 mt-1 text-slate-400" /> Excellent for scheduling and notes</li>
                    <li className="flex items-start gap-2"><Minus className="h-4 w-4 mt-1" /> Limited support for patient growth</li>
                  </ul>
                </div>

                <div className="bg-white p-6 rounded-xl border-l-4 border-emerald-500 shadow-sm">
                  <h3 className="text-emerald-700 font-bold mb-3">Clinexy</h3>
                  <ul className="space-y-2 text-slate-700 font-medium">
                    <li className="flex items-start gap-2"><Check className="h-4 w-4 mt-1 text-green-500" /> Appointment management plus growth tools</li>
                    <li className="flex items-start gap-2"><Check className="h-4 w-4 mt-1 text-green-500" /> Patient recall and follow-ups</li>
                    <li className="flex items-start gap-2"><Check className="h-4 w-4 mt-1 text-green-500" /> Reputation and visibility built-in</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* 3. Pricing */}
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold">3</div>
                <h2 className="text-2xl font-bold text-slate-900">Pricing & Value for Solo Doctors</h2>
              </div>
              <p className="text-slate-600 mb-6 font-medium italic">"Solo doctors prefer predictable monthly expenses."</p>

              <div className="space-y-6">
                <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                  <h3 className="text-slate-500 font-bold mb-3">Cliniko</h3>
                  <ul className="space-y-2 text-slate-600">
                    <li className="flex items-start gap-2"><Minus className="h-4 w-4 mt-1" /> Per-user pricing</li>
                    <li className="flex items-start gap-2"><Minus className="h-4 w-4 mt-1" /> Costs increase as staff or locations grow</li>
                  </ul>
                </div>

                <div className="bg-white p-6 rounded-xl border-l-4 border-emerald-500 shadow-sm">
                  <h3 className="text-emerald-700 font-bold mb-3">Clinexy</h3>
                  <ul className="space-y-2 text-slate-700 font-medium">
                    <li className="flex items-start gap-2"><Check className="h-4 w-4 mt-1 text-green-500" /> One flat plan</li>
                    <li className="flex items-start gap-2"><Check className="h-4 w-4 mt-1 text-green-500" /> Designed for one-doctor clinics</li>
                    <li className="flex items-start gap-2"><Check className="h-4 w-4 mt-1 text-green-500" /> No surprise costs</li>
                  </ul>
                </div>
              </div>
            </div>
            <div className="hidden md:flex justify-center">
              <Wallet className="h-64 w-64 text-slate-200" />
            </div>
          </div>
          
          {/* 4. Simplicity */}
          <div className="grid md:grid-cols-2 gap-12 items-center md:flex-row-reverse">
            <div className="hidden md:flex justify-center">
              <Zap className="h-64 w-64 text-slate-200" />
            </div>
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold">4</div>
                <h2 className="text-2xl font-bold text-slate-900">Simplicity for Daily Use</h2>
              </div>
              <p className="text-slate-600 mb-6 font-medium italic">"Software should save time, not demand it."</p>

              <div className="space-y-6">
                <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                  <h3 className="text-slate-500 font-bold mb-3">Cliniko</h3>
                  <ul className="space-y-2 text-slate-600">
                    <li className="flex items-start gap-2"><Check className="h-4 w-4 mt-1 text-slate-400" /> Clean interface</li>
                    <li className="flex items-start gap-2"><Minus className="h-4 w-4 mt-1" /> Requires setup and configuration</li>
                  </ul>
                </div>

                <div className="bg-white p-6 rounded-xl border-l-4 border-emerald-500 shadow-sm">
                  <h3 className="text-emerald-700 font-bold mb-3">Clinexy</h3>
                  <ul className="space-y-2 text-slate-700 font-medium">
                    <li className="flex items-start gap-2"><Check className="h-4 w-4 mt-1 text-green-500" /> Built for everyday solo workflows</li>
                    <li className="flex items-start gap-2"><Check className="h-4 w-4 mt-1 text-green-500" /> Minimal setup</li>
                    <li className="flex items-start gap-2"><Check className="h-4 w-4 mt-1 text-green-500" /> WhatsApp-first reminders</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Decision Guide */}
      <section className="py-24 bg-white">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-slate-900 text-center mb-12">Which One Should You Choose?</h2>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-slate-50 p-8 rounded-2xl border border-slate-200">
              <h3 className="text-xl font-bold text-slate-700 mb-6">Choose Cliniko if:</h3>
              <ul className="space-y-4">
                <li className="flex items-center gap-3 text-slate-600">
                  <CheckCircle className="h-5 w-5 text-slate-400" /> You run a multi-practitioner clinic
                </li>
                <li className="flex items-center gap-3 text-slate-600">
                  <CheckCircle className="h-5 w-5 text-slate-400" /> You want strict operations-focused software
                </li>
              </ul>
            </div>

            <div className="bg-emerald-50 p-8 rounded-2xl border border-emerald-100">
              <h3 className="text-xl font-bold text-emerald-700 mb-6">Choose Clinexy if:</h3>
              <ul className="space-y-4">
                <li className="flex items-center gap-3 text-slate-800 font-medium">
                  <CheckCircle className="h-5 w-5 text-green-500" /> You are a solo doctor
                </li>
                <li className="flex items-center gap-3 text-slate-800 font-medium">
                  <CheckCircle className="h-5 w-5 text-green-500" /> You want growth, branding, and simplicity
                </li>
                <li className="flex items-center gap-3 text-slate-800 font-medium">
                  <CheckCircle className="h-5 w-5 text-green-500" /> You prefer flat, affordable pricing
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-24 bg-emerald-700 text-white text-center">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Try Clinexy Without Risk</h2>
          <p className="text-emerald-100 text-lg mb-10 max-w-2xl mx-auto">
            Experience a simpler, growth-focused clinic system.
          </p>
          <a href="https://rishabhkumar.clinexy.com/signup">
            <Button size="lg" className="bg-white text-emerald-800 hover:bg-slate-100 px-10 py-4 h-auto text-lg shadow-2xl">
              Start Your Free Trial
            </Button>
          </a>
          <div className="flex flex-wrap justify-center gap-6 mt-10 text-emerald-200 text-sm">
             <span className="flex items-center gap-2">14-day free trial</span>
             <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></span>
             <span className="flex items-center gap-2">No credit card required</span>
             <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></span>
             <span className="flex items-center gap-2">Cancel anytime</span>
          </div>
        </div>
      </section>
    </div>
  );
};
