<template>
  <div>
    <button @click.stop="showHelp = true" class="help-button">
      Formula Help
    </button>

    <div v-if="showHelp" class="modal-overlay" @click.self="showHelp = false">
      <div class="modal-content">
        <h2>Formula Help</h2>
        <div class="help-content">
          <h3>SUM</h3>
          <p><strong>Syntax:</strong> <code>SUM(range)</code></p>
          <p><strong>Use Case:</strong> Adds all numbers in a range.</p>
          <p>
            <strong>Example:</strong> <code>SUM(A1:B2)</code> sums values in A1,
            B1, A2, and B2 (e.g., 10 + 20 + 15 + 25 = 70).
          </p>

          <h3>AVERAGE</h3>
          <p><strong>Syntax:</strong> <code>AVERAGE(range)</code></p>
          <p>
            <strong>Use Case:</strong> Calculates the average of numbers in a
            range.
          </p>
          <p>
            <strong>Example:</strong> <code>AVERAGE(A1:C2)</code> averages 10,
            20, 15, 25, 5 (ignoring text) = 15.
          </p>

          <h3>MIN</h3>
          <p><strong>Syntax:</strong> <code>MIN(range)</code></p>
          <p>
            <strong>Use Case:</strong> Finds the smallest number in a range.
          </p>
          <p>
            <strong>Example:</strong> <code>MIN(A1:A3)</code> finds min of 10,
            15, 30 = 10.
          </p>

          <h3>MAX</h3>
          <p><strong>Syntax:</strong> <code>MAX(range)</code></p>
          <p><strong>Use Case:</strong> Finds the largest number in a range.</p>
          <p>
            <strong>Example:</strong> <code>MAX(A1:C3)</code> finds max of 10,
            20, 15, 25, 5, 30, 8 = 30.
          </p>

          <h3>COUNT</h3>
          <p><strong>Syntax:</strong> <code>COUNT(range)</code></p>
          <p><strong>Use Case:</strong> Counts cells with numeric values.</p>
          <p>
            <strong>Example:</strong> <code>COUNT(A1:C3)</code> counts 10, 20,
            15, 25, 5, 30, 8 = 7.
          </p>

          <h3>COUNTA</h3>
          <p><strong>Syntax:</strong> <code>COUNTA(range)</code></p>
          <p><strong>Use Case:</strong> Counts non-empty cells.</p>
          <p>
            <strong>Example:</strong> <code>COUNTA(A1:C3)</code> counts 10, 20,
            "Hi", 15, 25, 5, 30, 8 = 8.
          </p>

          <h3>PRODUCT</h3>
          <p><strong>Syntax:</strong> <code>PRODUCT(range)</code></p>
          <p><strong>Use Case:</strong> Multiplies all numbers in a range.</p>
          <p>
            <strong>Example:</strong> <code>PRODUCT(A1:A3)</code> multiplies 10
            * 15 * 30 = 4500.
          </p>

          <h3>STDEV</h3>
          <p><strong>Syntax:</strong> <code>STDEV(range)</code></p>
          <p>
            <strong>Use Case:</strong> Calculates standard deviation of numbers.
          </p>
          <p>
            <strong>Example:</strong> <code>STDEV(A1:A3)</code> for 10, 15, 30 ≈
            8.49.
          </p>

          <h3>MEDIAN</h3>
          <p><strong>Syntax:</strong> <code>MEDIAN(range)</code></p>
          <p><strong>Use Case:</strong> Finds the median value in a range.</p>
          <p>
            <strong>Example:</strong> <code>MEDIAN(A1:A3)</code> for 10, 15, 30
            = 15.
          </p>

          <h3>IF</h3>
          <p>
            <strong>Syntax:</strong>
            <code>IF(condition, valueIfTrue, valueIfFalse)</code>
          </p>
          <p>
            <strong>Use Case:</strong> Returns one value if a condition is true,
            another if false.
          </p>
          <p>
            <strong>Example:</strong>
            <code>IF(A1>15, "High", "Low")</code> checks if 10 > 15, returns
            "Low".
          </p>

          <h3>CONCAT</h3>
          <p><strong>Syntax:</strong> <code>CONCAT(range)</code></p>
          <p><strong>Use Case:</strong> Combines text from multiple cells.</p>
          <p>
            <strong>Example:</strong> <code>CONCAT(A1:C1)</code> combines 10,
            20, "Hi" = "1020Hi".
          </p>

          <h3>POWER</h3>
          <p>
            <strong>Syntax:</strong> <code>POWER(baseCell, exponentCell)</code>
          </p>
          <p><strong>Use Case:</strong> Raises a number to a power.</p>
          <p>
            <strong>Example:</strong> <code>POWER(A1, B1)</code> raises 10 to 20
            = 1e20.
          </p>

          <h3>ROUND</h3>
          <p>
            <strong>Syntax:</strong> <code>ROUND(numberCell, decimals)</code>
          </p>
          <p>
            <strong>Use Case:</strong> Rounds a number to specified decimal
            places.
          </p>
          <p>
            <strong>Example:</strong> <code>ROUND(A2, 1)</code> rounds 15 to
            15.0.
          </p>
        </div>
        <button @click="showHelp = false" class="close-btn">Close</button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "FormulaHelp",
  data() {
    return {
      showHelp: false,
    };
  },
});
</script>

<style scoped>
.help-button {
  padding: 8px 16px;
  background-color: #ff9800;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
}

.help-button:hover {
  background-color: #f57c00;
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  background: white;
  padding: 20px;
  border-radius: 8px;
  width: 600px;
  max-width: 90%;
  max-height: 80vh;
  overflow-y: auto;
}

.help-content h3 {
  margin-top: 15px;
  color: #2196f3;
}

.help-content p {
  margin: 5px 0;
}

.help-content code {
  background: #f5f5f5;
  padding: 2px 5px;
  border-radius: 3px;
}

.close-btn {
  margin-top: 20px;
  padding: 8px 16px;
  background-color: #f44336;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  display: block;
  margin-left: auto;
}

.close-btn:hover {
  background-color: #da190b;
}
</style>
