// src/components/GradeForm.js
import React, { useState, useEffect } from 'react';
import { db} from '../firebase/firebaseConfig'
import { collection, getDocs, addDoc } from 'firebase/firestore';
import { Form, Button } from 'react-bootstrap';

const GradeForm = () => {
    const [students, setStudents] = useState([]);
    const [selectedStudent, setSelectedStudent] = useState('');
    const [grade, setGrade] = useState('');

    useEffect(() => {
        const fetchStudents = async () => {
            const studentsCollectionRef = collection(db, 'students');
            const data = await getDocs(studentsCollectionRef);
            setStudents(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
        };

        fetchStudents();
    }, []);

    const handleGradeSubmit = async (e) => {
        e.preventDefault();
        try {
            await addDoc(collection(db, 'grades'), {
                studentId: selectedStudent,
                grade,
            });
            setSelectedStudent('');
            setGrade('');
            alert('Grade assigned successfully!');
        } catch (error) {
            console.error('Error assigning grade: ', error);
        }
    };

    return (
        <div>
            <h2>Assign Grades</h2>
            <Form onSubmit={handleGradeSubmit}>
                <Form.Group controlId="formSelectStudent">
                    <Form.Label>Select Student</Form.Label>
                    <Form.Control
                        as="select"
                        value={selectedStudent}
                        onChange={(e) => setSelectedStudent(e.target.value)}
                        required
                    >
                        <option value="">Choose a student...</option>
                        {students.map((student) => (
                            <option key={student.id} value={student.id}>
                                {student.name}
                            </option>
                        ))}
                    </Form.Control>
                </Form.Group>
                <Form.Group controlId="formGrade">
                    <Form.Label>Grade</Form.Label>
                    <Form.Control
                        type="text"
                        placeholder="Enter grade"
                        value={grade}
                        onChange={(e) => setGrade(e.target.value)}
                        required
                    />
                </Form.Group>
                <Button variant="primary" type="submit">Assign Grade</Button>
            </Form>
        </div>
    );
};

export default GradeForm;
