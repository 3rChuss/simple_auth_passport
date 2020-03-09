const        mongoose   =   require('mongoose'),
passportLocalMongoose   =   require('passport-local-mongoose');

const UserSchema = new mongoose.Schema({
    username: String,
    password: String
});
// add all the features from passport to our schema
UserSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('User', UserSchema);