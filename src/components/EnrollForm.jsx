// src/components/EnrollForm.js
import React, { useState, useEffect } from 'react';
import { db} from '../firebase/firebaseConfig'
import { collection, getDocs, addDoc } from 'firebase/firestore';
import { Form, Button } from 'react-bootstrap';

const EnrollForm = () => {
    const [courses, setCourses] = useState([]);
    const [selectedCourse, setSelectedCourse] = useState('');
    const [studentName, setStudentName] = useState('');

    useEffect(() => {
        const fetchCourses = async () => {
            const coursesCollectionRef = collection(db, 'courses');
            const data = await getDocs(coursesCollectionRef);
            setCourses(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
        };

        fetchCourses();
    }, []);

    const handleEnroll = async (e) => {
        e.preventDefault();
        try {
            await addDoc(collection(db, 'enrollments'), {
                courseId: selectedCourse,
                studentName,
            });
            setSelectedCourse('');
            setStudentName('');
            alert('Enrollment successful!');
        } catch (error) {
            console.error('Error enrolling: ', error);
        }
    };

    return (
        <div>
            <h2>Enroll in Course</h2>
            <Form onSubmit={handleEnroll}>
                <Form.Group controlId="formSelectCourse">
                    <Form.Label>Select Course</Form.Label>
                    <Form.Control
                        as="select"
                        value={selectedCourse}
                        onChange={(e) => setSelectedCourse(e.target.value)}
                        required
                    >
                        <option value="">Choose a course...</option>
                        {courses.map((course) => (
                            <option key={course.id} value={course.id}>
                                {course.title}
                            </option>
                        ))}
                    </Form.Control>
                </Form.Group>
                <Form.Group controlId="formStudentName">
                    <Form.Label>Student Name</Form.Label>
                    <Form.Control
                        type="text"
                        placeholder="Enter student name"
                        value={studentName}
                        onChange={(e) => setStudentName(e.target.value)}
                        required
                    />
                </Form.Group>
                <Button variant="primary" type="submit">Enroll</Button>
            </Form>
        </div>
    );
};

export default EnrollForm;
