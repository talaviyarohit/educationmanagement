// src/components/StudentDashboard.js
import React, { useEffect, useState } from 'react';
import { Table, Button } from 'react-bootstrap';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { db } from '../firebase/firebaseConfig';
 // Firebase initialization

const StudentDashboard = () => {
    const [enrolledCourses, setEnrolledCourses] = useState([]);
    const [assignments, setAssignments] = useState([]);
    const [selectedCourse, setSelectedCourse] = useState(null);
    const auth = getAuth();

    // Fetch enrolled courses for the logged-in student
    useEffect(() => {
        const fetchEnrolledCourses = async () => {
            try {
                const user = auth.currentUser;
                if (user) {
                    const q = query(collection(db, 'students'), where('studentId', '==', user.uid));
                    const studentSnapshot = await getDocs(q);

                    if (!studentSnapshot.empty) {
                        const studentData = studentSnapshot.docs[0].data();
                        setEnrolledCourses(studentData.enrolledCourses || []);
                    }
                }
            } catch (error) {
                console.error('Error fetching enrolled courses: ', error);
            }
        };

        fetchEnrolledCourses();
    }, [auth]);

    // Fetch assignments for the selected course
    const fetchAssignments = async (courseId) => {
        try {
            const q = query(collection(db, 'assignments'), where('courseId', '==', courseId));
            const assignmentSnapshot = await getDocs(q);
            const assignmentData = assignmentSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setAssignments(assignmentData);
            setSelectedCourse(courseId);
        } catch (error) {
            console.error('Error fetching assignments: ', error);
        }
    };

    return (
        <div>
            <h2>Student Dashboard</h2>
            <h4>Your Enrolled Courses</h4>
            <Table striped bordered hover>
                <thead>
                    <tr>
                        <th>Course Name</th>
                        <th>Description</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {enrolledCourses.map(course => (
                        <tr key={course.id}>
                            <td>{course.title}</td>
                            <td>{course.description}</td>
                            <td>
                                <Button variant="primary" onClick={() => fetchAssignments(course.id)}>
                                    View Assignments
                                </Button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>

            {selectedCourse && (
                <>
                    <h4>Assignments for {enrolledCourses.find(c => c.id === selectedCourse).title}</h4>
                    <Table striped bordered hover>
                        <thead>
                            <tr>
                                <th>Assignment Title</th>
                                <th>Description</th>
                                <th>Due Date</th>
                            </tr>
                        </thead>
                        <tbody>
                            {assignments.map(assignment => (
                                <tr key={assignment.id}>
                                    <td>{assignment.title}</td>
                                    <td>{assignment.description}</td>
                                    <td>{assignment.dueDate}</td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                </>
            )}
        </div>
    );
};

export default StudentDashboard;
