document.addEventListener("DOMContentLoaded", function() {
    const basePath = window.location.origin;

    // Carrega o navbar
    fetch(`${basePath}/components/navbar.html`)
        .then(response => {
            if (response.ok) return response.text();
            throw new Error('Navbar not found.');
        })
        .then(data => {
            document.querySelector("header").innerHTML = data;
        })
        .catch(error => console.error('Error loading navbar:', error));

    // Carrega o footer
    fetch(`${basePath}/components/footer.html`)
        .then(response => {
            if (response.ok) return response.text();
            throw new Error('Footer not found.');
        })
        .then(data => {
            document.querySelector("footer").innerHTML = data;
        })
        .catch(error => console.error('Error loading footer:', error));
});