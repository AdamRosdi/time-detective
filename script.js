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

  /* --- Mini-Game: Spot the Leap Year --- */
  let gameScore = 0;
  let gameTotal = 0;
  let currentRoundCorrectYear = null;

  const gameScoreSpan = document.getElementById('game-score');
  const gameTotalSpan = document.getElementById('game-total');
  const gameCardsContainer = document.getElementById('game-cards-container');
  const gameFeedbackBox = document.getElementById('game-feedback-box');
  const nextGameRoundBtn = document.getElementById('next-game-round-btn');

  function generateMiniGameRound() {
    gameFeedbackBox.innerHTML = '';
    gameCardsContainer.innerHTML = '';

    // Generate 1 leap year and 3 non-leap years
    const baseYear = 1990 + Math.floor(Math.random() * 50);
    let leapYear = baseYear;
    while (!isLeapYear(leapYear)) leapYear++;

    currentRoundCorrectYear = leapYear;

    const options = [leapYear];
    while (options.length < 4) {
      const offset = (Math.floor(Math.random() * 12) + 1) * (Math.random() < 0.5 ? 1 : -1);
      const candidate = leapYear + offset;
      if (!isLeapYear(candidate) && candidate > 1900 && !options.includes(candidate)) {
        options.push(candidate);
      }
    }

    // Shuffle options
    options.sort(() => Math.random() - 0.5);

    options.forEach(yr => {
      const card = document.createElement('div');
      card.className = 'game-card-item';
      card.textContent = yr;
      card.setAttribute('role', 'button');
      card.setAttribute('tabindex', '0');

      function handleClick() {
        if (card.classList.contains('correct') || card.classList.contains('incorrect')) return;

        gameTotal++;
        if (yr === currentRoundCorrectYear) {
          gameScore++;
          card.classList.add('correct');
          gameFeedbackBox.innerHTML = `
            <div style="color: var(--success-green);">
              🎯 <strong>Correct!</strong> ${yr} ÷ 4 = ${yr / 4} (No remainder!). It is a Leap Year!
            </div>
          `;
        } else {
          card.classList.add('incorrect');
          gameFeedbackBox.innerHTML = `
            <div style="color: var(--error-red);">
              ❌ <strong>Not quite!</strong> ${yr} is not divisible by 4 (${yr} ÷ 4 = ${(yr / 4).toFixed(2)}).
              The leap year was <strong>${currentRoundCorrectYear}</strong>!
            </div>
          `;
          // Highlight correct card
          Array.from(gameCardsContainer.children).forEach(c => {
            if (parseInt(c.textContent, 10) === currentRoundCorrectYear) {
              c.classList.add('correct');
            }
          });
        }

        gameScoreSpan.textContent = gameScore;
        gameTotalSpan.textContent = gameTotal;
      }

      card.addEventListener('click', handleClick);
      card.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handleClick();
        }
      });

      gameCardsContainer.appendChild(card);
    });
  }

  nextGameRoundBtn.addEventListener('click', generateMiniGameRound);
  generateMiniGameRound();


  /* ==========================================================================
     5. SECTION 3: PRACTICE CASES & DIAGNOSTIC FEEDBACK
     ========================================================================== */

  /**
   * Factory function to dynamically generate random 2026 practice cases.
   */
  function createPracticeProblem(id) {
    let range, startObj, endObj, includeStart, correctAnswer, hint, explanation, category, text, unit, isHoursProblem = false;

    switch (id) {
      case 1: { // Cross-month (30-day month in 2026)
        category = 'Cross-Month Duration';
        unit = 'days';
        includeStart = false;
        range = generateRandom2026DateRange('month30', 5, 30);
        startObj = range.startObj;
        endObj = range.endObj;
        correctAnswer = calculateDurationDays(startObj, endObj, false);
        const breakdown = generateStepBreakdown(startObj, endObj, false);
        text = `A primary school summer camp starts on ${formatUTCDate(startObj)} and ends on ${formatUTCDate(endObj)}. How many days long is the camp? (Do not include the start day).`;
        hint = `Break it down: ${breakdown.steps.map(s => `${s.label} (${s.days} days)`).join(' + ')}.`;
        explanation = breakdown.steps.map((s, i) => `Step ${i + 1}: ${s.label} = ${s.days} days`).join('. ') + `. Total = ${correctAnswer} days.`;
        break;
      }
      case 2: { // February 2026 duration
        category = 'February 2026 Duration';
        unit = 'days';
        includeStart = false;
        range = generateRandom2026DateRange('february', 5, 25);
        startObj = range.startObj;
        endObj = range.endObj;
        correctAnswer = calculateDurationDays(startObj, endObj, false);
        const breakdown = generateStepBreakdown(startObj, endObj, false);
        text = `A time detective investigation runs from ${formatUTCDate(startObj)} to ${formatUTCDate(endObj)}. Remember, 2026 is NOT a leap year, so February has 28 days! How many days is the investigation? (Exclude start day).`;
        hint = `2026 is not a leap year, so February has 28 days! Calculate days remaining in Feb, then add March days if needed.`;
        explanation = breakdown.steps.map((s, i) => `Step ${i + 1}: ${s.label} = ${s.days} days`).join('. ') + `. Total = ${correctAnswer} days.`;
        break;
      }
      case 3: { // February to March 2026
        category = 'February Cross-Month';
        unit = 'days';
        includeStart = false;
        startObj = new Date(Date.UTC(2026, 1, Math.floor(Math.random() * 12) + 14)); // Feb 14-25
        const gap = Math.floor(Math.random() * 20) + 7;
        endObj = new Date(startObj.getTime() + gap * 86400000);
        correctAnswer = calculateDurationDays(startObj, endObj, false);
        const breakdown = generateStepBreakdown(startObj, endObj, false);
        text = `A detective training course starts on ${formatUTCDate(startObj)} and ends on ${formatUTCDate(endObj)}. How many days long is the course? (Exclude start day).`;
        hint = `2026 is a normal year (28 days in Feb). Calculate 28 - ${startObj.getUTCDate()} days left in Feb, then add ${endObj.getUTCDate()} days in March.`;
        explanation = breakdown.steps.map((s, i) => `Step ${i + 1}: ${s.label} = ${s.days} days`).join('. ') + `. Total = ${correctAnswer} days.`;
        break;
      }
      case 4: { // Days & Hours
        category = 'Days & Hours Duration';
        unit = 'hours';
        isHoursProblem = true;
        const days = Math.floor(Math.random() * 4) + 2;
        const hours = Math.floor(Math.random() * 15) + 1;
        correctAnswer = days * 24 + hours;
        text = `A mystery train journey takes ${days} days and ${hours} hours. How many total hours did the train journey take?`;
        hint = `There are 24 hours in 1 day. Multiply ${days} × 24, then add ${hours} hours.`;
        explanation = `1 day = 24 hours. So ${days} days = ${days} × 24 = ${days * 24} hours. Adding ${hours} extra hours: ${days * 24} + ${hours} = ${correctAnswer} hours.`;
        break;
      }
      case 5: { // Inclusive start date in 2026
        category = 'Inclusive Start Date';
        unit = 'days';
        includeStart = true;
        range = generateRandom2026DateRange('sameMonth', 5, 20);
        startObj = range.startObj;
        endObj = range.endObj;
        correctAnswer = calculateDurationDays(startObj, endObj, true);
        text = `A detective science exhibition runs from ${formatUTCDate(startObj)} to ${formatUTCDate(endObj)}. If both the start day and end day are included in the ticket count, how many days is the ticket valid?`;
        hint = `When counting BOTH start day and end day inclusive, the formula is: (End Day - Start Day) + 1.`;
        explanation = `Inclusive calculation: (${endObj.getUTCDate()} - ${startObj.getUTCDate()}) + 1 = ${correctAnswer} days.`;
        break;
      }
      case 6: { // 31-Day month in 2026
        category = '31-Day Month Duration';
        unit = 'days';
        includeStart = false;
        range = generateRandom2026DateRange('month31', 5, 30);
        startObj = range.startObj;
        endObj = range.endObj;
        correctAnswer = calculateDurationDays(startObj, endObj, false);
        const breakdown = generateStepBreakdown(startObj, endObj, false);
        text = `A detective book challenge starts on ${formatUTCDate(startObj)} and finishes on ${formatUTCDate(endObj)}. How many days does the challenge last? (Exclude start day).`;
        hint = `${MONTH_NAMES[startObj.getUTCMonth()]} has 31 days! Calculate 31 - ${startObj.getUTCDate()}, then add the days in ${MONTH_NAMES[endObj.getUTCMonth()]}.`;
        explanation = breakdown.steps.map((s, i) => `Step ${i + 1}: ${s.label} = ${s.days} days`).join('. ') + `. Total = ${correctAnswer} days.`;
        break;
      }
      case 7: { // Hours to Days
        category = 'Days & Hours Duration';
        unit = 'days';
        isHoursProblem = true;
        const totalDays = Math.floor(Math.random() * 5) + 2;
        const totalHours = totalDays * 24;
        correctAnswer = totalDays;
        text = `A secret agent mission lasted ${totalHours} hours. How many full days is that?`;
        hint = `1 day = 24 hours. Divide ${totalHours} by 24.`;
        explanation = `${totalHours} ÷ 24 = ${correctAnswer} days.`;
        break;
      }
      case 8: { // Multi-Month duration (crosses 2 or 3 months in 2026)
        category = 'Multi-Month Duration';
        unit = 'days';
        includeStart = false;
        range = generateRandom2026DateRange('multiMonth', 35, 60);
        startObj = range.startObj;
        endObj = range.endObj;
        correctAnswer = calculateDurationDays(startObj, endObj, false);
        const breakdown = generateStepBreakdown(startObj, endObj, false);
        text = `A mystery museum badge quest runs from ${formatUTCDate(startObj)} to ${formatUTCDate(endObj)}. How many days is the quest open? (Exclude start day).`;
        hint = `Break it into steps for each month: ${breakdown.steps.map(s => `${s.label} (${s.days} days)`).join(', ')}.`;
        explanation = breakdown.steps.map((s, i) => `Step ${i + 1}: ${s.label} = ${s.days} days`).join('. ') + `. Total = ${correctAnswer} days.`;
        break;
      }
      case 9: { // February 2026 cross-month
        category = 'February 2026 Duration';
        unit = 'days';
        includeStart = false;
        startObj = new Date(Date.UTC(2026, 1, Math.floor(Math.random() * 10) + 18));
        const gap = Math.floor(Math.random() * 15) + 5;
        endObj = new Date(startObj.getTime() + gap * 86400000);
        correctAnswer = calculateDurationDays(startObj, endObj, false);
        const breakdown = generateStepBreakdown(startObj, endObj, false);
        text = `In the non-leap year 2026, a coding workshop runs from ${formatUTCDate(startObj)} to ${formatUTCDate(endObj)}. How many days is it? (Exclude start day).`;
        hint = `2026 is not a leap year, so February has 28 days! Calculate 28 - ${startObj.getUTCDate()} days in Feb, plus days in March.`;
        explanation = breakdown.steps.map((s, i) => `Step ${i + 1}: ${s.label} = ${s.days} days`).join('. ') + `. Total = ${correctAnswer} days.`;
        break;
      }
      case 10:
      default: { // Random cross-month duration in 2026
        category = 'Cross-Month Duration';
        unit = 'days';
        includeStart = false;
        range = generateRandom2026DateRange('any', 10, 45);
        startObj = range.startObj;
        endObj = range.endObj;
        correctAnswer = calculateDurationDays(startObj, endObj, false);
        const breakdown = generateStepBreakdown(startObj, endObj, false);
        text = `A detective holiday trip starts on ${formatUTCDate(startObj)} and ends on ${formatUTCDate(endObj)}. How many days is the trip? (Exclude start day).`;
        hint = `Break it down month by month: ${breakdown.steps.map(s => `${s.label} (${s.days} days)`).join(' + ')}.`;
        explanation = breakdown.steps.map((s, i) => `Step ${i + 1}: ${s.label} = ${s.days} days`).join('. ') + `. Total = ${correctAnswer} days.`;
        break;
      }
    }

    return {
      id,
      category,
      text,
      startDate: startObj ? toISOUTCDateString(startObj) : null,
      endDate: endObj ? toISOUTCDateString(endObj) : null,
      includeStart,
      correctAnswer,
      unit,
      hint,
      explanation,
      isHoursProblem
    };
  }

  let currentPracticeIndex = 0;
  let currentPracticeProblem = null;

  const practiceCategoryBadge = document.getElementById('practice-category-badge');
  const practiceCounter = document.getElementById('practice-counter');
  const practiceProblemText = document.getElementById('practice-problem-text');
  const practiceAnswerInput = document.getElementById('practice-answer-input');
  const practiceUnitLabel = document.getElementById('practice-unit-label');
  const practiceSubmitBtn = document.getElementById('practice-submit-btn');
  const practiceHintBtn = document.getElementById('practice-hint-btn');
  const practiceNextBtn = document.getElementById('practice-next-btn');
  const practiceHintBox = document.getElementById('practice-hint-box');
  const practiceHintText = document.getElementById('practice-hint-text');
  const practiceFeedbackBox = document.getElementById('practice-feedback-box');

  function renderPracticeCase() {
    currentPracticeProblem = createPracticeProblem(currentPracticeIndex + 1);
    const prob = currentPracticeProblem;

    practiceCategoryBadge.textContent = prob.category;
    practiceCounter.textContent = `Case ${currentPracticeIndex + 1} of 10`;
    practiceProblemText.textContent = prob.text;
    practiceUnitLabel.textContent = prob.unit;

    practiceAnswerInput.value = '';
    practiceHintBox.style.display = 'none';
    practiceFeedbackBox.style.display = 'none';
    practiceNextBtn.style.display = 'none';
  }

  /**
   * Diagnostic Misconception Detection Engine
   */
  function diagnoseMisconception(prob, userAnswer) {
    const correct = prob.correctAnswer;
    if (userAnswer === correct) {
      return {
        isCorrect: true,
        title: '🎉 Outstanding Detective Work!',
        message: prob.explanation
      };
    }

    // Check specific known misconceptions
    let diagnosticMsg = '';

    // Misconception 1: Assuming 30 days per month
    if (!prob.isHoursProblem && prob.startDate && prob.endDate) {
      const sObj = parseUTCDate(prob.startDate);
      const eObj = parseUTCDate(prob.endDate);
      const sMonthDays = getDaysInMonth(sObj.getUTCFullYear(), sObj.getUTCMonth());

      if (sMonthDays !== 30) {
        // Calculate what answer user gets if assuming 30 days
        const startDay = sObj.getUTCDate();
        const endDay = eObj.getUTCDate();
        const assumed30Days = (30 - startDay) + endDay + (prob.includeStart ? 1 : 0);

        if (userAnswer === assumed30Days) {
          diagnosticMsg = `
            🔎 <strong>Misconception Detected: Assuming 30 days per month!</strong><br>
            You likely assumed ${MONTH_NAMES[sObj.getUTCMonth()]} has 30 days. But remember our rhyme:
            <em>${MONTH_NAMES[sObj.getUTCMonth()]} actually has ${sMonthDays} days!</em>
          `;
        }
      }
    }

    // Misconception 2: Off by 1 (Start/End date inclusive/exclusive mix-up)
    if (!diagnosticMsg && !prob.isHoursProblem) {
      if (userAnswer === correct + 1) {
        diagnosticMsg = `
          🔎 <strong>Misconception Detected: Off by 1 (Added 1 extra day)!</strong><br>
          You counted both the start and end days or added 1 day too many. Unless specified as "inclusive", standard duration counts the <em>nights/steps</em> between dates!
        `;
      } else if (userAnswer === correct - 1) {
        diagnosticMsg = `
          🔎 <strong>Misconception Detected: Off by 1 (Short by 1 day)!</strong><br>
          You might have missed counting one of the days or subtracted 1 too many!
        `;
      }
    }

    // Misconception 3: February length error (28 vs 29 in leap year)
    if (!diagnosticMsg && prob.category.includes('February')) {
      if (userAnswer === correct - 1 || userAnswer === correct + 1) {
        diagnosticMsg = `
          🔎 <strong>Misconception Detected: February Length Error!</strong><br>
          Double check if the year in this case is a <strong>Leap Year</strong> (divisible by 4, having 29 days) or a normal year (28 days)!
        `;
      }
    }

    // Generic friendly feedback fallback
    if (!diagnosticMsg) {
      diagnosticMsg = `
        🔎 <strong>Detective Clue:</strong> Take a look at the month lengths again.
        Remember: September, April, June, November have 30 days; all the rest have 31 (except Feb with 28/29).
      `;
    }

    return {
      isCorrect: false,
      title: '❌ Case Needs Re-investigation!',
      message: `${diagnosticMsg}<br><br>💡 <strong>Step-by-Step Solution:</strong> ${prob.explanation}`
    };
  }

  practiceSubmitBtn.addEventListener('click', () => {
    const val = parseInt(practiceAnswerInput.value, 10);
    if (isNaN(val)) {
      practiceFeedbackBox.className = 'feedback-box feedback-incorrect';
      practiceFeedbackBox.innerHTML = '⚠️ Please enter a number answer!';
      practiceFeedbackBox.style.display = 'block';
      return;
    }

    const prob = currentPracticeProblem;
    const result = diagnoseMisconception(prob, val);

    practiceFeedbackBox.className = `feedback-box ${result.isCorrect ? 'feedback-correct' : 'feedback-incorrect'}`;
    practiceFeedbackBox.innerHTML = `
      <div class="feedback-diagnostic-title">${result.title}</div>
      <div>${result.message}</div>
    `;
    practiceFeedbackBox.style.display = 'block';
    practiceNextBtn.style.display = 'inline-flex';
  });

  practiceHintBtn.addEventListener('click', () => {
    const prob = currentPracticeProblem;
    practiceHintText.textContent = prob.hint;
    practiceHintBox.style.display = 'block';
  });

  practiceNextBtn.addEventListener('click', () => {
    currentPracticeIndex = (currentPracticeIndex + 1) % 10;
    renderPracticeCase();
  });

  // Initialize Section 3
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
