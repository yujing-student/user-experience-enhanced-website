// Selecteer alle bestelformulieren
let forms = document.querySelectorAll('form.inputfields')

// Loop door al die formulieren
forms.forEach(function(form) {

    // Luister naar het submit event
    form.addEventListener('submit', function(event) {

        // Het this object refereert hier naar het formulier zelf

        // Lees de data van het formulier in
        // https://developer.mozilla.org/en-US/docs/Web/API/FormData
        let data = new FormData(this)

        // Voeg een extra eigenschap aan de formulierdata toe
        // Deze gaan we server-side gebruiken om iets anders terug te sturen
        data.append('enhanced', true)

        // Waarschijnlijk wil je op deze plek ook een loading state
        // maken, maar daar gaan we volgende week mee aan de slag

        // Gebruik een client-side fetch om een POST te doen naar de server
        // Als URL gebruiken we this.action
        // https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API
        fetch(this.action, {

            // Als method gebruiken we this.method (waarschijnlijk POST)
            method: this.method,

            // Als body geven de data van het formulier mee (inclusief de extra eigenschap)
            // https://developer.mozilla.org/en-US/docs/Web/API/URLSearchParams
            body: new URLSearchParams(data)

        }).then(function(response) {
            // Als de server een antwoord geeft, krijgen we een stream terug
            // We willen hiervan de text gebruiken, wat in dit geval HTML teruggeeft
            return response.text()

        }).then(function(responseHTML) {
            // En de HTML kunnen we gebruiken om onze DOM aan te passen
            document.querySelector('.output_other_users').innerHTML = responseHTML




            // Een eventuele loading state haal je hier ook weer weg
        });

        // Als alles gelukt is, voorkom dan de submit van de browser zelf
        // Stel dat je hierboven een tikfout hebt gemaakt, of de browser ondersteunt
        // een bepaalde feature hierboven niet (bijvoorbeeld FormData), dan krijg je
        // een error en wordt de volgende regel nooit uitgevoerd. De browser valt dan
        // automatisch terug naar de standaard POST, wat prima is.
        event.preventDefault()
    })
})