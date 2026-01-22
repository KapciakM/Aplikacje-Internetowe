<?php
namespace App\Controller;

use App\Exception\NotFoundException;
use App\Model\AnimeList;
use App\Service\Router;
use App\Service\Templating;

class AnimeListController
{
    public function indexAction(Templating $templating, Router $router): ?string
    {
        $animeList = AnimeList::getAll();
        $html = $templating->render('anime-list/index.html.php', [
            'animeList' => $animeList,
            'router' => $router,
        ]);
        return $html;
    }

    public function createAction(?array $requestAnimeList, Templating $templating, Router $router)
    {
        if($requestAnimeList){
            $animeList = AnimeList::fromArray($requestAnimeList);
            # walidacja
            $animeList->save();
            $path = $router->generatePath('anime-list-index');
            $router->redirect($path);
            return null;
        }else{
            $animeList = new AnimeList();
        }

        $html = $templating->render('anime-list/create.html.php', [
            'animeList' => $animeList,
            'router' => $router,
        ]);
        return $html;
    }

    public function editAction(int $animeListId, ?array $requestAnimeList, Templating $templating, Router $router): ?string
    {
        $animeList = AnimeList::get($animeListId);
        if(!$animeList){
            throw new NotFoundException("Missing animeList with id $animeListId");
        }

        if($requestAnimeList){
            $animeList->fill($requestAnimeList);
            $animeList->save();
            $path = $router->generatePath('anime-list-index');
            $router->redirect($path);
            return null;
        }
        $html = $templating->render('anime-list/edit.html.php', [
            'animeList' => $animeList,
            'router' => $router,
        ]);
        return $html;
    }

    public function showAction(int $animeListId, Templating $templating, Router $router): ?string
    {
        $animeList = AnimeList::get($animeListId);
        if(!$animeList){
            throw new NotFoundException("Missing animeList with id $animeListId");
        }

        $html = $templating->render('anime-list/show.html.php', [
            'animeList' => $animeList,
            'router' => $router,
        ]);
        return $html;
    }

    public function deleteAction(int $animeListId, Router $router): ?string
    {
        $animeList = AnimeList::get($animeListId);
        if(!$animeList){
            throw new NotFoundException("Missing animeList with id $animeListId");
        }

        $animeList->delete();
        $path = $router->generatePath('anime-list-index');
        $router->redirect($path);
        return null;
    }
}