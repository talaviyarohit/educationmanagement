// src/components/CourseTable.js
import React, { useState, useEffect } from 'react';
import { db} from '../firebase/firebaseConfig'
import { collection, getDocs } from 'firebase/firestore';
import { Table, Button } from 'react-bootstrap';

const CourseTable = () => {
    const [courses, setCourses] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const fetchCourses = async () => {
            const coursesCollectionRef = collection(db, 'courses');
            const data = await getDocs(coursesCollectionRef);
            setCourses(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
        };

        fetchCourses();
    }, []);

    const filteredCourses = courses.filter(course =>
        course.title.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div>
            <h2>Courses</h2>
            <input
                type="text"
                placeholder="Search courses..."
                onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Table striped bordered hover>
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
                    {filteredCourses.map((course) => (
                        <tr key={course.id}>
                            <td>{course.title}</td>
                            <td>{course.description}</td>
                            <td>{course.startDate}</td>
                            <td>{course.endDate}</td>
                            <td>{course.assignedTeacher}</td>
                            <td>
                                <Button variant="danger">Delete</Button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>
        </div>
    );
};

export default CourseTable;
