class GoGame {
  constructor(boardSize = 9) {
    this.boardSize = boardSize;
    this.board = Array(boardSize * boardSize).fill(null);
    this.directions = [
      [-1, 0],
      [1, 0],
      [0, -1],
      [0, 1],
    ]; // вверх, вниз, влево, вправо
  }

  // Обновление доски из вашего массива
  updateBoard(points) {
    this.board = points.map((point) => ({
      id: point.id,
      color: point.user, // 'black', 'white', или '' для пустой
    }));
  }

  // Получение координат по ID
  getCoordinates(id) {
    const x = (id - 1) % this.boardSize;
    const y = Math.floor((id - 1) / this.boardSize);
    return { x, y };
  }

  // Получение ID по координатам
  getId(x, y) {
    return y * this.boardSize + x + 1;
  }

  // Проверка валидности координат
  isValidCoordinate(x, y) {
    return x >= 0 && x < this.boardSize && y >= 0 && y < this.boardSize;
  }

  // Получение соседних точек
  getNeighbors(id) {
    const { x, y } = this.getCoordinates(id);
    const neighbors = [];

    for (const [dx, dy] of this.directions) {
      const nx = x + dx;
      const ny = y + dy;
      if (this.isValidCoordinate(nx, ny)) {
        neighbors.push(this.getId(nx, ny));
      }
    }

    return neighbors;
  }

  // Поиск группы камней и её свободных дамэ
  findGroupWithLiberties(startId, visited = new Set()) {
    const startStone = this.board.find((p) => p.id === startId);
    if (!startStone || !startStone.color) return { group: [], liberties: [] };

    const color = startStone.color;
    const group = [];
    const liberties = new Set();
    const stack = [startId];

    while (stack.length > 0) {
      const currentId = stack.pop();

      if (visited.has(currentId)) continue;
      visited.add(currentId);

      const currentStone = this.board.find((p) => p.id === currentId);
      if (currentStone.color === color) {
        group.push(currentId);

        // Проверяем соседей
        for (const neighborId of this.getNeighbors(currentId)) {
          const neighbor = this.board.find((p) => p.id === neighborId);
          if (!neighbor.color) {
            // Свободная точка - дамэ
            liberties.add(neighborId);
          } else if (neighbor.color === color && !visited.has(neighborId)) {
            stack.push(neighborId);
          }
        }
      }
    }

    return { group: group, liberties: Array.from(liberties) };
  }

  // Проверка всех групп на захват после хода
  checkCaptures(lastMoveId) {
    const capturedStones = [];
    const visited = new Set();

    // Проверяем соседей последнего хода
    const lastMoveColor = this.board.find((p) => p.id === lastMoveId).color;
    const opponentColor = lastMoveColor === "black" ? "white" : "black";

    for (const neighborId of this.getNeighbors(lastMoveId)) {
      const neighbor = this.board.find((p) => p.id === neighborId);

      if (
        neighbor &&
        neighbor.color === opponentColor &&
        !visited.has(neighborId)
      ) {
        const { group, liberties } = this.findGroupWithLiberties(
          neighborId,
          visited
        );

        // Если у группы нет дамэ - захватываем
        if (liberties.length === 0) {
          capturedStones.push(...group);
        }
      }
    }

    return capturedStones;
  }

  // Проверка самозахвата (ко)
  isSuicide(moveId, color) {
    // Временно ставим камень
    const originalState = this.board.find((p) => p.id === moveId).color;
    this.board.find((p) => p.id === moveId).color = color;

    const { group, liberties } = this.findGroupWithLiberties(moveId);
    let isSuicide = liberties.length === 0;

    // Проверяем, не захватываем ли мы вражеские камни
    if (isSuicide) {
      for (const neighborId of this.getNeighbors(moveId)) {
        const neighbor = this.board.find((p) => p.id === neighborId);
        if (neighbor && neighbor.color && neighbor.color !== color) {
          const opponentGroup = this.findGroupWithLiberties(neighborId);
          if (opponentGroup.liberties.length === 0) {
            isSuicide = false; // Захватываем врага - не самозахват
            break;
          }
        }
      }
    }

    // Возвращаем исходное состояние
    this.board.find((p) => p.id === moveId).color = originalState;

    return isSuicide;
  }

  // Основная функция для проверки после хода
  processMove(points, moveId, color) {
    // Обновляем доску
    this.updateBoard(points);

    // Проверяем самозахват
    if (this.isSuicide(moveId, color)) {
      return { valid: false, reason: "suicide", captured: [] };
    }

    // Ставим камень
    this.board.find((p) => p.id === moveId).color = color;

    // Проверяем захваты
    const capturedStones = this.checkCaptures(moveId);

    // Убираем захваченные камни
    for (const stoneId of capturedStones) {
      this.board.find((p) => p.id === stoneId).color = "";
    }

    return {
      valid: true,
      captured: capturedStones,
      newBoardState: this.board,
    };
  }
}

// // Пример использования
// const game = new GoGame(9);

// // Ваши данные
// const points = [
//   { id: 1, user: "" },
//   { id: 2, user: "" },
//   // ... остальные точки
// ];

// // Симуляция хода
// const result = game.processMove(points, 40, "black");
// console.log("Результат хода:", result);
