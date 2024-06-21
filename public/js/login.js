document.addEventListener('DOMContentLoaded', function() {
    const formOutlines = document.querySelectorAll('.form-outline');

    formOutlines.forEach(outline => {
      const input = outline.querySelector('.form-control');
      const label = outline.querySelector('.form-label');

      // Initialize label positions
      if (input.value.trim() !== "") {
        label.classList.add('active');
      }

      // Event listeners for focus and blur
      input.addEventListener('focus', function() {
        outline.classList.add('active');
        label.classList.add('active');
      });

      input.addEventListener('blur', function() {
        if (input.value.trim() === "") {
          outline.classList.remove('active');
          label.classList.remove('active');
        }
      });
    });
  });