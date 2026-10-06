import { useContext } from 'react';
import { Route, Routes } from 'react-router';

// Components
import NavBar from './components/NavBar/NavBar';
import SignUpForm from './components/SignUpForm/SignUpForm';
import SignInForm from './components/SignInForm/SignInForm';
import Dashboard from './components/Dashboard/Dashboard'
import Landing from './components/Landing/Landing'
import CourseDetail from './components/CourseDetail/CourseDetail';
import AdminUsers from './components/AdminUsers/AdminUsers';

// Context
import { UserContext } from './contexts/UserContext';

const App = () => {
  const { user, loading } = useContext(UserContext)
  if (loading)
    return <p>Loading...</p>;

 
 return (
    <>
      <NavBar />
      <Routes>
        <Route path='/' element={user ? <Dashboard /> : <Landing/> } />
        <Route path='/sign-up' element={<SignUpForm />} />
        <Route path='/sign-in' element={<SignInForm />} />
         {user && <Route path='/courses/:courseId' element={<CourseDetail />} />}
        {user?.role === 'admin' && <Route path='/admin/users' element={<AdminUsers />} />}
      </Routes>
    </>
  );
};

export default App;
