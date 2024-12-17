export const TimestampToDate = (timestamp: string) => {
    return new Date(timestamp).toLocaleDateString("de-DE");
}