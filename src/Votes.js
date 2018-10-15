import React, { Component } from 'react';
import './Votes.css';
// import elon from './elonsmoke.png';
// import elon from './elonsmoke.png';

class Votes extends Component {

  constructor(props) {
    super(props);
  }

  render() {
    const listItems = this.props.solutions.map((solution) =>
        <div>
          <div>{solution.votes} {solution.solution}</div>
        </div>
    );
    return (
        <div className="votes-grid">
          <div className="solution-problem">{this.props.problem}</div>
          <div className="solutions-votes">{listItems}</div>
        </div>
    );
  }
}

export default Votes;
