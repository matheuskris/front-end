import { Button, Confirm, Icon, Popup } from "semantic-ui-react";
import { gql, useMutation } from "@apollo/client";
import { useState } from "react";

const DELETE_POST_MUTATION = gql`
  mutation deletePost($postId: ID!) {
    deletePost(postId: $postId)
  }
`;

const DELETE_COMMENT_MUTATION = gql`
  mutation ($postId: ID!, $commentId: ID!) {
    deleteComment(postId: $postId, commentId: $commentId) {
      id
      body
      comments {
        id
        body
        username
        createdAt
      }
      commentsCount
    }
  }
`;

type DeleteButtonProps = {
  postId: string;
  callback?: () => void;
  commentId?: string;
};

function DeleteButton({ postId, callback, commentId }: DeleteButtonProps) {
  const [confirmOpen, setConfirmOpen] = useState(false);

  const mutation = commentId ? DELETE_COMMENT_MUTATION : DELETE_POST_MUTATION;

  const [deletepost] = useMutation(mutation, {
    update() {
      setConfirmOpen(false);
      //TODO remove post from cache
    },
    variables: {
      postId,
      commentId,
    },
  });

  return (
    <>
      <Popup
        content={commentId ? "Delete Comment" : "Delete Post"}
        inverted
        trigger={
          <Button
            as="div"
            floated="right"
            color="red"
            onClick={() => {
              setConfirmOpen(true);
            }}
          >
            <Icon name="trash" />
          </Button>
        }
      />

      <Confirm
        open={confirmOpen}
        onCancel={() => {
          setConfirmOpen(false);
        }}
        onConfirm={() => {
          deletepost();
        }}
      />
    </>
  );
}

export default DeleteButton;
