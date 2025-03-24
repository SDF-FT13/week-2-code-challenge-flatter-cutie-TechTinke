document.addEventListener("DOMContentLoaded", () => {
  const baseUrl = "http://localhost:3000/characters";
  const characterBar = document.getElementById("character-bar");
  const detailedInfo = document.getElementById("detailed-info");
  const nameTag = document.getElementById("name");
  const imageTag = document.getElementById("image");
  const voteCount = document.getElementById("vote-count");
  const votesForm = document.getElementById("votes-form");
  const votesInput = document.getElementById("votes");
  const resetButton = document.getElementById("reset-btn");
  const characterForm = document.getElementById("character-form");

  let selectedCharacter = null;

  // Fetch characters from server
  fetch(baseUrl)
    .then((res) => res.json())
    .then((characters) => {
      characters.forEach((character) => addCharacterToBar(character));
    });

  function addCharacterToBar(character) {
    const span = document.createElement("span");
    span.textContent = character.name;
    span.addEventListener("click", () => displayCharacter(character));
    characterBar.appendChild(span);
  }

  function displayCharacter(character) {
    selectedCharacter = character;
    nameTag.textContent = character.name;
    imageTag.src = character.image;
    imageTag.alt = character.name;
    voteCount.textContent = character.votes;
  }

  votesForm.addEventListener("submit", (event) => {
    event.preventDefault();
    if (selectedCharacter) {
      const addedVotes = parseInt(votesInput.value) || 0;
      selectedCharacter.votes += addedVotes;
      voteCount.textContent = selectedCharacter.votes;
      votesInput.value = "";

      // Update votes on server
      fetch(`${baseUrl}/${selectedCharacter.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ votes: selectedCharacter.votes }),
      });
    }
  });

  resetButton.addEventListener("click", () => {
    if (selectedCharacter) {
      selectedCharacter.votes = 0;
      voteCount.textContent = "0";

      // Reset votes on server
      fetch(`${baseUrl}/${selectedCharacter.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ votes: 0 }),
      });
    }
  });

  characterForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const name = document.getElementById("character-name").value;
    const image = document.getElementById("image-url").value;

    if (name && image) {
      const newCharacter = { name, image, votes: 0 };

      fetch(baseUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newCharacter),
      })
        .then((res) => res.json())
        .then((character) => {
          addCharacterToBar(character);
          displayCharacter(character);
          characterForm.reset();
        });
    }
  });
});
