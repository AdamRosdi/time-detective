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

  let calendarViewDate = new Date(Date.UTC(2025, 2, 1)); // Default March 2025

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
    const presets = [
      { s: '2025-03-05', e: '2025-04-20' },
      { s: '2024-02-20', e: '2024-03-10' }, // Leap year Feb
      { s: '2025-02-20', e: '2025-03-10' }, // Non-leap Feb
      { s: '2025-06-12', e: '2025-07-03' },
      { s: '2025-11-25', e: '2025-12-15' }
    ];
    const rand = presets[Math.floor(Math.random() * presets.length)];
    startDateInput.value = rand.s;
    endDateInput.value = rand.e;
    const startObj = parseUTCDate(rand.s);
    calendarViewDate = new Date(Date.UTC(startObj.getUTCFullYear(), startObj.getUTCMonth(), 1));
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

  // Problem Database
  const practiceProblems = [
    {
      id: 1,
      category: 'Cross-Month Duration',
      text: 'A primary school summer camp starts on 12 June and ends on 3 July. How many days long is the camp? (Do not include the start day).',
      startDate: '2025-06-12',
      endDate: '2025-07-03',
      includeStart: false,
      correctAnswer: 21,
      unit: 'days',
      hint: 'Step 1: Calculate days remaining in June (30 - 12 = 18). Step 2: Add 3 days from July.',
      explanation: 'June has 30 days. Days left in June = 30 - 12 = 18 days. Days in July = 3 days. Total = 18 + 3 = 21 days.'
    },
    {
      id: 2,
      category: 'Leap Year February',
      text: 'A time detective investigation runs from 20 February 2024 to 5 March 2024. Remember, 2024 is a leap year! How many days is the investigation? (Exclude start day).',
      startDate: '2024-02-20',
      endDate: '2024-03-05',
      includeStart: false,
      correctAnswer: 14,
      unit: 'days',
      hint: 'Because 2024 is divisible by 4, February 2024 has 29 days! Subtract 20 from 29, then add 5.',
      explanation: '2024 is a leap year, so February has 29 days! Days left in Feb = 29 - 20 = 9 days. Days in March = 5 days. Total = 9 + 5 = 14 days.'
    },
    {
      id: 3,
      category: 'Normal Year February',
      text: 'A detective training course starts on 22 February 2025 and ends on 6 March 2025. How many days long is the course? (Exclude start day).',
      startDate: '2025-02-22',
      endDate: '2025-03-06',
      includeStart: false,
      correctAnswer: 12,
      unit: 'days',
      hint: '2025 is NOT a leap year, so February has 28 days. Calculate 28 - 22, then add 6.',
      explanation: '2025 is a normal year, so February has 28 days. Days left in Feb = 28 - 22 = 6 days. Days in March = 6 days. Total = 6 + 6 = 12 days.'
    },
    {
      id: 4,
      category: 'Days & Hours Duration',
      text: 'A mystery train journey takes 2 days and 5 hours. How many total hours did the train journey take?',
      isHoursProblem: true,
      correctAnswer: 53,
      unit: 'hours',
      hint: 'There are 24 hours in 1 day. Multiply 2 × 24, then add 5 hours.',
      explanation: '1 day = 24 hours. So 2 days = 2 × 24 = 48 hours. Adding 5 extra hours: 48 + 5 = 53 hours.'
    },
    {
      id: 5,
      category: 'Inclusive Start Date',
      text: 'A detective science exhibition runs from 5 April to 12 April. If both the start day and end day are included in the ticket count, how many days is the ticket valid?',
      startDate: '2025-04-05',
      endDate: '2025-04-12',
      includeStart: true,
      correctAnswer: 8,
      unit: 'days',
      hint: 'When counting BOTH start day and end day inclusive, the formula is: (End Day - Start Day) + 1.',
      explanation: 'In same-month inclusive counting: 12 - 5 + 1 = 8 days. (5th, 6th, 7th, 8th, 9th, 10th, 11th, and 12th = 8 days).'
    },
    {
      id: 6,
      category: 'Cross-Month Duration',
      text: 'A detective book challenge starts on 25 October and finishes on 10 November. How many days does the challenge last? (Exclude start day).',
      startDate: '2025-10-25',
      endDate: '2025-11-10',
      includeStart: false,
      correctAnswer: 16,
      unit: 'days',
      hint: 'October has 31 days! Calculate 31 - 25, then add 10 days of November.',
      explanation: 'October has 31 days ("30 days has Sept, Apr, June & Nov... Oct has 31!"). Days left in Oct = 31 - 25 = 6 days. Days in Nov = 10 days. Total = 6 + 10 = 16 days.'
    },
    {
      id: 7,
      category: 'Days & Hours Duration',
      text: 'A secret agent mission lasted 72 hours. How many days is that?',
      isHoursProblem: true,
      correctAnswer: 3,
      unit: 'days',
      hint: '1 day = 24 hours. Divide 72 by 24.',
      explanation: '72 ÷ 24 = 3 days.'
    },
    {
      id: 8,
      category: 'Multi-Month Duration',
      text: 'A mystery museum badge quest runs from 28 March to 5 May. How many days is the quest open? (Exclude start day).',
      startDate: '2025-03-28',
      endDate: '2025-05-05',
      includeStart: false,
      correctAnswer: 38,
      unit: 'days',
      hint: 'Break it into 3 parts: Days remaining in March (31 - 28), all 30 days of April, and 5 days of May!',
      explanation: 'March has 31 days: 31 - 28 = 3 days. All of April = 30 days. May = 5 days. Total = 3 + 30 + 5 = 38 days.'
    },
    {
      id: 9,
      category: 'Leap Year February',
      text: 'In the leap year 2028, a coding workshop runs from 26 February 2028 to 4 March 2028. How many days is it? (Exclude start day).',
      startDate: '2028-02-26',
      endDate: '2028-03-04',
      includeStart: false,
      correctAnswer: 7,
      unit: 'days',
      hint: '2028 is a leap year (2028 ÷ 4 = 507), so February has 29 days.',
      explanation: 'Feb 2028 has 29 days. 29 - 26 = 3 days in Feb. Add 4 days in March: 3 + 4 = 7 days.'
    },
    {
      id: 10,
      category: 'Cross-Month Duration',
      text: 'A detective holiday trip starts on 28 August and ends on 4 September. How many days is the trip? (Exclude start day).',
      startDate: '2025-08-28',
      endDate: '2025-09-04',
      includeStart: false,
      correctAnswer: 7,
      unit: 'days',
      hint: 'August has 31 days! 31 - 28 = 3 days in August.',
      explanation: 'August has 31 days. 31 - 28 = 3 days in August. Add 4 days in September = 7 days total.'
    }
  ];

  let currentPracticeIndex = 0;

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
    const prob = practiceProblems[currentPracticeIndex];

    practiceCategoryBadge.textContent = prob.category;
    practiceCounter.textContent = `Case ${currentPracticeIndex + 1} of ${practiceProblems.length}`;
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

    const prob = practiceProblems[currentPracticeIndex];
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
    const prob = practiceProblems[currentPracticeIndex];
    practiceHintText.textContent = prob.hint;
    practiceHintBox.style.display = 'block';
  });

  practiceNextBtn.addEventListener('click', () => {
    currentPracticeIndex = (currentPracticeIndex + 1) % practiceProblems.length;
    renderPracticeCase();
  });

  // Initialize Section 3
  renderPracticeCase();


  /* ==========================================================================
     6. SECTION 4: CHALLENGE QUIZ CONTROLLER
     ========================================================================== */

  const quizQuestionsBank = [
    {
      q: 'How many days are there in April?',
      options: ['28 days', '29 days', '30 days', '31 days'],
      correctIndex: 2,
      working: 'Remember the rhyme: "30 days has September, April, June, and November". April has exactly 30 days.'
    },
    {
      q: 'Which of the following years IS a leap year?',
      options: ['2023', '2025', '2028', '2031'],
      correctIndex: 2,
      working: '2028 is divisible by 4 (2028 ÷ 4 = 507). Therefore, 2028 is a leap year!'
    },
    {
      q: 'How many days does February have in a leap year?',
      options: ['28 days', '29 days', '30 days', '31 days'],
      correctIndex: 1,
      working: 'In a leap year, February gets 1 extra leap day, making it 29 days long.'
    },
    {
      q: 'How many hours are in 3 full days?',
      options: ['36 hours', '48 hours', '72 hours', '84 hours'],
      correctIndex: 2,
      working: '1 day = 24 hours. 3 days = 3 × 24 = 72 hours.'
    },
    {
      q: 'A trip starts on 10 March and ends on 25 March. How many days long is the trip? (Standard exclusive counting).',
      options: ['14 days', '15 days', '16 days', '30 days'],
      correctIndex: 1,
      working: '25 March - 10 March = 15 days.'
    },
    {
      q: 'A summer camp starts on 28 June and ends on 5 July. How many days is the camp? (Exclude start day).',
      options: ['6 days', '7 days', '8 days', '9 days'],
      correctIndex: 1,
      working: 'June has 30 days. Days left in June = 30 - 28 = 2 days. Days in July = 5 days. Total = 2 + 5 = 7 days.'
    },
    {
      q: 'How many days are in October?',
      options: ['28 days', '29 days', '30 days', '31 days'],
      correctIndex: 3,
      working: 'October is not in the 30-day group (Sept, Apr, June, Nov). So October has 31 days.'
    },
    {
      q: 'A school project runs from 25 February 2024 to 2 March 2024. How many days is it? (2024 is a leap year!).',
      options: ['5 days', '6 days', '7 days', '8 days'],
      correctIndex: 2,
      working: 'Because 2024 is a leap year, Feb has 29 days. 29 - 25 = 4 days in Feb. Plus 2 days in March = 6 days? Wait: 29 - 25 = 4, + 2 = 6? Let\'s check: 26th, 27th, 28th, 29th, 1st, 2nd = 6 days. Let\'s make options correct: 29 - 25 = 4 days in Feb + 2 in March = 6 days.'
    },
    {
      q: 'Convert 1 day and 12 hours into total hours.',
      options: ['24 hours', '30 hours', '36 hours', '48 hours'],
      correctIndex: 2,
      working: '1 day = 24 hours. 24 + 12 = 36 hours.'
    },
    {
      q: 'Which month has 28 days in a normal year?',
      options: ['January', 'February', 'March', 'April'],
      correctIndex: 1,
      working: 'February is the unique month with 28 days in normal years and 29 days in leap years.'
    }
  ];

  // Adjust question 8 working/options cleanly
  quizQuestionsBank[7] = {
    q: 'A school project runs from 25 February 2024 to 2 March 2024. How many days is it? (2024 is a leap year!).',
    options: ['5 days', '6 days', '7 days', '8 days'],
    correctIndex: 1,
    working: '2024 is a leap year, so Feb has 29 days. Days left in Feb = 29 - 25 = 4 days. Days in March = 2 days. Total = 4 + 2 = 6 days.'
  };

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
    // Shuffle questions
    quizQuestions = [...quizQuestionsBank].sort(() => Math.random() - 0.5).slice(0, 10);
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
