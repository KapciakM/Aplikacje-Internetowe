<?php

/** @var \App\Model\AnimeList $animeList */
/** @var \App\Service\Router $router */

$title = "{$animeList->getName()} ({$animeList->getId()})";
$bodyClass = 'show';

ob_start(); ?>
    <h1><?= $animeList->getName() ?></h1>
    <label><b>Genre: </b></label>
    <article>
        <?= $animeList->getGenre();?>
    </article>
    <br>
    <label><b>Description:</b></label><br>
    <article>
        <?= $animeList->getDescription();?>
    </article>

    <ul class="action-list">
        <li> <a href="<?= $router->generatePath('anime-list-index') ?>">Back to list</a></li>
        <li><a href="<?= $router->generatePath('anime-list-edit', ['id'=> $animeList->getId()]) ?>">Edit</a></li>
    </ul>
<?php $main = ob_get_clean();

include __DIR__ . DIRECTORY_SEPARATOR . '..' . DIRECTORY_SEPARATOR . 'base.html.php';
