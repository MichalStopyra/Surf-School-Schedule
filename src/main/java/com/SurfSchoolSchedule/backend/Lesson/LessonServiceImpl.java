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
    public Lesson addNewLesson(Pageable pageable, Lesson newLesson) {
        if (lessonCanHappen(pageable, newLesson))
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
    public void updateLesson(Lesson lesson, long id) {
        Lesson l = lessonRepository.findById(id).get();
        l.setAllFormValues(lesson);
    }
    
    private boolean lessonCanHappen(Pageable pageable, Lesson newLesson) {
        System.out.println(newLesson.getInstructor().getId());
        return lessonRepository.alreadyExists(pageable, newLesson.getStudent().getId(), newLesson.getInstructor().getId(),
                newLesson.getDate(), newLesson.getTime()).isEmpty();

        // return lessonRepository.search(pageable, newLesson.getLesson().getFirstName().concat(" ".concat(newLesson.getLesson().getLastName())), , newLesson.getFirstName().concat(" ".concat(newLesson.getLastName()))) != null;
    }
}
