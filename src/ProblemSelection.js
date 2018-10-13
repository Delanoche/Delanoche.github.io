import React, { Component } from 'react';
import './ProblemSelection.css';

class ProblemSelection extends Component {

  constructor(props) {
    super(props);

    this.state = {
      title: 'Choosing a problem...'
    }
  }

  render() {
    return (
        <div>
          <div className="grid-container">
            <div className="Title">
              {this.state.title}
            </div>
          </div>
        </div>
    );
  }
}

export default ProblemSelection;
