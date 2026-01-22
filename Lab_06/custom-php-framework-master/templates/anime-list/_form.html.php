<?php
    /** @var $animeList ?\App\Model\AnimeList */
?>

<div class="form-group">
    <label for="name">Name</label>
    <input type="text" id="name" name="anime_list[name]" value="<?= $animeList ? $animeList->getName() : '' ?>">
</div>

<div class="form-group">
    <label for="genre">Genre</label>
    <textarea id="genre" name="anime_list[genre]"><?= $animeList? $animeList->getGenre() : '' ?></textarea>
</div>

<div class="form-group">
    <label for="description">Description</label>
    <textarea id="description" name="anime_list[description]"><?= $animeList? $animeList->getDescription() : '' ?></textarea>
</div>

<div class="form-group">
    <label></label>
    <input type="submit" value="Submit">
</div>
