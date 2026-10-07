import { useContext, useEffect, useState } from 'react';
import { getUsers, updateUserRole, deleteUser } from '../../services/userService';
import { UserContext } from '../../contexts/UserContext';

const ROLES = ['student', 'instructor', 'admin'];

const AdminUsers = () => {
  const { user: currentUser } = useContext(UserContext);
  const [users, setUsers] = useState([]);
  const [error, setError] = useState('');

  const load = async () => {
    try {
      setUsers(await getUsers());
    } catch (err) {
      setError(err.message);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const handleRoleChange = async (id, role) => {
    try {
      await updateUserRole(id, role);
      load();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDelete = async (id, username) => {
    try {
      await deleteUser(id);
      load();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <main>
      <h1>Manage Users</h1>
      <p>{error}</p>
      <ul>
        {users.map((u) => (
          <li key={u.id}>
            {u.username} ({u.email})
            <select value={u.role} onChange={(e) => handleRoleChange(u.id, e.target.value)}>
              {ROLES.map((r) => (
                <option key={r} value={r}>{r}</option>
              ))}
            </select>
            <button
              onClick={() => handleDelete(u.id, u.username)}
              disabled={currentUser?.id === u.id}
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
    </main>
  );
};

export default AdminUsers;