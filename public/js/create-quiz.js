let quizCount = 1;

function showOptions(select, quizId) {
  const optionsDiv = document.getElementById(`options${quizId}`);
  optionsDiv.innerHTML = ''; // Clear previous options

  if (select.value === 'true-false') {
    optionsDiv.innerHTML = `
                <div class="form-group">
                    <label>Option 1</label>
                    <input type="text" class="form-control" value="True" readonly>
                    <input type="radio" name="quiz[${quizId - 1}][correctOption]" value="0" required> Correct
                </div>
                <div class="form-group">
                    <label>Option 2</label>
                    <input type="text" class="form-control" value="False" readonly>
                    <input type="radio" name="quiz[${quizId - 1}][correctOption]" value="1" required> Correct
                </div>
            `;
  } else {
    let optionCount = select.value === '4-options' ? 4 : 2;
    for (let i = 0; i < optionCount; i++) {
      optionsDiv.innerHTML += `
                    <div class="form-group">
                        <label for="option${quizId}_${i + 1}">Option ${i + 1}</label>
                        <input type="text" class="form-control" id="option${quizId}_${i + 1}" name="quiz[${quizId - 1}][options][${i}]" required>
                        <input type="radio" name="quiz[${quizId - 1}][correctOption]" value="${i}" required> Correct
                    </div>
                `;
    }
  }
}

function addQuiz() {
  quizCount++;
  const newQuiz = document.querySelector('.quiz').cloneNode(true);
  newQuiz.id = `quiz${quizCount}`;
  newQuiz.querySelector('input[name^="quiz"]').setAttribute('name', `quiz[${quizCount - 1}][question]`);
  newQuiz.querySelector('select[name^="quiz"]').setAttribute('name', `quiz[${quizCount - 1}][type]`);
  newQuiz.querySelector('select').setAttribute('onchange', `showOptions(this, ${quizCount})`);
  newQuiz.querySelector('.options').id = `options${quizCount}`;
  newQuiz.querySelectorAll('input').forEach(input => {
    input.value = ''; // Clear inputs
    if (input.type === 'radio') input.checked = false; // Clear radio selections
  });
  document.getElementById('quizContainer').appendChild(newQuiz);
}

window.onload = function () {
  showOptions(document.getElementById('quizType1'), 1);
};