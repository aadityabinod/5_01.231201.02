import mongoose from "mongoose"

const userSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true
    },
    email:{
        type: String,
        unique: true,
        required: true
    },
    password:{
        type: String,
        required: true
    },
    aboutme:{

    },
    isVerififed:{
        type: Boolean,
        default: false,
    },
    resetPasswordToken: String,
    resetPasswordExpires: Date,
    verificationToken: String,
    verificationExpiresAt: Date,
},{
    timestamps: true
})


userSchema.methods.ComparePassword = async function(password){
    return await bcrypt.compare(password, this.password)
}

userSchema.statics.hashPassword = async function(password){
    return await bcrypt.hash(password, 10)
}

userSchema.methods.generateAuthToken = function(){
    return jwt.sign({_id: this._id}, process.env.JWT_SECRET)
}

const User = mongoose.model('User', userSchema)

export default User