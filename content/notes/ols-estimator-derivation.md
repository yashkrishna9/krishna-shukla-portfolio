---
title: The OLS estimator, derived
description: A short sample note deriving the least-squares estimator for simple linear regression.
semester: 1
subject: econometrics
chapter: Simple linear regression
topic: Ordinary least squares
type: formula-sheet
tags: [OLS, regression, estimator, R-squared]
pdf: ""
relatedVideos: [placeholder-ols-intuition]
relatedProjects: [rural-credit-household-outcomes]
updated: 2026-10-25
---

This is a **sample note**. Replace it with your own material.

## Model

$$y_i = \beta_0 + \beta_1 x_i + u_i, \qquad i = 1,\dots,n$$

## Estimator

Ordinary least squares chooses $\hat\beta_0,\hat\beta_1$ to minimise the sum of squared residuals $\sum_i (y_i - \beta_0 - \beta_1 x_i)^2$. The first-order conditions give

$$\hat\beta_1 = \frac{\sum_i (x_i-\bar x)(y_i-\bar y)}{\sum_i (x_i-\bar x)^2}, \qquad \hat\beta_0 = \bar y - \hat\beta_1 \bar x$$

## Goodness of fit

$$R^2 = 1 - \frac{\sum_i \hat u_i^{2}}{\sum_i (y_i-\bar y)^2}$$

A high $R^2$ does not by itself show that $x$ causes $y$.

## Formula checklist

| Quantity | Formula |
| --- | --- |
| Slope | $\hat\beta_1 = S_{xy}/S_{xx}$ |
| Intercept | $\hat\beta_0 = \bar y - \hat\beta_1\bar x$ |
| Residual | $\hat u_i = y_i - \hat\beta_0 - \hat\beta_1 x_i$ |

Explore it with the [Econometrics Playground](/lab/regression).
