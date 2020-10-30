package com.SurfSchoolSchedule.backend.Instructor;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/instructor-api")
@CrossOrigin
public class InstructorContoller {


    @Autowired
    private InstructorService instructorService;

    @GetMapping("/search/{name}")
    public ResponseEntity<Page<Instructor>> getInstructorByName(Pageable pageable, @PathVariable("name") String searchText) {
        return new ResponseEntity<>(instructorService.getInstructorsByName(pageable, searchText), HttpStatus.OK);
    }

    @GetMapping("/list")
    public ResponseEntity<Page<Instructor>> getAll(
            @RequestParam(defaultValue = "0") Integer page,
            @RequestParam(defaultValue = "5") Integer size,
            @RequestParam(defaultValue = "desc") String sortDir) {
        Sort sort = Sort.by(
                sortDir.equalsIgnoreCase("desc") ? (Sort.Order.asc("firstName")) : (Sort.Order.desc("firstName")),
                Sort.Order.asc("lastName").ignoreCase()
        );

        return new ResponseEntity<>(
                instructorService.getAll(
                        PageRequest.of(
                                page, size, sort)
                )
                , HttpStatus.OK);
    }


    @GetMapping("/{id}")
    public Instructor getInstructorsById(@PathVariable("id") long id) {
        Instructor instructor = instructorService.getInstructor(id);
        if (instructor == null) {
            throw new RuntimeException("No instructor with id = " + id);
        }
        return instructor;
    }

    @RequestMapping(value = "/{id}", method = RequestMethod.PUT)
    public ResponseEntity<Instructor> updateInstructor(@PathVariable("id") long id, @RequestBody Instructor instructor, Pageable pageable) {
        return new ResponseEntity<>(instructorService.updateInstructor(instructor, id, pageable), HttpStatus.OK);
    }

//    @RequestMapping(value = "/{id}", method = RequestMethod.PUT)
//    public void updateInstructor(@PathVariable("id") long id, @RequestBody Instructor instructor) {
//        instructorService.updateInstructor(instructor, id);
//    }
    
    @RequestMapping(value = "/list", method = RequestMethod.POST)
    public ResponseEntity<Instructor> addNewInstructor(@RequestBody Instructor instructorObj, Pageable pageable) {
        return new ResponseEntity<>(instructorService.addNewInstructor(pageable, instructorObj), HttpStatus.CREATED);
    }

    @DeleteMapping("/list/{id}")
    public void deleteInstructor(@PathVariable("id") long instructorId) {
        instructorService.deleteInstructor(instructorId);
    }
}
