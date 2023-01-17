import { Post } from "../../routes/Home/home";
import { Card, Image, Button, Icon, Popup } from "semantic-ui-react";
import moment from "moment";
import { Link } from "react-router-dom";

import { useContext } from "react";
import { AuthContext } from "../../context/auth.context";
import LikeButton from "../LikeButton/LikeButton";
import DeleteButton from "../../components/DeleteButton";

type PostCardProps = {
  post: Post;
};

function PostCard({ post }: PostCardProps) {
  const { body, createdAt, id, username, likesCount, commentsCount, likes } =
    post;
  const { currentUser: user } = useContext(AuthContext);

  function likePost() {
    console.log("like post");
  }
  return (
    <Card>
      <Card.Content>
        <Image
          floated="right"
          size="mini"
          src="https://react.semantic-ui.com/images/avatar/large/molly.png"
        />
        <Card.Header>{username}</Card.Header>
        <Card.Meta as={Link} to={`/posts/${id}`}>
          {moment(createdAt as string).fromNow()}
        </Card.Meta>
        <Card.Description>{body}</Card.Description>
      </Card.Content>
      <Card.Content extra>
        <LikeButton post={{ id, likesCount, likes }} />
        <Popup
          content="Comment on Post"
          inverted
          trigger={
            <Button
              as={Link}
              to={`/posts/${id}`}
              labelPosition="right"
              onClick={likePost}
              color="blue"
              icon="comments"
              basic
              label={{
                basic: true,
                color: "blue",
                pointing: "left",
                content: `${commentsCount}`,
              }}
            />
          }
        />

        {user && user.username === username && <DeleteButton postId={id} />}
      </Card.Content>
    </Card>
  );
}

export default PostCard;
