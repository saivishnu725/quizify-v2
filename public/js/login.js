document.addEventListener('DOMContentLoaded', function () {
  const formOutlines = document.querySelectorAll('.form-outline');

  formOutlines.forEach(outline => {
    const input = outline.querySelector('.form-control');
    const label = outline.querySelector('.form-label');

    // Initialize label positions
    if (input.value.trim() !== "") {
      label.classList.add('active');
    }

    // Event listeners for focus and blur
    input.addEventListener('focus', function () {
      outline.classList.add('active');
      label.classList.add('active');
    });

    input.addEventListener('blur', function () {
      if (input.value.trim() === "") {
        outline.classList.remove('active');
        label.classList.remove('active');
      }
    });
  });
});

// Function to handle form submission

// handle validation
document.getElementById('login-form').addEventListener('submit', function (event) {
  console.log('Login Form submitted');
  event.preventDefault();

  const email = document.getElementById('email').value.trim();
  const password = document.getElementById('password').value.trim();
  const remember = document.getElementById('remember').checked;

  let isValid = true;

  // Clear previous errors
  document.getElementById('email-error').textContent = '';
  document.getElementById('password-error').textContent = '';

  // Validate email
  if (email === '') {
    console.log('Email is required');
    document.getElementById('email-error').textContent = 'Email is required';
    isValid = false;
  } else if (!/\S+@\S+\.\S+/.test(email)) {
    console.log('Email is invalid');
    document.getElementById('email-error').textContent = 'Email is invalid';
    isValid = false;
  }

  // Validate password
  if (password === '') {
    console.log('Password is required');
    document.getElementById('password-error').textContent = 'Password is required';
    isValid = false;
  }

  if (isValid) {
    console.log('Form data: ', email, password);
    // Submit the form data
    const data = { email, password, remember };
    console.log('Data to be sent: ', data);
    console.log('Sending json data to server:', JSON.stringify(data));
    const body = JSON.stringify(data);

    fetch('/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: body
    })
      .then(response => response.json())
      .then(data => {
        console.log('Response received: ', data);
        if (data.token) {
          console.log('Token received: ', data.token);
          window.location.href = '/app';
        } else {
          console.error('Error in token received:', data);
        }
      })
      .catch((error) => {
        console.error('Error in fetch():', error);
      });
  }
});
