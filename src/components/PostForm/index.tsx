import React, { FormEvent, useState } from "react";
import { Button, Form } from "semantic-ui-react";
import { gql, useMutation } from "@apollo/client";

import { FETCH_POSTS_QUERY } from "../../util/graphql";
import { Post } from "../../routes/Home/home";

type FetchPostsData = {
  getPosts: Post[];
};

function PostForm() {
  const [formbody, setformbody] = useState("");

  const [createPost, { error }] = useMutation(CREATE_POST_MUTATION, {
    variables: { body: formbody },
    update(proxy, result) {
      setformbody("");
      const data = proxy.readQuery<FetchPostsData>({
        query: FETCH_POSTS_QUERY,
      });
      console.log(data);
      if (data) {
        proxy.writeQuery({
          query: FETCH_POSTS_QUERY,
          data: { getPosts: [result.data.createPost, ...data?.getPosts] },
        });
      }
    },
  });

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    createPost();
  };

  return (
    <>
      <Form onSubmit={handleSubmit}>
        <h2>Create a post:</h2>
        <Form.Field>
          <Form.Input
            placeholder="What r u thinking?"
            name="body"
            onChange={(e) => {
              setformbody(e.target.value);
            }}
            value={formbody}
          />
          <Button type="submit" color="teal">
            Submit
          </Button>
        </Form.Field>
      </Form>
      {error && (
        <div className="ui error message" style={{ marginBottom: "10px" }}>
          <ul className="list">
            <li>{error.graphQLErrors[0].message}</li>
          </ul>
        </div>
      )}
    </>
  );
}

const CREATE_POST_MUTATION = gql`
  mutation createPost($body: String!) {
    createPost(body: $body) {
      id
      body
      createdAt
      username
      likes {
        username
        createdAt
      }
      comments {
        id
        body
        username
        createdAt
      }
      commentsCount
      likesCount
    }
  }
`;

export default PostForm;
