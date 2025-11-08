let map = L.map('leafletMap').setView([53.430127, 14.564802], 18);
L.tileLayer.provider('Esri.WorldImagery').addTo(map);

Notification.requestPermission()
if (!("Notification" in window)) {
    console.error("Ta przeglądarka nie obsługuje powiadomień systemowych.");
}

document.getElementById("saveButton").addEventListener("click", function() {


    leafletImage(map, function (err, canvas) {
        // here we have the canvas
        let rasterMap = document.getElementById("rasterMap");
        let rasterContext = rasterMap.getContext("2d");

        const TARGET_WIDTH = 600;
        const TARGET_HEIGHT = 300;

        rasterMap.width = TARGET_WIDTH;
        rasterMap.height = TARGET_HEIGHT;

        rasterContext.drawImage(canvas, 0, 0, TARGET_WIDTH, TARGET_HEIGHT);

        const tableDiv = document.getElementById("table");
        tableDiv.innerHTML = "";
        const totalWidth = canvas.width;
        const totalHeight = canvas.height;
        const singlePieceWidth = totalWidth / 4;
        const singlePieceHeight = totalHeight / 4;
        let resultado = [];
        for(let i = 0; i < 4; i++) {
            for(let j = 0; j < 4; j++) {
                let piece = document.createElement("canvas");
                piece.width = singlePieceWidth;
                piece.height = singlePieceHeight;
                let pieceContext = piece.getContext("2d");

                let sx = j * singlePieceWidth;
                let sy = i * singlePieceHeight;
                pieceContext.drawImage(
                    canvas,
                    sx, sy,
                    singlePieceWidth,
                    singlePieceHeight,
                    0, 0,
                    singlePieceWidth,
                    singlePieceHeight
                );
                let pieceImage = piece.toDataURL("image/png");
                let pieceDiv = document.createElement("div");
                const randomRotation = Math.random() * 10-5;
                pieceDiv.style.transform = `rotate(${randomRotation}deg)`;
                pieceDiv.className = "piece draggable";
                pieceDiv.id = "piece" + i + j;
                pieceDiv.draggable = true;
                pieceDiv.style.backgroundImage = "url(" + pieceImage + ")";
                pieceDiv.style.width = `${singlePieceWidth}px`;
                pieceDiv.style.height = `${singlePieceHeight}px`;
                pieceDiv.dataset.correctPos = `${i}-${j}`;
                resultado.push(pieceDiv);
            }
        }
        shuffle(resultado);
        resultado.forEach(piece => {
            tableDiv.appendChild(piece);
        });
        let items = document.querySelectorAll(".draggable");
        for(let item of items) {
            item.addEventListener("dragstart", function(event) {
                this.style.border = "2px dotted #00c6af05";
                event.dataTransfer.setData("text/plain", this.id);
            });

            item.addEventListener("dragend", function(event) {
                this.style.borderWidth = "0";
            });
        }

        createDropTargets("solved", 4);

        let targets = document.querySelectorAll(".drag-target");
        for (let target of targets) {
            addDropEvents(target);
        }
    });

});

document.getElementById("getLocation").addEventListener("click", function(event) {
    if (! navigator.geolocation) {
        console.log("No geolocation.");
    }

    navigator.geolocation.getCurrentPosition(position => {
        console.log(position);
        let lat = position.coords.latitude;
        let lon = position.coords.longitude;

        let markedPosition = L.marker([lat, lon]).addTo(map);
        markedPosition.bindPopup("Hello! <br> your location is: <br>"+lat + ", " + lon);

        map.setView([lat, lon]);
    }, positionError => {
        console.error(positionError);
    });
});

function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

function createDropTargets(containerId, piecesPerSide) {
    const container = document.getElementById(containerId);
    container.innerHTML = '';

    for (let i = 0; i < piecesPerSide; i++) {
        for (let j = 0; j < piecesPerSide; j++) {
            const targetDiv = document.createElement('div');
            targetDiv.className = 'drag-target';
            targetDiv.dataset.currentPos = `${i}-${j}`;
            targetDiv.id = `target-${i}-${j}`;

            container.appendChild(targetDiv);
        }
    }
}

function addDropEvents(target){
    target.addEventListener("dragover", function(event) {
        event.preventDefault();
    });
    target.addEventListener("drop", function(event) {
        event.preventDefault();
        let myElement = document.querySelector("#" + event.dataTransfer.getData('text/plain'));
        if(myElement.parentElement.className == this.className && this.children[0] !== undefined) {
            myElement.parentElement.appendChild(this.children[0]);
            this.appendChild(myElement);
        }else if(this.innerHTML !== ""){
            return;
        }
        this.appendChild(myElement);
        myElement.style.transform = "none";
        const targetContainer = event.currentTarget;
        checkSolved();

    })
}

function checkSolved() {
    const targets = document.querySelectorAll("#solved .drag-target");
    const totalPieces = 16;
    let currentP = 0;

    for(let target of targets) {
        if(target.children.length === 0) {
            continue;
        }
        const piece = target.children[0];

        let targetPos = target.dataset.currentPos;
        const pieceCorrectPos = piece.dataset.correctPos;

        if(targetPos === pieceCorrectPos) {
            currentP++;
        }
    }
    console.log("aktualny stan: "+currentP+" / "+totalPieces);
    if(currentP === totalPieces) {
        console.log("Wszystkie puzle na swoich miejscach! Wyświetlam powiadomienie");
        wyswietlPowiadomienieWygranej();
        return true;
    }
    return false;
}

function wyswietlPowiadomienieWygranej() {
    if (Notification.permission === "granted") {
        const tytul = "🏆 Wygrana w Puzzle!";
        const opcje = {
            body: "Gratulacje! Mapa została ułożona prawidłowo.",
            icon: 'https://cdn-icons-png.flaticon.com/512/2874/2874744.png', // Zmień na własną ikonę!
            tag: 'puzzle-wygrana', // Zapobiegnie wyświetlaniu wielu powiadomień jednocześnie
            renotify: true
        };
        new Notification(tytul, opcje);
    }else{
        alert("Brawo! Udało ci się ułożyć puzzle!");
    }
}
