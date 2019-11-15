"use strict";

/**
 * Klasse App: Steuert die Navigation innerhalb der Anwendung
 *
 * Diese Klasse ist sozusagen die Hauptklasse unserer Anwendung. Sie kümmert
 * sich darum, den richtigen Inhalt zu finden und einzublenden, den der
 * Anwender gerade sehen will, wobei der Inhalt selbst hierfür von anderen
 * Klassen bereitgestellt wird.
 */
class App {
    /**
     * Konstruktor. Im Parameter pages muss eine Liste mit den vorhandenen
     * Seiten der App übergeben werden. Die Liste muss folgendes Format haben:
     *
     *      [
     *          {
     *              url: "^/$"              // Regulärer Ausdruck zur URL
     *              klass: PageOverview     // Klasse zur Darstellung der Seite
     *          }, {
     *              url: "^/Details/(.*)$"  // Regulärer Ausdruck zur URL
     *              klass: PageDetails      // Klasse zur Darstellung der Seite
     *          },
     *          ...
     *      ]
     *
     * @param {String} title Anzuzeigender Name der App
     * @param {List} pages Definition der in der App verfügbaren Seiten
     */
    constructor(title, pages) {
        this._title = title;
        this._pages = pages;
        this._currentPageObject = null;
    }

    /**
     * Startmethode der App. Hier werden die Event Listener für das generelle
     * Funktionieren der App registriert. Diese Methode muss daher aus der
     * index.html heraus aufgerufen werden.
     */
    run() {
        // Globale Event Listener registrieren
        document.querySelector("header nav .go-back a").addEventListener("click", () => window.history.back());
        // Single Page Router starten und die erste Seite aufrufen
        window.addEventListener("hashchange", () => this._handleRouting());
        this._handleRouting();
    }


    /**
     * Router Methode
     * sorgt dafür, dass die richtige Seite geöffnet wird
     */
    _handleRouting() {
        let pageUrl = location.hash.slice(1);

        if (pageUrl.length === 0) {
            pageUrl = "/";
        }

        let matches = null;
        let page = this._pages.find(p => matches = pageUrl.match(p.url));

        if (!page) {
            console.error(`Keine Seite zur URL ${pageUrl} gefunden!`);
            return;
        }

        this._currentPageObject = new page.klass(this);
        this._currentPageObject.show(matches);
    }

    /**
     * setzt Titel der Seite und prüft ob es sich um die Startseite, oder eine Unterseite handelt um den bei Unterseiten den Link einzublenden
     *
     * @param {String} title   Anzuzeigender Titel der App-Seite
     * @param {Object} options Detailoptionen zur Steuerung der Anzeige
     */
    setPageTitle(title, options) {
        // Optionen auswerten
        options = options ? options : {};
        let isSubPage = options.isSubPage ? options.isSubPage : false;

        // Titel setzen
        document.querySelectorAll(".page-name").forEach(e => e.textContent = title);
        document.title = `${title} – ${this._title}`;

        // Entscheiden, ob der Zurückbutton angezeigt wird, oder nicht
        if (isSubPage) {
            document.querySelector("header nav .go-back").classList.remove("hidden");
            document.querySelector("header nav .dont-go-back").classList.add("hidden");
        } else {
            document.querySelector("header nav .go-back").classList.add("hidden");
            document.querySelector("header nav .dont-go-back").classList.remove("hidden");
        }
    }

    /**
     * Seitenspezifischen CSS-Code aktivieren. Diese Methode muss von den
     * Page-Klassen aufgerufen werden, um seitenspezifische Stylesheet-Regeln
     * zu aktivieren. Das Stylesheet muss hierfür als String übergeben werden.
     *
     * @param {String} css Seitenspezifischer CSS-Code
     */
    setPageCss(css) {
        document.querySelector("#page-css").innerHTML = css;
    }

    /**
    * Austauschen des Inhalts im Kopfbereich der App. Diese Methode muss
    * von den Page-Klassen aufgerufen werden, um etwas im Kopfbereich der
    * App anzuzeigen. Hierfür muss ein (ggf. dynamisch nachgeladenes)
    * HTML-Element mit dem anzuzeigenden Inhalt übergeben werden.
    *
    * BEACHTE: Nicht das HTML-Element selbst, sondern seine Kindelemente
    * werden in der App angezeigt. Somit werden Probleme vermieden, wenn
    * das nachgeladene Element selbst ein <header> oder <main> ist, für
    * dass in der app.css bereits globale Layoutoptionen definiert sind.
    *
     * @param {HTMLElement} element HTML-Element mit dem anzuzeigenden Inhalt
     */
    setPageHeader(element) {
        let container = document.querySelector("header > .content");
        container.innerHTML = "";

        if (!element) return;
        let len = element.childNodes.length;

        for (var i = 0; i < len; i++) {
            let child = element.childNodes[0];
            element.removeChild(child);
            container.appendChild(child);
        }
    }

    /**
     * Austauschen des Inhalts im Hauptbereich der App. Diese Methode muss
     * von den Page-Klassen aufgerufen werden, um etwas im Hauptbereich der
     * App anzuzeigen. Hierfür muss ein (ggf. dynamisch nachgeladenes)
     * HTML-Element mit dem anzuzeigenden Inhalt übergeben werden.
     *
     * BEACHTE: Nicht das HTML-Element selbst, sondern seine Kindelemente
     * werden in der App angezeigt. Somit werden Probleme vermieden, wenn
     * das nachgeladene Element selbst ein <header> oder <main> ist, für
     * dass in der app.css bereits globale Layoutoptionen definiert sind.
     *
     * @param {HTMLElement} element HTML-Element mit dem anzuzeigenden Inhalt
     */
    setPageContent(element) {
        let container = document.querySelector("#app-main-area");
        container.innerHTML = "";

        if (!element) return;
        let len = element.childNodes.length;

        for (var i = 0; i < len; i++) {
            let child = element.childNodes[0];
            element.removeChild(child);
            container.appendChild(child);
        }
    }


    

}
