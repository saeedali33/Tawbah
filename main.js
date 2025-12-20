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

    // Start with 0 to show real data (or 0 if new)
    let visits = 0;
    let downloads = 0;

    // 1. Fetch Visits using CounterAPI (Stable)
    try {
        // hits the 'up' endpoint to increment and get current count
        const visitRes = await fetch('https://api.counterapi.dev/v1/tawbah-app/visits/up');
        const visitData = await visitRes.json();
        // CounterAPI returns { count: 123 }
        if (visitData && visitData.count) {
            visits = visitData.count;
            console.log("Visits fetched (CounterAPI):", visits);
        }
    } catch (e) {
        console.warn('Could not fetch visits:', e);
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
            downloads = totalDownloads;
            console.log("Downloads fetched:", downloads);
        } else {
            console.error("GitHub API Error:", githubRes.status);
        }
    } catch (e) {
        console.warn('Could not fetch github downloads:', e);
    }

    // Animate
    // For visits/downloads, users usually prefer to see the real number even if low.
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
