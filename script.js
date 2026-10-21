/**
 * TIME DETECTIVE - Core Educational JavaScript Engine
 * Target Audience: Primary School Pupils (Aged 11)
 * Purpose: Date duration calculations, leap year identification, and misconception diagnosis.
 * Written in Plain Vanilla JS (ES6+) with UTC date handling.
 */

document.addEventListener('DOMContentLoaded', () => {

  /* ==========================================================================
     1. UTC DATE UTILITY FUNCTIONS
     ========================================================================== */

  const MONTH_NAMES = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  /**
   * Parse YYYY-MM-DD string into a timezone-safe UTC Date object.
   */
  function parseUTCDate(dateStr) {
    if (!dateStr) return null;
    const parts = dateStr.split('-');
    if (parts.length !== 3) return null;
    const year = parseInt(parts[0], 10);
    const month = parseInt(parts[1], 10) - 1;
    const day = parseInt(parts[2], 10);
    return new Date(Date.UTC(year, month, day));
  }

  /**
   * Format UTC Date to string (e.g. "12 June 2025")
   */
  function formatUTCDate(dateObj) {
    if (!dateObj || isNaN(dateObj.getTime())) return '';
    const day = dateObj.getUTCDate();
    const month = MONTH_NAMES[dateObj.getUTCMonth()];
    const year = dateObj.getUTCFullYear();
    return `${day} ${month} ${year}`;
  }

  /**
   * Format YYYY-MM-DD string to input value
   */
  function toISOUTCDateString(dateObj) {
    const y = dateObj.getUTCFullYear();
    const m = String(dateObj.getUTCMonth() + 1).padStart(2, '0');
    const d = String(dateObj.getUTCDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
  }

  /**
   * Primary school rule for leap year: divisible by 4.
   * (Handles standard Gregorian centurial exception for full correctness too).
   */
  function isLeapYear(year) {
    if (year % 400 === 0) return true;
    if (year % 100 === 0) return false;
    return year % 4 === 0;
  }

  /**
   * Get total days in a specific month for a given year.
   */
  function getDaysInMonth(year, monthIndex) {
    if (monthIndex === 1) { // February
      return isLeapYear(year) ? 29 : 28;
    }
    const days31 = [0, 2, 4, 6, 7, 9, 11]; // Jan, Mar, May, Jul, Aug, Oct, Dec
    return days31.includes(monthIndex) ? 31 : 30;
  }

  /**
   * Helper function to generate a random start and end date pair within 2026.
   * Guarantees:
   * - Year is 2026 for both start and end dates (1 Jan 2026 to 31 Dec 2026)
   * - End date is strictly after start date
   * - Gap is between minGap and maxGap days (inclusive, default 5 to 60)
   * - Supports specific month constraints: 'february', 'month30', 'month31', 'multiMonth', 'sameMonth'
   */
  function generateRandom2026DateRange(constraint = 'any', minGap = 5, maxGap = 60) {
    let startObj, endObj;

    for (let attempts = 0; attempts < 100; attempts++) {
      let gap = Math.floor(Math.random() * (maxGap - minGap + 1)) + minGap;

      if (constraint === 'february') {
        // February 2026 has 28 days
        const startDayInFeb = Math.floor(Math.random() * 20) + 5; // Feb 5 to Feb 24
        startObj = new Date(Date.UTC(2026, 1, startDayInFeb));
        gap = Math.floor(Math.random() * (maxGap - minGap + 1)) + minGap;
        endObj = new Date(startObj.getTime() + gap * 86400000);
      } else if (constraint === 'month30') {
        const months30 = [3, 5, 8, 10]; // April, June, Sept, Nov
        const m = months30[Math.floor(Math.random() * months30.length)];
        const startDay = Math.floor(Math.random() * 15) + 12; // day 12 to 26
        startObj = new Date(Date.UTC(2026, m, startDay));
        gap = Math.floor(Math.random() * (30 - 5 + 1)) + 5;
        endObj = new Date(startObj.getTime() + gap * 86400000);
      } else if (constraint === 'month31') {
        const months31 = [0, 2, 4, 6, 7, 9, 11]; // Jan, Mar, May, Jul, Aug, Oct, Dec
        const m = months31[Math.floor(Math.random() * months31.length)];
        const startDay = Math.floor(Math.random() * 15) + 12; // day 12 to 26
        startObj = new Date(Date.UTC(2026, m, startDay));
        gap = Math.floor(Math.random() * (30 - 5 + 1)) + 5;
        endObj = new Date(startObj.getTime() + gap * 86400000);
      } else if (constraint === 'multiMonth') {
        gap = Math.floor(Math.random() * (60 - 35 + 1)) + 35; // 35 to 60 days gap
        const maxStartDayIndex = 364 - gap;
        const startDayIndex = Math.floor(Math.random() * Math.max(1, maxStartDayIndex));
        startObj = new Date(Date.UTC(2026, 0, 1 + startDayIndex));
        endObj = new Date(startObj.getTime() + gap * 86400000);
      } else if (constraint === 'sameMonth') {
        const m = Math.floor(Math.random() * 12);
        const daysInM = getDaysInMonth(2026, m);
        gap = Math.floor(Math.random() * (Math.min(20, daysInM - 2) - 5 + 1)) + 5;
        const startDay = Math.floor(Math.random() * (daysInM - gap)) + 1;
        startObj = new Date(Date.UTC(2026, m, startDay));
        endObj = new Date(startObj.getTime() + gap * 86400000);
      } else {
        // Any random range in 2026
        gap = Math.floor(Math.random() * (maxGap - minGap + 1)) + minGap;
        const maxStartDayIndex = 365 - 1 - gap;
        const startDayIndex = Math.floor(Math.random() * Math.max(1, maxStartDayIndex));
        startObj = new Date(Date.UTC(2026, 0, 1 + startDayIndex));
        endObj = new Date(startObj.getTime() + gap * 86400000);
      }

      if (
        startObj.getUTCFullYear() === 2026 &&
        endObj.getUTCFullYear() === 2026 &&
        endObj > startObj
      ) {
        const actualGap = Math.round((endObj.getTime() - startObj.getTime()) / 86400000);
        if (actualGap >= minGap && actualGap <= maxGap) {
          return {
            startObj,
            endObj,
            startDateStr: toISOUTCDateString(startObj),
            endDateStr: toISOUTCDateString(endObj),
            gapDays: actualGap
          };
        }
      }
    }

    // Fallback if loop finishes unexpectedly
    const startObjFallback = new Date(Date.UTC(2026, 2, 10)); // 10 Mar 2026
    const endObjFallback = new Date(Date.UTC(2026, 3, 5));   // 5 Apr 2026
    return {
      startObj: startObjFallback,
      endObj: endObjFallback,
      startDateStr: toISOUTCDateString(startObjFallback),
      endDateStr: toISOUTCDateString(endObjFallback),
      gapDays: 26
    };
  }

  /**
   * Calculate duration in days between start and end date.
   * If includeStart is true, adds 1 day.
   */
  function calculateDurationDays(startDate, endDate, includeStart = false) {
    if (!startDate || !endDate || endDate < startDate) return 0;
    const diffTime = endDate.getTime() - startDate.getTime();
    const rawDays = Math.round(diffTime / (1000 * 3600 * 24));
    return includeStart ? rawDays + 1 : rawDays;
  }

  /**
   * Generate step-by-step month breakdown array for a date range.
   */
  function generateStepBreakdown(startDate, endDate, includeStart = false) {
    if (!startDate || !endDate || endDate < startDate) {
      return { steps: [], totalDays: 0, error: 'End date must be on or after start date.' };
    }

    const steps = [];
    let totalDays = 0;

    const startYear = startDate.getUTCFullYear();
    const startMonth = startDate.getUTCMonth();
    const startDay = startDate.getUTCDate();

    const endYear = endDate.getUTCFullYear();
    const endMonth = endDate.getUTCMonth();
    const endDay = endDate.getUTCDate();

    // Case 1: Same month and year
    if (startYear === endYear && startMonth === endMonth) {
      const days = endDay - startDay + (includeStart ? 1 : 0);
      steps.push({
        label: `${MONTH_NAMES[startMonth]} ${startYear}`,
        detail: includeStart
          ? `Day ${startDay} to Day ${endDay} inclusive`
          : `Day ${startDay} to Day ${endDay} (${endDay} - ${startDay})`,
        days: days
      });
      totalDays = days;
      return { steps, totalDays, error: null };
    }

    // Case 2: Crosses one or more months
    let currYear = startYear;
    let currMonth = startMonth;

    while (currYear < endYear || (currYear === endYear && currMonth <= endMonth)) {
      const daysInCurrMonth = getDaysInMonth(currYear, currMonth);
      const monthName = MONTH_NAMES[currMonth];

      if (currYear === startYear && currMonth === startMonth) {
        // First month
        const daysInFirstMonth = daysInCurrMonth - startDay + (includeStart ? 1 : 0);
        steps.push({
          label: `Days left in ${monthName} ${currYear}`,
          detail: includeStart
            ? `From day ${startDay} to day ${daysInCurrMonth} (${daysInCurrMonth} - ${startDay} + 1)`
            : `From day ${startDay} to day ${daysInCurrMonth} (${daysInCurrMonth} - ${startDay})`,
          days: daysInFirstMonth
        });
        totalDays += daysInFirstMonth;
      } else if (currYear === endYear && currMonth === endMonth) {
        // Last month
        steps.push({
          label: `Days in ${monthName} ${currYear}`,
          detail: `From day 1 to day ${endDay}`,
          days: endDay
        });
        totalDays += endDay;
      } else {
        // Full intermediate month
        steps.push({
          label: `Full month of ${monthName} ${currYear}`,
          detail: `Full ${daysInCurrMonth} days`,
          days: daysInCurrMonth
        });
        totalDays += daysInCurrMonth;
      }

      // Advance month
      currMonth++;
      if (currMonth > 11) {
        currMonth = 0;
        currYear++;
      }
    }

    return { steps, totalDays, error: null };
  }


  /* ==========================================================================
     2. NAVIGATION TABS CONTROLLER
     ========================================================================== */

  const navTabs = document.querySelectorAll('.nav-tab');
  const sectionPanels = document.querySelectorAll('.section-panel');

  function switchTab(targetId) {
    navTabs.forEach(tab => {
      const isTarget = tab.dataset.target === targetId;
      tab.classList.toggle('active', isTarget);
      tab.setAttribute('aria-selected', isTarget ? 'true' : 'false');
    });

    sectionPanels.forEach(panel => {
      const isTarget = panel.id === targetId;
      panel.classList.toggle('active', isTarget);
      panel.hidden = !isTarget;
    });
  }

  navTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      switchTab(tab.dataset.target);
    });
  });


  /* ==========================================================================
     3. SECTION 1: CALENDAR EXPLORER CONTROLLER
     ========================================================================== */

  const startDateInput = document.getElementById('start-date');
  const endDateInput = document.getElementById('end-date');
  const includeStartToggle = document.getElementById('include-start-toggle');
  const quickPresetBtn = document.getElementById('quick-preset-btn');
  const durationTotalDisplay = document.getElementById('duration-total-display');
  const stepByStepList = document.getElementById('step-by-step-list');

  const calPrevBtn = document.getElementById('cal-prev-month');
  const calNextBtn = document.getElementById('cal-next-month');
  const calCurrentLabel = document.getElementById('cal-current-label');
  const calendarGridContainer = document.getElementById('calendar-grid-container');

  let calendarViewDate = new Date(Date.UTC(2026, 2, 1)); // Default March 2026

  function updateExplorerView() {
    const startObj = parseUTCDate(startDateInput.value);
    const endObj = parseUTCDate(endDateInput.value);
    const includeStart = includeStartToggle.checked;

    if (!startObj || !endObj) {
      durationTotalDisplay.innerHTML = '⚠️ Please select valid start and end dates.';
      stepByStepList.innerHTML = '';
      return;
    }

    if (endObj < startObj) {
      durationTotalDisplay.innerHTML = '⚠️ End date must be on or after start date!';
      stepByStepList.innerHTML = '<p class="help-text">Try swapping the dates around.</p>';
      return;
    }

    if (startObj.getUTCFullYear() !== 2026 || endObj.getUTCFullYear() !== 2026) {
      durationTotalDisplay.innerHTML = '⚠️ Please choose dates in 2026.';
      stepByStepList.innerHTML = '<p class="help-text">Calendar Explorer focuses on dates inside 2026.</p>';
      return;
    }

    const { steps, totalDays } = generateStepBreakdown(startObj, endObj, includeStart);

    // Render Total Display
    durationTotalDisplay.innerHTML = `
      🕵️‍♂️ Total Duration: <strong>${totalDays} day${totalDays === 1 ? '' : 's'}</strong>
      <span style="font-size: 0.9rem; font-weight: normal; display: block; margin-top: 4px; color: var(--text-primary);">
        (${formatUTCDate(startObj)} to ${formatUTCDate(endObj)} ${includeStart ? '• Inclusive' : '• Exclusive of start day'})
      </span>
    `;

    // Render Step Breakdown
    let html = '<ul style="list-style: none; padding: 0;">';
    steps.forEach((step, idx) => {
      html += `
        <li class="step-item">
          <div>
            <strong>Step ${idx + 1}: ${step.label}</strong>
            <br><span class="help-text">${step.detail}</span>
          </div>
          <span style="font-weight: 800; font-size: 1.1rem; color: var(--detective-blue);">${step.days} days</span>
        </li>
      `;
    });
    html += `
      <li class="step-item" style="background: #e0f2fe; padding: 10px; border-radius: 6px; margin-top: 8px;">
        <strong>Total Sum:</strong>
        <span style="font-size: 1.2rem; font-weight: 900; color: var(--detective-navy);">${totalDays} Days</span>
      </li>
    </ul>`;
    stepByStepList.innerHTML = html;

    // Render Visual Calendar Map
    renderVisualCalendar(calendarViewDate, startObj, endObj);
  }

  function renderVisualCalendar(viewDateObj, startObj, endObj) {
    const year = viewDateObj.getUTCFullYear();
    const month = viewDateObj.getUTCMonth();

    calCurrentLabel.textContent = `${MONTH_NAMES[month]} ${year}`;

    const daysInMonth = getDaysInMonth(year, month);
    const firstDayIndex = new Date(Date.UTC(year, month, 1)).getUTCDay(); // 0 = Sun, 1 = Mon ...

    let tableHtml = `
      <div class="month-calendar-grid">
        <div class="calendar-month-heading">${MONTH_NAMES[month]} ${year} ${isLeapYear(year) && month === 1 ? '✨ (Leap Year - 29 Days)' : ''}</div>
        <table class="cal-table">
          <thead>
            <tr>
              <th>Sun</th><th>Mon</th><th>Tue</th><th>Wed</th><th>Thu</th><th>Fri</th><th>Sat</th>
            </tr>
          </thead>
          <tbody>
    `;

    let currentDay = 1;
    let cellCount = 0;

    for (let row = 0; row < 6; row++) {
      tableHtml += '<tr>';
      for (let col = 0; col < 7; col++) {
        if (cellCount < firstDayIndex || currentDay > daysInMonth) {
          tableHtml += '<td class="cal-day-muted"></td>';
        } else {
          const currCellDate = new Date(Date.UTC(year, month, currentDay));

          let cellClass = '';
          const isStart = startObj && currCellDate.getTime() === startObj.getTime();
          const isEnd = endObj && currCellDate.getTime() === endObj.getTime();
          const inRange = startObj && endObj && currCellDate >= startObj && currCellDate <= endObj;

          if (isStart) cellClass = 'cal-day-start';
          else if (isEnd) cellClass = 'cal-day-end';
          else if (inRange) cellClass = 'cal-day-in-range';

          tableHtml += `<td class="${cellClass}">${currentDay}</td>`;
          currentDay++;
        }
        cellCount++;
      }
      tableHtml += '</tr>';
      if (currentDay > daysInMonth) break;
    }

    tableHtml += '</tbody></table></div>';
    calendarGridContainer.innerHTML = tableHtml;
  }

  // Event Listeners for Explorer Controls
  startDateInput.addEventListener('change', () => {
    const startObj = parseUTCDate(startDateInput.value);
    if (startObj) {
      calendarViewDate = new Date(Date.UTC(startObj.getUTCFullYear(), startObj.getUTCMonth(), 1));
    }
    updateExplorerView();
  });

  endDateInput.addEventListener('change', updateExplorerView);
  includeStartToggle.addEventListener('change', updateExplorerView);

  calPrevBtn.addEventListener('click', () => {
    calendarViewDate.setUTCMonth(calendarViewDate.getUTCMonth() - 1);
    updateExplorerView();
  });

  calNextBtn.addEventListener('click', () => {
    calendarViewDate.setUTCMonth(calendarViewDate.getUTCMonth() + 1);
    updateExplorerView();
  });

  quickPresetBtn.addEventListener('click', () => {
    const constraints = ['february', 'month30', 'month31', 'multiMonth', 'any'];
    const selectedConstraint = constraints[Math.floor(Math.random() * constraints.length)];
    const range = generateRandom2026DateRange(selectedConstraint, 5, 60);

    startDateInput.value = range.startDateStr;
    endDateInput.value = range.endDateStr;
    calendarViewDate = new Date(Date.UTC(range.startObj.getUTCFullYear(), range.startObj.getUTCMonth(), 1));
    updateExplorerView();
  });

  // Initial call
  updateExplorerView();


  /* ==========================================================================
     4. SECTION 2: LEAP YEAR LAB CONTROLLER
     ========================================================================== */

  const yearInput = document.getElementById('year-input');
  const checkYearBtn = document.getElementById('check-year-btn');
  const yearResultBox = document.getElementById('year-result-box');
  const nearestLeapsList = document.getElementById('nearest-leaps-list');

  const febNormalBtn = document.getElementById('feb-normal-btn');
  const febLeapBtn = document.getElementById('feb-leap-btn');
  const febVisualContainer = document.getElementById('feb-visual-container');

  function checkLeapYear() {
    const yearVal = parseInt(yearInput.value, 10);
    if (isNaN(yearVal) || yearVal < 1) {
      yearResultBox.innerHTML = '<span class="help-text">Please enter a valid year number.</span>';
      return;
    }

    const isLeap = isLeapYear(yearVal);
    const divBy4 = yearVal % 4 === 0;

    let resultHtml = '';
    if (isLeap) {
      resultHtml = `
        <div class="result-box result-leap">
          🎉 <strong>${yearVal} IS a Leap Year!</strong><br>
          🔍 <strong>Detective Reason:</strong> ${yearVal} is divisible by 4 (${yearVal} ÷ 4 = ${yearVal / 4}).
          In leap years, February has <strong>29 days</strong> instead of 28!
        </div>
      `;
    } else {
      const rem = yearVal % 4;
      resultHtml = `
        <div class="result-box result-not-leap">
          ❌ <strong>${yearVal} is NOT a Leap Year.</strong><br>
          🔍 <strong>Detective Reason:</strong> ${yearVal} is not divisible by 4 (when divided by 4, it leaves a remainder of ${rem}).
          So February has standard <strong>28 days</strong>.
        </div>
      `;
    }
    yearResultBox.innerHTML = resultHtml;

    // Find nearest leap years
    const nearest = [];
    for (let y = yearVal - 8; y <= yearVal + 8; y++) {
      if (isLeapYear(y)) nearest.push(y);
    }
    nearestLeapsList.innerHTML = nearest.map(y => `<span class="leap-chip">${y} ${y === yearVal ? '⭐' : ''}</span>`).join('');
  }

  function renderFebVisual(isLeap) {
    const days = isLeap ? 29 : 28;
    febNormalBtn.classList.toggle('active', !isLeap);
    febLeapBtn.classList.toggle('active', isLeap);

    let gridHtml = `
      <div style="text-align: center; margin-bottom: 8px; font-weight: 800; color: var(--detective-navy);">
        February Calendar - ${isLeap ? '✨ LEAP YEAR (29 DAYS)' : 'NORMAL YEAR (28 DAYS)'}
      </div>
      <div style="display: grid; grid-template-columns: repeat(7, 1fr); gap: 6px; text-align: center;">
    `;

    for (let d = 1; d <= days; d++) {
      const isExtraDay = d === 29;
      const bgStyle = isExtraDay ? 'background: #f59e0b; color: #000; font-weight: 900; scale: 1.1; border-radius: 50%;' : 'background: #ffffff; border: 1px solid #cbd5e1; border-radius: 4px;';
      gridHtml += `
        <div style="padding: 8px 4px; font-weight: bold; font-size: 0.95rem; ${bgStyle}">
          ${d}${isExtraDay ? '🌟' : ''}
        </div>
      `;
    }

    gridHtml += '</div>';
    if (isLeap) {
      gridHtml += `
        <p style="text-align: center; margin-top: 10px; font-size: 0.9rem; color: #b45309; font-weight: bold;">
          🌟 Day 29 is the Leap Day! Earth takes 365.25 days to orbit the sun, so every 4 years we add 1 full day!
        </p>
      `;
    }
    febVisualContainer.innerHTML = gridHtml;
  }

  checkYearBtn.addEventListener('click', checkLeapYear);
  yearInput.addEventListener('keyup', (e) => { if (e.key === 'Enter') checkLeapYear(); });

  febNormalBtn.addEventListener('click', () => renderFebVisual(false));
  febLeapBtn.addEventListener('click', () => renderFebVisual(true));

  // Initialize Section 2
  checkLeapYear();
  renderFebVisual(true);

  /* --- Mini-Game: Spot the Leap Year (5 Rounds) --- */
  let leapCurrentRound = 0; // 0 to 4
  let leapGameScore = 0;
  let leapCurrentStreak = 0;
  let leapBestStreak = 0;
  let leapGameYearsInCurrentGame = [];
  let leapPreviousGameFirstYear = null;
  let leapCurrentYear = null;
  let leapGameWrongAnswers = [];

  const leapActiveCard = document.getElementById('leap-game-active-card');
  const leapSummaryCard = document.getElementById('leap-game-summary-card');
  const leapCounter = document.getElementById('leap-game-counter');
  const leapScoreBadge = document.getElementById('leap-game-score-badge');
  const leapStreakBadge = document.getElementById('leap-game-streak-badge');
  const leapProgressFill = document.getElementById('leap-game-progress-fill');
  const leapYearDisplay = document.getElementById('leap-game-year-display');
  const leapYesBtn = document.getElementById('leap-yes-btn');
  const leapNoBtn = document.getElementById('leap-no-btn');
  const leapFeedbackBox = document.getElementById('leap-game-feedback-box');
  const leapNextBtn = document.getElementById('leap-game-next-btn');

  const leapSummaryScore = document.getElementById('leap-summary-score');
  const leapSummaryStreak = document.getElementById('leap-summary-streak');
  const leapSummaryWrongList = document.getElementById('leap-summary-wrong-list');
  const leapRestartBtn = document.getElementById('leap-game-restart-btn');

  function pickRandomYear2000to2040() {
    return Math.floor(Math.random() * (2040 - 2000 + 1)) + 2000;
  }

  function getNextLeapGameYear() {
    let year;
    for (let attempts = 0; attempts < 100; attempts++) {
      year = pickRandomYear2000to2040();
      // Rules:
      // 1. Same year must not appear twice in the same game
      // 2. First round year must not match previous game's first round year
      if (leapGameYearsInCurrentGame.includes(year)) continue;
      if (leapCurrentRound === 0 && leapPreviousGameFirstYear && year === leapPreviousGameFirstYear) continue;
      break;
    }
    leapGameYearsInCurrentGame.push(year);
    if (leapCurrentRound === 0) {
      leapPreviousGameFirstYear = year;
    }
    return year;
  }

  function renderLeapGameRound() {
    leapCurrentYear = getNextLeapGameYear();

    leapCounter.textContent = `Round ${leapCurrentRound + 1} of 5`;
    leapScoreBadge.textContent = `Score: ${leapGameScore} / 5`;
    leapStreakBadge.textContent = `🔥 Streak: ${leapCurrentStreak}`;
    leapProgressFill.style.width = `${((leapCurrentRound + 1) / 5) * 100}%`;

    leapYearDisplay.textContent = leapCurrentYear;

    leapYesBtn.disabled = false;
    leapNoBtn.disabled = false;
    leapFeedbackBox.innerHTML = '';
    leapNextBtn.style.display = 'none';
  }

  function handleLeapUserAnswer(userAnsweredLeap) {
    leapYesBtn.disabled = true;
    leapNoBtn.disabled = true;

    const actualIsLeap = isLeapYear(leapCurrentYear);
    const isCorrect = userAnsweredLeap === actualIsLeap;

    let explanationText = '';
    if (actualIsLeap) {
      explanationText = `${leapCurrentYear} divided by 4 = ${leapCurrentYear / 4}, so it is a leap year!`;
    } else {
      explanationText = `${leapCurrentYear} divided by 4 leaves a remainder, so it is not a leap year.`;
    }

    if (isCorrect) {
      leapGameScore++;
      leapCurrentStreak++;
      if (leapCurrentStreak > leapBestStreak) {
        leapBestStreak = leapCurrentStreak;
      }
      leapFeedbackBox.className = 'game-feedback feedback-correct';
      leapFeedbackBox.innerHTML = `
        <div style="color: var(--success-green); padding: 8px; background: var(--success-bg); border-radius: 6px;">
          🎯 <strong>Correct!</strong> ${explanationText}
        </div>
      `;
    } else {
      leapCurrentStreak = 0;
      leapGameWrongAnswers.push({
        year: leapCurrentYear,
        actualIsLeap: actualIsLeap,
        userAnsweredLeap: userAnsweredLeap,
        explanation: explanationText
      });

      leapFeedbackBox.className = 'game-feedback feedback-incorrect';
      leapFeedbackBox.innerHTML = `
        <div style="color: var(--error-red); padding: 8px; background: var(--error-bg); border-radius: 6px;">
          ❌ <strong>Not quite!</strong> ${explanationText}
        </div>
      `;
    }

    leapScoreBadge.textContent = `Score: ${leapGameScore} / 5`;
    leapStreakBadge.textContent = `🔥 Streak: ${leapCurrentStreak}`;

    if (leapCurrentRound === 4) {
      leapNextBtn.textContent = 'View Final Results 🏆';
    } else {
      leapNextBtn.textContent = 'Next Year ▶';
    }
    leapNextBtn.style.display = 'inline-flex';
  }

  leapYesBtn.addEventListener('click', () => handleLeapUserAnswer(true));
  leapNoBtn.addEventListener('click', () => handleLeapUserAnswer(false));

  leapNextBtn.addEventListener('click', () => {
    if (leapCurrentRound < 4) {
      leapCurrentRound++;
      renderLeapGameRound();
    } else {
      showLeapGameSummary();
    }
  });

  function showLeapGameSummary() {
    leapActiveCard.style.display = 'none';
    leapSummaryCard.style.display = 'block';

    leapSummaryScore.textContent = `Final Score: ${leapGameScore} out of 5`;
    leapSummaryStreak.textContent = `🔥 Best Streak: ${leapBestStreak} in a row`;

    if (leapGameWrongAnswers.length === 0) {
      leapSummaryWrongList.innerHTML = `
        <p style="color: var(--success-green); font-weight: bold; text-align: center;">
          🎉 Flawless! You correctly identified all 5 years!
        </p>
      `;
    } else {
      let html = '';
      leapGameWrongAnswers.forEach(item => {
        html += `
          <div class="review-item review-incorrect" style="margin-bottom: 10px;">
            <div class="review-q-num">Year ${item.year}</div>
            <div class="review-q-title">You said: <strong>${item.userAnsweredLeap ? 'Leap Year' : 'Not a Leap Year'}</strong></div>
            <div class="review-correct-ans">Correct: ${item.actualIsLeap ? 'Is a Leap Year' : 'Not a Leap Year'}</div>
            <div class="review-explanation"><strong>Explanation:</strong> ${item.explanation}</div>
          </div>
        `;
      });
      leapSummaryWrongList.innerHTML = html;
    }
  }

  function restartLeapGame() {
    leapCurrentRound = 0;
    leapGameScore = 0;
    leapCurrentStreak = 0;
    leapGameWrongAnswers = [];
    leapGameYearsInCurrentGame = [];

    leapActiveCard.style.display = 'block';
    leapSummaryCard.style.display = 'none';

    renderLeapGameRound();
  }

  leapRestartBtn.addEventListener('click', restartLeapGame);

  // Initialize mini-game
  renderLeapGameRound();


  /* ==========================================================================
     5. SECTION 3: PRACTICE CASES & DIAGNOSTIC FEEDBACK
     ========================================================================== */

  // State tracking across rounds to prevent duplicate dates on consecutive rounds
  let previousRoundPracticeRanges = {}; // maps caseId -> date key string
  let currentRoundPracticeRanges = {};

  let currentPracticeIndex = 0; // 0 to 9 for cases 1 to 10
  let currentPracticeProblem = null;
  let practiceScore = 0;
  let practiceWrongCases = [];
  let misconceptionCounts = {
    'Assuming every month has 30 days': 0,
    'Forgetting February has 28 days in 2026': 0,
    'Off-by-one error (start-date counting)': 0
  };

  const practiceActiveCard = document.getElementById('practice-active-card');
  const practiceSummaryCard = document.getElementById('practice-summary-card');
  const practiceCounter = document.getElementById('practice-counter');
  const practiceScoreLive = document.getElementById('practice-score-live');
  const practiceProgressFill = document.getElementById('practice-progress-fill');
  const practiceCategoryBadge = document.getElementById('practice-category-badge');
  const practiceProblemText = document.getElementById('practice-problem-text');

  const practiceSingleInputGroup = document.getElementById('practice-single-input-group');
  const practiceDualInputGroup = document.getElementById('practice-dual-input-group');
  const practiceAnswerInput = document.getElementById('practice-answer-input');
  const practiceDaysInput = document.getElementById('practice-days-input');
  const practiceHoursInput = document.getElementById('practice-hours-input');
  const practiceUnitLabel = document.getElementById('practice-unit-label');

  const practiceSubmitBtn = document.getElementById('practice-submit-btn');
  const practiceDualSubmitBtn = document.getElementById('practice-dual-submit-btn');
  const practiceHintBtn = document.getElementById('practice-hint-btn');
  const practiceNextBtn = document.getElementById('practice-next-btn');

  const practiceHintBox = document.getElementById('practice-hint-box');
  const practiceHintText = document.getElementById('practice-hint-text');
  const practiceFeedbackBox = document.getElementById('practice-feedback-box');

  const practiceSummaryScore = document.getElementById('practice-summary-score');
  const practiceSummaryMisconception = document.getElementById('practice-summary-misconception');
  const practiceWrongCasesList = document.getElementById('practice-wrong-cases-list');
  const practiceRestartBtn = document.getElementById('practice-restart-btn');

  /**
   * Helper to ensure dates do not repeat on consecutive rounds for a case ID
   */
  function generateNonRepeating2026Range(caseId, generatorFunc) {
    const prevKey = previousRoundPracticeRanges[caseId];
    let candidate;
    for (let i = 0; i < 50; i++) {
      candidate = generatorFunc();
      const candidateKey = `${candidate.startDateStr}_${candidate.endDateStr}`;
      if (candidateKey !== prevKey) {
        currentRoundPracticeRanges[caseId] = candidateKey;
        return candidate;
      }
    }
    currentRoundPracticeRanges[caseId] = `${candidate.startDateStr}_${candidate.endDateStr}`;
    return candidate;
  }

  /**
   * Factory function to dynamically generate random 2026 practice cases in 10 fixed types.
   */
  function createPracticeProblem(caseNum) {
    let range, startObj, endObj, includeStart, correctAnswer, hint, explanation, category, text, unit;
    let isDualInput = false;
    let dualCorrectDays = 0;
    let dualCorrectHours = 0;

    switch (caseNum) {
      case 1: { // Case 1: Same month duration (do not count start date)
        category = 'Case 1: Same Month (Exclusive)';
        unit = 'days';
        includeStart = false;
        range = generateNonRepeating2026Range(1, () => generateRandom2026DateRange('sameMonth', 3, 20));
        startObj = range.startObj;
        endObj = range.endObj;
        correctAnswer = calculateDurationDays(startObj, endObj, false);
        text = `A detective training camp runs from ${formatUTCDate(startObj)} to ${formatUTCDate(endObj)}. How many days long is the camp? (Do not count the start date).`;
        hint = `Since both dates are in ${MONTH_NAMES[startObj.getUTCMonth()]}, simply subtract the start day from the end day: ${endObj.getUTCDate()} - ${startObj.getUTCDate()}.`;
        explanation = `${endObj.getUTCDate()} - ${startObj.getUTCDate()} = ${correctAnswer} days.`;
        break;
      }
      case 2: { // Case 2: Same month, INCLUDE start date
        category = 'Case 2: Same Month (Inclusive)';
        unit = 'days';
        includeStart = true;
        range = generateNonRepeating2026Range(2, () => generateRandom2026DateRange('sameMonth', 3, 20));
        startObj = range.startObj;
        endObj = range.endObj;
        correctAnswer = calculateDurationDays(startObj, endObj, true);
        text = `A museum pass is valid from ${formatUTCDate(startObj)} to ${formatUTCDate(endObj)}. The instructions say to INCLUDE the start date. How many days is the pass valid?`;
        hint = `When counting INCLUSIVE of both start and end days, subtract the days and add 1: (${endObj.getUTCDate()} - ${startObj.getUTCDate()}) + 1.`;
        explanation = `(${endObj.getUTCDate()} - ${startObj.getUTCDate()}) + 1 = ${correctAnswer} days.`;
        break;
      }
      case 3: { // Case 3: Across two months, first month has 30 days
        category = 'Case 3: Two Months (First Month = 30 Days)';
        unit = 'days';
        includeStart = false;
        range = generateNonRepeating2026Range(3, () => generateRandom2026DateRange('month30', 5, 25));
        startObj = range.startObj;
        endObj = range.endObj;
        correctAnswer = calculateDurationDays(startObj, endObj, false);
        const m1Name = MONTH_NAMES[startObj.getUTCMonth()];
        const m2Name = MONTH_NAMES[endObj.getUTCMonth()];
        const m1DaysLeft = 30 - startObj.getUTCDate();
        text = `A mystery investigation starts on ${formatUTCDate(startObj)} and ends on ${formatUTCDate(endObj)}. Note that ${m1Name} has 30 days. How many days is the investigation? (Do not count start date).`;
        hint = `${m1Name} has 30 days. Step 1: ${30} - ${startObj.getUTCDate()} = ${m1DaysLeft} days left in ${m1Name}. Step 2: Add ${endObj.getUTCDate()} days in ${m2Name}.`;
        explanation = `Days remaining in ${m1Name} (30 - ${startObj.getUTCDate()} = ${m1DaysLeft}) + days in ${m2Name} (${endObj.getUTCDate()}) = ${correctAnswer} days.`;
        break;
      }
      case 4: { // Case 4: Across two months, first month has 31 days
        category = 'Case 4: Two Months (First Month = 31 Days)';
        unit = 'days';
        includeStart = false;
        range = generateNonRepeating2026Range(4, () => generateRandom2026DateRange('month31', 5, 25));
        startObj = range.startObj;
        endObj = range.endObj;
        correctAnswer = calculateDurationDays(startObj, endObj, false);
        const m1Name = MONTH_NAMES[startObj.getUTCMonth()];
        const m2Name = MONTH_NAMES[endObj.getUTCMonth()];
        const m1DaysLeft = 31 - startObj.getUTCDate();
        text = `A science fair project starts on ${formatUTCDate(startObj)} and finishes on ${formatUTCDate(endObj)}. Note that ${m1Name} has 31 days. How many days long is the project? (Exclude start date).`;
        hint = `${m1Name} has 31 days. Step 1: 31 - ${startObj.getUTCDate()} = ${m1DaysLeft} days left in ${m1Name}. Step 2: Add ${endObj.getUTCDate()} days in ${m2Name}.`;
        explanation = `Days remaining in ${m1Name} (31 - ${startObj.getUTCDate()} = ${m1DaysLeft}) + days in ${m2Name} (${endObj.getUTCDate()}) = ${correctAnswer} days.`;
        break;
      }
      case 5: { // Case 5: January into February 2026 (Feb has 28 days)
        category = 'Case 5: January to February 2026';
        unit = 'days';
        includeStart = false;
        range = generateNonRepeating2026Range(5, () => {
          const janDay = Math.floor(Math.random() * 15) + 12; // Jan 12 to 26
          const febDay = Math.floor(Math.random() * 20) + 4;  // Feb 4 to 23
          const s = new Date(Date.UTC(2026, 0, janDay));
          const e = new Date(Date.UTC(2026, 1, febDay));
          return { startObj: s, endObj: e, startDateStr: toISOUTCDateString(s), endDateStr: toISOUTCDateString(e) };
        });
        startObj = range.startObj;
        endObj = range.endObj;
        correctAnswer = calculateDurationDays(startObj, endObj, false);
        const janDaysLeft = 31 - startObj.getUTCDate();
        text = `A winter mission starts on ${formatUTCDate(startObj)} and finishes on ${formatUTCDate(endObj)}. How many days does it last? (Exclude start date).`;
        hint = `January has 31 days. Calculate days left in January (31 - ${startObj.getUTCDate()} = ${janDaysLeft}), then add ${endObj.getUTCDate()} days in February.`;
        explanation = `January days (31 - ${startObj.getUTCDate()} = ${janDaysLeft}) + February days (${endObj.getUTCDate()}) = ${correctAnswer} days.`;
        break;
      }
      case 6: { // Case 6: February into March 2026
        category = 'Case 6: February to March 2026';
        unit = 'days';
        includeStart = false;
        range = generateNonRepeating2026Range(6, () => {
          const febDay = Math.floor(Math.random() * 18) + 8; // Feb 8 to 25
          const marDay = Math.floor(Math.random() * 20) + 4; // Mar 4 to 23
          const s = new Date(Date.UTC(2026, 1, febDay));
          const e = new Date(Date.UTC(2026, 2, marDay));
          return { startObj: s, endObj: e, startDateStr: toISOUTCDateString(s), endDateStr: toISOUTCDateString(e) };
        });
        startObj = range.startObj;
        endObj = range.endObj;
        correctAnswer = calculateDurationDays(startObj, endObj, false);
        const febDaysLeft = 28 - startObj.getUTCDate();
        text = `A detective workshop starts on ${formatUTCDate(startObj)} and ends on ${formatUTCDate(endObj)}. Remember, 2026 is NOT a leap year, so February has 28 days! How many days long is the workshop? (Exclude start date).`;
        hint = `2026 is a normal year (February has 28 days!). Calculate 28 - ${startObj.getUTCDate()} = ${febDaysLeft} days left in February, plus ${endObj.getUTCDate()} days in March.`;
        explanation = `February days (28 - ${startObj.getUTCDate()} = ${febDaysLeft}) + March days (${endObj.getUTCDate()}) = ${correctAnswer} days.`;
        break;
      }
      case 7: { // Case 7: Spanning three months
        category = 'Case 7: Across Three Months';
        unit = 'days';
        includeStart = false;
        range = generateNonRepeating2026Range(7, () => {
          const startMonth = Math.floor(Math.random() * 8); // Jan to Aug
          const startDay = Math.floor(Math.random() * 15) + 12;
          const endMonth = startMonth + 2;
          const endDay = Math.floor(Math.random() * 15) + 5;
          const s = new Date(Date.UTC(2026, startMonth, startDay));
          const e = new Date(Date.UTC(2026, endMonth, endDay));
          return { startObj: s, endObj: e, startDateStr: toISOUTCDateString(s), endDateStr: toISOUTCDateString(e) };
        });
        startObj = range.startObj;
        endObj = range.endObj;
        correctAnswer = calculateDurationDays(startObj, endObj, false);
        const breakdown = generateStepBreakdown(startObj, endObj, false);
        text = `A detective summer expedition starts on ${formatUTCDate(startObj)} and ends on ${formatUTCDate(endObj)}. How many total days does the expedition last? (Exclude start date).`;
        hint = `Break it down into 3 steps: 1) Days left in ${MONTH_NAMES[startObj.getUTCMonth()]}, 2) Full middle month of ${MONTH_NAMES[startObj.getUTCMonth()+1]} (${getDaysInMonth(2026, startObj.getUTCMonth()+1)} days), 3) Days in ${MONTH_NAMES[endObj.getUTCMonth()]}.`;
        explanation = breakdown.steps.map((s, i) => `Step ${i + 1}: ${s.label} (${s.days} days)`).join(' + ') + ` = ${correctAnswer} total days.`;
        break;
      }
      case 8: { // Case 8: Duration in days and hours -> convert to total hours
        category = 'Case 8: Days & Hours to Total Hours';
        unit = 'hours';
        const days = Math.floor(Math.random() * 4) + 2;
        const hours = Math.floor(Math.random() * 15) + 1;
        correctAnswer = days * 24 + hours;
        text = `A secret code decoding challenge takes ${days} days and ${hours} hours. How many total hours did the challenge take?`;
        hint = `1 day = 24 hours. First multiply ${days} × 24 = ${days * 24} hours. Then add the extra ${hours} hours.`;
        explanation = `${days} days × 24 = ${days * 24} hours. Adding ${hours} hours = ${correctAnswer} hours total.`;
        break;
      }
      case 9: { // Case 9: Convert hours back to days and hours
        category = 'Case 9: Total Hours to Days & Hours';
        unit = 'days and hours';
        isDualInput = true;
        dualCorrectDays = Math.floor(Math.random() * 4) + 2;
        dualCorrectHours = Math.floor(Math.random() * 20) + 1;
        const totalHours = dualCorrectDays * 24 + dualCorrectHours;
        correctAnswer = totalHours; // internal total tracking
        text = `A mystery satellite signal broadcast lasted for ${totalHours} total hours. Convert this into days and hours.`;
        hint = `Divide ${totalHours} by 24 to find full days: ${totalHours} ÷ 24 = ${dualCorrectDays} days with a remainder of ${dualCorrectHours} hours.`;
        explanation = `${totalHours} ÷ 24 = ${dualCorrectDays} full days (${dualCorrectDays * 24} hours) with ${dualCorrectHours} hours remaining.`;
        break;
      }
      case 10:
      default: { // Case 10: Mixed challenge question
        category = 'Case 10: Mixed Challenge Question';
        unit = 'days';
        includeStart = false;
        range = generateNonRepeating2026Range(10, () => generateRandom2026DateRange('any', 15, 50));
        startObj = range.startObj;
        endObj = range.endObj;
        correctAnswer = calculateDurationDays(startObj, endObj, false);
        const breakdown = generateStepBreakdown(startObj, endObj, false);
        text = `FINAL CASE: A top-secret master detective trial runs from ${formatUTCDate(startObj)} to ${formatUTCDate(endObj)}. Calculate the exact total duration in days. (Exclude start date).`;
        hint = `Break down each month: ${breakdown.steps.map(s => `${s.label} (${s.days} days)`).join(' + ')}.`;
        explanation = breakdown.steps.map((s, i) => `Step ${i + 1}: ${s.label} = ${s.days} days`).join('. ') + `. Total = ${correctAnswer} days.`;
        break;
      }
    }

    return {
      caseNum,
      category,
      text,
      startDate: startObj ? toISOUTCDateString(startObj) : null,
      endDate: endObj ? toISOUTCDateString(endObj) : null,
      includeStart,
      correctAnswer,
      isDualInput,
      dualCorrectDays,
      dualCorrectHours,
      unit,
      hint,
      explanation
    };
  }

  function renderPracticeCase() {
    currentPracticeProblem = createPracticeProblem(currentPracticeIndex + 1);
    const prob = currentPracticeProblem;

    practiceCounter.textContent = `Case ${currentPracticeIndex + 1} of 10`;
    practiceScoreLive.textContent = `Score: ${practiceScore} / 10`;
    practiceProgressFill.style.width = `${((currentPracticeIndex + 1) / 10) * 100}%`;
    practiceCategoryBadge.textContent = prob.category;
    practiceProblemText.textContent = prob.text;

    if (prob.isDualInput) {
      practiceSingleInputGroup.style.display = 'none';
      practiceDualInputGroup.style.display = 'flex';
      practiceDaysInput.value = '';
      practiceHoursInput.value = '';
    } else {
      practiceSingleInputGroup.style.display = 'flex';
      practiceDualInputGroup.style.display = 'none';
      practiceAnswerInput.value = '';
      practiceUnitLabel.textContent = prob.unit;
    }

    practiceHintBox.style.display = 'none';
    practiceFeedbackBox.style.display = 'none';
    practiceNextBtn.style.display = 'none';
  }

  /**
   * Diagnostic Misconception Detection Engine for 2026 Practice Cases
   */
  function diagnosePracticeMisconception(prob, userVal, userDays, userHours) {
    if (prob.isDualInput) {
      const isCorrect = userDays === prob.dualCorrectDays && userHours === prob.dualCorrectHours;
      if (isCorrect) {
        return {
          isCorrect: true,
          misconceptionType: null,
          title: '🎉 Outstanding Detective Work!',
          message: prob.explanation
        };
      }
      return {
        isCorrect: false,
        misconceptionType: null,
        title: '❌ Case Needs Re-investigation!',
        message: `You answered ${userDays} days and ${userHours} hours. <br>💡 <strong>Correct Answer:</strong> ${prob.dualCorrectDays} days and ${prob.dualCorrectHours} hours.<br><strong>Working:</strong> ${prob.explanation}`
      };
    }

    const correct = prob.correctAnswer;
    if (userVal === correct) {
      return {
        isCorrect: true,
        misconceptionType: null,
        title: '🎉 Outstanding Detective Work!',
        message: prob.explanation
      };
    }

    let detectedType = null;
    let diagnosticMsg = '';

    // Misconception 1: Assuming 30 days per month
    if (prob.startDate && prob.endDate) {
      const sObj = parseUTCDate(prob.startDate);
      const eObj = parseUTCDate(prob.endDate);
      const sMonthDays = getDaysInMonth(2026, sObj.getUTCFullYear() === 2026 ? sObj.getUTCMonth() : 0);

      if (sMonthDays !== 30) {
        const startDay = sObj.getUTCDate();
        const endDay = eObj.getUTCDate();
        const assumed30Val = (30 - startDay) + endDay + (prob.includeStart ? 1 : 0);

        if (userVal === assumed30Val) {
          detectedType = 'Assuming every month has 30 days';
          diagnosticMsg = `
            🔎 <strong>Misconception Detected: Assuming every month has 30 days!</strong><br>
            You likely assumed ${MONTH_NAMES[sObj.getUTCMonth()]} has 30 days. But ${MONTH_NAMES[sObj.getUTCMonth()]} actually has <strong>${sMonthDays} days</strong>!
          `;
        }
      }
    }

    // Misconception 2: Forgetting February has 28 days in 2026
    if (!detectedType && prob.startDate && prob.endDate) {
      const sObj = parseUTCDate(prob.startDate);
      if (sObj.getUTCMonth() === 1) { // Feb
        const startDay = sObj.getUTCDate();
        const eObj = parseUTCDate(prob.endDate);
        const endDay = eObj.getUTCDate();
        const assumed29Val = (29 - startDay) + endDay + (prob.includeStart ? 1 : 0);

        if (userVal === assumed29Val) {
          detectedType = 'Forgetting February has 28 days in 2026';
          diagnosticMsg = `
            🔎 <strong>Misconception Detected: Forgetting February has 28 days!</strong><br>
            You calculated February as if it had 29 days! Remember: <strong>2026 is NOT a leap year</strong>, so February has 28 days!
          `;
        }
      }
    }

    // Misconception 3: Off-by-one error (start-date counting)
    if (!detectedType) {
      if (!prob.includeStart && userVal === correct + 1) {
        detectedType = 'Off-by-one error (start-date counting)';
        diagnosticMsg = `
          🔎 <strong>Misconception Detected: Off by 1 (Counted start date by mistake)!</strong><br>
          You added 1 extra day by including the start date. Standard duration excludes the start date!
        `;
      } else if (prob.includeStart && userVal === correct - 1) {
        detectedType = 'Off-by-one error (start-date counting)';
        diagnosticMsg = `
          🔎 <strong>Misconception Detected: Off by 1 (Forgot to include start date)!</strong><br>
          The question specifically asked to INCLUDE the start date, so you need to add 1 to your result!
        `;
      } else if (userVal === correct - 1 || userVal === correct + 1) {
        detectedType = 'Off-by-one error (start-date counting)';
        diagnosticMsg = `
          🔎 <strong>Misconception Detected: Off-by-one error!</strong><br>
          Your calculation was off by exactly 1 day. Check whether you counted the start day or step counts correctly!
        `;
      }
    }

    if (!detectedType) {
      diagnosticMsg = `
        🔎 <strong>Detective Clue:</strong> Double check your month lengths and step addition!
      `;
    }

    return {
      isCorrect: false,
      misconceptionType: detectedType,
      title: '❌ Case Needs Re-investigation!',
      message: `${diagnosticMsg}<br><br>💡 <strong>Step-by-Step Solution:</strong> ${prob.explanation}`
    };
  }

  function handlePracticeSubmit(userVal, userDays, userHours) {
    const prob = currentPracticeProblem;
    const res = diagnosePracticeMisconception(prob, userVal, userDays, userHours);

    if (res.isCorrect) {
      practiceScore++;
      practiceScoreLive.textContent = `Score: ${practiceScore} / 10`;
    } else {
      practiceWrongCases.push({
        caseNum: prob.caseNum,
        category: prob.category,
        text: prob.text,
        userAnswerStr: prob.isDualInput ? `${userDays} days ${userHours} hours` : `${userVal} ${prob.unit}`,
        correctAnswerStr: prob.isDualInput ? `${prob.dualCorrectDays} days ${prob.dualCorrectHours} hours` : `${prob.correctAnswer} ${prob.unit}`,
        explanation: prob.explanation,
        misconception: res.misconceptionType
      });

      if (res.misconceptionType && misconceptionCounts.hasOwnProperty(res.misconceptionType)) {
        misconceptionCounts[res.misconceptionType]++;
      }
    }

    practiceFeedbackBox.className = `feedback-box ${res.isCorrect ? 'feedback-correct' : 'feedback-incorrect'}`;
    practiceFeedbackBox.innerHTML = `
      <div class="feedback-diagnostic-title">${res.title}</div>
      <div>${res.message}</div>
    `;
    practiceFeedbackBox.style.display = 'block';

    if (currentPracticeIndex === 9) {
      practiceNextBtn.textContent = 'View Practice Summary 🏆';
    } else {
      practiceNextBtn.textContent = 'Next Case ▶';
    }
    practiceNextBtn.style.display = 'inline-flex';
  }

  practiceSubmitBtn.addEventListener('click', () => {
    const val = parseInt(practiceAnswerInput.value, 10);
    if (isNaN(val)) {
      practiceFeedbackBox.className = 'feedback-box feedback-incorrect';
      practiceFeedbackBox.innerHTML = '⚠️ Please enter a number answer!';
      practiceFeedbackBox.style.display = 'block';
      return;
    }
    handlePracticeSubmit(val, null, null);
  });

  practiceDualSubmitBtn.addEventListener('click', () => {
    const dVal = parseInt(practiceDaysInput.value, 10);
    const hVal = parseInt(practiceHoursInput.value, 10);
    if (isNaN(dVal) || isNaN(hVal)) {
      practiceFeedbackBox.className = 'feedback-box feedback-incorrect';
      practiceFeedbackBox.innerHTML = '⚠️ Please enter numbers for both days and hours!';
      practiceFeedbackBox.style.display = 'block';
      return;
    }
    handlePracticeSubmit(null, dVal, hVal);
  });

  practiceHintBtn.addEventListener('click', () => {
    practiceHintText.textContent = currentPracticeProblem.hint;
    practiceHintBox.style.display = 'block';
  });

  practiceNextBtn.addEventListener('click', () => {
    if (currentPracticeIndex < 9) {
      currentPracticeIndex++;
      renderPracticeCase();
    } else {
      showPracticeSummary();
    }
  });

  function showPracticeSummary() {
    practiceActiveCard.style.display = 'none';
    practiceSummaryCard.style.display = 'block';

    practiceSummaryScore.textContent = `Final Score: ${practiceScore} out of 10`;

    // Find most frequent misconception
    let maxCount = 0;
    let dominantMisconception = null;
    for (const [mType, count] of Object.entries(misconceptionCounts)) {
      if (count > maxCount) {
        maxCount = count;
        dominantMisconception = mType;
      }
    }

    if (dominantMisconception && maxCount > 0) {
      practiceSummaryMisconception.innerHTML = `
        <strong>🔎 Key Misconception Spotlight:</strong><br>
        The misconception you encountered most was: <strong>"${dominantMisconception}"</strong> (${maxCount} time${maxCount > 1 ? 's' : ''}).<br>
        <span class="help-text">Review the cases below to lock in the correct calculation strategy!</span>
      `;
      practiceSummaryMisconception.style.display = 'block';
    } else if (practiceWrongCases.length > 0) {
      practiceSummaryMisconception.innerHTML = `
        <strong>🔎 Diagnostic Summary:</strong> You had a few minor errors, but no persistent misconception trend detected! Great effort!
      `;
      practiceSummaryMisconception.style.display = 'block';
    } else {
      practiceSummaryMisconception.innerHTML = `
        <strong>🌟 Flawless Detective Work!</strong> You solved all 10 cases without any misconceptions! Outstanding!
      `;
      practiceSummaryMisconception.style.display = 'block';
    }

    // Build wrong cases review
    if (practiceWrongCases.length === 0) {
      practiceWrongCasesList.innerHTML = '<p style="color: var(--success-green); font-weight: bold;">🎉 No wrong cases to re-investigate! Perfect score!</p>';
    } else {
      let html = '';
      practiceWrongCases.forEach(item => {
        html += `
          <div class="review-item review-incorrect" style="margin-bottom: 12px;">
            <div class="review-q-num">Case ${item.caseNum}: ${item.category}</div>
            <div class="review-q-title">${item.text}</div>
            <div class="review-user-ans">Your Answer: <span style="color: var(--error-red);">${item.userAnswerStr}</span></div>
            <div class="review-correct-ans">Correct Answer: ${item.correctAnswerStr}</div>
            ${item.misconception ? `<div style="font-size: 0.88rem; color: #b45309; margin-bottom: 6px;">🔎 Misconception: <strong>${item.misconception}</strong></div>` : ''}
            <div class="review-explanation"><strong>Step-by-step:</strong> ${item.explanation}</div>
          </div>
        `;
      });
      practiceWrongCasesList.innerHTML = html;
    }
  }

  function restartPractice() {
    // Transfer current round ranges to previousRoundPracticeRanges so dates don't repeat on consecutive rounds
    previousRoundPracticeRanges = { ...currentRoundPracticeRanges };
    currentRoundPracticeRanges = {};

    currentPracticeIndex = 0;
    practiceScore = 0;
    practiceWrongCases = [];
    misconceptionCounts = {
      'Assuming every month has 30 days': 0,
      'Forgetting February has 28 days in 2026': 0,
      'Off-by-one error (start-date counting)': 0
    };

    practiceActiveCard.style.display = 'block';
    practiceSummaryCard.style.display = 'none';

    renderPracticeCase();
  }

  practiceRestartBtn.addEventListener('click', restartPractice);

  // Initialize Section 3 Practice
  renderPracticeCase();


  /* ==========================================================================
     6. SECTION 4: CHALLENGE QUIZ CONTROLLER
     ========================================================================== */

  /**
   * Helper function to build 4 distinct MCQ option choices with 1 correct answer.
   */
  function buildMCQOptions(correctVal, unit = 'days') {
    const distractors = new Set();
    distractors.add(correctVal);

    const candidates = [
      correctVal - 1,
      correctVal + 1,
      correctVal - 2,
      correctVal + 2,
      correctVal + 10,
      correctVal - 10
    ];

    for (let c of candidates) {
      if (c > 0 && !distractors.has(c)) {
        distractors.add(c);
      }
      if (distractors.size === 4) break;
    }

    const arr = Array.from(distractors);
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }

    const options = arr.map(v => `${v} ${unit}`);
    const correctIndex = options.indexOf(`${correctVal} ${unit}`);

    return { options, correctIndex };
  }

  /**
   * Generator function to create fresh random 2026 quiz questions.
   */
  function generateQuizQuestions() {
    const questions = [];

    // Question 1: Month length
    questions.push({
      q: 'How many days are there in April?',
      options: ['28 days', '29 days', '30 days', '31 days'],
      correctIndex: 2,
      working: 'Remember the rhyme: "30 days has September, April, June, and November". April has exactly 30 days.'
    });

    // Question 2: Leap year identification (mix of years: 2024, 2025, 2026, 2027, 2028)
    const yearOptions = ['2025', '2026', '2027', '2028'];
    for (let i = yearOptions.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [yearOptions[i], yearOptions[j]] = [yearOptions[j], yearOptions[i]];
    }
    const leapIdx = yearOptions.indexOf('2028');
    questions.push({
      q: 'Which of the following years IS a leap year?',
      options: yearOptions,
      correctIndex: leapIdx,
      working: '2028 is divisible by 4 (2028 ÷ 4 = 507). 2026 and 2027 are not leap years!'
    });

    // Question 3: Leap year February length
    questions.push({
      q: 'How many days does February have in a leap year like 2024 or 2028?',
      options: ['28 days', '29 days', '30 days', '31 days'],
      correctIndex: 1,
      working: 'In a leap year, February gets 1 extra leap day, making it 29 days long.'
    });

    // Question 4: 2026 Duration Problem (Same month)
    {
      const range = generateRandom2026DateRange('sameMonth', 5, 25);
      const startObj = range.startObj;
      const endObj = range.endObj;
      const ans = calculateDurationDays(startObj, endObj, false);
      const { options, correctIndex } = buildMCQOptions(ans, 'days');
      questions.push({
        q: `A trip starts on ${formatUTCDate(startObj)} and ends on ${formatUTCDate(endObj)}. How many days long is the trip? (Standard exclusive counting).`,
        options,
        correctIndex,
        working: `${endObj.getUTCDate()} - ${startObj.getUTCDate()} = ${ans} days.`
      });
    }

    // Question 5: 2026 Duration Problem (Cross-month)
    {
      const range = generateRandom2026DateRange('month30', 5, 35);
      const startObj = range.startObj;
      const endObj = range.endObj;
      const ans = calculateDurationDays(startObj, endObj, false);
      const { options, correctIndex } = buildMCQOptions(ans, 'days');
      const breakdown = generateStepBreakdown(startObj, endObj, false);
      const stepsStr = breakdown.steps.map(s => `${s.label}: ${s.days} days`).join(' + ');
      questions.push({
        q: `A summer camp starts on ${formatUTCDate(startObj)} and ends on ${formatUTCDate(endObj)}. How many days is the camp? (Exclude start day).`,
        options,
        correctIndex,
        working: `Breakdown by month: ${stepsStr} = ${ans} days total.`
      });
    }

    // Question 6: Month length (31-day month)
    questions.push({
      q: 'How many days are in October?',
      options: ['28 days', '29 days', '30 days', '31 days'],
      correctIndex: 3,
      working: 'October is not in the 30-day group (Sept, Apr, June, Nov). So October has 31 days.'
    });

    // Question 7: 2026 February Duration Problem
    {
      const range = generateRandom2026DateRange('february', 5, 30);
      const startObj = range.startObj;
      const endObj = range.endObj;
      const ans = calculateDurationDays(startObj, endObj, false);
      const { options, correctIndex } = buildMCQOptions(ans, 'days');
      const breakdown = generateStepBreakdown(startObj, endObj, false);
      const stepsStr = breakdown.steps.map(s => `${s.label}: ${s.days} days`).join(' + ');
      questions.push({
        q: `A school project runs from ${formatUTCDate(startObj)} to ${formatUTCDate(endObj)}. How many days is it? (Note: 2026 is NOT a leap year!).`,
        options,
        correctIndex,
        working: `Because 2026 is not a leap year, February has 28 days. Breakdown: ${stepsStr} = ${ans} days.`
      });
    }

    // Question 8: 2026 Multi-Month Duration Problem
    {
      const range = generateRandom2026DateRange('multiMonth', 35, 60);
      const startObj = range.startObj;
      const endObj = range.endObj;
      const ans = calculateDurationDays(startObj, endObj, false);
      const { options, correctIndex } = buildMCQOptions(ans, 'days');
      const breakdown = generateStepBreakdown(startObj, endObj, false);
      const stepsStr = breakdown.steps.map(s => `${s.label}: ${s.days} days`).join(' + ');
      questions.push({
        q: `A detective badge quest runs from ${formatUTCDate(startObj)} to ${formatUTCDate(endObj)}. How many days does it last? (Exclude start day).`,
        options,
        correctIndex,
        working: `Multi-month breakdown: ${stepsStr} = ${ans} days.`
      });
    }

    // Question 9: Hours to Days conversion
    {
      const days = Math.floor(Math.random() * 3) + 1;
      const hours = Math.floor(Math.random() * 12) + 4;
      const totalHours = days * 24 + hours;
      const { options, correctIndex } = buildMCQOptions(totalHours, 'hours');
      questions.push({
        q: `Convert ${days} day${days === 1 ? '' : 's'} and ${hours} hours into total hours.`,
        options,
        correctIndex,
        working: `${days} day${days === 1 ? '' : 's'} = ${days} × 24 = ${days * 24} hours. Adding ${hours} hours: ${days * 24} + ${hours} = ${totalHours} hours.`
      });
    }

    // Question 10: 2026 non-leap year February length
    questions.push({
      q: 'How many days does February have in the year 2026?',
      options: ['28 days', '29 days', '30 days', '31 days'],
      correctIndex: 0,
      working: '2026 is NOT divisible by 4 (2026 ÷ 4 = 506.5), so 2026 is not a leap year. February 2026 has 28 days.'
    });

    return questions;
  }

  let quizQuestions = [];
  let currentQuizIndex = 0;
  let quizScore = 0;
  let userQuizAnswers = [];

  const quizActiveContainer = document.getElementById('quiz-active-container');
  const quizResultsContainer = document.getElementById('quiz-results-container');
  const quizCurrentNumSpan = document.getElementById('quiz-current-num');
  const quizScoreLiveSpan = document.getElementById('quiz-score-live');
  const quizProgressFill = document.getElementById('quiz-progress-fill');
  const quizQuestionText = document.getElementById('quiz-question-text');
  const quizOptionsContainer = document.getElementById('quiz-options-container');
  const quizInlineFeedback = document.getElementById('quiz-inline-feedback');
  const quizNextBtn = document.getElementById('quiz-next-btn');

  const quizRestartBtn = document.getElementById('quiz-restart-btn');
  const resultsBadgeGraphic = document.getElementById('results-badge-graphic');
  const resultsStars = document.getElementById('results-stars');
  const resultsScoreText = document.getElementById('results-score-text');
  const resultsRankDesc = document.getElementById('results-rank-desc');
  const quizReviewList = document.getElementById('quiz-review-list');

  function startQuiz() {
    quizQuestions = generateQuizQuestions();
    currentQuizIndex = 0;
    quizScore = 0;
    userQuizAnswers = [];

    quizActiveContainer.style.display = 'block';
    quizResultsContainer.style.display = 'none';

    renderQuizQuestion();
  }

  function renderQuizQuestion() {
    const qData = quizQuestions[currentQuizIndex];

    quizCurrentNumSpan.textContent = currentQuizIndex + 1;
    quizScoreLiveSpan.textContent = `Score: ${quizScore}`;
    quizProgressFill.style.width = `${((currentQuizIndex + 1) / 10) * 100}%`;

    quizQuestionText.textContent = qData.q;
    quizOptionsContainer.innerHTML = '';
    quizInlineFeedback.style.display = 'none';
    quizNextBtn.style.display = 'none';

    qData.options.forEach((optText, optIdx) => {
      const btn = document.createElement('button');
      btn.className = 'quiz-option-btn';
      btn.innerHTML = `<span style="background: #e2e8f0; border-radius: 50%; width: 28px; height: 28px; display: inline-flex; align-items: center; justify-content: center; font-size: 0.9rem;">${String.fromCharCode(65 + optIdx)}</span> ${optText}`;

      btn.addEventListener('click', () => handleQuizOptionSelect(optIdx));
      quizOptionsContainer.appendChild(btn);
    });
  }

  function handleQuizOptionSelect(selectedIdx) {
    const qData = quizQuestions[currentQuizIndex];
    const buttons = quizOptionsContainer.querySelectorAll('.quiz-option-btn');

    // Disable all options
    buttons.forEach((btn, idx) => {
      btn.disabled = true;
      if (idx === qData.correctIndex) {
        btn.classList.add('selected-correct');
      } else if (idx === selectedIdx) {
        btn.classList.add('selected-incorrect');
      }
    });

    const isCorrect = selectedIdx === qData.correctIndex;
    if (isCorrect) quizScore++;

    userQuizAnswers.push({
      q: qData.q,
      selected: qData.options[selectedIdx],
      correct: qData.options[qData.correctIndex],
      isCorrect: isCorrect,
      working: qData.working
    });

    quizScoreLiveSpan.textContent = `Score: ${quizScore}`;

    quizInlineFeedback.style.display = 'block';
    if (isCorrect) {
      quizInlineFeedback.style.background = 'var(--success-bg)';
      quizInlineFeedback.style.color = '#14532d';
      quizInlineFeedback.innerHTML = '🎯 <strong>Correct!</strong> Great date detective work!';
    } else {
      quizInlineFeedback.style.background = 'var(--error-bg)';
      quizInlineFeedback.style.color = '#7f1d1d';
      quizInlineFeedback.innerHTML = `❌ <strong>Not quite.</strong> The correct answer was: <strong>${qData.options[qData.correctIndex]}</strong>`;
    }

    quizNextBtn.style.display = 'inline-flex';
    if (currentQuizIndex === 9) {
      quizNextBtn.textContent = 'View Final Results 🏆';
    } else {
      quizNextBtn.textContent = 'Next Question ▶';
    }
  }

  quizNextBtn.addEventListener('click', () => {
    if (currentQuizIndex < 9) {
      currentQuizIndex++;
      renderQuizQuestion();
    } else {
      showQuizResults();
    }
  });

  function showQuizResults() {
    quizActiveContainer.style.display = 'none';
    quizResultsContainer.style.display = 'block';

    resultsScoreText.textContent = `You scored ${quizScore} out of 10!`;

    // Star rating & Badge update
    let stars = '';
    let badgeTitle = '';
    let rankDesc = '';

    if (quizScore >= 9) {
      stars = '⭐⭐⭐';
      badgeTitle = 'Chief Time Detective 🕵️‍♂️';
      rankDesc = 'Master level! You can calculate any date duration and leap year mystery!';
      resultsBadgeGraphic.textContent = '🏆';
    } else if (quizScore >= 6) {
      stars = '⭐⭐';
      badgeTitle = 'Senior Detective 🔍';
      rankDesc = 'Great work! You have strong date calculation skills.';
      resultsBadgeGraphic.textContent = '🥇';
    } else {
      stars = '⭐';
      badgeTitle = 'Junior Detective 🐣';
      rankDesc = 'Keep practicing! Review the step-by-step solutions below to sharpen your skills.';
      resultsBadgeGraphic.textContent = '📜';
    }

    resultsStars.textContent = stars;
    resultsRankDesc.textContent = `${badgeTitle} - ${rankDesc}`;

    // Update global header badge
    const rankTextSpan = document.getElementById('rank-text');
    if (rankTextSpan) rankTextSpan.textContent = badgeTitle;

    // Build Review Screen List
    let reviewHtml = '';
    userQuizAnswers.forEach((ans, idx) => {
      reviewHtml += `
        <div class="review-item ${ans.isCorrect ? 'review-correct' : 'review-incorrect'}">
          <div class="review-q-num">Question ${idx + 1} ${ans.isCorrect ? '✅ Correct' : '❌ Needs Review'}</div>
          <div class="review-q-title">${ans.q}</div>
          <div class="review-user-ans">Your Answer: <strong>${ans.selected}</strong></div>
          ${!ans.isCorrect ? `<div class="review-correct-ans">Correct Answer: <strong>${ans.correct}</strong></div>` : ''}
          <div class="review-explanation">
            <strong>🕵️‍♂️ Detective Working:</strong> ${ans.working}
          </div>
        </div>
      `;
    });
    quizReviewList.innerHTML = reviewHtml;
  }

  quizRestartBtn.addEventListener('click', startQuiz);

  // Initialize Quiz
  startQuiz();

});
