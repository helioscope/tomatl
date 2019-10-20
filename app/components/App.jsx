import React from 'react';
import _ from 'lodash';
import moment from 'moment';
import Tone from 'tone';

import notifier from '../util/notifier';
import TimerBox from './TimerBox';
import NotesBox from './NotesBox';

var synth = new Tone.Synth().toMaster();

const defaultState = {
  enableTimerHotkeys : true
};

var pos = 0;
var sequence = [
  ['C2', '16n'],
  ['G3', '16n'],
  ['B3', '16n'],
  ['C3', '16n'],
  ['G3', '16n'],
];

function triggerSynth(time){
  //the time is the sample-accurate time of the event
  if (pos >= sequence.length) {
    pos = 0;
    Tone.Transport.stop();
  } else {
    var note = sequence[pos];
    synth.triggerAttackRelease(note[0], note[1], time);
    pos++;
  }
}

//schedule a few notes
Tone.Transport.schedule(triggerSynth, 0);
Tone.Transport.schedule(triggerSynth, '0:0.5');
Tone.Transport.schedule(triggerSynth, '0:1');
Tone.Transport.schedule(triggerSynth, '0:1.5');
Tone.Transport.schedule(triggerSynth, '0:2');
Tone.Transport.schedule(triggerSynth, '0:3');



export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = Object.assign({}, defaultState);
  }

  componentDidMount() {
    if (!notifier.hasPermission()) {
      notifier.askPermission();
    }
    // this.cueDing();
  }

  onTimerDing(id, preset) {
    this.cueDing();
    notifier.send({
      title : "Ding!",
      message : "Time's up!",
      duration : 10 * 1000,
      id : Math.random()
    });
  }

  cueDing() {
    Tone.Transport.start();
  }

  onInputFocus() {
    this.setState({
      enableTimerHotkeys: false
    });
  }

  onInputBlur() {
    this.setState({
      enableTimerHotkeys: true
    });
  }

  render() {
    return (
      <div className="App">
        <TimerBox id={"main-timer"} onDing={this.onTimerDing.bind(this)} useHotKeys={this.state.enableTimerHotkeys} />
        <NotesBox onInputFocus={this.onInputFocus.bind(this)} onInputBlur={this.onInputBlur.bind(this)}/>
      </div>
    );
  }
}