// handle animation
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

// handle validation
document.getElementById('register-form').addEventListener('submit', function (event) {
  console.log('Form submitted');
  event.preventDefault();

  const first_name = document.getElementById('first-name').value.trim();
  const last_name = document.getElementById('last-name').value.trim();
  const username = document.getElementById('username').value.trim();
  const email = document.getElementById('email').value.trim();
  const password = document.getElementById('password').value.trim();
  const terms = document.getElementById('terms').checked;

  let isValid = true;

  // Clear previous errors
  document.getElementById('first-name-error').textContent = '';
  document.getElementById('last-name-error').textContent = '';
  document.getElementById('username-error').textContent = '';
  document.getElementById('email-error').textContent = '';
  document.getElementById('password-error').textContent = '';
  document.getElementById('terms-error').textContent = '';

  // Validate first name
  if (first_name === '') {
    console.log('First name is required');
    document.getElementById('first-name-error').textContent = 'First name is required';
    isValid = false;
  }

  // Validate last name
  if (last_name === '') {
    console.log('Last name is required');
    document.getElementById('last_name-error').textContent = 'Last name is required';
    isValid = false;
  }

  // Validate username
  if (username === '') {
    console.log('Username is required');
    document.getElementById('username-error').textContent = 'Username is required';
    isValid = false;
  }

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

  // Validate terms and conditions
  if (!terms) {
    console.log('You must accept the terms and conditions');
    document.getElementById('terms-error').textContent = 'You must accept the terms and conditions';
    isValid = false;
  }

  if (isValid) {
    console.log('Form data: ', first_name, last_name, username, email, password, terms);
    // Submit the form data
    const data = { first_name, last_name, username, email, password };
    console.log('Data to be sent: ', data);
    console.log('Sending json data to server:', JSON.stringify(data));
    const body = JSON.stringify(data);

    fetch('/api/auth/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      // body: JSON.stringify(data)
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
