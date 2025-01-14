export function parseTimeSince(timeSince: string): string {
    const [value, unit] = timeSince.split(' ');
    const numericValue = parseInt(value, 10);

    if (isNaN(numericValue)) {
        return "Just now"; // Handle invalid numeric values
    }

    switch (unit) {
        case 'sec':
        case 'secs':
            return `${numericValue} sec ago`;
        case 'min':
        case 'mins':
            return `${numericValue} min ago`;
        case 'hr':
        case 'hrs':
            return `${numericValue} hr ago`;
        case 'day':
        case 'days':
            return `${numericValue} day ago`;
        default:
            return timeSince; // Return the original string if the unit is unknown
    }
}