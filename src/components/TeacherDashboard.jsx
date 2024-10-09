import React, { useEffect, useState } from 'react';
import { Table, Button, Modal, Form } from 'react-bootstrap';
import { collection, query, where, getDocs, updateDoc, doc } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { db } from '../firebase/firebaseConfig';
// import { db } from '../firebase'; // Import Firestore instance

const TeacherDashboard = () => {
    const [courses, setCourses] = useState([]);
    const [students, setStudents] = useState([]);
    const [selectedCourse, setSelectedCourse] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [grades, setGrades] = useState({});
    const auth = getAuth();

    // Fetch assigned courses for the logged-in teacher
    useEffect(() => {
        const fetchCourses = async () => {
            try {
                const user = auth.currentUser;
                if (user) {
                    const q = query(collection(db, 'courses'), where('assignedTeacherId', '==', user.uid));
                    const courseSnapshot = await getDocs(q);
                    const courseData = courseSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                    setCourses(courseData);
                }
            } catch (error) {
                console.error('Error fetching courses: ', error);
            }
        };

        fetchCourses();
    }, [auth]);

    // Fetch students enrolled in a selected course
    const fetchStudents = async (courseId) => {
        try {
            const q = query(collection(db, 'students'), where('courseId', '==', courseId));
            const studentSnapshot = await getDocs(q);
            const studentData = studentSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setStudents(studentData);
            setSelectedCourse(courseId);
        } catch (error) {
            console.error('Error fetching students: ', error);
        }
    };

    // Handle opening modal for assigning grades
    const handleShowModal = (studentId) => {
        setShowModal(true);
        setGrades((prevGrades) => ({ ...prevGrades, [studentId]: '' }));
    };

    const handleCloseModal = () => setShowModal(false);

    const handleGradeChange = (e, studentId) => {
        setGrades((prevGrades) => ({ ...prevGrades, [studentId]: e.target.value }));
    };

    // Save grades for a student
    const saveGrades = async (studentId) => {
        try {
            const grade = grades[studentId];
            if (grade) {
                const studentRef = doc(db, 'students', studentId);
                await updateDoc(studentRef, { grade });
                setShowModal(false);
            }
        } catch (error) {
            console.error('Error saving grades: ', error);
        }
    };

    return (
        <div>
            <h2>Teacher Dashboard</h2>
            <h4>Your Courses</h4>
            <Table striped bordered hover>
                <thead>
                    <tr>
                        <th>Course Name</th>
                        <th>Description</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {courses.map(course => (
                        <tr key={course.id}>
                            <td>{course.title}</td>
                            <td>{course.description}</td>
                            <td>
                                <Button variant="primary" onClick={() => fetchStudents(course.id)}>View Students</Button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>

            {selectedCourse && (
                <>
                    <h4>Students in {courses.find(c => c.id === selectedCourse).title}</h4>
                    <Table striped bordered hover>
                        <thead>
                            <tr>
                                <th>Student Name</th>
                                <th>Progress</th>
                                <th>Grade</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {students.map(student => (
                                <tr key={student.id}>
                                    <td>{student.name}</td>
                                    <td>{student.progress}</td>
                                    <td>{student.grade || 'Not graded'}</td>
                                    <td>
                                        <Button variant="warning" onClick={() => handleShowModal(student.id)}>Manage Grade</Button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                </>
            )}

            {/* Modal for assigning grades */}
            <Modal show={showModal} onHide={handleCloseModal}>
                <Modal.Header closeButton>
                    <Modal.Title>Assign Grade</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        {students.map(student => (
                            <Form.Group controlId="formGrade" key={student.id}>
                                <Form.Label>Grade for {student.name}</Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="Enter Grade"
                                    value={grades[student.id] || ''}
                                    onChange={(e) => handleGradeChange(e, student.id)}
                                />
                            </Form.Group>
                        ))}
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseModal}>Close</Button>
                    <Button variant="primary" onClick={() => saveGrades(students[0].id)}>Save Changes</Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
};

export default TeacherDashboard;
