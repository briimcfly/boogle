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
}
