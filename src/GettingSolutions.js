import React, { Component } from 'react';
import './GettingSolutions.css';

class ProblemSelection extends Component {

  constructor(props) {
    super(props);

    this.state = {
      title: 'Solving the World\'s Problems'
    }
  }

  render() {
    /*
    const listItems = this.props.players.map((player) =>
        <div className={'player-' + player.number + ' player-holder'}>
          <div className="top">
            <img src={elon} className="player-icon" alt="logo" />
          </div>
          <div className="player-name bottom">{player.name}</div>
        </div>
    );
    */
    let percentage = 100;
    if (this.props.totalTime > 0) {
      percentage = ((1.0 * this.props.time) / (1.0 * this.props.totalTime)) * 100;
    }
    percentage = "" + percentage + "%";
    console.log("" + this.props.totalTime + ", " + this.props.time);
    return (
        <div>
          <div className="grid-container">
            <div className="Title">
              {this.state.title}
            </div>
            <div className="Timer">
              <div className="Bar" style={{width : percentage}}>
              </div>
            </div>
          </div>
        </div>
    );
  }
}

export default ProblemSelection;
