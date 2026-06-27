import { riskMatrixConfig } from "../content/config";
import { calculateRisk } from "../utils/risk";

const m5Factors = [
  { he: "אדם", en: "Man" },
  { he: "ציוד ואמל״ח", en: "Machine" },
  { he: "סביבה", en: "Medium" },
  { he: "פיקוד ושליטה", en: "Management" },
];

export function RiskMatrix() {
  const { severityLevels, likelihoodLevels } = riskMatrixConfig;
  // Likelihood ascends in config; show it descending so זניחה sits on the
  // left and גבוהה on the right, as in the example matrix.
  const likelihoodColumns = [...likelihoodLevels].reverse();

  return (
    <details className="risk-matrix">
      <summary>הצגת מטריצת הסיכון ומדדי M5</summary>
      <div className="risk-matrix__scroll">
        <table>
          <caption className="sr-only">רמת סיכון לפי חומרה וסבירות</caption>
          <thead>
            <tr>
              <th scope="col">חומרה \ סבירות</th>
              {likelihoodColumns.map((likelihood) => (
                <th scope="col" key={likelihood.key}>
                  {likelihood.key}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {severityLevels.map((severity) => (
              <tr key={severity.key}>
                <th scope="row">
                  {severity.label} {severity.key}
                </th>
                {likelihoodColumns.map((likelihood) => {
                  const risk = calculateRisk(severity.key, likelihood.key);
                  return (
                    <td key={likelihood.key} data-tone={risk.tone}>
                      <strong>{risk.value}</strong>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <ul className="risk-matrix__m5" aria-label="גורמי סיכון M5">
        {m5Factors.map((factor) => (
          <li key={factor.en}>
            <strong>{factor.he}</strong>
            <span>{factor.en}</span>
          </li>
        ))}
      </ul>
    </details>
  );
}
