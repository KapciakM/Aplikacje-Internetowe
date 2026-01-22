<?php

/** @var \App\Model\AnimeList[] $animeList */
/** @var \App\Service\Router $router */

$title = 'Anime List';
$bodyClass = 'index';

ob_start(); ?>
    <h1>Anime List</h1>

    <a href="<?= $router->generatePath('anime-list-create') ?>">Create new</a>

    <ul class="index-list">
        <?php foreach ($animeList as $anime): ?>
            <li><h3><?= $anime->getName() ?></h3><h2><?= $anime->getGenre()?></h2>
                <ul class="action-list">
                    <li><a href="<?= $router->generatePath('anime-list-show', ['id' => $anime->getId()]) ?>">Details</a></li>
                    <li><a href="<?= $router->generatePath('anime-list-edit', ['id' => $anime->getId()]) ?>">Edit</a></li>
                </ul>
            </li>
        <?php endforeach; ?>
    </ul>

<?php $main = ob_get_clean();

include __DIR__ . DIRECTORY_SEPARATOR . '..' . DIRECTORY_SEPARATOR . 'base.html.php';
