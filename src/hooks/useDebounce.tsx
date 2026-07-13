import { useState, useEffect } from "react";

/**
 * A custom hook that delays updating a value until after a specified delay has passed
 * since the last time the value was changed.
 * * @param value The value to debounce (string, number, object, etc.)
 * @param delay The delay in milliseconds (defaults to 500ms)
 * @returns The debounced value
 */
export function useDebounce<T>(value: T, delay: number = 500): T {
    const [debouncedValue, setDebouncedValue] = useState<T>(value);

    useEffect(() => {
        // Set a timer to update the debounced value after the delay
        const timer = setTimeout(() => {
            setDebouncedValue(value);
        }, delay);

        // Clean up the timer if the value changes before the delay finishes
        // (This is what resets the clock while the user is actively typing)
        return () => {
            clearTimeout(timer);
        };
    }, [value, delay]);

    return debouncedValue;
}