<a href="https://github.com/HotsEd/filament-sticky-actions" class="filament-hidden">
<img style="width: 100%; max-width: 100%;" alt="filament-sticky-actions-art" src="https://banners.beyondco.de/Filament%20Sticky%20Actions.png?theme=light&packageManager=composer+require&packageName=hotsed%2Ffilament-sticky-actions&pattern=architect&style=style_1&description=Keep+your+table+actions+visible+while+scrolling&md=1&showWatermark=0&fontSize=100px&images=https%3A%2F%2Flaravel.com%2Fimg%2Flogomark.min.svg" >
</a>

<p align="center" class="flex items-center justify-center">
    <a href="https://filamentphp.com/docs/4.x/panels/installation">
        <img alt="FILAMENT 4.x" src="https://img.shields.io/badge/FILAMENT-4.x-EBB304?style=for-the-badge">
    </a>
    <a href="https://packagist.org/packages/hotsed/filament-sticky-actions">
        <img alt="Packagist" src="https://img.shields.io/packagist/v/hotsed/filament-sticky-actions.svg?style=for-the-badge&logo=packagist">
    </a>
    <a href="https://packagist.org/packages/hotsed/filament-sticky-actions">
        <img alt="Downloads" src="https://img.shields.io/packagist/dt/hotsed/filament-sticky-actions.svg?style=for-the-badge">
    </a>
</p>

<h1 style="font-size:2em; font-weight:bold; display:block; margin:0.67em 0;">Sticky Actions</h1>

Keep your table actions visible while scrolling horizontally. Perfect for tables with many columns.

## Features

- 📌 **Sticky Actions Column** - Actions stay visible when scrolling horizontally
- 🎨 **Theme-Aware** - Automatically detects and uses your theme's colors
- 🌙 **Dark Mode Support** - Colors update when switching themes
- 📊 **Striped Rows Support** - Correctly handles alternating row colors
- 🔲 **Scroll Shadow** - Subtle shadow indicator when there's more content
- ⚡ **Zero Configuration** - Just call `->stickyActions()` and it works

<div class="filament-hidden">

## Compatibility

| Package Version | Filament Version |
|-----------------|------------------|
| 1.x             | 4.x              |

</div>

<div class="filament-hidden">
<b>Table of Contents</b>

- [Installation](#installation)
- [Usage](#usage)
- [How It Works](#how-it-works)
- [Requirements](#requirements)
- [License](#license)
</div>

# Installation

```bash
composer require hotsed/filament-sticky-actions
```

After installing, publish the assets:

```bash
php artisan filament:assets
```

# Usage

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
->stickyActions(condition: $shouldStick)
```

# How It Works

1. Adds a `stickyActions()` macro to Filament's Table class
2. When enabled, adds `data-sticky-actions` attribute to the table
3. CSS makes the actions column sticky with `position: sticky; right: 0`
4. JavaScript automatically detects background colors from your theme
5. Blends semi-transparent striped row colors correctly
6. Shadow indicator disappears when scrolled to the end

# Requirements

- PHP 8.1+
- Laravel 10+
- Filament 4.x

# License

MIT License. See [LICENSE](LICENSE) for more information.