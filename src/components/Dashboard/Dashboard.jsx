import { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router';
import { UserContext } from '../../contexts/UserContext';
import {
  getCourses, getAvailableCourses, createCourse, deleteCourse, enrollInCourse,
} from '../../services/courseService';
import CourseForm from '../CourseForm/CourseForm';

const Dashboard = () => {
  const { user } = useContext(UserContext);
  const [courses, setCourses] = useState([]);
  const [enrolledIds, setEnrolledIds] = useState(new Set());
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);

  const isStudent = user.role === 'student';

  const loadCourses = async () => {
    try {
      if (isStudent) {
        const [available, enrolled] = await Promise.all([
          getAvailableCourses(),
          getCourses(), // for students, this already returns only their enrolled courses
        ]);
        setCourses(available);
        setEnrolledIds(new Set(enrolled.map((c) => c.id)));
      } else {
        setCourses(await getCourses());
      }
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

  const handleEnroll = async (id) => {
    try {
      await enrollInCourse(id);
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
      <p>{error}</p>

      {(user.role === 'instructor' || user.role === 'admin') && (
        <>
          {showForm ? (
            <CourseForm onSubmit={handleCreate} onCancel={() => setShowForm(false)} />
          ) : (
            <button onClick={() => setShowForm(true)}>New Course</button>
          )}
        </>
      )}

      <h2>{isStudent ? 'Browse Courses' : 'Courses'}</h2>
      <ul>
        {courses.map((course) => (
          <li key={course.id}>
            <Link to={`/courses/${course.id}`}>{course.title}</Link> — {course.semester}
            {isStudent && (
              enrolledIds.has(course.id) ? (
                <span className="badge badge-enrolled">✓ Enrolled</span>
              ) : (
                <button onClick={() => handleEnroll(course.id)}>Enroll</button>
              )
            )}
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