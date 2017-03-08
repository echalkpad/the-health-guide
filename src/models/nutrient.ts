export interface INutrientDetails {
    actions: Array<string>;
    deficiencies: Array<string>;
    functions: Array<string>;
    name: string;
    partnership: Array<string>;
    references: Array<{ credit: string, url: string }>;
    recommendations: Array<string>;
    sources: Array<string>;
    summary: string;
    type: string;
    uses: Array<string>;
    warnings: Array<string>;
}