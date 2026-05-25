console.log("✅ JS Loaded Successfully");

 // NAVBAR JAVASCRIPT
        function toggleMobileNav() {
            const menu = document.getElementById('mobileMenu');
            menu.classList.toggle('active');
        }

        function toggleProfileDropdown() {
            const dropdown = document.getElementById('profileDropdown');
            dropdown.classList.toggle('show');
        }

        function logout() {
            if (confirm('Are you sure you want to logout?')) {
                // Simulate logout - redirect to index.html
                window.location.href = '../index.html';
            }
        }

        // Profile management functions
        function editProfile() {
            // Get current profile values
            const currentName = document.getElementById('profileName').textContent;
            const currentEmail = document.getElementById('profileEmail').textContent;
            const currentPhone = document.getElementById('profilePhone').textContent;
            
            // Populate the edit form
            document.getElementById('editProfileName').value = currentName;
            document.getElementById('editProfileEmail').value = currentEmail;
            document.getElementById('editProfilePhone').value = currentPhone;
            
            // Show the modal
            document.getElementById('profileEditModal').style.display = 'flex';
            
            // Close the profile dropdown
            document.getElementById('profileDropdown').classList.remove('show');
        }

        function saveProfile() {
            // Get new values
            const newName = document.getElementById('editProfileName').value.trim();
            const newEmail = document.getElementById('editProfileEmail').value.trim();
            const newPhone = document.getElementById('editProfilePhone').value.trim();
            
            // Validate inputs
            if (!newName || !newEmail || !newPhone) {
                alert('Please fill in all fields');
                return;
            }
            
            // Email validation
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(newEmail)) {
                alert('Please enter a valid email address');
                return;
            }
            
            // Phone validation (basic)
            const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
            if (!phoneRegex.test(newPhone.replace(/[\s\-\(\)]/g, ''))) {
                alert('Please enter a valid phone number');
                return;
            }
            
            // Update profile display
            document.getElementById('profileName').textContent = newName;
            document.getElementById('profileEmail').textContent = newEmail;
            document.getElementById('profilePhone').textContent = newPhone;
            
            // Close modal
            closeProfileEdit();
            
            // Show success message
            alert('Profile updated successfully! 🎉');
        }

        function closeProfileEdit() {
            document.getElementById('profileEditModal').style.display = 'none';
        }

        // Close modal when clicking outside
        document.addEventListener('click', function(e) {
            const modal = document.getElementById('profileEditModal');
            if (e.target === modal) {
                closeProfileEdit();
            }
        });
    

// Evaluation Score Calculator
function calculateTotal(input) {
  const projectCard = input.closest(".project-card");
  const scoreInputs = projectCard.querySelectorAll(".score-input");
  let total = 0;

  scoreInputs.forEach(input => {
    const val = parseInt(input.value);
    if (!isNaN(val)) total += val;
  });

  const totalValue = projectCard.querySelector(".total-value");
  totalValue.textContent = total;
}

// Save and Submit Evaluation
function saveEvaluation(button) {
  const card = button.closest(".project-card");
  const title = card.querySelector(".project-header h3").innerText;
  const scores = card.querySelectorAll(".score-input");
  const comment = card.querySelector(".comment-textarea").value;

  const data = {
    title: title,
    scores: Array.from(scores).map(input => input.value),
    comment: comment,
    status: "draft"
  };

  console.log("📝 Draft Saved:", data);
  alert("✅ Draft saved for: " + title);
}

function submitEvaluation(button) {
  const card = button.closest(".project-card");
  const title = card.querySelector(".project-header h3").innerText;
  const scores = card.querySelectorAll(".score-input");
  const comment = card.querySelector(".comment-textarea").value;

  let total = 0;
  let incomplete = false;

  scores.forEach(input => {
    const val = parseInt(input.value);
    if (isNaN(val)) {
      incomplete = true;
    } else {
      total += val;
    }
  });

  if (incomplete) {
    alert("⚠️ Please fill all score fields before submitting.");
    return;
  }

  if (!comment.trim()) {
    alert("⚠️ Please enter your comments before submitting.");
    return;
  }

  const evaluation = {
    team: card.querySelector(".team-info h4").innerText.replace("Team: ", ""),
    project: title,
    score: total,
    comment: comment,
    status: "Pending"
  };

  // 🔐 Save to localStorage
  const existing = JSON.parse(localStorage.getItem("evaluations") || "[]");
  existing.push(evaluation);
  localStorage.setItem("evaluations", JSON.stringify(existing));

  alert("📤 Evaluation submitted and saved!");
  console.log("✅ Saved evaluation:", evaluation);


  const CURRENT_JUDGE = localStorage.getItem("judgeName") || "Unknown Judge";
  const resultsTableBody = document.getElementById("resultsTableBody");

  const newRow = document.createElement("tr");
  newRow.setAttribute("data-judge", CURRENT_JUDGE);
  newRow.setAttribute("data-hackathon", card.getAttribute("data-hackathon") || "unknown");

  newRow.innerHTML = `
    <td><span class="rank-badge rank-other">-</span></td>
    <td>${card.querySelector('.team-info h4')?.innerText.replace('Team: ', '') || 'Unknown Team'}</td>
    <td>${title}</td>
    <td><strong>${total}/100</strong></td>
    <td>${comment}</td>
    <td><span class="project-status status-in-review">Pending</span></td>
  `;

  resultsTableBody.appendChild(newRow);
  alert("🎯 Evaluation submitted for: " + title);
}


