package com.SurfSchoolSchedule.backend.Instructor;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface InstructorRepository extends JpaRepository<Instructor, Long > {
    @Query("select i from Instructor i " +
            "where lower(i.firstName) like lower(concat('%', :searchTerm, '%')) " +
            "or lower(i.lastName) like lower(concat('%', :searchTerm, '%')) " +
            "or lower(concat( concat(i.firstName, ' '), i.lastName)) like lower(concat('%', :searchTerm, '%'))")
    Page<Instructor> search(Pageable pageable, @Param("searchTerm") String searchTerm);

    @Query("select i from Instructor i " +
            "where lower(i.firstName) like lower(concat('%', :searchTerm, '%')) " +
            "or lower(i.lastName) like lower(concat('%', :searchTerm, '%')) " +
            "or lower(concat( concat(i.firstName, ' '), i.lastName)) like lower(concat('%', :searchTerm, '%'))" +
            "and i.id != :instructorId")
    Page<Instructor> otherInstructorWithThisName(Pageable pageable, @Param("instructorId") Long instructorId, @Param("searchTerm") String searchTerm);

}
