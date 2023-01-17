import { Button, Popup } from "semantic-ui-react";
import { Like } from "../../routes/Home/home";
import { gql, useMutation } from "@apollo/client";
import { useNavigate } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../context/auth.context";

type LikeButtonProps = {
  post: {
    id: string;
    likesCount: number;
    likes: Like[];
  };
};

const LIKE_POST_MUTATION = gql`
  mutation likee($postId: ID!) {
    likePost(postId: $postId) {
      id
      likes {
        username
      }
      likesCount
    }
  }
`;

function LikeButton({ post: { id, likesCount, likes } }: LikeButtonProps) {
  const { currentUser: user } = useContext(AuthContext);
  const [liked, setLiked] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (user && likes.find((like) => like.username === user.username)) {
      setLiked(true);
    } else setLiked(false);
  }, [user, likes]);

  const [likePost] = useMutation(LIKE_POST_MUTATION, {
    onError(err) {
      console.log(err);
    },
    variables: { postId: id },
  });

  function handleLikePost() {
    likePost();
  }

  return (
    <Popup
      content="Like Post"
      inverted
      trigger={
        <Button
          as="div"
          labelPosition="right"
          onClick={user ? handleLikePost : () => navigate("/login")}
          color="teal"
          icon="heart"
          basic={(user !== null && !liked) || user === null}
          label={{
            basic: true,
            color: "teal",
            pointing: "left",
            content: `${likesCount}`,
          }}
        />
      }
    />
  );
}

export default LikeButton;
