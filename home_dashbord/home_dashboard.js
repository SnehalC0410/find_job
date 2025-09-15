document.addEventListener('DOMContentLoaded', () => {
    const jobSearchInput = document.getElementById('jobSearch');
    const jobCardsContainer = document.getElementById('jobCardsContainer');
    let allJobs = [];

    const remotiveApiURL = 'https://remotive.com/api/remote-jobs';

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
                alert("There was an error fetching the job listings. Please try again later.");
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

        jobCardsContainer.innerHTML = jobs.map(job => `
            <div class="job-card">
                <div class="job-header">
                    <img src="${job.company_logo}" alt="${job.company_name} Logo" style="width: 50px; height: 50px; object-fit: contain;">
                    <h3>${job.title}</h3>
                    <p><strong>Company:</strong> ${job.company_name}</p>
                    <p>📍 <strong>Location:</strong> ${job.candidate_required_location}</p>
                    <span><strong>Type:</strong> ${job.job_type === 'full_time' ? 'Full Time' : 'Part Time'}</span><br>
                    <span><strong>Salary:</strong> ${job.salary || 'Not specified'}</span><br>
                    <p>💼 <strong>Category:</strong> ${job.category}</p>
                    <p>📅 <strong>Published:</strong> ${new Date(job.publication_date).toLocaleDateString()}</p>
                    <a href="${job.url}" target="_blank" style="color: #007BFF; text-decoration: none; font-weight: bold;">View Job</a>
                </div>
                <hr>
                <div class="job-description">
                    ${job.description}
                </div>
            </div>
        `).join('');
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
