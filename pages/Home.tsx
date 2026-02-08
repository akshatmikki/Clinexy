import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  CheckCircle, Calendar, MessageSquare, TrendingUp, Shield, Smartphone,
  Video, Globe, Star, Users, ArrowRight, Clock, AlertCircle, XCircle,
  Play, FileText, Activity, HeartPulse, Check, Calculator
} from 'lucide-react';
import { Button } from '../components/Button';

export const Home: React.FC = () => {
  const [selectedReality, setSelectedReality] = useState<number[]>([]);

  // Calculator State
  const [calcFee, setCalcFee] = useState(500);
  const [calcAppts, setCalcAppts] = useState(40);
  const [calcNoShow, setCalcNoShow] = useState(15);

  const calcLostWeekly = calcFee * calcAppts * (calcNoShow / 100);
  const calcLostYearly = calcLostWeekly * 52;

  const toggleReality = (idx: number) => {
    if (selectedReality.includes(idx)) {
      setSelectedReality(selectedReality.filter(i => i !== idx));
    } else {
      setSelectedReality([...selectedReality, idx]);
    }
  };

  const painPoints = [
    { text: "Too many appointment calls and WhatsApp messages", icon: MessageSquare },
    { text: "Patients forget appointments and don’t show up", icon: XCircle },
    { text: "Dependence on staff for simple tasks", icon: Users },
    { text: "Prescriptions and records scattered everywhere", icon: FileText },
    { text: "Listed on platforms, but patients don’t really belong to you", icon: Globe },
    { text: "You know online visibility matters, but you don’t have time for marketing", icon: TrendingUp },
  ];

  const features = [
    {
      title: "Appointments Without the Chaos",
      desc: "Result: Fewer calls. Fewer mistakes. Fewer no‑shows.",
      points: [
        "Online appointment booking for patients",
        "Approve, reschedule, or block slots easily",
        "Clinic‑wise availability management",
        "Automatic WhatsApp and email reminders"
      ],
      icon: Calendar,
      image: "https://images.unsplash.com/photo-1505751172876-fa1923c5c528?auto=format&fit=crop&q=80&w=800",
      link: "/features/appointments-reminders"
    },
    {
      title: "Reduce No‑Shows Automatically",
      desc: "Result: Up to 30–40% reduction in missed appointments.",
      points: [
        "Patients forget. Clinexy reminds them.",
        "Timely WhatsApp reminders",
        "Clear appointment confirmations",
        "Easy rescheduling"
      ],
      icon: Clock,
      image: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&q=80&w=800",
      link: "/features/appointments-reminders"
    },
    {
      title: "Teleconsultation & Digital Prescriptions",
      desc: "Result: Professional care, even outside the clinic.",
      points: [
        "Video consultations using Google Meet",
        "Create digital prescriptions with vitals and diagnosis",
        "PDF prescriptions for patients",
        "Secure access to reports and documents"
      ],
      icon: Video,
      image: "https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?auto=format&fit=crop&q=80&w=800",
      link: "/features/teleconsultation-prescriptions"
    },
    {
      title: "Simple Patient Management",
      desc: "Result: No confusion. No lost records. Better patient experience.",
      points: [
        "Patient login and appointment history",
        "Upload and manage reports",
        "Easy access to past prescriptions"
      ],
      icon: Users,
      image: "https://images.unsplash.com/photo-1530497610245-94d3c16cda28?auto=format&fit=crop&q=80&w=800",
      link: "/features/patient-management"
    },
    {
      title: "Your Own Doctor Website",
      desc: "Result: Patients find you, trust you, and book directly.",
      points: [
        "Your name, not a platform brand",
        "Online booking built‑in",
        "Clinic details, timings, and location",
        "Patient login and prescriptions"
      ],
      icon: Globe,
      image: "https://images.unsplash.com/photo-1551076805-e1869033e561?auto=format&fit=crop&q=80&w=800",
      link: "/features/doctor-website"
    },
    {
      title: "Build Trust With Reviews & Reputation",
      desc: "Result: New patients trust you before they even visit.",
      points: [
        "Automatically request patient reviews",
        "Improve Google visibility",
        "Show real feedback on your website"
      ],
      icon: Star,
      image: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=800",
      link: "/features/reviews-reputation"
    },
    {
      title: "Grow Without Doing Marketing",
      desc: "Result: Steady growth without extra effort.",
      points: [
        "You don’t need to learn marketing.",
        "Reviews and social proof",
        "Your personal website",
        "Patient follow‑ups and recall reminders"
      ],
      icon: TrendingUp,
      image: "https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&q=80&w=800",
      link: "/features/doctor-branding-growth",
      extraLine: "Your clinic looks active and trusted online—even if you never post."
    }
  ];

 interface Blog {
  id: string;
  title: string;
  slug: string;
  content: string;
  featuredImage: string;
  authorName: string;
  tags: string[];
  views: number;
  likes: number;
  createdAt?: string;
}

const [blogs, setBlogs] = useState<Blog[]>([]);
const [loadingBlogs, setLoadingBlogs] = useState(true);

useEffect(() => {
  const fetchBlogs = async () => {
    try {
      const res = await fetch("https://admin.urest.in:8089/api/blogs");
      if (!res.ok) return;

      const data: Blog[] = await res.json();
      setBlogs(data);
    } catch (err) {
      console.error("Failed to fetch blogs");
    } finally {
      setLoadingBlogs(false);
    }
  };

  fetchBlogs();
}, []);

const getExcerpt = (content: string, length = 140) => {
  try {
    const decoded = JSON.parse(content);
    return decoded.replace(/[#>*\-]/g, "").slice(0, length) + "...";
  } catch {
    return content.slice(0, length) + "...";
  }
};


  const scrollToHowItWorks = (e: React.MouseEvent) => {
    e.preventDefault();
    const element = document.getElementById('how-it-works');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 bg-gradient-to-b from-primary-50 via-white to-white overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8 animate-fade-in-up">
              <div className="inline-flex items-center gap-2 bg-primary-100 text-primary-700 px-4 py-1.5 rounded-full text-sm font-semibold shadow-sm">
                <HeartPulse className="h-4 w-4 text-primary-600" />
                <span>Your Personal Digital Clinic</span>
              </div>
              <h1 className="text-4xl md:text-5xl font-bold text-slate-900 leading-tight tracking-tight">
                Manage Appointments. <br />
                Reduce No‑Shows. <br />
                <span className="text-primary-600">Grow Your Practice.</span>
              </h1>
              <p className="text-lg md:text-xl text-slate-600 leading-relaxed max-w-lg">
                Clinexy helps solo doctors run their clinic smoothly, own their patients, and grow steadily—without complex software or marketing effort.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 pt-2">
                <a href="https://rishabhkumar.clinexy.com/signup">
                  <Button size="lg" className="w-full sm:w-auto text-lg shadow-xl shadow-primary-500/20 px-8 py-4 h-auto">
                    Start Free Trial
                  </Button>
                </a>
                <button onClick={scrollToHowItWorks}>
                  <Button variant="outline" size="lg" className="w-full sm:w-auto text-lg bg-white border-primary-200 hover:bg-primary-50 px-8 py-4 h-auto">
                    See How It Works
                  </Button>
                </button>
              </div>
              <div className="border-t border-slate-100 pt-6">
                <p className="text-sm text-slate-500 font-medium mb-2">Trusted by independent doctors worldwide</p>
                <div className="flex items-center gap-6 text-sm text-slate-400 font-medium">
                  <div className="flex items-center gap-1.5">
                    <div className="bg-green-100 p-0.5 rounded-full">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                    </div>
                    No credit card required
                  </div>
                  <div className="flex items-center gap-1.5">
                    <div className="bg-green-100 p-0.5 rounded-full">
                      <Clock className="h-4 w-4 text-green-600" />
                    </div>
                    Setup in under 30 minutes
                  </div>
                </div>
              </div>
            </div>

            {/* Hero Image Mockup */}
            <div className="relative hidden lg:block">
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-primary-100/50 rounded-full blur-3xl -z-10"></div>
              <img
                src="https://images.unsplash.com/photo-1622902046580-2b47f47f5471?auto=format&fit=crop&q=80&w=800"
                alt="Doctor using Clinexy on tablet"
                className="relative rounded-2xl shadow-2xl border-4 border-white w-full object-cover transform hover:scale-[1.02] transition-transform duration-500"
              />
              {/* Floating Badge */}
              <div className="absolute -bottom-6 -left-6 bg-white p-4 rounded-xl shadow-xl border border-slate-100 flex items-center gap-3 animate-bounce-slow">
                <div className="bg-green-100 p-2 rounded-full">
                  <TrendingUp className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <div className="text-xs text-slate-500 font-semibold uppercase">Growth</div>
                  <div className="text-slate-900 font-bold">No-shows down 40%</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* The Reality (Pain Points) Section - Interactive */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-5xl mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">The Reality Solo Doctors Face Today</h2>
            <p className="text-lg text-slate-600">Select the ones that sound familiar to you:</p>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            {painPoints.map((point, idx) => (
              <div
                key={idx}
                onClick={() => toggleReality(idx)}
                className={`p-6 rounded-xl border cursor-pointer transition-all duration-300 group relative flex items-start gap-4 ${selectedReality.includes(idx)
                  ? 'bg-red-50 border-red-200 shadow-md transform scale-[1.01]'
                  : 'bg-white border-slate-200 hover:border-red-200 hover:shadow-sm'
                  }`}
              >
                <div className={`mt-1 w-6 h-6 rounded-md border flex items-center justify-center transition-colors shrink-0 ${selectedReality.includes(idx) ? 'bg-red-500 border-red-500' : 'border-slate-300 group-hover:border-red-400 bg-white'
                  }`}>
                  {selectedReality.includes(idx) && <Check className="h-4 w-4 text-white" />}
                </div>
                <p className={`font-medium text-lg leading-snug transition-colors ${selectedReality.includes(idx) ? 'text-red-900' : 'text-slate-700'
                  }`}>
                  {point.text}
                </p>
              </div>
            ))}
          </div>
          {selectedReality.length > 0 && (
            <div className="mt-8 text-center animate-fade-in-up">
              <p className="text-primary-600 font-bold text-lg">Clinexy is built to fix exactly these problems.</p>
            </div>
          )}
        </div>
      </section>

      {/* Value Proposition Transition */}
      <section className="py-24 bg-slate-900 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-primary-900/20"></div>
        <div className="max-w-4xl mx-auto px-4 text-center relative z-10">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">What Clinexy Does <span className="text-primary-400">(In Simple Terms)</span></h2>
          <p className="text-xl text-slate-300 mb-10 leading-relaxed">
            Clinexy is not just appointment software. It is your <strong className="text-white">digital clinic assistant</strong> that works quietly in the background to manage appointments, remind patients, keep records organized, and help patients come back again.
          </p>
          <div className="inline-block px-6 py-3 border border-slate-600 rounded-full bg-slate-800/50 backdrop-blur-sm text-slate-300 text-sm">
            All without changing how you work.
          </div>
        </div>
      </section>

      {/* Features Section - How Clinexy Helps */}
      <section className="py-24 bg-white" id="how-it-works">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-slate-900">How Clinexy Helps You Every Day</h2>
          </div>

          <div className="space-y-24">
            {features.map((feature, index) => (
              <div key={index} className={`flex flex-col lg:flex-row gap-12 items-start ${index % 2 === 1 ? 'lg:flex-row-reverse' : ''}`}>
                <div className="flex-1 space-y-6">
                  <div className="inline-flex items-center gap-2 bg-primary-50 text-primary-700 px-3 py-1 rounded-full text-sm font-semibold">
                    <feature.icon className="h-4 w-4" />
                    <span>Feature {index + 1}</span>
                  </div>
                  <h3 className="text-3xl font-bold text-slate-900">{feature.title}</h3>
                  <ul className="space-y-4">
                    {feature.points.map((point, i) => (
                      <li key={i} className="flex items-start gap-3">
                        <CheckCircle className="h-5 w-5 text-primary-600 mt-0.5 shrink-0" />
                        <span className="text-slate-700 text-lg">{point}</span>
                      </li>
                    ))}
                  </ul>
                  <div className="pt-4 border-l-4 border-primary-500 pl-4 bg-slate-50/50 rounded-r-lg p-4">
                    <p className="font-bold text-slate-900">{feature.desc}</p>
                    {feature.extraLine && <p className="text-slate-600 mt-2 italic text-sm">{feature.extraLine}</p>}
                  </div>
                  {/* Micro CTA */}
                  <div className="pt-2">
                    <Link to={feature.link} className="inline-flex items-center text-primary-600 font-bold hover:text-primary-700 group transition-colors">
                      See how this works for solo doctors
                      <ArrowRight className="h-4 w-4 ml-2 transition-transform group-hover:translate-x-1" />
                    </Link>
                  </div>
                </div>
                <div className="flex-1 relative group w-full">
                  <div className={`absolute inset-0 bg-primary-100 rounded-2xl transform rotate-3 group-hover:rotate-2 transition-transform duration-500 -z-10 ${index % 2 === 1 ? '-rotate-3 group-hover:-rotate-2' : ''}`}></div>
                  <img
                    src={feature.image}
                    alt={feature.title}
                    className="rounded-2xl shadow-xl w-full object-cover h-[400px]"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* New: Lost Revenue Calculator */}
      <section className="py-24 bg-slate-900 text-white">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center p-3 bg-red-500/20 rounded-xl mb-4 text-red-400">
              <Calculator className="h-8 w-8" />
            </div>
            <h2 className="text-3xl font-bold mb-4">Are No-Shows Eating Your Profits?</h2>
            <p className="text-slate-400">See how much revenue you lose annually due to missed appointments—and how Clinexy can help.</p>
          </div>

          <div className="bg-slate-800 rounded-3xl p-8 md:p-12 shadow-2xl border border-slate-700">
            <div className="grid md:grid-cols-2 gap-12">
              <div className="space-y-8">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Avg Consultation Fee</label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">₹</span>
                    <input
                      type="number"
                      value={calcFee}
                      onChange={(e) => setCalcFee(Number(e.target.value))}
                      className="w-full bg-slate-900 border border-slate-600 rounded-lg py-3 pl-8 pr-4 text-white focus:ring-2 focus:ring-primary-500"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Weekly Appointments: <span className="text-primary-400 font-bold">{calcAppts}</span>
                  </label>
                  <input
                    type="range" min="5" max="200"
                    value={calcAppts}
                    onChange={(e) => setCalcAppts(Number(e.target.value))}
                    className="w-full h-2 bg-slate-600 rounded-lg appearance-none cursor-pointer accent-primary-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    No-Show Rate: <span className="text-red-400 font-bold">{calcNoShow}%</span>
                  </label>
                  <input
                    type="range" min="0" max="50"
                    value={calcNoShow}
                    onChange={(e) => setCalcNoShow(Number(e.target.value))}
                    className="w-full h-2 bg-slate-600 rounded-lg appearance-none cursor-pointer accent-red-500"
                  />
                </div>
              </div>

              <div className="flex flex-col justify-center space-y-6">
                <div className="bg-red-900/30 rounded-2xl p-6 border border-red-500/30 text-center">
                  <div className="text-sm text-red-200 uppercase tracking-wider font-semibold mb-1">Yearly Revenue Lost</div>
                  <div className="text-4xl font-bold text-red-400">₹{calcLostYearly.toLocaleString()}</div>
                  <p className="text-xs text-red-300 mt-2">Money left on the table</p>
                </div>
                <div className="bg-secondary-600 rounded-2xl p-6 text-center shadow-lg transform scale-105">
                  <div className="text-sm text-secondary-100 uppercase tracking-wider font-semibold mb-1">Clinexy Cost / Year</div>
                  <div className="text-3xl font-bold text-white">₹11,988</div>
                  <p className="text-xs text-secondary-100 mt-2">
                    Clinexy pays for itself by saving just <span className="font-bold underline">one missed appointment</span> a month.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Solo Doctors Choose Clinexy */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-3xl font-bold text-slate-900 mb-8">Why Solo Doctors Choose Clinexy</h2>
              <div className="grid sm:grid-cols-2 gap-6">
                {[
                  "Built specifically for independent doctors",
                  "No commissions on appointments",
                  "Simple and easy to use",
                  "You own your patient data",
                  "Works with WhatsApp",
                  "Affordable pricing"
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-3 bg-white p-4 rounded-lg shadow-sm border border-slate-100">
                    <CheckCircle className="h-5 w-5 text-secondary-500 shrink-0" />
                    <span className="font-medium text-slate-800">{item}</span>
                  </div>
                ))}
              </div>
              <p className="mt-8 text-slate-600 italic">"Clinexy grows with you—without locking you in."</p>
            </div>
            <div className="relative">
              <div className="absolute -top-10 -right-10 w-64 h-64 bg-yellow-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30"></div>
              <div className="absolute -bottom-10 -left-10 w-64 h-64 bg-pink-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30"></div>
              <div className="bg-white p-8 rounded-2xl shadow-xl border border-slate-100 relative z-10">
                <div className="flex items-center gap-4 mb-6">
                  <img src="https://randomuser.me/api/portraits/men/32.jpg" alt="Doctor" className="w-16 h-16 rounded-full object-cover" />
                  <div>
                    <div className="font-bold text-lg text-slate-900">Dr. Rajesh Kumar</div>
                    <div className="text-slate-500 text-sm font-medium">Solo Doctor • Mumbai • General Physician</div>
                  </div>
                </div>
                <p className="text-slate-700 leading-relaxed mb-4 text-lg">
                  "I was tired of paying huge commissions to other platforms. Clinexy gave me my own identity. My patients now book directly on my website, and the <strong className="text-slate-900 bg-yellow-50">WhatsApp reminders have practically eliminated no-shows.</strong>"
                </p>
                <div className="flex text-yellow-400">
                  <Star className="h-5 w-5 fill-current" />
                  <Star className="h-5 w-5 fill-current" />
                  <Star className="h-5 w-5 fill-current" />
                  <Star className="h-5 w-5 fill-current" />
                  <Star className="h-5 w-5 fill-current" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">How It Works</h2>
            <p className="text-lg text-slate-600">You focus on patients. Clinexy handles the rest.</p>
          </div>

          <div className="grid md:grid-cols-4 gap-8 relative">
            <div className="hidden md:block absolute top-12 left-0 w-full h-0.5 bg-slate-100 -z-10"></div>
            {[
              { title: "Sign up", desc: "Create account in minutes", icon: Smartphone },
              { title: "Add Clinic", desc: "Set availability & details", icon: Activity },
              { title: "Share Link", desc: "Accept bookings instantly", icon: Globe },
              { title: "Relax", desc: "We handle reminders", icon: MessageSquare },
            ].map((step, i) => (
              <div key={i} className="relative bg-white pt-4">
                <div className="w-16 h-16 mx-auto bg-primary-600 text-white rounded-2xl flex items-center justify-center text-2xl font-bold mb-6 shadow-lg shadow-primary-500/20 relative z-10">
                  <step.icon className="h-8 w-8" />
                </div>
                <div className="text-center px-4">
                  <div className="text-sm font-bold text-primary-600 mb-1">Step {i + 1}</div>
                  <h3 className="text-xl font-bold text-slate-900 mb-2">{step.title}</h3>
                  <p className="text-slate-500">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">Pricing Made for Solo Doctors</h2>
            <p className="text-slate-600">Simple, affordable, and transparent. No hidden charges. Cancel anytime.</p>
          </div>

          <div className="max-w-lg mx-auto bg-white rounded-3xl shadow-xl overflow-hidden border border-slate-200 hover:border-primary-300 transition-all duration-300 transform hover:-translate-y-1 relative">
            {/* Best Value Badge */}
            <div className="absolute top-0 right-0 bg-green-500 text-white text-xs font-bold px-3 py-1 rounded-bl-lg z-10">BEST VALUE</div>

            <div className="p-8 bg-slate-900 text-white text-center relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-10">
                <Activity className="h-32 w-32" />
              </div>
              <h3 className="text-xl font-medium text-primary-200 mb-2">Solo Doctor Plan</h3>
              <div className="flex justify-center items-baseline gap-1 my-4">
                <span className="text-5xl font-bold">₹999</span>
                <span className="text-slate-400">/ month (India)</span>
              </div>
              <div className="text-sm text-slate-400 mb-2">OR</div>
              <div className="flex justify-center items-baseline gap-1">
                <span className="text-3xl font-bold text-slate-300">$99</span>
                <span className="text-slate-500">/ month (Global)</span>
              </div>

              {/* Cost Anchor */}
              <div className="mt-4 pt-4 border-t border-slate-800 text-green-400 text-sm font-semibold">
                Costs less than one missed appointment per month
              </div>
            </div>
            <div className="p-8">
              <div className="space-y-4 mb-8">
                {[
                  "Appointments & reminders",
                  "Teleconsultation",
                  "Digital prescriptions",
                  "Patient management",
                  "Personal doctor website",
                  "Reviews & reputation tools"
                ].map((feat, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="bg-green-100 p-1 rounded-full">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                    </div>
                    <span className="text-slate-700">{feat}</span>
                  </div>
                ))}
              </div>
              <a href="https://rishabhkumar.clinexy.com/signup">
                <Button className="w-full py-6 text-lg">Start Free Trial</Button>
              </a>
              <p className="text-center text-xs text-slate-400 mt-4">14-day free trial. No credit card required.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Blogs Section */}
      <section id="blogs" className="py-24 bg-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[60%] h-full bg-slate-50 rotate-[-6deg] translate-x-1/4 -z-10" />

        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-20">
            <h2 className="text-4xl font-bold text-slate-900">
              Our <span className="text-primary-600">Blogs</span>
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-10">
  {loadingBlogs ? (
    <p className="text-slate-500">Loading blogs...</p>
  ) : blogs.length === 0 ? (
    <p className="text-slate-500">No blogs found.</p>
  ) : (
    blogs.map((blog) => (
      <div
        key={blog.id}
        className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden group"
      >
        {/* Image */}
        <div className="relative h-56 overflow-hidden">
          <img
            src={
              blog.featuredImage ||
              "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=1200&q=80"
            }
            alt={blog.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Meta */}
          <div className="flex items-center gap-6 text-sm text-slate-500 mb-4">
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-primary-500" />
              {blog.authorName || "Clinexy Team"}
            </div>
            <div className="flex items-center gap-2">
              <MessageSquare className="h-4 w-4 text-primary-500" />
              {blog.views} Views
            </div>
          </div>

          {/* Title */}
          <h3 className="text-xl font-bold text-primary-600 mb-3 leading-snug">
            {blog.title}
          </h3>

          {/* Excerpt */}
          <p className="text-slate-600 text-sm leading-relaxed mb-6">
            {getExcerpt(blog.content)}
          </p>

          {/* CTA */}
          <Link
            to={`/blogs/${blog.slug}`}
            className="inline-flex items-center gap-2 bg-slate-900 text-white px-5 py-2.5 rounded-lg text-sm font-semibold hover:bg-primary-600 transition-colors"
          >
            View More
            <span className="text-lg">+</span>
          </Link>
        </div>
      </div>
    ))
  )}
</div>

        </div>
      </section>

      {/* Target Audience & Final CTA */}
      <section className="py-24 bg-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-slate-900 mb-12">Who Clinexy Is Perfect For</h2>
          <div className="flex flex-wrap justify-center gap-4 mb-16">
            {[
              "Solo doctors and specialists",
              "Doctors running one clinic",
              "Doctors tired of manual appointment handling",
              "Doctors who want growth without complexity"
            ].map((item, i) => (
              <div key={i} className="bg-slate-50 px-6 py-3 rounded-full border border-slate-200 font-medium text-slate-700 shadow-sm">
                {item}
              </div>
            ))}
          </div>

          <div className="bg-primary-600 rounded-3xl p-12 text-white shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-10 rounded-full transform translate-x-1/2 -translate-y-1/2"></div>
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-white opacity-10 rounded-full transform -translate-x-1/2 translate-y-1/2"></div>

            <h2 className="text-3xl md:text-4xl font-bold mb-6 relative z-10">Get Started Today</h2>
            <p className="text-blue-100 text-lg mb-8 max-w-2xl mx-auto relative z-10">
              Your clinic doesn’t need more staff or more software. It needs a <span className="font-bold text-white">smarter system</span>.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center relative z-10">
              <a href="https://rishabhkumar.clinexy.com/signup">
                <Button size="lg" className="bg-white text-primary-800 hover:bg-slate-100 w-full sm:w-auto px-8">
                  Start Your Free Trial
                </Button>
              </a>
            </div>
            <p className="text-primary-200 text-sm mt-6 relative z-10">No credit card required • Cancel anytime</p>
          </div>
        </div>
      </section>
    </div>
  );
};