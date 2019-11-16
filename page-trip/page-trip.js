"use strict";

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

    
    async show() {

        //Bestimmung der Id des anzuzeigenden Elements
        let pageUrl = window.location.href;
        let res = pageUrl.split("/");
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

    }
    
    /**
     * 
     * Funktion, die die benötigten Daten aus der Datenbank holt und in den DOM-Baum anhängt 
     * @param {*} pageDom der div-Container, der die Elemente beinhalten soll
     */
    _getData(pageDom) {
        let mainElement = pageDom.querySelector("main");
        let templateElement = pageDom.querySelector("#template-tile");
        
        //Abfrage der benötigten Daten für das asugewählte Element, sowie einsetzen dieser an den vorgesehenen Stellen
        let id = this.activityId;
        let Event = db.collection('Events').doc(id);
        Event.get().then(doc => {
            this._data = doc.data();
            let tempHtml = templateElement.innerHTML;
            
            tempHtml = tempHtml.replace("{DESCRIPTION}", this._data.description);
            tempHtml = tempHtml.replace("{KOSTEN}", this._data.cost != null ? this._data.cost : "unbekannt");
            if(this._data.tel != null){
                tempHtml = tempHtml.replace("{NUMMER}", this._data.tel);
            }else{
                tempHtml = tempHtml.replace("Für mehr Infos rufen sie {NUMMER} an", "");
            }

            tempHtml = tempHtml.replace("{ABENTEUER-RATING}", this._data.adventure != null ? this._data.adventure : "unbekannt");
            tempHtml = tempHtml.replace("{RELAX-RATING}", this._data.relax != null ? this._data.relax : "unbekannt");
            tempHtml = tempHtml.replace("{NATURE-RATING}", this._data.nature != null ? this._data.nature : "unbekannt");
            tempHtml = tempHtml.replace("{DANGER-RATING}", this._data.difficulty != null ? this._data.difficulty : "unbekannt");
            
            document.getElementById("header-div").innerHTML = "<h1>"+this._data.name+"</h1>";
            //tempHtml = tempHtml.replace("{NAME}", this._data.description);
            
            mainElement.innerHTML += tempHtml;
            this._app.setPageContent(pageDom.querySelector("main"));

            //teilnahme knopf einfügen (Muss hier gemacht werden, da aufgrund des dynamischen Aufbaus er ansonsten nicht gefunden wird von getElementById())
            document.getElementById("button_here").innerHTML += "<button id='teilnehmen_button' class='btn btn-green'>Klingt nach Spaß!</button>";
            document.getElementById("teilnehmen_button").addEventListener("click", function(){
                let teilnehmer = prompt("Please enter your name");
                if(teilnehmer != null){
                    db.collection("Teilnehmer").doc().set({
                        name: teilnehmer,
                        AktivitätsId: id,
                    })
                    .then(function() {
                        console.log("Document successfully written!");
                    })
                    .catch(function(error) {
                        console.error("Error writing document: ", error);
                    });
                }
            });
            this._app.setPageTitle("Trip: "+this._data.name, {isSubPage:true})
            
            //Hintergrund dem Event anpassen
            document.body.style.background = "url(" + this._data.img_path + ")";
            document.body.style.backgroundSize = "cover";
        });
    }
    



}

