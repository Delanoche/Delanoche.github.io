import React, { Component } from 'react';
import elon from './elontransparent.png';
import './Title.css';

class Title extends Component {

  constructor(props) {
    super(props)

    this.state = {
      title: 'Secret Elon'
    }

    this.updateTitle = this.updateTitle.bind(this)

  }

  updateTitle(e) {
    this.setState({
      title: e.target.value
    })
  }


  render() {
    return (
        <div>
          <div className="grid-container">
            <div className="Image">
              <img src={elon} className="App-logo" alt="logo" />
            </div>
            <div className="Title">
              {this.state.title}
            </div>
          </div>
        </div>
    );
  }
}

export default Title;
