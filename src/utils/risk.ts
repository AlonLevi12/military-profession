import { riskMatrixConfig } from "../content/config";

export function calculateRisk(
  severityKey: string,
  likelihoodKey: string,
  config = riskMatrixConfig,
) {
  const value = config.cells[severityKey]?.[likelihoodKey];

  if (value === undefined) {
    throw new Error(
      `No risk cell configured for ${severityKey} × ${likelihoodKey}`,
    );
  }

  const level = config.levels.find(
    (candidate) => value >= candidate.min && value <= candidate.max,
  );

  if (!level) {
    throw new Error(`No risk level configured for value ${value}`);
  }

  return { value, ...level };
}
