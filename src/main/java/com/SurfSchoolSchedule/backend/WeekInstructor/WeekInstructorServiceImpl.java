package com.SurfSchoolSchedule.backend.WeekInstructor;

import com.SurfSchoolSchedule.backend.Instructor.Instructor;
import com.SurfSchoolSchedule.backend.Lesson.Lesson;
import com.SurfSchoolSchedule.backend.Lesson.LessonRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;
import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.time.temporal.TemporalAdjusters;
import java.util.ArrayList;
import java.util.List;


@Service
public class WeekInstructorServiceImpl implements WeekInstructorService<WeekInstructor> {

    @Autowired
    WeekInstructorRepository weekInstructorRepository;

    @Autowired
    LessonRepository lessonRepository;


    @Transactional
    @Override
    public Page<WeekInstructor> getAll(Pageable pageable) {
        Page<WeekInstructor> allElementsPage = weekInstructorRepository.findAll(pageable);
        List<WeekInstructor> allElementsList = allElementsPage.getContent();

        for (WeekInstructor weekInstructor : allElementsList) {
            setValues(pageable, weekInstructor, weekInstructor.getInstructor());
        }

        return allElementsPage;
    }


    @Transactional
    @Override
    public WeekInstructor getWeekInstructor(long id) {
        return weekInstructorRepository.findById(id).get();
    }

    @Transactional
    @Override
    public Page<WeekInstructor> getAllWeekInstructorForInstructor(Pageable pageable, Long instructorId) {
        return weekInstructorRepository.getAllWeekInstructorForInstructor(pageable, instructorId);
    }


    @Override
    public WeekInstructor getWeekInstructorForInstructorForGivenDate(Pageable pageable, Long instructorId, String date) {

        WeekInstructor rightWeekInstructor = null;


        Page<WeekInstructor> weekInstructorPage = weekInstructorRepository.getAllWeekInstructorForInstructor(pageable, instructorId);

        List<WeekInstructor> weekInstructorList = weekInstructorPage.getContent();

        DateTimeFormatter fmt = DateTimeFormatter.ofPattern("MM-dd-yyyy");
        LocalDate dateLocalDate = LocalDate.parse(date, fmt);


        for (WeekInstructor weekInstructor : weekInstructorList) {
            LocalDate monday = LocalDate.parse(weekInstructor.getBeginningDate(), fmt);
            LocalDate sunday = LocalDate.parse(weekInstructor.getEndDate(), fmt);

            if (isInDateRange(monday, sunday, dateLocalDate)) {
                rightWeekInstructor = weekInstructor;
                break;
            }
        }
        return rightWeekInstructor;
    }


    @Transactional
    @Override
    public WeekInstructor addNewWeekInstructor(Pageable pageable, WeekInstructor newWeekInstructor) {
        if (weekInstructorDoesNotExist(pageable, newWeekInstructor))
            return weekInstructorRepository.save(newWeekInstructor);
        else
            throw new RuntimeException("Week Instructor already in the data base");
    }

    private boolean weekInstructorDoesNotExist(Pageable pageable, WeekInstructor newWeekInstructor) {
        return weekInstructorRepository.weekInstructorDoesNotExist(pageable, newWeekInstructor.getInstructor().getId(), newWeekInstructor.getBeginningDate(),
                newWeekInstructor.getEndDate()).isEmpty();
    }


    @Transactional
    @Override
    public void deleteWeekInstructor(long weekInstructorId) {
        WeekInstructor l = weekInstructorRepository.findById(weekInstructorId).get();
        weekInstructorRepository.delete(l);
    }

    @Transactional
    @Override
    public void updateWeekInstructor(Pageable pageable, WeekInstructor weekInstructor, long id) {
        if (sameWeekInstructorDoesNotExist(pageable, weekInstructor)) {
            System.out.println(id);
            WeekInstructor wi = weekInstructorRepository.findById(id).get();
            wi.setAllFormValues(weekInstructor);
        } else
            throw new RuntimeException("Can't update weekInstructor - already in the dataBase");

    }

    private boolean sameWeekInstructorDoesNotExist(Pageable pageable, WeekInstructor weekInstructor) {
        return (weekInstructorRepository.sameWeekInstructorDoesNotExist(pageable, weekInstructor.getInstructor().getId(), weekInstructor.getBeginningDate(),
                weekInstructor.getEndDate(), weekInstructor.getId()).isEmpty());
    }

    @Override
    public void setValues(Pageable pageable, WeekInstructor weekInstructor, Instructor instructor) {
        weekInstructor.setInstructor(instructor);
        setDates(weekInstructor);
        setNrOfLessons(pageable, weekInstructor);
        setWeekWage(weekInstructor);


    }

