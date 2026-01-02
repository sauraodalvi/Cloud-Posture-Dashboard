
/**
 * GEMINI SERVICE DISABLED
 * Scope Lock: MVP prototype is 'No AI' by design to show PM scope control.
 * All remediation data is pulled from the static mock record set.
 */

export interface RemediationGuidance {
  what: string;
  where: string;
  how: string;
  terraform: string;
}

export const getRemediation = async (title: string, description: string): Promise<RemediationGuidance> => {
  // Mock fallback only. In this MVP, we use the 'remediation' field from MOCK_RECORDS directly.
  return {
    what: "Manual review required.",
    where: "Cloud Console > Asset Settings",
    how: "Restrict permissions and enable encryption.",
    terraform: "# Manual fix recommended"
  };
};
