package com.SurfSchoolSchedule.backend.Instructor;

import com.SurfSchoolSchedule.backend.Lesson.LessonRepository;
import com.SurfSchoolSchedule.backend.WeekInstructor.WeekInstructor;
import com.SurfSchoolSchedule.backend.WeekInstructor.WeekInstructorService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.List;

@Service
public class InstructorServiceImpl implements InstructorService<Instructor> {


    @Autowired
    InstructorRepository instructorRepository;

    @Autowired
    LessonRepository lessonRepository;

    @Autowired
    WeekInstructorService<WeekInstructor> weekInstructorService;

    @Transactional
    @Override
    public Page<Instructor> getAll(Pageable pageable) {
        Page<Instructor> allElementsPage = instructorRepository.findAll(pageable);
        List<Instructor> allElementsList = allElementsPage.getContent();

        LocalDate today = LocalDate.now();
        //DateTimeFormatter fmt = DateTimeFormatter.ofPattern("MM-dd-yyyy");

        Sort tempSort = Sort.by(Sort.Order.desc("beginningDate"));
        Pageable tempPageable = PageRequest.of(
                0, 999999999, tempSort);
        for (Instructor instructor : allElementsList) {
            setFullNrOfLessonsForInstructor(instructor.getId());

            WeekInstructor tempWeekInstructor = weekInstructorService.getWeekInstructorForInstructorForGivenDate(tempPageable, instructor.getId(),
                    today.format(DateTimeFormatter.ofPattern("MM-dd-yyyy")));

            if (tempWeekInstructor == null) {
                WeekInstructor newWeekInstructor = new WeekInstructor();
                weekInstructorService.setValues(tempPageable, newWeekInstructor, instructor);
                weekInstructorService.setStatus(tempPageable, newWeekInstructor, WeekInstructor.Status.Not_Settled);

                weekInstructorService.addNewWeekInstructor(tempPageable, newWeekInstructor);

            } else
                weekInstructorService.setValues(pageable, tempWeekInstructor, instructor);
                weekInstructorService.setStatus(tempPageable, tempWeekInstructor, tempWeekInstructor.getStatus() );

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
