package com.SurfSchoolSchedule.backend.Instructor;

import com.SurfSchoolSchedule.backend.AbstractEntity;
import com.SurfSchoolSchedule.backend.Lesson.Lesson;
import com.SurfSchoolSchedule.backend.WeekInstructor.WeekInstructor;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.sun.istack.NotNull;

import javax.persistence.*;
import java.util.LinkedList;
import java.util.List;

@Entity
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class Instructor extends AbstractEntity {

    @NotNull
    @Column
    private String firstName;

    @NotNull
    @Column
    private String lastName;

    @Column
    private Double hourWage;

    @Column
    private int nrHoursFull;


    @JsonIgnore
    @OneToMany(mappedBy = "instructor", cascade = CascadeType.ALL)
    @PrimaryKeyJoinColumn
    private List<Lesson> lessons = new LinkedList<>();

    @JsonIgnore
    @OneToMany(mappedBy = "instructor", cascade = CascadeType.ALL)
    @PrimaryKeyJoinColumn
    private List<WeekInstructor> weekInstructorList = new LinkedList<>();



    public String getFirstName() {
        return firstName;
    }

    public void setFirstName(String firstName) {
        this.firstName = firstName;
    }

    public String getLastName() {
        return lastName;
    }

    public void setLastName(String lastName) {
        this.lastName = lastName;
    }

    public int getNrHoursFull() {
        return nrHoursFull;
    }

    public void setNrHoursFull(int nrHoursFull) {
        this.nrHoursFull = nrHoursFull;
    }

    public Double getHourWage() {
        return hourWage;
    }

    public void setHourWage(Double hourWage) {
        this.hourWage = hourWage;
    }

    @JsonIgnore
    public List<Lesson> getLessons() {
        return lessons;
    }

    @JsonProperty
    public void setLessons(List<Lesson> lessons) {
        this.lessons = lessons;
    }

    @JsonIgnore
    public List<WeekInstructor> getWeekInstructorList() {
        return weekInstructorList;
    }
    @JsonProperty
    public void setWeekInstructorList(List<WeekInstructor> weekInstructorList) {
        this.weekInstructorList = weekInstructorList;
    }

    public void setAllFormValues(Instructor newInstructor) {
        this.setLastName(newInstructor.getLastName());
        this.setFirstName(newInstructor.getFirstName());
        this.setHourWage(newInstructor.getHourWage());
    }
}
