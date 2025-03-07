import { check } from 'express-validator'


const CheckRegValadation = [
    check('name').notEmpty().withMessage('Name is required'),
    check('email').isEmail().withMessage('Please include a valid email'),
    check('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters long')
]

const CheckLoginValadation = [
    
    check('email').isEmail().withMessage('Please include a valid email'),
    check('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters long')
]

const checkProjectValadation = [
    check('name').notEmpty().withMessage('Name is required'),
]

export { CheckLoginValadation , CheckRegValadation , checkProjectValadation}