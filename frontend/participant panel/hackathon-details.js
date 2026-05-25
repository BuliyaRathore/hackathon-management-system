async function loadHackathonDetails() {
  const params = new URLSearchParams(window.location.search);
  const id = params.get("id");

  if (!id) {
    document.getElementById("detailsContainer").innerHTML = "<p>Hackathon not found.</p>";
    return;
  }

  try {
    const res = await fetch(`http://localhost:5000/api/hackathon/${id}`);
    const hackathon = await res.json();
    console.log("Loaded Hackathon:", hackathon);

    // Calculate total prize
const prize1 = Number(hackathon.prize1) || 0;
const prize2 = Number(hackathon.prize2) || 0;
const prize3 = Number(hackathon.prize3) || 0;

console.log("🎯 Prizes from hackathon:", prize1, prize2, prize3);

const totalPrize = prize1 + prize2 + prize3;
const formattedPrize = totalPrize.toLocaleString("en-IN");


    // 🔺 Header Section
    document.getElementById("topHeader").innerHTML = `
      <div class="left">
        <img src="https://via.placeholder.com/70x70/e11d48/ffffff?text=H" class="hack-logo"/>
        <div>
          <h1 class="hackathon-title">${hackathon.title}</h1>
          <p>${hackathon.location}</p>
          <p class="prize-tag">🏆 Prizes Worth ₹${formattedPrize}</p>
       </div>
      </div>
    `;
     // 🔺 Tabs
    document.getElementById("tabMenu").innerHTML = `
      <li onclick="scrollToSection('problem')">Problem Statement</li>
      <li onclick="scrollToSection('stages')">Stages & Timeline</li>
      <li onclick="scrollToSection('details')">Details</li>
      <li onclick="scrollToSection('deadlines')">Dates & Deadlines</li>
      <li onclick="scrollToSection('prizes')">Prizes</li>
    `;


    // 🔺 Left Content
    document.getElementById("detailsContainer").innerHTML = `
      <div id="problem" class="section-card">
        <h2>🧠 Problem Statement</h2>
        <div class="inner-card">
          <ul>${hackathon.problem.map(p => `<li>${p}</li>`).join("")}</ul>
        </div>
      </div>

      <div id="stages" class="section-card">
        <h2>🗓 Stages & Timeline</h2>
       ${hackathon.rounds.map(r => {
  const now = new Date();
  const start = new Date(r.start);
  const end = new Date(r.end);
  const showLink = r.link && now >= start;

  return `
    <div class="stage-card">
      <h3>${r.name}</h3>
      <p>${r.description}</p>
      <p><strong>Start:</strong> ${start.toDateString()} — <strong>End:</strong> ${end.toDateString()}</p>
      <p><strong>Deliverables:</strong> ${r.guidelines}</p>
      ${showLink ? `<p><strong>Live Link:</strong> <a href="${r.link}" target="_blank">${r.link}</a></p>` : `<p><em>Link will appear when the round starts</em></p>`}
    </div>
  `;
}).join("")}

      </div>

      <div id="details" class="section-card">
        <h2>📝 Event Details</h2>
        <div class="inner-card">
          <p>${hackathon.description}</p>
        </div>
      </div>

      <div id="deadlines" class="section-card">
        <h2>📆 Dates & Deadlines</h2>
        <div class="inner-card">
          <ul>
            <li><strong>Registration Opens:</strong> ${new Date(hackathon.regStart).toDateString()}</li>
            <li><strong>Registration Deadline:</strong> ${new Date(hackathon.regEnd).toDateString()}</li>
          </ul>
        </div>
      </div>

      <div id="prizes" class="section-card">
        <h2>🏆 Prizes </h2>
        <div class="inner-card">
          <ul>
            <li>🥇 First: ₹${hackathon.prize1}</li>
            <li>🥈 Second: ₹${hackathon.prize2}</li>
            <li>🥉 Third: ₹${hackathon.prize3}</li>
          </ul>
        </div>
      </div>
        `;
  // 🔺 Right Panel
    document.getElementById("rightPanel").innerHTML = `
      <div class="right-card fade-in-up">
        <p class="price-label">Free</p>
        <p class="organizer-name">${hackathon?.createdBy ?? "Organizer Name"}</p>
        <p class="organizer-email">${hackathon?.organizerEmail ?? "organizer@example.com"}</p>
        <button class="register-btn" onclick="handleGoToRegister()">Register Now</button>
        <div class="stats-row">
          <div class="stat-box">
            <p class="stat-icon">👥</p>
            <p class="stat-title">Registered Teams</p>
            <p class="stat-value">44</p>
          </div>
          <div class="stat-box">
            <p class="stat-icon">👨‍👩‍👧‍👦</p>
            <p class="stat-title">Team Size</p>
            <p class="stat-value">1 - ${hackathon?.maxTeamSize ?? 5} Members</p>
          </div>
          <div class="stat-box">
            <p class="stat-icon">⏰</p>
            <p class="stat-title">Duration</p>
            <p class="stat-value">36 Hours</p>
          </div>
          <div class="stat-box">
            <p class="stat-icon">🎯</p>
            <p class="stat-title">Difficulty</p>
            <p class="stat-value">Intermediate</p>
          </div>
        </div>
      </div>
    `;

     
  } catch (err) {
    console.error("Failed to load hackathon:", err);
    document.getElementById("detailsContainer").innerHTML = "<p>Error loading details.</p>";
  }
}

loadHackathonDetails();

function scrollToSection(id) {
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
}
