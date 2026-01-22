<?php
require_once __DIR__ . DIRECTORY_SEPARATOR . '..' . DIRECTORY_SEPARATOR . 'autoload.php';

$config = new \App\Service\Config();

$templating = new \App\Service\Templating();
$router = new \App\Service\Router();

$action = $_REQUEST['action'] ?? null;
switch ($action) {
    case 'post-index':
    case null:
        $controller = new \App\Controller\PostController();
        $view = $controller->indexAction($templating, $router);
        break;
    case 'post-create':
        $controller = new \App\Controller\PostController();
        $view = $controller->createAction($_REQUEST['post'] ?? null, $templating, $router);
        break;
    case 'post-edit':
        if (! $_REQUEST['id']) {
            break;
        }
        $controller = new \App\Controller\PostController();
        $view = $controller->editAction($_REQUEST['id'], $_REQUEST['post'] ?? null, $templating, $router);
        break;
    case 'post-show':
        if (! $_REQUEST['id']) {
            break;
        }
        $controller = new \App\Controller\PostController();
        $view = $controller->showAction($_REQUEST['id'], $templating, $router);
        break;
    case 'post-delete':
        if (! $_REQUEST['id']) {
            break;
        }
        $controller = new \App\Controller\PostController();
        $view = $controller->deleteAction($_REQUEST['id'], $router);
        break;
    case 'anime-list-index':
        $controller = new \App\Controller\AnimeListController();
        $view = $controller->indexAction($templating, $router);
        break;
    case 'anime-list-create':
        $controller = new \App\Controller\AnimeListController();
        $view = $controller->createAction($_REQUEST['anime_list'] ?? null, $templating, $router);
        break;
    case 'anime-list-edit':
        if (! $_REQUEST['id']) {
            break;
        }
        $controller = new \App\Controller\AnimeListController();
        $view = $controller->editAction($_REQUEST['id'], $_REQUEST['anime_list'] ?? null, $templating, $router);
        break;
    case 'anime-list-show':
        if (! $_REQUEST['id']) {
            break;
        }
        $controller = new \App\Controller\AnimeListController();
        $view = $controller->showAction($_REQUEST['id'], $templating, $router);
        break;
    case 'anime-list-delete':
        if (! $_REQUEST['id']) {
            break;
        }
        $controller = new \App\Controller\AnimeListController();
        $view = $controller->deleteAction($_REQUEST['id'], $router);
        break;
    case 'info':
        $controller = new \App\Controller\InfoController();
        $view = $controller->infoAction();
        break;
    default:
        $view = 'Not found';
        break;
}

if ($view) {
    echo $view;
}