// Results Publishing

function publishResults() {
  const confirmPublish = confirm("🟢 Are you sure you want to publish all pending results?");
  if (!confirmPublish) return;

  const rows = document.querySelectorAll("#resultsTableBody tr");

  rows.forEach(row => {
    const statusSpan = row.querySelector(".project-status");
    const score = row.querySelector("td:nth-child(4)").innerText;

    if (statusSpan.classList.contains("status-in-review")) {
      statusSpan.classList.remove("status-in-review");
      statusSpan.classList.add("status-evaluated");
      statusSpan.innerText = "Published";
      row.style.backgroundColor = "#e8fce8";
    }

    const teamName = row.querySelector("td:nth-child(2)").innerText;
    console.log(`✅ Published for: ${teamName} with score ${score}`);
  });

  alert("🎉 Results have been published successfully!");
}

// Filter Functions
function showResults(selectedHackathon) {
  const rows = document.querySelectorAll("#resultsTableBody tr");
  rows.forEach(row => {
    const hackathon = row.getAttribute("data-hackathon");
    row.style.display = (selectedHackathon === "all" || selectedHackathon === hackathon) ? "table-row" : "none";
  });
}

function filterProjects(status) {
  const cards = document.querySelectorAll(".project-card");
  cards.forEach(card => {
    const cardStatus = card.getAttribute("data-status");
    card.style.display = (status === "all" || cardStatus === status) ? "block" : "none";
  });
}

function filterByHackathon(hackathon) {
  const cards = document.querySelectorAll(".project-card");
  cards.forEach(card => {
    const cardHackathon = card.getAttribute("data-hackathon");
    card.style.display = (hackathon === "all" || cardHackathon === hackathon) ? "block" : "none";
  });
}

// Judge Specific Results
const CURRENT_JUDGE = localStorage.getItem("judgeName");

function showJudgeResults() {
  const rows = document.querySelectorAll("#resultsTableBody tr");
  rows.forEach(row => {
    const judge = row.getAttribute("data-judge");
    row.style.display = (judge === CURRENT_JUDGE) ? "table-row" : "none";
  });
}

// Judge Form Modal
function showJudgeForm() {
  const container = document.getElementById("judgeFormContainer");
  if (!container) return;
  container.style.display = container.style.display === "block" ? "none" : "block";
  if (container.style.display === "block") {
    container.scrollIntoView({ behavior: "smooth" });
  }
}

// Load Hackathons
const hackathons = [
  {
    name: "CodeFest 2025",
    theme: "AI + Innovation",
    date: "July 10–12, 2025",
    participants: 50,
    description: "AI hackathon for ML & Robotics innovation.",
    prizes: "1st: ₹50,000 | 2nd: ₹30,000 | 3rd: ₹15,000"
  },
  {
    name: "AI Innovation Challenge",
    theme: "Machine Learning",
    date: "July 15–18, 2025",
    participants: 35,
    description: "Applied ML + data science competition.",
    prizes: "1st: ₹75,000 | 2nd: ₹40,000"
  },
  {
    name: "Mobile App Hackathon",
    theme: "Mobility & UI/UX",
    date: "July 22–24, 2025",
    participants: 40,
    description: "Build intuitive mobile apps with great UX.",
    prizes: "1st: ₹60,000 | 2nd: ₹35,000 | 3rd: ₹20,000"
  }
];

function loadHackathons() {
  const list = document.getElementById("hackathonList");
  if (!list) return;
  list.innerHTML = "";

  hackathons.forEach((hack, index) => {
    const card = document.createElement("div");
    card.className = "stat-card";
    card.innerHTML = `
      <h3>${hack.name}</h3>
      <p><strong>Theme:</strong> ${hack.theme}</p>
      <p><strong>Date:</strong> ${hack.date}</p>
      <p><strong>Participants:</strong> ${hack.participants}</p>
      <div style="margin-top: 1rem; display: flex; gap: 0.5rem; justify-content: center;">
        <button onclick="viewDetails(${index})">View Details</button>
        <button onclick="showJudgeForm()">Apply as Judge</button>
      </div>
    `;
    list.appendChild(card);
  });
}

