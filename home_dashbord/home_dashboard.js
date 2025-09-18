document.addEventListener('DOMContentLoaded', () => {
    const sidebar = document.querySelector('.sidebar');
    const toggleArrow = document.querySelector('.toggle-arrow');
    const jobSearchInput = document.getElementById('jobSearch');
    const jobCardsContainer = document.getElementById('jobCardsContainer');
    let allJobs = [];
    const remotiveApiURL = 'https://remotive.com/api/remote-jobs';

    // Toggle Sidebar Collapse/Expand
    toggleArrow.addEventListener('click', () => {
        sidebar.classList.toggle('collapsed');
    });

    function showLoading() {
        jobCardsContainer.innerHTML = '<p>Loading job listings...</p>';
    }

    function fetchJobs(apiURL) {
        console.log("Fetching jobs from:", apiURL);

        return fetch(apiURL)
            .then(response => {
                console.log("Response status:", response.status);
                if (!response.ok) {
                    throw new Error(`Network error: ${response.statusText}`);
                }
                return response.json();
            })
            .then(data => {
                console.log("Data fetched successfully:", data);
                return data;
            })
            .catch(error => {
                console.error("Error fetching data:", error);
                alert("Error fetching job listings. Please try again later.");
                throw error;
            });
    }

    function loadAllJobs() {
        showLoading();
        fetchJobs(remotiveApiURL)
            .then(data => {
                allJobs = data.jobs || data;
                renderJobCards(allJobs);
            })
            .catch(() => {
                jobCardsContainer.innerHTML = '<p>Error loading job data.</p>';
            });
    }

    function renderJobCards(jobs) {
        if (jobs.length === 0) {
            jobCardsContainer.innerHTML = '<p>No job postings found.</p>';
            return;
        }

        jobCardsContainer.innerHTML = jobs.map(job => {
            const companyInitial = job.company_name ? job.company_name.charAt(0).toUpperCase() : '?';
            return `
                <div class="job-card">
                    <div class="job-card-top">
                        <div class="company-logo">${companyInitial}</div>
                        <div class="card-actions">
                            <button title="Copy Link"><img src="../assets/icons/copy_card.svg" alt="Copy"></button>
                            <button title="Share"><img src="../assets/icons/share_card.svg" alt="Share"></button>
                            <button title="External Link"><img src="../assets/icons/linkcopy_card.svg" alt="Link"></button>
                        </div>
                    </div>

                    <h3 class="job-title">${job.title}</h3>
                    <p class="job-company"><img src="../assets/icons/location_trd_card.svg" alt="Location"> ${job.candidate_required_location}</p>

                    <div class="job-info">
                        <span><strong>Type:</strong> ${job.job_type === 'full_time' ? 'Full Time' : 'Part Time'}</span>
                        <span><strong>Salary:</strong> ${job.salary || 'Not specified'}</span>
                    </div>

                    <div class="job-description">
                        ${job.description}
                    </div>

                    <a href="${job.url}" target="_blank" class="view-details-btn">Job Details</a>
                </div>
            `;
        }).join('');
    }

    jobSearchInput.addEventListener('input', () => {
        const searchTerm = jobSearchInput.value.trim();

        if (searchTerm === '') {
            renderJobCards(allJobs);
            return;
        }

        const filteredJobs = allJobs.filter(job =>
            `${job.title} ${job.company_name} ${job.category} ${job.candidate_required_location}`.toLowerCase()
                .includes(searchTerm.toLowerCase())
        );
        renderJobCards(filteredJobs);
    });

    loadAllJobs();
});
