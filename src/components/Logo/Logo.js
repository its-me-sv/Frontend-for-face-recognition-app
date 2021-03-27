import React from 'react';
import Tilt from 'react-tilt'
import './Logo.css';
import brain from './brain.png';

const Logo = () => {
	return (
		<div className='ma4 mt0'>
			<Tilt className="Tilt br3 shadow-3" options={{ max : 55 }} style={{ height: 250, width: 250 }} >
	 		<div className="Tilt-inner">
	 			<img style={{paddingTop: '3px'}} src={brain} alt="brain" />
	 		</div>
			</Tilt>
		</div>
	);
};

export default Logo;