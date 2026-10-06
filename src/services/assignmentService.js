const BASE_URL = `${import.meta.env.VITE_BACK_END_SERVER_URL}`;

function authHeaders() {
  return { Authorization: `Bearer ${localStorage.getItem('token')}` };
}

async function handle(res) {
  const data = res.status === 204 ? null : await res.json();
  if (data && data.detail) throw new Error(data.detail);
  return data;
}

const getAssignments = (courseId) =>
  fetch(`${BASE_URL}/courses/${courseId}/assignments`, { headers: authHeaders() }).then(handle);

const createAssignment = (courseId, payload) =>
  fetch(`${BASE_URL}/courses/${courseId}/assignments`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...authHeaders() },
    body: JSON.stringify(payload),
  }).then(handle);

const updateAssignment = (id, payload) =>
  fetch(`${BASE_URL}/assignments/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', ...authHeaders() },
    body: JSON.stringify(payload),
  }).then(handle);

const deleteAssignment = (id) =>
  fetch(`${BASE_URL}/assignments/${id}`, {
    method: 'DELETE',
    headers: authHeaders(),
  }).then(handle);

export { getAssignments, createAssignment, updateAssignment, deleteAssignment };