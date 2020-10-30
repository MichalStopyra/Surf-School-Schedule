package com.SurfSchoolSchedule.backend.Instructor;

import com.SurfSchoolSchedule.backend.AbstractEntity;
import com.SurfSchoolSchedule.backend.Lesson.Lesson;
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
    private int nrHoursFull;

    @Column
    private int nrHoursWeek;

    @Column
    private int wageWeek;

    //mapped by????
    @JsonIgnore
    @OneToMany(mappedBy = "instructor", cascade = CascadeType.ALL)
    @PrimaryKeyJoinColumn
    //@JoinColumn(name ="FK_Lesson")
    private List<Lesson> lessons = new LinkedList<>();

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

    public int getNrHoursWeek() {
        return nrHoursWeek;
    }

    public void setNrHoursWeek(int nrHoursWeek) {
        this.nrHoursWeek = nrHoursWeek;
    }

    public int getWageWeek() {
        return wageWeek;
    }

    public void setWageWeek(int wageWeek) {
        this.wageWeek = wageWeek;
    }

    @JsonIgnore
    public List<Lesson> getLessons() {
        return lessons;
    }

    @JsonProperty
    public void setLessons(List<Lesson> lessons) {
        this.lessons = lessons;
    }

    public void setAllFormValues(Instructor newInstructor) {
        this.setLastName(newInstructor.getLastName());
        this.setFirstName(newInstructor.getFirstName());
    }
}
