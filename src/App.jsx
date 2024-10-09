// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import NavigationBar from './components/Navbar';
import CourseForm from './components/CourseForm';
import EnrollForm from './components/EnrollForm';
import GradeForm from './components/GradeForm';
import CourseTable from './components/CourseTable';
import StudentTable from './components/StudentTable';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css'; // Optional CSS for custom styles
import TeacherDashboard from './components/TeacherDashboard';
import StudentDashboard from './components/StudentDashboard';
import AdminCourseManagement from './components/AdminCourseManagement';
import TeacherCourseContent from './components/TeacherCourseContent';
import StudentCourseView from './components/StudentCourseView';


const App = () => {
    return (
        <Router>
           
            <NavigationBar />
            <div className="container mt-4">
                <Routes>
                    <Route path="/admin" element={
                      <>
                      <AdminCourseManagement/>
                            {/* <CourseForm />
                            <CourseTable />
                            <EnrollForm />
                            <StudentTable />
                            <GradeForm /> */}
                        </>
                    } />
                    {/* Add routes for Teacher and Student dashboards as needed */}
                    <Route path="/" element={<h1>Welcome to the Course Management System</h1>} />
                    <Route path="/teacher" element={<TeacherCourseContent/>} />
                    <Route path="/student" element={ <StudentCourseView/>} />
                </Routes>
            </div>
        </Router>
    );
};

export default App;
