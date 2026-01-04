# AccuKnox Guardrail — Cloud Posture Dashboard

This repository serves as the submission for the **Product Design Assignment**:
> **[1] Cloud Posture Dashboard:** Design a simple way for users to view and filter misconfigurations across multiple cloud accounts.

### 🚀 **[View Live Prototype](https://sauraodalvi.github.io/Cloud-Posture-Dashboard/)**

---

## 1. Problem Statement & User Persona

**User Persona:** Security Engineer / Cloud SecOps Analyst (Mid-Senior Level).

**Problem:**
Security engineers struggle to prioritize risks across fragmented AWS, Azure, and GCP accounts. They are often overwhelmed by "alert fatigue" and complex graphical dashboards that obscure actionable data.

**The Solution:**
A **"Table-First" Operational Console** designed to identify top risks in under 3 minutes.
- **No Fluff:** Prioritizes a dense, information-rich inventory over vanity metrics.
- **Unified Context:** Aggregates findings from AWS, Azure, and GCP into a single normalized view.
- **Action-Oriented:** Focuses on immediate prioritization (Severity) and resolution (Remediation steps).

---

## 2. Key Features & Design Rational

### **A. "Table-First" Operational View**
- **Why:** Engineers need to process rows of data quickly, not stare at pie charts.
- **Feature:** A high-density data grid with clear status indicators (Open, Resolved, Snoozed).

### **B. Global Cloud Filter**
- **Why:** While a unified view is great, engineers often tackle one cloud provider at a time due to context switching costs.
- **Feature:** A global dropdown to switch context between `ALL`, `AWS`, `AZURE`, or `GCP`.

### **C. "Morning Coffee" Severity Summary**
- **Why:** The first 10 seconds of the day are for triage. "Is the house on fire?"
- **Feature:** Top-level stats focusing solely on **Critical** and **High** risks.

### **D. Interactive "User Guide" Mode**
- **Why:** Complex tools usually have poor onboarding.
- **Feature:** Built-in "Annotations" (yellow sticky notes) that explain the design decisions directly within the UI.

---

## 3. Success Metrics

This dashboard prioritizes **Operational Efficiency** over **Engagement**. We don't want users staying on the app; we want them fixing issues.

| Metric Name | Formula | Why We Measure It |
| :--- | :--- | :--- |
| **Critical Issues Identified (%)** | `(Critical Issues Found / Total Critical Issues) * 100` | Measures visibility. If the user misses a critical risk, the dashboard has failed its primary purpose. |
| **Issues Correctly Understood (%)** | `(Issues Interpreted Correctly / Total Viewed) * 100` | Visibility is not enough; the engineer must understand *why* it is a risk without reading external docs. |
| **Issues Remediated Correctly (%)** | `(Issues Fixed / Total Viewed) * 100` | The ultimate success metric. Can the user turn the insight into a valid fix action? |

---

## 4. Development Action Items (Bonus)

To take this from Prototype to Production, the engineering team should prioritize:
1.  **API Integration:** Replace `MOCK_RECORDS` in `constants.tsx` with real data fetchers (e.g., React Query).
2.  **State Persistence:** Currently, "Snoozed" or "Resolved" states reset on refresh. Implement local storage or backend sync.
3.  **Pagination:** The current table renders all rows. Implement server-side pagination for datasets > 1000 records.
4.  **Role-Based Access Control (RBAC):** Ensure "Mark Resolved" is only available to users with write access.

---

## 5. Run Locally

This project is built with **React**, **Vite**, and **TailwindCSS**.

1.  **Install dependencies:**
    ```bash
    npm install
    ```

2.  **Run the development server:**
    ```bash
    npm run dev
    ```

3.  **Build for production:**
    ```bash
    npm run build
    ```
