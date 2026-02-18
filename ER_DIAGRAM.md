# School Marks Management System - ER Diagram

This document contains the Entity-Relationship (ER) diagram for the School Marks Management System. It illustrates the relationships between core entities like Academic Boards, Schools, Classes, Subjects, Students, Exams, and Marks.

## Entity Relationship Diagram

```mermaid
erDiagram
    ACADEMIC-BOARD ||--o{ SCHOOL : "oversees"
    SCHOOL ||--o{ CLASS : "contains"
    SCHOOL ||--o{ STUDENT : "enrolls"
    SCHOOL ||--o{ EXAM-WEIGHTAGE : "defines"
    SCHOOL ||--o{ GRADE-RANGE : "sets"
    
    CLASS ||--o{ SUBJECT : "teaches"
    CLASS ||--o{ STUDENT : "groupings"
    CLASS ||--o{ EXAM : "schedules"
    CLASS ||--o{ EXAM-WEIGHTAGE : "applies_to"
    
    STUDENT ||--o{ MARKS : "achieves"
    SUBJECT ||--o{ MARKS : "measured_in"
    EXAM ||--o{ MARKS : "recorded_for"
    EXAM ||--o{ EXAM-WEIGHTAGE : "has_weight"

    ACADEMIC-BOARD {
        string name
        string description
        boolean isActive
    }

    SCHOOL {
        string name
        string address
        string board_id FK
        string contactEmail
        string contactPhone
        boolean isActive
    }

    CLASS {
        string name
        string section
        string school_id FK
        string academicYear
        boolean isActive
    }

    SUBJECT {
        string name
        string code
        string class_id FK
        number maxMarks
        boolean isActive
    }

    STUDENT {
        string name
        string rollNumber
        string class_id FK
        string school_id FK
        string parentName
        string contactPhone
        date dateOfBirth
        boolean isActive
    }

    EXAM {
        string name
        string type
        string class_id FK
        string academicYear
        number maxMarks
        date date
        string description
        boolean isActive
    }

    MARKS {
        string student_id FK
        string subject_id FK
        string exam_id FK
        number marksObtained
        string grade
        string remarks
    }

    EXAM-WEIGHTAGE {
        string exam_id FK
        string school_id FK
        string class_id FK
        number weightagePercent
    }

    GRADE-RANGE {
        string school_id FK
        string grade
        number minPercentage
        number maxPercentage
        string description
    }
```

## Entity Details

### 1. Academic Board
Global entity representing the educational board (e.g., CBSE, ICSE).

### 2. School
The primary organization unit. All data (students, classes, grade ranges) is scoped to a school.

### 3. Class
A specific grade and section within a school for a particular academic year.

### 4. Subject
The individual courses taught in a class. Each subject has its own maximum marks.

### 5. Student
The individual learners enrolled in a school and assigned to a class.

### 6. Exam
An examination event for a specific class. Students in that class take this exam.

### 7. Marks
The junction entity that records a student's performance in a particular subject for a specific exam.

### 8. Exam Weightage
Configuration to determine how much a specific exam contributes to the final consolidated result for a class.

### 9. Grade Range
Configuration for automatic grade calculation (e.g., 90-100% = A) specific to each school.
