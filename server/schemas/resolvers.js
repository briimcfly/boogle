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
        }
    },
}
