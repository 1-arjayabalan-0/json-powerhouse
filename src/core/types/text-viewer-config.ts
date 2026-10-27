export interface TextViewerConfig {
    textThreshold: number;
    forceTextFields: string[];
    excludeTextFields: string[];
    markdownMode: boolean;
    collapsedMaxHeight: boolean;
}

export const defaultTextViewerConfig: TextViewerConfig = {
    textThreshold: 80,
    forceTextFields: [],
    excludeTextFields: [],
    markdownMode: false,
    collapsedMaxHeight: true,
};
