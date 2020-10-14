package com.SurfSchoolSchedule.backend.Student;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;

@Service
public class StudentServiceImpl implements StudentService<Student> {


    @Autowired
    StudentRepository studentRepository;

    @Transactional
    @Override
    public Page<Student> getAll(Pageable pageable) {
        return studentRepository.findAll(pageable);
    }

    @Transactional
    @Override
    public Iterable<Student> getAll(Sort sort) {
        return studentRepository.findAll(sort);
    }

    @Transactional
    @Override
    public Student getStudent(long id) {
        return studentRepository.findById(id).get();
    }

    @Transactional
    @Override
    public Page<Student> getStudentsByName(Pageable pageable, String name) {
        return studentRepository.search(pageable, name);
    }


    @Transactional
    @Override
    public Student addNewStudent(Pageable pageable, Student newStudent) {
        if (studentDoesNotExist(pageable, newStudent))
            return studentRepository.save(newStudent);
        else
            throw new RuntimeException("Student already in the database");
    }


    @Transactional
    @Override
    public void deleteStudent(long studentId) {
        Student st = studentRepository.findById(studentId).get();
        studentRepository.delete(st);
    }

    @Transactional
    @Override
    public void updateStudent(Student student, long id) {
        Student st = studentRepository.findById(id).get();
        st.setAllFormValues(student);
    }


    private boolean studentDoesNotExist(Pageable pageable, Student newStudent) {
        return studentRepository.search(pageable, newStudent.getFirstName().concat(" ".concat(newStudent.getLastName()))).isEmpty();
    }
}
