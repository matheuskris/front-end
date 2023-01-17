import { Navigate, useNavigate, useParams } from "react-router-dom";
import { gql, useQuery, useMutation } from "@apollo/client";
import { Post } from "../Home/home";
import {
  Button,
  Card,
  CardContent,
  Grid,
  GridColumn,
  Image,
  Form,
} from "semantic-ui-react";
import moment from "moment";
import { AuthContext } from "../../context/auth.context";
import { useContext, useState } from "react";
import LikeButton from "../../components/LikeButton/LikeButton";
import MyLoader from "../../components/Loader";
import DeleteButton from "../../components/DeleteButton";

type SinglePostRouteParams = {
  postId: string;
};

const FETCH_POST_QUERY = gql`
  query getMyPost($postId: ID!) {
    getPost(postId: $postId) {
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

const SUBMIT_COMMENT_MUTATION = gql`
  mutation ($postId: ID!, $body: String!) {
    createComment(postId: $postId, body: $body) {
      id
      comments {
        id
        body
        createdAt
        username
      }
      commentsCount
    }
  }
`;

type GetPostData = {
  getPost: Post;
};

function SinglePost() {
  const { postId } = useParams<
    keyof SinglePostRouteParams
  >() as SinglePostRouteParams;

  const navigate = useNavigate();
  const [comment, setComment] = useState("");
  const { currentUser: user } = useContext(AuthContext);
  const { data, loading } = useQuery<GetPostData>(FETCH_POST_QUERY, {
    variables: { postId },
    onError: (err) => {
      console.log(err);
    },
  });

  const [submitComment] = useMutation(SUBMIT_COMMENT_MUTATION, {
    update() {
      setComment("");
    },
    variables: {
      postId,
      body: comment,
    },
  });

  function deletePostCallback() {
    navigate("/");
  }

  return (
    <>
      <Grid style={{ marginTop: "20px", marginInline: "auto" }}>
        <Grid.Row>
          {loading ? (
            <GridColumn width={12}>
              <MyLoader active={loading} />
            </GridColumn>
          ) : (
            data && (
              <>
                <Grid.Column width={2}>
                  <Image
                    src="https://react.semantic-ui.com/images/avatar/large/molly.png"
                    size="small"
                    floated="right"
                  />
                </Grid.Column>
                <Grid.Column width={10}>
                  <Card fluid>
                    <Card.Content>
                      <Card.Header>{data.getPost.username}</Card.Header>
                      <Card.Meta>
                        {moment(data.getPost.createdAt).fromNow()}
                      </Card.Meta>
                      <Card.Description>{data.getPost.body}</Card.Description>
                    </Card.Content>
                    <hr />
                    <CardContent extra>
                      <LikeButton post={data.getPost} />
                      <Button
                        as="div"
                        labelPosition="right"
                        onClick={() => {
                          console.log("comment");
                        }}
                        color="blue"
                        icon="comments"
                        basic
                        label={{
                          basic: true,
                          color: "blue",
                          pointing: "left",
                          content: `${data.getPost.commentsCount}`,
                        }}
                      />
                      {data.getPost.username === user?.username && (
                        <DeleteButton
                          postId={postId}
                          callback={deletePostCallback}
                        />
                      )}
                    </CardContent>
                  </Card>
                  {user && (
                    <Card fluid>
                      <Card.Content>
                        <p>Post a comment</p>
                        <Form>
                          <div className="ui action input fluid">
                            <input
                              type="text"
                              placeholder="Comment.."
                              name="comment"
                              value={comment}
                              onChange={(e) => setComment(e.target.value)}
                            />
                            <button
                              type="submit"
                              className="ui button teal"
                              disabled={comment.trim() === ""}
                              onClick={() => {
                                submitComment();
                              }}
                            >
                              Submit
                            </button>
                          </div>
                        </Form>
                      </Card.Content>
                    </Card>
                  )}
                  {data.getPost.comments.map((comment) => (
                    <Card fluid key={comment.id}>
                      <Card.Content>
                        {user && user.username === comment.username && (
                          <DeleteButton
                            postId={postId}
                            commentId={comment.id}
                          />
                        )}
                        <Card.Header>{comment.username}</Card.Header>
                        <Card.Meta>
                          {moment(comment.createdAt).fromNow()}
                        </Card.Meta>
                        <Card.Description>{comment.body}</Card.Description>
                      </Card.Content>
                    </Card>
                  ))}
                </Grid.Column>
              </>
            )
          )}
        </Grid.Row>
      </Grid>
    </>
  );
}

export default SinglePost;
