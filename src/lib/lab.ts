export type LabModelId = "consumer-choice" | "monopoly" | "supply-demand" | "regression";

export const labModels: {
  id: LabModelId;
  name: string;
  area: string;
  blurb: string;
  features: string[];
  project?: string;
}[] = [
  {
    id: "consumer-choice",
    name: "Consumer Choice Simulator",
    area: "Microeconomics",
    blurb: "Set income and prices, pick a utility function, and see the budget line, indifference curves and optimal bundle move together.",
    features: ["Budget line", "Indifference curves", "3 utility functions", "Baseline comparison"],
    project: "consumer-choice-simulator",
  },
  {
    id: "monopoly",
    name: "Monopoly Simulator",
    area: "Microeconomics",
    blurb: "Adjust demand and cost, then watch marginal revenue meet marginal cost to fix the profit-maximising quantity and price.",
    features: ["Demand, MR and MC", "Profit", "Deadweight loss", "Step-by-step algebra"],
    project: "monopoly-market-structure-explorer",
  },
  {
    id: "supply-demand",
    name: "Supply & Demand Explorer",
    area: "Microeconomics",
    blurb: "Shift the curves, find equilibrium, then add a price ceiling or floor to see shortages, surpluses and welfare losses.",
    features: ["Equilibrium", "Price ceiling", "Price floor", "Surplus and DWL"],
  },
  {
    id: "regression",
    name: "Econometrics Playground",
    area: "Econometrics",
    blurb: "Generate synthetic data, fit a regression line by least squares, and read the coefficients, R-squared and residuals.",
    features: ["OLS fit", "R-squared", "Residual plot", "Outlier toggle"],
    project: "rural-credit-household-outcomes",
  },
];
