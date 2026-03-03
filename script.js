const cache = new Map();
let currentPokemon = null;

const searchBtn = document.getElementById("searchBtn");
const addToTeamBtn = document.getElementById("addToTeamBtn");

searchBtn.addEventListener("click", fetchPokemon);
addToTeamBtn.addEventListener("click", addToTeam);

async function fetchPokemon() {
    const input = document.getElementById("pokemonInput").value
        .toLowerCase()
        .trim();

    if (!input) return;

    // Check cache first
    if (cache.has(input)) {
        displayPokemon(cache.get(input));
        return;
    }

    try {
        const response = await fetch(
            `https://pokeapi.co/api/v2/pokemon/${input}`
        );

        if (!response.ok) throw new Error("Pokemon not found");

        const data = await response.json();

        // Save to cache
        cache.set(input, data);

        displayPokemon(data);

    } catch (error) {
        alert("Pokemon not found. Try again.");
    }
}

function displayPokemon(data) {
    currentPokemon = data;

    const displayDiv = document.getElementById("pokemonDisplay");

    displayDiv.innerHTML = `
        <h2>${data.name.toUpperCase()}</h2>
        <img src="${data.sprites.front_default}" alt="${data.name}">
        <br>
        <audio controls>
            <source src="${data.cries.latest}" type="audio/ogg">
            Your browser does not support audio.
        </audio>
    `;

    loadMoves(data.moves);

    document.getElementById("moveSelection").style.display = "block";
}

function loadMoves(moves) {
    const selects = [
        document.getElementById("move1"),
        document.getElementById("move2"),
        document.getElementById("move3"),
        document.getElementById("move4")
    ];

    selects.forEach(select => {
        select.innerHTML = "";

        moves.forEach(moveObj => {
            const option = document.createElement("option");
            option.value = moveObj.move.name;
            option.textContent = moveObj.move.name;
            select.appendChild(option);
        });
    });
}

function addToTeam() {
    if (!currentPokemon) return;

    const selectedMoves = [
        document.getElementById("move1").value,
        document.getElementById("move2").value,
        document.getElementById("move3").value,
        document.getElementById("move4").value
    ];

    const teamContainer = document.getElementById("teamContainer");

    const memberDiv = document.createElement("div");
    memberDiv.classList.add("team-member");

    memberDiv.innerHTML = `
        <h4>${currentPokemon.name.toUpperCase()}</h4>
        <img src="${currentPokemon.sprites.front_default}">
        <p><strong>Moves:</strong></p>
        <ul>
            <li>${selectedMoves[0]}</li>
            <li>${selectedMoves[1]}</li>
            <li>${selectedMoves[2]}</li>
            <li>${selectedMoves[3]}</li>
        </ul>
    `;

    teamContainer.appendChild(memberDiv);
}
