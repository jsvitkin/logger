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
    format(entry, prettyPrint = false, replacer) {
        const finalReplacer = replacer || this.defaultReplacer.bind(this);
        return JSON.stringify(entry, finalReplacer, prettyPrint ? 2 : undefined);
    }
}
