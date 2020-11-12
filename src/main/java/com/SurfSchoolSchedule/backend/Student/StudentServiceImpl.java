package com.SurfSchoolSchedule.backend.Student;

import com.SurfSchoolSchedule.backend.Lesson.LessonRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;
import java.util.List;

@Service
public class StudentServiceImpl implements StudentService<Student> {


    @Autowired
    StudentRepository studentRepository;

    @Autowired
    LessonRepository lessonRepository;

    @Transactional
    @Override
    public Page<Student> getAll(Pageable pageable) {
        Page<Student> allElementsPage = studentRepository.findAll(pageable);
        List<Student> allElementsList = allElementsPage.getContent();

        for (Student student : allElementsList) {
            setNrOfLessonsForStudent(student.getId());
        }
        //return studentRepository.findAll(pageable);
         return allElementsPage;
    }


    //update nr of lessons for specific student as well
    @Transactional
    @Override
    public Iterable<Student> getAll(Sort sort) {


        return studentRepository.findAll(sort);
    }

    @Transactional
    @Override
    public void setNrOfLessonsForStudent(long idStudent) {
        Student st = studentRepository.findById(idStudent).get();
        st.setLessonHours(lessonRepository.countLessonHours(idStudent));
        // st.setMoneyOwing(lessonRepository.countmoneyOwing);
        st.setUnpaidLessons(lessonRepository.countUnpaidLessons(idStudent));
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
        if (st.getLessons().isEmpty())
            studentRepository.delete(st);
        else
            throw new RuntimeException("Student assigned to lesson(s) - can't delete them");

    }

    @Transactional
    @Override
    public Student updateStudent(Student student, long id, Pageable pageable) {
        if (otherStudentWithThisNameDoesNotExist(pageable, student)) {
            Student i = studentRepository.findById(id).get();
            i.setAllFormValues(student);
            return i;
        } else {
            throw new RuntimeException("Can't update - Student already in the database");
        }
    }

    private boolean otherStudentWithThisNameDoesNotExist(Pageable pageable, Student updatedStudent) {
        return studentRepository.otherStudentWithThisName(pageable, updatedStudent.getId(), updatedStudent.getFirstName().concat(" ".concat(updatedStudent.getLastName()))).isEmpty();

    }


    private boolean studentDoesNotExist(Pageable pageable, Student newStudent) {
        return studentRepository.search(pageable, newStudent.getFirstName().concat(" ".concat(newStudent.getLastName()))).isEmpty();
    }
}
