---
title: Monopoly & Market Structure Explorer
status: in-progress
category: microeconomics
featured: true
hue: 200
tags: [monopoly, marginal revenue, profit maximisation, market structure]
summary: An interactive explorer of how a monopolist chooses output and price. A working monopoly model is already in the Economics Lab.
researchQuestion: How do demand and cost parameters change the monopoly outcome compared with perfect competition?
github: ""
report: ""
tools: [TypeScript, React, Recharts]
relatedNotes: []
relatedVideos: []
---

## Motivation and background

Comparing monopoly with competitive outcomes is a core exercise in microeconomics. The interactive monopoly model is in the [Economics Lab](/lab/monopoly). Extending it to oligopoly is a planned next step.

## Data sources and limitations

No empirical data. Linear demand and constant marginal cost are simplifying assumptions chosen for clarity.

## Methodology

With inverse demand $P = a - bQ$ and marginal cost $MC = c + dQ$, marginal revenue is $MR = a - 2bQ$. Profit is maximised where $MR = MC$:

$$Q^{m} = \frac{a - c}{2b + d}, \qquad P^{m} = a - bQ^{m}$$

The deadweight loss is the area between the demand and marginal-cost curves from $Q^m$ to the competitive quantity.

## Charts and visualisations

Demand, marginal revenue and marginal cost curves, with the profit-maximising point marked, are in the Lab.

## Results and interpretation

Textbook results, calculated live. Not original research.

## Limitations and next steps

Planned: Cournot and Bertrand duopoly, and price discrimination.
