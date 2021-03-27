import React from 'react';
import './FaceRecognition.css';

const FaceRecognition = props =>{
	const boxesDivs = props.box.map((b,i) => {
		return (<div 
					key={i}
					className='bounding-box'
					style={
						{
							top: b.topRow,
							right: b.rightCol,
							bottom: b.bottomRow,
							left: b.leftCol
						}
					}
				></div>);
	});
	return (
			<div className='center ma'>
				<div className='absolute mt4'>
					<img 
						id="inputImage" 
						alt="" 
						src={props.imageURL} 
						width="500px" height="auto" 
					/>
					{boxesDivs}
				</div>
			</div>
		);
};

export default FaceRecognition;