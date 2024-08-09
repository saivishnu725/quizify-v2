let quizCount = 1;

function showOptions(select, quizId) {
  const optionsDiv = document.getElementById(`options${quizId}`);
  optionsDiv.innerHTML = ''; // Clear previous options

  if (select.value === 'true-false') {
    optionsDiv.innerHTML = `
      <div class="form-group mb-3">
        <label>Option 1</label>
        <input type="text" class="form-control" value="True" readonly>
        <div class="form-check">
          <input type="radio" class="form-check-input" name="quiz[${quizId - 1}][correctOption]" value="0" required>
          <label class="form-check-label">Correct</label>
        </div>
      </div>
      <div class="form-group mb-3">
        <label>Option 2</label>
        <input type="text" class="form-control" value="False" readonly>
        <div class="form-check">
          <input type="radio" class="form-check-input" name="quiz[${quizId - 1}][correctOption]" value="1" required>
          <label class="form-check-label">Correct</label>
        </div>
      </div>
    `;
  } else {
    let optionCount = select.value === '4-options' ? 4 : 2;
    for (let i = 0; i < optionCount; i++) {
      optionsDiv.innerHTML += `
        <div class="form-group mb-3">
          <label for="option${quizId}_${i + 1}">Option ${i + 1}</label>
          <input type="text" class="form-control" id="option${quizId}_${i + 1}" name="quiz[${quizId - 1}][options][${i}]" required>
          <div class="form-check">
            <input type="radio" class="form-check-input" name="quiz[${quizId - 1}][correctOption]" value="${i}" required>
            <label class="form-check-label">Correct</label>
          </div>
        </div>
      `;
    }
  }
}

function addQuiz() {
  quizCount++;
  const newQuiz = document.createElement('div');
  newQuiz.classList.add('card', 'mb-4');
  newQuiz.innerHTML = `
    <div class="card-body" id="quiz${quizCount}">
      <h5 class="card-title">Question ${quizCount}</h5>
      <div class="form-group mb-3">
        <label for="question${quizCount}" class="form-label">Question</label>
        <input type="text" class="form-control" id="question${quizCount}" name="quiz[${quizCount - 1}][question]" required>
      </div>
      <div class="form-group mb-3">
        <label for="quizType${quizCount}" class="form-label">Select Quiz Type</label>
        <select class="form-select" id="quizType${quizCount}" name="quiz[${quizCount - 1}][type]" onchange="showOptions(this, ${quizCount})">
          <option value="4-options">4 Options</option>
          <option value="2-options">2 Options</option>
          <option value="true-false">True/False</option>
        </select>
      </div>
      <div class="options" id="options${quizCount}">
        <!-- Options will be dynamically added here -->
      </div>
    </div>
  `;
  document.getElementById('quizContainer').appendChild(newQuiz);
  showOptions(document.getElementById(`quizType${quizCount}`), quizCount); // Initialize options for new quiz
}

window.onload = function () {
  showOptions(document.getElementById('quizType1'), 1);
};