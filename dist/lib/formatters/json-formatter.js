export class JsonFormatter {
    defaultReplacer(_key, value) {
        if (value instanceof RegExp) {
            return value.toString();
        }
        if (value instanceof Error) {
            return {
                message: value.message,
                name: value.name,
                stack: value.stack,
            };
        }
        return value;
    }
    /**
     * Format a log entry into a JSON string.
     *
     * @param entry the log entry to format
     * @param prettyPrint whether to pretty-print the JSON string
     * @param replacer a replacer function to use when stringifying the object
     * @returns a JSON string representation of the log entry
     */
    format(entry, prettyPrint = false, replacer) {
        const finalReplacer = replacer || this.defaultReplacer.bind(this);
        return JSON.stringify(entry, finalReplacer, prettyPrint ? 2 : undefined);
    }
}
