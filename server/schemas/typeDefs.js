const {gql} = require('apollo-server-express');

const typeDefs = gql`
type User{
    _id: ID
    username: String
    email: String
    bookCount: Int
    savedBooks: [Book]
}

type Book{
    authors: [String]
    description: String!
    bookId: String!
    image: String
    link: String
    title: String!
}

type Auth{
    token: ID!
    user: User
}

input BookInput {
    authors: [String]
    description: String!
    bookId: String!
    image: String
    link: String
    title: String!
}

type Query{
    me: User
    user(username: String, id: ID): User
}

type Mutation {
    login(email: String!, password: String!): Auth
    addUser(username: String!, email: String!, password: String!): Auth
    saveBook(bookInput: BookInput!): User // Now expects a BookInput type
    removeBook(bookId: String!): User
}
`

module.exports = typeDefs;