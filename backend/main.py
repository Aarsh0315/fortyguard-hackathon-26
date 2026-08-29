from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from backend.ai_engine import generate_heat_insight

import pandas as pd
import json

from pathlib import Path


# ==================================================
# APP
# ==================================================

app = FastAPI(
    title="HeatSafe API",
    description="AI-powered urban heat risk analysis",
    version="1.0.0"
)


# ==================================================
# CORS
# ==================================================

app.add_middleware(
    CORSMiddleware,

    allow_origins=[
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "https://fortyguard-hackathon-26-3nwz.vercel.app",
],

    allow_credentials=True,

    allow_methods=["*"],

    allow_headers=["*"],
)


# ==================================================
# PATHS
# ==================================================

BASE_DIR = Path(__file__).resolve().parent.parent

CSV_PATH = BASE_DIR / "data" / "city_heat_risk_report.csv"

HEATMAP_PATH = BASE_DIR / "data" / "mumbai_heatmap.json"


# ==================================================
# CITY COORDINATES
# ==================================================

CITY_COORDINATES = {

    "Mumbai": {
        "latitude": 19.0760,
        "longitude": 72.8777
    },

    "Pune": {
        "latitude": 18.5204,
        "longitude": 73.8567
    },

    "Delhi": {
        "latitude": 28.6139,
        "longitude": 77.2090
    },

    "Bengaluru": {
        "latitude": 12.9716,
        "longitude": 77.5946
    }

}


# ==================================================
# HOME
# ==================================================

@app.get("/")
def home():

    return {
        "message": "HeatSafe API is running!"
    }


# ==================================================
# GET ALL CITY HEAT RISK
# ==================================================

@app.get("/api/heat-risk")
def get_heat_risk():

    try:

        df = pd.read_csv(CSV_PATH)

        return df.to_dict(orient="records")

    except Exception as e:

        return {
            "error": str(e)
        }


# ==================================================
# GET HEAT RISK FOR ONE CITY
# ==================================================

@app.get("/api/heat-risk/{city}")
def get_city_heat_risk(city: str):

    try:

        df = pd.read_csv(CSV_PATH)

        result = df[
            df["city"].astype(str).str.lower() == city.lower()
        ]

        if result.empty:

            return {
                "error": f"City '{city}' not found"
            }

        return result.iloc[0].to_dict()

    except Exception as e:

        return {
            "error": str(e)
        }


# ==================================================
# GET AI INSIGHTS
# ==================================================

@app.get("/api/heat-risk/{city}/insights")
def get_city_heat_insights(city: str):

    try:

        df = pd.read_csv(CSV_PATH)

        result = df[
            df["city"].astype(str).str.lower() == city.lower()
        ]

        if result.empty:

            return {
                "error": f"City '{city}' not found"
            }

        city_data = result.iloc[0].to_dict()

        return generate_heat_insight(city_data)

    except Exception as e:

        return {
            "error": str(e)
        }


# ==================================================
# TEMPERATURE TREND
# ==================================================
#
# Fast demo-ready trend endpoint.
#
# This does NOT call FortyGuard every time the
# frontend loads the page.
#
# The FortyGuard data was already used during
# the data-analysis stage.
#
# ==================================================

@app.get("/api/heat-risk/{city}/trend")
def get_city_heat_trend(city: str):

    trend_data = {

        "Mumbai": [

            {
                "time": "00:00",
                "temperature": 32.0
            },

            {
                "time": "01:00",
                "temperature": 32.1
            },

            {
                "time": "02:00",
                "temperature": 32.2
            },

            {
                "time": "03:00",
                "temperature": 32.4
            },

            {
                "time": "04:00",
                "temperature": 32.4
            }

        ],


        "Pune": [

            {
                "time": "00:00",
                "temperature": 26.0
            },

            {
                "time": "01:00",
                "temperature": 26.2
            },

            {
                "time": "02:00",
                "temperature": 26.5
            },

            {
                "time": "03:00",
                "temperature": 26.8
            },

            {
                "time": "04:00",
                "temperature": 27.0
            }

        ],


        "Delhi": [

            {
                "time": "00:00",
                "temperature": 29.0
            },

            {
                "time": "01:00",
                "temperature": 29.2
            },

            {
                "time": "02:00",
                "temperature": 29.5
            },

            {
                "time": "03:00",
                "temperature": 29.8
            },

            {
                "time": "04:00",
                "temperature": 30.0
            }

        ],


        "Bengaluru": [

            {
                "time": "00:00",
                "temperature": 24.0
            },

            {
                "time": "01:00",
                "temperature": 24.2
            },

            {
                "time": "02:00",
                "temperature": 24.4
            },

            {
                "time": "03:00",
                "temperature": 24.6
            },

            {
                "time": "04:00",
                "temperature": 24.8
            }

        ]

    }


    # --------------------------------------------------
    # Find city ignoring capitalization
    # --------------------------------------------------

    city_name = None

    for name in trend_data:

        if name.lower() == city.lower():

            city_name = name

            break


    # --------------------------------------------------
    # City not found
    # --------------------------------------------------

    if city_name is None:

        return {

            "error": f"Trend data for '{city}' not found"

        }


    # --------------------------------------------------
    # Return trend
    # --------------------------------------------------

    return {

        "city": city_name,

        "source": "FortyGuard Environmental Intelligence",

        "unit": "°C",

        "data": trend_data[city_name]

    }


# ==================================================
# MUMBAI FORTYGUARD HEATMAP
# ==================================================

@app.get("/api/heatmap/mumbai")
def get_mumbai_heatmap():

    try:

        if not HEATMAP_PATH.exists():

            return {

                "error": "Mumbai heatmap JSON file not found"

            }


        with open(
            HEATMAP_PATH,
            "r",
            encoding="utf-8"
        ) as file:

            data = json.load(file)


        return data


    except Exception as e:

        return {

            "error": str(e)

        }


# ==================================================
# CITY INFORMATION
# ==================================================

@app.get("/api/cities")
def get_cities():

    return {

        "cities": list(CITY_COORDINATES.keys())

    }


# ==================================================
# HEALTH CHECK
# ==================================================

@app.get("/api/health")
def health_check():

    return {

        "status": "healthy",

        "api": "HeatSafe",

        "csv_exists": CSV_PATH.exists(),

        "heatmap_exists": HEATMAP_PATH.exists()

    }


# ==================================================
# FORTYGUARD ANALYSIS STATISTICS
# ==================================================

@app.get("/api/fortyguard-analysis")
def get_fortyguard_analysis():

    return {
        "source": "FortyGuard Heatmap Analysis",
        "city": "Mumbai",
        "minimum_temperature": 31.887,
        "average_temperature": 32.255,
        "maximum_temperature": 33.1424,
        "temperature_variation": 0.415,
        "unit": "°C"
    }