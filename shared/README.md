# NYCMG Shared Module

This is the shared module for the NYCMG (NYC Music Growth) platform, containing common code and utilities used across the mobile and web applications.

## Purpose

The shared module provides a single source of truth for:
- Constants and configuration
- Utility functions
- Shared types (when using TypeScript)
- Common components (when applicable)

## Installation

The shared module is automatically included as a local dependency in the mobile and web applications through the monorepo structure.

## Usage

### Constants
```javascript
import { BOROUGHS, GENRES, ROLE_TYPES } from 'nycmg-shared';
```

### Utility Functions
```javascript
import { formatCurrency, formatDate, capitalizeFirstLetter, truncateText } from 'nycmg-shared';
```

### API Configuration
```javascript
import { API_BASE_URL } from 'nycmg-shared';
```

## Structure

```
shared/
├── index.js          # Main entry point exporting all shared code
├── constants/        # Constant values and enums
├── utils/            # Utility functions
├── components/       # Shared React components
└── types/            # Shared TypeScript types (when using TypeScript)
```

## Development

### Adding New Constants
1. Add the constant to `index.js` or create a new file in `constants/`
2. Export the constant from `index.js`

### Adding New Utilities
1. Add the utility function to `index.js` or create a new file in `utils/`
2. Export the function from `index.js`

### Adding New Components
1. Create the component in `components/`
2. Export the component from `index.js`

## Versioning

The shared module is versioned together with the main application through Lerna.

## Contributing

When making changes to the shared module, ensure that:
1. Changes are backward compatible or properly versioned
2. All consuming applications still function correctly
3. Documentation is updated accordingly