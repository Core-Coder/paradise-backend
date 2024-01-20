const bcrypt = require('bcrypt');
const {User} = require ('../dbHandler/createTabel')


const Register = async (req, res, next) => {
    const { name, password, tanggalLahir, jenisKelamin, emailUser } = req.body;
    
    if (!name || !password || !tanggalLahir || !jenisKelamin || !emailUser) {
        return res.status(400).json({ error: 'Data belum lengkap' });
    }

    try {
        const salt = await bcrypt.genSalt();
        const hashPassword = await bcrypt.hash(password, salt);

        await User.create({
            name: name,
            password: hashPassword,
            tanggalLahir: tanggalLahir,
            jenisKelamin: jenisKelamin,
            emailUser: emailUser,
        });
        
        res.status(200).json({ status: 'User registered successfully' })
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server Error' });
    }
};
module.exports = Register;