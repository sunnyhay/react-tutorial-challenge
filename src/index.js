import React from "react";
import ReactDOM from "react-dom";
import "./index.css";

function Square(props) {
  const cName = props.highlight ? "highlight" : "square";
  return (
    <button className={cName} onClick={props.onClick}>
      {props.value}
    </button>
  );
}

class Board extends React.Component {
  renderSquare(i) {
    return (
      <Square
        key={"Square" + i}
        value={this.props.squares[i]}
        highlight={this.props.highlights[i]}
        onClick={() => this.props.onClick(i)}
      />
    );
  }

  render() {
    const items = [];
    for (let i = 0; i < 3; i++) {
      let subItems = [];
      for (let j = 0; j < 3; j++) {
        subItems.push(this.renderSquare(3 * i + j));
      }
      items.push(
        <div key={i} className="board-row">
          {subItems}
        </div>
      );
    }

    return items;
  }
}

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      history: [{ squares: Array(9).fill(null) }],
      stepNumber: 0,
      xIsNext: true,
      isToggleAscending: true,
      rowHistory: [],
      colHistory: [],
      highlights: Array(9).fill(false),
    };
  }

  jumpTo(step) {
    this.setState({ stepNumber: step, xIsNext: step % 2 === 0 });
  }

  handleClick(i) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    squares[i] = this.state.xIsNext ? "X" : "O";
    const curRow = Math.floor(i / 3);
    const curCol = i % 3;
    this.setState({
      history: history.concat([{ squares: squares }]),
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext,
      rowHistory: this.state.rowHistory.concat(curRow),
      colHistory: this.state.colHistory.concat(curCol),
    });
  }

  toggle() {
    this.setState({ isToggleAscending: !this.state.isToggleAscending });
  }

  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const winner = calculateWinner(current.squares);
    const moves = history.map((step, move) => {
      const desc = move
        ? "Go to move #" +
          move +
          " in col: " +
          this.state.colHistory[move - 1] +
          " row: " +
          this.state.rowHistory[move - 1]
        : "Go to game start";
      let bold = move === this.state.stepNumber ? "bold" : "";
      return (
        <li key={move}>
          <button className={bold} onClick={() => this.jumpTo(move)}>
            {desc}
          </button>
        </li>
      );
    });
    const realMoves = this.state.isToggleAscending ? moves : moves.reverse();

    let status;
    let highlights = this.state.highlights;
    if (winner) {
      status = "Winner: " + winner.symbol;
      const curHighlightIndice = winner.winIndice;
      highlights = highlights.map((val, index) => {
        return curHighlightIndice.includes(index) ? true : false;
      });
    } else {
      status =
        this.state.stepNumber === 9
          ? "DRAW"
          : "Next player: " + (this.state.xIsNext ? "X" : "O");
    }

    const toggleText = this.state.isToggleAscending
      ? "ASC toggle"
      : "DESC toggle";
    return (
      <div className="game">
        <div className="game-board">
          <Board
            squares={current.squares}
            highlights={highlights}
            onClick={(i) => this.handleClick(i)}
          />
        </div>
        <div className="game-info">
          <button onClick={() => this.toggle()}>{toggleText}</button>
          <div>{status}</div>
          <ol>{realMoves}</ol>
        </div>
      </div>
    );
  }
}

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
      return { symbol: squares[a], winIndice: [a, b, c] }; //squares[a];
    }
  }
  return null;
}

// ========================================

ReactDOM.render(<Game />, document.getElementById("root"));
