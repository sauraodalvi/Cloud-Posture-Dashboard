# AccuKnox Guardrail: User Guide & Terminology Glossary

This guide helps you understand the technical terms used in the dashboard and how to navigate the application effectively.

---

## 1. Terminology "Un-Complicated"

### The Cloud Providers (The "Landlords")
Think of "The Cloud" as renting powerful computers and storage space from big tech companies instead of buying them yourself.
*   **AWS (Amazon Web Services):** Renting tech space from Amazon.
*   **Azure:** Renting tech space from Microsoft.
*   **GCP (Google Cloud Platform):** Renting tech space from Google.

### The "Assets" (Your Digital Stuff)
*   **IAM (Identity & Access Management):** The **Keycard System**. It controls who can log in and what they are allowed to touch.
    *   *Risk:* Giving a "Master Key" to an intern (giving too much permission).
*   **S3 / Storage Buckets:** **Digital Filing Cabinets**. Where you store files, images, and backups.
    *   *Risk:* Leaving the file cabinet verified "Public" so anyone on the internet can read your secrets.
*   **EC2 / VM / Compute:** **Virtual Computers**. These are the servers running your actual software programs.
    *   *Risk:* Leaving a "port" open (like leaving a window open) where hackers can sneak in.

### The Risk Levels (How Bad is it?)
*   **Critical (Red):** 🚨 **EMERGENCY.** A "front door unlocked" situation. Hackers could steal data or take control *right now*. Fix these first.
*   **High (Orange):** **URGENT.** Like a broken window latch. It needs effort to exploit, but you shouldn't ignore it.
*   **Medium/Low:** **MAINTENANCE.** Housekeeping tasks. Good to fix, but the house isn't on fire.

### App Terms
*   **Posture:** Your overall "Health Score". Good posture means you are secure. Bad posture means you have many vulnerabilities.
*   **Misconfiguration:** A "Mistake". Someone clicked the wrong setting (e.g., turning off the firewall). This is what this app finds.
*   **Remediation:** The "Fix". Step-by-step instructions on how to correct the mistake.

---

## 2. How to Use the App

### The "Overview" (Your Morning Coffee View)
*   **Purpose:** Get a 10-second check on your security health.
*   **What to look for:** Look at the "Critical Risks" number. If it's not zero, that's your job for the day.
*   **Cloud Filter:** Use the top dropdown to switch views between AWS, Azure, and GCP if you want to focus on just one team's infrastructure.

### The "Inventory" (The To-Do List)
*   **Purpose:** See the detailed list of every specific issue.
*   **Filtering:**
    *   Click **"Inventory Filters"** chips to see only `CRITICAL` issues or only `IAM` issues.
    *   This helps you tackle one category at a time (e.g., "Today is IAM cleanup day").
*   **Bulk Actions:**
    *   Select multiple checkboxes to **"Snooze"** (hide for later) a bunch of low-priority items at once.

### The "Issue Details" Panel (The Doctor's Note)
*   **How to open:** Click on any row in the table.
*   **What's inside:**
    *   **Description:** Explains *why* this is a problem in plain English.
    *   **Remediation:** Copy-paste commands or instructions to fix the issue.
*   **Taking Action:**
    *   **Mark Resolved:** Click this after you have fixed the issue in the real cloud console.
    *   **Snooze:** Use this if it's a false alarm or a known "safe" risk.

### The "Annotations" (The Training Wheels)
*   **What are they?** Yellow sticky notes scattered around the app.
*   **Interaction:** Click on any sticky note to highlight the **"Toggle Notes"** button.
*   **Hide them:** Once you know your way around, click the "Hide Annotations" button to clean up your view.
