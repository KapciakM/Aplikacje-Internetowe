<?php

/** @var \App\Model\AnimeList $animeList */
/** @var \App\Service\Router $router */

$title = "Edit Post {$animeList->getName()} ({$animeList->getId()})";
$bodyClass = "edit";

ob_start(); ?>
    <h1><?= $title ?></h1>
    <form action="<?= $router->generatePath('anime-list-edit') ?>" method="post" class="edit-form">
        <?php require __DIR__ . DIRECTORY_SEPARATOR . '_form.html.php'; ?>
        <input type="hidden" name="action" value="anime-list-edit">
        <input type="hidden" name="id" value="<?= $animeList->getId() ?>">
    </form>

    <ul class="action-list">
        <li>
            <a href="<?= $router->generatePath('anime-list-index') ?>">Back to list</a></li>
        <li>
            <form action="<?= $router->generatePath('anime-list-delete') ?>" method="post">
                <input type="submit" value="Delete" onclick="return confirm('Are you sure?')">
                <input type="hidden" name="action" value="anime-list-delete">
                <input type="hidden" name="id" value="<?= $animeList->getId() ?>">
            </form>
        </li>
    </ul>

<?php $main = ob_get_clean();

include __DIR__ . DIRECTORY_SEPARATOR . '..' . DIRECTORY_SEPARATOR . 'base.html.php';
