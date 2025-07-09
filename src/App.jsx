import { Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import MainScreen from './pages/MainScreen';
import Signup from './pages/Signup';
import Write from './pages/Write';
import UserProfile from './pages/UserProfile';
import './App.css';

function App() {
  return (
    <Routes>
      <Route path="/" element={<MainScreen />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/login" element={<Login />} />
      <Route path="/write" element={<Write />} />
      <Route path="/profile" element={<UserProfile />} />
      <Route path="*" element={<div>404 Not Found</div>} />
    </Routes>
  );
}

export default App;
