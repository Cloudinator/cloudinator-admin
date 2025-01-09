export function parseTimeSince(timeSince: string): number {
    const [value, unit] = timeSince.split(' ');
    const numericValue = parseInt(value, 10);

    if (unit === 'hr') {
        return numericValue;
    } else {
        // If the unit is not 'hr', you might want to handle it differently
        // For now, we'll just return the numeric value
        return numericValue;
    }
}

