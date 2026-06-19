import { riskMatrixConfig } from "../content/config";
import { calculateRisk } from "../utils/risk";

export function RiskMatrix() {
  return (
    <details className="risk-matrix">
      <summary>הצגת מטריצת הסיכון 1–5</summary>
      <div className="risk-matrix__scroll">
        <table>
          <caption className="sr-only">
            רמת סיכון לפי חומרה וסבירות
          </caption>
          <thead>
            <tr>
              <th scope="col">סבירות \ חומרה</th>
              {riskMatrixConfig.severityLevels.map((level) => (
                <th scope="col" key={level.value}>
                  {level.value}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {[...riskMatrixConfig.likelihoodLevels].reverse().map((likelihood) => (
              <tr key={likelihood.value}>
                <th scope="row">{likelihood.value}</th>
                {riskMatrixConfig.severityLevels.map((severity) => {
                  const risk = calculateRisk(
                    severity.value,
                    likelihood.value,
                  );
                  return (
                    <td key={severity.value} data-tone={risk.tone}>
                      <strong>{risk.value}</strong>
                      <span>{risk.label}</span>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </details>
  );
}
