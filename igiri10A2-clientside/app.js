const categoryImages = {
    1: "./assets/jessica.jpg",
    2: "./assets/flood.jpeg",
    3: "./assets/bike-accident.avif",
    4: "./assets/homeshelter.jpg",
    5: "./assets/students.jpg"
};


const path = window.location.pathname;
const id = path.split('/').pop();

document.addEventListener("DOMContentLoaded", async function () {
    const fundraiserList = document.getElementById("fundraiser-list");
    const resultsDiv = document.getElementById("results");

    try {
        // Fetch categories on load
        await fetchCategories();

        // Fetch and display active fundraisers on page load
        const fundraisers = await fetchFundraisers();
        displayFundraisers(fundraisers, fundraiserList);

        // Set up the event listeners for search and clear buttons
        setupEventListeners();
    } catch (error) {
        console.error('Error:', error);
    }

    // Fetch categories from the API and populate the dropdown
    async function fetchCategories() {
        try {
            const response = await fetch('http://localhost:3000/api/categories');
            const categories = await response.json();
            populateCategoryDropdown(categories);
        } catch (error) {
            console.error('Error fetching categories:', error);
        }
    }

    // Populate category dropdown
    function populateCategoryDropdown(categories) {
        const categoryDropdown = document.getElementById('category');
        categories.forEach(category => {
            const option = document.createElement('option');
            option.value = category.CATEGORY_ID;
            option.textContent = category.NAME;
            categoryDropdown.appendChild(option);
        });
    }

    // Fetch active fundraisers from the API
    async function fetchFundraisers() {
        try {
            const response = await fetch("http://localhost:3000/api/fundraisers");
            return await response.json();
        } catch (error) {
            console.error("Error fetching fundraisers:", error);
            return [];
        }
    }

    // Set up event listeners for search and clear buttons
    function setupEventListeners() {
        document.getElementById('search-btn').addEventListener('click', async () => {
            await handleSearch();
        });

        document.getElementById('clear-btn').addEventListener('click', () => {
            handleClear();
        });
    }

    // Handle the search button click
    async function handleSearch() {
        const organizer = document.getElementById('organizer').value;
        const city = document.getElementById('city').value;
        const category = document.getElementById('category').value;

        if (!organizer && !city && !category) {
            alert('Please select at least one search criterion.');
            return;
        }

        const queryString = new URLSearchParams({ organizer, city, category }).toString();

        try {
            const response = await fetch(`http://localhost:3000/api/fundraisers/search?${queryString}`);
            const data = await response.json();

            if (data.length === 0) {
                    resultsDiv.innerHTML = '<p class="text-danger"><strong>The desired fundraiser is not found.</strong></p>';
            
            } else {
                // Hide the default fundraisers section and display the search results
                fundraiserList.style.display = 'none';
                resultsDiv.innerHTML = '';
                displayFundraisers(data, resultsDiv);
            }
        } catch (error) {
            console.error('Error fetching search results:', error);
        }
    }

    // Handle the clear button click
    function handleClear() {
        document.getElementById('organizer').value = '';
        document.getElementById('city').value = '';
        document.getElementById('category').value = '';
        resultsDiv.innerHTML = '';  // Clear search results
        fundraiserList.style.display = 'flex';  // Show the default fundraisers again
    }

    // Function to display fundraisers
    function displayFundraisers(fundraisers, container) {
        container.innerHTML = '';
        fundraisers.forEach(fundraiser => {
            const imageUrl = categoryImages[fundraiser.CATEGORY_ID] || 'default.jpg';
            const fundraiserElement = document.createElement('div');
            fundraiserElement.className = "col";
            fundraiserElement.innerHTML = `
                <div id = "card" class="card  shadow-sm">
                    <img src="${imageUrl}" class="card-img-top" alt="${fundraiser.CAPTION}" />
                    <div class="card-body">
                        <h5 class="card-title">${fundraiser.CAPTION}</h5>
                        <p class="card-text para"><strong>Organizer:</strong> ${fundraiser.ORGANIZER}</p>
                        <span style = "font-weight : bold; font-size : 1rem;" class="mb-2 d-block">
                            $${fundraiser.CURRENT_FUNDING} raised of $${fundraiser.TARGET_FUNDING} goal
                        </span>
                        <div class="d-flex justify-content-end">
                            <a href="/fundraisers/${fundraiser.FUNDRAISER_ID}" class="btn btn-success btn-sm rounded-pill">View Details</a>
                        </div>
                    </div>
                </div>`;
            container.appendChild(fundraiserElement);
        });
    }
});



