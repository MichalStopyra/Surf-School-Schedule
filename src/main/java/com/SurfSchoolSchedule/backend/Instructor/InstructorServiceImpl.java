package com.SurfSchoolSchedule.backend.Instructor;

import com.SurfSchoolSchedule.backend.Lesson.LessonRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;
import java.util.List;

@Service
public class InstructorServiceImpl implements InstructorService<Instructor> {


    @Autowired
    InstructorRepository instructorRepository;

    @Autowired
    LessonRepository lessonRepository;

    @Transactional
    @Override
    public Page<Instructor> getAll(Pageable pageable) {
        Page<Instructor> allElementsPage = instructorRepository.findAll(pageable);
        List<Instructor> allElementsList = allElementsPage.getContent();

        for (Instructor instructor : allElementsList) {
            setFullNrOfLessonsForInstructor(instructor.getId());
        }
        return allElementsPage;
    }

    @Transactional
    private void setFullNrOfLessonsForInstructor(Long idInstructor) {
        Instructor in = instructorRepository.findById(idInstructor).get();
        in.setNrHoursFull(lessonRepository.countFullNrLessonsForInstructor(idInstructor));
    }

    @Transactional
    @Override
    public Iterable<Instructor> getAll(Sort sort) {
        return instructorRepository.findAll(sort);
    }

    @Transactional
    @Override
    public Instructor getInstructor(long id) {
        return instructorRepository.findById(id).get();
    }

    @Transactional
    @Override
    public Page<Instructor> getInstructorsByName(Pageable pageable, String name) {
        return instructorRepository.search(pageable, name);
    }


    @Transactional
    @Override
    public Instructor addNewInstructor(Pageable pageable, Instructor newInstructor) {
        if (instructorDoesNotExist(pageable, newInstructor))
            return instructorRepository.save(newInstructor);
        else
            throw new RuntimeException("Instructor already in the database");
    }


    @Transactional
    @Override
    public void deleteInstructor(long instructorId) {
        Instructor instr = instructorRepository.findById(instructorId).get();
        if (instr.getLessons().isEmpty()) {
            instructorRepository.delete(instr);
        } else
            throw new RuntimeException("Instructor assigned to lesson(s) - can't delete them");
    }

    @Transactional
    @Override
    public Instructor updateInstructor(Instructor instructor, long id, Pageable pageable) {
        if (otherInstructorWithThisNameDoesNotExist(pageable, instructor)) {
            Instructor i = instructorRepository.findById(id).get();
            i.setAllFormValues(instructor);
            return i;
        } else {
            throw new RuntimeException("Can't update - Instructor already in the database");
        }
    }


    private boolean instructorDoesNotExist(Pageable pageable, Instructor newInstructor) {
        return instructorRepository.search(pageable, newInstructor.getFirstName().concat(" ".concat(newInstructor.getLastName()))).isEmpty();
    }

    private boolean otherInstructorWithThisNameDoesNotExist(Pageable pageable, Instructor updatedInstructor) {
        return instructorRepository.otherInstructorWithThisName(pageable, updatedInstructor.getId(), updatedInstructor.getFirstName().concat(" ".concat(updatedInstructor.getLastName()))).isEmpty();

    }
}
