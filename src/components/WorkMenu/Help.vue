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
            <strong>Example:</strong> <code>SUM(A1:B2)=</code> sums values in
            A1, B1, A2, and B2 (e.g., 10 + 20 + 15 + 25 = 70).
          </p>

          <h3>AVERAGE</h3>
          <p><strong>Syntax:</strong> <code>AVERAGE(range)</code></p>
          <p>
            <strong>Use Case:</strong> Calculates the average of numbers in a
            range.
          </p>
          <p>
            <strong>Example:</strong> <code>AVERAGE(A1:C2)=</code> averages 10,
            20, 15, 25, 5 (ignoring text) = 15.
          </p>

          <h3>MIN</h3>
          <p><strong>Syntax:</strong> <code>MIN(range)</code></p>
          <p>
            <strong>Use Case:</strong> Finds the smallest number in a range.
          </p>
          <p>
            <strong>Example:</strong> <code>MIN(A1:A3)=</code> finds min of 10,
            15, 30 = 10.
          </p>

          <h3>MAX</h3>
          <p><strong>Syntax:</strong> <code>MAX(range)</code></p>
          <p><strong>Use Case:</strong> Finds the largest number in a range.</p>
          <p>
            <strong>Example:</strong> <code>MAX(A1:C3)=</code> finds max of 10,
            20, 15, 25, 5, 30, 8 = 30.
          </p>

          <h3>COUNT</h3>
          <p><strong>Syntax:</strong> <code>COUNT(range)</code></p>
          <p><strong>Use Case:</strong> Counts cells with numeric values.</p>
          <p>
            <strong>Example:</strong> <code>COUNT(A1:C3)=</code> counts 10, 20,
            15, 25, 5, 30, 8 = 7.
          </p>

          <h3>COUNTA</h3>
          <p><strong>Syntax:</strong> <code>COUNTA(range)</code></p>
          <p><strong>Use Case:</strong> Counts non-empty cells.</p>
          <p>
            <strong>Example:</strong> <code>COUNTA(A1:C3)=</code> counts 10, 20,
            "Hi", 15, 25, 5, 30, 8 = 8.
          </p>

          <h3>PRODUCT</h3>
          <p><strong>Syntax:</strong> <code>PRODUCT(range)</code></p>
          <p><strong>Use Case:</strong> Multiplies all numbers in a range.</p>
          <p>
            <strong>Example:</strong> <code>PRODUCT(A1:A3)=</code> multiplies 10
            * 15 * 30 = 4500.
          </p>

          <h3>STDEV</h3>
          <p><strong>Syntax:</strong> <code>STDEV(range)</code></p>
          <p>
            <strong>Use Case:</strong>Calculates standard deviation of
            population of numbers
          </p>
          <p>
            <strong>Example:</strong> <code>STDEV(A1:A3)=</code> for 10, 15, 30
            ≈ 8.49.
          </p>

          <h3>MEDIAN</h3>
          <p><strong>Syntax:</strong> <code>MEDIAN(range)</code></p>
          <p><strong>Use Case:</strong> Finds the median value in a range.</p>
          <p>
            <strong>Example:</strong> <code>MEDIAN(A1:A3)=</code> for 10, 15, 30
            = 15.
          </p>

          <h3>CONCAT</h3>
          <p><strong>Syntax:</strong> <code>CONCAT(range)</code></p>
          <p><strong>Use Case:</strong> Combines text from multiple cells.</p>
          <p>
            <strong>Example:</strong> <code>CONCAT(A1:C1)=</code> combines 10,
            20, "Hi" = "1020Hi".
          </p>

          <br />
          <h7
            >Number based operations also work with hex numbers (ex. 0x123)</h7
          >
        </div>
        <button @click="showHelp = false" class="close-btn">Close</button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import '../../styles/help.css';

export default defineComponent({
  name: 'FormulaHelp',
  data() {
    return {
      showHelp: false,
    };
  },
});
</script>
