const loginForm = document.querySelector('#login-form');
const loginFeedback = document.querySelector('#login-feedback');

function setFeedback(message, type = '') {
  loginFeedback.textContent = message;
  loginFeedback.className = `feedback ${type}`;
}

loginForm.addEventListener('submit', async (event) => {
  event.preventDefault();
  if (!loginForm.reportValidity()) return;

  const button = loginForm.querySelector('button');
  const { username, password } = Object.fromEntries(new FormData(loginForm));
  const authorization = `Basic ${btoa(`${username}:${password}`)}`;
  button.disabled = true;
  button.textContent = 'Verificando...';
  setFeedback('');

  try {
    const response = await fetch('/api/contacts', {
      headers: {
        Authorization: authorization,
        'X-Requested-With': 'XMLHttpRequest',
      },
    });
    const data = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(data.message || 'No fue posible validar las credenciales.');

    sessionStorage.setItem('contactsAuthorization', authorization);
    window.location.assign('/admin.html');
  } catch (error) {
    setFeedback(error.message, 'error');
    button.disabled = false;
    button.textContent = 'Entrar a la bandeja';
  }
});
