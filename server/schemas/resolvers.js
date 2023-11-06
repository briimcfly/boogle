const {AuthenticationError} = require('apollo-server-express');
const User = require('./models/User');
const { signToken } = require('./utils/auth');

const resolvers = {
    Query: {
        me: async(_, args, context) => {
            if (context.user) {
                return await User.findById(context.user._id).populate('savedBooks');
            }
            throw new AuthenticationError('You need to be logged in!');
        }
    },
    Mutation: {
        login: async(_, {email, password}) => {
            const user = await User.findOne({email});
            if (!user) {
                throw new AuthenticationError('Email or Password Incorrect');
            }

            const goodPass = await user.isCorrectPassword(password);

            if (!goodPass) {
                throw new AuthenticationError('Email or Password Incorrect');
            }

            const token = signToken(user);
            return{token, user};
        },
        addUser: async (_,{username, email, password}) => {
            const user = await User.create({username, email, password});
            const token = signToken(user);
            return {token, user};
        },
        saveBook: async(_, {bookInput}, context) => {
            if (context.user) {
                const updatedUser = await User.findByIdAndUpdate(
                    context.user._id,
                    {$addToSet: {savedBooks: bookInput}},
                    {new: true, runValidators: true}
                );
                return updatedUser;
            }
            throw new AuthenticationError('You need to be logged in!');
        },
        removeBook: async(_, {bookId}, context) => {
            if (context.user){
                const updatedUser = await User.findByIdAndUpdate(
                    context.user._id,
                    {$pull: {savedBooks: {bookId}}},
                    {new: true}
                )
                return updatedUser;
            }
            throw new AuthenticationError('You need to be logged in!');
        }
    }, 
}

module.exports = resolvers;
