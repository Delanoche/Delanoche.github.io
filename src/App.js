import React, { Component } from 'react';
import Title from './Title.js'
import Background from './Background.js'
import Names from './Names.js'
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
      currentView: 'TITLE'
    };

    this.tick = this.tick.bind(this);
    this.startTick = this.startTick.bind(this);
  }

  render() {

    let displayedDiv = undefined;
    switch (this.state.currentView) {
      case 'TITLE':
        displayedDiv = <Title />;
        break;
      case 'PLAYER_LIST':
        displayedDiv = <Names players={this.state.players}/>;
        break;
    }

    return (
      <div className="App">
        <Background />
        {displayedDiv}
        {/*<Title />*/}
        <p className='debug-text'>Debug: {this.state.debugText}</p>
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
      _this.setState({players: newState, timer: _this.state.timer - 0.016});
      _this.tick();
    }, 16);
  }

  componentDidMount() {
    // this.startTick(60);
    // this.setState({players: [{name: 'Jeffrey', number: 1}, {name: 'Elon', number: 2}, {name: 'Tim', number: 3}, {name: 'Tim', number: 4}, {name: 'Tim', number: 5}, {name: 'Tim', number: 6}, {name: 'Tim', number: 7}, {name: 'Tim', number: 8}, {name: 'Tim', number: 9}, {name: 'Tim', number: 10}]});
    let messageURN = 'urn:x-cast:com.connorhenke.elon';
    window.castReceiverContext = window.cast.framework.CastReceiverContext.getInstance();
    window.castReceiverContext.setLoggerLevel(window.cast.framework.LoggerLevel.DEBUG);
    window.castReceiverContext.addEventListener(window.cast.framework.system.EventType.READY, function() {
      setTimeout(() => {
        this.setState(() => ({
          currentView: 'PLAYER_LIST'
        }));
      }, 5000);
    });
    // Sender connected
    window.castReceiverContext.addEventListener(window.cast.framework.system.EventType.SENDER_CONNECTED, function(event) {
      console.log('Sender connected: ' + event.senderId);
      this.state.players[event.senderId] = {
        senderId: event.senderId,
        votedSenderId: null,
        name: '',
        score: 0,
        solution: ''
      };
    });
    // Sender disconnected
    window.castReceiverContext.addEventListener(window.cast.framework.system.EventType.SENDER_DISCONNECTED, function(event) {
      console.log('Sender disconnected: ' + event.senderId);
      // senderDisconnected(event.senderId);
    });
    // Message listener
    window.castReceiverContext.addCustomMessageListener(messageURN, function(event) {
      console.log(event);
      // $('#current-event').text(event.senderId + ' ' + JSON.stringify(event) + ' ' + event.data.type + ' ' + event.data.data);
      switch (event.data.type) {
        case 'NAME_SUBMITTED':
          this.setState((state) => {
            state.players[event.senderId].name = event.data.data;
            if (Object.keys(this.state.players).filter(playerSenderId => state.players[playerSenderId].name !== '').length > 1) {
              window.castReceiverContext.sendCustomMessage(messageURN, undefined, {type: 'CAN_START_GAME'});
            }
            return state;
          });

          // nameSubmitted(event.senderId, event.data.data);
          // if (Object.keys(this.state.players).filter(function(playerSenderId) {return this.state.players[playerSenderId].name !== ''}).length > 1) {
          //   window.castReceiverContext.sendCustomMessage(messageURN, undefined, {type: 'CAN_START_GAME'});
          // }
          break;
        case 'START_GAME':
          // window.castReceiverContext.sendCustomMessage(messageURN, undefined, {type: 'START_GAME'});

          // switchView('SELECTING_PROBLEM');
          // window.castReceiverContext.sendCustomMessage(messageURN, undefined, {type: 'SELECTING_PROBLEM'});
          // var problemCreatorSenderId = selectProblemCreator();
          // window.castReceiverContext.sendCustomMessage(messageURN, problemCreatorSenderId, {type: 'CHOSEN_PROBLEM_CREATOR'});
          break;
        case 'PROBLEM_SUBMITTED':
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
