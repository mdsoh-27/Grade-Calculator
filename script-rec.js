// grade points
const GRADE_POINTS = {
  'O': 10,
  'S': 9,
  'A': 8,
  'B': 7,
  'C': 6,
  'D': 5,
  'F': 0
};

// credits
const CREDIT_OPTIONS = [3, 2, 1.5];

let subjectCount = 0;

// get elements
const subjectsContainer = document.getElementById('subjectsContainer');
const addSubjectBtn = document.getElementById('addSubjectBtn');
const calculateBtn = document.getElementById('calculateBtn');
const resultsSection = document.getElementById('results');
const totalCreditsEl = document.getElementById('totalCredits');
const totalGradePointsEl = document.getElementById('totalGradePoints');
const gpaValueEl = document.getElementById('gpaValue');

// start with one subject
document.addEventListener('DOMContentLoaded', () => {
  addSubjectRow();
});

// Add subject row
function addSubjectRow() {
  subjectCount++;

  const subjectRow = document.createElement('div');
  subjectRow.className = 'subject-row';
  subjectRow.id = `subject-${subjectCount}`;

  subjectRow.innerHTML = `
    <div class="subject-name-cell">
      <label class="subject-label">Subject-${subjectCount}</label>
    </div>
    
    <div class="grade-cell">
      <select id="grade-${subjectCount}" class="form-select grade-select" required>
        <option value="">Select Grade</option>
        ${Object.keys(GRADE_POINTS).map(grade =>
    `<option value="${grade}">${grade}</option>`
  ).join('')}
      </select>
    </div>
    
    <div class="credit-cell">
      <select id="credit-${subjectCount}" class="form-select credit-select" required>
        <option value="">Select Credit</option>
        ${CREDIT_OPTIONS.map(credit =>
    `<option value="${credit}">${credit}</option>`
  ).join('')}
      </select>
    </div>
    
    <div class="remove-cell">
      <button 
        type="button" 
        class="btn btn-remove" 
        onclick="removeSubjectRow(${subjectCount})"
        aria-label="Remove subject"
        title="Remove subject"
      >
        ✕
      </button>
    </div>
  `;

  subjectsContainer.appendChild(subjectRow);
}

// Remove subject row
function removeSubjectRow(id) {
  const subjectRow = document.getElementById(`subject-${id}`);

  // Prevent removing the last subject
  const remainingSubjects = subjectsContainer.querySelectorAll('.subject-row').length;
  if (remainingSubjects <= 1) {
    alert('You must have at least one subject!');
    return;
  }

  // Add fade out animation
  subjectRow.style.animation = 'fadeInUp 0.3s ease-out reverse';

  setTimeout(() => {
    subjectRow.remove();
  }, 250);
}

// Calculate GPA
function calculateGPA() {
  const subjectRows = subjectsContainer.querySelectorAll('.subject-row');

  let totalCredits = 0;
  let totalWeightedPoints = 0;
  let hasErrors = false;

  // Validate and calculate
  subjectRows.forEach((row, index) => {
    const grade = row.querySelector('.grade-select').value;
    const credit = row.querySelector('.credit-select').value;
    const subjectNum = index + 1;

    // Validation
    if (!grade) {
      alert(`Please select a grade for Sub${subjectNum}`);
      hasErrors = true;
      return;
    }

    if (!credit) {
      alert(`Please select credits for Sub${subjectNum}`);
      hasErrors = true;
      return;
    }

    // Calculate
    const gradePoint = GRADE_POINTS[grade];
    const creditValue = parseFloat(credit);

    totalCredits += creditValue;
    totalWeightedPoints += gradePoint * creditValue;
  });

  // Stop if there are errors
  if (hasErrors) {
    return;
  }

  // Calculate final GPA
  const gpa = totalCredits > 0 ? (totalWeightedPoints / totalCredits).toFixed(2) : 0;

  // Display results with animation
  displayResults(totalCredits, totalWeightedPoints.toFixed(2), gpa);
}

// Display results
function displayResults(credits, gradePoints, gpa) {
  // Update values
  totalCreditsEl.textContent = credits.toFixed(1);
  totalGradePointsEl.textContent = gradePoints;
  gpaValueEl.textContent = gpa;

  // Show results with animation
  resultsSection.classList.add('show');

  // Scroll to results
  resultsSection.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

// Event Listeners
addSubjectBtn.addEventListener('click', addSubjectRow);
calculateBtn.addEventListener('click', calculateGPA);

// Allow Enter key to calculate
document.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') {
    calculateGPA();
  }
});

// Add input validation feedback
document.addEventListener('input', (e) => {
  if (e.target.classList.contains('form-input') || e.target.classList.contains('form-select')) {
    if (e.target.value) {
      e.target.style.borderColor = 'var(--border-focus)';
    } else {
      e.target.style.borderColor = 'var(--border-color)';
    }
  }
});
