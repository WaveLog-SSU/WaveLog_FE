// src/App.jsx
import React from "react";
import { Routes, Route } from "react-router-dom";

import MainScreen from "./pages/MainScreen";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Write from "./pages/Write";
import UserProfile from "./pages/UserProfile";
import List from "./pages/List";
import Bookmark from "./pages/Bookmark";
import Quiz from "./pages/Quiz";
import DayList from "./components/DayList";

import { AuthProvider } from "./contexts/AuthContext";
import { DiaryProvider } from "./contexts/DiaryContext";

import "./App.css";

function App() {
  return (
    <AuthProvider>
      <DiaryProvider>
        <Routes>
          <Route path="/" element={<MainScreen />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          <Route path="/write" element={<Write />} />
          <Route path="/write/:diaryId" element={<Write />} />
          <Route path="/profile" element={<UserProfile />} />
          <Route path="/list" element={<List />} />
          <Route path="/bookmark" element={<Bookmark />} />
          <Route path="/quiz" element={<Quiz />} />
          <Route path="/daylist" element={<DayList />} />
          <Route path="*" element={<div>404 Not Found</div>} />
        </Routes>
      </DiaryProvider>
    </AuthProvider>
  );
}

export default App;
