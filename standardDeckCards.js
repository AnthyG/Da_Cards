[{
        "Type": "Bishop", // Typ/Name der Karte
        "CardLabel": "Bishop #1", // Label der Karte
        "CardCntnt": "The Bishop;", // Content der Karte (also in der Textbox)
        "HP": 2, // Health-Points der Karte
        "AlreadyUsed": false, // Ob die Karte (in dieser Runde) schon benutzt wurde
        "RoundsLeft": 3, // Wie viele Rotationen die Karte noch lebt
        "MP-S": 2, // Wie viel Mana zum Summonen aufgebraucht wird
        // "MP-A": SOLL DAT SEIN? KOSTEN FÜR NEN ANGRIFF!? (vlt bei ults oda so)
        "AP": 2, // Attack-Points der Karte
        "AT": "Physical", // Attack-Type, also "Magical" oder "Physical"
        "Effects": [
            // Die Effekte, die auf dieser Karte sind, ihre "RoundsLeft",
            // und was sie halt machn (abhängig vom Type).
            // Hier können auch schon davor Effekte drin stehen, z.B. "summoneffekte"
            {
                "Type": "Motivate 1", // Typ/Name des Effekts
                "Description": "Motivates the Cards left and right, which gives them +1AP", // Beschreibung des Effekts
                "RoundsLeft": 3 // Wie viele Rotationen der Effekt noch anhält
            }
        ],
        // "position": null, // The Position of the Card on Hand or on Field
        "CID": null
    },
    {
        "Type": "Bishop2", // Typ/Name der Karte
        "CardLabel": "Bishop #2", // Label der Karte
        "CardCntnt": "A better Bishop", // Content der Karte (also in der Textbox)
        "HP": 4, // Health-Points der Karte
        "AlreadyUsed": false, // Ob die Karte (in dieser Runde) schon benutzt wurde
        "RoundsLeft": 2, // Wie viele Rotationen die Karte noch lebt
        "MP-S": 3, // Wie viel Mana zum Summonen aufgebraucht wird
        // "MP-A": SOLL DAT SEIN? KOSTEN FÜR NEN ANGRIFF!? (vlt bei ults oda so)
        "AP": 3, // Attack-Points der Karte
        "AT": "Magical", // Attack-Type, also "Magical" oder "Physical"
        "Effects": [
            // Die Effekte, die auf dieser Karte sind, ihre "RoundsLeft",
            // und was sie halt machn (abhängig vom Type).
            // Hier können auch schon davor Effekte drin stehen, z.B. "summoneffekte"
            {
                "Type": "Motivate 2", // Typ/Name des Effekts
                "Description": "Motivates the Cards left and right, which gives them +2AP", // Beschreibung des Effekts
                "RoundsLeft": 3 // Wie viele Rotationen der Effekt noch anhält
            }
        ],
        // "position": null, // The Position of the Card on Hand or on Field
        "CID": null
    },
    {
        "Type": "Bishop3", // Typ/Name der Karte
        "CardLabel": "Bishop #3", // Label der Karte
        "CardCntnt": "The best Bishop.", // Content der Karte (also in der Textbox)
        "HP": 7, // Health-Points der Karte
        "AlreadyUsed": false, // Ob die Karte (in dieser Runde) schon benutzt wurde
        "RoundsLeft": 5, // Wie viele Rotationen die Karte noch lebt
        "MP-S": 8, // Wie viel Mana zum Summonen aufgebraucht wird
        // "MP-A": SOLL DAT SEIN? KOSTEN FÜR NEN ANGRIFF!? (vlt bei ults oda so)
        "AP": 4, // Attack-Points der Karte
        "AT": "Physical", // Attack-Type, also "Magical" oder "Physical"
        "Effects": [
            // Die Effekte, die auf dieser Karte sind, ihre "RoundsLeft",
            // und was sie halt machn (abhängig vom Type).
            // Hier können auch schon davor Effekte drin stehen, z.B. "summoneffekte"
            {
                "Type": "Motivate 3", // Typ/Name des Effekts
                "Description": "Motivates the Cards left and right, which gives them +4AP", // Beschreibung des Effekts
                "RoundsLeft": 3 // Wie viele Rotationen der Effekt noch anhält
            }
        ],
        // "position": null, // The Position of the Card on Hand or on Field
        "CID": null
    }
];