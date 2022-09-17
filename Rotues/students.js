const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const fetchstudent = require('../middleware/fetchstudent');
const jwt = require('jsonwebtoken');
const Student = require('../models/Students');
const dotenv =require('dotenv').config()
// 1) Route for  login 
router.post('/login',
    [
        //this is the layer of validation for no data multiplaction
        body('rollno', 'Enter a valid rollno').isLength({ min: 8 }),
    ],
    async (req, res) => {
        const errors = validationResult(req);

        //error checking 
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }


        //password and email destructing
        const { rollno } = req.body;


        try {
            let student = await Student.findOne({ rollno: rollno });

            //if someone try to login with another email then checking for this 
            if (!student) {
                return res.status(400).json({ errors: "Please try to login with correct credentials " });
            }

            //here students have not any type of secret or personal information so there is no need of password any one see the marks of student

            //authToken generation using user id which is the primary key for us
            const data = {
                student: {
                    id: student.id
                }
            }
            const authToken = jwt.sign(data, process.env.JWT_SECRET2);

            res.status(200).json(authToken);
        } catch (error) {
            console.log(error);
            res.status(500).send("Internal Server Occured");
        }

    });


    

// 2) Route for getting score login required 
router.post('/getscore', fetchstudent,
    [
        body('rollno', 'Enter a valid rollno ').isLength({ min: 8 })
    ],

    async (req, res) => {
        try {
            const errors = validationResult(req);
            //error checking 
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }
            const { rollno } = req.body;
            let student = await Student.findOne({ rollno: rollno })
            if (!student) {
                return res.status(400).json({ error: "Sorry a Student with this rollno is not exists" });
            }
            res.status(200).json(student);
        } catch (error) {
            console.log(error);
            res.status(500).send("Internal Sever Occured");
        }

    });


module.exports = router;