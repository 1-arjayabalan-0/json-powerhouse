"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.defaultPHPConfig = exports.defaultRustConfig = exports.defaultPythonConfig = exports.defaultCSharpConfig = exports.defaultGoConfig = exports.defaultSwiftConfig = exports.defaultDartConfig = exports.defaultKotlinConfig = exports.defaultJavaConfig = exports.defaultTypeScriptConfig = void 0;
exports.defaultTypeScriptConfig = {
    typeKind: 'interface',
    runtimeTypecheck: 'none',
    readonlyProperties: false,
    explicitAny: false,
    nicePropertyNames: true,
    acronymStyle: 'camel',
};
exports.defaultJavaConfig = {
    packageName: 'com.example',
    useGettersSetters: true,
    useOptional: true,
    useBigDecimal: false,
    arrayType: 'list',
    acronymStyle: 'pascal',
};
exports.defaultKotlinConfig = {
    packageName: 'com.example',
    framework: 'kotlinx',
    useDataClasses: true,
    useArrays: false,
    acronymStyle: 'pascal',
};
exports.defaultDartConfig = {
    useFreezed: false,
    useJsonSerializable: true,
    nullSafety: true,
    useNum: true,
    acronymStyle: 'camel',
};
exports.defaultSwiftConfig = {
    typeKind: 'struct',
    useCodable: true,
    accessLevel: 'public',
    useClassesForMutable: false,
    acronymStyle: 'camel',
};
exports.defaultGoConfig = {
    packageName: 'main',
    useOmitEmpty: true,
    fieldNaming: 'pascal',
};
exports.defaultCSharpConfig = {
    namespace: 'MyNamespace',
    framework: 'SystemTextJson',
    useProperties: true,
    recordType: 'class',
    accessLevel: 'public',
    nullable: true,
    systemTextJson: true,
    numberType: 'double',
    arrayType: 'list',
    density: 'normal',
    acronymStyle: 'pascal',
};
exports.defaultPythonConfig = {
    pythonVersion: '3.10+',
    classType: 'dataclasses',
    useTypeHints: true,
    nicePropertyNames: true,
};
exports.defaultRustConfig = {
    deriveDebug: true,
    deriveClone: true,
    visibility: 'public',
    density: 'normal',
    useChronoForDates: true,
};
exports.defaultPHPConfig = {
    namespace: 'App',
    strictTypes: true,
    useGettersSetters: true,
    fastMode: false,
    acronymStyle: 'pascal',
};
//# sourceMappingURL=code-generator-config.js.map