"use strict";

/**
 * Klasse PageOverview: Stellt die Startseite der App zur Verfügung
 */
class PageOverview {
    /**
     * Konstruktor
     * @param {App} app Zentrale Instanz der App-Klasse
     */
    constructor(app) {
        this._app = app;
    }

    /**
     * Seite anzeigen. Wird von der App-Klasse aufgerufen.
     */
    async show() {
        // Anzuzeigenden Seiteninhalt nachladen
        let html = await fetch("page-overview/page-overview.html");
        let css = await fetch("page-overview/page-overview.css");

        if (html.ok && css.ok) {
            html = await html.text();
            css = await css.text();
        } else {
            console.error("Fehler beim Laden des HTML/CSS-Inhalts");
            return;
        }
        
        // Seite zur Anzeige bringen
        let pageDom = document.createElement("div");
        pageDom.innerHTML = html;

        this._render_activities(pageDom)

        this._app.setPageTitle("Startseite");
        this._app.setPageCss(css);
        this._app.setPageHeader(pageDom.querySelector("header"));
        
    }


    _render_activities(pageDom){
        let mainElement = pageDom.querySelector("main");
        let templateElement = pageDom.querySelector("#template-tile");

        const collection = db.collection('Events');
        
        let documents = [];

        // Iterate through all the Documents in the Collection
        collection.onSnapshot((querySnapshot) => {
            querySnapshot.forEach((doc) => {
                let data = doc.data();
                let html = templateElement.innerHTML;
                //Fill html template and add it to <main>
                html = html.replace("{HREF}", `#/Trip/${data.href}`);
                html = html.replace("{IMG}", data.img_path);
                html = html.replace("{NAME}", data.name);
                html = html.replace("{ALT}", data.description);
                let mainElement = pageDom.querySelector("main");
                mainElement.innerHTML += html;
                
            });
            this._app.setPageContent(pageDom.querySelector("main"));
        })
    }
       
    /**
     * Hilfsmethode, welche den HTML-Code zur Darstellung der Kacheln auf
     * der Startseite erzeugt.
     *
     * @param {HTMLElement} pageDom Wurzelelement der eingelesenen HTML-Datei
     * mit den HTML-Templates dieser Seite.
     */

}
