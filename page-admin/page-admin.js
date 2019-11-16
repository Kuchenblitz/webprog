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

        this._showEvents(pageDom);

        this._app.setPageTitle("Admin", {isSubPage:true});
        this._app.setPageCss(css);
        this._app.setPageHeader(pageDom.querySelector("header"));
        this._app.setPageContent(pageDom.querySelector("main"));

        document.body.style.background = "transparent";

        //Einfügen der Knöpfe zum bestätigen und verwerfen (Muss hier gemacht werden, da diese Knöpfe aufgrund des dynamischen Aufbaus ansonsten nicht gefunden werdem von getElementById())
        document.getElementById("reset_and_submit").innerHTML +=
        '<button type="reset" class="btn btn-primary">Reset</button>' +
        '<button type="submit" class="btn btn-primary" id="submit_button">Submit</button>'

        let submit_button = document.getElementById('submit_button')
        submit_button.addEventListener("click", this._send_form);

        /** aktiviert footer */
        document.querySelector("footer").style.display = 'block';
    }

    _send_form(){
        let form = document.getElementById("new_trip");
        db.collection("Events").doc(form.elements["trip_href"].value).set({
             name: form.elements["trip_name"].value,
             description: form.elements["trip_description"].value,
             href: form.elements["trip_href"].value,
             id: form.elements["trip_id"].value,
             img_path: form.elements["trip_img_path"].value,
             //aus irgendeinem Grund spackt es hier
             /*adventure: form.elements["trip_adventure"].value,
             relax: form.elements["trip_relax"].value,
             nature: form.elements["trip_nature"].value,
             difficulty: form.elements["trip_difficulty"].value,
             cost: form.elements["trip.cost"].value,*/
            })
            .then(function() {
                console.log("Document succesfully written!")
                window.location.replace("#");
                window.location.replace("#/Admin");
            })
            .catch(function(error) {
                alert("Error writing document: ", error);
            });
    }

    _showEvents(pageDom){
        let deletingElement = pageDom.querySelector("#deleting");
        const collection = db.collection('Events');
        let dataList = [];
        //Iterate through alle Documents in Collection
        collection.onSnapshot((querySnapshot) => {
            querySnapshot.forEach((doc) => {
                let data = doc.data();
                dataList.push(data);
                deletingElement.innerHTML +=
                    '<li class="list-group-item">' + data.name +
                    '<button type="button" class="btn btn-danger delete_btn">delete</button></li>';
            });
            this._createButtons(pageDom, dataList, collection);
        })
    }


    /**
     * Gibt jedem Löschen Knopf die funktionalität sein spezielles item zu löschen
     *
     * @param {*} pageDom
     * @param {*} dataList
     * @param {*} collection
     */
    _createButtons(pageDom, dataList, collection){
        let btns = document.getElementsByClassName("delete_btn");
        for(let i = 0; i < btns.length; i++){
            btns[i].addEventListener("click", function(){
                let eingabe = prompt("Um zu löschen, geben sie hier den Namen des Eintrags ein" +
                "\nVorsicht dies ist unwiderruflich!");
                if(eingabe == dataList[i].name){
                    collection.doc(dataList[i].href).delete().then(function(){
                        console.log("succesfully deleted item");
                    }).catch(function(error){
                        console.error("error deleting item");
                    });
                    alert("Item wurde gelöscht");
                }else{
                    alert("Item wird nicht gelöscht");
                }
                //Seite muss umständlich neu geladen werden, um seltsames Listenverhalten zu verhindern
                window.location.replace("#");
                window.location.replace("#/Admin");
            });
        }
    }
}
