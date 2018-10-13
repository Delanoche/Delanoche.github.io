import React, { Component } from 'react';
import './Names.css';
import elon from './elonsmoke.png';
// import elon from './elonsmoke.png';

class Names extends Component {

  constructor(props) {
    super(props);
  }

  render() {
    const listItems = this.props.players && this.props.players.map((player) =>
        <div className={'player-' + player.number + ' player-holder'}>
          <div className="top">
            <img src={elon} className="player-icon" alt="logo" />
          </div>
          <div className="player-name bottom">{player.name}</div>
        </div>
    );
    // for(var i = listItems.length; i < 10; i++) {
      {/*<div className='player-empty player-holder'>*/}
        {/*<div className="top">*/}
          {/*<img src={elon} className="player-icon" alt="logo" />*/}
        // </div>
        {/*<div className="player-name bottom">{player.name}</div>*/}
      // </div>
    // }
    return (
        <div className="grid">
          <div className="players">{listItems}</div>
        </div>
    );
  }
}

export default Names;
