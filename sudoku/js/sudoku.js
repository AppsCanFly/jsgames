function initSudokuGame() {
  const settings = {
    levels: [
      { level: "Easy", numbers: 70 },
      { level: "Medium", numbers: 30 },
      { level: "Hard", numbers: 20 },
    ],
  };

  const defaults = {
    matrix: [],
    domMatrix: [],
    numOfRows: 9,
    numOfCols: 9,
    level: 40,
    selected: null,
    selectedSolution: null,
    anwerTracker: {
      1: 9,
      2: 9,
      3: 9,
      4: 9,
      5: 9,
      6: 9,
      7: 9,
      8: 9,
      9: 9,
    },
  };

  const sudokuGame = document.querySelector(".sudoku-game");
  sudokuGame.classList.add("sdk-game");

  function createMatrix() {
    const matrix = [];
    for (let rowCounter = 0; rowCounter < 9; rowCounter++) {
      matrix[rowCounter] = [];
      for (let colCounter = 0; colCounter < 9; colCounter++) {
        let number =
          colCounter / 1 +
          1 +
          rowCounter * 3 +
          (Math.floor(rowCounter / 3) % 3);
        if (number > 9) number = number % 9;
        if (number == 0) number = 9;
        matrix[rowCounter][colCounter] = number;
      }
    }
    // Switching rows
    for (let no = 0; no < 9; no += 3) {
      for (let no2 = 0; no2 < 3; no2++) {
        let row1 = Math.floor(Math.random() * 3);
        let row2 = Math.floor(Math.random() * 3);
        while (row2 == row1) {
          row2 = Math.floor(Math.random() * 3);
        }
        row1 = row1 + no;
        row2 = row2 + no;
        const tmpMatrix = matrix[row1];
        matrix[row1] = matrix[row2];
        matrix[row2] = tmpMatrix;
      }
    }
    // Switching columns
    for (let no = 0; no < 9; no += 3) {
      for (let no2 = 0; no2 < 3; no2++) {
        let col1 = Math.floor(Math.random() * 3);
        let col2 = Math.floor(Math.random() * 3);
        while (col2 == col1) {
          col2 = Math.floor(Math.random() * 3);
        }
        col1 = col1 + no;
        col2 = col2 + no;
        for (let no3 = 0; no3 < matrix.length; no3++) {
          const tmpMatrixValue = matrix[no3][col1];
          matrix[no3][col1] = matrix[no3][col2];
          matrix[no3][col2] = tmpMatrixValue;
        }
      }
    }
    return matrix;
  }

  function createTable() {
    defaults.domMatrix = [];
    const table = document.createElement("div");
    table.classList.add("sdk-table", "sdk-no-show");

    for (let row = 0; row < defaults.numOfRows; row++) {
      defaults.domMatrix[row] = [];
      const tempRow = document.createElement("div");
      tempRow.classList.add("sdk-row");
      if (row == 2 || row == 5) tempRow.classList.add("sdk-border");

      for (let col = 0; col < defaults.numOfCols; col++) {
        const cell = document.createElement("div");
        cell.classList.add("sdk-col");
        cell.dataset.row = row;
        cell.dataset.col = col;
        if (col == 2 || col == 5) cell.classList.add("sdk-border");
        tempRow.appendChild(cell);
        defaults.domMatrix[row][col] = cell;
      }
      table.appendChild(tempRow);
    }

    const tableBk = document.createElement("div");
    tableBk.classList.add("sdk-table-bk");
    table.appendChild(tableBk);
    sudokuGame.appendChild(table);

    let items = defaults.level;
    while (items > 0) {
      const row = Math.floor(Math.random() * 9);
      const col = Math.floor(Math.random() * 9);
      if (defaults.domMatrix[row][col].children.length == 0) {
        const solution = document.createElement("div");
        solution.classList.add("sdk-solution");
        solution.textContent = defaults.matrix[row][col];
        defaults.domMatrix[row][col].appendChild(solution);
        defaults.anwerTracker[defaults.matrix[row][col].toString()]--;
        items--;
      }
    }

    table.addEventListener("click", function (e) {
      if (e.target.classList.contains("sdk-col")) {
        document.querySelectorAll(".sdk-solution").forEach((el) => {
          el.classList.remove("sdk-helper");
        });
        document.querySelectorAll(".sdk-col").forEach((el) => {
          el.classList.remove("sdk-selected");
        });
        if (e.target.children.length == 0) {
          e.target.classList.add("sdk-selected");
          defaults.selected = e.target;
          defaults.selectedSolution =
            defaults.matrix[e.target.dataset.row][e.target.dataset.col];
        } else {
          highlightHelp(parseInt(e.target.textContent));
        }
      }
    });

    answerPicker();

    setTimeout(() => {
      table.classList.remove("sdk-no-show");
    }, 300);
  }

  function answerPicker() {
    const answerContainer = document.createElement("div");
    answerContainer.classList.add("sdk-ans-container");

    for (const a in defaults.anwerTracker) {
      const btn = document.createElement("div");
      btn.classList.add("sdk-btn");
      btn.textContent = a;
      if (defaults.anwerTracker[a] <= 0) {
        btn.classList.add("sdk-no-show");
      }
      answerContainer.appendChild(btn);
    }

    answerContainer.addEventListener("click", function (e) {
      if (
        e.target.classList.contains("sdk-btn") &&
        !e.target.classList.contains("sdk-no-show") &&
        defaults.selected != null &&
        defaults.selected.children.length == 0
      ) {
        if (defaults.selectedSolution == parseInt(e.target.textContent)) {
          defaults.anwerTracker[e.target.textContent]--;
          if (defaults.anwerTracker[e.target.textContent] == 0) {
            e.target.classList.add("sdk-no-show");
          }
          defaults.selected.classList.remove("sdk-selected");
          const solution = document.createElement("div");
          solution.classList.add("sdk-solution");
          solution.textContent = defaults.selectedSolution;
          defaults.selected.appendChild(solution);
        }
      }
    });

    sudokuGame.appendChild(answerContainer);
  }

  function highlightHelp(number) {
    for (let row = 0; row < defaults.numOfRows; row++) {
      for (let col = 0; col < defaults.numOfCols; col++) {
        if (parseInt(defaults.domMatrix[row][col].textContent) == number) {
          defaults.domMatrix[row][col]
            .querySelector(".sdk-solution")
            .classList.add("sdk-helper");
        }
      }
    }
  }

  function createDiffPicker() {
    const picker = document.createElement("div");
    picker.classList.add("sdk-picker", "sdk-no-show");

    settings.levels.forEach((level) => {
      const btn = document.createElement("div");
      btn.classList.add("sdk-btn");
      btn.dataset.level = level.numbers;
      btn.textContent = level.level;
      picker.appendChild(btn);
    });

    picker.addEventListener("click", function (e) {
      if (e.target.classList.contains("sdk-btn")) {
        picker.classList.add("sdk-no-show");
        defaults.level = parseInt(e.target.dataset.level);
        setTimeout(() => {
          picker.remove();
          createTable();
        }, 2000);
      }
    });

    sudokuGame.appendChild(picker);

    setTimeout(() => {
      picker.classList.remove("sdk-no-show");
    }, 500);
  }

  defaults.matrix = createMatrix();
  createDiffPicker();
}
