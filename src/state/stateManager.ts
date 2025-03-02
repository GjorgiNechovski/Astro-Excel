import type { Cell } from "../models/cell";

type SelectedCell = {
  row: number;
  col: number;
};

type Listener = () => void;

export const state = {
  grid: [] as Cell[],
  numRows: 0,
  selectedCells: [] as SelectedCell[],
  listeners: [] as Listener[],

  setGrid(newGrid: Cell[]) {
    this.grid = newGrid;
    this.notifyListeners();
  },

  setNumRows(newNumRows: number) {
    this.numRows = newNumRows;
    this.notifyListeners();
  },

  setSelectedCells(newSelectedCells: SelectedCell[]) {
    this.selectedCells = newSelectedCells;
    this.notifyListeners();
  },

  subscribe(listener: Listener) {
    this.listeners.push(listener);
  },

  notifyListeners() {
    this.listeners.forEach((listener) => listener());
  },
};
