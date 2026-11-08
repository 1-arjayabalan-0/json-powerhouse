"use client"

import { useState, useCallback } from "react";
import { useConfig } from "@/app/context/ConfigContext";
import CodeGeneratorBase from "@/app/components/CodeGeneratorBase";
import { usePersistentState } from "@/app/hooks/usePersistentState";
import { generateSqlSchema, type SqlDialect } from "@/core/lib/schema/sql";
import { generatePrismaSchema } from "@/core/lib/schema/prisma";
import { generateJsonSchema } from "@/core/lib/schema/json-schema";
import type { JsonSchemaConfig, PrismaSchemaConfig, SqlSchemaConfig } from "@/core/types/schema-generator-config";

export type SchemaTarget = SqlDialect | 'prisma' | 'json-schema';

const META: Record<SchemaTarget, { language: string; name: string; ext: string; comment: string }> = {
    postgresql: { language: 'pgsql', name: 'PostgreSQL', ext: 'sql', comment: '--' },
    mysql: { language: 'mysql', name: 'MySQL', ext: 'sql', comment: '--' },
    sqlite: { language: 'sql', name: 'SQLite', ext: 'sql', comment: '--' },
    prisma: { language: 'plaintext', name: 'Prisma', ext: 'prisma', comment: '//' },
    'json-schema': { language: 'json', name: 'JSON Schema', ext: 'json', comment: '//' },
};

export default function SchemaGeneratorClient({ target }: { target: SchemaTarget }) {
    const { config } = useConfig();
    const [input, setInput] = usePersistentState("json-powerhouse-input", "");
    const [output, setOutput] = useState("");
    const meta = META[target];

    const generate = useCallback(async (json: string) => {
        try {
            if (target === 'prisma') return generatePrismaSchema(json, config as PrismaSchemaConfig);
            if (target === 'json-schema') return generateJsonSchema(json, config as JsonSchemaConfig);
            return generateSqlSchema(json, { ...(config as SqlSchemaConfig), dialect: target });
        } catch (e) {
            return `${meta.comment} ${e instanceof Error ? e.message : String(e)}`;
        }
    }, [config, target, meta.comment]);

    return (
        <CodeGeneratorBase language={meta.language} languageDisplayName={meta.name} fileExtension={meta.ext}
            input={input} setInput={setInput} output={output} setOutput={setOutput} generateCode={generate} />
    );
}