    private void setDates(WeekInstructor weekInstructor) {
        LocalDate today = LocalDate.now();
        LocalDate lastMonday = today.with(TemporalAdjusters.previousOrSame(DayOfWeek.MONDAY));
        String lastMondayString = lastMonday.format(DateTimeFormatter.ofPattern("MM-dd-yyyy"));

        LocalDate closestSunday = lastMonday.with(TemporalAdjusters.nextOrSame(DayOfWeek.SUNDAY));
        String closestSundayString = closestSunday.format(DateTimeFormatter.ofPattern("MM-dd-yyyy"));

        weekInstructor.setBeginningDate(lastMondayString);
        weekInstructor.setEndDate(closestSundayString);
    }

    private void setNrOfLessons(Pageable pageable, WeekInstructor weekInstructor) {
        String beginningDate = weekInstructor.getBeginningDate();
        String endDate = weekInstructor.getEndDate();


        Sort tempSort = Sort.by(Sort.Order.desc("status"));
        Pageable tempPageable = PageRequest.of(
                0, 999999999, tempSort);
        Page<Lesson> allInstructorLessonsPage = lessonRepository.getAllInstructorLessons(tempPageable, weekInstructor.getInstructor().getId());

        List<Lesson> allInstructorLessonsList = allInstructorLessonsPage.getContent();


        double countLessons1p = 0;
        double countLessons2p = 0;
        double countLessons3p = 0;
        double allLessonsCount = 0;


        List<Lesson> instructorWeekLessons = new ArrayList<>();
        for (Lesson lesson : allInstructorLessonsList) {
            if (lessonInDateRange(lesson, weekInstructor) && lesson.getStatus() != Lesson.Status.Not_Given && lesson.getStatus() != Lesson.Status.To_Give) {
                instructorWeekLessons.add(lesson);
                switch (lesson.getNrStudents()) {
                    case 1:
                        countLessons1p += lesson.getHowLong();
                        break;
                    case 2:
                        countLessons2p += lesson.getHowLong();
                        break;
                    default:
                        countLessons3p += lesson.getHowLong();
                        break;
                }
            }
        }
        allLessonsCount = countLessons1p + countLessons2p + countLessons3p;

        weekInstructor.setFullNrOfLessonsWeek(allLessonsCount);
        weekInstructor.setNrOfLessons1p(countLessons1p);
        weekInstructor.setNrOfLessons2p(countLessons2p);
        weekInstructor.setNrOfLessons3p(countLessons3p);

    }

    private boolean lessonInDateRange(Lesson lesson, WeekInstructor weekInstructor) {
        DateTimeFormatter fmt = DateTimeFormatter.ofPattern("MM-dd-yyyy");

        LocalDate monday = LocalDate.parse(weekInstructor.getBeginningDate(), fmt);
        LocalDate sunday = LocalDate.parse(weekInstructor.getEndDate(), fmt);

        String lessonDateInRightFormat = addZeroAtBeggingIfNeeded(lesson.getDate());
        LocalDate lessonDate = LocalDate.parse(lessonDateInRightFormat, fmt);


        Boolean isInRange = isInDateRange(monday, sunday, lessonDate);

        return isInRange;
    }

    private boolean isInDateRange(LocalDate beginning, LocalDate end, LocalDate date) {
        return (!date.isBefore(beginning) && !end.isBefore(date));
    }

    private String addZeroAtBeggingIfNeeded(String date) {
        String tempDate[] = date.split("-");
        StringBuffer sb = new StringBuffer();
        for (int i = 0; i < tempDate.length; ++i) {
            if (tempDate[i].length() == 1)
                tempDate[i] = "0".concat(tempDate[i]);
            sb.append(tempDate[i]);
            if (i != tempDate.length - 1)
                sb.append("-");
        }
        String correctDate = sb.toString();
        return correctDate;
    }

    private void setWeekWage (WeekInstructor weekInstructor) {
        double weekWage = 0;
        double hourWage = weekInstructor.getInstructor().getHourWage();

        weekWage += hourWage * (weekInstructor.getNrOfLessons1p());
        weekWage += (hourWage + 5.0) * (weekInstructor.getNrOfLessons2p());
        weekWage += (hourWage + 10.0) * (weekInstructor.getNrOfLessons3p());

        weekInstructor.setWeekWage(weekWage);
    }

@Override
public void setStatus(Pageable pageable, WeekInstructor weekInstructor, WeekInstructor.Status status) {
        weekInstructor.setStatus(status);
    }


}

