import { gql } from "@apollo/client";

export const FETCH_POSTS_QUERY = gql`
  query fetchPosts {
    getPosts {
      id
      body
      createdAt
      username
      likesCount
      likes {
        username
      }
      commentsCount
      comments {
        id
        username
        createdAt
        body
      }
    }
  }
`;
