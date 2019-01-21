/*global swal*/

import React, { Component } from 'react';
import logo from './logo.svg';
import loading from './loading.svg';
import './App.css';
import Sound from 'react-sound';
import Button from './Button';

const apiToken = 'BQDoYktmwzJL_plZKoJunuzD5Do10ZPemkE1QPKMS_LXwX7jIYhxX5TarVwQfVSCPL0xwBiQoqB8pfDMmoz4fOYn-FeFkVrdqxnN71kO0Xz1rHP6XMgHFuFfTJxl5CPv5qcKz1rQk1jssXmPyIeyXOHDkUTb';

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
      musicData: null,
      musicNumber: 0,
      currentTrack: null,
      timeout: null
    };
    console.log("Constructor");
  }

  checkAnswer(answerId) {
    if (answerId == this.state.currentTrack.id) {
      swal('Bravo', "Bien ouej c'est la bonne musique!!", 'success')
        .then(this.newTrack())
        /*.then(clearTimeout(this.state.timeout))*/
    }
    else {
      swal("C'est faux", "Quel échec", 'error').then(this.newTrack());
    }
  }

  chooseTracks() {
    let randomTrack1 = this.state.musicData[getRandomNumber(this.state.musicNumber)].track;
    let randomTrack2 = this.state.musicData[getRandomNumber(this.state.musicNumber)].track;

    while (randomTrack1.id === this.state.currentTrack.id || randomTrack1.id === randomTrack2.id || randomTrack2.id === this.state.currentTrack.id) {
      randomTrack1 = this.state.musicData[getRandomNumber(this.state.musicNumber)].track;
      randomTrack2 = this.state.musicData[getRandomNumber(this.state.musicNumber)].track;
    }
    
    return [this.state.currentTrack, randomTrack1, randomTrack2];
  }

  newTrack() {
    console.log("Début newTrack : ", this.currentTrack);
    let newCurrentTrack = this.state.musicData[getRandomNumber(this.state.musicNumber)].track;
    
    this.setState({
      currentTrack: newCurrentTrack
    })

    console.log("Fin newTrack : ", this.currentTrack);
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
          const randomNumber = getRandomNumber(data.items.length);
          this.setState({
            musicData: data.items,
            songsLoaded: true,
            musicNumber: data.items.length,
            currentTrack: data.items[randomNumber].track/*,
            timeout: setTimeout(this.newTrack(), 30000)*/
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

        let track1;
        let track2;
        let track3;

        let musics = this.chooseTracks();
        musics = shuffleArray(musics);

        return (
          <div className="App">
            <header className="App-header">
              <img src={logo} className="App-logo" alt="logo"/>
              <h1 className="App-title">Bienvenue sur le Blindtest</h1>
            </header>
            <div className="App-images">
              <AlbumCover track={this.state.currentTrack}/>
            </div>
            <Sound url={this.state.currentTrack.preview_url} playStatus={Sound.status.PLAYING}/>
            <div className="App-buttons"> 
              {musics.map(item => 
                <Button onClick={() => this.checkAnswer(item.id)}>{item.name}</Button>
              )}
            </div>
          </div>
      );
      }


  }
}

export default App;
