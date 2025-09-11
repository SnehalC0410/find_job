document.addEventListener('DOMContentLoaded', () => {
    const jobSearchInput = document.getElementById('jobSearch');
    const jobCardsContainer = document.getElementById('jobCardsContainer');
    let allJobs = [];

    const apiURL = 'http://194.24.161.189:8080/jobs/all';

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

    function renderJobCards(jobs) {
        if (jobs.length === 0) {
            jobCardsContainer.innerHTML = '<p>No job postings found.</p>';
            return;
        }

        jobCardsContainer.innerHTML = jobs.map(job => `
            <div style="background-color: #ffffff; padding: 1.5rem; border-radius: 12px; max-width: 400px; box-shadow: 0 4px 12px rgba(0,0,0,0.1); display: flex; flex-direction: column; gap: 1rem; font-family: Arial, sans-serif;">
                <div style="display: flex; align-items: center; gap: 1rem;">
                    <div style="width: 40px; height: 40px; border-radius: 50%; background-color: #eef5fb; display: flex; align-items: center; justify-content: center; font-weight: bold; font-size: 1.25rem; color: #005b96;">
                        W
                    </div>
                    <div style="flex-grow: 1;">
                        <h3 style="margin: 0;">${job.title}</h3>
                        <p style="margin: 0; color: #555;">${job.company}</p>
                    </div>
                    <span style="background-color: #005b96; color: #ffffff; padding: 0.25rem 0.75rem; border-radius: 12px; font-size: 0.75rem; font-weight: bold;">New</span>
                </div>

                <p style="margin: 0;">📍 ${job.location}</p>
                <span style="background-color: #eef5fb; color: #005b96; padding: 0.25rem 0.5rem; border-radius: 8px; font-size: 0.85rem; font-weight: 500;">${job.remote ? 'Remote' : 'On-site'}</span>
                <p style="margin: 0;">💼 ${job.experience}</p>
                <p style="margin: 0;">📅 ${job.postedDate} / ${job.duration}</p>

                <div style="display: flex; flex-wrap: wrap; gap: 0.5rem; margin: 0.5rem 0;">
                    ${job.tags.map(tag => `<span style="background-color: #eef5fb; padding: 0.4rem 0.8rem; border-radius: 20px; font-size: 0.8rem; color: #005b96;">${tag}</span>`).join('')}
                </div>

                <p style="font-style: italic; color: #555; font-size: 0.95rem;">"${job.description}"</p>

                <button style="background-color: #005b96; color: #ffffff; border: none; padding: 0.75rem; border-radius: 8px; cursor: pointer; font-size: 1rem; width: 100%; text-align: center; transition: background-color 0.3s ease;"
                    onclick="alert('View details for ${job.title}')">
                    View Details
                </button>
            </div>
        `).join('');
    }

    jobSearchInput.addEventListener('input', () => {
        const searchTerm = jobSearchInput.value.trim().toLowerCase();
        const filteredJobs = allJobs.filter(job =>
            `${job.title} ${job.company} ${job.position} ${job.location} ${job.tags.join(' ')}`.toLowerCase()
                .includes(searchTerm)
        );
        renderJobCards(filteredJobs);
    });
});