function viewDetails(index) {
  const hack = hackathons[index];
  const modal = document.getElementById("hackathonModal");
  const content = document.getElementById("modalContent");
  if (!modal || !content) return;

  content.innerHTML = `
    <h2>${hack.name}</h2>
    <p><strong>Theme:</strong> ${hack.theme}</p>
    <p><strong>Date:</strong> ${hack.date}</p>
    <p><strong>Participants:</strong> ${hack.participants}</p>
    <p><strong>Description:</strong><br>${hack.description}</p>
    <p><strong>Prizes:</strong> ${hack.prizes}</p>
  `;

  modal.style.display = "flex";
}

function closeModal() {
  const modal = document.getElementById("hackathonModal");
  if (modal) modal.style.display = "none";
}

function loginJudge() {
  const judgeName = "Dr. Rahul Kumar";
  localStorage.setItem("judgeName", judgeName);
  window.location.href = "judge_dashboard.html";
}

document.addEventListener("DOMContentLoaded", () => {
  const tbody = document.getElementById("resultsTableBody");
  if (!tbody) return;

  // 1. Get all saved evaluations
  let results = JSON.parse(localStorage.getItem("evaluations") || "[]");

  // 2. Sort by score descending
  results.sort((a, b) => b.score - a.score);

  // 3. Populate rows
  results.forEach((entry, index) => {
    const row = document.createElement("tr");

    const rankClass =
      index === 0 ? "rank-1" :
      index === 1 ? "rank-2" :
      index === 2 ? "rank-3" : "rank-other";

    row.innerHTML = `
     <td><span class="rank-badge ${rankClass}">${index + 1}</span></td>
      <td>${entry.team}</td>
      <td>${entry.project}</td>
      <td class="editable-score"><strong>${entry.score}/100</strong></td>
      <td class="editable-comment">${entry.comment}</td>
      <td><span class="project-status status-in-review">${entry.status}</span></td>
      <td><button class="delete-btn">❌</button></td>
      <td><button class="edit-btn">🖊️</button></td>
    `;


    // 🗑️ Add delete function to the button
    row.querySelector(".delete-btn").addEventListener("click", () => {
      // Remove from DOM
      row.remove();

      // Remove from localStorage
      results = results.filter(r =>
        !(r.team === entry.team && r.project === entry.project && r.score === entry.score)
      );
      localStorage.setItem("evaluations", JSON.stringify(results));

      alert(`🗑️ Removed: ${entry.team} - ${entry.project}`);
      location.reload(); // Reload to reassign ranks
    });
    // ✏️ EDIT FUNCTION
    row.querySelector(".edit-btn").addEventListener("click", () => {
      const scoreCell = row.querySelector(".editable-score");
      const commentCell = row.querySelector(".editable-comment");

      const currentScore = entry.score;
      const currentComment = entry.comment;

      scoreCell.innerHTML = `<input type="number" min="0" max="100" value="${currentScore}" style="width:80px;">`;
      commentCell.innerHTML = `<input type="text" value="${currentComment}" style="width:100%;">`;

      const editBtn = row.querySelector(".edit-btn");
      editBtn.textContent = "💾";
      editBtn.title = "Save";

      editBtn.onclick = () => {
        const newScore = parseInt(scoreCell.querySelector("input").value);
        const newComment = commentCell.querySelector("input").value.trim();

        if (isNaN(newScore) || newComment === "") {
          alert("⚠️ Please enter valid values.");
          return;
        }

        scoreCell.innerHTML = `<strong>${newScore}/100</strong>`;
        commentCell.textContent = newComment;
        editBtn.textContent = "🖊️";
        editBtn.title = "Edit";

       const matchIndex = results.findIndex(r =>
           r.team === entry.team && r.project === entry.project
              );


        if (matchIndex !== -1) {
          results[matchIndex].score = newScore;
          results[matchIndex].comment = newComment;
          localStorage.setItem("evaluations", JSON.stringify(results));
          alert("✅ Changes saved!");
          location.reload();
        }
      };
    });


    tbody.appendChild(row);
  });
});
// ✅ Custom hackathon data for Home Page
const homeHackathons = [
  {
    id: 101,
    hackathonTitle: "CodeFest 2025",
    organizerName: "InnovateX",
    hackathonDate: "2025-07-15",
    status: "upcoming",
    expertiseAreas: ["AI", "Web Dev"],
    description: "National coding challenge on AI & Web innovation.",
    timeline: "July 15-17, 2025",
    duration: "48 hours",
    venue: "Online",
    prizes: "₹1,00,000 total",
    participants: "500+ expected"
  },
  {
    id: 102,
    hackathonTitle: "DevSprint",
    organizerName: "TechMinds",
    hackathonDate: "2025-08-01",
    status: "open",
    expertiseAreas: ["Blockchain", "Security"],
    description: "Secure coding sprint for blockchain tech.",
    timeline: "Aug 1-3, 2025",
    duration: "72 hours",
    venue: "Mumbai",
    prizes: "₹75,000 + Goodies",
    participants: "300+"
  }
];

