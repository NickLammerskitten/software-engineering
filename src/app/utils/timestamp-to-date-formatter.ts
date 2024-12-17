export const timestampToDate = (timestamp: string) => {
    return new Date(timestamp).toLocaleDateString("de-DE");
}
