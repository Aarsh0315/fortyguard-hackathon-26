"""Ready-made sample payloads so the notebooks run out of the box."""

# A small (~1 km²) polygon over lower Manhattan, suitable for a Basic-tier heatmap.
MANHATTAN_POLYGON = {
    "type": "FeatureCollection",
    "features": [
        {
            "type": "Feature",
            "properties": {},
            "geometry": {
                "type": "Polygon",
                "coordinates": [[
                    [-74.0170, 40.7050],
                    [-74.0030, 40.7050],
                    [-74.0030, 40.7180],
                    [-74.0170, 40.7180],
                    [-74.0170, 40.7050],
                ]],
            },
        }
    ],
}

# A point in downtown Chicago — used as a default for satellite / street view.
CHICAGO_POINT = {"latitude": 41.8781, "longitude": -87.6298}

# Filter types accepted by endpoints that take a `date_time` object.
FILTER_TYPES = {
    "single_hour": 1,
    "range_of_hours": 2,
    "single_day": 3,
}

# Analysis categories for the Heat Intelligence endpoint.
HEAT_INTEL_ANALYSES = (
    "geographic",
    "environmental",
    "urban",
    "events",
    "anthropogenic",
)
