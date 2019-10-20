import React from 'react';

const defaultProps = {
  onInputFocus : () => {},
  onInputBlur : () => {},
};


const defaultState = {
  nowNotes: '',
  todayNotes: '',
};

class NotesBox extends React.Component {
  constructor(props) {
    super(props);
    this.state = Object.assign({}, defaultState, {
      nowNotes : localStorage.getItem('nowNotes') || '',
      todayNotes : localStorage.getItem('todayNotes') || ''
    });
  }

  handleChangeNowNotes(event) {
    let newVal = event.target.value;
    localStorage.setItem('nowNotes', newVal);
    this.setState({
      nowNotes: newVal
    });
  }
  handleChangeTodayNotes(event) {
    let newVal = event.target.value;
    localStorage.setItem('todayNotes', newVal);
    this.setState({
      todayNotes: newVal
    });
  }

  handleInputFocus(evt) {
    this.props.onInputFocus();
  }

  handleInputBlur(evt) {
    this.props.onInputBlur();
  }

  render() {
    var state = this.state;

    return (
      <div className="NotesBox ">
        <div className="NotesBox__input-wrapper NotesBox__now-notes">
          <div className="NotesBox__input-label">NOW:</div>
          <textarea className="NotesBox__input" value={this.state.nowNotes} onChange={this.handleChangeNowNotes.bind(this)} onFocus={this.handleInputFocus.bind(this)} onBlur={this.handleInputBlur.bind(this)}/>
        </div>
        <div className="NotesBox__input-wrapper NotesBox__today-notes">
          <div className="NotesBox__input-label">TODAY:</div>
          <textarea className="NotesBox__input" value={this.state.todayNotes} onChange={this.handleChangeTodayNotes.bind(this)} onFocus={this.handleInputFocus.bind(this)} onBlur={this.handleInputBlur.bind(this)}/>
        </div>
      </div>
    )
  }
};

NotesBox.defaultProps = defaultProps;

export default NotesBox;