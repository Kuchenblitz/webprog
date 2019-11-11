"use strict";

class Database {
    /**
     * Verbindung zur Firebase-Datenbank
     *
     */
    constructor() {
        // Diese Informationen müssen aus der Firebase-Konsole ermittelt
        // werden, indem dort ein neues Projekt mit einer neuen Datenbank
        // angelegt und diese dann mit einer neuen App verknüpft wird.
        firebase.initializeApp({
            apiKey: "AIzaSyBApPTt_9FubCAXAF9MwIs2JzUZ7T5o3Ow",
            authDomain: "freizeitverwaltung-554f8.firebaseapp.com",
            databaseURL: "https://freizeitverwaltung-554f8.firebaseio.com",
            projectId: "freizeitverwaltung-554f8",
            storageBucket: "freizeitverwaltung-554f8.appspot.com",
            messagingSenderId: "455334994107",
            appId: "1:455334994107:web:656046e1918b3671de499e"        
        });

        this._db = firebase.firestore();
        this._offers = this._db.collection("offers");
    }

    /**
     * Hilfsfunktion zum Anlegen von Demodaten. Die Daten werden nur angelegt,
     * wenn die Collection komplett leer ist.
     *
     * Beachte, dass das Auslesen aller Datensätze keine gute Idee ist, weil
     * Firebase für jedes abgerufene Dokument eine Gebühr verlangt, wenn man
     * keinen kostenlosten Account hat. Dummerweise gibt es aber keine einfache
     * Funktion zum Ermitteln der Anzahl Datensätze. Siehe:
     *
     * https://stackoverflow.com/questions/46554091/cloud-firestore-collection-count
     *
     * @returns Promise-Objekt zum Abfangen von Fehlern oder Warten auf Erfolg
     */
    async createDemoData() {
        let offers = await this.selectAllBooks();

        if (books.length < 1) {
            this.saveOffers([{
                "description": "Kletterspaß im Hohen Gras",
                "from": "11. November 2019 um 00:00:00 UTC+1",
                "to" : "12. November 2019 um 00:00:00 UTC+1",
                "img_path": "../img/climbing",
                "name": "klettern",
                "participants": "8",
                "price": "250"
            }, {
                "description": "Kletterspaß mit Gas",
                "from": "11. November 2019 um 00:00:00 UTC+1",
                "to" : "12. November 2019 um 00:00:00 UTC+1",
                "img_path": "../img/climbing",
                "name": "klettern2",
                "participants": "10",
                "price": "200"
            }, {
                "description": "Kletterspaß im Hohen Gras",
                "from": "11. November 2019 um 00:00:00 UTC+1",
                "to" : "12. November 2019 um 00:00:00 UTC+1",
                "img_path": "../img/climbing",
                "name": "klettern",
                "participants": "8",
                "price": "50"
            }, {
                "description": "Kletterspaß auf Gras",
                "from": "11. November 2019 um 00:00:00 UTC+1",
                "to" : "12. November 2019 um 00:00:00 UTC+1",
                "img_path": "../img/climbing",
                "name": "klettern3",
                "participants": "12",
                "price": "25"
            }, {
                "description": "Klettern mit Gras",
                "from": "11. November 2019 um 00:00:00 UTC+1",
                "to" : "12. November 2019 um 00:00:00 UTC+1",
                "img_path": "../img/climbing",
                "name": "klettern4",
                "participants": "44",
                "price": "20"
            }, {
                "description": "Grasklettern ohne brettern",
                "from": "11. November 2019 um 00:00:00 UTC+1",
                "to" : "12. November 2019 um 00:00:00 UTC+1",
                "img_path": "../img/climbing",
                "name": "klettern5",
                "participants": "8",
                "price": "250"
            }]);
        }
    }
    /**
     * Gibt alle in der Datenbank gespeicherten Angebote zurück. 
     *
     * @returns Promise-Objekt mit den gespeicherten Angeboten
     */
    async selectAllOffers() {
        let result = await this._offers.orderBy("name").get();
        let offers = [];

        result.forEach(entry => {
            let offer = entry.data();
            offers.push(offer);
        });

        return offers;
    }

    /**
     * Gibt ein einzelnes Angebot anhand seiner ID zurück.
     * @param id: ID des gesuchten Buches
     * @returns Promise-Objekt mit dem gesuchten Buch
     */
    async selectOffersById(id) {
        let result = await this._offers.doc(id).get();
        return result.data();
    }

    /**
     * Speichert ein einzelnes Buch in der Datenbank. Das hierfür übergebene
     * Objekt sollte folgenden Aufbau haben:
     *
     *      {
     *          description:    "Beschreibung des Angebots",
     *          from:           "Startdatum",
     *          to:             "Enddatum",
     *          img_path:       "Pfad des Bilds",
     *          name:           "Name des Angebots",
     *          participants:   "Anzahl der Teilnehmer",
     *          price:          "Der Preis",
     *      }
     *
     * @param offer: Zu speicherndes Buch-Objekt
     */
    saveOffer(offer) {
        this._offers.doc(book.id).set(offer);
    }

    /**
     * Löscht ein einzelnes Angebot aus der Datenbank.
     * @param id: ID des zu löschenden Buches
     * @returns Promise-Objekt zum Abfangen von Fehlern oder Warten auf Erfolg
     */
    async deleteOfferById(id) {
        return this._offers.doc(id).delete();
    }

    /**
     * Speichert die übergebenen Bücher in der Datenbank. Die hier übergebene
     * Liste sollte folgenden Aufbau haben:
     *
     *      [
     *          {
     *          description:    "Beschreibung des Angebots",
     *          from:           "Startdatum",
     *          to:             "Enddatum",
     *          img_path:       "Pfad des Bilds",
     *          name:           "Name des Angebots",
     *          participants:   "Anzahl der Teilnehmer",
     *          price:          "Der Preis",
     *          }, {
     *              ...
     *          },
     *     ]
     *
     * @param offers: Liste mit den zu speichernden Objekten
     * @returns Promise-Objekt zum Abfangen von Fehlern oder Warten auf Erfolg
     */
    async saveBooks(offers) {
        let batch = this._db.batch();

        offers.forEach(book => {
            let dbOffer = this._offers.doc(offer.id);
            batch.set(dbOffer, offer);
        });

        return batch.commit();
    }

    /**
     * Löscht eines oder mehrerer Bücher aus der Datenbank.
     * @param ids: Liste der IDs der zu löschenden Bücher
     * @returns Promise-Objekt zum Abfangen von Fehlern oder Warten auf Erfolg
     */
    async deleteOffersById(ids) {
        let batch = this._db.batch();

        ids.forEach(id => {
            let dbOffer = this._offers.doc(id);
            batch.delete(dbOffer);
        });

        return batch.commit();
    }
}
