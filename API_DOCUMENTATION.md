# School Marks Management System - API Documentation

This document provides a comprehensive overview of the REST API endpoints available in the School Marks Management System.

## Base URL
The API is accessible at:
`http://localhost:5000/api` (Default development environment)

## Common Response Formats

### Success Response
```json
{
    "success": true,
    "data": { ... },
    "message": "Operation successful" // Optional
}
```

### Error Response
```json
{
    "success": false,
    "message": "Error description here"
}
```

---

## 1. Academic Boards
Endpoints for managing academic boards (e.g., CBSE, ICSE, State Board).

### Get All Boards
- **URL:** `/academic-boards`
- **Method:** `GET`
- **Success Response:** List of all boards.

### Create Board
- **URL:** `/academic-boards`
- **Method:** `POST`
- **Request Body:**
  ```json
  {
      "name": "CBSE" (Required)
  }
  ```

### Delete Board
- **URL:** `/academic-boards/:id`
- **Method:** `DELETE`

---

## 2. Schools
Endpoints for managing schools registered in the system.

### Get All Schools
- **URL:** `/schools`
- **Method:** `GET`

### Create School
- **URL:** `/schools`
- **Method:** `POST`
- **Request Body:**
  ```json
  {
      "name": "Green Valley High", (Required)
      "board": "BOARD_ID", (Required)
      "address": "123 Main St",
      "contactEmail": "admin@greenvalley.com",
      "contactPhone": "1234567890"
  }
  ```

---

## 3. Classes
Endpoints for managing classes within a school.

### Get All Classes
- **URL:** `/classes`
- **Method:** `GET`

### Create Class
- **URL:** `/classes`
- **Method:** `POST`
- **Request Body:**
  ```json
  {
      "name": "10th Standard", (Required)
      "section": "A",
      "school": "SCHOOL_ID", (Required)
      "academicYear": "2023-24" (Required)
  }
  ```

---

## 4. Subjects
Endpoints for managing subjects assigned to classes.

### Create Subject
- **URL:** `/subjects`
- **Method:** `POST`
- **Request Body:**
  ```json
  {
      "name": "Mathematics", (Required)
      "class": "CLASS_ID", (Required)
      "maxMarks": 100 (Required)
  }
  ```

---

## 5. Students
Endpoints for managing student profiles.

### Create Student
- **URL:** `/students`
- **Method:** `POST`
- **Request Body:**
  ```json
  {
      "name": "John Doe", (Required)
      "rollNumber": "101", (Required)
      "class": "CLASS_ID", (Required)
      "school": "SCHOOL_ID", (Required)
      "parentName": "Richard Doe",
      "contactPhone": "9876543210"
  }
  ```

---

## 6. Exams
Endpoints for managing examinations.

### Create Exam
- **URL:** `/exams`
- **Method:** `POST`
- **Request Body:**
  ```json
  {
      "name": "Final Semester", (Required)
      "type": "Theory", (Required)
      "class": "CLASS_ID", (Required)
      "academicYear": "2023-24", (Required)
      "maxMarks": 100 (Required)
  }
  ```

---

## 7. Marks Entry
Endpoints for recording student performance.

### Single Marks Entry
- **URL:** `/marks`
- **Method:** `POST`
- **Request Body:**
  ```json
  {
      "student": "STUDENT_ID", (Required)
      "subject": "SUBJECT_ID", (Required)
      "exam": "EXAM_ID", (Required)
      "marksObtained": 85, (Required)
      "remarks": "Excellent"
  }
  ```

### Bulk Marks Entry
- **URL:** `/marks/bulk`
- **Method:** `POST`
- **Request Body:**
  ```json
  [
      { "student": "ID1", "subject": "ID", "exam": "ID", "marksObtained": 80 },
      { "student": "ID2", "subject": "ID", "exam": "ID", "marksObtained": 90 }
  ]
  ```

---

## 8. Results & Reports
Calculated endpoints for generating reports.

### Student Overall Result
- **URL:** `/results/student/:studentId`
- **Method:** `GET`
- **Description:** Returns combined results for all exams/subjects for a student.

### Student Exam Specific Result
- **URL:** `/results/student/:studentId/exam/:examId`
- **Method:** `GET`
- **Description:** Returns detailed marks and grades for a specific student in a specific exam.

### Class Results (Consolidated)
- **URL:** `/results/class/:classId/exam/:examId`
- **Method:** `GET`
- **Description:** Returns a list of all students in a class with their marks for a specific exam.

---

## 9. Configuration (Utility)
Endpoints for setting up system logic.

### Grade Ranges
- **URL:** `/grade-ranges`
- **Method:** `POST`
- **Body:** `{ "school": "ID", "grade": "A", "minPercentage": 90, "maxPercentage": 100 }`

### Exam Weightage
- **URL:** `/exam-weightage`
- **Method:** `POST`
- **Body:** `{ "exam": "ID", "school": "ID", "class": "ID", "weightagePercent": 40 }`
