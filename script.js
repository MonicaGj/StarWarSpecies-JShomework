$( async () => {
    await loadSpeciesData();
    await displaySpecies(species); 

    $("#display-species").on("click","button", function(){
        $("#names").empty()
        const spinner = document.getElementById("loader");
        const content = document.getElementById("names");
        
        // display the loader and hide the content
        spinner.style.display = "block";
        content.style.display = "none";
        
        let urls = $(this).val().split(",");

            for(let url of urls){
                fetch(url)
                    .then(response => response.json())
                    .then(results => {
                        showNames(results)
                    })
            }  
        
        spinner.style.display = "none";
        content.style.display = "block";

    });



    
    
});

function showNames(results){
    
    $("#names").append(`         
        <li>${results.name}</li>
        `)

                   
}


const species = [];

async function loadSpeciesData() {
    const loader = document.getElementById("loader");
    const content = document.getElementById("list");
    // display the loader and hide the content
    loader.style.display = "block";
    content.style.display = "none";

    // hasNext is true if we have a nextPage. When the next page is empty, we're done looping
    let hasNext = true;
    // initially we start at page 1
    let page = 1;

    do {
        // console.log(`Loading page ${page}`);
        // get the data from the url
        const url = `https://swapi.co/api/species?page=${page}`;
        const response = await fetch(url);
        const result = await response.json();
        
        // map the results into objects with id and name
        const pageSpecies = result.results.map(species => ({
            id: getIdFromItemUrl(species.url),
            name: species.name,
            classification: species.classification,
            people: species.people,
            isLoaded: false,
        }));

        // and then add them to the global planets array (using ...)
        species.push(...pageSpecies);

        // set the looping data to point to the next page (if any)
        hasNext = result.next !== null;
        page += 1;
    } while(hasNext);


    // hide the loader, and display the content
    loader.style.display = "none";
    content.style.display = "block";
}


function getIdFromItemUrl(itemUrl) {
    const idRegex = /^.*\/(\d+)\/$/;
    const match = itemUrl.match(idRegex);
    return (match) ? match[1] : null;
}


async function displaySpecies(species) {
     for (const x of species) {
        if(x.people.length > 1){
           $("#display-species").append(`
            <tr>
                <td>${x.id}</td>
                <td>${x.name}</td>
                <td>${x.classification}</td>
                <td>${x.people.length} people
                 <button value= "${x.people}">See people</button>
                 </td>

            </tr>
        `)  
        }  
     }  
}




                
    