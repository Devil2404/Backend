const express = require('express');
const router = express.Router();
const Student = require('../models/Students');
const Teacher = require('../models/Teacher');
const Class = require('../models/Class');
const bcrypt = require('bcrypt');
const { body, validationResult } = require('express-validator');
const fetchteacher = require('../middleware/fetchteacher');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv').config()

//1)  router for login teacher authtoken required
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
            let teacher = await Teacher.findOne({ email: email });

            //if someone try to login with another email then checking for this 
            if (!teacher) {
                return res.status(400).json({ errors: "Please try to login with correct credentials " });
            }
            const passwordComp = await bcrypt.compare(password, teacher.password);
            if (!passwordComp) {
                return res.status(400).json({ errors: "Please try to login with correct credentials " });
            }
            const data = {
                teacher: {
                    id: teacher.id
                }
            }
            const authToken = jwt.sign(data, process.env.JWT_SECRET1);

            res.status(200).json(authToken);
        } catch (error) {
            console.log(error);
            res.status(500).send("Internal Server Occured");
        }

    });


// 2) Route for list of all students login required  in a shorted order
router.get('/getStudents', fetchteacher,
    async (res) => {
        try {

            //here I fetch all the data from collections now onwards the task for the front end developer to how show this data
            const student = await Student.find().sort("name:1");
            res.status(200).json(student);

        } catch (error) {
            console.log(error);
            res.status(500).send("Internal Sever Occured");
        }


    });



//I created array of objects because using this I can get all the data together and I also show the past score card also this two things are plus point.


// 3) route for add score of students, login required
router.post('/addscore', fetchteacher,
    [

        body('Subject', 'Enter a Subject Name ').isLength({ min: 3 }),
        body('className', 'Enter a Class Name ').isLength({ min: 2 }),
        body('rollno', 'Enter a valid rollno ').isLength({ min: 8 }),
        body('DoE', 'Enter a valid Date').isDate(),
        body('Score', 'Enter a valid score').isInt()
    ],

    async (req, res) => {
        try {
            const errors = validationResult(req);
            //error checking 
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }
            const { Subject, DoE, Score, comment, rollno, className } = req.body;
            let clas = await Class.findOne({ name: className });
            let student = await Student.findOne({ rollno: rollno })
            if (!student) {
                return res.status(400).json({ error: "Sorry a Student with this rollno is not exists" });
            }
            if (!clas) {
                return res.status(400).json({ error: "Sorry a Class with this name is not exists" });
            }
            const score = {
                className, Subject, DoE, Score, comment, DoS: Date.now()
            }
            student = await Student.findOneAndUpdate(
                { rollno: rollno },
                {
                    $push: {
                        score: score
                    }
                }
            )
            res.status(200).json(student);

        } catch (error) {
            console.log(error);
            res.status(500).send("Internal Sever Occured");
        }

    });


//4) route for add percantage of students login required
router.post('/addpercantage', fetchteacher,
    [
        body('className', 'Enter a Class Name ').isLength({ min: 2 }),
        body('max', 'Enter a max value ').isInt(),
        body('rollno', 'Enter a valid rollno ').isLength({ min: 8 })
    ],

    async (req, res) => {
        try {
            const errors = validationResult(req);
            //error checking 
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }
            const { rollno, className, max } = req.body;
            let student = await Student.findOne({ rollno: rollno })
            if (!student) {
                return res.status(400).json({ error: "Sorry a Student with this rollno is not exists" });
            }
            let clas = await Class.findOne({ name: className });
            if (!clas) {
                return res.status(400).json({ error: "Sorry a Class with this name is not exists" });
            }
            let total = 0
            student.score.forEach((e) => {
                if (e.className === className) {
                    total += parseInt(e.Score)
                }
                else {
                    return res.status(405).json({ error: "Sorry a className is not valid" });
                }
            })
            let t = student.score.length;
            let percantage = (total / (max * t)) * 100
            student = await Student.findOneAndUpdate(
                { rollno: rollno },
                {
                    $push: {
                        percantage: percantage
                    }
                }
            )
            res.status(200).json(student);

        } catch (error) {
            console.log(error);
            res.status(500).send("Internal Sever Occured");
        }

    });

//5) route for ranking students , teacher login required
router.post('/ranking', fetchteacher,
    [
        body('className', 'Enter a Class Name ').isLength({ min: 2 })
    ],

    async (req, res) => {
        try {
            var result = [];
            const errors = validationResult(req);
            //error checking 
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }
            const { className } = req.body;
            let clas = await Class.findOne({ name: className });
            if (!clas) {
                return res.status(400).json({ error: "Sorry a Class with this name is not exists" });
            }

            
            clas.students.forEach(async (e) => {
                let student = await Student.findOne({ rollno: e })
                if (student) {
                    if (student.classId.toString() === clas.id) {
                        result.push(
                            {
                                name: student.name,
                                percantage: student.percantage[student.percantage.length - 1]
                            }
                        );
                    }
                }
                console.log(result);
            })
            result.sort((a, b) => {
                if (a.percantage > b.percantage) {
                    return -1;
                }
                if (a.percantage < b.percantage) {
                    return 1;
                }
                return 0;
            })
            console.log(result);

            res.status(200).json({ result });
        } catch (error) {
            console.log(error);
            res.status(500).send("Internal Sever Occured");
        }

    });


module.exports = router;