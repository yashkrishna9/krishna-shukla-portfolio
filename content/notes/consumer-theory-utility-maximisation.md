---
title: Consumer theory and utility maximisation
description: A short sample note on the consumer's problem, the Lagrangian and the Cobb-Douglas solution.
semester: 1
subject: microeconomics
chapter: Consumer theory
topic: Utility maximisation
type: notes
tags: [utility, budget constraint, Lagrangian, Cobb-Douglas]
pdf: ""
relatedVideos: [placeholder-consumer-choice]
relatedProjects: [consumer-choice-simulator]
updated: 2026-10-25
---

This is a **sample note** showing the layout and equation rendering. Replace it with your own material.

## The problem

A consumer with income $m$ chooses quantities $x$ and $y$ of two goods at prices $p_x$ and $p_y$:

$$\max_{x,y}\; U(x,y) \quad \text{subject to} \quad p_x x + p_y y = m$$

## First-order conditions

Form the Lagrangian $\mathcal{L} = U(x,y) + \lambda\,(m - p_x x - p_y y)$. At an interior optimum,

$$\frac{\partial U/\partial x}{\partial U/\partial y} = \frac{p_x}{p_y}$$

The left side is the marginal rate of substitution, $MRS$. The optimum is where the indifference curve is tangent to the budget line.

## Cobb-Douglas example

For $U(x,y) = x^{a}y^{1-a}$ with $0<a<1$, the $MRS$ is $\dfrac{a\,y}{(1-a)\,x}$. Setting it equal to $p_x/p_y$ and substituting into the budget line gives the demand functions

$$x^{*} = \frac{a\,m}{p_x}, \qquad y^{*} = \frac{(1-a)\,m}{p_y}$$

The consumer spends a constant share $a$ of income on good $x$.

## Quick checks

- Doubling $m$, $p_x$ and $p_y$ leaves the choice unchanged (demand is homogeneous of degree zero).
- Try the numbers in the [Consumer Choice Simulator](/lab/consumer-choice).
