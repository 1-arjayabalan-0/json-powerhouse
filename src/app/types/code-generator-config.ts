// ============================================================================
// TypeScript Configuration
// ============================================================================
export type TypeScriptTypeKind = 'interface' | 'type';
export type TypeScriptRuntimeTypecheck = 'none' | 'io-ts' | 'zod';
export type AcronymStyle = 'camel' | 'pascal' | 'lowerCase' | 'upperCase' | 'original';

export interface TypeScriptConfig {
    typeKind: TypeScriptTypeKind;
    runtimeTypecheck: TypeScriptRuntimeTypecheck;
    readonlyProperties: boolean;
    explicitAny: boolean;
    nicePropertyNames: boolean;
    acronymStyle: AcronymStyle;
}

export const defaultTypeScriptConfig: TypeScriptConfig = {
    typeKind: 'interface',
    runtimeTypecheck: 'none',
    readonlyProperties: false,
    explicitAny: false,
    nicePropertyNames: true,
    acronymStyle: 'camel',
};

// ============================================================================
// Java Configuration
// ============================================================================
export type JavaArrayType = 'list' | 'array';

export interface JavaConfig {
    packageName: string;
    useGettersSetters: boolean;
    useOptional: boolean;
    useBigDecimal: boolean;
    arrayType: JavaArrayType;
    acronymStyle: AcronymStyle;
}

export const defaultJavaConfig: JavaConfig = {
    packageName: 'com.example',
    useGettersSetters: true,
    useOptional: true,
    useBigDecimal: false,
    arrayType: 'list',
    acronymStyle: 'pascal',
};

// ============================================================================
// Kotlin Configuration
// ============================================================================
export type KotlinFramework = 'none' | 'kotlinx' | 'jackson';

export interface KotlinConfig {
    packageName: string;
    framework: KotlinFramework;
    useDataClasses: boolean;
    useArrays: boolean;
    acronymStyle: AcronymStyle;
}

export const defaultKotlinConfig: KotlinConfig = {
    packageName: 'com.example',
    framework: 'kotlinx',
    useDataClasses: true,
    useArrays: false,
    acronymStyle: 'pascal',
};

// ============================================================================
// Dart Configuration
// ============================================================================
export interface DartConfig {
    useFreezed: boolean;
    useJsonSerializable: boolean;
    nullSafety: boolean;
    useNum: boolean;
    acronymStyle: AcronymStyle;
}

export const defaultDartConfig: DartConfig = {
    useFreezed: false,
    useJsonSerializable: true,
    nullSafety: true,
    useNum: true,
    acronymStyle: 'camel',
};

// ============================================================================
// Swift Configuration
// ============================================================================
export type SwiftTypeKind = 'struct' | 'class';
export type SwiftAccessLevel = 'public' | 'internal' | 'private';

export interface SwiftConfig {
    typeKind: SwiftTypeKind;
    useCodable: boolean;
    accessLevel: SwiftAccessLevel;
    useClassesForMutable: boolean;
    acronymStyle: AcronymStyle;
}

export const defaultSwiftConfig: SwiftConfig = {
    typeKind: 'struct',
    useCodable: true,
    accessLevel: 'public',
    useClassesForMutable: false,
    acronymStyle: 'camel',
};

// ============================================================================
// Go Configuration
// ============================================================================
export type GoFieldNaming = 'json' | 'original' | 'pascal' | 'camel';

export interface GoConfig {
    packageName: string;
    useOmitEmpty: boolean;
    fieldNaming: GoFieldNaming;
}

export const defaultGoConfig: GoConfig = {
    packageName: 'main',
    useOmitEmpty: true,
    fieldNaming: 'pascal',
};

// ============================================================================
// C# Configuration
// ============================================================================
export type CSharpFramework = 'SystemTextJson' | 'NewtonsoftJson' | 'none';
export type CSharpNumberType = 'double' | 'decimal';
export type CSharpArrayType = 'array' | 'list';
export type CSharpDensity = 'normal' | 'dense';

export interface CSharpConfig {
    namespace: string;
    framework: CSharpFramework;
    useProperties: boolean;
    numberType: CSharpNumberType;
    arrayType: CSharpArrayType;
    density: CSharpDensity;
    acronymStyle: AcronymStyle;
}

export const defaultCSharpConfig: CSharpConfig = {
    namespace: 'MyNamespace',
    framework: 'SystemTextJson',
    useProperties: true,
    numberType: 'double',
    arrayType: 'list',
    density: 'normal',
    acronymStyle: 'pascal',
};

// ============================================================================
// Python Configuration
// ============================================================================
export type PythonVersion = '3.6' | '3.7' | '3.8' | '3.9' | '3.10+';
export type PythonClassType = 'dataclasses' | 'attrs' | 'plain';

export interface PythonConfig {
    pythonVersion: PythonVersion;
    classType: PythonClassType;
    useTypeHints: boolean;
    nicePropertyNames: boolean;
}

export const defaultPythonConfig: PythonConfig = {
    pythonVersion: '3.10+',
    classType: 'dataclasses',
    useTypeHints: true,
    nicePropertyNames: true,
};

// ============================================================================
// Rust Configuration
// ============================================================================
export type RustVisibility = 'public' | 'crate' | 'private';
export type RustDensity = 'normal' | 'dense';

export interface RustConfig {
    deriveDebug: boolean;
    deriveClone: boolean;
    visibility: RustVisibility;
    density: RustDensity;
    useChronoForDates: boolean;
}

export const defaultRustConfig: RustConfig = {
    deriveDebug: true,
    deriveClone: true,
    visibility: 'public',
    density: 'normal',
    useChronoForDates: true,
};

// ============================================================================
// PHP Configuration
// ============================================================================
export interface PHPConfig {
    namespace: string;
    strictTypes: boolean;
    useGettersSetters: boolean;
    fastMode: boolean;
    acronymStyle: AcronymStyle;
}

export const defaultPHPConfig: PHPConfig = {
    namespace: 'App',
    strictTypes: true,
    useGettersSetters: true,
    fastMode: false,
    acronymStyle: 'pascal',
};

// ============================================================================
// Union Type for All Configs
// ============================================================================
export type CodeGeneratorConfig =
    | TypeScriptConfig
    | JavaConfig
    | KotlinConfig
    | DartConfig
    | SwiftConfig
    | GoConfig
    | CSharpConfig
    | PythonConfig
    | RustConfig
    | PHPConfig;
