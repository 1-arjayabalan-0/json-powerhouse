import type { ToolContent } from './types';

const content: ToolContent = {
    "updated": "2026-11-08",
    "intro": [
        "Generate a Prisma schema from JSON. Paste a JSON object or an array of objects and get Prisma models with field types, optional fields, an @id, and relations, ready to drop into schema.prisma.",
        "Nested objects become one-to-one relations and arrays of objects become one-to-many relations, each with a foreign key field, @relation and onDelete: Cascade. Prefer to keep nested data together? Switch the setting to Json fields instead.",
        "Choose PostgreSQL, MySQL or SQLite and the output adapts: @db.Uuid, @db.Date and @db.Timestamptz on PostgreSQL, scalar lists like String[] where they are supported, @db.Text for long MySQL strings, and text-based JSON on SQLite. Field names are camelCase, with @map and @@map keeping snake_case names in the database.",
        "Everything runs in your browser, so your sample data never leaves your machine."
    ],
    "features": [
        "Prisma models with Int, BigInt, Float, Boolean, String, DateTime and Json fields",
        "Optional fields (?) for keys that are missing or null in some records",
        "Reuses a unique id field as @id, or adds @id @default(autoincrement())",
        "One-to-one and one-to-many relations from nested objects and arrays",
        "Provider-aware native types for PostgreSQL, MySQL and SQLite",
        "camelCase fields with @map / @@map to snake_case database names",
        "Optional generator and datasource blocks",
        "100% client-side: nothing is uploaded"
    ],
    "howTo": [
        {
            "title": "Paste your JSON",
            "description": "Enter a JSON object or an array of objects that represents your data."
        },
        {
            "title": "Pick the database",
            "description": "Open Settings to choose PostgreSQL, MySQL or SQLite, name the root model, and choose related models or Json fields for nested data."
        },
        {
            "title": "Copy into schema.prisma",
            "description": "Copy or download the models, add them to your schema.prisma, then run prisma migrate dev or prisma db push."
        }
    ],
    "examples": [
        {
            "title": "Nested JSON to related Prisma models",
            "description": "PostgreSQL provider, root model named User, generator and datasource blocks turned off.",
            "input": "[\n  {\n    \"id\": 1,\n    \"name\": \"Ada\",\n    \"email\": \"ada@example.com\",\n    \"signedUpAt\": \"2026-01-02T10:00:00Z\",\n    \"address\": {\n      \"city\": \"London\"\n    },\n    \"orders\": [\n      {\n        \"sku\": \"A1\",\n        \"qty\": 2\n      }\n    ]\n  }\n]",
            "output": "model User {\n  id         Int      @id\n  name       String\n  email      String\n  signedUpAt DateTime @db.Timestamptz(3) @map(\"signed_up_at\")\n  address    Address?\n  orders     Order[]\n\n  @@map(\"user\")\n}\n\nmodel Address {\n  id     Int    @id @default(autoincrement())\n  userId Int    @unique @map(\"user_id\")\n  city   String\n  user   User   @relation(fields: [userId], references: [id], onDelete: Cascade)\n\n  @@map(\"address\")\n}\n\nmodel Order {\n  id     Int    @id @default(autoincrement())\n  userId Int    @map(\"user_id\")\n  sku    String\n  qty    Int\n  user   User   @relation(fields: [userId], references: [id], onDelete: Cascade)\n\n  @@map(\"orders\")\n}",
            "lang": "prisma"
        },
        {
            "title": "SQLite with Json fields",
            "description": "With nested data stored as Json fields on SQLite, values are kept as text.",
            "input": "[\n  {\n    \"id\": 1,\n    \"name\": \"Ada\",\n    \"email\": \"ada@example.com\",\n    \"signedUpAt\": \"2026-01-02T10:00:00Z\",\n    \"address\": {\n      \"city\": \"London\"\n    },\n    \"orders\": [\n      {\n        \"sku\": \"A1\",\n        \"qty\": 2\n      }\n    ]\n  }\n]",
            "output": "model User {\n  id         Int      @id\n  name       String\n  email      String\n  signedUpAt DateTime @map(\"signed_up_at\")\n  /// JSON stored as text\n  address    String\n  /// JSON stored as text\n  orders     String\n\n  @@map(\"user\")\n}",
            "lang": "prisma"
        }
    ],
    "faq": [
        {
            "question": "How do I generate a Prisma schema from JSON?",
            "answer": "Paste the JSON into the input editor. The tool infers a model for the root object and for each nested object or array of objects, with field types, optional fields and relations. Copy the result into schema.prisma."
        },
        {
            "question": "How are nested objects turned into relations?",
            "answer": "A nested object becomes a separate model with a @unique foreign key back to its parent (one-to-one). An array of objects becomes a model with a plain foreign key (one-to-many), and the parent gets a list field such as orders Order[]."
        },
        {
            "question": "Does it work with MySQL and SQLite?",
            "answer": "Yes. Pick the provider in Settings. Scalar lists such as String[] are only used on PostgreSQL. On MySQL lists become Json, and on SQLite JSON data is stored as String."
        },
        {
            "question": "Why are there @map and @@map attributes?",
            "answer": "Prisma fields are usually camelCase while database columns are often snake_case. @map and @@map keep both conventions. Turn the option off if you want the database to use the Prisma names directly."
        },
        {
            "question": "Which Prisma version is the output for?",
            "answer": "The models use standard Prisma schema syntax. In Prisma 7 and later the database URL is configured in prisma.config.ts rather than in the datasource block, as the generated comment notes."
        },
        {
            "question": "Is my data uploaded?",
            "answer": "No. The schema is generated entirely in your browser."
        }
    ],
    "related": [
        "json-to-postgresql",
        "json-to-mysql",
        "json-to-typescript",
        "json-to-json-schema"
    ]
};

export default content;
