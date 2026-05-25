// Global variables
let hackathons = [];
let problems = [];
let rounds = [];
let currentHackathon = null;
let isEditing = false;

async function loadHackathons() {
  const hackathonList = document.getElementById("hackathon-list");
  const hackathonCards = document.getElementById("hackathon-cards");

  try {
    const res = await fetch("http://localhost:5000/api/hackathon/my", {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("token"),
      },
    });

    if (!res.ok) {
      throw new Error("Failed to fetch hackathons");
    }

    const data = await res.json();
    hackathons = data;

    if (hackathons.length === 0) {
      hackathonList.style.display = "none";
      return;
    }

    hackathonList.style.display = "block";
    hackathonCards.innerHTML = "";

    hackathons.forEach((hackathon) => {
      const card = document.createElement("div");
      card.className = "hackathon-card";
      card.innerHTML = `
        <h4>${hackathon.title}</h4>
        <p><strong>Description:</strong> ${hackathon.description}</p>
        <p><strong>Location:</strong> ${hackathon.location}</p>
        <button class="submit-btn" onclick="viewHackathon('${hackathon._id}')">👁️ View Details</button>
        <button class="submit-btn" onclick="editHackathon('${hackathon._id}')">✏️ Edit</button>
        <button class="submit-btn" onclick="deleteHackathon('${hackathon._id}')">🗑️ Delete</button>
      `;
      hackathonCards.appendChild(card);
    });
  } catch (err) {
    console.error("❌ Error loading hackathons:", err);
    hackathonList.style.display = "none";
  }
}


function renderHackathonCards() {
  const hackathonCards = document.getElementById("hackathon-cards");
  hackathonCards.innerHTML = "";

  if (hackathons.length === 0) {
    document.getElementById("hackathon-list").style.display = "none";
    return;
  }

  document.getElementById("hackathon-list").style.display = "block";

  hackathons.forEach((hackathon) => {
    const card = document.createElement("div");
    card.className = "hackathon-card";
    card.innerHTML = `
      <h4>${hackathon.title}</h4>
      <p>${hackathon.description}</p>
      <p><strong>Location:</strong> ${hackathon.location}</p>
      <button onclick="viewHackathon('${hackathon._id}')">👁 View</button>
      <button onclick="editHackathon('${hackathon._id}')">✏️ Edit</button>
      <button onclick="deleteHackathon('${hackathon._id}')">🗑 Delete</button>
    `;
    hackathonCards.appendChild(card);
  });
}

// Initialize the application
document.addEventListener("DOMContentLoaded", function () {
  initializeApp();
  loadHackathons();

  // Set up form submission
  document
    .getElementById("hackathon-form")
    .addEventListener("submit", handleFormSubmit);

  // Set up modal click to close
  document
    .getElementById("modal-overlay")
    .addEventListener("click", function (e) {
      if (e.target === this) {
        closeModal();
      }
    });
});

function initializeApp() {
  // Show dashboard by default
  showSection("dashboard");
}

function showSection(sectionName) {
  // Hide all sections
  const sections = document.querySelectorAll(".section");
  sections.forEach((section) => section.classList.remove("active"));

  // Show selected section
  const targetSection = document.getElementById(sectionName + "-section");
  if (targetSection) {
    targetSection.classList.add("active");
  }

  // Update nav links
  const navLinks = document.querySelectorAll(".nav-link");
  navLinks.forEach((link) => link.classList.remove("active"));

  const activeLink = document.querySelector(
    `[onclick="showSection('${sectionName}')"]`
  );
  if (activeLink) {
    activeLink.classList.add("active");
  }
}

function toggleSidebar() {
  const sidebar = document.getElementById("sidebar");
  const mainContent = document.getElementById("main-content");

  if (sidebar.style.display === "none") {
    sidebar.style.display = "block";
    mainContent.classList.add("shifted");
  } else {
    sidebar.style.display = "none";
    mainContent.classList.remove("shifted");
  }
}

