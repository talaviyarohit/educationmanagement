import React, { useState, useEffect } from 'react';
import { collection, getDocs, addDoc, deleteDoc, doc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '../firebase/firebaseConfig'; // Import Firebase Firestore and Storage
import { Form, Button, Table } from 'react-bootstrap';

const TeacherCourseContent = () => {
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState('');
  const [contentTitle, setContentTitle] = useState('');
  const [file, setFile] = useState(null);
  const [contentList, setContentList] = useState([]);

  // Fetch courses for the teacher
  useEffect(() => {
    const fetchCourses = async () => {
      const coursesCollection = collection(db, 'courses');
      const coursesSnapshot = await getDocs(coursesCollection);
      setCourses(coursesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    };
    fetchCourses();
  }, []);

  // Fetch course content for the selected course
  useEffect(() => {
    if (selectedCourse) {
      const fetchContent = async () => {
        const contentCollection = collection(db, `courses/${selectedCourse}/content`);
        const contentSnapshot = await getDocs(contentCollection);
        setContentList(contentSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      };
      fetchContent();
    }
  }, [selectedCourse]);

  // Upload content (assignment/quiz) to Firebase Storage and store metadata in Firestore
  const handleUploadContent = async (e) => {
    e.preventDefault();
    if (!file || !selectedCourse || !contentTitle) {
      alert('Please fill in all fields and upload a file.');
      return;
    }

    // Firebase Storage Reference
    const fileRef = ref(storage, `courses/${selectedCourse}/${file.name}`);

    try {
      // Upload file to Firebase Storage
      await uploadBytes(fileRef, file);
      
      

      // Get the download URL of the uploaded file
      const fileUrl = await getDownloadURL(fileRef);
      console.log("ok",fileUrl);
      

      // Add metadata to Firestore
      await addDoc(collection(db, `courses/${selectedCourse}/content`), {
        title: contentTitle,
        fileUrl,
        timestamp: new Date(),
      });

      // Clear form
      setContentTitle('');
      setFile(null);

      alert('Content uploaded successfully!');
    } catch (error) {
      console.error('Error uploading content: ', error);
    }
  };

  // Delete content
  const handleDeleteContent = async (contentId) => {
    try {
      await deleteDoc(doc(db, `courses/${selectedCourse}/content`, contentId));
      alert('Content deleted successfully!');
    } catch (error) {
      console.error('Error deleting content: ', error);
    }
  };

  return (
    <div>
      <h2>Manage Course Content</h2>

      {/* Course Selector */}
      <Form.Group controlId="formSelectCourse">
        <Form.Label>Select Course</Form.Label>
        <Form.Control
          as="select"
          value={selectedCourse}
          onChange={(e) => setSelectedCourse(e.target.value)}
          required
        >
          <option value="">-- Select a Course --</option>
          {courses.map((course) => (
            <option key={course.id} value={course.id}>
              {course.title}
            </option>
          ))}
        </Form.Control>
      </Form.Group>

      {/* Upload Assignment/Quiz */}
      {selectedCourse && (
        <Form onSubmit={handleUploadContent}>
          <Form.Group controlId="formContentTitle">
            <Form.Label>Content Title</Form.Label>
            <Form.Control
              type="text"
              value={contentTitle}
              onChange={(e) => setContentTitle(e.target.value)}
              required
            />
          </Form.Group>

          <Form.Group controlId="formFile">
            <Form.Label>Upload Assignment/Quiz</Form.Label>
            <Form.Control
              type="file"
              onChange={(e) => setFile(e.target.files[0])}
              required
            />
          </Form.Group>

          <Button type="submit">Upload Content</Button>
        </Form>
      )}

      {/* Display Uploaded Content */}
      <h4>Uploaded Content</h4>
      {contentList.length > 0 ? (
        <Table striped bordered>
          <thead>
            <tr>
              <th>Title</th>
              <th>File URL</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {contentList.map((content) => (
              <tr key={content.id}>
                <td>{content.title}</td>
                <td>
                  <a href={content.fileUrl} target="_blank" rel="noopener noreferrer">
                    View File
                  </a>
                </td>
                <td>
                  <Button variant="danger" onClick={() => handleDeleteContent(content.id)}>
                    Delete
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      ) : (
        <p>No content uploaded yet.</p>
      )}
    </div>
  );
};

export default TeacherCourseContent;
