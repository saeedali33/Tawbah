document.addEventListener('DOMContentLoaded', () => {

    // --- Fetch GitHub Download Count ---
    async function setDownloadCount() {
        const downloadCounter = document.getElementById('github-downloads');
        if (!downloadCounter) return;
        
        try {
            const response = await fetch('https://api.github.com/repos/saeedali33/Tawbah/releases');
            if(response.ok) {
                const releases = await response.json();
                let total = 0;
                releases.forEach(r => {
                    r.assets.forEach(a => {
                        total += a.download_count;
                    });
                });
                
                downloadCounter.setAttribute('data-target', total);
                
                // If animation already started or finished, update directly
                if (downloadCounter.innerText !== '0') {
                    // Start animation specifically for this element if observer already fired
                    const inc = total / 200;
                    let count = 0;
                    const animate = () => {
                        if (count < total) {
                            count += inc;
                            downloadCounter.innerText = Math.ceil(count);
                            setTimeout(animate, 20);
                        } else {
                            downloadCounter.innerText = "+" + total.toLocaleString();
                        }
                    };
                    animate();
                }
            }
        } catch(e) {
            console.error(e);
        }
    }
    setDownloadCount();
    
    // --- Sticky Header Effect ---
    const header = document.querySelector('.header');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    // --- Mobile Menu Toggle ---
    const menuBtn = document.querySelector('.mobile-menu-btn');
    const navbar = document.querySelector('.navbar');
    
    if (menuBtn) {
        menuBtn.addEventListener('click', () => {
            navbar.classList.toggle('active');
        });
    }

    // --- Copy functionality for InstaPay ---
    const copyBtns = document.querySelectorAll('.copy-btn');
    const toast = document.getElementById('toast');

    copyBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const card = e.target.closest('.donate-card');
            const number = card.getAttribute('data-clipboard');
            
            if (number) {
                // Copy to clipboard
                navigator.clipboard.writeText(number).then(() => {
                    // Show Toast
                    showToast();
                }).catch(err => {
                    console.error('Failed to copy text: ', err);
                    // Fallback creation
                    const tempInput = document.createElement('input');
                    tempInput.value = number;
                    document.body.appendChild(tempInput);
                    tempInput.select();
                    document.execCommand('copy');
                    document.body.removeChild(tempInput);
                    showToast();
                });
            }
        });
    });

    function showToast() {
        toast.classList.add('show');
        setTimeout(() => {
            toast.classList.remove('show');
        }, 3000);
    }

    // --- Scroll Animations via Intersection Observer ---
    const animatedElements = document.querySelectorAll('.fade-in-up, .fade-in-left, .fade-in-right, .stagger-in');

    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.15 // Trigger when 15% of element is visible
    };

    const scrollObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                
                // If it's a stagger container, add delays to children
                if(entry.target.classList.contains('stagger-in')) {
                    const children = entry.target.children;
                    for(let i=0; i<children.length; i++) {
                        children[i].style.transitionDelay = `${i * 150}ms`;
                        children[i].classList.add('is-visible');
                    }
                }
                
                // Trigger counter animation if element contains counters
                if (entry.target.classList.contains('stats') || entry.target.querySelector('.counter')) {
                   startCounters(entry.target);
                }
                
                // Optional: Stop observing after animating once
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    animatedElements.forEach(el => {
        scrollObserver.observe(el);
    });

    // --- Animated Counters ---
    let countersStarted = false;
    
    function startCounters(container) {
        const counters = container.querySelectorAll('.counter');
        if (countersStarted || counters.length === 0) return;
        
        countersStarted = true;
        const speed = 200; // lower is slower

        counters.forEach(counter => {
            const animate = () => {
                const target = +counter.getAttribute('data-target');
                const count = +counter.innerText.replace(/\+/g, '');
                
                // Increment calculation
                const inc = target / speed;

                if (count < target) {
                    counter.innerText = Math.ceil(count + inc);
                    setTimeout(animate, 20);
                } else {
                    counter.innerText = "+" + target.toLocaleString();
                }
            };
            animate();
        });
    }

    // Ensure smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                // Close mobile menu if open
                navbar.classList.remove('active');
                
                const headerOffset = 80;
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
  
                window.scrollTo({
                     top: offsetPosition,
                     behavior: "smooth"
                });
            }
        });
    });

});
