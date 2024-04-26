// Importeer het npm pakket express uit de node_modules map
import express, {json} from 'express'
// Importeer de zelfgemaakte functie fetchJson uit de ./helpers map
import fetchJson from './helpers/fetch-json.js'

// Haal alle images uit de WHOIS API op

const app = express()

// sprint7/lesmatariaal/S07W2-02-Filteren-sorteren.pdf
const favorite_houses = await fetchJson(`https://fdnd-agency.directus.app/items/f_list/?fields=*.*.*.*`)
const feedback = await fetchJson(`https://fdnd-agency.directus.app/items/f_feedback/?fields=*.*`)
const users = await fetchJson(`https://fdnd-agency.directus.app/items/f_users/?fields=*.*.`)
const baseUlr = await fetchJson('https://fdnd-agency.directus.app/items/')
// baseurl gebruiken werkt niet dan word er niks geladen

const houses = await fetchJson(`https://fdnd-agency.directus.app/items/f_houses/1?fields=*.*.*`)

const users_image = users.data.map(avatar => {
    console.log(avatar.avatar.id);
    return {
        id_avatar: avatar.avatar.id,
        width: avatar.avatar.width,
        height: avatar.avatar.height,
        name:avatar.name

    };
});
// Stel ejs in als template engine
app.set('view engine', 'ejs')
// gebruik ejs voor het tonen van de informatie aan de gebruiker
// Stel de map met ejs templates in
app.set('views', './views')
// hierdoor word gezegt dat je in de views map moet kijken

// Gebruik de map 'public' voor statische resources, zoals stylesheets, afbeeldingen en client-side JavaScript
app.use(express.static('public'))
app.use(express.urlencoded({extended: true}));//deze regel code gebruiken vanwege middelware zodat de data leesbaar gemaakt word


app.get('/', async function (request, response) {


    try {// dit gebruiken vanwege meerdere arrays
        if (favorite_houses.data) {
            // console.log(JSON.stringify(favorite_houses.data[1].houses[1].f_houses_id.poster_image));

            // 2 nested arrays
            // console.log(JSON.stringify(favorite_houses.data))

            const housedetails = favorite_houses.data.map(listItem => ({

                id: listItem.id,
                title: listItem.title,
                // houses arrya is de nummers van die huizen en de inhoud daarvan dit is nodig omdat houses een array is binnen een array
                houses_array: listItem.houses.map(house => ({
                    id: house.id,
                    image: house.f_houses_id.poster_image

                }))

            }));
            // console.log(JSON.stringify(housedetails))

            response.render('index', {lists: housedetails});
        } else {
            console.error('No favorite houses data found');
        }
    } catch (error) {
        console.error('Error fetching house data:', error);
    }
});

// dit zijn de gedeelde lisjten
app.get('/lijsten/:id', async function (request, response) {

    // hier word de data omgezet met fetch
    const apiData = await fetchJson(`https://fdnd-agency.directus.app/items/f_list/${request.params.id}?fields=*.*.*.*`)
    // hier word met map een nieuwe array gemaakt waardoor ik die kan aanroepen op de ejs

    try {
        response.render('lijst.ejs',
            {
                list: apiData.data,
                users:users_image
            });


    } catch  (error){
        console.error('Error fetching house data:', error);
    }
});


// hier worden de arrays aangemaakt om te gebruiken
const algemeen = []
const keuken = []
const badkamer = []
const tuin = []
const prijs = []
const ligging = []
const oppervlakte = []
const message_score_page_data = [];

// dit is de score pagina en hier kan je de score zien die je ingeeft en een score opgeven
app.get('/score/:id', function (request, response) {
    // Gebruik de request parameter id en haal de juiste persoon uit de WHOIS API op
    fetchJson(`https://fdnd-agency.directus.app/items/f_houses/${request.params.id}/?fields=*.*,image.id,image.height,image.width`)

        .then(async ({ data }) => {

            // Render detail.ejs uit de views map en geef de opgehaalde data mee als variable, genaamd person
            response.render('score', {
                house: data,
                algemeen: algemeen,
                keuken: keuken,
                badkamer: badkamer,
                tuin: tuin,
                prijs: prijs,
                ligging: ligging,
                oppervlakte: oppervlakte,
                notities: message_score_page_data,
                users:users_image


            })
        })
})

// hier word data in de array te zetten ik heb geen connectie met een database
app.post('/score/:id', async function (request, response) {
    const listId = request.params.id;

    // ophalen van de data en opslaan in een const
    const message_score_page = request.body.notes_shown;
    const algemeenNumber = request.body.algemeenNumber;
    const keukenNumber = request.body.keukenNumber;
    const badkamerNumber = request.body.badkamerNumber;
    const tuinNumber = request.body.tuinNumber;

    // data toeveogen aan de array
    algemeen.push(algemeenNumber);
    keuken.push(keukenNumber);
    badkamer.push(badkamerNumber);
    tuin.push(tuinNumber);
    message_score_page_data.push(message_score_page);


    // hier haal je de nieuwe data op
    fetchJson(`https://fdnd-agency.directus.app/items/f_houses/${request.params.id}/?fields=*.*.*`)
        .then(async (apiResponse) => {

            console.log('POST!!')
            console.log(request.body.tuinNumber)
            console.log(request.body.algemeenNumber)
            console.log(request.body.keukenNumber)
            console.log(request.body.badkamerNumber)
            console.log(request.body.notes_shown)



            if (request.body.enhanced) {
                response.render('partials/showScore', {result: apiResponse,


                        algemeen: algemeen,
                        keuken: keuken,
                        badkamer: badkamer,
                        tuin: tuin,
                        prijs: prijs,
                        ligging: ligging,
                        oppervlakte: oppervlakte,
                        notities: message_score_page_data,
                        usres:users_image,

                        //     todo hier nog een repsonse.bdy met tekst 'uw huis is tegevoegd'
                    }
                )
            } else {
                response.redirect(303, '/score/' + request.params.id)
            }

        })
})

// Stel het poortnummer in waar express op moet gaan luisteren
app.set('port', process.env.PORT || 8000)

// todo de style en navbar en deetailpage moeten angelopen worden op onnodige code en in 1 volgorde gezet worden


// Start express op, haal daarbij het zojuist ingestelde poortnummer op
app.listen(app.get('port'), function () {
    // Toon een bericht in de console en geef het poortnummer door
    console.log(`Application started on http://localhost:${app.get('port')}`)
})


