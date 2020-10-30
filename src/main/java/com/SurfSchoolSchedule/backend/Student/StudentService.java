package com.SurfSchoolSchedule.backend.Student;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;

public interface StudentService<T> {

    public Page<T> getAll(Pageable pageable);
    public Iterable<T> getAll(Sort sort);


    public Student getStudent (long id);

    Page<T> getStudentsByName (Pageable pageable, String name);

    Student addNewStudent (Pageable pageable, Student newStudent);

    void deleteStudent(long studentId);

    Student updateStudent(Student student, long id, Pageable pageable);

}
