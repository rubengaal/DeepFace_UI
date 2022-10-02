import '../Styles/header.scss';
import React, { Component }  from 'react';

let headerList = ["About","Contacts","Github"];


let headerListItems = headerList.map((item) =>{
    return <h3>
        <li>{item}</li>
    </h3>
})

export const Header = () =>{
    return (
        <div className='header-list'>
            <h1>DEEPCHEAP</h1>
        </div>
    )
}