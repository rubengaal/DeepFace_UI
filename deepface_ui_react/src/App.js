import './Styles/app.scss';
import React, { Component } from 'react';
import { Header } from "./Components/Header";
import { SidePanel } from "./Components/SidePanel";
import { ContentUpload } from "./Components/ContentUpload";
import ThreeScene from "./Components/3dViewer";
import background from './Assets/background4.jpg';
import Home from './Components/Home';
import AOS from "aos";
import "aos/dist/aos.css"



const cors = require("cors");
document.body.style.margin = 0;

function render() {
    AOS.init()
    return (
        <div>
            <Home/>
            <Header/>
            <ContentUpload/>
            <ThreeScene/>
            <Header/>
            
        </div>

        
    );
};

export default render;