function addProblem() {
  const input = document.getElementById("problemInput");
  const problem = input.value.trim();

  if (problem) {
    problems.push(problem);
    input.value = "";
    updateProblemList();
  }
}

function updateProblemList() {
  const list = document.getElementById("problemList");
  list.innerHTML = "";

  problems.forEach((problem, index) => {
    const li = document.createElement("li");
    li.textContent = problem;
    list.appendChild(li);
  });
}

function addRound() {
  const roundsContainer = document.getElementById("rounds-container");
  const roundIndex = rounds.length;

  const roundCard = document.createElement("div");
  roundCard.className = "round-card";
  roundCard.innerHTML = `
    <h4>Round ${roundIndex + 1}</h4>
    <div class="round-grid">
      <div class="form-group">
        <label>Round Name</label>
        <input type="text" name="round-name-${roundIndex}" required />
      </div>
      <div class="form-group">
        <label>Round Description</label>
        <textarea name="round-description-${roundIndex}" required></textarea>
      </div>
      <div class="form-group">
        <label>Round Guidelines</label>
        <textarea name="round-guidelines-${roundIndex}" required></textarea>
      </div>
      <div class="form-group">
        <label>Start Date</label>
        <input type="datetime-local" name="round-start-${roundIndex}" required />
      </div>
      <div class="form-group">
        <label>End Date</label>
        <input type="datetime-local" name="round-end-${roundIndex}" required />
      </div>
      <div class="form-group">
        <label>Optional Link (e.g. Google Meet)</label>
        <input type="url" name="round-link-${roundIndex}" />
      </div>
    </div>
    <button type="button" class="remove-btn" onclick="removeRound(${roundIndex})">
      🗑 Remove Round
    </button>
  `;

  roundsContainer.appendChild(roundCard);
  rounds.push({});
}

function removeRound(index) {
  const roundsContainer = document.getElementById("rounds-container");
  const roundCards = roundsContainer.querySelectorAll(".round-card");

  if (roundCards[index]) {
    roundCards[index].remove();
    rounds.splice(index, 1);

    // Update round numbers
    const remainingCards = roundsContainer.querySelectorAll(".round-card");
    remainingCards.forEach((card, i) => {
      const title = card.querySelector("h4");
      title.textContent = `Round ${i + 1}`;
    });
  }
}

async function handleFormSubmit(e) {
  e.preventDefault();

  if (problems.length === 0) {
    alert("Add at least one problem statement.");
    return;
  }

  const formData = new FormData(e.target);
  const roundsData = [];
  const roundCards = document.querySelectorAll(".round-card");

  roundCards.forEach((card, index) => {
    roundsData.push({
      name: card.querySelector(`[name="round-name-${index}"]`).value,
      description: card.querySelector(`[name="round-description-${index}"]`).value,
      guidelines: card.querySelector(`[name="round-guidelines-${index}"]`).value,
      start: card.querySelector(`[name="round-start-${index}"]`).value,
      end: card.querySelector(`[name="round-end-${index}"]`).value,
      link: card.querySelector(`[name="round-link-${index}"]`).value,
    });
  });

  const hackathon = {
    title: formData.get("title"),
    location: formData.get("location"),
    regStart: formData.get("regStart"),
    regEnd: formData.get("regEnd"),
    prize1: formData.get("prize1"),
    prize2: formData.get("prize2"),
    prize3: formData.get("prize3"),
    maxTeamSize: formData.get("maxTeamSize"),
    description: formData.get("description"),
    problem: [...problems],
    rounds: roundsData,
  };

  try {
    let url = "http://localhost:5000/api/hackathon/create";
    let method = "POST";

    if (isEditing && currentHackathon) {
      url = `http://localhost:5000/api/hackathon/${currentHackathon._id}`;
      method = "PUT";
    }

    const res = await fetch(url, {
      method,
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("token"),
      },
      body: JSON.stringify(hackathon),
    });

    const data = await res.json();

    if (res.ok) {
      alert("✅ Hackathon " + (isEditing ? "updated" : "created") + " successfully!");
      e.target.reset();
      problems = [];
      rounds = [];
      isEditing = false;
      currentHackathon = null;
      document.getElementById("rounds-container").innerHTML = "";
      updateProblemList();
      loadHackathons();
    } else {
      alert("❌ Failed: " + (data.message || "Unknown error"));
    }
  } catch (err) {
    console.error("❌ Error:", err);
    alert("❌ Error connecting to server");
  }
}


