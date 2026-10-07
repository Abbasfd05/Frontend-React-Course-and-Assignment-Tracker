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
    <ul style={{ listStyle: 'none', padding: 0 }}>
      {users.map((u) => (
        <li
          key={u.id}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '1rem',
            padding: '0.5rem 0',
            borderBottom: '1px solid #eee',
          }}
        >
          <span style={{ flex: 1 }}>
            {u.username} ({u.email})
          </span>
          <select
            value={u.role}
            onChange={(e) => handleRoleChange(u.id, e.target.value)}
            style={{ width: '140px' }}
          >
            {ROLES.map((r) => (
              <option key={r} value={r}>{r}</option>
            ))}
          </select>
          <button
            onClick={() => handleDelete(u.id)}
            disabled={currentUser?.id === u.id}
            style={{ width: '80px' }}
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