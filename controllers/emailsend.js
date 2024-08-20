
const userSchema=require('../models/users');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

// Forgot password endpoint
exports.forget = async (req, res, next) => {
    const { email } = req.body;
    try {
        const user = await userSchema.findOne({email:email}).select('password -_id')
        
        if (!user) {
            return res.status(404).send('User not found');
        }
        console.log(user,'s')
        // const jwtPassword = await jwt.sign({ password: user[0].password, email: email }, 'munisekhar');
        console.log(`http://localhost:3000/forgetPasswordLink/${user.password}`);
        res.status(200).send('Password reset link has been sent to your email');
    } catch (err) {
        console.error(err);
        res.status(500).send('Internal server error');
    }
};

// Forgot password link endpoint
exports.forgetPasswordLink = async (req, res, next) => {
    const token = req.params.token;
    console.log(token)
    if (!token) {
        return res.status(400).send('Token is required');
    }
    
    const jwtToken = token.split(':')[1];
    
    jwt.verify(jwtToken, 'munisekhar', async (err, decoded) => {
        if (err) {
            return res.status(401).send('Not allowed');
        }
        
        console.log(decoded);
        
        // Render the password reset form
        res.send(`
            <form action='/resetPassword' method='POST'>
                <input type='hidden' name='email' value='${decoded.email}' />
                <input type='password' name='newPassword' placeholder='New Password' required />
                <button type='submit'>Reset Password</button>
            </form>
        `);
    });
};

// Password reset endpoint
exports.resetPassword = async (req, res, next) => {
    const { email, newPassword } = req.body;
    try {
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        await userSchema.findOneAndUpdate({email:email},{password:hashedPassword}) 
        
        res.status(200).send('Password has been reset successfully');
    } catch (err) {
        console.error(err);
        res.status(500).send('Internal server error');
    }
};
