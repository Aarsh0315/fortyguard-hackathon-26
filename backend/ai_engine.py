def generate_heat_insight(data):

    heat_index = float(data.get("heat_index_celsius", 0))
    apparent_temp = float(data.get("apparent_temperature_celsius", 0))
    humidity = float(data.get("relative_humidity_percent", 0))
    wet_bulb = float(data.get("wet_bulb_temperature_celsius", 0))
    risk_score = int(data.get("risk_score", 0))
    risk_level = data.get("risk_level", "UNKNOWN")

    factors = []
    recommendations = []
    vulnerable_groups = []

    # -----------------------------
    # Heat Index
    # -----------------------------

    if heat_index >= 40:
        factors.append("very high heat index")
        recommendations.append(
            "Avoid prolonged outdoor exposure during the hottest hours."
        )
    elif heat_index >= 35:
        factors.append("elevated heat index")
        recommendations.append(
            "Limit unnecessary outdoor activity during peak heat."
        )

    # -----------------------------
    # Humidity
    # -----------------------------

    if humidity >= 70:
        factors.append("very high humidity")
        recommendations.append(
            "Stay hydrated and use shaded or ventilated areas."
        )
    elif humidity >= 60:
        factors.append("high humidity")

    # -----------------------------
    # Wet Bulb
    # -----------------------------

    if wet_bulb >= 28:
        factors.append("elevated wet-bulb temperature")
        recommendations.append(
            "Increase cooling breaks and monitor for signs of heat stress."
        )
    elif wet_bulb >= 25:
        factors.append("elevated wet-bulb temperature")

    # -----------------------------
    # Apparent Temperature
    # -----------------------------

    if apparent_temp >= 35:
        factors.append("high apparent temperature")
        recommendations.append(
            "Reduce strenuous outdoor activity."
        )

    # -----------------------------
    # Vulnerable Groups
    # -----------------------------

    if risk_score >= 5:
        vulnerable_groups = [
            "elderly people",
            "children",
            "outdoor workers",
            "people with heat-sensitive health conditions"
        ]

    elif risk_score >= 3:
        vulnerable_groups = [
            "elderly people",
            "children",
            "outdoor workers"
        ]

    # -----------------------------
    # Default recommendation
    # -----------------------------

    if not recommendations:
        recommendations.append(
            "Normal precautions are appropriate. Stay hydrated and monitor heat conditions."
        )

    # Remove duplicate factors
    factors = list(dict.fromkeys(factors))

    # -----------------------------
    # AI-style summary
    # -----------------------------

    if risk_level == "HIGH":

        summary = (
            f"{data.get('city', 'This location')} is currently experiencing "
            f"high heat risk. The main contributing conditions are "
            f"{', '.join(factors)}. People exposed to outdoor heat should "
            f"take preventive cooling and hydration measures."
        )

    elif risk_level == "MODERATE":

        summary = (
            f"{data.get('city', 'This location')} has moderate heat risk. "
            f"Environmental conditions indicate some heat stress potential, "
            f"especially during prolonged outdoor exposure."
        )

    else:

        summary = (
            f"{data.get('city', 'This location')} currently shows relatively "
            f"low heat risk based on the available environmental indicators."
        )

    return {
        "summary": summary,
        "risk_level": risk_level,
        "risk_score": risk_score,
        "main_factors": factors,
        "recommendations": recommendations,
        "vulnerable_groups": vulnerable_groups,
        "metrics": {
            "heat_index_celsius": heat_index,
            "apparent_temperature_celsius": apparent_temp,
            "relative_humidity_percent": humidity,
            "wet_bulb_temperature_celsius": wet_bulb
        }
    }