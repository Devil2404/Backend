
# School Management Software

This software is manage the three different users and their data.
The users are Admin, Teacher and Student. And this application is maintain the data of the class, information of teacher and also contain the info of students and thier marks

## Used By

This project is used by any School how can manage thier data very efficiently.

## Tech Stack


**Server:** Node, Express,MongoDb


## Features

- To manage classes like create,delete,update only for admin
- To manage teacher and student and give credential, and also mapping them in class only for admin
- To get students score for anyone
- To get all the list of teachers and students only for admin
- To add score of student only for teacher 
- To maintane whole data of teachers ,classes and students


## Documentation
**Endpoints:**


 #### login for admin
```http
  POST localhost:5000/api/admin/login
```
- Require admin login and password and give back the auth token

 #### Create Teacher
```http
  POST localhost:5000/api/admin/createTeacher
```
- Require class name , name of teacher , teacher's email and password and its for only admin
 
  #### Create Class
```http
  POST localhost:5000/api/admin/createClass
```
- Require class name and its for only admin
 
  #### Create Student
```http
  POST localhost:5000/api/admin/createTeacher
```
- Require class name , rollno and its for only admin

 #### Mapping for Teacher
```http
  POST localhost:5000/api/admin/setTeacher
```
- Require class name , teacher's email, password and its for only admin
 
 #### Mapping for Studnet
```http
  POST localhost:5000/api/admin/setStudent
```
- Require class name , roll no of studnet and its for only admin
 
 #### Get Student list
```http
  GET localhost:5000/api/admin/getStudent
```
- Require class name and its for  admin and teacher

 #### Get Teacher list
```http
  GET /api/admin/getTeacher
```
- Require class name and its for only admin

 #### Delete Class
```http
  POST localhost:5000/api/admin/deleteClass
```
- Require class name and its for only admin
 #### Delete Teacher
```http
  POST localhost:5000/api/admin/deleteTeacher
```
 #### Delete Student
```http
  POST localhost:5000/api/admin/deleteStudent
```
- Require roll no and its for only admin

 #### Login for teacher
```http
  POST localhost:5000/api/teacher/login
```
 #### Add score
```http
  POST localhost:5000/api/teacher/addscore
```
- Require Subject Name , class , date of exam, date of result , and score and it's only for teacher

 #### Get  Rank
```http
  POST localhost:5000/api/teacher/ranking
```
- Require class name and it is only for teacher 

 #### Marksheet
```http
  POST localhost:5000/api/student/getscore
```
- Require roll no and its for all