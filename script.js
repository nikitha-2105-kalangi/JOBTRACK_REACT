// ===============================
// JOBTRACK - SIGNUP
// ===============================

const signupForm = document.getElementById("signupForm");

const signupEmail = document.getElementById("signupEmail");

if (signupEmail) {
    signupEmail.addEventListener("input", function () {
        const emailErr = document.getElementById("emailError");
        const existingEmailErr = document.getElementById("existingEmailError");
        if (emailErr) emailErr.textContent = "";
        if (existingEmailErr) existingEmailErr.textContent = "";
    });
}

const signupPassword = document.getElementById("signupPassword");
const confirmPassword = document.getElementById("confirmPassword");

if (signupPassword) {
    signupPassword.addEventListener("input", function () {
        const passErr = document.getElementById("passwordError");
        const confirmErr = document.getElementById("confirmPasswordError");
        if (passErr) passErr.textContent = "";
        if (confirmErr) confirmErr.textContent = "";
    });
}

if (confirmPassword) {
    confirmPassword.addEventListener("input", function () {
        const confirmErr = document.getElementById("confirmPasswordError");
        if (confirmErr) confirmErr.textContent = "";
    });
}

if (signupForm) {
    signupForm.addEventListener("submit", function (event) {
        event.preventDefault();

        const name = document.getElementById("signupName").value.trim();
        const email = document.getElementById("signupEmail").value.trim();

        if (!email.includes("@") || !email.includes(".")) {
            document.getElementById("emailError").textContent =
                "Please enter a valid email address.";
            return;
        }
        document.getElementById("emailError").textContent = "";

        const password = document.getElementById("signupPassword").value;
        const confirmPass = document.getElementById("confirmPassword").value;

        if (password !== confirmPass) {
            document.getElementById("confirmPasswordError").textContent =
                "Passwords do not match.";
            return;
        }
        document.getElementById("confirmPasswordError").textContent = "";

        if (password.length < 6) {
            document.getElementById("passwordError").textContent =
                "Password must be at least 6 characters long.";
            return;
        }
        document.getElementById("passwordError").textContent = "";

        let users = JSON.parse(localStorage.getItem("jobTrackUsers")) || [];

        const existingUser = users.find(function (user) {
            return user.email === email;
        });

        if (existingUser) {
            document.getElementById("existingEmailError").textContent =
                "This email address is already registered. Please log in.";
            return;
        }
        document.getElementById("existingEmailError").textContent = "";

        const newUser = {
            name: name,
            email: email,
            password: password
        };

        users.push(newUser);
        localStorage.setItem("jobTrackUsers", JSON.stringify(users));

        alert("Account created successfully!");
        window.location.href = "index.html";
    });
}

// ===============================
// JOBTRACK - LOGIN
// ===============================

const loginForm = document.getElementById("loginForm");

if (loginForm) {
    loginForm.addEventListener("submit", function (event) {
        event.preventDefault();

        const email = document.getElementById("loginEmail").value.trim();
        const password = document.getElementById("loginPassword").value;

        const users = JSON.parse(localStorage.getItem("jobTrackUsers")) || [];

        const user = users.find(function (u) {
            return u.email === email && u.password === password;
        });

        if (user) {
            localStorage.setItem("currentUser", JSON.stringify(user));
            window.location.href = "dashboard.html";
        } else {
            alert("Invalid email or password!");
        }
    });
}

// ===============================
// DASHBOARD - CURRENT USER & PROFILE
// ===============================

const welcomeMessage = document.getElementById("welcomeMessage");
const welcomeUserName = document.getElementById("welcomeUserName");
const headerUserName = document.getElementById("headerUserName");
const headerUserAvatar = document.getElementById("headerUserAvatar");
const logoutButton = document.getElementById("logoutButton");
const mobileMenuToggle = document.getElementById("mobileMenuToggle");
const sidebar = document.getElementById("sidebar");

if (mobileMenuToggle && sidebar) {
    mobileMenuToggle.addEventListener("click", function () {
        sidebar.classList.toggle("mobile-open");
    });
}

// Check logged in user on protected pages
const isDashboard = Boolean(welcomeMessage || welcomeUserName || document.getElementById("totalApplications"));

