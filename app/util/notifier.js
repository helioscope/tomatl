// Basic in-browser notification
// (could be more robust...)

// Notifications documentation: 
// https://developer.mozilla.org/en-US/docs/Web/API/Notifications_API
// https://developer.mozilla.org/en-US/docs/Web/API/Notifications_API/Using_the_Notifications_API

const defaultOptions = {
  maxDisplayTime : 5 * 1000, // ms
  defaultIcon : null
};

var generalOptions = Object.assign({}, defaultOptions);

function spawnNote(noteOptions = {}) {
  var note = new Notification(
    noteOptions.title || '',
    {
      body : noteOptions.message || '',
      icon : noteOptions.icon || generalOptions.defaultIcon
    }
  );
  var duration = noteOptions.duration || generalOptions.maxDisplayTime;

  setTimeout(function(){
    note.close();
  }.bind(note), duration);
}

export default {
  setOptions: function (newOptions) {
    generalOptions = Object.assign({}, defaultOptions, generalOptions, newOptions);
  },

  askPermission: function () {
    // note: this returns a promise
    return Notification.requestPermission();
  },

  hasAskedPermission: function () {
    return Notification.permission === 'granted' || Notification.permission === 'denied';
  },

  hasPermission: function () {
    return Notification.permission === 'granted';
  },

  send: function (noteOptions = {}) {
    spawnNote(noteOptions);
  },
}