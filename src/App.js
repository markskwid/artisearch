import React from "react";
import { useEffect, useState, useContext, createContext } from "react";
import axios from "axios";
import "./sass/styles.scss";
import SpotifyWebApi from "spotify-web-api-js";

//components
import Header from "./components/header";
import MainContent from "./components/main";


function App() {
  return (
    <>
      <MainContent />
    </>
  );
}

export default App;
