(function() {
  'use strict';

  var globals = typeof global === 'undefined' ? self : global;
  if (typeof globals.require === 'function') return;

  var modules = {};
  var cache = {};
  var aliases = {};
  var has = {}.hasOwnProperty;

  var expRe = /^\.\.?(\/|$)/;
  var expand = function(root, name) {
    var results = [], part;
    var parts = (expRe.test(name) ? root + '/' + name : name).split('/');
    for (var i = 0, length = parts.length; i < length; i++) {
      part = parts[i];
      if (part === '..') {
        results.pop();
      } else if (part !== '.' && part !== '') {
        results.push(part);
      }
    }
    return results.join('/');
  };

  var dirname = function(path) {
    return path.split('/').slice(0, -1).join('/');
  };

  var localRequire = function(path) {
    return function expanded(name) {
      var absolute = expand(dirname(path), name);
      return globals.require(absolute, path);
    };
  };

  var initModule = function(name, definition) {
    var hot = hmr && hmr.createHot(name);
    var module = {id: name, exports: {}, hot: hot};
    cache[name] = module;
    definition(module.exports, localRequire(name), module);
    return module.exports;
  };

  var expandAlias = function(name) {
    return aliases[name] ? expandAlias(aliases[name]) : name;
  };

  var _resolve = function(name, dep) {
    return expandAlias(expand(dirname(name), dep));
  };

  var require = function(name, loaderPath) {
    if (loaderPath == null) loaderPath = '/';
    var path = expandAlias(name);

    if (has.call(cache, path)) return cache[path].exports;
    if (has.call(modules, path)) return initModule(path, modules[path]);

    throw new Error("Cannot find module '" + name + "' from '" + loaderPath + "'");
  };

  require.alias = function(from, to) {
    aliases[to] = from;
  };

  var extRe = /\.[^.\/]+$/;
  var indexRe = /\/index(\.[^\/]+)?$/;
  var addExtensions = function(bundle) {
    if (extRe.test(bundle)) {
      var alias = bundle.replace(extRe, '');
      if (!has.call(aliases, alias) || aliases[alias].replace(extRe, '') === alias + '/index') {
        aliases[alias] = bundle;
      }
    }

    if (indexRe.test(bundle)) {
      var iAlias = bundle.replace(indexRe, '');
      if (!has.call(aliases, iAlias)) {
        aliases[iAlias] = bundle;
      }
    }
  };

  require.register = require.define = function(bundle, fn) {
    if (bundle && typeof bundle === 'object') {
      for (var key in bundle) {
        if (has.call(bundle, key)) {
          require.register(key, bundle[key]);
        }
      }
    } else {
      modules[bundle] = fn;
      delete cache[bundle];
      addExtensions(bundle);
    }
  };

  require.list = function() {
    var list = [];
    for (var item in modules) {
      if (has.call(modules, item)) {
        list.push(item);
      }
    }
    return list;
  };

  var hmr = globals._hmr && new globals._hmr(_resolve, require, modules, cache);
  require._cache = cache;
  require.hmr = hmr && hmr.wrap;
  require.brunch = true;
  globals.require = require;
})();

