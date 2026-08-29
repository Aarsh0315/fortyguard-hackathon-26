import { useEffect, useState } from "react";
import "./App.css";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";


function App() {

  // ==================================================
  // CITIES
  // ==================================================

  const cities = [
    { city: "Mumbai" },
    { city: "Bengaluru" },
    { city: "Pune" },
    { city: "Delhi" },
  ];


  // ==================================================
  // STATE
  // ==================================================

  const [selectedCity, setSelectedCity] = useState("Mumbai");

  const [riskData, setRiskData] = useState(null);

  const [insightData, setInsightData] = useState(null);

  const [allCities, setAllCities] = useState([]);

  const [trend, setTrend] = useState([]);

  const [fortyGuardData, setFortyGuardData] = useState(null);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");


  // ==================================================
  // RISK CLASS
  // ==================================================

  const getRiskClass = (level) => {

    if (level === "HIGH") {
      return "high";
    }

    if (level === "MODERATE") {
      return "moderate";
    }

    return "low";
  };


  // ==================================================
  // ACTION PLAN
  // ==================================================

  const getActionPlan = (riskLevel) => {

    if (riskLevel === "HIGH") {

      return {
        priority: "Immediate attention",

        description:
          "Heat conditions may create significant stress. Reduce exposure and prioritize cooling and hydration.",

        actions: [
          "Avoid prolonged outdoor exposure during peak heat",
          "Stay hydrated and take frequent cooling breaks",
          "Protect outdoor workers with shaded rest areas",
          "Check on elderly people, children and vulnerable groups",
        ],
      };
    }


    if (riskLevel === "MODERATE") {

      return {
        priority: "Preventive action",

        description:
          "Heat stress is possible, particularly during prolonged outdoor activity.",

        actions: [
          "Stay hydrated throughout the day",
          "Limit unnecessary outdoor activity during peak heat",
          "Take regular breaks in shaded or cool areas",
          "Monitor people who are more sensitive to heat",
        ],
      };
    }


    return {

      priority: "Normal monitoring",

      description:
        "Current environmental conditions indicate relatively low heat stress potential.",

      actions: [
        "Continue normal activities",
        "Stay hydrated throughout the day",
        "Monitor environmental conditions",
        "Remain prepared if heat conditions increase",
      ],
    };
  };


  // ==================================================
  // LOAD DATA
  // ==================================================

  useEffect(() => {

    let cancelled = false;


    const loadCityData = async () => {

      try {

        setError("");
        setLoading(true);


        // ==================================================
        // API REQUESTS
        // ==================================================

        const [
          allCitiesResponse,
          riskResponse,
          insightResponse,
          trendResponse,
          fortyGuardResponse,
        ] = await Promise.all([

          fetch(
            "http://127.0.0.1:8000/api/heat-risk"
          ),

          fetch(
            `http://127.0.0.1:8000/api/heat-risk/${selectedCity}`
          ),

          fetch(
            `http://127.0.0.1:8000/api/heat-risk/${selectedCity}/insights`
          ),

          fetch(
            `http://127.0.0.1:8000/api/heat-risk/${selectedCity}/trend`
          ),

          fetch(
            "http://127.0.0.1:8000/api/fortyguard-analysis"
          ),

        ]);


        if (
          !allCitiesResponse.ok ||
          !riskResponse.ok ||
          !insightResponse.ok ||
          !trendResponse.ok ||
          !fortyGuardResponse.ok
        ) {

          throw new Error(
            "One or more API requests failed."
          );
        }


        const [
          allCitiesData,
          risk,
          insights,
          trendResult,
          fortyGuardResult,
        ] = await Promise.all([

          allCitiesResponse.json(),

          riskResponse.json(),

          insightResponse.json(),

          trendResponse.json(),

          fortyGuardResponse.json(),

        ]);


        if (cancelled) {
          return;
        }


        // ==================================================
        // SET DATA
        // ==================================================

        setAllCities(
          Array.isArray(allCitiesData)
            ? allCitiesData
            : []
        );


        setRiskData(risk);


        setInsightData(insights);


        setTrend(
          Array.isArray(trendResult.data)
            ? trendResult.data
            : []
        );


        setFortyGuardData(
          fortyGuardResult
        );


      } catch (err) {

        console.error(
          "HeatSafe API error:",
          err
        );


        if (!cancelled) {

          setError(
            "Unable to load heat risk data."
          );

          setRiskData(null);

          setInsightData(null);

          setTrend([]);

        }


      } finally {

        if (!cancelled) {

          setLoading(false);

        }

      }

    };


    loadCityData();


    return () => {

      cancelled = true;

    };

  }, [selectedCity]);


  // ==================================================
  // CITY CHANGE
  // ==================================================

  const handleCityChange = (event) => {

    setSelectedCity(
      event.target.value
    );

  };


  // ==================================================
  // RETURN UI
  // ==================================================

  return (

    <div className="app">


      {/* ==================================================
          HEADER
      ================================================== */}

      <header className="header">

        <div>

          <h1>
            🌡️ HeatSafe AI
          </h1>

          <p>
            AI-powered urban heat risk analysis
          </p>

        </div>


        <div className="status">

          <span className="status-dot"></span>

          Live Analysis

        </div>

      </header>


      {/* ==================================================
          MAIN
      ================================================== */}

      <main className="container">


        {/* ==================================================
            HERO
        ================================================== */}

        <section className="hero-section">

          <div>

            <p className="eyebrow">
              URBAN HEAT MONITOR
            </p>


            <h2>
              Understand heat risk before it becomes dangerous.
            </h2>


            <p className="subtitle">
              HeatSafe uses environmental data and AI to show
              how dangerous the heat is, why the risk is high,
              and what people should do next.
            </p>

          </div>


          {/* CITY SELECTOR */}

          <div className="city-selector">

            <label htmlFor="city">
                Choose a city
              </label>


            <select
              id="city"
              value={selectedCity}
              onChange={handleCityChange}
            >

              {cities.map((city) => (

                <option
                  key={city.city}
                  value={city.city}
                >

                  {city.city}

                </option>

              ))}

            </select>

          </div>

        </section>


        {/* ==================================================
            LOADING
        ================================================== */}

        {loading && (

          <div className="loading">

            <h3>
              Loading heat intelligence...
            </h3>

            <p>
              Fetching environmental data for{" "}
              {selectedCity}
            </p>

          </div>

        )}


        {/* ==================================================
            ERROR
        ================================================== */}

        {!loading && error && (

          <div className="error">

            <h3>
              ⚠️ {error}
            </h3>

            <p>
              Check that the FastAPI backend is running.
            </p>

          </div>

        )}


        {/* ==================================================
            DASHBOARD
        ================================================== */}

        {!loading && riskData && (

          <>

          {/* ==================================================
    HOW HEATSAFE WORKS
================================================== */}

<section className="how-it-works">

  <div className="how-it-works-header">

    <p className="eyebrow">
      HOW IT WORKS
    </p>

    <h2>
      From environmental data to simple action.
    </h2>

    <p>
      HeatSafe turns complex environmental information
      into clear heat-risk guidance that people can understand.
    </p>

  </div>


  <div className="how-it-works-grid">


    {/* STEP 1 */}

    <div className="how-step">

      <div className="step-number">
        01
      </div>

      <div className="step-icon">
        🌍
      </div>

      <h3>
        Environmental Data
      </h3>

      <p>
        HeatSafe uses environmental intelligence
        and temperature data to understand
        current conditions.
      </p>

    </div>


    {/* STEP 2 */}

    <div className="how-step">

      <div className="step-number">
        02
      </div>

      <div className="step-icon">
        📊
      </div>

      <h3>
        Heat Risk Analysis
      </h3>

      <p>
        Heat indicators such as temperature,
        humidity and wet-bulb conditions are
        used to assess heat stress.
      </p>

    </div>


    {/* STEP 3 */}

    <div className="how-step">

      <div className="step-number">
        03
      </div>

      <div className="step-icon">
        🤖
      </div>

      <h3>
        AI Explanation
      </h3>

      <p>
        AI explains why the city is at risk,
        who may be affected and what the
        environmental conditions mean.
      </p>

    </div>


    {/* STEP 4 */}

    <div className="how-step">

      <div className="step-number">
        04
      </div>

      <div className="step-icon">
        🛡️
      </div>

      <h3>
        Take Action
      </h3>

      <p>
        The result is converted into simple
        safety recommendations people can
        act on immediately.
      </p>

    </div>

  </div>

</section>


            {/* ==================================================
                CURRENT HEAT RISK
            ================================================== */}

            {/* ==================================================
    CURRENT HEAT RISK
================================================== */}

<section className="risk-banner">

  <div className="risk-banner-content">

    <p className="eyebrow">
      CURRENT HEAT RISK
    </p>

    <h2>
      {riskData.city}
    </h2>

    <p className="risk-description">
      Here's how serious the current heat conditions are.
    </p>

    <div className="risk-status-line">

      <span className={`status-indicator ${getRiskClass(
        riskData.risk_level
      )}`}></span>

      <span>
        Environmental conditions are being monitored
      </span>

    </div>

  </div>


  <div
    className={`risk-score-display ${getRiskClass(
      riskData.risk_level
    )}`}
  >

    <div className="risk-score-top">
      <span>HEAT RISK SCORE</span>
    </div>

    <div className="risk-score-number">

      {riskData.risk_score}

      <span>/10</span>

    </div>

    <div className="risk-score-label">

      {riskData.risk_level} HEAT RISK

    </div>

    <div className="risk-score-status">

      {riskData.risk_level === "HIGH"
        ? "Immediate attention recommended"
        : riskData.risk_level === "MODERATE"
        ? "Preventive action recommended"
        : "Normal monitoring"}

    </div>

  </div>

</section>


            {/* ==================================================
                HEAT SAFETY ALERT
            ================================================== */}

            <section
              className={`heat-alert ${getRiskClass(
                riskData.risk_level
              )}`}
            >

              <div className="heat-alert-icon">

                {riskData.risk_level === "HIGH"
                  ? "🚨"
                  : riskData.risk_level === "MODERATE"
                  ? "⚠️"
                  : "✓"}

              </div>


              <div className="heat-alert-content">

                <p className="eyebrow">
  WHAT THIS MEANS
</p>


                <h2>

                  {riskData.risk_level === "HIGH"
                    ? "High Heat Risk Detected"
                    : riskData.risk_level === "MODERATE"
                    ? "Moderate Heat Risk"
                    : "Low Heat Risk"}

                </h2>


                <p>

                  {riskData.risk_level === "HIGH"
                    ? `${riskData.city} is currently experiencing conditions that may cause significant heat stress.`
                    : riskData.risk_level === "MODERATE"
                    ? `${riskData.city} has some potential for heat stress, especially during prolonged outdoor exposure.`
                    : `${riskData.city} currently shows relatively low heat stress potential.`}

                </p>


                <div className="heat-alert-actions">

                  <strong>
                    Recommended now:
                  </strong>


                  <ul>

                    {riskData.risk_level === "HIGH" && (
                      <>
                        <li>Stay hydrated</li>
                        <li>
                          Avoid prolonged outdoor exposure
                        </li>
                        <li>
                          Avoid strenuous activity during peak heat
                        </li>
                        <li>
                          Check on elderly people and children
                        </li>
                      </>
                    )}


                    {riskData.risk_level === "MODERATE" && (
                      <>
                        <li>Stay hydrated</li>
                        <li>
                          Limit unnecessary outdoor activity
                        </li>
                        <li>
                          Take breaks in shaded or cool areas
                        </li>
                      </>
                    )}


                    {riskData.risk_level === "LOW" && (
                      <>
                        <li>
                          Continue normal activities
                        </li>
                        <li>
                          Stay hydrated throughout the day
                        </li>
                      </>
                    )}

                  </ul>

                </div>


                <div className="heat-alert-score">

                  <span>
                    Risk Score
                  </span>

                  <strong>
                    {riskData.risk_score}/10
                  </strong>


                  <div className="alert-score-bar">

                    <div
                      className={`alert-score-fill ${getRiskClass(
                        riskData.risk_level
                      )}`}
                      style={{
                        width: `${
                          Number(
                            riskData.risk_score
                          ) * 10
                        }%`,
                      }}
                    />

                  </div>

                </div>

              </div>

            </section>


            {/* ==================================================
                HEAT ACTION CENTER
            ================================================== */}

            <section
              className={`action-center ${getRiskClass(
                riskData.risk_level
              )}`}
            >

              <div className="action-header">

                <div>

                  <p className="eyebrow">
  TAKE ACTION
</p>

<h2>
  What should you do now?
</h2>

<p>
  Simple safety recommendations based on
  the current heat conditions in {riskData.city}.
</p>

                </div>


                <div className="action-priority">

                  {
                    getActionPlan(
                      riskData.risk_level
                    ).priority
                  }

                </div>

              </div>


              <div className="action-description">

                <span className="action-icon">

                  {riskData.risk_level === "HIGH"
                    ? "🚨"
                    : riskData.risk_level === "MODERATE"
                    ? "⚠️"
                    : "✓"}

                </span>


                <p>

                  {
                    getActionPlan(
                      riskData.risk_level
                    ).description
                  }

                </p>

              </div>


              <div className="action-grid">

                {
                  getActionPlan(
                    riskData.risk_level
                  ).actions.map(
                    (action, index) => (

                      <div
                        className="action-item"
                        key={index}
                      >

                        <span className="action-check">
                          ✓
                        </span>


                        <div>

                          <strong>
                            {action}
                          </strong>

                          <p>
                            Recommended for current conditions
                          </p>

                        </div>

                      </div>

                    )
                  )
                }

              </div>

            </section>


            {/* ==================================================
                ENVIRONMENTAL METRICS
            ================================================== */}

            {/* ==================================================
    KEY HEAT INDICATORS
================================================== */}

<section className="metrics-section">

  <div className="metrics-heading">

    <p className="eyebrow">
      KEY HEAT INDICATORS
    </p>

    <h2>
      What are the conditions right now?
    </h2>

    <p>
      These measurements help HeatSafe understand
      the current heat stress.
    </p>

  </div>

  <div className="metrics">


              <div className="metric-card">

                <span>
                  🔥 Heat Index
                </span>

                <strong>
                  {Number(
                    riskData.heat_index_celsius
                  ).toFixed(2)}
                  °C
                </strong>

                <small>
                  Feels-like heat stress
                </small>

              </div>


              <div className="metric-card">

                <span>
                  🌡️ Apparent Temperature
                </span>

                <strong>
                  {Number(
                    riskData.apparent_temperature_celsius
                  ).toFixed(2)}
                  °C
                </strong>

                <small>
  How hot it feels
</small>

              </div>


              <div className="metric-card">

                <span>
                  💧 Humidity
                </span>

                <strong>
                  {Number(
                    riskData.relative_humidity_percent
                  ).toFixed(2)}
                  %
                </strong>

                <small>
                  Moisture in the air
                </small>

              </div>


              <div className="metric-card">

                <span>
                  🌊 Wet Bulb
                </span>

                <strong>
                  {Number(
                    riskData.wet_bulb_temperature_celsius
                  ).toFixed(2)}
                  °C
                </strong>

                <small>
                  How difficult it is for the body to cool down
                </small>

              </div>

              </div>


            </section>


            {/* ==================================================
                TEMPERATURE TREND
            ================================================== */}

            {trend.length > 0 && (

              <section className="trend-card">

                <div className="trend-header">

                  <div>

                    <p className="eyebrow">
  TEMPERATURE OVER TIME
</p>

<h2>
  How is the temperature changing?
</h2>

<p>
  Hourly temperature readings for {selectedCity}.
</p>

                  </div>

                </div>


                <div className="chart-container">

                  <ResponsiveContainer
                    width="100%"
                    height={240}
                  >

                    <LineChart data={trend}>

                      <CartesianGrid
                        strokeDasharray="3 3"
                      />


                      <XAxis
                        dataKey="time"
                      />


                      <YAxis
                        unit="°C"
                      />


                      <Tooltip
                        formatter={(value) => [
                          `${value}°C`,
                          "Temperature",
                        ]}
                      />


                      <Line
                        type="monotone"
                        dataKey="temperature"
                        strokeWidth={3}
                        dot={{ r: 4 }}
                      />

                    </LineChart>

                  </ResponsiveContainer>

                </div>

              </section>

            )}


            {/* ==================================================
                FORTYGUARD ANALYSIS
            ================================================== */}

            {fortyGuardData && (

              <section className="fortyguard-card">

                <div className="fortyguard-header">

                  <div>

                    <p className="eyebrow">
                      ENVIRONMENTAL INTELLIGENCE
                    </p>


                    <h2>
  FortyGuard Environmental Analysis
</h2>

<p>
  FortyGuard intelligence helps us understand
  temperature conditions across the analyzed area.
</p>

                  </div>


                  <div className="fortyguard-source">
                    FortyGuard
                  </div>

                </div>


                <div className="fortyguard-metrics">


                  <div className="fortyguard-metric">

                    <span>
                      Minimum Temperature
                    </span>

                    <strong>
                      {Number(
                        fortyGuardData.minimum_temperature
                      ).toFixed(2)}
                      °C
                    </strong>

                  </div>


                  <div className="fortyguard-metric">

                    <span>
                      Average Temperature
                    </span>

                    <strong>
                      {Number(
                        fortyGuardData.average_temperature
                      ).toFixed(2)}
                      °C
                    </strong>

                  </div>


                  <div className="fortyguard-metric">

                    <span>
                      Maximum Temperature
                    </span>

                    <strong>
                      {Number(
                        fortyGuardData.maximum_temperature
                      ).toFixed(2)}
                      °C
                    </strong>

                  </div>


                  <div className="fortyguard-metric">

                    <span>
                      Temperature Variation
                    </span>

                    <strong>
                      {Number(
                        fortyGuardData.temperature_variation
                      ).toFixed(2)}
                      °C
                    </strong>

                  </div>


                </div>

              </section>

            )}


            {/* ==================================================
                TEMPERATURE DISTRIBUTION
            ================================================== */}

            {fortyGuardData && (

              <section className="temperature-distribution">

                <div className="distribution-header">

                  <div>

                    <p className="eyebrow">
                      FORTYGUARD ENVIRONMENTAL RANGE
                    </p>


                    <h2>
                      Temperature Distribution
                    </h2>


                    <p>
                      Environmental temperature range
                      detected across the analyzed area.
                    </p>

                  </div>


                  <div className="distribution-badge">
                    {fortyGuardData.city}
                  </div>

                </div>


                <div className="temperature-scale">

                  <div className="scale-label">

                    <span>
                      Minimum
                    </span>

                    <strong>
                      {Number(
                        fortyGuardData.minimum_temperature
                      ).toFixed(2)}
                      °C
                    </strong>

                  </div>


                  <div className="temperature-bar">

                    <div className="temperature-progress"></div>

                  </div>


                  <div className="scale-label">

                    <span>
                      Maximum
                    </span>

                    <strong>
                      {Number(
                        fortyGuardData.maximum_temperature
                      ).toFixed(2)}
                      °C
                    </strong>

                  </div>

                </div>


                <div className="average-temperature">

                  <div>

                    <span>
                      Average Temperature
                    </span>

                    <strong>
                      {Number(
                        fortyGuardData.average_temperature
                      ).toFixed(2)}
                      °C
                    </strong>

                  </div>


                  <div>

                    <span>
                      Temperature Variation
                    </span>

                    <strong>
                      ±
                      {Number(
                        fortyGuardData.temperature_variation
                      ).toFixed(2)}
                      °C
                    </strong>

                  </div>

                </div>

              </section>

            )}


            {/* ==================================================
                AI INSIGHTS
            ================================================== */}

            {insightData && (

              <section className="insight-card">

                <div className="section-title">

                  <span>
                    🤖
                  </span>


                  <div>

                    <p className="eyebrow">
  AI EXPLANATION
</p>

<h2>
  What does the data mean?
</h2>

                  </div>

                </div>


                {insightData.summary && (

                  <p className="summary">
                    {insightData.summary}
                  </p>

                )}


                <div className="insight-grid">


                  {/* MAIN FACTORS */}

                  <div>

                    <h3>
                      ⚠️ What is causing the risk?
                    </h3>


                    <ul>

                      {Array.isArray(
                        insightData.main_factors
                      ) &&
                        insightData.main_factors.map(
                          (factor, index) => (

                            <li key={index}>
                              {factor}
                            </li>

                          )
                        )}

                    </ul>

                  </div>


                  {/* RECOMMENDATIONS */}

                  <div>

                    <h3>
                      🛡️ What should people do?
                    </h3>


                    <ul>

                      {Array.isArray(
                        insightData.recommendations
                      ) &&
                        insightData.recommendations.map(
                          (recommendation, index) => (

                            <li key={index}>
                              {recommendation}
                            </li>

                          )
                        )}

                    </ul>

                  </div>


                  {/* VULNERABLE GROUPS */}

                  <div>

                    <h3>
                      👥 Who should be careful?
                    </h3>


                    <ul>

                      {Array.isArray(
                        insightData.vulnerable_groups
                      ) &&
                        insightData.vulnerable_groups.map(
                          (group, index) => (

                            <li key={index}>
                              {group}
                            </li>

                          )
                        )}

                    </ul>

                  </div>


                </div>

              </section>

            )}


            {/* ==================================================
    WHO IS MOST AT RISK?
================================================== */}

<section className="vulnerable-card">

  <div className="vulnerable-header">

    <div>

      <p className="eyebrow">
        WHO SHOULD BE CAREFUL?
      </p>

      <h2>
        People who may be more affected by heat
      </h2>

      <p>
        Some groups can experience heat stress more
        quickly, especially during prolonged exposure.
      </p>

    </div>

  </div>


  <div className="vulnerable-grid">


    {/* OUTDOOR WORKERS */}

    <div className="vulnerable-item">

      <div className="vulnerable-icon">
        👷
      </div>

      <div>

        <h3>
          Outdoor Workers
        </h3>

        <p>
          People working outdoors may have prolonged
          exposure to heat and direct sunlight.
        </p>

      </div>

    </div>


    {/* ELDERLY */}

    <div className="vulnerable-item">

      <div className="vulnerable-icon">
        👴
      </div>

      <div>

        <h3>
          Older Adults
        </h3>

        <p>
          Older people may be more sensitive to
          changes in temperature and heat stress.
        </p>

      </div>

    </div>


    {/* CHILDREN */}

    <div className="vulnerable-item">

      <div className="vulnerable-icon">
        👶
      </div>

      <div>

        <h3>
          Children
        </h3>

        <p>
          Children can be vulnerable to heat,
          especially during outdoor activities.
        </p>

      </div>

    </div>


    {/* URBAN RESIDENTS */}

    <div className="vulnerable-item">

      <div className="vulnerable-icon">
        🏙️
      </div>

      <div>

        <h3>
          Urban Residents
        </h3>

        <p>
          People in dense urban areas may experience
          additional heat from buildings and roads.
        </p>

      </div>

    </div>


  </div>

</section>


            {/* ==================================================
                CITY COMPARISON
            ================================================== */}

            {allCities.length > 0 && (

              <section className="comparison-card">

                <div className="comparison-header">

                  <div>

                    <p className="eyebrow">
  COMPARE CITIES
</p>

<h2>
  Which cities have higher heat risk?
</h2>

<p>
  Compare current heat-risk levels across the cities
  monitored by HeatSafe.
</p>

                  </div>

                </div>


                <div className="comparison-list">

                  {allCities
                    .slice()
                    .sort(
                      (a, b) =>
                        Number(b.risk_score) -
                        Number(a.risk_score)
                    )
                    .map((city) => {

                      const score =
                        Number(city.risk_score);


                      return (

                        <div
                          className="comparison-row"
                          key={city.city}
                        >

                          <div className="comparison-city">

                            <strong>
                              {city.city}
                            </strong>

                            <span>
                              {city.risk_level}
                            </span>

                          </div>


                          <div className="comparison-bar-container">

                            <div
                              className={`comparison-bar ${String(
                                city.risk_level
                              ).toLowerCase()}`}
                              style={{
                                width: `${score * 10}%`,
                              }}
                            />

                          </div>


                          <div className="comparison-score">

                            {score}/10

                          </div>

                        </div>

                      );

                    })}

                </div>

              </section>

            )}


            {/* ==================================================
                HEAT RISK INTELLIGENCE
            ================================================== */}

            <section className="intelligence-card">

              <div className="intelligence-header">

                <div>

                  <p className="eyebrow">
  WHY THIS CITY IS AT RISK
</p>

<h2>
  Why is {riskData.city} at risk?
</h2>

<p>
  These environmental conditions are contributing
  to the current heat-risk level.
</p>

                </div>


                <div
                  className={`intelligence-score ${getRiskClass(
                    riskData.risk_level
                  )}`}
                >

                  <strong>
                    {riskData.risk_score}/10
                  </strong>


                  <span>
                    {riskData.risk_level}
                  </span>

                </div>

              </div>


              {/* RISK METER */}

              <div className="risk-meter-section">

                <div className="risk-meter-label">

                  <span>
                    Overall Heat Risk
                  </span>


                  <strong>
                    {riskData.risk_score}/10
                  </strong>

                </div>


                <div className="risk-meter">

                  <div
                    className={`risk-meter-fill ${getRiskClass(
                      riskData.risk_level
                    )}`}
                    style={{
                      width: `${
                        Number(
                          riskData.risk_score
                        ) * 10
                      }%`,
                    }}
                  />

                </div>


                <div className="risk-meter-scale">

                  <span>
                    Low
                  </span>

                  <span>
                    Moderate
                  </span>

                  <span>
                    High
                  </span>

                </div>

                <p className="risk-explanation">

  <strong>
    What does {riskData.risk_score}/10 mean?
  </strong>

  <br />

  This score represents the current level of heat
  stress based on temperature, humidity and other
  environmental conditions.

</p>

              </div>

              


              

              {/* EXPLANATION */}

              <div className="intelligence-explanation">

                <div>

                  <h3>
                    ⚠️ Main contributing factors
                  </h3>


                  <ul>

                    {String(
                      riskData.main_factors || ""
                    )
                      .split(",")
                      .map(
                        (factor, index) => (

                          <li key={index}>
                            {factor.trim()}
                          </li>

                        )
                      )}

                  </ul>

                </div>


                <div>

                  <h3>
                    🛡️ Recommended action
                  </h3>


                  <p>

                    {riskData.recommendation ||
                      "Stay hydrated and avoid prolonged exposure during peak heat."}

                  </p>

                </div>

              </div>


            </section>


          </>

        )}

        {/* ==================================================
    DATA SOURCES & METHODOLOGY
================================================== */}

<section className="methodology-card">

  <div className="methodology-header">

    <div>

      <p className="eyebrow">
        TRANSPARENCY
      </p>

      <h2>
  Where does the information come from?
</h2>

      <p>
        HeatSafe combines environmental intelligence,
        heat-risk indicators and AI analysis to turn
        complex environmental data into actionable insights.
      </p>

    </div>

  </div>


  <div className="methodology-grid">


    {/* FORTYGUARD */}

    <div className="methodology-item">

      <div className="methodology-icon">
        🌍
      </div>

      <div>

        <h3>
          FortyGuard Environmental Intelligence
        </h3>

        <p>
          Environmental analysis provides spatial and
          temperature intelligence used as part of the
          HeatSafe assessment.
        </p>

      </div>

    </div>


    {/* RISK MODEL */}

    <div className="methodology-item">

      <div className="methodology-icon">
        📊
      </div>

      <div>

        <h3>
          Heat Risk Model
        </h3>

        <p>
          Heat index, apparent temperature, relative
          humidity and wet-bulb temperature are combined
          to assess heat-stress conditions.
        </p>

      </div>

    </div>


    {/* AI */}

    <div className="methodology-item">

      <div className="methodology-icon">
        🤖
      </div>

      <div>

        <h3>
          AI Interpretation
        </h3>

        <p>
          The AI engine interprets the environmental
          indicators, identifies contributing factors
          and generates recommendations.
        </p>

      </div>

    </div>


    {/* ACTION */}

    <div className="methodology-item">

      <div className="methodology-icon">
        🛡️
      </div>

      <div>

        <h3>
          Decision Support
        </h3>

        <p>
          Risk results are converted into practical
          actions for vulnerable groups and people
          exposed to heat.
        </p>

      </div>

    </div>


  </div>


  <div className="methodology-note">

    <strong>
      Important:
    </strong>

    <span>
      HeatSafe is designed as a decision-support system.
      Environmental conditions can change rapidly, so
      users should consider current local conditions
      when making safety decisions.
    </span>

  </div>

</section>

      </main>


      {/* ==================================================
          FOOTER
      ================================================== */}

      <footer>

        <p>
          HeatSafe AI • Powered by FortyGuard
          Environmental Intelligence
        </p>

      </footer>


    </div>

  );

}


export default App;