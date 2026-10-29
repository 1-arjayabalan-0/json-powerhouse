// ============================================================================
// TypeScript Configuration
// ============================================================================
export type TypeScriptTypeKind = 'interface' | 'type';
export type TypeScriptRuntimeTypecheck = 'none' | 'zod';
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
export type SwiftAccessLevel = 'public' | 'internal' | 'private' | 'open';

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
export interface GoConfig {
    packageName: string;
    useOmitEmpty: boolean;
}

export const defaultGoConfig: GoConfig = {
    packageName: 'main',
    useOmitEmpty: true,
};

// ============================================================================
// C# Configuration
// ============================================================================
export type CSharpFramework = 'SystemTextJson' | 'NewtonsoftJson' | 'none';
export type CSharpNumberType = 'double' | 'decimal';
export type CSharpArrayType = 'array' | 'list';
export type CSharpDensity = 'normal' | 'dense';
export type CSharpRecordType = 'class' | 'record' | 'struct';
export type CSharpAccessLevel = 'public' | 'internal';

export interface CSharpConfig {
    namespace: string;
    framework: CSharpFramework;
    recordType: CSharpRecordType;
    accessLevel: CSharpAccessLevel;
    numberType: CSharpNumberType;
    arrayType: CSharpArrayType;
    density: CSharpDensity;
}

export const defaultCSharpConfig: CSharpConfig = {
    namespace: 'MyNamespace',
    framework: 'SystemTextJson',
    recordType: 'class',
    accessLevel: 'public',
    numberType: 'double',
    arrayType: 'list',
    density: 'normal',
};

// ============================================================================
// Python Configuration
// ============================================================================
export type PythonClassType = 'dataclasses' | 'pydantic' | 'plain';

export interface PythonConfig {
    classType: PythonClassType;
    useTypeHints: boolean;
    nicePropertyNames: boolean;
}

export const defaultPythonConfig: PythonConfig = {
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
