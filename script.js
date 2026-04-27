document.addEventListener('DOMContentLoaded', () => {

    /* --- Active Nav Link --- */
    const path = window.location.pathname;
    const page = path.split("/").pop() || 'index.html';
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.classList.remove('active');
        const href = link.getAttribute('href');
        if (href === page || (page === '' && href === 'index.html')) link.classList.add('active');
    });

    /* --- Mobile Menu Toggle --- */
    const mobileToggle = document.getElementById('mobile-toggle');
    const navLinksContainer = document.getElementById('nav-links');
    if (mobileToggle) {
        mobileToggle.addEventListener('click', () => {
            document.body.classList.toggle('nav-open');
            navLinksContainer.classList.toggle('active');
        });
    }

    /* --- Enhanced Scroll Reveal (all variants) --- */
    const allRevealEls = document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale');
    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.08, rootMargin: "0px 0px -40px 0px" });
    allRevealEls.forEach(el => revealObserver.observe(el));

    /* --- Auto stagger .stagger-children --- */
    document.querySelectorAll('.stagger-children').forEach(parent => {
        Array.from(parent.children).forEach((child, i) => {
            child.classList.add('reveal');
            child.style.transitionDelay = (i * 0.12) + 's';
            revealObserver.observe(child);
        });
    });

    /* --- Animated Counters --- */
    const statsSection = document.getElementById('stats');
    if (statsSection) {
        let hasCounted = false;
        const counters = document.querySelectorAll('.stat-number');
        const countObserver = new IntersectionObserver(([entry]) => {
            if (entry.isIntersecting && !hasCounted) {
                counters.forEach(counter => {
                    const target = +counter.getAttribute('data-target');
                    let current = 0;
                    const inc = target / 80;
                    const tick = () => {
                        current += inc;
                        if (current < target) { counter.innerText = Math.ceil(current); requestAnimationFrame(tick); }
                        else { counter.innerText = target; }
                    };
                    tick();
                });
                hasCounted = true;
            }
        }, { threshold: 0.5 });
        countObserver.observe(statsSection);
    }

    /* --- FAQ Accordion --- */
    const faqItems = document.querySelectorAll('.faq-item');
    faqItems.forEach(item => {
        item.querySelector('.faq-question')?.addEventListener('click', () => {
            const isActive = item.classList.contains('active');
            faqItems.forEach(f => f.classList.remove('active'));
            if (!isActive) item.classList.add('active');
        });
    });

    /* --- Filter Buttons (Gallery / Schedule) --- */
    const filterBtns = document.querySelectorAll('.filter-btn');
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            const val = btn.getAttribute('data-filter');
            const sel = btn.getAttribute('data-target') || '.filterable-item';
            document.querySelectorAll(sel).forEach((item, i) => {
                const show = val === 'all' || item.getAttribute('data-category') === val;
                item.style.display = show ? '' : 'none';
                if (show) { item.style.transitionDelay = (i * 0.06) + 's'; item.classList.add('reveal', 'active'); }
            });
        });
    });

    /* --- Advanced Schedule Filtering --- */
    const advFilters = document.querySelectorAll('.adv-select');
    if (advFilters.length > 0) {
        const filterCards = () => {
            const sport = document.getElementById('filter-sport')?.value;
            const age   = document.getElementById('filter-age')?.value;
            const level = document.getElementById('filter-level')?.value;
            const time  = document.getElementById('filter-time')?.value;
            document.querySelectorAll('.batch-card').forEach(card => {
                const ok = (sport === 'all' || card.dataset.sport === sport)
                        && (age   === 'all' || card.dataset.age   === age)
                        && (level === 'all' || card.dataset.level === level)
                        && (time  === 'all' || card.dataset.time  === time);
                card.style.display = ok ? 'flex' : 'none';
                if (ok) card.classList.add('reveal', 'active');
            });
        };
        advFilters.forEach(s => s.addEventListener('change', filterCards));
    }

    /* --- Testimonial Slider --- */
    const testimonialSlider = document.getElementById('testimonial-slider-container');
    if (testimonialSlider) {
        const slides = [
            { text: `"Joining the academy completely transformed my game. The precision and dedication of the coaching staff is unmatched. Thanks to them, I just signed with a minor league team!"`, author: "Arjun Patel", role: "Cricket U-19 State Player" },
            { text: `"My daughter's confidence has skyrocketed since she started football here. The environment is incredibly supportive yet competitive. It's the best sports facility in the city."`, author: "Priya Sharma", role: "Parent of U-14 Footballer" },
            { text: `"The fitness and conditioning programs here are elite. I've been to many gyms, but the sport-specific training at this academy pushed me out of my plateau."`, author: "Michael T.", role: "Pro Fitness Member" }
        ];
        const contentDiv = document.getElementById('testimonial-content');
        const dots = document.querySelectorAll('.dot');
        let cur = 0, timer;
        contentDiv.style.transition = 'opacity 0.35s ease, transform 0.35s ease';

        const show = (i) => {
            contentDiv.style.opacity = '0'; contentDiv.style.transform = 'translateY(12px)';
            setTimeout(() => {
                contentDiv.innerHTML = `<p class="testimonial-text">${slides[i].text}</p><h4 class="testimonial-author">${slides[i].author}</h4><p class="testimonial-role">${slides[i].role}</p>`;
                contentDiv.style.opacity = '1'; contentDiv.style.transform = 'translateY(0)';
            }, 350);
            dots.forEach(d => d.classList.remove('active'));
            if (dots[i]) dots[i].classList.add('active');
        };

        const next = () => { cur = (cur + 1) % slides.length; show(cur); };
        timer = setInterval(next, 5000);
        dots.forEach((d, i) => d.addEventListener('click', () => { clearInterval(timer); cur = i; show(cur); timer = setInterval(next, 5000); }));
    }

    /* --- Multi-Step Registration Form --- */
    const popup = document.getElementById('success-popup');
    window.closePopup = () => popup?.classList.remove('active');

    const multiStepForm = document.getElementById('multi-step-form');
    if (multiStepForm) {
        const steps = document.querySelectorAll('.form-step');
        const dots  = document.querySelectorAll('.step-dot');
        const progressLine = document.getElementById('progress-line');
        let currentStep = 0;

        const updateSteps = () => {
            steps.forEach((s, i) => s.classList.toggle('active', i === currentStep));
            dots.forEach((d, i) => {
                d.classList.toggle('active', i === currentStep);
                i < currentStep ? (d.classList.add('completed'), d.classList.remove('active')) : d.classList.remove('completed');
            });
            if (progressLine) progressLine.style.width = (currentStep * 50) + '%';
        };

        const validate = (si) => {
            let ok = true;
            steps[si].querySelectorAll('input[required], select[required]').forEach(inp => {
                const err = document.getElementById(inp.id + '-error');
                const bad = !inp.value.trim() || (inp.type === 'tel' && !/^[0-9]{10}$/.test(inp.value));
                inp.classList.toggle('input-invalid', bad);
                if (err) err.style.display = bad ? 'block' : 'none';
                if (bad) ok = false;
            });
            return ok;
        };

        document.querySelectorAll('.btn-next').forEach(b => b.addEventListener('click', () => { if (validate(currentStep)) { currentStep++; updateSteps(); } }));
        document.querySelectorAll('.btn-prev').forEach(b => b.addEventListener('click', () => { currentStep--; updateSteps(); }));

        const prog = new URLSearchParams(window.location.search).get('program');
        if (prog) { const sel = document.getElementById('reg-program'); if (sel) sel.value = prog; }

        multiStepForm.addEventListener('submit', e => {
            e.preventDefault();
            if (validate(currentStep) && popup) { popup.classList.add('active'); multiStepForm.reset(); currentStep = 0; updateSteps(); }
        });

        multiStepForm.querySelectorAll('input, select').forEach(inp => {
            inp.addEventListener('input', () => {
                inp.classList.remove('input-invalid');
                const err = document.getElementById(inp.id + '-error');
                if (err) err.style.display = 'none';
            });
        });
    }

    /* --- Generic Contact/Newsletter Forms --- */
    document.querySelectorAll('.validate-form').forEach(form => {
        form.addEventListener('submit', e => {
            e.preventDefault();
            const tel = form.querySelector('input[type="tel"]');
            if (tel && !/^[0-9]{10}$/.test(tel.value)) { alert('Please enter a valid 10-digit number.'); return; }
            if (popup) { popup.classList.add('active'); form.reset(); } else { alert('Submitted!'); form.reset(); }
        });
    });

    /* --- Gallery Lightbox --- */
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const lightboxCaption = document.getElementById('lightbox-caption');
    const lbNext = document.querySelector('.lightbox-next');
    const lbPrev = document.querySelector('.lightbox-prev');
    let galleryImgs = [], imgIdx = 0;

    if (lightbox && lightboxImg) {
        const buildArr = () => { galleryImgs = Array.from(document.querySelectorAll('.masonry-item')).filter(i => i.style.display !== 'none'); };
        const showImg = () => {
            if (!galleryImgs.length) return;
            lightboxImg.src = galleryImgs[imgIdx].querySelector('img').src;
            if (lightboxCaption) lightboxCaption.innerText = galleryImgs[imgIdx].getAttribute('data-caption') || '';
        };
        window.openLightbox = el => {
            const img = el.querySelector('img').src;
            const title = el.querySelector('h4') ? el.querySelector('h4').innerText : 'Gallery Detail';
            const category = el.getAttribute('data-category') || 'Gallery';
            const caption = el.getAttribute('data-caption') || '';
            const params = new URLSearchParams({ img, title, category, caption });
            window.location.href = `image-detail.html?${params.toString()}`;
        };
        window.closeLightbox = () => { lightbox.classList.remove('active'); document.body.style.overflow = ''; };
        lbNext?.addEventListener('click', e => { e.stopPropagation(); imgIdx = (imgIdx + 1) % galleryImgs.length; showImg(); });
        lbPrev?.addEventListener('click', e => { e.stopPropagation(); imgIdx = (imgIdx - 1 + galleryImgs.length) % galleryImgs.length; showImg(); });
        lightbox.addEventListener('click', e => { if (e.target.id === 'lightbox') closeLightbox(); });
        document.addEventListener('keydown', e => {
            if (!lightbox.classList.contains('active')) return;
            if (e.key === 'Escape') closeLightbox();
            if (e.key === 'ArrowRight') lbNext?.click();
            if (e.key === 'ArrowLeft')  lbPrev?.click();
        });
    }

    /* ══════════════════════════════════════════════════
       ✨  PREMIUM ANIMATIONS
    ══════════════════════════════════════════════════ */

    /* Navbar scroll glow */
    const navbar = document.querySelector('.navbar');
    if (navbar) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 60) {
                navbar.style.boxShadow = '0 4px 30px rgba(0,201,177,0.18), 0 2px 10px rgba(26,5,51,0.35)';
                navbar.style.padding   = '0.6rem 0';
            } else {
                navbar.style.boxShadow = 'none';
                navbar.style.padding   = '1rem 0';
            }
        }, { passive: true });
    }

    /* Hero: animated ambient blobs */
    const hero = document.querySelector('.hero');
    if (hero) {
        ['hero-blob-1', 'hero-blob-2', 'hero-blob-3'].forEach(cls => {
            const b = document.createElement('div');
            b.className = 'hero-blob ' + cls;
            hero.appendChild(b);
        });

        /* Floating micro-particles */
        const pColors = ['rgba(0,201,177,.75)', 'rgba(255,92,106,.75)', 'rgba(168,85,247,.75)', 'rgba(255,202,40,.75)'];
        for (let i = 0; i < 20; i++) {
            const p = document.createElement('div');
            p.className = 'particle';
            const sz = Math.random() * 5 + 2;
            p.style.cssText = `width:${sz}px;height:${sz}px;background:${pColors[i%4]};left:${Math.random()*100}%;bottom:${Math.random()*50}%;animation-duration:${Math.random()*5+4}s;animation-delay:${Math.random()*7}s;opacity:0;`;
            hero.appendChild(p);
        }
    }

    /* Button ripple on click */
    document.querySelectorAll('.btn').forEach(btn => {
        btn.addEventListener('click', function(e) {
            const r   = this.getBoundingClientRect();
            const sz  = Math.max(r.width, r.height) * 2;
            const rip = document.createElement('span');
            rip.style.cssText = `position:absolute;border-radius:50%;pointer-events:none;width:${sz}px;height:${sz}px;left:${e.clientX-r.left-sz/2}px;top:${e.clientY-r.top-sz/2}px;background:rgba(255,255,255,.25);animation:ripple .6s ease-out forwards;`;
            this.appendChild(rip);
            setTimeout(() => rip.remove(), 700);
        });
    });

    /* Magnetic pull on primary/secondary buttons */
    document.querySelectorAll('.btn-primary, .btn-secondary').forEach(btn => {
        btn.addEventListener('mousemove', function(e) {
            const r = this.getBoundingClientRect();
            const x = (e.clientX - r.left - r.width/2)  * 0.12;
            const y = (e.clientY - r.top  - r.height/2) * 0.18;
            this.style.transform = `translate(${x}px,${y}px) translateY(-3px)`;
        });
        btn.addEventListener('mouseleave', function() { this.style.transform = ''; });
    });

    /* 3-D card tilt on hover */
    document.querySelectorAll('.feature-card, .program-card, .pricing-card, .trainer-card').forEach(card => {
        card.addEventListener('mousemove', function(e) {
            const r  = this.getBoundingClientRect();
            const rx = ((e.clientY - r.top  - r.height/2) / (r.height/2)) * -6;
            const ry = ((e.clientX - r.left - r.width/2)  / (r.width/2))  *  6;
            this.style.transition = 'transform 0.08s ease';
            this.style.transform  = `perspective(900px) rotateX(${rx}deg) rotateY(${ry}deg) translateY(-10px) scale(1.02)`;
        });
        card.addEventListener('mouseleave', function() {
            this.style.transition = 'transform 0.5s cubic-bezier(0.34,1.56,0.64,1)';
            this.style.transform  = '';
        });
    });

    /* Stat number glow pop after count finishes */
    document.querySelectorAll('.stat-number').forEach(num => {
        new IntersectionObserver(([e], obs) => {
            if (e.isIntersecting) {
                setTimeout(() => { num.style.animation = 'teal-glow 2s ease-in-out 3'; }, 1400);
                obs.unobserve(num);
            }
        }, { threshold: 0.5 }).observe(num);
    });

    /* Pricing card: price tag scale on hover */
    document.querySelectorAll('.pricing-card').forEach(card => {
        const tag = card.querySelector('.price-tag');
        if (!tag) return;
        tag.style.transition = 'transform 0.3s ease, color 0.3s ease';
        card.addEventListener('mouseenter', () => { tag.style.transform = 'scale(1.1)'; tag.style.color = 'var(--secondary)'; });
        card.addEventListener('mouseleave', () => { tag.style.transform = ''; tag.style.color = ''; });
    });



    /* Smooth page-load fade-in */
    document.body.style.opacity = '0';
    document.body.style.transition = 'opacity 0.55s ease';
    window.addEventListener('load', () => { document.body.style.opacity = '1'; });

    /* --- Video Modal --- */
    const videoModal = document.getElementById('video-modal');
    const modalVideo = document.getElementById('modal-video');
    window.openVideoModal = (src, title) => {
        const modal = document.getElementById('video-modal');
        const container = document.getElementById('video-container');
        const titleEl = document.getElementById('video-modal-title');
        if (!modal || !container) return;

        container.innerHTML = '';
        const isYoutube = src.includes('youtube.com') || src.includes('youtu.be');

        if (isYoutube) {
            const iframe = document.createElement('iframe');
            iframe.src = src;
            iframe.frameBorder = "0";
            iframe.allow = "autoplay; encrypted-media; allowfullscreen";
            iframe.style.width = "100%";
            iframe.style.height = "500px";
            iframe.style.borderRadius = "var(--radius-lg)";
            container.appendChild(iframe);
        } else {
            const video = document.createElement('video');
            video.src = src;
            video.controls = true;
            video.autoplay = true;
            video.style.width = "100%";
            video.style.borderRadius = "var(--radius-lg)";
            container.appendChild(video);
        }

        titleEl.innerText = title;
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    };

    window.closeVideoModal = () => {
        const modal = document.getElementById('video-modal');
        const container = document.getElementById('video-container');
        if (!modal || !container) return;
        modal.classList.remove('active');
        container.innerHTML = '';
        document.body.style.overflow = '';
    };

    if (videoModal) {
        videoModal.addEventListener('click', e => {
            if (e.target.id === 'video-modal') closeVideoModal();
        });
    }

});