function editHackathon(id) {
  const hackathon = hackathons.find((h) => h._id === id);
  if (!hackathon) return;

  currentHackathon = hackathon;
  isEditing = true;

  // Fill the form
  document.getElementById("title").value = hackathon.title;
  document.getElementById("location").value = hackathon.location;
  document.getElementById("regStart").value = hackathon.regStart?.slice(0, 16);
  document.getElementById("regEnd").value = hackathon.regEnd?.slice(0, 16);
  document.getElementById("prize1").value = hackathon.prize1;
  document.getElementById("prize2").value = hackathon.prize2;
  document.getElementById("prize3").value = hackathon.prize3;
  document.getElementById("maxTeamSize").value = hackathon.maxTeamSize;
  document.getElementById("description").value = hackathon.description;

  problems = [...hackathon.problem];
  updateProblemList();

  const container = document.getElementById("rounds-container");
  container.innerHTML = "";
  rounds = [...hackathon.rounds];

  rounds.forEach((round, i) => {
    const div = document.createElement("div");
    div.className = "round-card";
    div.innerHTML = `
      <h4>Round ${i + 1}</h4>
      <div class="round-grid">
        <div class="form-group"><label>Round Name</label>
          <input type="text" name="round-name-${i}" value="${round.name}" required />
        </div>
        <div class="form-group"><label>Description</label>
          <textarea name="round-description-${i}" required>${round.description}</textarea>
        </div>
        <div class="form-group"><label>Guidelines</label>
          <textarea name="round-guidelines-${i}" required>${round.guidelines}</textarea>
        </div>
        <div class="form-group"><label>Start</label>
          <input type="datetime-local" name="round-start-${i}" value="${round.start?.slice(0, 16)}" required />
        </div>
        <div class="form-group"><label>End</label>
          <input type="datetime-local" name="round-end-${i}" value="${round.end?.slice(0, 16)}" required />
        </div>
        <div class="form-group"><label>Link</label>
          <input type="url" name="round-link-${i}" value="${round.link}" />
        </div>
      </div>
    `;
    container.appendChild(div);
  });
  //   // Change submit button text
 document.querySelector("#hackathon-form .submit-btn").textContent = "✏️ Update Hackathon";
 

  document.getElementById("hackathon-form").scrollIntoView({ behavior: "smooth" });
}


