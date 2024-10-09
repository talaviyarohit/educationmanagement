// src/components/CourseForm.js
import React, { useState } from 'react';
// import { db } from '../firebase';
import { db} from '../firebase/firebaseConfig'
import { collection, addDoc } from 'firebase/firestore';
import { Form, Button } from 'react-bootstrap';

const CourseForm = () => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [assignedTeacher, setAssignedTeacher] = useState('');

    const handleSubmit = async (e) => {
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
            console.error('Error adding document: ', error);
        }
    };

    return (
        <div>
            <h2>Create Course</h2>
            <Form onSubmit={handleSubmit}>
                <Form.Group controlId="formCourseTitle">
                    <Form.Label>Title</Form.Label>
                    <Form.Control
                        type="text"
                        placeholder="Enter course title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                    />
                </Form.Group>
                <Form.Group controlId="formCourseDescription">
                    <Form.Label>Description</Form.Label>
                    <Form.Control
                        as="textarea"
                        rows={3}
                        placeholder="Enter course description"
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
                        placeholder="Enter teacher name"
                        value={assignedTeacher}
                        onChange={(e) => setAssignedTeacher(e.target.value)}
                        required
                    />
                </Form.Group>
                <Button variant="primary" type="submit">Create Course</Button>
            </Form>
        </div>
    );
};

export default CourseForm;
