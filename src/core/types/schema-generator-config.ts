import type { NestedStrategy } from '@/core/lib/schema/relational';
import type { PrismaProvider } from '@/core/lib/schema/prisma';
import type { JsonSchemaOptions } from '@/core/lib/schema/json-schema';

export interface SqlSchemaConfig {
    tableName: string;
    nested: NestedStrategy;
    includeInserts: boolean;
    ifNotExists: boolean;
}

export const defaultSqlSchemaConfig: SqlSchemaConfig = {
    tableName: 'items',
    nested: 'tables',
    includeInserts: false,
    ifNotExists: true,
};

export interface PrismaSchemaConfig {
    modelName: string;
    provider: PrismaProvider;
    nested: NestedStrategy;
    mapNames: boolean;
    includeHeader: boolean;
}

export const defaultPrismaSchemaConfig: PrismaSchemaConfig = {
    modelName: 'Item',
    provider: 'postgresql',
    nested: 'tables',
    mapNames: true,
    includeHeader: true,
};

export type JsonSchemaConfig = JsonSchemaOptions;

export const defaultJsonSchemaConfig: JsonSchemaConfig = {
    draft: '2020-12',
    title: '',
    required: 'present',
    additionalProperties: true,
    detectFormats: true,
    mergeRootArray: true,
};
