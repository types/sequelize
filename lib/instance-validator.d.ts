export interface ValidationOptions {
    /**
     * An array of strings. All properties that are in this array will not be validated
     */
    skip?: string[]
    /**
     * An array of strings. Only the properties that are in this array will be validated
     */
    fields?: string[]
    /**
     * Run before and after validate hooks.
     * Defaults to true.
     */
    hooks?: boolean
}
