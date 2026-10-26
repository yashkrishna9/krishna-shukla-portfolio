---
title: Consumer Choice Simulator
status: in-progress
category: microeconomics
featured: true
hue: 225
tags: [utility maximisation, budget constraint, indifference curves]
summary: An interactive model of utility maximisation under a budget constraint. A working version is already in the Economics Lab.
researchQuestion: How does the optimal consumption bundle respond to changes in income and relative prices under different utility functions?
github: ""
report: ""
tools: [TypeScript, React, Recharts]
relatedNotes: [consumer-theory-utility-maximisation]
relatedVideos: [placeholder-consumer-choice]
---

## Motivation and background

Utility maximisation is the starting point of consumer theory. Seeing the budget line move and the optimum shift is a faster way to build intuition than static diagrams. The interactive version is available in the [Economics Lab](/lab/consumer-choice).

## Data sources and limitations

No empirical data. The model is purely theoretical: results depend entirely on the chosen utility function and parameters. It is an illustration, not an estimate of real behaviour.

## Methodology

The consumer solves

$$\max_{x,y}\; U(x,y) \quad \text{s.t.} \quad p_x x + p_y y = m$$

For Cobb-Douglas utility $U = x^{a}y^{1-a}$ the solution is $x^* = a\,m/p_x$ and $y^* = (1-a)\,m/p_y$. For perfect substitutes the optimum is a corner solution, and for perfect complements it lies on the ray $x = y$ (with equal weights).

## Charts and visualisations

The Economics Lab page draws the budget line, indifference curves and the optimal bundle from these formulas.

## Results and interpretation

These are textbook comparative-statics results, not new findings. The simulator calculates them live.

## Limitations and next steps

Only two goods, no uncertainty, no dynamic choice. Next steps: add quasi-linear utility and a Slutsky decomposition view.
