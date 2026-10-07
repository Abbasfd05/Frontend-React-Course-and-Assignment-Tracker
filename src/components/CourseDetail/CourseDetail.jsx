import { useContext, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import { UserContext } from '../../contexts/UserContext';
import {
  getCourse, enrollInCourse, unenrollFromCourse, getEnrolledStudents,
} from '../../services/courseService';
import {
  getAssignments, createAssignment, deleteAssignment,
} from '../../services/assignmentService';

const CourseDetail = () => {
  const { courseId } = useParams();
  const navigate=useNavigate();
  const { user } = useContext(UserContext);
  const [course, setCourse] = useState(null);
  const [assignments, setAssignments] = useState([]);
  const [students, setStudents] = useState([]);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({ title: '', description: '', due_date: '' });

  const isOwner = course && (user.role === 'admin' || course.instructor_id === user.id);

  const load = async () => {
    try {
      setCourse(await getCourse(courseId));
      setAssignments(await getAssignments(courseId));
    } catch (err) {
      setError(err.message);
    }
  };

  useEffect(() => {
    load();
  }, [courseId]);

  useEffect(() => {
    if (isOwner) {
      getEnrolledStudents(courseId).then(setStudents).catch((err) => setError(err.message));
    }
  }, [isOwner, courseId]);

  const handleEnroll = async () => {
    try {
      await enrollInCourse(courseId);
      load();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleUnenroll = async () => {
    try {
      await unenrollFromCourse(courseId);
      Navigate('/');
      load();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleCreateAssignment = async (evt) => {
    evt.preventDefault();
    try {
      await createAssignment(courseId, formData);
      setFormData({ title: '', description: '', due_date: '' });
      load();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDeleteAssignment = async (id) => {
    try {
      await deleteAssignment(id);
      load();
    } catch (err) {
      setError(err.message);
    }
  };

  if (!course) return <main><p>{error || 'Loading...'}</p></main>;

  return (
    <main>
      <h1>{course.title}</h1>
      <p>{course.description}</p>
      <p>{error}</p>

      {user.role === 'student' && (
        <>
          <button onClick={handleEnroll}>Enroll</button>
          <button onClick={handleUnenroll}>Unenroll</button>
        </>
      )}

      <h2>Assignments</h2>
      <ul>
        {assignments.map((a) => (
          <li key={a.id}>
            {a.title} {a.due_date && `(due ${a.due_date})`}
            {isOwner && (
              <button onClick={() => handleDeleteAssignment(a.id)}>Delete</button>
            )}
          </li>
        ))}
      </ul>

      {isOwner && (
        <>
          <form onSubmit={handleCreateAssignment}>
            <h3>New Assignment</h3>
            <input
              placeholder="Title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
            />
            <input
              placeholder="Description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />
            <input
              type="date"
              value={formData.due_date}
              onChange={(e) => setFormData({ ...formData, due_date: e.target.value })}
            />
            <button>Add Assignment</button>
          </form>

          <h2>Enrolled Students</h2>
          <ul>
            {students.map((s) => (
              <li key={s.id}>{s.username} ({s.email})</li>
            ))}
          </ul>
        </>
      )}
    </main>
  );
};

export default CourseDetail;