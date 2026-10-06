import { useContext } from 'react';
import { Link, useNavigate } from 'react-router';
import { UserContext } from '../../contexts/UserContext';
import { removeToken } from '../../lib/helpers/jwt-helpers';

const NavBar = () => {

  const { user, setUser } = useContext(UserContext)
  const navigate = useNavigate();

  const handleSignOut = ()=>{
    removeToken();
    setUser(null);
    navigate('/');
  }

  return (
    <nav>
         <Link to="/">CoursePilot</Link>
      {user ? (
        <>
          <span>
            {user.username} ({user.role})
          </span>
          {user.role === 'admin' && <Link to="/admin/users">Manage Users</Link>}
          <button onClick={handleSignOut}>Sign Out</button>
        </>
      ) : (
        <>
          <Link to="/sign-in">Sign In</Link>
          <Link to="/sign-up">Sign Up</Link>
        </>
      )}
    </nav>
  );
};

export default NavBar;