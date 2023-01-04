const User = require('../models/User');
const bcrypt = require("bcrypt");
const { accountDetails} = require('../contract');

let accounts = [];
let i=0;
let j=0;
const startUp = async() => {
    let userArray=await User.find({});
    j=userArray.length;
    accounts = await accountDetails();

}
exports.signUP = async (req, res) => {
    
    startUp();
    const { name, email, password } = req.body;
    // Validate user input
    if (!(email && password && name)) {
        return res.status(400).send("All Inputs are required");
    }
    const oldUser = await User.findOne({ email: email.toLowerCase() });

    if (oldUser) {
        return res.status(409).send("User Already Exist. Please Login");
    }
    encryptedUserPassword = await bcrypt.hash(password, 10);
    // Create user in our database
    const user = {
        name: name,
        email: email.toLowerCase(), // sanitize
        password: encryptedUserPassword,
        account: accounts[j++]
    };
    if (user.account) {
        const userDAO = new User(user);
        userDAO.save((err) => {
            if (!err) {
                return res.status(200).send("User added successfully")

            } else {
                return res.status(400).send('User not Added');

            }
        });
    } else{
        return res.send("Max number of users added");
    }

}

exports.login = async (req, res) => {
    startUp();
    const { email, password } = req.body;
    try {
        const userObj = await User.findOne({ email: email.toLowerCase() });
        if (userObj) {
            const cmp = await bcrypt.compare(password, userObj.password);
            if(!(accounts.includes(userObj.account)))
            {
                try {
                    User.updateOne({ email: email.toLowerCase() }, {$set: {
                    account: accounts[i++]
                }}, (err,data) => {
                    if(!err)
                        console.log("Updated")
                    else 
                    console.log(err, "no update");
                });
            }
                catch (err){
                    console.log(err, "failed update")
                }
            }
            if (cmp) {
                return res.status(200).send({ message: 'User logged in', userId: userObj._id });
            } else {
                return res.status(400).send("Wrong username or password");
            }
        }
        else {
            return res.status(400).send("Wrong username or password");
        }
    }
    catch (error) {
        console.log(error);
        return res.status(500).send("Internal Server error Occured");
    }
}