<?php
namespace App\Model;

use App\Service\Config;

class AnimeList
{
    private ?int $id = null;
    private ?string $name = null;
    private ?string $genre = null;
    private ?string $description = null;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function setId(?int $id): AnimeList
    {
        $this->id = $id;
        return $this;
    }

    public function getName(): ?string
    {
        return $this->name;
    }

    public function setName(?string $name): AnimeList
    {
        $this->name = $name;
        return $this;
    }

    public function getGenre(): ?string
    {
        return $this->genre;
    }

    public function setGenre(?string $genre): AnimeList
    {
        $this->genre = $genre;
        return $this;
    }

    public function getDescription(): ?string
    {
        return $this->description;
    }

    public function setDescription(?string $description): AnimeList
    {
        $this->description = $description;
        return $this;
    }

    public static function fromArray($array): AnimeList
    {
        $animeList = new self();
        $animeList->fill($array);

        return $animeList;
    }

    public function fill($array): AnimeList
    {
        if(isset($array['id'])&&!$this->getId()) {
            $this->setId($array['id']);
        }
        if(isset($array['name'])) {
            $this->setName($array['name']);
        }
        if(isset($array['genre'])) {
            $this->setGenre($array['genre']);
        }
        if(isset($array['description'])) {
            $this->setDescription($array['description']);
        }
        return $this;
    }

    public static function getAll(): array
    {
        $pdo = new \PDO(Config::get('db_dsn'), Config::get('db_user'), Config::get('db_pass'));
        $sql = 'SELECT * FROM anime_list';
        $statement = $pdo->prepare($sql);
        $statement->execute();

        $animeLists = [];
        $animeListsArray = $statement->fetchAll(\PDO::FETCH_ASSOC);
        foreach ($animeListsArray as $animeListArray) {
            $animeLists[] = self::fromArray($animeListArray);
        }
        return $animeLists;
    }

    public static function get($id): ?AnimeList
    {
        $pdo = new \PDO(Config::get('db_dsn'), Config::get('db_user'), Config::get('db_pass'));
        $sql = 'SELECT * FROM anime_list where id = :id' ;
        $statement = $pdo->prepare($sql);
        $statement->execute(['id' => $id]);

        $animeListArray = $statement->fetch(\PDO::FETCH_ASSOC);
        if(!$animeListArray) {
            return null;
        }
        $animeList = AnimeList::fromArray($animeListArray);

        return $animeList;
    }

    public function save(): void
    {
        $pdo = new \PDO(Config::get('db_dsn'), Config::get('db_user'), Config::get('db_pass'));
        if (! $this->getId()) {
            $sql = "INSERT INTO anime_list (name, genre, description) VALUES (:name, :genre, :description)";
            $statement = $pdo->prepare($sql);
            $statement->execute([
                'name' => $this->getName(),
                'genre' => $this->getGenre(),
                'description' => $this->getDescription(),
            ]);

            $this->setId($pdo->lastInsertId());
        } else {
            $sql = "UPDATE anime_list SET name = :name, genre = :genre, description = :description WHERE id = :id";
            $statement = $pdo->prepare($sql);
            $statement->execute([
                ':name' => $this->getName(),
                ':genre' => $this->getGenre(),
                ':description' => $this->getDescription(),
                ':id' => $this->getId(),
            ]);
        }
    }

    public function delete(): void
    {
        $pdo = new \PDO(Config::get('db_dsn'), Config::get('db_user'), Config::get('db_pass'));
        $sql = "DELETE FROM anime_list WHERE id = :id";
        $statement = $pdo->prepare($sql);
        $statement->execute([
            ':id' => $this->getId(),
        ]);
        $this->setId(null);
        $this->setName(null);
        $this->setGenre(null);
        $this->setDescription(null);
    }
}