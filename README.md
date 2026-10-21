# 🕵️‍♂️ Time Detective - Interactive Educational Website

**Time Detective** is a complete, interactive, web-based educational application designed specifically for primary school pupils aged 11 (Key Stage 2 / Grade 5-6). It helps pupils accurately calculate time duration in days between dates, understand leap years, and overcome standard mathematical misconceptions about calendars.

---

## 🎯 Educational Goals & Misconceptions Fixed

This website actively targets and resolves 4 major primary school time-calculation misconceptions:
1. **Assuming every month has 30 days:** Emphasizes exact month lengths (30 vs 31 days) using the classic nursery rhyme and visual calendar grids.
2. **Forgetting February has 28 or 29 days:** Explains leap year rules clearly and provides an interactive visual toggle between 28 and 29 days.
3. **Counting start or end dates incorrectly:** Clarifies exclusive (counting nights/steps between dates) versus inclusive counting with an explicit toggle switch and step-by-step breakdown.
4. **Not knowing how to identify a leap year:** Teaches the simple rule (a year divisible by 4) through an instant checker tool, visual proof, and a gamified card game.

---

## 🌟 Key Features & Navigation

The application consists of 4 top-level sections with full keyboard navigation and high-contrast, tap-friendly controls:

### 1. 🗓️ Calendar Explorer
- **Two Date Pickers:** Select start and end dates.
- **Visual Month Calendar:** Interactive calendar rendering selected date ranges with distinct highlight markers for start date, included duration, and end date.
- **Step-by-Step Breakdown:** Detailed calculation breakdown (e.g. *"Step 1: Days left in March: 26, Step 2: Days in April: 20, Total Sum: 46 days"*).
- **Start Date Toggle:** Switch between exclusive duration (standard) and inclusive duration (counting both start and end days).
- **Month Length Reference:** Classic *"30 days has September..."* rhyme with interactive color-coded month chips.

### 2. 🔬 Leap Year Lab
- **Leap Year Inspector:** Input any year to check if it is a leap year with clear mathematical explanation ($Year \div 4$).
- **Visual February Switcher:** Visual calendar dynamically toggling February between 28 and 29 days with animated leap day callouts.
- **Nearest Leap Years:** Displays surrounding leap year chips.
- **"Spot the Leap Year" Mini-Game:** Interactive gamified quiz card game to identify leap years with live score tracking.

### 3. 📝 Practice Cases with Diagnostic Feedback
- **10 Randomised Word Problems:** Engaging scenario-based cases covering cross-month durations, leap and non-leap February calculations, inclusive dates, multi-month durations, and days-to-hours conversions.
- **Guided Detective Hints:** Hint button revealing structured calculation steps.
- **Diagnostic Feedback Engine:** Automatically detects specific student misconceptions (30-day assumption, off-by-one errors, February length mix-ups) and provides targeted, friendly guidance.

### 4. 🏆 Challenge Quiz
- **10 Multiple-Choice Questions:** Randomised exam covering all duration and leap year principles with progress bar and live score.
- **Star Rating & Detective Ranks:** Rewards performance with 1 to 3 stars and badges (*Junior Detective*, *Senior Detective*, *Chief Time Detective*).
- **Detailed Review Screen:** Complete post-quiz review displaying step-by-step mathematical workings for every question.

---

## 🛠️ Technology Stack

- **Plain HTML5:** Semantic elements, WCAG-compliant ARIA labels, and keyboard access.
- **CSS3:** Custom responsive layout (Flexbox & Grid), high-contrast WCAG AA palette, and 48px+ touch targets.
- **Vanilla JavaScript (ES6+):** Timezone-safe UTC date mathematics, dynamic UI DOM manipulation, and misconception diagnosis engine.
- **No Frameworks, No Build Steps, No External Dependencies, No Backend.**

---

## 🚀 How to Run Locally

Because **Time Detective** relies purely on standard web technologies with no build steps, you can open and run it directly in any modern browser:

### Option 1: Direct File
Simply double-click `index.html` or open it in your browser.

### Option 2: Local Static Server
You can use any standard HTTP static server:
```bash
# Using Node.js npx http-server
npx http-server . -p 8080

# Using Python 3
python3 -m http.server 8080
```
Then visit `http://localhost:8080` in your web browser.

---

## 🔒 Privacy & Safety

- **Zero Data Collection:** No analytics, no tracking, no personal information collected or stored.
- **Static Hosting Ready:** Ready for deployment on static platforms like Vercel, Netlify, or GitHub Pages with `index.html` at root.
