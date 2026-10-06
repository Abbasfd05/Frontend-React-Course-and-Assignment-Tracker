import { createContext, useState, useEffect } from 'react';
import { getUserFromToken, removeToken } from '../lib/helpers/jwt-helpers';
import { currentUser } from '../services/userService';

const UserContext = createContext();

function UserProvider({ children }) {

 const [user, setUser] = useState(getUserFromToken())
 const [loading,setLoading]=useState(true);

 // The JWT payload only has {sub, iat, exp} — no role or username — so once
  // we know a token exists, fetch the real profile to get those fields.
  useEffect(() => {
    async function loadProfile() {
      const tokenPayload = getUserFromToken();
      if (!tokenPayload) {
        setLoading(false);
        return;
      }
      try {
        const profile = await currentUser(); // { id, username, email, role }
        setUser(profile);
      } catch (err) {
        console.log(err);
        removeToken();
        setUser(null);
      } finally {
        setLoading(false);
      }
    }
    loadProfile();
  }, []);

  const value= {user, setUser, loading};

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
};

export { UserProvider, UserContext };
