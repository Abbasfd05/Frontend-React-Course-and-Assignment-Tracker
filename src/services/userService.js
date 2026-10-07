// THIS IS A DEMO OF AN AUTHENTICATED FETCH REQUEST

const BASE_URL = `${import.meta.env.VITE_BACK_END_SERVER_URL}`;

function authHeaders() {
  return {
    Authorization:`Bearer ${localStorage.getItem('token')}`
  }
}

const currentUser = async () => {
  try {
  
    const res = await fetch(`${BASE_URL}/current_user`, {headers: authHeaders()});

    const data = await res.json();

    if (data.detail) {
      throw new Error(data.detail);
    }

    return data
  } catch (err) {
    console.log(err);
    throw new Error(err, { cause: err });
  }
};

const getUsers = async () => {
  const res = await fetch(`${BASE_URL}/users`, { headers: authHeaders() });
  const data = await res.json();
  if (data.detail) throw new Error(data.detail);
  return data;
};

const updateUserRole = async (userId, role) => {
  const res = await fetch(`${BASE_URL}/users/${userId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', ...authHeaders() },
    body: JSON.stringify({ role }),
  });
  const data = await res.json();
  if (data.detail) throw new Error(data.detail);
  return data;
};

const deleteUser = async (userId) => {
  const res = await fetch(`${BASE_URL}/users/${userId}`, {
    method: 'DELETE',
    headers: authHeaders(),
  });
  if (res.status !== 204) {
    const data = await res.json();
    if (data.detail) throw new Error(data.detail);
  }
};

export {
   currentUser,
  getUsers,
  updateUserRole,
  deleteUser,
};