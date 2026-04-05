import React, { useState } from "react";
import { Clock } from "lucide-react";

const CalculatorPage: React.FC = () => {
  const [patientsPerDay, setPatientsPerDay] = useState(16);
  const [minsLostPerPatient, setMinsLostPerPatient] = useState(3);
  const [daysPerWeek, setDaysPerWeek] = useState(6);

  const minsSavedDaily = patientsPerDay * minsLostPerPatient;
  const hoursSavedMonthly = Math.round((minsSavedDaily * daysPerWeek * 4) / 60);
  const hoursSavedYearly = hoursSavedMonthly * 12;

  return (
    <div style={{
      background: "#0f172a",
      minHeight: "100vh",
      color: "white",
      fontFamily: "Inter, sans-serif",
      padding: "40px 20px"
    }}>
      
      <div style={{ textAlign: "center", marginBottom: "40px" }}>
        <div style={{
          display: "inline-flex",
          padding: "12px",
          background: "rgba(20,184,166,0.2)",
          borderRadius: "12px",
          marginBottom: "15px"
        }}>
          <Clock size={28} color="#5eead4" />
        </div>

        <h2 style={{ fontSize: "28px", fontWeight: "700" }}>
          Admin Time Savings Calculator
        </h2>
        <p style={{ color: "#94a3b8" }}>
          How much time do you spend searching for files, reports, or history?
        </p>
      </div>

      <div style={{
        maxWidth: "900px",
        margin: "auto",
        background: "#1e293b",
        padding: "30px",
        borderRadius: "20px",
        border: "1px solid #334155"
      }}>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "30px" }}>

          {/* LEFT */}
          <div>
            <label>Patients Per Day: {patientsPerDay}</label>
            <input type="range" min="5" max="100"
              value={patientsPerDay}
              onChange={(e) => setPatientsPerDay(Number(e.target.value))}
              style={{ width: "100%" }}
            />

            <br /><br />

            <label>Mins Lost Per Patient: {minsLostPerPatient}</label>
            <input type="range" min="1" max="10"
              value={minsLostPerPatient}
              onChange={(e) => setMinsLostPerPatient(Number(e.target.value))}
              style={{ width: "100%" }}
            />

            <br /><br />

            <label>Clinic Days Per Week: {daysPerWeek}</label>
            <input type="range" min="1" max="7"
              value={daysPerWeek}
              onChange={(e) => setDaysPerWeek(Number(e.target.value))}
              style={{ width: "100%" }}
            />
          </div>

          {/* RIGHT */}
          <div style={{
            background: "#134e4a",
            borderRadius: "16px",
            padding: "25px",
            textAlign: "center"
          }}>
            <h4>TIME SAVED PER MONTH</h4>
            <h1>{hoursSavedMonthly} hours</h1>

            <h4 style={{ marginTop: "20px" }}>TIME SAVED PER YEAR</h4>
            <h2>{hoursSavedYearly} hours</h2>

            <p style={{ marginTop: "10px", fontSize: "12px", color: "#cbd5f5" }}>
              That's nearly {Math.round(hoursSavedYearly / 24)} full days.
            </p>
          </div>

        </div>
      </div>
    </div>
  );
};

export default CalculatorPage;