// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});

// Stats Logic
const observerOptions = {
    threshold: 0.5
};

// Function to animate numbers
const animateValue = (obj, start, end, duration) => {
    let startTimestamp = null;
    const step = (timestamp) => {
        if (!startTimestamp) startTimestamp = timestamp;
        const progress = Math.min((timestamp - startTimestamp) / duration, 1);
        obj.innerHTML = "+" + Math.floor(progress * (end - start) + start).toLocaleString();
        if (progress < 1) {
            window.requestAnimationFrame(step);
        }
    };
    window.requestAnimationFrame(step);
};

// Fetch Data & Animate
const startStatsAnimation = async () => {
    const visitElement = document.getElementById('visit-count');
    const downloadElement = document.getElementById('download-count');

    // Default fallback values
    let visits = 15000;
    let downloads = 5000;

    // 1. Fetch Visits (using CountAPI as a free service example)
    // Key is generated based on domain, here using a test key for demo
    try {
        const visitRes = await fetch('https://api.countapi.xyz/hit/tawbah-app.com/visits');
        const visitData = await visitRes.json();
        visits = visitData.value || visits;
    } catch (e) {
        console.warn('Could not fetch visits, using default.', e);
    }

    // 2. Fetch Downloads from GitHub
    try {
        const githubRes = await fetch('https://api.github.com/repos/saeedali33/Tawbah/releases');
        if (githubRes.ok) {
            const releases = await githubRes.json();
            let totalDownloads = 0;
            releases.forEach(release => {
                release.assets.forEach(asset => {
                    totalDownloads += asset.download_count;
                });
            });
            if (totalDownloads > 0) downloads = totalDownloads;
        }
    } catch (e) {
        console.warn('Could not fetch github downloads, using default.', e);
    }

    // Animate
    animateValue(visitElement, 0, visits, 2000);
    animateValue(downloadElement, 0, downloads, 2000);
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            startStatsAnimation();
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

const statsSection = document.querySelector('.stats');
if (statsSection) {
    observer.observe(statsSection);
}

// InstaPay Copy Functionality
const instaPayCard = document.getElementById('instapay-card');
if (instaPayCard) {
    instaPayCard.addEventListener('click', () => {
        const number = instaPayCard.getAttribute('data-clipboard');
        navigator.clipboard.writeText(number).then(() => {
            showToast("تم نسخ الرقم بنجاح! ✅");
        });
    });
}

// Contact Form Logic Removed by User Request

function showToast(message = "تم النسخ بنجاح! ✅") {
    const toast = document.getElementById("toast");
    toast.textContent = message;
    toast.className = "toast show";
    setTimeout(function () {
        toast.className = toast.className.replace("show", "");
    }, 3000);
}

// Image Slider Logic Removed by User Request
