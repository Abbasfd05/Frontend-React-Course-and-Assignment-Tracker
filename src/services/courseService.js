const BASE_URL = `${import.meta.env.VITE_BACK_END_SERVER_URL}`;

function authHeaders() {
  return { Authorization: `Bearer ${localStorage.getItem('token')}` };
}

async function handle(res) {
  const data = res.status === 204 ? null : await res.json();
  if (data && data.detail) throw new Error(data.detail);
  return data;
}

const getCourses = () =>
  fetch(`${BASE_URL}/courses`, { headers: authHeaders() }).then(handle);

const getCourse = (id) =>
  fetch(`${BASE_URL}/courses/${id}`, { headers: authHeaders() }).then(handle);

const createCourse = (payload) =>
  fetch(`${BASE_URL}/courses`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...authHeaders() },
    body: JSON.stringify(payload),
  }).then(handle);

const updateCourse = (id, payload) =>
  fetch(`${BASE_URL}/courses/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', ...authHeaders() },
    body: JSON.stringify(payload),
  }).then(handle);

const deleteCourse = (id) =>
  fetch(`${BASE_URL}/courses/${id}`, {
    method: 'DELETE',
    headers: authHeaders(),
  }).then(handle);

const enrollInCourse = (id) =>
  fetch(`${BASE_URL}/courses/${id}/enroll`, {
    method: 'POST',
    headers: authHeaders(),
  }).then(handle);

const unenrollFromCourse = (id) =>
  fetch(`${BASE_URL}/courses/${id}/enroll`, {
    method: 'DELETE',
    headers: authHeaders(),
  }).then(handle);

const getEnrolledStudents = (id) =>
  fetch(`${BASE_URL}/courses/${id}/students`, { headers: authHeaders() }).then(handle);


const getAvailableCourses = () =>
  fetch(`${BASE_URL}/courses/available`, { headers: authHeaders() }).then(handle);

export {
  getCourses, getCourse, createCourse, updateCourse, deleteCourse,
  enrollInCourse, unenrollFromCourse, getEnrolledStudents, getAvailableCourses,
};