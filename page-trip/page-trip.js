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
        this._data = null;
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
        this._getData(pageDom);
        this._app.setPageCss(css);
        this._app.setPageHeader(pageDom.querySelector("header"));

        console.log(pageDom.querySelector("#knopf"));
        pageDom.querySelector("#knopf").onclick(this._onTeilnahmeClicked());
        
    
    }

    /**
     * 
     * Funktion, die die benötigten Daten aus der Datenbank holt und in den DOM-Baum anhängt 
     * @param {*} pageDom der div-Container, der die Elemente beinhalten soll
     */
    _getData(pageDom) {
        let mainElement = pageDom.querySelector("main");
        let templateElement = pageDom.querySelector("#template-tile");
        let headerElement = pageDom.querySelector("#header-div");
        
        //Abfrage der benötigten Daten für das asugewählte Element, sowie einsetzen dieser an den vorgesehenen Stellen
        let Event = db.collection('Events').doc(this.activityId);
        Event.get().then(doc => {
            this._data = doc.data();
            let html = templateElement.innerHTML;
           
            html = html.replace("{DESCRIPTION}", this._data.description);


            document.getElementById("header-div").innerHTML = "<h1>"+this._data.name+"</h1>";
            //html = html.replace("{NAME}", this._data.description);

            mainElement.innerHTML += html;
            this._app.setPageContent(pageDom.querySelector("main"));
            this._app.setPageTitle("Trip: "+this._data.name)
        });
    }

    _onTeilnahmeClicked(){
        alert("echo");
    }
    



}

