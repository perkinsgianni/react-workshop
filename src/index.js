// import libraries, packages, files
import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

// square component renders a single button (function component)
function Square(props) {
  return (
    // fill square with "X," re-render its value when clicked
    <button className="square" onClick={props.onClick}>
      {/* display value in square */}
      {props.value}
    </button>
  );
}
  
// board component renders 9 squares
class Board extends React.Component {
  // pass value and onClick props to square
  renderSquare(i) {
    return ( 
      <Square 
      // inform each square about its current value ('X', 'O', or null)
      value={this.props.squares[i]} 
      onClick={() => this.props.onClick(i)}
      />
    );
  }

  // display value
  render() {
    return (
      <div>
        <div className="board-row">
          {this.renderSquare(0)}
          {this.renderSquare(1)}
          {this.renderSquare(2)}
        </div>
        <div className="board-row">
          {this.renderSquare(3)}
          {this.renderSquare(4)}
          {this.renderSquare(5)}
        </div>
        <div className="board-row">
          {this.renderSquare(6)}
          {this.renderSquare(7)}
          {this.renderSquare(8)}
        </div>
      </div>
    );
  }
}

// game component renders board with placeholder values
class Game extends React.Component {
  // initialize state
  constructor(props) {
    super(props);
    this.state = {
      history: [{
        squares: Array(9).fill(null),
      }],
      // indicate which step we're currently viewing
      stepNumber: 0,
      xIsNext: true,
    };
  }

  // re-render square components (controlled components)
  handleClick(i) {
    // proceed from new point after "going back in time"
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    // slice method yields copy of squares arr after every move
    const squares = current.squares.slice();
    // return early by ignoring a click if someone has won or if square is already filled
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    // alternate values of xIsNext
    squares[i] = this.state.xIsNext ? 'X' : 'O';
    this.setState({
      history: history.concat([{
        squares: squares
      }]),
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext,
    });
  }

  // update stepNumber, set xIsNext to true if even
  jumpTo(step) {
    this.setState({
      stepNumber: step,
      xIsNext: (step % 2 ) === 0,
    });
  }

  // use the most recent history entry to determine and display game’s status
  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const winner = calculateWinner(current.squares);

    // map history of moves to elements representing buttons on screen, display list of buttons to “jump” to past moves
    const moves = history.map((step, move) => {
      const desc = move ?
        'Go to move #' + move :
        'Go to game start';
      return (
        <li key={move}>
          <button onClick={() => this.jumpTo(move)}>{desc}</button>
        </li>
      );
    });

    let status;
    if (winner) {
      status = 'Winner: ' + winner;
    } else {
      status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
    }

    return (
      <div className="game">
        <div className="game-board">
          <Board 
            squares={current.squares}
            onClick={(i) => this.handleClick(i)}
          />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <ol>{moves}</ol>
        </div>
      </div>
    );
  }
}
  
  // ========================================
  
ReactDOM.render(
  <Game />,
  document.getElementById('root')
);

// check for winner and return 'X', 'O', or null as appropriate
function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
      }
  }
  return null;
}
  
  