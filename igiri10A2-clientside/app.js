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
        await fetchFundraisers();

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
            const response = await fetch('http://23975071.it.scu.edu.au/DataServ/api/categories');
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
            const response = await fetch("http://23975071.it.scu.edu.au/DataServ/api/fundraisers");
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
            const response = await fetch(`http://23975071.it.scu.edu.au/DataServ/api/fundraisers/search?${queryString}`);
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
                <div  id = "card" class="card  shadow-sm">
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


