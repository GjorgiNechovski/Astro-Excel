import type { Cell } from "../models/cell";

type SelectedCell = {
  row: number;
  col: number;
} | null;

type Listener = () => void;

export const state = {
  grid: [] as Cell[],
  numRows: 0,
  selectedCell: null as SelectedCell,
  listeners: [] as Listener[],

  setGrid(newGrid: Cell[]) {
    this.grid = newGrid;
    this.notifyListeners();
  },

  setNumRows(newNumRows: number) {
    this.numRows = newNumRows;
    this.notifyListeners();
  },

  setSelectedCell(newSelectedCell: SelectedCell) {
    this.selectedCell = newSelectedCell;
    this.notifyListeners();
  },

  subscribe(listener: Listener) {
    this.listeners.push(listener);
  },

  notifyListeners() {
    this.listeners.forEach((listener) => listener());
  },
};
