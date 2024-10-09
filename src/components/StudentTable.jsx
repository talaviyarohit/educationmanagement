// src/components/StudentTable.js
import React, { useState, useEffect } from 'react';
import { db} from '../firebase/firebaseConfig'
import { collection, getDocs } from 'firebase/firestore';
import { Table } from 'react-bootstrap';

const StudentTable = () => {
    const [students, setStudents] = useState([]);

    useEffect(() => {
        const fetchStudents = async () => {
            const studentsCollectionRef = collection(db, 'students');
            const data = await getDocs(studentsCollectionRef);
            setStudents(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
        };

        fetchStudents();
    }, []);

    return (
        <div>
            <h2>Students</h2>
            <Table striped bordered hover>
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Enrolled Courses</th>
                    </tr>
                </thead>
                <tbody>
                    {students.map((student) => (
                        <tr key={student.id}>
                            <td>{student.name}</td>
                            <td>{student.email}</td>
                            <td>{student.enrolledCourses ? student.enrolledCourses.join(', ') : 'None'}</td>
                        </tr>
                    ))}
                </tbody>
            </Table>
        </div>
    );
};

export default StudentTable;
