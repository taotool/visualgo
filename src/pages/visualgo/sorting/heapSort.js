/**
 * Heap Sort Algorithm Implementation
 * 
 * Time Complexity:
 * - Best Case: O(n log n)
 * - Average Case: O(n log n)
 * - Worst Case: O(n log n)
 * 
 * Space Complexity: O(1) - Heap sort is an in-place sorting algorithm
 * 
 * Heap sort works by first building a max heap from the input array,
 * then repeatedly extracting the maximum element from the heap and
 * rebuilding the heap until the array is sorted.
 */

/**
 * Heapify a subtree rooted at index i in the array.
 * n is the size of the heap
 * 
 * @param {Array} arr - The array to heapify
 * @param {number} n - The size of the heap
 * @param {number} i - The index of the root of the subtree to heapify
 */
function heapify(arr, n, i) {
  // Initialize largest as root
  let largest = i;
  
  // Calculate indices of left and right children
  const left = 2 * i + 1;
  const right = 2 * i + 2;
  
  // If left child is larger than root
  if (left < n && arr[left] > arr[largest]) {
    largest = left;
  }
  
  // If right child is larger than largest so far
  if (right < n && arr[right] > arr[largest]) {
    largest = right;
  }
  
  // If largest is not root
  if (largest !== i) {
    // Swap arr[i] and arr[largest]
    [arr[i], arr[largest]] = [arr[largest], arr[i]];
    
    // Recursively heapify the affected sub-tree
    heapify(arr, n, largest);
  }
}

/**
 * Main function to perform heap sort
 * 
 * @param {Array} arr - The array to be sorted
 * @returns {Array} - The sorted array
 */
function heapSort(arr) {
  const n = arr.length;
  
  // Build max heap (rearrange array)
  for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
    heapify(arr, n, i);
  }
  
  // One by one extract elements from heap
  for (let i = n - 1; i > 0; i--) {
    // Move current root to end
    [arr[0], arr[i]] = [arr[i], arr[0]];
    
    // Call max heapify on the reduced heap
    heapify(arr, i, 0);
  }
  
  return arr;
}

/**
 * Example usage:
 * 
 * const unsortedArray = [12, 11, 13, 5, 6, 7];
 * const sortedArray = heapSort([...unsortedArray]);
 * console.log(sortedArray); // [5, 6, 7, 11, 12, 13]
 */

export default heapSort;
