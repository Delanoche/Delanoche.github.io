import React, { Component } from 'react';
import Title from './Title.js'
import Background from './Background.js'
import Names from './Names.js'
import Votes from './Votes.js'
import ProblemSelection from './ProblemSelection.js'
import GettingSolutions from './GettingSolutions.js'
import './App.css';

class App extends Component {

  views = [
    'TITLE',
    'PLAYER_LIST',
    'SELECTING_PROBLEM',
    'SELECTING_ELON',
    'DISPLAY_GETTING_SOLUTIONS',
    'DISPLAY_VOTES',
    'DISPLAY_SCORES'
  ];

  constructor(props) {
    super(props);

    this.state = {
      players: [],
      problem: null,
      elonSenderId: null,
      problemSenderId: null,
      timer: 0,
      totalTime: 0,
      debugText: 'test',
      currentView: 'TITLE',
      solutions: []
    };

    this.tick = this.tick.bind(this);
    this.startTick = this.startTick.bind(this);
  }

  render() {

    let displayedDiv = undefined;
    switch (this.state.currentView) {
      case 'TITLE':
        displayedDiv = <Title subtitle={JSON.stringify(this.state.players)}/>;
        break;
      case 'PLAYER_LIST':
        displayedDiv = <Names players={this.state.players}/>;
        break;
      case 'VOTES':
        displayedDiv = <Votes solutions={this.state.solutions} problem={this.state.problem}/>;
        break;
      default:
        displayedDiv = <Title subtitle={JSON.stringify(this.state.players)}/>;
        break;
    }

    return (
      <div className="App">
        <Background />
        {displayedDiv}
        {/*<Title />*/}
        {/*<p className='debug-text'>Debug: {this.state.debugText}</p>*/}
        {/*<Names players={this.state.players} />*/}
        {/*<ProblemSelection />*/}
        {/*<GettingSolutions players={this.state.players} time={this.state.timer} totalTime={this.state.totalTime}/>*/}

      </div>
    );
  }

  startTick(num) {
    this.setState({timer: num, totalTime: num});
    this.tick();
  }

  tick() {
    const _this = this;
    setTimeout(function () {
      // Do Something Here
      // Then recall the parent function to
      // create a recursive loop.
      const newState = _this.state.players;
      newState.push({name: 'Tim', number: _this.state.players.length + 1});
      _this.setState(() => ({players: newState, timer: _this.state.timer - 0.016}));
      _this.tick();
    }, 16);
  }

