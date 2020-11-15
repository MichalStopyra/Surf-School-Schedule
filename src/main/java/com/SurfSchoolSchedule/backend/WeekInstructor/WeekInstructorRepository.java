package com.SurfSchoolSchedule.backend.WeekInstructor;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.PagingAndSortingRepository;
import org.springframework.data.repository.query.Param;

public interface WeekInstructorRepository  extends PagingAndSortingRepository<WeekInstructor, Long> {

    @Query("select wi from WeekInstructor wi " +
            "where  wi.instructor.id = :instructorId")
    Page<WeekInstructor> getAllWeekInstructorForInstructor(Pageable pageable, @Param("instructorId") Long instructorId);

    @Query("select wi from WeekInstructor wi " +
            "where  wi.instructor.id = :instructorId and wi.beginningDate = :beginningDate and wi.endDate = :endDate")
    Page<WeekInstructor> weekInstructorDoesNotExist(Pageable pageable, @Param("instructorId") Long instructorId, @Param("beginningDate") String beginningDate, @Param("endDate") String endDate);

    @Query("select wi from WeekInstructor wi " +
            "where  wi.instructor.id = :instructorId and wi.beginningDate = :beginningDate and wi.endDate = :endDate " +
            "and wi.id != :weekInstructorId")
    Page<WeekInstructor> sameWeekInstructorDoesNotExist(Pageable pageable, @Param("instructorId") Long instructorId, @Param("beginningDate") String beginningDate, @Param("endDate") String endDate,
                                                        @Param("weekInstructorId") Long weekInstructorId);
}
