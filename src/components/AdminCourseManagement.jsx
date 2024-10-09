import React, { useState, useEffect } from 'react';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore';
import { db} from '../firebase/firebaseConfig'
 // Import Firebase connection
import { Form, Button, Table } from 'react-bootstrap';

const AdminCourseManagement = () => {
  const [courses, setCourses] = useState([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [assignedTeacher, setAssignedTeacher] = useState('');
  const [editingCourseId, setEditingCourseId] = useState(null);

  // Fetch courses from Firestore
  useEffect(() => {
    const fetchCourses = async () => {
      const coursesCollection = collection(db, 'courses');
      const coursesSnapshot = await getDocs(coursesCollection);
      setCourses(coursesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    };
    fetchCourses();
  }, []);

  // Create a new course
  const handleCreateCourse = async (e) => {
    e.preventDefault();
    try {
      await addDoc(collection(db, 'courses'), {
        title,
        description,
        startDate,
        endDate,
        assignedTeacher,
      });
      setTitle('');
      setDescription('');
      setStartDate('');
      setEndDate('');
      setAssignedTeacher('');
      alert('Course created successfully!');
    } catch (error) {
      console.error('Error adding course: ', error);
    }
  };

  // Update an existing course
  const handleUpdateCourse = async (e) => {
    e.preventDefault();
    if (!editingCourseId) return;
    try {
      const courseRef = doc(db, 'courses', editingCourseId);
      await updateDoc(courseRef, {
        title,
        description,
        startDate,
        endDate,
        assignedTeacher,
      });
      setEditingCourseId(null);
      setTitle('');
      setDescription('');
      setStartDate('');
      setEndDate('');
      setAssignedTeacher('');
      alert('Course updated successfully!');
    } catch (error) {
      console.error('Error updating course: ', error);
    }
  };

  // Delete a course
  const handleDeleteCourse = async (courseId) => {
    try {
      const courseRef = doc(db, 'courses', courseId);
      await deleteDoc(courseRef);
      alert('Course deleted successfully!');
    } catch (error) {
      console.error('Error deleting course: ', error);
    }
  };

  // Handle course selection for editing
  const handleEditClick = (course) => {
    setEditingCourseId(course.id);
    setTitle(course.title);
    setDescription(course.description);
    setStartDate(course.startDate);
    setEndDate(course.endDate);
    setAssignedTeacher(course.assignedTeacher);
  };

  return (
    <div>
      <h2>Admin Course Management</h2>

      {/* Course Form (Create or Edit) */}
      <Form onSubmit={editingCourseId ? handleUpdateCourse : handleCreateCourse}>
        <Form.Group controlId="formCourseTitle">
          <Form.Label>Title</Form.Label>
          <Form.Control
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </Form.Group>
        <Form.Group controlId="formCourseDescription">
          <Form.Label>Description</Form.Label>
          <Form.Control
            as="textarea"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
        </Form.Group>
        <Form.Group controlId="formStartDate">
          <Form.Label>Start Date</Form.Label>
          <Form.Control
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            required
          />
        </Form.Group>
        <Form.Group controlId="formEndDate">
          <Form.Label>End Date</Form.Label>
          <Form.Control
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            required
          />
        </Form.Group>
        <Form.Group controlId="formAssignedTeacher">
          <Form.Label>Assigned Teacher</Form.Label>
          <Form.Control
            type="text"
            value={assignedTeacher}
            onChange={(e) => setAssignedTeacher(e.target.value)}
            required
          />
        </Form.Group>
        <Button type="submit">{editingCourseId ? 'Update Course' : 'Create Course'}</Button>
      </Form>

      {/* Course Table */}
      <h4>Courses</h4>
      <Table striped bordered>
        <thead>
          <tr>
            <th>Title</th>
            <th>Description</th>
            <th>Start Date</th>
            <th>End Date</th>
            <th>Assigned Teacher</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {courses.map((course) => (
            <tr key={course.id}>
              <td>{course.title}</td>
              <td>{course.description}</td>
              <td>{course.startDate}</td>
              <td>{course.endDate}</td>
              <td>{course.assignedTeacher}</td>
              <td>
                <Button variant="warning" onClick={() => handleEditClick(course)}>Edit</Button>
                <Button variant="danger" onClick={() => handleDeleteCourse(course.id)}>Delete</Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
};

export default AdminCourseManagement;
