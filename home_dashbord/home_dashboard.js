document.addEventListener('DOMContentLoaded', () => {
    const jobSearchInput = document.getElementById('jobSearch');
    const jobCardsContainer = document.getElementById('jobCardsContainer');
    let allJobs = [];

    // Example API URL (replace with your real endpoint)
    const apiURL = 'http://194.24.161.189:8080/jobs/all';

    // Fetch jobs from API
    fetch(apiURL)
        .then(response => {
            if (!response.ok) throw new Error('Network response was not ok');
            return response.json();
        })
        .then(data => {
            allJobs = data;
            renderJobCards(allJobs);
        })
        .catch(error => {
            console.error('Error fetching jobs:', error);
            jobCardsContainer.innerHTML = '<p class="error">Failed to load job postings.</p>';
        });

    // Render job cards dynamically
    function renderJobCards(jobs) {
        if (jobs.length === 0) {
            jobCardsContainer.innerHTML = '<p>No job postings found.</p>';
            return;
        }

        jobCardsContainer.innerHTML = jobs.map(job => `
            <div class="job-card">
                <div class="job-header">
                    <span class="new-label">New</span>
                    <h3>${job.title}</h3>
                    <p>${job.company}</p>
                </div>
                <h4>${job.position}</h4>
                <p>📍 ${job.location}</p>
                <span class="remote">${job.remote ? 'Remote' : 'On-site'}</span>
                <p>💼 ${job.experience}</p>
                <p>📅 ${job.postedDate} / ${job.duration}</p>
                <div class="tags">
                    ${job.tags.map(tag => `<span>${tag}</span>`).join('')}
                </div>
                <p class="description">"${job.description}"</p>
                <button class="view-details">View Details</button>
            </div>
        `).join('');
    }

    // Search filter
    jobSearchInput.addEventListener('input', () => {
        const searchTerm = jobSearchInput.value.trim().toLowerCase();

        const filteredJobs = allJobs.filter(job =>
            `${job.title} ${job.company} ${job.position} ${job.location} ${job.tags.join(' ')}`.toLowerCase()
                .includes(searchTerm)
        );

        renderJobCards(filteredJobs);
    });
});
