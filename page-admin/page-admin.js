"use strict";

class PageAdmin {
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
        let html = await fetch("page-admin/page-admin.html");
        let css = await fetch("page-admin/page-admin.css");
        

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

        this._app.setPageTitle("Startseite");
        this._app.setPageCss(css);
        this._app.setPageHeader(pageDom.querySelector("header"));
        this._app.setPageContent(pageDom.querySelector("main"));
        
        
        let submit_button = document.getElementById('submit_button')
        submit_button.addEventListener("click", this._send_form);
    }

    _send_form(){
        let form = document.getElementById("new_trip");
        alert("Please wait a second");
        db.collection("Events").doc(form.elements["trip_href"].value).set({
             name: form.elements["trip_name"].value,
             description: form.elements["trip_description"].value,
             href: form.elements["trip_href"].value,
             id: form.elements["trip_id"].value,
             img_path: form.elements["trip_img_path"].value
            })
            .then(function() {
                alert("Document successfully written!");
            })
            .catch(function(error) {
                alert("Error writing document: ", error);
            });
    }
    
    
       
    /**
     * Hilfsmethode, welche den HTML-Code zur Darstellung der Kacheln auf
     * der Startseite erzeugt.
     *
     * @param {HTMLElement} pageDom Wurzelelement der eingelesenen HTML-Datei
     * mit den HTML-Templates dieser Seite.
     */

}
