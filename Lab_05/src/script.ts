const dostepneStyle: Record<string, string> = {
    'Styl Pierwszy': 'style-1.css',
    'Styl Drugi': 'style-2.css',
    'Styl Trzeci': 'style-3.css'
};
const STYLE_LINK_ID = 'dynamic-style-link';

function zmienStyl(sciezkaDoStylu: string): void {
    const headElement = document.head;

    // Usunięcie starego odwołania do stylu CSS
    const staryLink = document.getElementById(STYLE_LINK_ID);
    if (staryLink) {
        staryLink.remove();
    }

    // Dodanie nowego odwołania do stylu CSS
    const nowyLink = document.createElement('link');
    nowyLink.id = STYLE_LINK_ID; // Nadanie ID do późniejszego usunięcia
    nowyLink.setAttribute('rel', 'stylesheet');
    nowyLink.setAttribute('href', sciezkaDoStylu);

    headElement.appendChild(nowyLink);
}

const footer = document.querySelector("footer");

if (footer) {
    const linkArea = document.createElement('div');
    linkArea.className = 'style-links';

    // Iteracja po słowniku dostępnych stylów
    for (const nazwaStylu in dostepneStyle) {
        if (dostepneStyle.hasOwnProperty(nazwaStylu)) {
            const sciezka = dostepneStyle[nazwaStylu];

            // Tworzenie elementu DIV (link)
            const linkDiv = document.createElement('div');
            linkDiv.className = 'style';
            linkDiv.textContent = nazwaStylu;

            // Dodanie nasłuchu na kliknięcie
            linkDiv.addEventListener('click', () => {
                zmienStyl(sciezka);
            });

            linkArea.appendChild(linkDiv);
        }
    }

    footer.appendChild(linkArea);
}

const domyslnyStyl = dostepneStyle['Styl Pierwszy'];
if (domyslnyStyl) {
    zmienStyl(domyslnyStyl);
}