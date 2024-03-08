const bcrypt = require("bcrypt");
const User = require("../models/User");
const jwt = require("jsonwebtoken");
require("dotenv").config();

//sign up handler
exports.signup = async(req, res) => {

    try {
        //get data
        const {name, email, password, role} = req.body;
        
        //check if user already exist
        const existingUser = await User.findOne({email});

        if(existingUser) {
            //user already exist
            return res.status(400).json({
                success: false,
                message: "User already exists"
            });
        }

        //secure password
        let hashedPassword;
        try {
            hashedPassword = await bcrypt.hash(password, 10);
        } 
        catch (error) {
            return res.status(500).json({
                success: false,
                message: "Error in hashing password"
            })
        }

        //create entry for user
        const user = await User.create({
            name,
            email,
            password: hashedPassword,
            role
        });

        return res.status(200).json({
            success: true,
            message: "User created successfully"
        });
    } 
    catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "User cannot be registered! Please try again later"
        })
    }
}

//login handler
exports.login = async(req, res) => {
    try {
        //data fetch
        const {email, password} = req.body;

        //validation on email & password
        if(!email || !password) {
            return res.status(400).json({
                success: false,
                message: "Please fill all the details!"
            })
        }

        //check for registered user
        let user = await User.findOne({email});

        if(!user) {
            //not registered
            return res.status(400).json({
                success: false,
                message: "Please sign up first!"
            })
        }

        const payload = {
            email: user.email,
            id: user._id,
            role: user.role
        };
        const JWT_SECRET = process.env.JWT_SECRET;

        //verify password & generate a JWT token
        if(await bcrypt.compare(password, user.password)) {
            //password match
            let token = jwt.sign(payload, JWT_SECRET, {
                expiresIn: "2h"
            });
            
            user = user.toObject();
            user.token = token;
            user.password = undefined;

            const options = {
                expires: new Date(Date.now() + 3 * 24 *60 * 60 * 1000),
                httpOnly: true,
            }
            
            //create cookie
            res.cookie("token", token, options).status(200).json({
                success: true,
                token,
                user,
                message: "User loggen in successfully"
            })

            // res.status(200).json({
            //     success: true,
            //     token,
            //     user,
            //     message: "User loggen in successfully"
            // })
        }
        else {
            //password not match
            return res.status(403).json({
                success: false,
                message: "Incorrect Password!"
            })
        }    
    } 
    catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Login Failure"
        })
    }
}