(function() {
var global = typeof window === 'undefined' ? this : window;
var process;
var __makeRelativeRequire = function(require, mappings, pref) {
  var none = {};
  var tryReq = function(name, pref) {
    var val;
    try {
      val = require(pref + '/node_modules/' + name);
      return val;
    } catch (e) {
      if (e.toString().indexOf('Cannot find module') === -1) {
        throw e;
      }

      if (pref.indexOf('node_modules') !== -1) {
        var s = pref.split('/');
        var i = s.lastIndexOf('node_modules');
        var newPref = s.slice(0, i).join('/');
        return tryReq(name, newPref);
      }
    }
    return none;
  };
  return function(name) {
    if (name in mappings) name = mappings[name];
    if (!name) return;
    if (name[0] !== '.' && pref) {
      var val = tryReq(name, pref);
      if (val !== none) return val;
    }
    return require(name);
  }
};
require.register("components/App.jsx", function(exports, require, module) {
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _moment = require('moment');

var _moment2 = _interopRequireDefault(_moment);

var _tone = require('tone');

var _tone2 = _interopRequireDefault(_tone);

var _notifier = require('../util/notifier');

var _notifier2 = _interopRequireDefault(_notifier);

var _TimerBox = require('./TimerBox');

var _TimerBox2 = _interopRequireDefault(_TimerBox);

var _NotesBox = require('./NotesBox');

var _NotesBox2 = _interopRequireDefault(_NotesBox);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var synth = new _tone2.default.Synth().toMaster();

var defaultState = {
  enableTimerHotkeys: true
};

var pos = 0;
var sequence = [['C2', '16n'], ['G3', '16n'], ['B3', '16n'], ['C3', '16n'], ['G3', '16n']];

function triggerSynth(time) {
  //the time is the sample-accurate time of the event
  if (pos >= sequence.length) {
    pos = 0;
    _tone2.default.Transport.stop();
  } else {
    var note = sequence[pos];
    synth.triggerAttackRelease(note[0], note[1], time);
    pos++;
  }
}

//schedule a few notes
_tone2.default.Transport.schedule(triggerSynth, 0);
_tone2.default.Transport.schedule(triggerSynth, '0:0.5');
_tone2.default.Transport.schedule(triggerSynth, '0:1');
_tone2.default.Transport.schedule(triggerSynth, '0:1.5');
_tone2.default.Transport.schedule(triggerSynth, '0:2');
_tone2.default.Transport.schedule(triggerSynth, '0:3');

var App = function (_React$Component) {
  _inherits(App, _React$Component);

  function App(props) {
    _classCallCheck(this, App);

    var _this = _possibleConstructorReturn(this, (App.__proto__ || Object.getPrototypeOf(App)).call(this, props));

    _this.state = Object.assign({}, defaultState);
    return _this;
  }

  _createClass(App, [{
    key: 'componentDidMount',
    value: function componentDidMount() {
      if (!_notifier2.default.hasPermission()) {
        _notifier2.default.askPermission();
      }
      // this.cueDing();
    }
  }, {
    key: 'onTimerDing',
    value: function onTimerDing(id, preset) {
      this.cueDing();
      _notifier2.default.send({
        title: "Ding!",
        message: "Time's up!",
        duration: 10 * 1000,
        id: Math.random()
      });
    }
  }, {
    key: 'cueDing',
    value: function cueDing() {
      _tone2.default.Transport.start();
    }
  }, {
    key: 'onInputFocus',
    value: function onInputFocus() {
      this.setState({
        enableTimerHotkeys: false
      });
    }
  }, {
    key: 'onInputBlur',
    value: function onInputBlur() {
      this.setState({
        enableTimerHotkeys: true
      });
    }
  }, {
    key: 'render',
    value: function render() {
      return _react2.default.createElement(
        'div',
        { className: 'App' },
        _react2.default.createElement(_TimerBox2.default, { id: "main-timer", onDing: this.onTimerDing.bind(this), useHotKeys: this.state.enableTimerHotkeys }),
        _react2.default.createElement(_NotesBox2.default, { onInputFocus: this.onInputFocus.bind(this), onInputBlur: this.onInputBlur.bind(this) })
      );
    }
  }]);

  return App;
}(_react2.default.Component);

exports.default = App;
});

;require.register("components/NotesBox.jsx", function(exports, require, module) {
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var defaultProps = {
  onInputFocus: function onInputFocus() {},
  onInputBlur: function onInputBlur() {}
};

var defaultState = {
  nowNotes: '',
  todayNotes: ''
};

var NotesBox = function (_React$Component) {
  _inherits(NotesBox, _React$Component);

  function NotesBox(props) {
    _classCallCheck(this, NotesBox);

    var _this = _possibleConstructorReturn(this, (NotesBox.__proto__ || Object.getPrototypeOf(NotesBox)).call(this, props));

    _this.state = Object.assign({}, defaultState, {
      nowNotes: localStorage.getItem('nowNotes') || '',
      todayNotes: localStorage.getItem('todayNotes') || ''
    });
    return _this;
  }

  _createClass(NotesBox, [{
    key: 'handleChangeNowNotes',
    value: function handleChangeNowNotes(event) {
      var newVal = event.target.value;
      localStorage.setItem('nowNotes', newVal);
      this.setState({
        nowNotes: newVal
      });
    }
  }, {
    key: 'handleChangeTodayNotes',
    value: function handleChangeTodayNotes(event) {
      var newVal = event.target.value;
      localStorage.setItem('todayNotes', newVal);
      this.setState({
        todayNotes: newVal
      });
    }
  }, {
    key: 'handleInputFocus',
    value: function handleInputFocus(evt) {
      this.props.onInputFocus();
    }
  }, {
    key: 'handleInputBlur',
    value: function handleInputBlur(evt) {
      this.props.onInputBlur();
    }
  }, {
    key: 'render',
    value: function render() {
      var state = this.state;

      return _react2.default.createElement(
        'div',
        { className: 'NotesBox ' },
        _react2.default.createElement(
          'div',
          { className: 'NotesBox__input-wrapper NotesBox__now-notes' },
          _react2.default.createElement(
            'div',
            { className: 'NotesBox__input-label' },
            'NOW:'
          ),
          _react2.default.createElement('textarea', { className: 'NotesBox__input', value: this.state.nowNotes, onChange: this.handleChangeNowNotes.bind(this), onFocus: this.handleInputFocus.bind(this), onBlur: this.handleInputBlur.bind(this) })
        ),
        _react2.default.createElement(
          'div',
          { className: 'NotesBox__input-wrapper NotesBox__today-notes' },
          _react2.default.createElement(
            'div',
            { className: 'NotesBox__input-label' },
            'TODAY:'
          ),
          _react2.default.createElement('textarea', { className: 'NotesBox__input', value: this.state.todayNotes, onChange: this.handleChangeTodayNotes.bind(this), onFocus: this.handleInputFocus.bind(this), onBlur: this.handleInputBlur.bind(this) })
        )
      );
    }
  }]);

  return NotesBox;
}(_react2.default.Component);

;

NotesBox.defaultProps = defaultProps;

exports.default = NotesBox;
});

require.register("components/TimerBox.jsx", function(exports, require, module) {
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _moment = require('moment');

var _moment2 = _interopRequireDefault(_moment);

var _tone = require('tone');

var _tone2 = _interopRequireDefault(_tone);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

// if using timerbox in mutliples, maybe take the 'tick' and timeout state bits out, letting some other timeout set the tick as a prop to cue rerendering
// should also do something about the hotkeys, though disabling them is also a fallback

var defaultProps = {
  id: null,
  tickInterval: 50,
  onDing: function onDing(id, preset) {},
  useHotKeys: true
};

var presetTimes = [{ label: "pomodoro - work", duration: 25 * 60 * 1000 }, { label: "pomodoro - short break", duration: 5 * 60 * 1000 }, { label: "pomodoro - long break", duration: 10 * 60 * 1000 }, { label: "one minute", duration: 60 * 1000 }];

var defaultState = {
  selectedPresetTime: presetTimes[0],
  bankedTime: 0,
  startTime: 0,
  endTime: presetTimes[0].duration,
  isRunning: false,
  didDing: false,
  timeout: null,
  lastTick: 0
};

var TimerBox = function (_React$Component) {
  _inherits(TimerBox, _React$Component);

  function TimerBox(props) {
    _classCallCheck(this, TimerBox);

    var _this = _possibleConstructorReturn(this, (TimerBox.__proto__ || Object.getPrototypeOf(TimerBox)).call(this, props));

    _this.state = Object.assign({}, defaultState);
    return _this;
  }

  _createClass(TimerBox, [{
    key: 'componentDidMount',
    value: function componentDidMount() {
      window.addEventListener('keydown', this.onKeyDown.bind(this));
    }
  }, {
    key: 'componentWillUnmount',
    value: function componentWillUnmount() {
      clearTimeout(this.state.timeout);
      window.removeEventListener('keydown', this.onKeyDown.bind(this));
    }
  }, {
    key: 'selectPreset',
    value: function selectPreset(preset) {
      var newState = {
        selectedPresetTime: preset,
        endTime: preset.duration
      };
      _tone2.default.context.resume();

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
  }, {
    key: 'onKeyDown',
    value: function onKeyDown(evt) {
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
  }, {
    key: 'onSelectPresetTime',
    value: function onSelectPresetTime(evt) {
      var val = evt.target.value;
      var preset = _lodash2.default.find(presetTimes, { label: val });
      this.selectPreset(preset);
    }
  }, {
    key: 'onPressBegin',
    value: function onPressBegin() {
      _tone2.default.context.resume();
      this.setState({
        startTime: new Date(),
        bankedTime: 0,
        timeout: setTimeout(this.onTick.bind(this), this.props.tickInterval),
        isRunning: true,
        didDing: false
      });
    }
  }, {
    key: 'onPressPause',
    value: function onPressPause() {
      clearTimeout(this.state.timeout);
      this.setState({
        bankedTime: this.state.bankedTime + (new Date() - this.state.startTime),
        startTime: 0,
        isRunning: false,
        timeout: null
      });
    }
  }, {
    key: 'onPressResume',
    value: function onPressResume() {
      _tone2.default.context.resume();
      this.setState({
        startTime: new Date(),
        isRunning: true,
        timeout: setTimeout(this.onTick.bind(this), this.props.tickInterval)
      });
    }
  }, {
    key: 'onPressReset',
    value: function onPressReset() {
      this.setState({
        startTime: new Date(),
        bankedTime: 0,
        didDing: false
      });
    }
  }, {
    key: 'onTick',
    value: function onTick() {
      var state = this.state;
      var timeout = null;
      var msRemaining = this.calculateMsRemaining();
      clearTimeout(state.timeout);

      if (msRemaining <= 0) {
        // ding
        this.setState({
          bankedTime: state.endTime - msRemaining, // (subtracting negative msRemaining == adding overage)
          isRunning: false,
          didDing: true,
          lastTick: new Date(),
          timeout: null
        }, function () {
          this.props.onDing(this.props.id);
        }.bind(this));
      } else {
        // tick
        if (state.isRunning) {
          timeout = setTimeout(this.onTick.bind(this), this.props.tickInterval);
        }
        this.setState({
          lastTick: new Date(),
          timeout: timeout
        });
      }
    }
  }, {
    key: 'calculateMsRemaining',
    value: function calculateMsRemaining() {
      var state = this.state;
      var msRemaining = state.endTime - state.bankedTime;

      if (state.isRunning) {
        msRemaining -= new Date() - state.startTime;
      }

      return msRemaining;
    }
  }, {
    key: 'renderPresetSelector',
    value: function renderPresetSelector() {
      var state = this.state;
      var presetTimeOptions = [];
      var selection = '';

      if (state.selectedPresetTime) {
        selection = state.selectedPresetTime.label;
      }

      _lodash2.default.each(presetTimes, function (preset) {
        presetTimeOptions.push(_react2.default.createElement(
          'option',
          { value: preset.label, key: preset.label },
          preset.label
        ));
      });

      return _react2.default.createElement(
        'select',
        { className: 'TimerBox__preset-selector', name: 'preset-times', value: selection, onChange: this.onSelectPresetTime.bind(this) },
        presetTimeOptions
      );
    }
  }, {
    key: 'render',
    value: function render() {
      var state = this.state;
      var msRemaining = this.calculateMsRemaining();
      var timeRemaining = _moment2.default.duration(Math.ceil(msRemaining / 1000), 's');
      var minutesRemaining = timeRemaining.minutes();
      var secondsRemaining = timeRemaining.seconds();

      var startButton = null;
      var resetButton = _react2.default.createElement(
        'button',
        { className: 'TimerBox__button_reset', onClick: this.onPressReset.bind(this) },
        'Reset'
      );

      var rootClass = "";

      if (state.isRunning) {
        rootClass = "TimerBox_running";
        startButton = _react2.default.createElement(
          'button',
          { className: 'TimerBox__button_pause', onClick: this.onPressPause.bind(this) },
          'Pause'
        );
      } else if (state.didDing) {
        rootClass = "TimerBox_done";
        startButton = _react2.default.createElement(
          'button',
          { className: 'TimerBox__button_restart', onClick: this.onPressBegin.bind(this) },
          'Restart'
        );
      } else if (state.bankedTime > 0) {
        rootClass = "TimerBox_paused";
        startButton = _react2.default.createElement(
          'button',
          { className: 'TimerBox__button_resume', onClick: this.onPressResume.bind(this) },
          'Resume'
        );
      } else {
        startButton = _react2.default.createElement(
          'button',
          { className: 'TimerBox__button_start', onClick: this.onPressBegin.bind(this) },
          'Start'
        );
      }

      return _react2.default.createElement(
        'div',
        { className: "TimerBox " + rootClass },
        _react2.default.createElement(
          'div',
          { className: 'TimerBox__time-remaining' },
          _lodash2.default.padStart(minutesRemaining, 2, '0'),
          ' ',
          _react2.default.createElement(
            'span',
            { className: 'TimerBox__col' },
            ':'
          ),
          ' ',
          _lodash2.default.padStart(secondsRemaining, 2, '0')
        ),
        this.renderPresetSelector(),
        _react2.default.createElement(
          'div',
          { className: 'TimerBox__buttons' },
          startButton,
          resetButton
        )
      );
    }
  }]);

  return TimerBox;
}(_react2.default.Component);

;

TimerBox.defaultProps = defaultProps;

exports.default = TimerBox;
});

require.register("initialize.js", function(exports, require, module) {
'use strict';

var _reactDom = require('react-dom');

var _reactDom2 = _interopRequireDefault(_reactDom);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _App = require('components/App');

var _App2 = _interopRequireDefault(_App);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

document.addEventListener('DOMContentLoaded', function () {
  _reactDom2.default.render(_react2.default.createElement(_App2.default, null), document.querySelector('#app'));
});
});

require.register("util/notifier.js", function(exports, require, module) {
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
// Basic in-browser notification
// (could be more robust...)

// Notifications documentation: 
// https://developer.mozilla.org/en-US/docs/Web/API/Notifications_API
// https://developer.mozilla.org/en-US/docs/Web/API/Notifications_API/Using_the_Notifications_API

var defaultOptions = {
  maxDisplayTime: 5 * 1000, // ms
  defaultIcon: null
};

var generalOptions = Object.assign({}, defaultOptions);

function spawnNote() {
  var noteOptions = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

  var note = new Notification(noteOptions.title || '', {
    body: noteOptions.message || '',
    icon: noteOptions.icon || generalOptions.defaultIcon
  });
  var duration = noteOptions.duration || generalOptions.maxDisplayTime;

  setTimeout(function () {
    note.close();
  }.bind(note), duration);
}

exports.default = {
  setOptions: function setOptions(newOptions) {
    generalOptions = Object.assign({}, defaultOptions, generalOptions, newOptions);
  },

  askPermission: function askPermission() {
    // note: this returns a promise
    return Notification.requestPermission();
  },

  hasAskedPermission: function hasAskedPermission() {
    return Notification.permission === 'granted' || Notification.permission === 'denied';
  },

  hasPermission: function hasPermission() {
    return Notification.permission === 'granted';
  },

  send: function send() {
    var noteOptions = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    spawnNote(noteOptions);
  }
};
});

;require.alias("buffer/index.js", "buffer");
require.alias("process/browser.js", "process");process = require('process');require.register("___globals___", function(exports, require, module) {
  
});})();require('___globals___');


//# sourceMappingURL=app.js.map