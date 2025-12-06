<?php
    /** @var $post ?\App\Model\Post */
?>

<div class="form-group">
    <label for="name">Name</label>
    <input type="text" id="name" name="post[name]" value="<?= $post ? $post->getName() : '' ?>">
</div>

<div class="form-group">
    <label for="genre">Genre</label>
    <textarea id="genre" name="post[genre]"><?= $post? $post->getGenre() : '' ?></textarea>
</div>

<div class="form-group">
    <label for="description">Genre</label>
    <textarea id="description" name="post[description]"><?= $post? $post->getDescription() : '' ?></textarea>
</div>

<div class="form-group">
    <label></label>
    <input type="submit" value="Submit">
</div>
