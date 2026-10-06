import { useState } from 'react';

// Reusable for both create (no `course` prop) and edit (`course` prop passed in).
const CourseForm = ({ course, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    title: course?.title || '',
    description: course?.description || '',
    semester: course?.semester || '',
  });

  const handleChange = (evt) => {
    setFormData({ ...formData, [evt.target.name]: evt.target.value });
  };

  const handleSubmit = (evt) => {
    evt.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>{course ? 'Edit Course' : 'New Course'}</h2>
      <div>
        <label htmlFor="title">Title:</label>
        <input
          id="title"
          name="title"
          value={formData.title}
          onChange={handleChange}
          required
        />
      </div>
      <div>
        <label htmlFor="description">Description:</label>
        <input
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
        />
      </div>
      <div>
        <label htmlFor="semester">Semester:</label>
        <input
          id="semester"
          name="semester"
          value={formData.semester}
          onChange={handleChange}
        />
      </div>
      <button type="submit">{course ? 'Save' : 'Create Course'}</button>
      {onCancel && <button type="button" onClick={onCancel}>Cancel</button>}
    </form>
  );
};

export default CourseForm;