import React from 'react';
import _ from 'lodash';
import moment from 'moment';
import Tone from 'tone';

// if using timerbox in mutliples, maybe take the 'tick' and timeout state bits out, letting some other timeout set the tick as a prop to cue rerendering
// should also do something about the hotkeys, though disabling them is also a fallback

const defaultProps = {
  id : null,
  tickInterval : 50,
  onDing : function(id, preset) {},
  useHotKeys : true
};

const presetTimes = [
  { label : "pomodoro - work", duration : 25 * 60 * 1000 },
  { label : "pomodoro - short break", duration : 5 * 60 * 1000 },
  { label : "pomodoro - long break", duration : 10 * 60 * 1000 },
  { label : "one minute", duration : 60 * 1000 },
  // { label : "audio cue test", duration : 1 * 1000 },
];

const defaultState = {
  selectedPresetTime : presetTimes[0],
  bankedTime : 0,
  startTime : 0,
  endTime : presetTimes[0].duration,
  isRunning : false,
  didDing : false,
  timeout : null,
  lastTick : 0
}

class TimerBox extends React.Component {
  constructor(props) {
    super(props);
    this.state = Object.assign({}, defaultState);
  }

  componentDidMount() {
    window.addEventListener('keydown', this.onKeyDown.bind(this))
  }
  componentWillUnmount() {
    clearTimeout(this.state.timeout);
    window.removeEventListener('keydown', this.onKeyDown.bind(this))
  }

  selectPreset(preset) {
    var newState = {
      selectedPresetTime: preset,
      endTime :  preset.duration
    };
    Tone.context.resume();

    if (this.state.didDing) {
      newState.bankedTime = 0;
      newState.didDing = false;
    };

    if (!this.state.isRunning) {
      newState.timeout = setTimeout(this.onTick.bind(this), this.props.tickInterval);
      newState.isRunning = true;
      newState.startTime = new Date();
    }

    this.setState(newState);
  }

  onKeyDown(evt) {
    if (!this.props.useHotKeys) {
      return;
    }
    if (evt.keyCode == 32) {
      // pressed space
      if (this.state.isRunning) {
        this.onPressPause();
      } else if (this.state.didDing) {
        this.onPressBegin();
      } else if (this.state.bankedTime > 0) {
        this.onPressResume();
      } else {
        this.onPressBegin();
      }
    } else if (evt.keyCode >= 49 && evt.keyCode <= 57) {
      // pressed numeric key 1 - 9
      var presetIndex = evt.keyCode - 49;
      if (presetIndex < presetTimes.length) {
        this.selectPreset(presetTimes[presetIndex]);
      }
    }
  }

  onSelectPresetTime(evt) {
    var val = evt.target.value;
    var preset = _.find(presetTimes,{label: val});
    this.selectPreset(preset);
  }

  onPressBegin() {
    Tone.context.resume();
    this.setState({ 
      startTime : new Date(),
      bankedTime : 0,
      timeout: setTimeout(this.onTick.bind(this), this.props.tickInterval),
      isRunning : true,
      didDing : false
    });
  }

  onPressPause() {
    clearTimeout(this.state.timeout);
    this.setState({
      bankedTime : this.state.bankedTime + (new Date() - this.state.startTime),
      startTime : 0,
      isRunning : false,
      timeout : null
    });
  }

  onPressResume() {
    Tone.context.resume();
    this.setState({
      startTime : new Date(),
      isRunning : true,
      timeout: setTimeout(this.onTick.bind(this), this.props.tickInterval)
    });
  }

  onPressReset() {
    this.setState({
      startTime : new Date(),
      bankedTime : 0,
      didDing : false
    });
  }

  onTick() {
    var state = this.state;
    var timeout = null;
    var msRemaining = this.calculateMsRemaining();
    clearTimeout(state.timeout);

    if (msRemaining <= 0) {
      // ding
      this.setState({
        bankedTime : state.endTime - msRemaining, // (subtracting negative msRemaining == adding overage)
        isRunning : false,
        didDing : true,
        lastTick : new Date(),
        timeout: null,
      }, function() {
        this.props.onDing(this.props.id);
      }.bind(this));
    } else {
      // tick
      if (state.isRunning) {
        timeout = setTimeout(this.onTick.bind(this), this.props.tickInterval);
      }
      this.setState({
        lastTick : new Date(),
        timeout: timeout
      });
    }
  }

  calculateMsRemaining() {
    var state = this.state;
    var msRemaining = state.endTime - state.bankedTime;

    if (state.isRunning) {
      msRemaining -= new Date() - state.startTime;
    }

    return msRemaining;
  }

  renderPresetSelector() {
    var state = this.state;
    var presetTimeOptions = [];
    var selection = '';

    if (state.selectedPresetTime) {
      selection = state.selectedPresetTime.label
    }

    _.each(presetTimes, function(preset) {
      presetTimeOptions.push(
        <option value={preset.label} key={preset.label}>{preset.label}</option>
      );
    });

    return (
      <select className="TimerBox__preset-selector" name="preset-times" value={selection} onChange={this.onSelectPresetTime.bind(this)}>
        {presetTimeOptions}
      </select>
      )
  }

  render() {
    var state = this.state;
    var msRemaining = this.calculateMsRemaining();
    var timeRemaining = moment.duration(Math.ceil(msRemaining/1000), 's');
    var minutesRemaining = timeRemaining.minutes();
    var secondsRemaining = timeRemaining.seconds();

    var startButton = null;
    var resetButton = (
      <button className="TimerBox__button_reset" onClick={this.onPressReset.bind(this)}>
        Reset
      </button>
    );

    var rootClass = "";

    if (state.isRunning) {
      rootClass = "TimerBox_running";
      startButton = (
        <button className="TimerBox__button_pause" onClick={this.onPressPause.bind(this)}>
          Pause
        </button>
      );
    } else if (state.didDing) {
      rootClass = "TimerBox_done";
      startButton = (
        <button className="TimerBox__button_restart" onClick={this.onPressBegin.bind(this)}>
          Restart
        </button>
      );
    } else if (state.bankedTime > 0) {
      rootClass = "TimerBox_paused";
      startButton = (
        <button className="TimerBox__button_resume" onClick={this.onPressResume.bind(this)}>
          Resume
        </button>
      );
    } else {
      startButton = (
        <button className="TimerBox__button_start" onClick={this.onPressBegin.bind(this)}>
          Start
        </button>
      );
    }

    return (
      <div className={"TimerBox " + rootClass}>
        <div className="TimerBox__time-remaining">
          {_.padStart(minutesRemaining, 2, '0')} <span className="TimerBox__col">:</span> {_.padStart(secondsRemaining, 2, '0')}
        </div>
        {this.renderPresetSelector()}
        <div className="TimerBox__buttons">
          {startButton}
          {resetButton}
        </div>
      </div>
    )
  }
};

TimerBox.defaultProps = defaultProps;

export default TimerBox;