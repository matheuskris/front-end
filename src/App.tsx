import React, { useContext } from "react";
import { Routes, Route } from "react-router-dom";

import Home from "./routes/Home/home";
import Login from "./routes/Login/Login";
import Register from "./routes/Register";
import Menu from "./components/MenuBar";
import { AuthContext } from "./context/auth.context";

import SinglePostPage from "./routes/SinglePostPage";
import "semantic-ui-css/semantic.min.css";
import SinglePost from "./routes/Post";

function App() {
  const { currentUser: user } = useContext(AuthContext);

  return (
    <Routes>
      <Route path="/" element={<Menu />}>
        {user ? (
          <>
            <Route index element={<Home />} />
            <Route path="login" element={<Login />} />
            <Route path="register" element={<Register />} />
            <Route path="posts/*" element={<SinglePostPage />} />
            <Route path="*" element={<Home />} />
          </>
        ) : (
          <>
            <Route index element={<Home />} />
            <Route path="login" element={<Login />} />
            <Route path="register" element={<Register />} />
            <Route path="*" element={<Home />} />
          </>
        )}
      </Route>
    </Routes>
  );
}

export default App;
