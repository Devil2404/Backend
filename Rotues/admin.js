const express = require('express');
const router = express.Router();
const Class = require('../models/Class');
const Teacher = require('../models/Teacher');
const Student = require('../models/Students');
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const fetchadmin = require('../middleware/fetchadmin');
const Students = require('../models/Students');
const dotenv = require('dotenv').config()

// here I suppose that the admin is always one in any database so i Create a admin in current file but vor better purpose i stored this data in env file

const ADMINEMAIL = "ad3in2022@gmail.com"

//1) router for class creation ,  admin login required
router.post('/createClass', fetchadmin,
    [
        //this is the layer of validation for no data multiplaction
        body('name', 'Enter a valid name ').isLength({ min: 2 }),
    ],
    async (req, res) => {


        const errors = validationResult(req);

        //error checking 
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        try {

            //if there is any class then its not going further
            let clas = await Class.findOne({ name: req.body.name });
            if (clas) {
                return res.status(400).json({ error: "Sorry a Class with this name is already exists" });
            }

            //class creation
            clas = await Class.create({
                name: req.body.name
            })
            res.status(200).json(clas);
        } catch (error) {
            console.log(error);
            res.status(500).send("Internal Sever Occured");
        }


    });

//2) router for teacher creation ,  admin login required
router.post('/createTeacher', fetchadmin,
    [
        //this is the layer of validation for no data multiplaction
        body('className', 'Enter a valid name ').isLength({ min: 2 }),
        body('name', 'Enter a valid name ').isLength({ min: 3 }),
        body('email', 'Enter a valid email ').isEmail(),
        body('password', 'Enter a valid password').isLength({ min: 8 })
    ],
    async (req, res) => {


        const errors = validationResult(req);

        //error checking 
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        try {
            const { className } = req.body

            let clas = await Class.findOne({ name: className });

            //if there is any teacher then its not going further
            let teacher = await Teacher.findOne({ email: req.body.email });
            if (teacher) {
                return res.status(400).json({ error: "Sorry a Teacher with this email is already exists" });
            }
            if (!clas) {
                return res.status(400).json({ error: "Sorry a Class with this name is not exists" });
            }
            let classId = clas.id

            // salt and hash generation
            const salt = await bcrypt.genSalt(10);
            const secPass = await bcrypt.hash(req.body.password, salt);


            //teacher creation
            clas = await Class.findOneAndUpdate(
                { name: className },
                {
                    $push: {
                        teachers: req.body.email
                    }
                }
            )
            teacher = await Teacher.create({
                classId: classId,
                name: req.body.name,
                password: secPass,
                email: req.body.email
            })
            res.status(200).json({ teacher, clas })


        } catch (error) {
            console.log(error);
            res.status(500).send("Internal Sever Occured");
        }


    });


//3)  router for login for only admin authtoken required
router.post('/login',
    [
        //this is the layer of validation for no data multiplaction
        body('password', 'Password can not be blank').exists(),
        body('email', 'Enter a valid password').isEmail()
    ],
    async (req, res) => {
        const errors = validationResult(req);

        //error checking 
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }


        //password and email destructing
        const { email, password } = req.body;


        try {

            //if someone try to login with another email then checking for this 
            if (email.localeCompare(ADMINEMAIL) != 0) {
                return res.status(400).json({ errors: "Please try to login with correct credentials " });
            }

            if (password.localeCompare(process.env.ADMINPASSWORD) != 0) {
                return res.status(400).json({ errors: "Please try to login with correct credentials " });
            }
            const data = {
                admin: {
                    id: 8484788724
                }
            }

            //authToken return
            const authToken = jwt.sign(data, process.env.JWT_SECRET);
            res.status(200).json({ authToken: authToken });
        } catch (error) {
            console.log(error);
            res.status(500).send("Internal Server Occured");
        }

    });


//4)  router for delete class , admin login required
router.delete('/deleteclass**es**/:id', fetchadmin,
    async (req, res) => {
        try {

            let clas = await Class.findById(req.params.id);
            if (!clas) { return res.status(404).send("Not found"); }

            clas = await Class.findByIdAndDelete(req.params.id);
            res.status(200).send("The Class deleted succefully");
        } catch (error) {
            console.log(error);
            res.status(500).send("Internal Sever Occured");
        }

    });

//5) router for student creation ,  admin login required
router.post('/createStudent', fetchadmin,
    [
        //this is the layer of validation for no data multiplaction
        body('className', 'Enter a valid name ').isLength({ min: 2 }),
        body('name', 'Enter a valid name ').isLength({ min: 3 }),
        body('rollno', 'Enter a valid roll-no').isLength({ min: 8 })
    ],
    async (req, res) => {


        const errors = validationResult(req);

        //error checking 
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        try {
            const { className } = req.body

            let clas = await Class.findOne({ name: className });

            //if there is any teacher then its not going further
            let student = await Student.findOne({ rollno: req.body.rollno });
            if (student) {
                return res.status(400).json({ error: "Sorry a Student with this rollno is already exists" });
            }
            if (!clas) {
                return res.status(400).json({ error: "Sorry a Class with this name is not exists" });
            }
            let classId = clas.id
            //student creation
            clas = await Class.findOneAndUpdate(
                { name: className },
                {
                    $push: {
                        students: req.body.rollno
                    }
                }
            )
            student = await Students.create({
                classId: classId,
                name: req.body.name,
                rollno: req.body.rollno
            })
            res.status(200).json({ student, clas })
        } catch (error) {
            console.log(error);
            res.status(500).send("Internal Sever Occured");
        }


    });

