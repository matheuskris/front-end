import React from "react";

import { Routes, Route } from "react-router-dom";
import SinglePost from "../Post";

function SinglePostPage() {
  return (
    <Routes>
      <Route path=":postId" element={<SinglePost />} />
    </Routes>
  );
}

export default SinglePostPage;
