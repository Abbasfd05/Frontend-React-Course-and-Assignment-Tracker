import { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router';
import { UserContext } from '../../contexts/UserContext';
import { getCourses, createCourse, deleteCourse } from '../../services/courseService';
import CourseForm from '../CourseForm/CourseForm';
import { currentUser } from '../../services/userService';

const Dashboard = () => {
  const { user } = useContext(UserContext);
   const [courses, setCourses] = useState([]);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
   const loadCourses = async () => {
    try {
      setCourses(await getCourses());
    } catch (err) {
      setError(err.message);
    }
  };

  useEffect(() => {
    loadCourses();
  }, []);
  const handleCreate = async (formData) => {
    try {
      await createCourse(formData);
      setShowForm(false);
      loadCourses();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteCourse(id);
      loadCourses();
    } catch (err) {
      setError(err.message);
    }
  };

  const canEdit = (course) =>
    user.role === 'admin' || course.instructor_id === user.id;

  return (
    <main>
      <h1>Welcome, {user.username}</h1>
      <p>
        {error}
      </p>
      {(user.role === 'instructor' || user.role === 'admin') && (
        <>
          {showForm ? (
            <CourseForm onSubmit={handleCreate} onCancel={() => setShowForm(false)} />
          ) : (
            <button onClick={() => setShowForm(true)}>New Course</button>
          )}
        </>
      )}

      <h2>Courses</h2>
      <ul>
        {courses.map((course) => (
          <li key={course.id}>
            <Link to={`/courses/${course.id}`}>{course.title}</Link> — {course.semester}
            {canEdit(course) && (
              <button onClick={() => handleDelete(course.id)}>Delete</button>
            )}
          </li>
        ))}
      </ul>
    </main>
  );
};

export default Dashboard;
