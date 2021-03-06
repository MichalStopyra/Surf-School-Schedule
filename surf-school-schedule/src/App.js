import React from 'react';
import { Col, Container, Row } from 'react-bootstrap';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import './App.css';
import Instructor from './components/Instructor/Instructor';
import InstructorList from './components/Instructor/InstructorList';
import InstructorSettle from './components/Instructor/InstructorSettle';
import Lesson from './components/Lesson/Lesson';
import LessonList from './components/Lesson/LessonList';
import Schedule from './components/Lesson/Schedule';
import NavigationBar from './components/NavigationBar';
import PriceTable from './components/PriceTable/PriceTable';
import PriceTableList from './components/PriceTable/PriceTableList';
import Student from './components/Student/Student';
import StudentList from './components/Student/StudentList';
import StudentSettle from './components/Student/StudentSettle';
import Welcome from './components/Welcome';







export default function App() {

  const marginTop = {
    marginTop: "20px"
  };

  const heading = "Surf School App";
  const footer = "App created for easier surfing school management";

  return (
    <Router>
      <NavigationBar />
      <Container>
        <Row>
          <Col lg={12} style={marginTop}>
            <Switch>
  <Route path="/" exact component={() => <Welcome heading ={heading} footer={footer}/>} />
              <Route path="/students" exact component={StudentList} />
              <Route path="/add-student" exact component={Student} />
              <Route path="/add-instructor" exact component={Instructor} />
              <Route path="/editStudent/:id" exact component={Student} />
              <Route path="/settleStudent/:id" exact component={StudentSettle} />
              <Route path="/editInstructor/:id" exact component={Instructor} />
              <Route path="/settleInstructor/:id" exact component={InstructorSettle} />
              <Route path="/lessons" exact component={LessonList} />
              <Route path="/add-lesson" exact component={Lesson} />
              <Route path="/editLesson/:id" exact component={Lesson} />
              <Route path="/schedule" exact component={Schedule} />
              <Route path="/instructors" exact component={InstructorList} />
              <Route path="/priceTableList" exact component={PriceTableList} />
              <Route path="/add-priceTable" exact component={PriceTable} />
              <Route path="/editPriceTable/:id" exact component={PriceTable} />



            </Switch>
          </Col>
        </Row>
      </Container>
    </Router>
  );
}