  componentDidMount() {
    // this.startTick(60);
    // this.setState({players: [{name: 'Jeffrey', number: 1}, {name: 'Elon', number: 2}, {name: 'Tim', number: 3}, {name: 'Tim', number: 4}, {name: 'Tim', number: 5}, {name: 'Tim', number: 6}, {name: 'Tim', number: 7}, {name: 'Tim', number: 8}, {name: 'Tim', number: 9}, {name: 'Tim', number: 10}]});
    let messageURN = 'urn:x-cast:com.connorhenke.elon';
    let _this = this;
    window.castReceiverContext = window.cast.framework.CastReceiverContext.getInstance();
    window.castReceiverContext.setLoggerLevel(window.cast.framework.LoggerLevel.DEBUG);
    window.castReceiverContext.addEventListener(window.cast.framework.system.EventType.READY, function() {
      setTimeout(() => {
        _this.setState(() => ({
          currentView: 'PLAYER_LIST',
          debugText: 'Current view to player list'
        }));
      }, 20000);
    });
    // Sender connected
    window.castReceiverContext.addEventListener(window.cast.framework.system.EventType.SENDER_CONNECTED, function(event) {
      console.log('Sender connected: ' + event.senderId);
      const newState = _this.state.players;
      newState.push({
        number: _this.state.players.length + 1,
        senderId: event.senderId,
        problem: null,
        votedSenderId: null,
        name: '',
        score: 0,
        votes: 0,
        solution: ''
      });
      _this.setState(() => ({players: newState}));
    });
    // Sender disconnected
    window.castReceiverContext.addEventListener(window.cast.framework.system.EventType.SENDER_DISCONNECTED, function(event) {
      console.log('Sender disconnected: ' + event.senderId);
      // senderDisconnected(event.senderId);
    });
    // Message listener
    window.castReceiverContext.addCustomMessageListener(messageURN, function(event) {
      _this.setState(() => ({debugText: JSON.stringify(event)}));
      // $('#current-event').text(event.senderId + ' ' + JSON.stringify(event) + ' ' + event.data.type + ' ' + event.data.data);
      switch (event.data.type) {
        case 'NAME_SUBMITTED':
          const newState = _this.state.players;
          let player = newState.find((player) => player.senderId == event.senderId);
          player.name = event.data.data;

          // nameSubmitted(event.senderId, event.data.data);
          if (newState.filter((player) => player.name != '').length >= newState.length) {
            window.castReceiverContext.sendCustomMessage(messageURN, undefined, {type: 'CAN_START_GAME'});
          }
          _this.setState(() => ({players: newState}));
          break;
        case 'START_GAME':
          window.castReceiverContext.sendCustomMessage(messageURN, undefined, {type: 'START_GAME'});
          _this.setState(() => ({
            currentView: 'SELECTING_PROBLEM',
            debugText: 'Current view to selecting problem'
          }));

          // switchView('SELECTING_PROBLEM');
          // window.castReceiverContext.sendCustomMessage(messageURN, undefined, {type: 'SELECTING_PROBLEM'});
          // var problemCreatorSenderId = selectProblemCreator();
          window.castReceiverContext.sendCustomMessage(messageURN, undefined, {type: 'CHOSEN_PROBLEM_CREATOR'});
          break;
        case 'PROBLEM_SUBMITTED':
          const newPlayers = _this.state.players;
          let currentPlayer = newPlayers.find((player) => player.senderId == event.senderId);
          currentPlayer.problem = event.data.data;
          const numProblems = newPlayers.filter((player) => player.problem != null).length;
          let obj = {debugText: JSON.stringify(newPlayers), players: newPlayers};
          if (numProblems >= newPlayers.length) {
            // select problem person
            const problemPerson = newPlayers[Math.floor(Math.random()*newPlayers.length)];
            const filtered = newPlayers.filter((player) => player.senderId != problemPerson.senderId);
            const elon = filtered[Math.floor(Math.random()*filtered.length)];
            window.castReceiverContext.sendCustomMessage(messageURN, elon.senderId, {type: 'SELECTED_ELON'});
            let normalSenderIds = newPlayers.filter((player) => player.senderId != elon.senderId);
            normalSenderIds.forEach(function(normalSenderId) {
              window.castReceiverContext.sendCustomMessage(messageURN, normalSenderId.senderId, {type: 'SELECTED_NORMAL', data: problemPerson.problem});
            });
            obj.problemSenderId = problemPerson.senderId;
            obj.problem = problemPerson.problem;
            obj.elonSenderid = elon.senderid;
          }
          _this.setState(() => (obj));

          // setProblemStatement(event.data.data);
          // switchView('SELECTING_ELON');
          // window.castReceiverContext.sendCustomMessage(messageURN, undefined, {type: 'SELECTING_ELON'});
          // var elonSenderId = selectElon();
          // window.castReceiverContext.sendCustomMessage(messageURN, elonSenderId, {type: 'SELECTED_ELON'});
          // var normalSenderIds = Object.keys(this.state.players).filter(function(playerId) {return playerId !== this.state.elonSenderId});
          // normalSenderIds.forEach(function(normalSenderId) {
          //   window.castReceiverContext.sendCustomMessage(messageURN, normalSenderId, {type: 'SELECTED_NORMAL', data: this.state.problemStatement});
          // });
          // switchView('DISPLAY_GETTING_SOLUTIONS');
          break;
        case 'SOLUTION_SUBMITTED':
          const solutionPlayers = _this.state.players;
          let solutionPlayer = solutionPlayers.find((player) => player.senderId == event.senderId);
          solutionPlayer.solution = event.data.data;
          const numSolutions = solutionPlayers.filter((player) => player.solution != '').length;
          let solutionObj = {debugText: JSON.stringify(solutionPlayers), players: solutionPlayers};
          if (numSolutions >= solutionPlayers.length) {
            const solutions = solutionPlayers.map((player) => ({senderId: player.senderId, solution: player.solution, votes: 0}));
            window.castReceiverContext.sendCustomMessage(messageURN, undefined, {type: 'ALL_SOLUTIONS_SUBMITTED', data: solutions});
            solutionObj.currentView = 'VOTES';
            solutionObj.solutions = solutions;
          }
          _this.setState(() => (solutionObj));
          // var senderId = event.senderId;
          // setSolutionForSender(senderId, event.data.data);
          // if (Object.keys(this.state.players).filter(function (playerSenderId) {return this.state.players[playerSenderId].solution !== ''}).length == Object.keys(this.state.players).length) {
          //   var solutions = Object.keys(this.state.players).map(function (playerSenderId) {return {senderId: playerSenderId, solution: this.state.players[playerSenderId].solution}});
          //   window.castReceiverContext.sendCustomMessage(messageURN, undefined, {type: 'ALL_SOLUTIONS_SUBMITTED', data: solutions});
          //   switchView('DISPLAY_VOTES');
          //   appendSolutions();
          // }
          break;
        case 'VOTE_SUBMITTED':
          const votePlayers = _this.state.players;
          let votedSenderId = event.data.data;
          let vote = votePlayers.find((vote) => vote.senderId == event.senderId); // who they voted for
          vote.votedSenderId = votedSenderId;
          let solutions = votePlayers.map((player) => ({senderId: player.senderId, solution: player.solution, votes: 0}));
          for (let solution of solutions) {
            solution.votes = votePlayers.filter((voted) => solution.senderId == voted.votedSenderId).length;
          }
          let voteObj = {players: votePlayers, solutions: solutions, debugText: JSON.stringify(solutions)};
          _this.setState(() => (voteObj));
          // var senderId = event.senderId;
          // var votedSenderId = event.data.data;
          // setVoteForSender(senderId, votedSenderId);
          // updateVotes();
          // if (Object.keys(this.state.players).filter(function (playerSenderId) {return this.state.players[playerSenderId].votedSenderId !== null}).length == Object.keys(this.state.players).length) {
          //   window.castReceiverContext.sendCustomMessage(messageURN, undefined, {type: 'ALL_VOTES_SUBMITTED'});
          //   switchView('DISPLAY_SCORES');
          //   displayTopVote();
          // }
          break;
        default:
          break;
      }
    });

    console.log('Starting Receiver Manager');
    window.castReceiverContext.start();
  }
}

export default App;
