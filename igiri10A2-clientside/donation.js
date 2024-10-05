document.addEventListener('DOMContentLoaded', function() {
    // Extract the fundraiser ID from the URL
    const urlParams = new URLSearchParams(window.location.search);
    const fundraiserId = urlParams.get('id');

    if (!fundraiserId) {
        document.getElementById('fundraiser-title').textContent = 'Error: No fundraiser specified';
        document.getElementById('donation-form').style.display = 'none';
        return;
    }

    console.log('Fundraiser ID:', fundraiserId);

    // Fetch fundraiser details
    fetch(`http://23975071.it.scu.edu.au/DataServ/api/fundraisers/${fundraiserId}`)
        .then(response => response.json())
        .then(fundraiser => {
            document.getElementById('fundraiser-title').textContent = `Donate to: ${fundraiser.ORGANIZER || 'Unnamed Fundraiser'}`;
        })
        .catch(error => {
            console.error('Error fetching fundraiser details:', error);
            document.getElementById('fundraiser-title').textContent = 'Error loading fundraiser details';
        });

    const form = document.getElementById('donation-form');
    const messageDiv = document.getElementById('donation-message');

    

    form.addEventListener('submit', function(e) {
        e.preventDefault();

        const giver = document.getElementById('giver').value;
        const amount = document.getElementById('amount').value;

        fetch(`http://23975071.it.scu.edu.au/DataServ/api/fundraisers/donate/${fundraiserId}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ giver, amount }),
        })
        .then(response => response.json())
        .then(data => {
            messageDiv.innerHTML = `<div class="alert alert-success">${data.message}</div>`;
            form.reset();
              // Show a message about redirection
              messageDiv.innerHTML += `<div class="alert alert-info">Redirecting you back to the fundraiser page in 3 seconds...</div>`;
            
              // Set a timeout for redirection
              setTimeout(() => {
                  const fundraiserPageUrl = `/fundraisers/${fundraiserId}`;
                  window.location.href = fundraiserPageUrl;
              }, 3000); 
        })
        .catch(error => {
            console.error('Error:', error);
            messageDiv.innerHTML = `<div class="alert alert-danger">An error occurred. Please try again.</div>`;
        });
    });
});
