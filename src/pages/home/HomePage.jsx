import React from "react";
import HomeScreen from "./HomeScreen";
import AuthScreen from "./AuthScreen";
import { useAuthStore } from "../../store/authUser.js";

const HomePage = () => {
const {user} = useAuthStore();
return(
  <>
    {user? <HomeScreen/>: <AuthScreen/>}
  </>
)};

export default HomePage;
