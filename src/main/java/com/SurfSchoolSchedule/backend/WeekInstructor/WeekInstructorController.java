package com.SurfSchoolSchedule.backend.WeekInstructor;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/weekInstructor-api")
@CrossOrigin
public class WeekInstructorController {

    @Autowired
    private WeekInstructorService weekInstructorService;

    @GetMapping("/list")
    public ResponseEntity<Page<WeekInstructor>> getAll(
            @RequestParam(defaultValue = "0") Integer page,
            @RequestParam(defaultValue = "5") Integer size,
            @RequestParam(defaultValue = "beginningDate") String sortBy,
            @RequestParam(defaultValue = "asc") String sortDir) {
        Sort sort = Sort.by(
                sortDir.equalsIgnoreCase("asc") ? (Sort.Order.asc(sortBy)) : (Sort.Order.desc(sortBy)));

        return new ResponseEntity<>(
                weekInstructorService.getAll(
                        PageRequest.of(
                                page, size, sort)
                )
                , HttpStatus.OK);
    }

    @GetMapping("/{id}")
    public WeekInstructor getWeekInstructorsById(@PathVariable("id") long id) {
        WeekInstructor weekInstructor = weekInstructorService.getWeekInstructor(id);
        if (weekInstructor == null) {
            throw new RuntimeException("No weekInstructor with id = " + id);
        }
        return weekInstructor;
    }


    @GetMapping("/studentWeekInstructors/{idInstructor}")
    public ResponseEntity<Page<WeekInstructor>> getAllWeekInstructorForInstructor(@PathVariable("idInstructor") long idInstructor,
                                                             @RequestParam(defaultValue = "0") Integer page,
                                                             @RequestParam(defaultValue = "999999999") Integer size,
                                                             @RequestParam(defaultValue = "beginningDate") String sortBy,
                                                             @RequestParam(defaultValue = "asc") String sortDir)

    {

        Sort sort = Sort.by(
                sortDir.equalsIgnoreCase("asc") ? (Sort.Order.asc(sortBy)) : (Sort.Order.desc(sortBy))
        );

        return new ResponseEntity<>(
                weekInstructorService.getAllWeekInstructorForInstructor(
                        PageRequest.of(page, size, sort),
                        idInstructor)
                , HttpStatus.OK);
    }

    @RequestMapping(value = "/list", method = RequestMethod.POST)
    public ResponseEntity<WeekInstructor> addNewWeekInstructor(@RequestBody WeekInstructor weekInstructorObj, Pageable pageable) {
        return new ResponseEntity<>(weekInstructorService.addNewWeekInstructor(pageable, weekInstructorObj), HttpStatus.CREATED);
    }

    @RequestMapping(value = "/{id}", method = RequestMethod.PUT)
    public void updateWeekInstructor(@PathVariable("id") long id, @RequestBody WeekInstructor weekInstructor, Pageable pageable) {
        weekInstructorService.updateWeekInstructor(pageable, weekInstructor, id);
    }

    @DeleteMapping("/list/{id}")
    public void deleteWeekInstructor(@PathVariable("id") long weekInstructorId) {
        weekInstructorService.deleteWeekInstructor(weekInstructorId);
    }

    @GetMapping("/{instructorId}/{date}")
    public WeekInstructor getWeekInstructorForInstructorForDate(@PathVariable("instructorId") long instructorId, @PathVariable("date") String date, Pageable pageable ) {
        WeekInstructor weekInstructor = weekInstructorService.getWeekInstructorForInstructorForGivenDate(pageable, instructorId, date);
        if (weekInstructor == null) {
            throw new RuntimeException("No priceTable for this date " + date);
        }
        return weekInstructor;
    }
}
