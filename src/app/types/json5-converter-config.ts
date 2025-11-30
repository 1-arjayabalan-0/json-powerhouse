export type JSON5ConverterConfig = {
    useJSON5: boolean;
    quoteStyle: 'double' | 'single';
    trailingCommas: boolean;
    stripComments: boolean;
    indentation: '2' | '4' | 'tab';
    unquotedKeys: boolean;
};

export const defaultJSON5Config: JSON5ConverterConfig = {
    useJSON5: true,
    quoteStyle: 'single',
    trailingCommas: true,
    stripComments: false,
    indentation: '2',
    unquotedKeys: true,
};