if (isDashboard) {
    const currentUser = JSON.parse(localStorage.getItem("currentUser"));

    if (!currentUser) {
        window.location.href = "index.html";
    } else {
        const rawName = currentUser.name || currentUser.fullName || "User";
        const trimmedName = rawName.trim();
        const initial = trimmedName ? trimmedName.charAt(0).toUpperCase() : "U";

        if (welcomeUserName) {
            welcomeUserName.textContent = trimmedName;
        }
        if (headerUserName) {
            headerUserName.textContent = trimmedName;
        }
        if (headerUserAvatar) {
            headerUserAvatar.textContent = initial;
        }
        if (welcomeMessage) {
            welcomeMessage.textContent = `Welcome, ${trimmedName}! 👋`;
        }
        const profileAvatarLegacy = document.querySelector(".profile-avatar");
        if (profileAvatarLegacy) {
            profileAvatarLegacy.textContent = initial;
        }
    }
}

// ===============================
// LOGOUT
// ===============================

if (logoutButton) {
    logoutButton.addEventListener("click", function () {
        localStorage.removeItem("currentUser");
        window.location.href = "index.html";
    });
}

// ===============================
// SHARED HELPER FUNCTIONS
// ===============================

function sanitizeUrl(rawUrl) {
    if (!rawUrl || typeof rawUrl !== "string") return "";
    const trimmed = rawUrl.trim();
    try {
        const validUrl = trimmed.startsWith("http://") || trimmed.startsWith("https://")
            ? trimmed
            : "https://" + trimmed;
        const parsed = new URL(validUrl);
        return (parsed.protocol === "http:" || parsed.protocol === "https:") ? parsed.href : "";
    } catch (e) {
        return "";
    }
}

function getCompanyLogoUrl(jobLink) {
    const safeUrl = sanitizeUrl(jobLink);
    if (!safeUrl) return "";
    try {
        const domain = new URL(safeUrl).hostname.replace(/^www\./, "");
        return domain ? `https://www.google.com/s2/favicons?domain=${encodeURIComponent(domain)}&sz=64` : "";
    } catch (e) {
        return "";
    }
}

function formatDisplayDate(dateStr) {
    if (!dateStr || typeof dateStr !== "string" || !dateStr.trim()) return "-";
    try {
        const d = new Date(dateStr.trim() + "T00:00:00");
        if (isNaN(d.getTime())) return dateStr;
        return d.toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric"
        });
    } catch (e) {
        return dateStr;
    }
}

function isTodayOrFuture(dateString) {
    if (!dateString) return false;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const date = new Date(dateString + "T00:00:00");
    return !isNaN(date.getTime()) && date >= today;
}

// ===============================
// JOB APPLICATION - SAVE & UPDATE
// ===============================

const jobForm = document.getElementById("jobForm");

if (jobForm) {
    // Page load auth check
    const currentAuthUser = JSON.parse(localStorage.getItem("currentUser"));
    if (!currentAuthUser) {
        window.location.href = "index.html";
    }

    jobForm.addEventListener("submit", function (event) {
        event.preventDefault();

        const currentUser = JSON.parse(localStorage.getItem("currentUser"));
        if (!currentUser) {
            alert("Please login first.");
            window.location.href = "index.html";
            return;
        }

        let applications = JSON.parse(localStorage.getItem("jobTrackApplications")) || [];
        const editingApplication = JSON.parse(localStorage.getItem("editingApplication"));

        if (editingApplication) {
            const updatedApplication = {
                id: editingApplication.id,
                userEmail: currentUser.email,
                company: document.getElementById("company").value.trim(),
                jobTitle: document.getElementById("jobTitle").value.trim(),
                location: document.getElementById("location").value.trim(),
                jobType: document.getElementById("jobType").value,
                status: document.getElementById("status").value,
                applicationDate: document.getElementById("applicationDate").value,
                interviewDate: document.getElementById("interviewDate").value,
                followUpDate: document.getElementById("followUpDate").value,
                jobLink: document.getElementById("jobLink").value.trim(),
                notes: document.getElementById("notes").value.trim()
            };

            const index = applications.findIndex(function (app) {
                return app.id === editingApplication.id;
            });

            if (index !== -1) {
                applications[index] = updatedApplication;
            }

            localStorage.removeItem("editingApplication");
            alert("Application updated successfully!");
        } else {
            const newApplication = {
                id: Date.now(),
                userEmail: currentUser.email,
                company: document.getElementById("company").value.trim(),
                jobTitle: document.getElementById("jobTitle").value.trim(),
                location: document.getElementById("location").value.trim(),
                jobType: document.getElementById("jobType").value,
                status: document.getElementById("status").value,
                applicationDate: document.getElementById("applicationDate").value,
                interviewDate: document.getElementById("interviewDate").value,
                followUpDate: document.getElementById("followUpDate").value,
                jobLink: document.getElementById("jobLink").value.trim(),
                notes: document.getElementById("notes").value.trim()
            };

            applications.push(newApplication);
            alert("Job application saved successfully!");
        }

        localStorage.setItem("jobTrackApplications", JSON.stringify(applications));
        window.location.href = "dashboard.html";
    });
}

