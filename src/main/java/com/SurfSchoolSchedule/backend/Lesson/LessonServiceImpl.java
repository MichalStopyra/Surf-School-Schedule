package com.SurfSchoolSchedule.backend.Lesson;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;

@Service
public class LessonServiceImpl implements LessonService<Lesson> {

    @Autowired
    LessonRepository lessonRepository;

    @Transactional
    @Override
    public Page<Lesson> getAll(Pageable pageable) {
        return lessonRepository.findAll(pageable);
    }

    @Transactional
    @Override
    public Iterable<Lesson> getAll(Sort sort) {
        return lessonRepository.findAll(sort);
    }

    @Transactional
    @Override
    public Lesson getLesson(long id) {
        return lessonRepository.findById(id).get();
    }

    @Transactional
    @Override
    public Page<Lesson> getLessonsForInstructorAtDate(Pageable pageable, String date, Long idInstructor) {
        return lessonRepository.findLessonsForInstructorAtDate(pageable, idInstructor, date);
    }

    @Override
    public Page<Lesson> getAllStudentLessons(Pageable pageable, Long idStudent) {
        return lessonRepository.getAllStudentLessons(pageable, idStudent);
    }



    @Transactional
    @Override
    public Lesson addNewLesson(Pageable pageable, Lesson newLesson) {
        if (noLessonAtThisHour(pageable, newLesson) && noCoincidingLessonsInEarlierHours(pageable, newLesson))
            return lessonRepository.save(newLesson);
         else
            throw new RuntimeException("No free slot at this hour");
    }


    @Transactional
    @Override
    public void deleteLesson(long lessonId) {
        Lesson l = lessonRepository.findById(lessonId).get();
        lessonRepository.delete(l);
    }

    @Transactional
    @Override
    public void updateLesson(Pageable pageable, Lesson lesson, long id) {
        if (noLessonAtThisHour(pageable, lesson) && noCoincidingLessonsInEarlierHours(pageable, lesson)) {
            Lesson l = lessonRepository.findById(id).get();
            l.setAllFormValues(lesson);
        }
        else
            throw new RuntimeException("Can't update lesson - no free slot");

    }

    private boolean noLessonAtThisHour(Pageable pageable, Lesson newLesson/*, boolean hasId*/) {
//        return lessonRepository.alreadyExists(pageable, newLesson.getStudent().getId(), newLesson.getInstructor().getId(),
//                newLesson.getDate(), newLesson.getTime()).isEmpty();
        double newLessonLength = newLesson.getHowLong();
        boolean noLessons = true;
        for (int i = 0; i < newLessonLength; ++i) {
            int hourInt = Integer.parseInt(newLesson.getTime().split(":")[0]);
            hourInt+=i;
            String hourString = Integer.toString(hourInt) + ":00";
          //  if(hasId){
            if (!lessonRepository.alreadyExists(pageable, newLesson.getStudent().getId(), newLesson.getInstructor().getId(),
                    newLesson.getDate(), hourString, newLesson.getId()).isEmpty()) {
                System.out.println(newLesson.getId());

                noLessons = false;}
        }

        return noLessons;


        // return lessonRepository.search(pageable, newLesson.getLesson().getFirstName().concat(" ".concat(newLesson.getLesson().getLastName())), , newLesson.getFirstName().concat(" ".concat(newLesson.getLastName()))) != null;
    }
//check if e.g. lesson that started two hors earlier doesn't coincide with newLesson
    private boolean noCoincidingLessonsInEarlierHours(Pageable pageable, Lesson newLesson) {
        boolean noLessons = true;
        //lessons tka max 3 hours - so check 2 hours back and 1 hour back
        for (int i = 1; i < 3; ++i) {
            int hourInt = Integer.parseInt(newLesson.getTime().split(":")[0]);
            hourInt-=i;
            String hourString = Integer.toString(hourInt) + ":00";
            double d = i;
            if (!lessonRepository.studentDoesntHaveCoincidingLesson(pageable, newLesson.getStudent().getId(),
                    newLesson.getDate(), hourString, d).isEmpty())
                noLessons = false;
        }
        return noLessons;
    }
}
