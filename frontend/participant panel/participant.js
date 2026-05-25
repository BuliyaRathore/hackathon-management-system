async function loadHackathonsForParticipants() {
  try {
    const res = await fetch("http://localhost:5000/api/hackathon/all");
    const hackathons = await res.json();

    const container = document.getElementById("hackathon-cards");
    container.innerHTML = "";

    if (hackathons.length === 0) {
      container.innerHTML = "<p>No hackathons available right now.</p>";
      return;
    }


    hackathons.forEach(hackathon => {
      // Determine status (LIVE or UPCOMING)
      const now = new Date();
      const regStart = new Date(hackathon.regStart);
      const regEnd = new Date(hackathon.regEnd);

      let status = "UPCOMING";
      if (now >= regStart && now <= regEnd) {
        status = "LIVE";
      }

      // Create card
      const card = document.createElement("div");
      card.className = "hackathon-card";
      card.setAttribute("onclick", `viewHackathon('${hackathon._id}')`);
      

      card.innerHTML = `
        <div class="card-header">💻</div>
        <h3>${hackathon.title}</h3>
        <p>${hackathon.description}</p>
        <div class="badge ${status.toLowerCase()}">${status}</div>
        <button onclick="event.stopPropagation(); viewHackathon('${hackathon._id}')">View</button>
      `;

      container.appendChild(card);
    });
  } catch (err) {
    console.error("Error loading hackathons:", err);
    document.getElementById("hackathon-cards").innerHTML = "<p>Failed to load hackathons.</p>";
  }
}
window.onload = loadHackathonsForParticipants;

function viewHackathon(id) {
  window.location.href = `hackathon-details.html?id=${id}`;
}
