package com.SurfSchoolSchedule.backend.Student;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/student-api")
@CrossOrigin
public class StudentController {

    @Autowired
    private StudentService studentService;

    @GetMapping("/search/{lastName}")
    public ResponseEntity<Page<Student>> getStudentByLastName(Pageable pageable, @PathVariable("lastName") String searchText) {
        return new ResponseEntity<>(studentService.getStudentsByName(pageable, searchText), HttpStatus.OK);
    }
    @GetMapping("/list")
    public ResponseEntity<Page<Student>> getAll(
            @RequestParam(defaultValue = "0") Integer page,
            @RequestParam(defaultValue = "5") Integer size,
            @RequestParam(defaultValue = "paymentStatus") String sortBy,
            @RequestParam(defaultValue = "asc") String sortDir) {
        Sort sort = Sort.by(
                sortDir.equalsIgnoreCase("asc") ? (Sort.Order.asc(sortBy)) : (Sort.Order.desc(sortBy)),
                Sort.Order.asc("lastName").ignoreCase()
        );
        return new ResponseEntity<>(
                studentService.getAll(
                        PageRequest.of(
                                page, size, sort)
                )
                , HttpStatus.OK);
    }


    @GetMapping("/{id}")
    public Student getStudentsById(@PathVariable("id") long id) {
        Student student = studentService.getStudent(id);
        if (student == null) {
            throw new RuntimeException("No student with id = " + id);
        }
        return student;
    }

    @RequestMapping(value = "/{id}", method = RequestMethod.PUT)
    public ResponseEntity<Student> updateStudent(@PathVariable("id") long id, @RequestBody Student student, Pageable pageable) {
        return new ResponseEntity<>(studentService.updateStudent(student, id, pageable), HttpStatus.OK);
    }

    @RequestMapping(value = "/list", method = RequestMethod.POST)
    public ResponseEntity<Student> addNewStudent(@RequestBody Student studentObj, Pageable pageable) {
        return new ResponseEntity<>(studentService.addNewStudent(pageable, studentObj), HttpStatus.CREATED);
    }

    @DeleteMapping("/list/{id}")
    public void deleteStudent(@PathVariable("id") long studentId) {
        studentService.deleteStudent(studentId);
    }

}