if (id) {
    fetch(`http://localhost:3000/api/fundraisers/${id}`)
        .then(response => response.json())
        .then(fundraiser => {
            const detailsDiv = document.getElementById('fundraiser-details');
            const imageUrl = categoryImages[fundraiser.ORGANIZER];
            detailsDiv.innerHTML = `
                <div class="container">
                    <div class="fundraiser-card card border-0">
                        <img src="${imageUrl}" class="card-img-top" alt="${fundraiser.CAPTION}" style="max-height: 300px; object-fit: contain;">
                        <div class="card-body p-4">
                            <h5 class="card-title mb-3 fw-bold">${fundraiser.CAPTION}</h5>
                            <p class="card-text mb-2"><strong>Organizer:</strong> ${fundraiser.ORGANIZER}</p>
                            <p class="card-text mb-2"><strong>City:</strong> ${fundraiser.CITY}</p>
                            <p class="card-text mb-3"><strong>Category:</strong> ${fundraiser.CATEGORY_NAME}</p>
                            <div class="progress mb-3">
                                <div class="progress-bar bg-success" role="progressbar" style="width: ${(fundraiser.CURRENT_FUNDING / fundraiser.TARGET_FUNDING) * 100}%" aria-valuenow="${fundraiser.CURRENT_FUNDING}" aria-valuemin="0" aria-valuemax="${fundraiser.TARGET_FUNDING}"></div>
                            </div>
                            <div class="d-flex justify-content-between mb-3">
                                <p class="mb-0"><strong>Current:</strong> $${fundraiser.CURRENT_FUNDING}</p>
                                <p class="mb-0"><strong>Target:</strong> $${fundraiser.TARGET_FUNDING}</p>
                            </div>
                            <p class="card-text mb-4"><strong>Status:</strong> <span class="badge ${fundraiser.ACTIVE ? 'bg-success' : 'bg-secondary'}">${fundraiser.ACTIVE ? 'Active' : 'Inactive'}</span></p>
                            <div class="d-flex justify-content-center">
                                <a href="/donation?id=${id}" class="btn btn-success btn-lg">Donate Now</a>
                            </div>
                        </div>
                    </div>
                </div>
            `;

            // Fetch donations for this fundraiser
            fetch(`http://localhost:3000/api/donations/${id}`)
                .then(response => response.json())
                .then(donations => {
                    const donationListDiv = document.getElementById('donation-list');
                    donationListDiv.innerHTML = donations.slice(0, 5).map(donation => `
                        <div class="card mb-2">
                            <div class="card-body">
                                <p><strong>Giver:</strong> ${donation.GIVER}</p>
                                <p><strong>Amount:</strong> $${donation.AMOUNT}</p>
                            </div>
                        </div>
                    `).join('');

                    // Handle "See More" link
                    document.getElementById('see-more').addEventListener('click', function(event) {
                        event.preventDefault();
                        donationListDiv.innerHTML = donations.map(donation => `
                            <div class="card mb-2">
                                <div class="card-body">
                                    <p><strong>Giver:</strong> ${donation.GIVER}</p>
                                    <p><strong>Amount:</strong> $${donation.AMOUNT}</p>
                                </div>
                            </div>
                        `).join('');
                        this.style.display = 'none'; // Hide the "See More" link
                    });
                });
        })
        .catch(error => console.error('Error:', error));
} else {
    document.getElementById('fundraiser-details').innerHTML = '<p class="text-danger">Fundraiser not found.</p>';
}
