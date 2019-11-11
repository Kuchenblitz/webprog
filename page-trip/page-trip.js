"use strict";

/**
 * Klasse Pagetrip: Stellt die Startseite der App zur Verfügung
 */
class PageTrip {
    /**
     * Konstruktor
     * @param {App} app Zentrale Instanz der App-Klasse
     */
    constructor(app) {
        this._app = app;
        this.activityId = -1;
        this.data = null;
    }


    async show(matches) {

        //Bestimmung der Id des anzuzeigenden Elements
        let url = window.location.href;
        let res = url.split("/");
        this.activityId = res[res.length-1];

        // Anzuzeigenden Seiteninhalt nachladen
        let html = await fetch("page-trip/page-trip.html");
        let css = await fetch("page-trip/page-trip.css");

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

        this._renderActivity(pageDom);

        this._app.setPageTitle("Startseite");
        this._app.setPageCss(css);
        this._app.setPageHeader(pageDom.querySelector("header"));
        this._app.setPageContent(pageDom.querySelector("main"));
    }

    /**
     * Hilfsmethode, welche den HTML-Code zur Darstellung der Kacheln auf
     * der Startseite erzeugt.
     *
     * @param {HTMLElement} pageDom Wurzelelement der eingelesenen HTML-Datei
     * mit den HTML-Templates dieser Seite.
     */
    _renderActivity(pageDom) {
        let mainElement = pageDom.querySelector("main");
        let templateElement = pageDom.querySelector("#template-tile");

        const db = firebase.firestore();
        const Events = db.collection('Events');
        let Event = Events.doc(this.activityId);
        Event.get().then(doc => {
            let data = doc.data();
        });
        let html = templateElement.innerHTML;
        html.replace("{TEST}", this.data.description);
    }
}