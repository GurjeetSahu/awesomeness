---

# Awesomeness

A **local solution to organize your GitHub stars**. Built for developers who want more ways to categorize and manage their starred repositories on their own machine.

> **Beta version:** still a bit unstable and may need some polishing.

---
## Caution
⚠️ CAUTION

THIS REPOSITORY IS INTENDED FOR PERSONAL AND EDUCATIONAL USE ONLY.
IT INTERACTS WITH THE GITHUB API TO FETCH STARRED REPOSITORIES AND MAY SEND MULTIPLE REQUESTS DEPENDING ON USAGE.

THIS APPLICATION RESPECTS GITHUB’S API LIMITS AND INFRASTRUCTURE AND FETCHES DATA ONLY WHEN NEEDED TO AVOID UNNECESSARY LOAD OR RATE LIMIT VIOLATIONS.

OVERUSE, ABUSE, OR MISUSE (E.G., EXCESSIVE API CALLS, AUTOMATION BEYOND RATE LIMITS, OR USE WITH UNAUTHORIZED TOKENS) CAN LEAD TO GITHUB ACCOUNT SUSPENSION OR API RESTRICTIONS.

THE DEVELOPER IS NOT RESPONSIBLE FOR ANY BANS, RESTRICTIONS, OR DAMAGES RESULTING FROM IMPROPER OR EXCESSIVE USE OF THIS CODE.

USE RESPONSIBLY.

## Features

* Organize your GitHub stars into custom categories locally.
* Fully **local-first**, powered by IndexedDB via **Dexie.js**.
* Clean, modern UI built with **React + Next.js** and **shadcn/ui**.
* Uses OAuth for GitHub authentication — no live hosting or server-side storage required.

---

## Why I Built This

This project was inspired by the need for a **personal, customizable way to organize starred repositories**. It is meant for **local use only**, and does not replace GitHub’s platform or interfere with its services.

---

## Tech Stack

* **React + Next.js** – UI and app logic
* **Dexie.js** – Local IndexedDB management
* **shadcn/ui** – Accessible, modern components

---

## Getting Started

1. **Clone the repository:**

   ```bash
   git clone https://github.com/your-username/awesomeness.git
   cd awesomeness
   ```

2. **Install dependencies:**

   ```bash
   npm install
   ```

3. **Create a GitHub OAuth App**

   * Go to [GitHub Developer Settings](https://github.com/settings/developers) → OAuth Apps → New OAuth App.
   * Set the callback URL to your local dev environment (e.g., `http://localhost:3000/api/auth/callback`).
   * Note the **Client ID** and **Client Secret**.

4. **Add your next-auth secret:**
   
   ```env
   npx auth secret
   ```
   
5. **Add your OAuth credentials:**
   On `.env.local` file:

   ```env
   AUTH_GITHUB_ID=your_client_id
   AUTH_GITHUB_SECRET=your_client_secret
   NEXTAUTH_URL=http://localhost:3000
   ```

6. **Run the app:**

   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Usage

* Sign in with your GitHub account via OAuth.
* Click refresh button to fetch all your starred repositories from github.
* Browse your starred repositories locally.
* Organize them into categories or create new ones.
* All data is stored **locally on your machine**.

---


## Acknowledgements

* Thanks to **[shadcn/ui](https://github.com/shadcn/ui)** for their clean and accessible UI components.
* Thanks to **[Dexie.js](https://dexie.org/)** for making IndexedDB easy to work with.
* Inspired by developers and open-source projects that make building tools like this possible.

---


## Contributing

Contributions, feedback, and suggestions are welcome! Please open issues or submit pull requests.

---

## License

MIT License © 2025 \[gurjeetsahu]

---