// ✅ Function to create Home Page cards (like My Applications)
function createHomeHackathonCard(hackathon) {
  return `
    <div class="hackathon-card">
      <h3 class="hackathon-title">${hackathon.hackathonTitle}</h3>
      
      <div class="application-info">
        <div class="info-item">
          <div class="info-label">Organizer</div>
          <div class="info-value">${hackathon.organizerName}</div>
        </div>
        <div class="info-item">
          <div class="info-label">Hackathon Date</div>
          <div class="info-value">${new Date(hackathon.hackathonDate).toLocaleDateString()}</div>
        </div>
        <div class="info-item">
          <div class="info-label">Status</div>
          <div class="info-value"><span class="status-badge">${hackathon.status}</span></div>
        </div>
      </div>

      <div class="expertise-tags">
        ${hackathon.expertiseAreas.map(area => `<span class="expertise-tag">${area}</span>`).join('')}
      </div>

      <div class="action-buttons">
        <button class="btn btn-secondary" onclick="viewHomeHackathonDetails(${hackathon.id})">View Details</button>
      </div>
    </div>
  `;
}
function createHomeHackathonCard(hackathon) {
  return `
    <div class="hackathon-card">
      <h3 class="hackathon-title">${hackathon.hackathonTitle}</h3>
      
      <div class="application-info">
        <div class="info-item">
          <div class="info-label">Organizer</div>
          <div class="info-value">${hackathon.organizerName}</div>
        </div>
        <div class="info-item">
          <div class="info-label">Hackathon Date</div>
          <div class="info-value">${new Date(hackathon.hackathonDate).toLocaleDateString()}</div>
        </div>
        <div class="info-item">
          <div class="info-label">Status</div>
          <div class="info-value"><span class="status-badge">${hackathon.status}</span></div>
        </div>
      </div>

      <div class="expertise-tags">
        ${hackathon.expertiseAreas.map(area => `<span class="expertise-tag">${area}</span>`).join('')}
      </div>

      <div class="action-buttons">
        <button class="btn btn-secondary" onclick="viewHomeHackathonDetails(${hackathon.id})">View Details</button>
        <button class="btn btn-primary" onclick="showJudgeForm()">Apply as Judge</button>
      </div>
    </div>
  `;
}

// ✅ Render Home Hackathon Cards into #hackathonList
function renderHomeHackathons() {
  const list = document.getElementById('hackathonList');
  if (!list) return;
  list.innerHTML = homeHackathons.map(createHomeHackathonCard).join('');
}

// ✅ View Details logic (opens modal)
function viewHomeHackathonDetails(id) {
  const hackathon = homeHackathons.find(h => h.id === id);
  if (!hackathon) return;

  const modal = document.getElementById('hackathonModal');
  const content = document.getElementById('modalContent');

  content.innerHTML = `
    <h2>${hackathon.hackathonTitle}</h2>
    <p><strong>Organizer:</strong> ${hackathon.organizerName}</p>
    <p><strong>Date:</strong> ${new Date(hackathon.hackathonDate).toLocaleDateString()}</p>
    <p><strong>Status:</strong> ${hackathon.status}</p>
    <p><strong>Expertise:</strong> ${hackathon.expertiseAreas.join(', ')}</p>
    <p><strong>Description:</strong> ${hackathon.description}</p>
    <p><strong>Timeline:</strong> ${hackathon.timeline}</p>
    <p><strong>Duration:</strong> ${hackathon.duration}</p>
    <p><strong>Venue:</strong> ${hackathon.venue}</p>
    <p><strong>Prizes:</strong> ${hackathon.prizes}</p>
    <p><strong>Participants:</strong> ${hackathon.participants}</p>
  `;

  modal.style.display = 'flex';
}


