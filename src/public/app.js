const contactForm = document.querySelector('#contact-form');
const contactFeedback = document.querySelector('#contact-feedback');
function setFeedback(element, message, type = '') {
  element.textContent = message;
  element.className = `feedback ${type}`;
}

function setLoading(button, isLoading, label) {
  button.disabled = isLoading;
  button.textContent = isLoading ? 'Procesando...' : label;
}

async function readResponse(response) {
  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.message || 'Ocurrio un error inesperado.');
  }

  return data;
}

contactForm.addEventListener('submit', async (event) => {
  event.preventDefault();

  if (!contactForm.reportValidity()) return;

  const button = contactForm.querySelector('button');
  setLoading(button, true, 'Enviar mensaje');
  setFeedback(contactFeedback, '');

  try {
    const response = await fetch('/api/contacts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(Object.fromEntries(new FormData(contactForm))),
    });
    const data = await readResponse(response);
    contactForm.reset();
    setFeedback(contactFeedback, data.message, 'success');
  } catch (error) {
    setFeedback(contactFeedback, error.message, 'error');
  } finally {
    setLoading(button, false, 'Enviar mensaje');
  }
});
