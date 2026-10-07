const authorization = sessionStorage.getItem('contactsAuthorization');
const contactsList = document.querySelector('#contacts-list');
const contactsCount = document.querySelector('#contacts-count');
const feedback = document.querySelector('#admin-feedback');
const refreshButton = document.querySelector('#refresh-contacts');
const searchInput = document.querySelector('#contact-search');
let searchTimer;
let activeRequest;

function leaveAdmin() {
  sessionStorage.removeItem('contactsAuthorization');
  window.location.replace('/login.html');
}

function renderContacts(contacts) {
  contactsList.replaceChildren();
  contactsCount.textContent = `${contacts.length} contacto${contacts.length === 1 ? '' : 's'}`;

  if (!contacts.length) {
    const empty = document.createElement('p');
    empty.className = 'empty-state';
    empty.textContent = 'Aun no hay contactos recibidos.';
    contactsList.append(empty);
    return;
  }

  contacts.forEach((contact) => {
    const article = document.createElement('article');
    article.className = 'contact-item';
    const title = document.createElement('h2');
    title.textContent = contact.name;
    const meta = document.createElement('p');
    meta.className = 'contact-meta';
    meta.textContent = `${contact.email} · ${new Date(contact.createdAt).toLocaleString('es')}`;
    const message = document.createElement('p');
    message.className = 'contact-message';
    message.textContent = contact.message;
    article.append(title, meta, message);
    contactsList.append(article);
  });
}

async function loadContacts(search = '') {
  if (!authorization) return leaveAdmin();

  activeRequest?.abort();
  const requestController = new AbortController();
  activeRequest = requestController;
  refreshButton.disabled = true;
  refreshButton.textContent = 'Actualizando...';
  feedback.textContent = '';

  try {
    const params = new URLSearchParams();
    if (search.trim()) params.set('q', search.trim());
    const response = await fetch(`/api/contacts?${params}`, {
      headers: {
        Authorization: authorization,
        'X-Requested-With': 'XMLHttpRequest',
      },
      signal: requestController.signal,
    });
    const data = await response.json().catch(() => ({}));
    if (response.status === 401) return leaveAdmin();
    if (!response.ok) throw new Error(data.message || 'No fue posible recuperar los contactos.');
    if (activeRequest !== requestController) return;
    renderContacts(data.contacts);
  } catch (error) {
    if (error.name !== 'AbortError') {
      feedback.textContent = error.message;
      feedback.className = 'feedback error';
    }
  } finally {
    if (activeRequest === requestController) {
      refreshButton.disabled = false;
      refreshButton.textContent = 'Actualizar';
    }
  }
}

document.querySelector('#logout').addEventListener('click', leaveAdmin);
refreshButton.addEventListener('click', () => loadContacts(searchInput.value));
searchInput.addEventListener('input', () => {
  clearTimeout(searchTimer);
  searchTimer = setTimeout(() => loadContacts(searchInput.value), 250);
});
loadContacts();
