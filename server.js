// Importeer het npm pakket express uit de node_modules map
import express, {json} from 'express'
const { get } = import('http');
// Importeer de zelfgemaakte functie fetchJson uit de ./helpers map
import fetchJson from './helpers/fetch-json.js'

// Haal alle images uit de WHOIS API op

const app = express()

// file:///D:/OneDrive%20-%20HvA/jaar1/periode3/sprint7/lesmatariaal/S07W2-02-Filteren-sorteren.pdf
const favorite_houses = await fetchJson(`https://fdnd-agency.directus.app/items/f_list/?fields=*.*.*`)
const baseUlr = await fetchJson('https://fdnd-agency.directus.app/items/')
// baseurl gebruiken werkt niet dan word er niks geladen


const messages = []//dit is voor de detailpage


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
            const housedetails = favorite_houses.data.map(listItem => ({
                id: listItem.id,
                title: listItem.title,
                // houses arrya is de nummers van die huizen en de inhoud daarvan
                houses_array: listItem.houses.map(house => ({
                    id: house.id,
                    image: house.f_houses_id.poster_image
                }))
            }));

            response.render('index', {lists: housedetails});
        } else {
            console.error('No favorite houses data found');
        }
    } catch (error) {
        console.error('Error fetching house data:', error);
    }
});

app.get('/lijsten/:id', async function (request, response) {
    const listId = request.params.id;
    // console.log('Fetching data for list ID:', listId);

    const apiData = await fetchJson(`https://fdnd-agency.directus.app/items/f_list/${request.params.id}?fields=*.*.*`)


    try {
        response.render('lijst.ejs',
            {
                list: apiData.data,
                houses: apiData.data.houses
            });


    } catch  (error){
        console.error('Error fetching house data:', error);
    }
});

app.get('/Detailpage/:id', async function (request, response) {



    const apiData = await fetchJson(`https://fdnd-agency.directus.app/items/f_houses/${request.params.id}?fields=*.*.*`)
    fetchJson(`https://fdnd-agency.directus.app/items/f_houses/${request.params.id}/?fields=*.*.*`)
    try {
        // request.params.id gebruik je zodat je de exacte student kan weergeven dit is
        // een routeparmater naar de route van die  specifieke persoon

        // console.log(JSON.stringify(favorite_houses.data));
        response.render('Detailpage', {
            house: apiData.data,
            images: favorite_houses.data

        });
    }
    catch (error){
        console.error('Error fetching house data:', error);
    }
});

const algemeen = []
const keuken = []
const badkamer = []
const tuin = []
const prijs = []
const ligging = []
const oppervlakte = []
const message_score_page_data = [];



app.get('/score/:id', function (request, response) {
    // Gebruik de request parameter id en haal de juiste persoon uit de WHOIS API op
    fetchJson(`https://fdnd-agency.directus.app/items/f_houses/${request.params.id}/?fields=*.*.*`).then(async ({ data }) => {
        // Pas de url naar de afbeelding aan zodat die verwijst naar directus
        data.picture = `https://fdnd-agency.directus.app/assets/${data.poster_image}`
        data.poster_image.length = Number(data.length).toFixed(2)
        data.poster_image.width = Number(data.width).toFixed(2)


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

        })
    })
})


app.post('/score/:id', async function (request, response) {
    const listId = request.params.id;

    // ophalen van de data en opslaan in een const
    const message_score_page = request.body.test;
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


            //     hier pas je de data aan
            fetch('https://fdnd-agency.directus.app/items/f_houses/' + request.params.id, {
                method: 'post',
                body: JSON.stringify({
                    custom: apiResponse.data.custom
                }),
                headers: {
                    'Content-type': 'application/json; charset=UTF-8'
                }
            }).then((patchResponse) => {
                // Redirect naar de persoon pagina
                response.redirect(303, '/score/' + request.params.id)
            })

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


