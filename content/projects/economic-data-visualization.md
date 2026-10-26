---
title: Economic Data Visualization
status: concept
category: macro-development
featured: true
hue: 205
tags: [macroeconomics, data visualisation, inflation, GDP, Python]
summary: A planned set of careful visualisations of macroeconomic and financial indicators using official data. The Data page currently shows a labelled sample dataset only.
researchQuestion: Which indicators and chart forms communicate the state of the Indian economy most clearly and honestly?
github: ""
report: ""
tools: [Python, pandas, Recharts]
relatedNotes: []
relatedVideos: [placeholder-python-first-plot]
---

## Motivation and background

Good charts make economic data easier to read, and bad charts mislead. This concept is about building the habit of tracing every plotted number back to an official source.

## Data sources and limitations

No live connection is configured. The [Data page](/data) shows a clearly labelled illustrative sample. Candidate official sources include the Reserve Bank of India and the Ministry of Statistics and Programme Implementation. Series definitions, revisions and base years must be checked before use.

## Methodology

Real growth between periods is computed as

$$g_t = \frac{Y_t - Y_{t-1}}{Y_{t-1}} \times 100$$

and inflation from a price index $P_t$ as the percentage change over the previous year. Each chart will state units, frequency and the date the data was retrieved.

## Charts and visualisations

The Data page demonstrates the chart layout using sample values.

## Results and interpretation

Not available. No official data has been loaded.

## Limitations and next steps

Next steps: choose three series, download them from the official source, record the retrieval date, and recreate one published chart as a check.
