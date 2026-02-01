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
->stickyActions(condition: $this->hasManyColumns)
```

## Features

- **Sticky actions column**: Keeps the actions visible when scrolling horizontally
- **Theme-aware**: Automatically detects and uses your theme's colors (works with any Filament theme)
- **Dark mode support**: Colors update automatically when switching between light and dark modes
- **Striped rows support**: Correctly handles alternating row colors
- **Scroll shadow**: Shows a subtle shadow indicator when there's more content to scroll
- **Zero configuration**: Just call `->stickyActions()` and it works

## How It Works

The plugin:

1. Adds a `stickyActions()` macro to Filament's Table class
2. When called, adds `data-sticky-actions` attribute to the table
3. CSS makes the actions column sticky with `position: sticky; right: 0`
4. JavaScript automatically detects background colors from your theme
5. Blends semi-transparent striped row colors correctly
6. Adds a shadow that disappears when scrolled to the end

## Requirements

- PHP 8.1+
- Filament v4.0+

## License

MIT License. See [LICENSE](LICENSE) for more information.