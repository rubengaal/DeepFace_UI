import React, { Component }  from 'react';
import '../Styles/sidepanel.scss';
import Image from '../Assets/oelogo.jpg';

let headerList = ["About","Contacts","Github"];

let headerListItems = headerList.map((item) =>{
    return <h3>
        <li>{item}</li>
    </h3>
})

export const  SidePanel = ()=> {
    return (
        <div>
            <div className="sidepanel">
            <img src={Image} width="100" opacity></img>
            </div>

            
        </div>
        
    );
}
