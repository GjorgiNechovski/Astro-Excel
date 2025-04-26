<template>
  <div class="csv-controls">
    <button @click="exportToCSV" class="csv-button">Export CSV</button>
    <input
      type="file"
      ref="fileInput"
      accept=".csv"
      @change="importFromCSV"
      style="display: none"
    />
    <button @click="triggerFileInput" class="csv-button">Import CSV</button>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import { state } from '../../state/stateManager';
import { Cell, type ICellStyle } from '../../models/cell';
import { cellHeight, cellWidth } from '../../models/contants';
import '../../styles/csv.css';

export default defineComponent({
  name: 'CSVControls',
  setup() {
    const fileInput = ref<HTMLInputElement | null>(null);

    const triggerFileInput = () => {
      fileInput.value?.click();
    };

    const exportToCSV = () => {
      const grid = state.grid;
      const maxRow = Math.max(...grid.map((cell) => cell.row));
      const maxCol = Math.max(...grid.map((cell) => cell.col));

      const csvArray: string[][] = [];
      for (let row = 0; row <= maxRow; row++) {
        const rowData: string[] = [];
        for (let col = 0; col <= maxCol; col++) {
          const cell = grid.find((c) => c.row === row && c.col === col);
          const value =
            cell?.disabled && row !== 0 && col !== 0
              ? ''
              : cell?.displayValue || '';
          rowData.push(value);
        }
        csvArray.push(rowData);
      }

      const csvContent = csvArray
        .map((row) =>
          row.map((value) => `"${value.replace(/"/g, '""')}"`).join(','),
        )
        .join('\n');

      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', 'spreadsheet.csv');
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    };

    const importFromCSV = (event: Event) => {
      const input = event.target as HTMLInputElement;
      if (!input.files?.length) return;

      const file = input.files[0];
      const reader = new FileReader();
      const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

      reader.onload = (e) => {
        const text = e.target?.result as string;
        const rows = text
          .split('\n')
          .map((row) =>
            row
              .split(',')
              .map((value) => value.replace(/^"|"$/g, '').replace(/""/g, '"')),
          );

        const newGrid: Cell[] = [];
        rows.forEach((row, rowIndex) => {
          row.forEach((value, colIndex) => {
            const isHeader = rowIndex === 0 || colIndex === 0;
            const cellStyle: ICellStyle = {
              width: `${cellWidth}px`,
              height: `${cellHeight}px`,
              border: '1px solid black',
              padding: '0',
              textAlign: isHeader ? 'center' : 'start',
              backgroundColor: isHeader ? '#ff9563' : 'white',
            };

            const newCell = new Cell(
              value,
              value,
              rowIndex,
              colIndex,
              isHeader,
              undefined,
              cellStyle,
            );

            if (rowIndex === 0 && colIndex > 0) {
              newCell.realValue = alphabet[colIndex - 1] || '';
              newCell.displayValue = alphabet[colIndex - 1] || '';
            } else if (colIndex === 0 && rowIndex > 0) {
              newCell.realValue = rowIndex.toString();
              newCell.displayValue = rowIndex.toString();
            }

            newGrid.push(newCell);
          });
        });

        state.setGrid(newGrid);
        input.value = '';
      };

      reader.readAsText(file);
    };

    return {
      fileInput,
      triggerFileInput,
      exportToCSV,
      importFromCSV,
    };
  },
});
</script>

<style scoped>
.csv-controls {
  display: flex;
  gap: 10px;
  margin-left: auto;
}
</style>
