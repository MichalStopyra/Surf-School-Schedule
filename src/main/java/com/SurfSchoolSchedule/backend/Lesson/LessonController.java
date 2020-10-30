package com.SurfSchoolSchedule.backend.Lesson;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/lesson-api")
@CrossOrigin
public class LessonController {

    @Autowired
    private LessonService lessonService;

    @GetMapping("/list")
    public ResponseEntity<Page<Lesson>> getAll(
            @RequestParam(defaultValue = "0") Integer page,
            @RequestParam(defaultValue = "5") Integer size,
            @RequestParam(defaultValue = "date") String sortBy,
            @RequestParam(defaultValue = "asc") String sortDir) {
        Sort sort = Sort.by(
                sortDir.equalsIgnoreCase("asc") ? (Sort.Order.asc(sortBy)) : (Sort.Order.desc(sortBy))/*,
                Sort.Order.asc("lastName").ignoreCase()*/
        );

        return new ResponseEntity<>(
                lessonService.getAll(
                        PageRequest.of(
                                page, size, sort)
                )
                , HttpStatus.OK);
    }

    @GetMapping("/{id}")
    public Lesson getLessonsById(@PathVariable("id") long id) {
        Lesson lesson = lessonService.getLesson(id);
        if (lesson == null) {
            throw new RuntimeException("No lesson with id = " + id);
        }
        return lesson;
    }

    @GetMapping("/{idInstructor}/{date}")
    public ResponseEntity<Page<Lesson>> getInstructorLessonsByDate(@PathVariable("idInstructor") long idInstructor, @PathVariable("date") String date) {

            //    Lesson lesson = lessonService.getLesson(idInstructor);
//        Sort sort = Sort.by(
//                Sort.Order.asc(date)/*,
//                Sort.Order.asc("lastName").ignoreCase()*/
//        );
//        System.out.println(lessonService.getLessonsForInstructorAtDate(
//                PageRequest.of(0, 999999999),
//                date, idInstructor).getClass().getName());



            return new ResponseEntity<>(
                    lessonService.getLessonsForInstructorAtDate(
                            PageRequest.of(0, 99999999),
                            date, idInstructor)
                    , HttpStatus.OK);
        //}
    }

    @RequestMapping(value = "/list", method = RequestMethod.POST)
    public ResponseEntity<Lesson> addNewLesson(@RequestBody Lesson lessonObj, Pageable pageable) {
        return new ResponseEntity<>(lessonService.addNewLesson(pageable, lessonObj), HttpStatus.CREATED);
    }

    @RequestMapping(value = "/{id}", method = RequestMethod.PUT)
    public void updateLesson(@PathVariable("id") long id, @RequestBody Lesson lesson) {
        lessonService.updateLesson(lesson, id);
    }

    @DeleteMapping("/list/{id}")
    public void deleteLesson(@PathVariable("id") long lessonId) {
        lessonService.deleteLesson(lessonId);
    }
}
