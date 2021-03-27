import './App.css';
import React from 'react';
import Navigation from './components/Navigation/Navigation';
import Logo from './components/Logo/Logo';
import ImageLinkForm from './components/ImageLinkForm/ImageLinkForm';
import FaceRecognition from './components/FaceRecognition/FaceRecognition';
import Signin from './components/Signin/Signin';
import Register from './components/Register/Register';
import Rank from './components/Rank/Rank';
import Particles from 'react-particles-js';

const particleOptions = {
  particles: {
    number: {
      value: 84,
      density: {
        enable: true,
        value_area: 800
      }
    }
  }
};

const initialState = {
  input: '',
  imageURL: '',
  box: [],
  route: 'signin',
  isSignedIn: false,
  user: {
    id: '',
    name: '',
    email: '',
    entries: 0,
    joined: ''
  }
};

class App extends React.Component {
  constructor(props){
    super(props);
    this.state = initialState;
    this.onInputChange = this.onInputChange.bind(this);
    this.btnSubmit = this.btnSubmit.bind(this);
    this.calcFaceLoc = this.calcFaceLoc.bind(this);
    this.putFaceBox = this.putFaceBox.bind(this);
    this.onRouteChange = this.onRouteChange.bind(this);
    this.loadUser = this.loadUser.bind(this);
  }

  // componentDidMount() {
  //   fetch('http://localhost:3000')
  //   .then(response => response.json())
  //   .then(console.log)
  //   .catch(console.log);
  // }

  loadUser = data => {
    this.setState({user: {
      id: data.id,
      name: data.name,
      email: data.email,
      entries: data.entries,
      joined: data.joined
    }});
  };

  calcFaceLoc = data => {
    const regions = data.outputs[0].data.regions;
    const image = document.getElementById('inputImage');
    const width = Number(image.width);
    const height = Number(image.height);
    const allBoxes = [];
    let boxLoc;
    for (let i = 0; i < regions.length; i += 1){
      boxLoc = regions[i].region_info.bounding_box;
      allBoxes.push(
        {
          leftCol: boxLoc.left_col * width,
          rightCol: width - (boxLoc.right_col * width),
          topRow: boxLoc.top_row * height,
          bottomRow: height - (boxLoc.bottom_row * height)
        }
      );
    }
    return allBoxes;
  };

  putFaceBox = boxObj => {
    this.setState({box: boxObj});
  };

  onInputChange = event => {
    this.setState({
      input: event.target.value,
      imageURL: event.target.value,
      box: []
    });
  };

  btnSubmit = event => {
    // "d02b4508df58432fbb84e800597b8959"
    fetch('http://localhost:3000/imageurl', {
      method: 'post',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({
        input: this.state.input
      })
    })
    .then(response => response.json())
    .then(response => {
      if (response){
        fetch('http://localhost:3000/image', {
          method: 'put',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify({
            id: this.state.user.id
          })
        })
        .then(response => response.json())
        .then(count => {
          this.setState(Object.assign(this.state.user, {entries: count}));
        }).catch(err => console.log(err));
      }
      this.putFaceBox(this.calcFaceLoc(response));
    }).catch(err => console.log(err));
  };

  onRouteChange = route => {
    if (route === "signout")
    this.setState(initialState);
    if (route === "home")
    this.setState({isSignedIn:true});
    this.setState({route:route});
  };

  render() {
    const { isSignedIn, box, imageURL, route } = this.state;
    return (
      <div className="App">
        <Particles 
          className='particles'
          params={particleOptions}
        />
        <Navigation isSignedIn={isSignedIn} onRouteChange={this.onRouteChange}/>
        { 
          route === "signin"
          ? <Signin onRouteChange={this.onRouteChange} loadUser={this.loadUser} />
          : route === "home"
          ? <div>
              <Logo />
              <Rank name={this.state.user.name} entries={this.state.user.entries} />
              <ImageLinkForm 
                onInputChange={this.onInputChange}
                onSubmit={this.btnSubmit}
              />
              <FaceRecognition box={box} imageURL={imageURL} />
            </div>
          : <Register onRouteChange={this.onRouteChange} loadUser={this.loadUser} />
        }
      </div>
    );
  }
}

export default App;