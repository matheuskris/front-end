import React, { useContext } from "react";
import { useQuery } from "@apollo/client";
import { Grid, Transition } from "semantic-ui-react";

import PostCard from "../../components/PostCard";
import "./styles.css";
import { AuthContext } from "../../context/auth.context";
import PostForm from "../../components/PostForm";
import { FETCH_POSTS_QUERY } from "../../util/graphql";

type Comment = {
  id: string;
  body: string;
  username: string;
  createdAt: string;
};
export type Like = {
  username: string;
  createdAt: string;
};
export type Post = {
  id: string;
  body: string;
  createdAt: string;
  username: string;
  comments: Comment[];
  likes: Like[];
  likesCount: number;
  commentsCount: number;
};
export type GetPostsData = {
  getPosts: Post[];
};

function Home() {
  const { loading, data, error } = useQuery<GetPostsData>(FETCH_POSTS_QUERY);
  const { currentUser: user } = useContext(AuthContext);

  return (
    <Grid columns={3}>
      <Grid.Row className="page-title">
        <h1>Recents Posts</h1>
      </Grid.Row>
      <Grid.Row>
        {user && (
          <Grid.Column>
            <PostForm />
          </Grid.Column>
        )}
        {loading ? (
          <h1>Loading Posts...</h1>
        ) : (
          <Transition.Group duration={1000}>
            {data &&
              data.getPosts.map((post) => (
                <Grid.Column key={post.id} style={{ marginBottom: "20px" }}>
                  <PostCard post={post} />
                </Grid.Column>
              ))}
          </Transition.Group>
        )}
      </Grid.Row>
    </Grid>
  );
}

export default Home;
