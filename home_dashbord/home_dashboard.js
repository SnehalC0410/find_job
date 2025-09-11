document.addEventListener('DOMContentLoaded', () => {
    const jobSearchInput = document.getElementById('jobSearch');
    const jobCardsContainer = document.getElementById('jobCardsContainer');
    let allJobs = [];

    const remotiveApiURL = 'https://remotive.com/api/remote-jobs';
    const searchAPI = 'https://yourdomain.com/api/jobs/search';

    // Function to fetch jobs (GET or POST)
    function fetchJobs(apiURL, method = 'GET', payload = null) {
        const options = {
            method,
            headers: { 'Content-Type': 'application/json' }
        };

        if (method === 'POST' && payload) {
            options.body = JSON.stringify(payload);
        }

        return fetch(apiURL, options)
            .then(response => {
                if (!response.ok) throw new Error('Network error');
                return response.json();
            });
    }

    // Fetch all jobs using the GET API
    fetchJobs(remotiveApiURL)
        .then(data => {
            allJobs = data.jobs;
            renderJobCards(allJobs);
        })
        .catch(error => {
            console.error('Error:', error);
            jobCardsContainer.innerHTML = '<p class="error">Failed to load job postings.</p>';
        });

    // Render job cards
    function renderJobCards(jobs) {
        if (jobs.length === 0) {
            jobCardsContainer.innerHTML = '<p>No job postings found.</p>';
            return;
        }

        jobCardsContainer.innerHTML = jobs.map(job => `
            <div style="background: #fff; padding: 1.5rem; border-radius: 12px;">
                <h3>${job.title}</h3>
                <p>${job.company_name}</p>
                <p>📍 ${job.candidate_required_location}</p>
                <span>${job.remote ? 'Remote' : 'On-site'}</span>
                <p>💼 ${job.category}</p>
                <p>📅 Published: ${new Date(job.publication_date).toLocaleDateString()}</p>
                <p>"${job.description.substring(0, 200)}..."</p>
                <a href="${job.url}" target="_blank">View Job</a>
            </div>
        `).join('');
    }

    // Search logic with POST API fallback
    jobSearchInput.addEventListener('input', () => {
        const searchTerm = jobSearchInput.value.trim();

        // If the search term is empty, show all jobs
        if (searchTerm === '') {
            renderJobCards(allJobs);
            return;
        }

        // POST API search (If available)
        const searchPayload = { keyword: searchTerm };

        fetchJobs(searchAPI, 'POST', searchPayload)
            .then(data => {
                allJobs = data.jobs || data;
                renderJobCards(allJobs);
            })
            .catch(() => {
                // Fallback to local filtering of all jobs if the POST request fails
                const filteredJobs = allJobs.filter(job =>
                    `${job.title} ${job.company_name} ${job.category} ${job.candidate_required_location}`.toLowerCase()
                        .includes(searchTerm.toLowerCase())
                );
                renderJobCards(filteredJobs);
            });
    });
});
