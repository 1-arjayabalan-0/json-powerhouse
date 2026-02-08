/**
 * Comprehensive JSON Sample with various data types and nested structures.
 */
export const COMPLEX_JSON_SAMPLE = {
    "id": "powerhouse-sample-001",
    "type": "comprehensive_test",
    "active": true,
    "score": 98.5,
    "last_updated": "2026-01-27T23:30:00Z",
    "metadata": null,
    "tags": ["developer", "json", "sample", "multitool"],
    "author": {
        "name": "Arjay",
        "role": "Lead Architect",
        "skills": ["TypeScript", "React", "Next.js", "AST Parsing"],
        "contact": {
            "email": "dev@jsonpowerhouse.com",
            "website": "https://jsonpowerhouse.com"
        }
    },
    "stats": [
        { "year": 2024, "usage": 4500, "efficiency": 0.82 },
        { "year": 2025, "usage": 12000, "efficiency": 0.95 },
        { "year": 2026, "usage": 35000, "efficiency": 0.99 }
    ],
    "config": {
        "engine": {
            "name": "Semantic AST Diff",
            "version": "2.8.5",
            "flags": {
                "experimental": false,
                "strict": true,
                "logging": "verbose"
            }
        },
        "ui": {
            "theme": "dark-premium",
            "animations": "fluid",
            "layout": "three-column-semantic"
        }
    },
    "raw_data": "Some multi-line\nstring with \"quotes\" and \ttabs\t and \u2728 emojis \u2728",
    "complex_array": [
        [1, 2, 3],
        { "nested": "object_in_array" },
        null,
        "mixed_types_allowed"
    ]
};

/**
 * Samples for the JSON Diff tool
 */
export const DIFF_SAMPLES = {
    baseline: {
        "project": "PulseTools",
        "version": "1.0.0",
        "author": "Arjay",
        "enabled": true,
        "features": ["formatting", "validation", "minification"],
        "settings": {
            "theme": "light",
            "fontSize": 12,
            "autosave": true
        },
        "statistics": {
            "total_users": 100,
            "active_now": 5
        }
    },
    modified: {
        "project": "JSON Powerhouse",
        "version": "2.8.0",
        "author": "Arjay",
        "enabled": true,
        "features": ["formatting", "validation", "minification", "semantic-diff", "merger"],
        "settings": {
            "theme": "dark-premium",
            "fontSize": 14,
            "autosave": true,
            "animations": "enabled"
        },
        "statistics": {
            "total_users": 1500,
            "active_now": 42,
            "conversion_rate": 0.15
        },
        "new_metadata": {
            "engine": "AST-v2"
        }
    }
};
