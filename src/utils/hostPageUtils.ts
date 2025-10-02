/**
 * Utility functions for interacting with the host page
 * These functions allow the embedded app to control elements on the parent page
 */

/**
 * Hide an element on the host page by ID
 * @param elementId - The ID of the element to hide
 */
export const hideHostElement = (elementId: string): void => {
  try {
    const element = document.getElementById(elementId);
    if (element) {
      element.style.display = 'none';
      console.log(`Hidden host element: ${elementId}`);
    } else {
      console.warn(`Host element not found: ${elementId}`);
    }
  } catch (error) {
    console.error(`Error hiding host element ${elementId}:`, error);
  }
};

/**
 * Show an element on the host page by ID
 * @param elementId - The ID of the element to show
 * @param displayValue - The display CSS value to use (default: 'block')
 */
export const showHostElement = (elementId: string, displayValue: string = 'block'): void => {
  try {
    const element = document.getElementById(elementId);
    if (element) {
      element.style.display = displayValue;
      console.log(`Shown host element: ${elementId}`);
    } else {
      console.warn(`Host element not found: ${elementId}`);
    }
  } catch (error) {
    console.error(`Error showing host element ${elementId}:`, error);
  }
};

/**
 * Toggle visibility of an element on the host page by ID
 * @param elementId - The ID of the element to toggle
 * @param displayValue - The display CSS value to use when showing (default: 'block')
 */
export const toggleHostElement = (elementId: string, displayValue: string = 'block'): void => {
  try {
    const element = document.getElementById(elementId);
    if (element) {
      const isHidden = element.style.display === 'none' || 
                      window.getComputedStyle(element).display === 'none';
      
      if (isHidden) {
        element.style.display = displayValue;
        console.log(`Shown host element: ${elementId}`);
      } else {
        element.style.display = 'none';
        console.log(`Hidden host element: ${elementId}`);
      }
    } else {
      console.warn(`Host element not found: ${elementId}`);
    }
  } catch (error) {
    console.error(`Error toggling host element ${elementId}:`, error);
  }
};

/**
 * Check if a host element exists
 * @param elementId - The ID of the element to check
 * @returns boolean indicating if the element exists
 */
export const hostElementExists = (elementId: string): boolean => {
  try {
    return document.getElementById(elementId) !== null;
  } catch (error) {
    console.error(`Error checking host element ${elementId}:`, error);
    return false;
  }
};

/**
 * Store the original display value of a host element
 * This is useful for restoring the element later
 */
const originalDisplayValues = new Map<string, string>();

/**
 * Hide a host element and remember its original display value
 * @param elementId - The ID of the element to hide
 */
export const hideHostElementWithMemory = (elementId: string): void => {
  try {
    const element = document.getElementById(elementId);
    if (element) {
      // Store the original display value if not already stored
      if (!originalDisplayValues.has(elementId)) {
        const originalDisplay = window.getComputedStyle(element).display;
        originalDisplayValues.set(elementId, originalDisplay);
      }
      
      element.style.display = 'none';
      console.log(`Hidden host element with memory: ${elementId}`);
    } else {
      console.warn(`Host element not found: ${elementId}`);
    }
  } catch (error) {
    console.error(`Error hiding host element with memory ${elementId}:`, error);
  }
};

/**
 * Restore a host element to its original display value
 * @param elementId - The ID of the element to restore
 */
export const restoreHostElement = (elementId: string): void => {
  try {
    const element = document.getElementById(elementId);
    if (element) {
      const originalDisplay = originalDisplayValues.get(elementId) || 'block';
      element.style.display = originalDisplay;
      console.log(`Restored host element: ${elementId} to ${originalDisplay}`);
    } else {
      console.warn(`Host element not found: ${elementId}`);
    }
  } catch (error) {
    console.error(`Error restoring host element ${elementId}:`, error);
  }
};