import React, { Component } from 'react';
import elon from './elontransparent.png';
import './Title.css';

class Title extends Component {

  constructor(props) {
    super(props);

    this.state = {
      title: 'Secret Elon6',
      subtitle: props.subtitle || 'subtitle'
    };


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
          <div className="title-grid">
            <div className="Image">
              <img src={elon} className="App-logo" alt="logo" />
            </div>
            <div className="Title">
              {this.state.title}
              <div className="subtitle">
                {this.state.subtitle}
              </div>
            </div>
          </div>
        </div>
    );
  }
}

export default Title;
