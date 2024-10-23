import React, { useEffect } from "react";
import { Button } from "./components/ui/button";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import MainLayout from "./components/MainLayout";
import HomePage from "./pages/HomePage";
import Profile from "./pages/Profile";
import EditProfile from "./pages/EditProfile";
import ChatPage from "./pages/ChatPage";
import { io } from "socket.io-client";
import { useDispatch, useSelector } from "react-redux";
import { setSocket } from "./redux/socketSlice";
import { setOnlineUsers } from "./redux/chatSlice";
import { setLikeNotifications } from "./redux/rtnSlice";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  const { user } = useSelector(store => store.auth);
  const { socket } = useSelector(store => store.socketio);
  const dispatch = useDispatch();

  useEffect(() => {
    if (user) {
      const socketio = io(`http://localhost:3000`, {
        query: {
          userId: user?._id
        },
        transports: ['websocket']
      });
      dispatch(setSocket(socketio));

      //listening all the events
      socketio.on('getOnlineUsers', (onlineUsers) => {
        dispatch(setOnlineUsers(onlineUsers));
      });

      socketio.on('notification', (notification) => {
        dispatch(setLikeNotifications(notification));
      });

      return () => {
        socketio.close();
        dispatch(setSocket(null));
      }
    } else if (socket) {
      socket?.close();
      dispatch(setSocket(null));
    }
  }, [user, dispatch]);

  return (
    <>
      <ToastContainer />
      <BrowserRouter>
        <ProtectedRoute>
          <Routes>
            <Route path="/" element={<MainLayout />}>
              <Route path="/" element={<HomePage />} />
              <Route path="/profile/:id" element={<Profile />} />
              <Route path="/profile/:id" element={<Profile />} />
              <Route path="/account/edit" element={<EditProfile />} />
              <Route path="/chat" element={<ChatPage />} />
            </Route>
            <Route path="/signup" element={<Signup />} />
            <Route path="/login" element={<Login />} />
          </Routes>
        </ProtectedRoute>
      </BrowserRouter>
    </>
  )
}

export default App