document.addEventListener('DOMContentLoaded', () => {
  const list = document.getElementById("hackathonList");
  if (list) {
    renderHomeHackathons(); // ✅ Use your new function
  }
});

  
window.addEventListener("beforeunload", () => {
  localStorage.removeItem("selectedHackathon");

  });
   
        // Sample judge applications data
        const judgeApplications = [
            {
                id: 1,
                hackathonTitle: "AI Innovation Challenge 2024",
                appliedDate: "2024-12-15",
                status: "approved",
                expertiseAreas: ["Machine Learning", "Deep Learning", "Computer Vision"],
                organizerName: "Tech Corp",
                hackathonDate: "2025-01-20",
                description: "A comprehensive hackathon focusing on AI innovations and real-world applications. This event brings together the brightest minds in artificial intelligence to solve complex problems and create innovative solutions.",
                requirements: "Minimum 3 years experience in AI/ML field, Published research papers preferred, Strong background in Python and relevant frameworks",
                venue: "Tech Hub, Silicon Valley",
                prizes: "$50,000 total prize pool",
                participants: "500+ expected participants",
                duration: "48 hours",
                timeline: "Jan 20-22, 2025",
                organizer: {
                    name: "Tech Corp",
                    email: "events@techcorp.com",
                    phone: "+1-555-0123"
                }
            },
            {
                id: 2,
                hackathonTitle: "Web Development Marathon",
                appliedDate: "2024-12-20",
                status: "pending",
                expertiseAreas: ["React", "Node.js", "Full Stack Development"],
                organizerName: "WebDev Community",
                hackathonDate: "2025-02-10",
                description: "A intensive web development hackathon where participants will build innovative web applications using modern technologies. Focus on creating responsive, scalable, and user-friendly web solutions.",
                requirements: "Strong knowledge of JavaScript, Experience with React/Vue/Angular, Understanding of backend technologies, Portfolio of previous projects",
                venue: "Innovation Center, Austin",
                prizes: "$30,000 total prize pool",
                participants: "300+ expected participants",
                duration: "36 hours",
                timeline: "Feb 10-12, 2025",
                organizer: {
                    name: "WebDev Community",
                    email: "hello@webdevcommunity.org",
                    phone: "+1-555-0456"
                }
            },
            {
                id: 3,
                hackathonTitle: "Blockchain & Crypto Summit",
                appliedDate: "2024-12-10",
                status: "rejected",
                expertiseAreas: ["Blockchain", "Cryptocurrency", "Smart Contracts"],
                organizerName: "CryptoTech Inc",
                hackathonDate: "2025-01-15",
                description: "Exploring the future of blockchain technology and cryptocurrency. Participants will work on projects involving DeFi, NFTs, and innovative blockchain solutions that can transform industries.",
                requirements: "Deep understanding of blockchain technology, Experience with Solidity or similar smart contract languages, Knowledge of crypto protocols, Previous blockchain project experience",
                venue: "Crypto Hub, New York",
                prizes: "$75,000 total prize pool",
                participants: "200+ expected participants",
                duration: "72 hours",
                timeline: "Jan 15-18, 2025",
                organizer: {
                    name: "CryptoTech Inc",
                    email: "events@cryptotech.com",
                    phone: "+1-555-0789"
                }
            },
            {
                id: 4,
                hackathonTitle: "Mobile App Innovation Challenge",
                appliedDate: "2024-12-25",
                status: "approved",
                expertiseAreas: ["Flutter", "React Native", "Mobile UI/UX"],
                organizerName: "Mobile First Labs",
                hackathonDate: "2025-03-05",
                description: "Creating the next generation of mobile applications with focus on user experience, performance, and innovative features. This hackathon encourages cross-platform development and creative problem-solving.",
                requirements: "Proficiency in Flutter or React Native, Strong understanding of mobile app architecture, Experience with app store deployment, UI/UX design knowledge",
                venue: "Mobile Tech Center, San Francisco",
                prizes: "$40,000 total prize pool",
                participants: "400+ expected participants",
                duration: "60 hours",
                timeline: "Mar 5-8, 2025",
                organizer: {
                    name: "Mobile First Labs",
                    email: "hackathon@mobilefirstlabs.com",
                    phone: "+1-555-0321"
                }
            }
        ];

        function getStatusBadge(status) {
            const statusClasses = {
                approved: 'status-approved',
                pending: 'status-pending',
                rejected: 'status-rejected'
            };
            return `<span class="status-badge ${statusClasses[status]}">${status}</span>`;
        }

        function createExpertiseTags(areas) {
            return areas.map(area => `<span class="expertise-tag">${area}</span>`).join('');
        }

        function createApplicationCard(application) {
            const canEvaluate = application.status === 'approved';
          const evaluateButton = canEvaluate ? 
  `<button class="btn btn-primary" onclick="alert('✅ Evaluation ready for ${application.hackathonTitle}');">Evaluate Projects</button>` : '';



            return `
                <div class="hackathon-card">
                    <h3 class="hackathon-title">${application.hackathonTitle}</h3>
                    
                    <div class="application-info">
                        <div class="info-item">
                            <div class="info-label">Applied Date</div>
                            <div class="info-value">${new Date(application.appliedDate).toLocaleDateString()}</div>
                        </div>
                        <div class="info-item">
                            <div class="info-label">Organizer</div>
                            <div class="info-value">${application.organizerName}</div>
                        </div>
                        <div class="info-item">
                            <div class="info-label">Hackathon Date</div>
                            <div class="info-value">${new Date(application.hackathonDate).toLocaleDateString()}</div>
                        </div>
                        <div class="info-item">
                            <div class="info-label">Status</div>
                            <div class="info-value">${getStatusBadge(application.status)}</div>
                        </div>
                    </div>

                    <div class="expertise-tags">
                        ${createExpertiseTags(application.expertiseAreas)}
                    </div>

                    <div class="action-buttons">
                        <button class="btn btn-secondary" onclick="viewDetails(${application.id})">View Details</button>
                        ${evaluateButton}
                    </div>
                </div>
            `;
        }
        

        function renderApplications() {
            const grid = document.getElementById('applicationsGrid');
            const noApplications = document.getElementById('noApplications');

            if (judgeApplications.length === 0) {
                grid.style.display = 'none';
                noApplications.style.display = 'block';
            } else {
                grid.innerHTML = judgeApplications.map(createApplicationCard).join('');
                noApplications.style.display = 'none';
            }
        }

        function viewDetails(applicationId) {
            const application = judgeApplications.find(app => app.id === applicationId);
            if (!application) return;

            const modal = document.getElementById('detailModal');
            const modalTitle = document.getElementById('modalTitle');
            const modalContent = document.getElementById('modalContent');

            modalTitle.textContent = application.hackathonTitle;
            
            modalContent.innerHTML = `
                <div class="detail-section">
                    <h3>Application Information</h3>
                    <div class="detail-item">
                        <strong>Status:</strong>
                        <span>${getStatusBadge(application.status)}</span>
                    </div>
                    <div class="detail-item">
                        <strong>Applied Date:</strong>
                        <span>${new Date(application.appliedDate).toLocaleDateString()}</span>
                    </div>
                    <div class="detail-item">
                        <strong>Expertise Areas:</strong>
                        <span>${application.expertiseAreas.join(', ')}</span>
                    </div>
                </div>

                <div class="detail-section">
                    <h3>Hackathon Details</h3>
                    <div class="detail-item">
                        <strong>Description:</strong>
                        <span>${application.description}</span>
                    </div>
                    <div class="detail-item">
                        <strong>Date & Duration:</strong>
                        <span>${application.timeline} (${application.duration})</span>
                    </div>
                    <div class="detail-item">
                        <strong>Venue:</strong>
                        <span>${application.venue}</span>
                    </div>
                    <div class="detail-item">
                        <strong>Expected Participants:</strong>
                        <span>${application.participants}</span>
                    </div>
                    <div class="detail-item">
                        <strong>Prize Pool:</strong>
                        <span>${application.prizes}</span>
                    </div>
                </div>

                <div class="detail-section">
                    <h3>Judge Requirements</h3>
                    <div class="detail-item">
                        <strong>Requirements:</strong>
                        <span>${application.requirements}</span>
                    </div>
                </div>

                <div class="detail-section">
                    <h3>Organizer Information</h3>
                    <div class="detail-item">
                        <strong>Organization:</strong>
                        <span>${application.organizer.name}</span>
                    </div>
                    <div class="detail-item">
                        <strong>Email:</strong>
                        <span>${application.organizer.email}</span>
                    </div>
                    <div class="detail-item">
                        <strong>Phone:</strong>
                        <span>${application.organizer.phone}</span>
                    </div>
                </div>
            `;

            modal.style.display = 'block';
        }

        function evaluateProjects(applicationId) {
            const application = judgeApplications.find(app => app.id === applicationId);
            if (application && application.status === 'approved') {
                alert(`Redirecting to evaluate projects for: ${application.hackathonTitle}`);
                // Here you would typically redirect to the evaluation page
                // window.location.href = `/evaluate/${applicationId}`;
            }
        }

        

        // Modal functionality
        document.addEventListener('DOMContentLoaded', function() {
            const modal = document.getElementById('detailModal');
            const closeBtn = document.getElementsByClassName('close')[0];

            closeBtn.onclick = function() {
                modal.style.display = 'none';
            }

            window.onclick = function(event) {
                if (event.target == modal) {
                    modal.style.display = 'none';
                }
            }

            // Initial render
            renderApplications();
        });
 
        // Sample data for demonstration
        let evaluationData = [
            {
                id: 1,
                projectName: "EcoTracker",
                teamName: "Green Warriors",
                scores: {
                    innovation: 18,
                    technical: 16,
                    presentation: 17,
                    feasibility: 15
                },
                comments: [
                    {
                        judge: "Dr. Smith",
                        comment: "Excellent environmental focus with innovative tracking features."
                    },
                    {
                        judge: "Prof. Johnson",
                        comment: "Strong technical implementation, good use of IoT sensors."
                    }
                ],
                status: "draft"
            },
            {
                id: 2,
                projectName: "SmartHealth",
                teamName: "MedTech Innovators",
                scores: {
                    innovation: 19,
                    technical: 18,
                    presentation: 16,
                    feasibility: 17
                },
                comments: [
                    {
                        judge: "Dr. Smith",
                        comment: "Revolutionary approach to health monitoring."
                    },
                    {
                        judge: "Prof. Johnson",
                        comment: "Impressive AI integration and user interface."
                    }
                ],
                status: "draft"
            },
            {
                id: 3,
                projectName: "CityFlow",
                teamName: "Urban Solvers",
                scores: {
                    innovation: 15,
                    technical: 17,
                    presentation: 18,
                    feasibility: 16
                },
                comments: [
                    {
                        judge: "Dr. Smith",
                        comment: "Great solution for urban traffic management."
                    },
                    {
                        judge: "Prof. Johnson",
                        comment: "Well-presented with clear implementation roadmap."
                    }
                ],
                status: "draft"
            },
            {
                id: 4,
                projectName: "LearnAI",
                teamName: "EduTech Pioneers",
                scores: {
                    innovation: 16,
                    technical: 15,
                    presentation: 15,
                    feasibility: 14
                },
                comments: [
                    {
                        judge: "Dr. Smith",
                        comment: "Good concept for personalized learning."
                    },
                    {
                        judge: "Prof. Johnson",
                        comment: "Needs more technical depth but shows promise."
                    }
                ],
                status: "draft"
            }
        ];

        let currentEditingId = null;

        function calculateTotal(scores) {
            return Object.values(scores).reduce((sum, score) => sum + score, 0);
        }

        function sortByScore(data) {
            return data.sort((a, b) => calculateTotal(b.scores) - calculateTotal(a.scores));
        }

        function getRankBadgeClass(rank) {
            if (rank === 1) return 'gold';
            if (rank === 2) return 'silver';
            if (rank === 3) return 'bronze';
            return '';
        }

        function renderResults() {
            const sortedData = sortByScore([...evaluationData]);
            const resultsContent = document.getElementById('resultsContent');
            
            if (sortedData.length === 0) {
                resultsContent.innerHTML = `
                    <div class="empty-state">
                        <i class="fas fa-clipboard-list"></i>
                        <h3>No Evaluations Found</h3>
                        <p>No project evaluations have been submitted yet.</p>
                    </div>
                `;
                return;
            }

            resultsContent.innerHTML = sortedData.map((item, index) => {
                const rank = index + 1;
                const totalScore = calculateTotal(item.scores);
                const maxScore = 80; // 4 criteria × 20 points each
                
                return `
                    <div class="result-item" data-id="${item.id}">
                        <div class="rank-badge ${getRankBadgeClass(rank)}">${rank}</div>
                        
                        <div class="project-header">
                            <div class="project-info">
                                <h3>${item.projectName}</h3>
                                <div class="team-name">Team: ${item.teamName}</div>
                                <span class="status-badge ${item.status === 'published' ? 'status-published' : 'status-draft'}">
                                    ${item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                                </span>
                            </div>
                            <div class="score-display">
                                <div class="total-score">${totalScore}/${maxScore}</div>
                                <div>${((totalScore/maxScore)*100).toFixed(1)}%</div>
                            </div>
                        </div>

                        <div class="score-breakdown">
                            <div class="score-item">
                                <label>Innovation</label>
                                <div class="score">${item.scores.innovation}/20</div>
                            </div>
                            <div class="score-item">
                                <label>Technical</label>
                                <div class="score">${item.scores.technical}/20</div>
                            </div>
                            <div class="score-item">
                                <label>Presentation</label>
                                <div class="score">${item.scores.presentation}/20</div>
                            </div>
                            <div class="score-item">
                                <label>Feasibility</label>
                                <div class="score">${item.scores.feasibility}/20</div>
                            </div>
                        </div>

                        <div class="comments-section">
                            <h4><i class="fas fa-comments"></i> Judge Comments</h4>
                            ${item.comments.map(comment => `
                                <div class="comment">
                                    <div class="comment-author">${comment.judge}</div>
                                    <div>${comment.comment}</div>
                                </div>
                            `).join('')}
                        </div>

                        <button class="edit-btn" onclick="editResult(${item.id})">
                            <i class="fas fa-edit"></i> Edit Evaluation
                        </button>

                        <div id="editForm-${item.id}" class="edit-form" style="display: none;">
                            <h4>Edit Evaluation</h4>
                            <div class="score-inputs">
                                <div class="form-group">
                                    <label>Innovation (0-20)</label>
                                    <input type="number" min="0" max="20" value="${item.scores.innovation}" id="innovation-${item.id}">
                                </div>
                                <div class="form-group">
                                    <label>Technical (0-20)</label>
                                    <input type="number" min="0" max="20" value="${item.scores.technical}" id="technical-${item.id}">
                                </div>
                                <div class="form-group">
                                    <label>Presentation (0-20)</label>
                                    <input type="number" min="0" max="20" value="${item.scores.presentation}" id="presentation-${item.id}">
                                </div>
                                <div class="form-group">
                                    <label>Feasibility (0-20)</label>
                                    <input type="number" min="0" max="20" value="${item.scores.feasibility}" id="feasibility-${item.id}">
                                </div>
                            </div>
                            
                            <div class="form-group">
                                <label>Additional Comments</label>
                                <textarea id="newComment-${item.id}" placeholder="Add your comments here..."></textarea>
                            </div>

                            <div class="form-actions">
                                <button class="save-btn" onclick="saveEdit(${item.id})">
                                    <i class="fas fa-save"></i> Save Changes
                                </button>
                                <button class="cancel-btn" onclick="cancelEdit(${item.id})">
                                    <i class="fas fa-times"></i> Cancel
                                </button>
                            </div>
                        </div>
                    </div>
                `;
            }).join('');
        }

        function editResult(id) {
            if (currentEditingId && currentEditingId !== id) {
                cancelEdit(currentEditingId);
            }
            
            currentEditingId = id;
            const editForm = document.getElementById(`editForm-${id}`);
            editForm.style.display = 'block';
            
            // Scroll to the edit form
            editForm.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }

        function cancelEdit(id) {
            const editForm = document.getElementById(`editForm-${id}`);
            editForm.style.display = 'none';
            currentEditingId = null;
        }

        function saveEdit(id) {
            const innovation = parseInt(document.getElementById(`innovation-${id}`).value);
            const technical = parseInt(document.getElementById(`technical-${id}`).value);
            const presentation = parseInt(document.getElementById(`presentation-${id}`).value);
            const feasibility = parseInt(document.getElementById(`feasibility-${id}`).value);
            const newComment = document.getElementById(`newComment-${id}`).value.trim();

            // Validate scores
            if ([innovation, technical, presentation, feasibility].some(score => score < 0 || score > 20)) {
                alert('All scores must be between 0 and 20');
                return;
            }

            // Update the data
            const itemIndex = evaluationData.findIndex(item => item.id === id);
            if (itemIndex !== -1) {
                evaluationData[itemIndex].scores = {
                    innovation,
                    technical,
                    presentation,
                    feasibility
                };

                // Add new comment if provided
                if (newComment) {
                    evaluationData[itemIndex].comments.push({
                        judge: "Current Judge",
                        comment: newComment
                    });
                }

                // Re-render results
                renderResults();
                currentEditingId = null;
                
                // Show success message
                alert('Evaluation updated successfully!');
            }
        }

        function publishResults() {
            if (confirm('Are you sure you want to publish all results? This action cannot be undone.')) {
                evaluationData.forEach(item => {
                    item.status = 'published';
                });
                renderResults();
                alert('All results have been published successfully!');
            }
        }

        function searchResults() {
            const searchTerm = document.getElementById('searchInput').value.toLowerCase();
            const resultItems = document.querySelectorAll('.result-item');
            
            resultItems.forEach(item => {
                const projectName = item.querySelector('h3').textContent.toLowerCase();
                const teamName = item.querySelector('.team-name').textContent.toLowerCase();
                
                if (projectName.includes(searchTerm) || teamName.includes(searchTerm)) {
                    item.style.display = 'block';
                } else {
                    item.style.display = 'none';
                }
            });
        }

        // Event listeners
        document.getElementById('publishBtn').addEventListener('click', publishResults);
        document.getElementById('searchInput').addEventListener('input', searchResults);

        // Initial render
        renderResults();

