# Italian Form Filler & Codice Fiscale Generator

A lightweight Tampermonkey userscript designed for developers and QA engineers to instantly fill web forms with realistic, synchronized Italian test data.

With a simple **double-click** on any visible input field, it automatically populates names, surnames, emails, dates of birth, gender, and—most importantly—a **mathematically valid Italian Codice Fiscale (Fiscal Code)** that perfectly matches the generated identity's details to bypass strict form validators.

## 🚀 Key Features

- **Valid Codice Fiscale Calculation:** Automatically computes the exact 16-character alphanumeric string, including the correct mathematical checksum letter (CIN).
- **Multi-Form & Anti-Duplication:** Built-in smart grouping recognizes row-based layouts or multi-passenger forms (e.g., `passenger_0`, `passenger_1`) and generates completely unique identities for each block instead of pasting the same data everywhere.
- **Context-Aware Mapping:** Populates adjoined fields such as Name, Surname, Email, Birthplace, and Gender automatically if they are present in the form layout.
- **Safe Testing:** Skips hidden tracking/anti-bot fields (`display: none` / `visibility: hidden`) and preserves fields you have already typed in manually.
- **Modern Framework Support:** Triggers native input and change events to play nice with React, Vue, Angular, and Svelte forms.

---

## 🛠️ Installation Guide

Follow these quick steps to install the script directly from this repository into your browser:

### 1. Install a Userscript Manager

You need a browser extension to run the script. Install **Tampermonkey** or **Violentmonkey** for your browser:

- [Tampermonkey for Chrome / Brave / Edge](https://chromewebstore.google.com/detail/tampermonkey/dhdgffkkebhmfjgcdfmmnhhdgnoahbnh)
- [Tampermonkey for Firefox](https://addons.mozilla.org/en-US/firefox/addon/tampermonkey/)

### 2. One-Click Installation

Once the extension is installed, click the link below to let Tampermonkey parse and install the script automatically:

👉 **[Click here to Install/Update the Script](https://raw.githubusercontent.com/Chromiell/TamperMonkeyFormFiller/main/form-filler.user.js)**

_(Note: Replace the link above in your README with your actual repository URL)._

---

## 💡 How to Use

1. Navigate to any website containing a form you need to test.
2. **Double-click** inside any input box (e.g., the First Name or Fiscal Code field).
3. Watch the script magically fill out the coordinated test identity instantly!

## 🔄 Automatic Updates

Because this script uses `@updateURL` pointing directly to this repository, your browser will automatically fetch the latest updates whenever a new version is pushed to the `main` branch.

To manually check for updates, go to your **Tampermonkey Dashboard -> Utilities -> Check for updates**.