function viewHackathon(id) {
  const hackathon = hackathons.find((h) => h._id === id);
  if (!hackathon) return;

  const modalContent = document.getElementById("modal-content");

  const formatDateTime = (str) => new Date(str).toLocaleString();

  modalContent.innerHTML = `
    <h2>${hackathon.title}</h2>
    <div class="timeline">
      <p><strong>📍 Location:</strong> ${hackathon.location}</p>
      <p><strong>💰 1st Prize:</strong> ${hackathon.prize1}</p>
      <p><strong>💰 2nd Prize:</strong> ${hackathon.prize2}</p>
      <p><strong>💰 3rd Prize:</strong> ${hackathon.prize3}</p>
      <p><strong>🕓 Registration:</strong> ${formatDateTime(hackathon.regStart)} → ${formatDateTime(hackathon.regEnd)}</p>
      <p><strong>👥 Max Team Size:</strong> ${hackathon.maxTeamSize}</p>
      <p><strong>🧩 Problems:</strong></p>
      <ul>${hackathon.problem.map((p) => `<li>🔹 ${p}</li>`).join("")}</ul>
      <p><strong>📝 Description:</strong><br />${hackathon.description}</p>

      ${hackathon.rounds?.length ? `
        <div class="rounds-display">
          <h3>🧪 Rounds</h3>
          ${hackathon.rounds.map((r, i) => `
            <div>
              <h4>Round ${i + 1}: ${r.name}</h4>
              <p><strong>Description:</strong> ${r.description}</p>
              <p><strong>Start:</strong> ${formatDateTime(r.start)}</p>
              <p><strong>End:</strong> ${formatDateTime(r.end)}</p>
              ${r.guidelines ? `<p><strong>Guidelines:</strong> ${r.guidelines}</p>` : ""}
              ${r.link ? `<p><strong>Link:</strong> <a href="${r.link}" target="_blank">${r.link}</a></p>` : ""}
            </div>
          `).join("")}
        </div>
      ` : ""}
    </div>
  `;

  document.getElementById("modal-overlay").style.display = "flex";
}

function closeModal() {
  document.getElementById("modal-overlay").style.display = "none";
  currentHackathon = null;
}

async function deleteHackathon(id) {
  if (!id || !confirm("Are you sure you want to delete this hackathon?")) return;

  try {
    const res = await fetch(`http://localhost:5000/api/hackathon/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: "Bearer " + localStorage.getItem("token"),
      },
    });

    const data = await res.json();
    if (res.ok) {
      alert("✅ Hackathon deleted");
      loadHackathons();
      closeModal();
    } else {
      alert("❌ Failed to delete: " + data.message);
    }
  } catch (err) {
    console.error("❌ Error deleting hackathon:", err);
    alert("Server error");
  }
}

// function editHackathon(id) {
//   const hackathon = hackathons.find(h => h._id === id);
//   if (!hackathon) return alert("Hackathon not found");

//   currentHackathon = hackathon;

//   // Fill form fields
//   document.getElementById("title").value = hackathon.title;
//   document.getElementById("location").value = hackathon.location;
//   document.getElementById("regStart").value = hackathon.regStart.slice(0, 16);
//   document.getElementById("regEnd").value = hackathon.regEnd.slice(0, 16);
//   document.getElementById("prize1").value = hackathon.prize1;
//   document.getElementById("prize2").value = hackathon.prize2;
//   document.getElementById("prize3").value = hackathon.prize3;
//   document.getElementById("maxTeamSize").value = hackathon.maxTeamSize;
//   document.getElementById("description").value = hackathon.description;

//   // Fill problems
//   problems = [...hackathon.problem];
//   updateProblemList();

//   // Fill rounds
//   rounds = [...hackathon.rounds];
//   const container = document.getElementById("rounds-container");
//   container.innerHTML = "";
//   rounds.forEach((r, i) => {
//     addRound(); // creates the card
//     container.querySelector(`[name="round-name-${i}"]`).value = r.name;
//     container.querySelector(`[name="round-description-${i}"]`).value = r.description;
//     container.querySelector(`[name="round-guidelines-${i}"]`).value = r.guidelines;
//     container.querySelector(`[name="round-start-${i}"]`).value = r.start.slice(0, 16);
//     container.querySelector(`[name="round-end-${i}"]`).value = r.end.slice(0, 16);
//     container.querySelector(`[name="round-link-${i}"]`).value = r.link;
//   });

//   // Change submit button text
//   document.querySelector("#hackathon-form .submit-btn").textContent = "✏️ Update Hackathon";
// }



// Allow Enter key to add problems
document.addEventListener("keydown", function (e) {
  if (e.key === "Enter" && e.target.id === "problemInput") {
    e.preventDefault();
    addProblem();
  }
});
