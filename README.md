# StarVault

A **local solution to organize your GitHub stars**. Built for developers who want more ways to categorize and manage their starred repositories on their own machine.

---
## Features

* Organize your GitHub stars into custom categories locally.
* Fully **local-first**, powered by IndexedDB via **Dexie.js**.
* Clean, modern UI built with **React + Next.js** and **shadcn/ui**.
* Uses OAuth for GitHub authentication — no live hosting or server-side storage required.

---
## Screenshots
<img width="1846" height="925" alt="Screenshot" src="https://github.com/user-attachments/assets/24058082-3493-4878-a552-768ae9a8e80f" />

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

3. **Create a GitHub Personal Access Token(PAT)**

   * Go to [GitHub Developer Settings](https://github.com/settings/personal-access-tokens) → Fine-Grained Token → Generate New Token.
   * Under Account Permissions, Select "Starring".
   * Copy the **Token**.

   
4. **Add your credentials:**
   On `.env.local` file:

   ```env
   PAT=your_token
   ```

5. **Run the app:**

   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Tech Stack

* **React + Next.js** – UI and app logic
* **Dexie.js** – Local IndexedDB management
* **shadcn/ui** – Accessible, modern components

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
