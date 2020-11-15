package com.SurfSchoolSchedule.backend.WeekInstructor;


import com.SurfSchoolSchedule.backend.AbstractEntity;
import com.SurfSchoolSchedule.backend.Instructor.Instructor;
import com.sun.istack.NotNull;

import javax.persistence.*;

@Entity
public class WeekInstructor extends AbstractEntity {


    public enum Status{
        Not_Settled, Settled
    }

    @NotNull
    @ManyToOne
    @JoinColumn (name = "FK_IdInstructor")
    private Instructor instructor;

    @NotNull
    private String beginningDate;

    @NotNull
    private String endDate;

    @NotNull
    private Double fullNrOfLessonsWeek;

    @NotNull
    private Double nrOfLessons1p;

    @NotNull
    private Double nrOfLessons2p;

    @NotNull
    private Double nrOfLessons3p;

    @NotNull
    private Double weekWage;

    @Enumerated(EnumType.STRING)
    private com.SurfSchoolSchedule.backend.WeekInstructor.WeekInstructor.Status status;

    public Instructor getInstructor() {
        return instructor;
    }

    public void setInstructor(Instructor instructor) {
        this.instructor = instructor;
    }

    public String getBeginningDate() {
        return beginningDate;
    }

    public void setBeginningDate(String begginingDate) {
        this.beginningDate = begginingDate;
    }

    public String getEndDate() {
        return endDate;
    }

    public void setEndDate(String endDate) {
        this.endDate = endDate;
    }

    public Double getFullNrOfLessonsWeek() {
        return fullNrOfLessonsWeek;
    }

    public void setFullNrOfLessonsWeek(Double fullNrOfLessonsWeek) {
        this.fullNrOfLessonsWeek = fullNrOfLessonsWeek;
    }

    public Double getNrOfLessons1p() {
        return nrOfLessons1p;
    }

    public void setNrOfLessons1p(Double nrOfLessons1p) {
        this.nrOfLessons1p = nrOfLessons1p;
    }

    public Double getNrOfLessons2p() {
        return nrOfLessons2p;
    }

    public void setNrOfLessons2p(Double nrOfLessons2p) {
        this.nrOfLessons2p = nrOfLessons2p;
    }

    public Double getNrOfLessons3p() {
        return nrOfLessons3p;
    }

    public void setNrOfLessons3p(Double nrOfLessons3p) {
        this.nrOfLessons3p = nrOfLessons3p;
    }

    public Double getWeekWage() {
        return weekWage;
    }

    public void setWeekWage(Double weekWage) {
        this.weekWage = weekWage;
    }

    public Status getStatus() {
        return status;
    }

    public void setStatus(Status status) {
        this.status = status;
    }

    public void setAllFormValues(WeekInstructor newWeekInstructor) {
        this.setInstructor(newWeekInstructor.getInstructor());
        this.setBeginningDate(newWeekInstructor.getBeginningDate());
        this.setEndDate(newWeekInstructor.getEndDate());
        this.setNrOfLessons1p(newWeekInstructor.getNrOfLessons1p());
        this.setNrOfLessons2p(newWeekInstructor.getNrOfLessons2p());
        this.setNrOfLessons3p(newWeekInstructor.getNrOfLessons3p());
        this.setWeekWage(newWeekInstructor.getWeekWage());
        this.setFullNrOfLessonsWeek(newWeekInstructor.getFullNrOfLessonsWeek());
        this.setStatus(newWeekInstructor.getStatus());

    }
}

