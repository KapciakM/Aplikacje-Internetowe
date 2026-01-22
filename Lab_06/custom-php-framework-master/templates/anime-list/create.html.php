<?php

/** @var \App\Model\AnimeList $animeList */
/** @var \App\Service\Router $router */

$title = 'Create Post';
$bodyClass = "edit";

ob_start(); ?>
    <h1>Create Anime</h1>
    <form action="<?= $router->generatePath('anime-list-create') ?>" method="post" class="edit-form">
        <?php require __DIR__ . DIRECTORY_SEPARATOR . '_form.html.php'; ?>
        <input type="hidden" name="action" value="anime-list-create">
    </form>

    <a href="<?= $router->generatePath('anime-list-index') ?>">Back to list</a>
<?php $main = ob_get_clean();

include __DIR__ . DIRECTORY_SEPARATOR . '..' . DIRECTORY_SEPARATOR . 'base.html.php';
