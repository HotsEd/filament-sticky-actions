# Filament Sticky Actions

A Filament v4 plugin that makes table action columns sticky when scrolling horizontally. Perfect for tables with many columns where the actions would otherwise be hidden.

## Installation

```bash
composer require hotsed/filament-sticky-actions
```

Publish the assets:

```bash
php artisan filament:assets
```

## Usage

Enable sticky actions on any table by calling `->stickyActions()`:

```php
use Filament\Tables\Table;

public function table(Table $table): Table
{
    return $table
        ->columns([
            // your columns...
        ])
        ->actions([
            // your actions...
        ])
        ->stickyActions(); // Enable sticky actions
}
```

You can also conditionally enable it:

```php
->stickyActions(condition: $this->hasManyColuumns)
```

## How It Works

The plugin:

1. Adds a `stickyActions()` macro to Filament's Table class
2. When called, adds `data-sticky-actions` attribute to the table
3. CSS makes the actions column sticky with `position: sticky; right: 0`
4. Inherits background colors from your theme (no hardcoded colors)
5. Adds a subtle shadow for visual separation
6. Supports dark mode automatically

## Requirements

- PHP 8.1+
- Filament v4.0+

## License

MIT License. See [LICENSE](LICENSE) for more information.