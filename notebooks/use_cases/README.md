# Use-case notebooks

Narrative workflows that combine **your data** with **FortyGuard's layers** to produce a ranked, defensible action list. All four follow the same shape — load user data → attach our layers → compute a composite score → translate to a business decision — but differ in user-data shape and scoring logic so they're not template copies.

Run `notebooks/00_setup.ipynb` first if you haven't yet, then pick any of these.

| Notebook | Persona / industry | Your data | FortyGuard layers | Output |
|----------|-------------------|-----------|-------------------|--------|
| [Urban planner — bus-stop cooling](urban_planner_bus_stop_prioritization.ipynb) | City transit / public works | Point layer (bus stops) | Heatmap + satellite + street view + env_params | Ranked intervention list |
| [Real-estate portfolio heat risk](real_estate_portfolio_heat_risk.ipynb) | REIT / asset management | Portfolio table (properties + value + sqft) | Heatmap + satellite + env_params | Risk-tiered portfolio with OpEx uplift per asset |
| [Public-health vulnerable facilities](public_health_vulnerable_facilities.ipynb) | Health / schools / social services | Facilities + vulnerability counts | Heatmap + env_params | Exposure-weighted priority + type-aware action list |
| [Urban forestry tree prioritization](urban_forestry_tree_prioritization.ipynb) | Parks / climate adaptation | Two layers: existing trees + candidate sites | Heatmap + satellite | Planting priority score per candidate |

## Structural variety

The four notebooks demonstrate different shapes of user data so you can see how the pattern maps onto your own workflows:

- **Single point layer × raster** (bus stops, facilities) — point-in-tile spatial join
- **Portfolio table × multi-endpoint enrichment** (real estate) — loop over assets, call several endpoints per row, composite score
- **Weighted point layer** (public health) — user data carries a weight column that modifies the ranking
- **Two interacting point layers** (urban forestry) — nearest-neighbor distance between user layers is itself a feature

## Extending

Each notebook ends with an "Apply this pattern" section listing adjacent use cases that reuse the same pipeline with different inputs.
