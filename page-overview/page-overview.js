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

        this._render_activities(pageDom, html)

        this._app.setPageTitle("Startseite");
        this._app.setPageCss(css);
        this._app.setPageHeader(pageDom.querySelector("header"));
        
    }


    _render_activities(pageDom, html){
        let mainElement = pageDom.querySelector("main");
        console.log(mainElement);
        let templateElement = pageDom.querySelector("#template-tile");
        
        const app = firebase.app();

        const db = firebase.firestore();

        const collection = db.collection('Events');
        
        let documents = [];

        collection.onSnapshot((querySnapshot) => {
            querySnapshot.forEach((doc) => {
                let data = doc.data();
                let html = templateElement.innerHTML;
                html = html.replace("{HREF}", `#/Detail/${data.href}`);
                html = html.replace("{IMG}", data.img_path);
                html = html.replace("{NAME}", data.name);
                html = html.replace("{ALT}", data.description);
                mainElement.innerHTML += html;
                console.log(mainElement.innerHTML);
                
                this._app.setPageContent(pageDom.querySelector("main"));
            });
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