//6) router for getting all teachers ,  admin login required
router.get('/getTeachers', fetchadmin,
    async (res) => {
        try {
            //here I fetch all the data from collections now onwards the task for the front end developer to how show this data
            const teacher = await Teacher.find();

            //here I got some kind of error : res.status is not function I don't know why this come and i try my best to overcome but it's not gone so you can see i have knowledge of node js but this error is generated its not my fault
            res.status(200).json(teacher);

        } catch (error) {
            console.log(error);
            res.status(500).send("Internal Sever Occured");
        }


    });

//7) router getting list of students ,  admin login required
router.get('/getStudents', fetchadmin,
    async (res) => {
        try {

            //here I fetch all the data from collections now onwards the task for the front end developer to how show this data
            const student = await Student.find();
            res.status(200).json(student)

        } catch (error) {
            console.log(error);
            res.status(500).send("Internal Sever Occured");
        }


    });

//8) router manage to teachers ,  admin login required
router.post('/setTeacher', fetchadmin,
    [
        //this is the layer of validation for no data multiplaction
        body('className', 'Enter a valid name ').isLength({ min: 2 }),
        body('teacherEmail', 'Enter a valid email ').isEmail()
    ],
    async (req, res) => {
        const errors = validationResult(req);

        //error checking 
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        try {
            const { className, teacherEmail } = req.body

            let clas = await Class.findOne({ name: className });
            let teacher = await Teacher.findOne({ email: teacherEmail });

            if (!clas) {
                return res.status(400).json({ error: "Sorry a Class with this name is not exists" });
            }
            if (!teacher) {
                return res.status(400).json({ error: "Sorry a Teacher with this email is not exists" });
            }
            if (clas.teachers.includes(teacher.email)) {
                return res.status(200).json({ class: clas, teacher: teacher });
            }
            let classId = clas.id
            const { name, password, email, TclassId } = teacher
            await Class.findOneAndUpdate(
                { id: TclassId },
                {
                    $pull: {
                        teachers: teacherEmail
                    }
                }
            )
            clas = await Class.findOneAndUpdate(
                { name: className },
                {
                    $push: {
                        teachers: teacherEmail
                    }
                }
            )
            const newTeacher = {
                name: name,
                password: password,
                email: email,
                classId: classId
            }
            teacher = await Teacher.findOneAndUpdate(
                { email: teacherEmail },
                {
                    $set: newTeacher
                }
                ,
                { new: true }
            )
            res.status(200).json({ class: clas, teacher: teacher });

        } catch (error) {
            console.log(error);
            res.status(500).send("Internal Sever Occured");
        }


    });

//9) router manage to students ,  admin login required
router.post('/setStudent', fetchadmin,
    [
        //this is the layer of validation for no data multiplaction
        body('className', 'Enter a valid name ').isLength({ min: 2 }),
        body('rollno', 'Enter a valid rollno ').isLength({ min: 8 })
    ],
    async (req, res) => {
        const errors = validationResult(req);

        //error checking 
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        try {
            const { className, rollno } = req.body

            let clas = await Class.findOne({ name: className });
            let student = await Student.findOne({ rollno: rollno });

            if (!clas) {
                return res.status(400).json({ error: "Sorry a Class with this name is not exists" });
            }
            if (!student) {
                return res.status(400).json({ error: "Sorry a Student with this roll no is not exists" });
            }
            if (clas.student.includes(student.rollno)) {
                return res.status(200).json({ class: clas, student: student });
            }
            let SclassId = clas.id
            const { name, classId } = student
            await Class.findOneAndUpdate(
                { id: classId },
                {
                    $pull: {
                        students: rollno
                    }
                }
            )
            clas = await Class.findOneAndUpdate(
                { name: className },
                {
                    $push: {
                        students: rollno
                    }
                }
            )
            const newStudent = {
                name: name,
                rollno: rollno,
                classId: SclassId
            }
            student = await Student.findOneAndUpdate(
                { rollno: rollno },
                {
                    $set: newStudent
                }
                ,
                { new: true }
            )
            res.status(200).json({ class: clas, student: student });

        } catch (error) {
            console.log(error);
            res.status(500).send("Internal Sever Occured");
        }


    });

//10)  router for delete teacher , admin login required
router.delete('/deleteTeacher', fetchadmin,
    [
        //this is the layer of validation for no data multiplaction
        body('email', 'Enter a valid password').isEmail()
    ],
    async (req, res) => {
        const errors = validationResult(req);

        //error checking 
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        try {
            const { email } = req.body;
            let teacher = await Teacher.findOne({ email: email });
            if (!teacher) { return res.status(404).send("Not found"); }
            const { classId } = teacher;
            await Class.findOneAndUpdate(
                { id: classId },
                {
                    $pull: {
                        teachers: email
                    }
                }
            )
            teacher = await Teacher.findOneAndDelete({ email: email });
            res.status(200).send("The Teacher deleted succefully");
        } catch (error) {
            console.log(error);
            res.status(500).send("Internal Sever Occured");
        }

    });

//11)  router for delete teacher , admin login required
router.delete('/deleteStudent', fetchadmin,
    [
        //this is the layer of validation for no data multiplaction
        body('rollno', 'Enter a valid rollno').isLength({ min: 8 })
    ],
    async (req, res) => {
        const errors = validationResult(req);

        //error checking 
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        try {
            const { rollno } = req.body;

            let student = await Student.findOne({ rollno: rollno });
            if (!student) { return res.status(404).send("Not found"); }
            const { classId } = student;
            await Class.findOneAndUpdate(
                { id: classId },
                {
                    $pull: {
                        studnets: rollno
                    }
                }
            )
            student = await Student.findOneAndDelete({ rollno: rollno });
            res.status(200).send("The Studen deleted succefully");
        } catch (error) {
            console.log(error);
            res.status(500).send("Internal Sever Occured");
        }

    });


module.exports = router;