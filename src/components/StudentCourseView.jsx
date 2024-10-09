import React, { useState, useEffect } from 'react';
import { collection, getDoc, getDocs, addDoc, doc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '../firebase/firebaseConfig'; // Import Firebase Firestore and Storage
import { Form, Button, Table } from 'react-bootstrap';

const StudentCourseView = ({ studentId }) => {
    const [courses, setCourses] = useState([]);
    const [selectedCourse, setSelectedCourse] = useState('');
    const [assignments, setAssignments] = useState([]);
    const [file, setFile] = useState(null);
    const [assignmentId, setAssignmentId] = useState('');

    // Fetch all courses the student is enrolled in
    useEffect(() => {
        const fetchCourses = async () => {
            const studentDocRef = doc(db, 'students', studentId);
            const studentDoc = await getDoc(studentDocRef);
            if (studentDoc.exists()) {
                const enrolledCourses = studentDoc.data().enrolledCourses || [];
                console.log("enrolled courses", enrolledCourses);

                const coursesCollection = collection(db, 'courses');
                const coursesSnapshot = await getDocs(coursesCollection);
                const studentCourses = coursesSnapshot.docs
                    .filter((course) => enrolledCourses.includes(course.id))
                    .map((doc) => ({ id: doc.id, ...doc.data() }));
                console.log("student courses", studentCourses);

                setCourses(studentCourses);
            }
        };
        fetchCourses();
    }, [studentId]);

    // Fetch assignments for the selected course
    useEffect(() => {
        if (selectedCourse) {
            const fetchAssignments = async () => {
                const contentCollection = collection(db, `courses/${selectedCourse}/content`);
                const contentSnapshot = await getDocs(contentCollection);
                setAssignments(contentSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
            };
            fetchAssignments();
        }
    }, [selectedCourse]);

    // Submit assignment to Firebase Storage and store metadata in Firestore
    const handleSubmitAssignment = async (e) => {
        e.preventDefault();
        if (!file || !selectedCourse || !assignmentId) {
            alert('Please select an assignment and upload a file.');
            return;
        }

        // Firebase Storage Reference for the student's submission
        const fileRef = ref(storage, `submissions/${selectedCourse}/${studentId}/${file.name}`);

        try {
            // Upload file to Firebase Storage
            await uploadBytes(fileRef, file);

            // Get the download URL of the uploaded file
            const fileUrl = await getDownloadURL(fileRef);

            // Store the submission metadata in Firestore
            await addDoc(collection(db, `courses/${selectedCourse}/submissions`), {
                studentId,
                assignmentId,
                fileUrl,
                timestamp: new Date(),
            });

            // Clear form
            setFile(null);
            setAssignmentId('');

            alert('Assignment submitted successfully!');
        } catch (error) {
            console.error('Error submitting assignment: ', error);
        }
    };

    return (
        <div>
            <h2>View Courses and Submit Assignments</h2>

            {/* Course Selector */}
            <Form.Group controlId="formSelectCourse">
                <Form.Label>Select Course</Form.Label>
                <Form.Control
                    as="select"
                    value={selectedCourse}
                    onChange={(e) => setSelectedCourse(e.target.value)}
                    required
                >
                    {/* <option value="">-- Select a Course --</option>
          {courses.map((course) => (
            <option key={course.id} value={course.id}>
              {course.title}
            </option>
          ))} */}

                    <option value="">-- Select a Course --</option>
                    {courses.length > 0 ? (
                        courses.map((course) => (
                            <option key={course.id} value={course.id}>
                                {course.title}
                            </option>
                        ))
                    ) : (
                        <option value="" disabled>No courses available</option>
                    )}

                </Form.Control>
            </Form.Group>

            {/* Assignment List */}
            {selectedCourse && assignments.length > 0 && (
                <div>
                    <h4>Assignments</h4>
                    <Table striped bordered>
                        <thead>
                            <tr>
                                <th>Assignment Title</th>
                                <th>File</th>
                            </tr>
                        </thead>
                        <tbody>
                            {assignments.map((assignment) => (
                                <tr key={assignment.id}>
                                    <td>{assignment.title}</td>
                                    <td>
                                        <a href={assignment.fileUrl} target="_blank" rel="noopener noreferrer">
                                            View Assignment
                                        </a>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                </div>
            )}

            {/* Assignment Submission */}
            {selectedCourse && assignments.length > 0 && (
                <Form onSubmit={handleSubmitAssignment}>
                    <Form.Group controlId="formSelectAssignment">
                        <Form.Label>Select Assignment to Submit</Form.Label>
                        <Form.Control
                            as="select"
                            value={assignmentId}
                            onChange={(e) => setAssignmentId(e.target.value)}
                            required
                        >
                            <option value="">-- Select Assignment --</option>
                            {assignments.map((assignment) => (
                                <option key={assignment.id} value={assignment.id}>
                                    {assignment.title}
                                </option>
                            ))}
                        </Form.Control>
                    </Form.Group>

                    <Form.Group controlId="formFile">
                        <Form.Label>Upload Assignment</Form.Label>
                        <Form.Control
                            type="file"
                            onChange={(e) => setFile(e.target.files[0])}
                            required
                        />
                    </Form.Group>

                    <Button type="submit">Submit Assignment</Button>
                </Form>
            )}
        </div>
    );
};

export default StudentCourseView;
