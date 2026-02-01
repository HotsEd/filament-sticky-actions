<?php

namespace Hotsed\StickyActions;

use Filament\Support\Assets\Css;
use Filament\Support\Facades\FilamentAsset;
use Filament\Tables\Table;
use Spatie\LaravelPackageTools\Package;
use Spatie\LaravelPackageTools\PackageServiceProvider;

class StickyActionsServiceProvider extends PackageServiceProvider
{
    public static string $name = 'filament-sticky-actions';

    public function configurePackage(Package $package): void
    {
        $package->name(static::$name);
    }

    public function packageBooted(): void
    {
        FilamentAsset::register([
            Css::make('filament-sticky-actions', __DIR__ . '/../resources/css/sticky-actions.css'),
        ], package: 'hotsed/filament-sticky-actions');

        Table::macro('stickyActions', function (bool $condition = true): Table {
            /** @var Table $this */
            if ($condition) {
                return $this->extraAttributes([
                    'data-sticky-actions' => true,
                ], merge: true);
            }

            return $this;
        });
    }
}
