# Use-case notebooks

Narrative workflows that combine **your data** with **FortyGuard's layers** to produce a ranked, defensible action list. They all follow the same shape — load your point list → join the heatmap → enrich the top exposures with satellite / street-view / env-params → translate the measurements into a business or public-health decision — but differ in inputs, scoring, and outputs so they're not template copies.

Run `notebooks/00_setup.ipynb` first if you haven't yet, then pick any of these.

## The three notebooks

| Notebook | Persona / industry | Your data | FortyGuard layers | Output |
|----------|-------------------|-----------|-------------------|--------|
| [Real-estate portfolio heat risk](real_estate_portfolio_heat_risk.ipynb) | Real-estate agents prepping a client portfolio review | Portfolio table (properties + value + sqft) | Heatmap + satellite + street view + env_params | **Client-deck slide pack** — M1/M2/M3 priority maps + per-property action brief with intervention recommendations citing public programs (EPA Heat Island, USDA i-Tree, ASHRAE 90.1, ASHRAE 55, OSHA Heat Illness) + `portfolio_evaluation.csv` |
| [Urban planner — bus-stop cooling](urban_planner_bus_stop_prioritization.ipynb) | City transit / public works | Point layer (bus stops) | Heatmap + satellite + street view + env_params | **Ranked intervention list** with cause-tagged recommendations (pavement vs. canopy vs. ground-level shade) |
| [Public-parks heat-resilience audit](public_parks_heat_resilience_audit.ipynb) | City parks-and-rec / public-health environmental health | Park point list (id + type + acres + lat/lon) | Heatmap + satellite + street view + env_params | **Per-park audit CSV + priority map** with declarative, threshold-triggered recommendations citing federal programs (USDA i-Tree, EPA Heat Island Reduction, CDC BRACE, NRPA Shade-Equity) |

## The shared workflow

Every notebook walks through the same five stages — only the input shape and the final action artifact change:

| Stage | What happens | API call |
|---|---|---|
| **1. Load your data** | Read a CSV / GeoJSON of points (properties, stops, parks). The only required columns are `id`, `name`, `latitude`, `longitude`. | — |
| **2. Heat layer** | One 24-hour heatmap over the AOI. Each tile carries hourly temperatures `'00'..'23'`. | `client.create_heatmap(...)` |
| **3. Per-point join** | For every point in your data, find the heatmap tile it sits in and copy off peak temp, peak hour, and hours-above-NOAA-Caution. Now your table is heat-aware. | (none — local point-in-tile lookup) |
| **4. Diagnose the top-N hottest** | The hottest points get the deeper look: satellite for surface composition (canopy / impervious), street-view at #1 for ground-level shade, env-params for the heat-index curve. | `client.satellite_segmentation(...)`, `client.street_view_segmentation(...)`, `client.environmental_parameters(...)` |
| **5. Action artifact** | Translate the measurements into the output your audience actually uses — a client-deck slide pack, a ranked intervention list, or a tiered audit CSV with measurement-triggered recommendations. | — |

```text
┌─ your CSV ─┐    ┌─ heatmap ─┐    ┌─ diagnose top-N ─┐    ┌─ action ─┐
│ id, lat,   │ →  │ tiles ×   │ →  │ satellite +      │ →  │ ranked   │
│ lon, …     │    │ 24 hours  │    │ street-view +    │    │ list /   │
│            │    │           │    │ env-params       │    │ slides   │
└────────────┘    └───────────┘    └──────────────────┘    └──────────┘
```

## What you'll see when you run them

After loading the heatmap each notebook renders a one-line AOI summary card (min / mean / max swatches + colored histogram + colorbar) so you can eyeball the temperature distribution before any per-point logic runs:

![AOI temperature distribution — heatmap summary](../../docs/images/heatmap_summary.png)

The heatmap itself can be visualized as a tile-by-tile map. Below: the bundled San Jose sample heatmap, side-by-side at daily mean and daily peak — you can see the urban heat island concentrated in the south-east portion of the AOI, exactly the kind of pattern the per-point join in Step 3 will pick up:

![San Jose AOI heatmap — daily mean vs. daily peak](../../docs/images/heatmap_visualized.png)

The deep-dive on the top-N hottest items always includes a satellite-segmentation stacked bar — this is what tells the user *why* each top item is hot (high impervious / low canopy → tree-planting candidate; high tree % already → look at heat-index instead):

![Surface composition stacked bar — top-N parks](../../docs/images/surface_composition.png)

A representative cell from the public-parks notebook — Step 3 joins each park to the tile it sits in and ranks by peak temperature. Every notebook follows the same shape:

![Notebook code snippet — point-in-tile join](../../docs/images/notebook_snippet.png)

## Three output styles

The three notebooks share the same pipeline shape but produce different *kinds* of artifact so you can see how the same FortyGuard data maps onto different audiences:

- **Real estate** — a **client-meeting slide pack** (three priority maps + per-property action brief). The agent walks into a client review with M1/M2/M3 ready to present and a one-paragraph recommendation per top property tied to a public intervention program.
- **Bus stops** — a single **ranked intervention list** with cause tagging (pavement, canopy, or ground-level shade) so the city public-works team knows which kind of intervention each stop needs.
- **Public parks** — **declarative, threshold-triggered recommendations** with no invented index and no monetary translation. Every action is *if measurement X crosses a published threshold Y, recommend program Z*, where the threshold and the program both already exist (NOAA, EPA, USDA, CDC, NRPA). Portable to any city in the country.

## Cached by default

Every use-case notebook ships with `CACHED=True` and bundled San Jose sample files in `data/`, so you can run any of them end-to-end **without an API key**. The cached files cover all four endpoints — heatmap, env-params, satellite, street-view. Set `CACHED=False` once you have a key to refetch live for any AOI.

## Extending

Each notebook ends with an "Apply this pattern" section listing adjacent use cases that reuse the same pipeline with different inputs.