// ===============================
// DASHBOARD - APPLICATION STATS, CHART & ACTIVITIES
// ===============================

const totalApplications = document.getElementById("totalApplications");

if (totalApplications) {
    const currentUser = JSON.parse(localStorage.getItem("currentUser"));

    if (currentUser) {
        const applications = JSON.parse(localStorage.getItem("jobTrackApplications")) || [];
        const userApplications = applications.filter(function (app) {
            return app.userEmail === currentUser.email;
        });

        // 1. Statistics Numbers
        const appliedCount = userApplications.filter(app => app.status === "Applied").length;
        const interviewCount = userApplications.filter(app => app.status === "Interview").length;
        const selectedCount = userApplications.filter(app => app.status === "Selected").length;
        const rejectedCount = userApplications.filter(app => app.status === "Rejected").length;

        document.getElementById("totalApplications").textContent = userApplications.length;
        document.getElementById("appliedApplications").textContent = appliedCount;
        document.getElementById("interviewApplications").textContent = interviewCount;
        document.getElementById("selectedApplications").textContent = selectedCount;
        document.getElementById("rejectedApplications").textContent = rejectedCount;

        // 2. Center Chart Badge & Custom Legend
        const chartCenterTotal = document.getElementById("chartCenterTotal");
        if (chartCenterTotal) {
            chartCenterTotal.textContent = userApplications.length;
        }

        const chartLegendList = document.getElementById("chartLegendList");
        if (chartLegendList) {
            const total = userApplications.length;
            const appliedPct = total ? ((appliedCount / total) * 100).toFixed(1) : "0.0";
            const interviewPct = total ? ((interviewCount / total) * 100).toFixed(1) : "0.0";
            const selectedPct = total ? ((selectedCount / total) * 100).toFixed(1) : "0.0";
            const rejectedPct = total ? ((rejectedCount / total) * 100).toFixed(1) : "0.0";

            chartLegendList.innerHTML = `
                <div class="legend-row">
                    <div class="legend-left">
                        <span class="legend-dot dot-applied"></span>
                        <span class="legend-name">Applied</span>
                    </div>
                    <span class="legend-count">${appliedCount} <span class="legend-pct">(${appliedPct}%)</span></span>
                </div>
                <div class="legend-row">
                    <div class="legend-left">
                        <span class="legend-dot dot-interview"></span>
                        <span class="legend-name">Interview</span>
                    </div>
                    <span class="legend-count">${interviewCount} <span class="legend-pct">(${interviewPct}%)</span></span>
                </div>
                <div class="legend-row">
                    <div class="legend-left">
                        <span class="legend-dot dot-selected"></span>
                        <span class="legend-name">Selected</span>
                    </div>
                    <span class="legend-count">${selectedCount} <span class="legend-pct">(${selectedPct}%)</span></span>
                </div>
                <div class="legend-row">
                    <div class="legend-left">
                        <span class="legend-dot dot-rejected"></span>
                        <span class="legend-name">Rejected</span>
                    </div>
                    <span class="legend-count">${rejectedCount} <span class="legend-pct">(${rejectedPct}%)</span></span>
                </div>
            `;
        }

        // 3. Application Status Doughnut Chart
        const chartCanvas = document.getElementById("applicationStatusChart");
        if (chartCanvas && typeof Chart !== "undefined") {
            if (window.statusChartInstance) {
                window.statusChartInstance.destroy();
            }

            const chartData = (userApplications.length === 0)
                ? [1]
                : [appliedCount, interviewCount, selectedCount, rejectedCount];
            const chartColors = (userApplications.length === 0)
                ? ["#e2e8f0"]
                : ["#38bdf8", "#fcd34d", "#34d399", "#f87171"];

            window.statusChartInstance = new Chart(chartCanvas, {
                type: "doughnut",
                data: {
                    labels: (userApplications.length === 0)
                        ? ["No Data"]
                        : ["Applied", "Interview", "Selected", "Rejected"],
                    datasets: [{
                        data: chartData,
                        backgroundColor: chartColors,
                        borderWidth: 0,
                        hoverOffset: (userApplications.length === 0) ? 0 : 5
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    cutout: "75%",
                    plugins: {
                        legend: { display: false },
                        tooltip: {
                            enabled: userApplications.length > 0,
                            callbacks: {
                                label: function (context) {
                                    return context.label + ": " + context.raw;
                                }
                            }
                        }
                    }
                }
            });
        }

        // 4. Upcoming Activities Cards
        const interviewContainer = document.getElementById("upcomingInterviews");
        if (interviewContainer) {
            const upcomingInterviews = userApplications
                .filter(app => app.interviewDate && isTodayOrFuture(app.interviewDate))
                .sort((a, b) => new Date(a.interviewDate) - new Date(b.interviewDate));

            interviewContainer.innerHTML = "";

            if (upcomingInterviews.length === 0) {
                interviewContainer.innerHTML = `
                    <div class="empty-activity-state">
                        <p>No upcoming interviews scheduled.</p>
                    </div>
                `;
            } else {
                upcomingInterviews.slice(0, 3).forEach(function (app) {
                    const item = document.createElement("div");
                    item.className = "activity-item";

                    const companyName = (app.company || "").trim();
                    const jobTitle = (app.jobTitle || "").trim();
                    const dateFormatted = formatDisplayDate(app.interviewDate);

                    item.innerHTML = `
                        <div class="activity-accent-dot dot-interview"></div>
                        <div class="activity-body">
                            <div class="activity-top-row">
                                <span class="activity-company-name"></span>
                                <span class="activity-tag tag-interview">Interview</span>
                                <span class="activity-arrow-icon">›</span>
                            </div>
                            <div class="activity-sub-row">
                                <span class="activity-job-title"></span>
                                <span class="activity-date"></span>
                            </div>
                        </div>
                    `;

                    item.querySelector(".activity-company-name").textContent = companyName;
                    item.querySelector(".activity-job-title").textContent = jobTitle;
                    item.querySelector(".activity-date").textContent = "• " + dateFormatted;

                    interviewContainer.appendChild(item);
                });
            }
        }

        const followUpContainer = document.getElementById("upcomingFollowUps");
        if (followUpContainer) {
            const upcomingFollowUps = userApplications
                .filter(function (app) {
                    const isPending = app.status === "Applied" || app.status === "Interview";
                    return isPending && app.followUpDate && isTodayOrFuture(app.followUpDate);
                })
                .sort((a, b) => new Date(a.followUpDate) - new Date(b.followUpDate));

            followUpContainer.innerHTML = "";

            if (upcomingFollowUps.length === 0) {
                followUpContainer.innerHTML = `
                    <div class="empty-activity-state">
                        <p>No upcoming follow-ups scheduled.</p>
                    </div>
                `;
            } else {
                upcomingFollowUps.slice(0, 3).forEach(function (app) {
                    const item = document.createElement("div");
                    item.className = "activity-item";

                    const companyName = (app.company || "").trim();
                    const jobTitle = (app.jobTitle || "").trim();
                    const dateFormatted = formatDisplayDate(app.followUpDate);

                    item.innerHTML = `
                        <div class="activity-accent-dot dot-followup"></div>
                        <div class="activity-body">
                            <div class="activity-top-row">
                                <span class="activity-company-name"></span>
                                <span class="activity-tag tag-followup">Follow-up</span>
                                <span class="activity-arrow-icon">›</span>
                            </div>
                            <div class="activity-sub-row">
                                <span class="activity-job-title"></span>
                                <span class="activity-date"></span>
                            </div>
                        </div>
                    `;

                    item.querySelector(".activity-company-name").textContent = companyName;
                    item.querySelector(".activity-job-title").textContent = jobTitle;
                    item.querySelector(".activity-date").textContent = "• " + dateFormatted;

                    followUpContainer.appendChild(item);
                });
            }
        }
    }
}

// ===============================
// DISPLAY APPLICATIONS - MAIN TABLE
// ===============================

const applicationsList = document.getElementById("applicationsList");

if (applicationsList) {
    const currentUser = JSON.parse(localStorage.getItem("currentUser"));

    if (currentUser) {
        function displayApplications() {
            const applications = JSON.parse(localStorage.getItem("jobTrackApplications")) || [];
            const searchInput = document.getElementById("searchApplications");
            const filterInput = document.getElementById("filterStatus");

            const searchText = searchInput ? searchInput.value.toLowerCase().trim() : "";
            const selectedStatus = filterInput ? filterInput.value : "All";

            const userApplications = applications.filter(function (app) {
                const belongsToUser = app.userEmail === currentUser.email;
                const matchesSearch =
                    (app.company && app.company.toLowerCase().includes(searchText)) ||
                    (app.jobTitle && app.jobTitle.toLowerCase().includes(searchText));
                const matchesStatus =
                    selectedStatus === "All" || app.status === selectedStatus;

                return belongsToUser && matchesSearch && matchesStatus;
            });

            applicationsList.innerHTML = "";

            // Pagination info indicator
            const paginationInfo = document.getElementById("tablePaginationInfo");
            if (paginationInfo) {
                if (userApplications.length === 0) {
                    paginationInfo.textContent = "Showing 0-0 of 0 applications";
                } else {
                    paginationInfo.textContent = `Showing 1-${userApplications.length} of ${userApplications.length} applications`;
                }
            }

            if (userApplications.length === 0) {
                const hasAnyApplications = applications.some(app => app.userEmail === currentUser.email);

                const emptyRow = document.createElement("tr");
                const emptyCell = document.createElement("td");
                emptyCell.colSpan = 9;
                emptyCell.className = "empty-table-cell";

                if (searchText || selectedStatus !== "All") {
                    emptyCell.innerHTML = `
                        <div class="empty-table-state">
                            <h4>No matching applications found</h4>
                            <p>Try adjusting your search query or status filter.</p>
                        </div>
                    `;
                } else if (!hasAnyApplications) {
                    emptyCell.innerHTML = `
                        <div class="empty-table-state">
                            <div class="empty-table-icon">💼</div>
                            <h4>Your job search starts here!</h4>
                            <p>You haven't added any applications yet. Start tracking your career journey today.</p>
                            <button type="button" class="add-job-button inline-btn" onclick="addNewJob()">
                                + Add Your First Application
                            </button>
                        </div>
                    `;
                } else {
                    emptyCell.innerHTML = `
                        <div class="empty-table-state">
                            <p>No applications found.</p>
                        </div>
                    `;
                }

                emptyRow.appendChild(emptyCell);
                applicationsList.appendChild(emptyRow);
            } else {
                userApplications.forEach(function (application) {
                    const row = document.createElement("tr");
                    row.className = "application-table-row";

                    // Static row layout structure
                    row.innerHTML = `
                        <td class="td-company">
                            <div class="table-company-cell">
                                <div class="table-company-avatar">
                                    <span class="company-initial"></span>
                                </div>
                                <span class="table-company-name"></span>
                            </div>
                        </td>
                        <td class="td-title">
                            <span class="table-job-title"></span>
                        </td>
                        <td class="td-location">
                            <span class="table-location-text"></span>
                        </td>
                        <td class="td-jobtype">
                            <span class="table-job-type"></span>
                        </td>
                        <td class="td-status">
                            <span class="status-badge"></span>
                        </td>
                        <td class="td-date">
                            <span class="table-app-date"></span>
                        </td>
                        <td class="td-date">
                            <span class="table-interview-date"></span>
                        </td>
                        <td class="td-date">
                            <span class="table-followup-date"></span>
                        </td>
                        <td class="td-actions">
                            <div class="table-action-buttons">
                                <button type="button" class="btn-action btn-edit" title="Edit Application" aria-label="Edit">
                                    <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                                        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                                    </svg>
                                </button>
                                <button type="button" class="btn-action btn-delete" title="Delete Application" aria-label="Delete">
                                    <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                        <polyline points="3 6 5 6 21 6"/>
                                        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
                                    </svg>
                                </button>
                            </div>
                        </td>
                    `;

                    // Safely set dynamic text via textContent
                    const companyName = (application.company || "").trim();
                    row.querySelector(".table-company-name").textContent = companyName;
                    row.querySelector(".table-job-title").textContent = application.jobTitle || "";
                    row.querySelector(".table-location-text").textContent = application.location || "-";
                    row.querySelector(".table-job-type").textContent = application.jobType || "-";

                    const companyInitial = companyName ? companyName.charAt(0).toUpperCase() : "?";
                    row.querySelector(".company-initial").textContent = companyInitial;

                    // Logo fallback
                    const logoUrl = getCompanyLogoUrl(application.jobLink);
                    if (logoUrl) {
                        const img = document.createElement("img");
                        img.src = logoUrl;
                        img.alt = "";
                        img.className = "table-company-logo";
                        img.loading = "lazy";
                        img.onerror = function () { this.remove(); };
                        row.querySelector(".table-company-avatar").prepend(img);
                    }

                    // Strict Status Validation
                    const ALLOWED_STATUSES = ["Applied", "Interview", "Selected", "Rejected"];
                    const validatedStatus = ALLOWED_STATUSES.includes(application.status) ? application.status : "Applied";
                    const statusBadge = row.querySelector(".status-badge");
                    statusBadge.textContent = validatedStatus;
                    statusBadge.className = "status-badge status-" + validatedStatus.toLowerCase();

                    // Application Date
                    row.querySelector(".table-app-date").textContent = formatDisplayDate(application.applicationDate);

                    // Interview Date
                    const interviewDateVal = (application.interviewDate && application.interviewDate.trim())
                        ? formatDisplayDate(application.interviewDate.trim())
                        : "-";
                    row.querySelector(".table-interview-date").textContent = interviewDateVal;

                    // Follow-up Date (only displayed if pending status, else dash)
                    const isPending = validatedStatus === "Applied" || validatedStatus === "Interview";
                    const followUpDateVal = (isPending && application.followUpDate && application.followUpDate.trim())
                        ? formatDisplayDate(application.followUpDate.trim())
                        : "-";
                    row.querySelector(".table-followup-date").textContent = followUpDateVal;

                    // Action buttons
                    row.querySelector(".btn-edit").addEventListener("click", function () {
                        editApplication(application.id);
                    });
                    row.querySelector(".btn-delete").addEventListener("click", function () {
                        deleteApplication(application.id);
                    });

                    applicationsList.appendChild(row);
                });
            }
        }

        displayApplications();

        const searchInput = document.getElementById("searchApplications");
        if (searchInput) {
            searchInput.addEventListener("input", displayApplications);
        }

        const filterInput = document.getElementById("filterStatus");
        if (filterInput) {
            filterInput.addEventListener("change", displayApplications);
        }
    }
}

// ===============================
// DELETE APPLICATION
// ===============================

function deleteApplication(applicationId) {
    const confirmDelete = confirm("Are you sure you want to delete this application?");
    if (!confirmDelete) return;

    let applications = JSON.parse(localStorage.getItem("jobTrackApplications")) || [];
    applications = applications.filter(app => app.id !== applicationId);

    localStorage.setItem("jobTrackApplications", JSON.stringify(applications));
    alert("Application deleted successfully!");
    window.location.reload();
}

// ===============================
// ADD NEW APPLICATION
// ===============================

function addNewJob() {
    localStorage.removeItem("editingApplication");
    window.location.href = "add-job.html";
}

// ===============================
// EDIT APPLICATION
// ===============================

function editApplication(applicationId) {
    const applications = JSON.parse(localStorage.getItem("jobTrackApplications")) || [];
    const application = applications.find(app => app.id === applicationId);

    if (!application) {
        alert("Application not found.");
        return;
    }

    localStorage.setItem("editingApplication", JSON.stringify(application));
    window.location.href = "add-job.html";
}

// ===============================
// LOAD APPLICATION FOR EDITING
// ===============================

const editingApplication = JSON.parse(localStorage.getItem("editingApplication"));
if (editingApplication && jobForm) {
    const formTitle = document.getElementById("formTitle");
    const saveJobButton = document.getElementById("saveJobButton");

    if (formTitle) formTitle.textContent = "Edit Job Application";
    if (saveJobButton) saveJobButton.textContent = "Update Application";

    if (document.getElementById("company")) document.getElementById("company").value = editingApplication.company || "";
    if (document.getElementById("jobTitle")) document.getElementById("jobTitle").value = editingApplication.jobTitle || "";
    if (document.getElementById("location")) document.getElementById("location").value = editingApplication.location || "";
    if (document.getElementById("jobType")) document.getElementById("jobType").value = editingApplication.jobType || "Full-Time";
    if (document.getElementById("status")) document.getElementById("status").value = editingApplication.status || "Applied";
    if (document.getElementById("applicationDate")) document.getElementById("applicationDate").value = editingApplication.applicationDate || "";
    if (document.getElementById("interviewDate")) document.getElementById("interviewDate").value = editingApplication.interviewDate || "";
    if (document.getElementById("followUpDate")) document.getElementById("followUpDate").value = editingApplication.followUpDate || "";
    if (document.getElementById("jobLink")) document.getElementById("jobLink").value = editingApplication.jobLink || "";
    if (document.getElementById("notes")) document.getElementById("notes").value = editingApplication.notes || "";
}

// ===============================
// SETTINGS PAGE
// ===============================

const displayNameField = document.getElementById("displayName");
const accountEmailField = document.getElementById("accountEmail");

if (displayNameField && accountEmailField) {
    const savedUser = localStorage.getItem("currentUser");
    if (savedUser) {
        try {
            const user = JSON.parse(savedUser);
            displayNameField.value = user.name || user.fullName || "JobTrack User";
            accountEmailField.value = user.email || "";
        } catch (error) {
            displayNameField.value = "Unable to load profile";
            accountEmailField.value = "";
        }
    } else {
        window.location.href = "index.html";
    }
}

// ===============================
// REMINDERS PAGE
// ===============================

const reminderInterviews = document.getElementById("reminderInterviews");
const reminderFollowUps = document.getElementById("reminderFollowUps");

if (reminderInterviews && reminderFollowUps) {
    const currentUser = JSON.parse(localStorage.getItem("currentUser"));

    if (!currentUser) {
        window.location.href = "index.html";
    } else {
        const allApplications = JSON.parse(localStorage.getItem("jobTrackApplications")) || [];
        const userApplications = allApplications.filter(app => app.userEmail === currentUser.email);

        function renderReminderList(container, items, dateField, emptyMessage) {
            if (items.length === 0) {
                container.innerHTML = `
                    <div class="reminder-empty">
                        ${emptyMessage}
                    </div>
                `;
                return;
            }

            container.innerHTML = items.map(function (application) {
                return `
                    <article class="reminder-item">
                        <h3>${application.company}</h3>
                        <p>${application.jobTitle}</p>
                        <p class="reminder-date">
                            ${formatDisplayDate(application[dateField])}
                        </p>
                        <p>Status: ${application.status}</p>
                    </article>
                `;
            }).join("");
        }

        const interviews = userApplications
            .filter(app => isTodayOrFuture(app.interviewDate))
            .sort((a, b) => new Date(a.interviewDate) - new Date(b.interviewDate));

        const followUps = userApplications
            .filter(app => isTodayOrFuture(app.followUpDate))
            .sort((a, b) => new Date(a.followUpDate) - new Date(b.followUpDate));

        renderReminderList(
            reminderInterviews,
            interviews,
            "interviewDate",
            "No upcoming interviews. Add an interview date to an application to see it here."
        );

        renderReminderList(
            reminderFollowUps,
            followUps,
            "followUpDate",
            "No upcoming follow-ups. Add a follow-up date to an application to see it here."
        );
    }
}