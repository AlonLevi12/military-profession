import { riskMatrixConfig } from "../content/config";

export function calculateRisk(
  severity: number,
  likelihood: number,
  config = riskMatrixConfig,
) {
  const value = severity * likelihood;
  const level = config.levels.find(
    (candidate) => value >= candidate.min && value <= candidate.max,
  );

  if (!level) {
    throw new Error(`No risk level configured for value ${value}`);
  }

  return { value, ...level };
}
