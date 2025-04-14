import React from "react";
import "./App.css";
import NavBar from "./components/navbar/NavBar";
import Auth from "./pages/auth/Auth";
import Home from "./pages/home/Home";
import BookDetail from "./pages/bookPage/bookDetails.jsx";
import UserProfile from "./pages/userPage/UserPage";
import ResetPass from "./pages/auth/ResetPass";
import SearchPage from "./pages/search/SearchPage";
import UpdateBook from "./pages/updateBook/UpdateBook";
import UpdateUser from "./pages/updateUser/UpdateUser";
import CreateBook from "./pages/createBook/CreateBook";
import { AuthProvider } from "./utils/AuthConext";

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";



const App = () => {
  return (
    <>
      <AuthProvider>
        <Router>
          <NavBar />

          <Routes>
            <Route exact path="/auth" element={<Auth />} />
            <Route path="/" element={<Home />} />
            <Route path="/book/:id" element={<BookDetail />} />
            <Route path="/user/:id" element={<UserProfile />} />
            <Route path="/modifier/:id" element={<UpdateBook />} />
            <Route path="/modifier-prf/:id" element={<UpdateUser />} />
            <Route path="/createBook" element={<CreateBook />} />
            <Route path="/auth/reset" element={<ResetPass />} />
            <Route path="/search" element={<SearchPage />} />
          </Routes>
        </Router>
      </AuthProvider>
    </>
  );
};

export default App;
