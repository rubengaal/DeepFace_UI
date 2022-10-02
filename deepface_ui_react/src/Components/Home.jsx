import React, { Component }  from 'react';
import '../Styles/app.scss';
import background from '../Assets/background4.jpg';


export const  Home = ()=> {
    return (
        <div className="app" style={{
            backgroundImage: `url(${background})`,
            backgroundPosition: 'center',
            backgroundSize: 'cover',
            backgroundRepeat: 'no-repeat',
            width: '100vw',
            height: '100vh'
        }}>
            <div class="container">
                <div class="glitch" data-text="DEEPCHEAP">DEEPCHEAP</div>
                <div class="glow">DEEPCHEAP</div>
                <p class="subtitle">face reconstruction</p>
            </div>
            <div class="scanlines"></div>

        </div> 
    );
}

export default Home;