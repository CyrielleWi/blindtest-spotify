/*global swal*/

import React, { Component } from 'react';
import logo from './logo.svg';
import loading from './loading.svg';
import './App.css';
import Sound from 'react-sound';
import Button from './Button';

const apiToken = 'BQAkSeo8v3_A2N0dburZOiTuePAvY-qjDI6PLABwFj3dy2F6pD5BiLNWWYqtag0SsRytD1urZYBI0Uewnwqkoxzvo0l_PaDDwfRug1YrjU8txX7GNSGUrlcbabUgAIHk-sDJxNwxon2vLF1b_nc5e5oScYpn';

function shuffleArray(array) {
  let counter = array.length;

  while (counter > 0) {
    let index = getRandomNumber(counter);
    counter--;
    let temp = array[counter];
    array[counter] = array[index];
    array[index] = temp;
  }

  return array;
}

/* Return a random number between 0 included and x excluded */
function getRandomNumber(x) {
  return Math.floor(Math.random() * x);
}

class AlbumCover extends Component {
  render() {
    const src = this.props.track.album.images[0].url;
    return (<img src={src} style={{ width: 400, height: 400 }} />);
  }
}

class App extends Component {

  constructor() {
    super();
    this.state = {
      songsLoaded: false,
      musicData: null
    };
    console.log("Constructor");
  }

  componentDidMount() {
      fetch('https://api.spotify.com/v1/me/tracks', {
        method: 'GET',
        headers: {
         Authorization: 'Bearer ' + apiToken,
        },
      })
        .then(response => response.json())
        .then((data) => {
          console.log("Réponse reçue ! Voilà ce que j'ai reçu : ", data);
          this.setState({
            musicData: data.items,
            songsLoaded: true,
        })
        })  
  }  

  render() {
      if (this.state.songsLoaded === false) {
        return (
          <div className="App">
            <header className="App-header">
              <img src={loading} className="App-loading" alt="loading"/>
            </header>
          </div>
        );
      }

      else {
        const track1 = this.state.musicData[0].track;
        const track2 = this.state.musicData[1].track;
        const track3 = this.state.musicData[2].track;

        return (
          <div className="App">
            <header className="App-header">
              <img src={logo} className="App-logo" alt="logo"/>
              <h1 className="App-title">Bienvenue sur le Blindtest</h1>
            </header>
            <div className="App-images">
              <AlbumCover track={this.state.musicData[0].track}/>
            </div>
            <Sound url={this.state.musicData[0].track.preview_url} playStatus={Sound.status.PLAYING}/>
            <div className="App-buttons">
              <Button>{track1.name}</Button>
              <Button>{track2.name}</Button>
              <Button>{track3.name}</Button>
            </div>
          </div>
      );
      }


  }
}

export default App;
