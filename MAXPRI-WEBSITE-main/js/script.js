 
        // ===== PARTICLE SYSTEM =====
        function createParticles() {
            const particlesContainer = document.getElementById('particles');
            const particleCount = 50;

            for (let i = 0; i < particleCount; i++) {
                const particle = document.createElement('div');
                particle.className = 'particle';
                particle.style.left = Math.random() * 100 + '%';
                particle.style.animationDelay = Math.random() * 15 + 's';
                particle.style.animationDuration = (Math.random() * 10 + 10) + 's';
                particlesContainer.appendChild(particle);
            }
        }

        // ===== CURSOR TRAIL EFFECT =====
        let cursorTrails = [];
        function createCursorTrail(e) {
            if (window.innerWidth < 768) return;

            const trail = document.createElement('div');
            trail.className = 'cursor-trail';
            trail.style.left = e.clientX + 'px';
            trail.style.top = e.clientY + 'px';
            trail.style.opacity = '0.6';
            document.body.appendChild(trail);

            cursorTrails.push(trail);

            setTimeout(() => {
                trail.style.opacity = '0';
                setTimeout(() => {
                    if (trail.parentNode) document.body.removeChild(trail);
                    cursorTrails = cursorTrails.filter(t => t !== trail);
                }, 300);
            }, 100);

            if (cursorTrails.length > 10) {
                const oldTrail = cursorTrails.shift();
                if (oldTrail && oldTrail.parentNode) document.body.removeChild(oldTrail);
            }
        }

        // ===== SCROLL PROGRESS BAR =====
        function updateProgressBar() {
            const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
            const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
            const scrolled = (winScroll / height) * 100;
            document.getElementById('progressBar').style.width = scrolled + '%';
        }

        // ===== 3D TILT EFFECT =====
        function addTiltEffect() {
            const tiltCards = document.querySelectorAll('.tilt-card');

            tiltCards.forEach(card => {
                card.addEventListener('mousemove', (e) => {
                    const rect = card.getBoundingClientRect();
                    const x = e.clientX - rect.left;
                    const y = e.clientY - rect.top;
                    const centerX = rect.width / 2;
                    const centerY = rect.height / 2;
                    const rotateX = (y - centerY) / 10;
                    const rotateY = (centerX - x) / 10;

                    card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.02)`;
                });

                card.addEventListener('mouseleave', () => {
                    card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale(1)';
                });
            });
        }

        // ===== COUNTER ANIMATION =====
        function animateCounters() {
            const counters = document.querySelectorAll('.counter');

            counters.forEach(counter => {
                const target = parseInt(counter.getAttribute('data-target'));
                const duration = 2000;
                const increment = target / (duration / 16);
                let current = 0;

                const updateCounter = () => {
                    current += increment;
                    if (current < target) {
                        counter.textContent = '$' + Math.ceil(current);
                        requestAnimationFrame(updateCounter);
                    } else {
                        counter.textContent = '$' + target;
                    }
                };

                const observer = new IntersectionObserver((entries) => {
                    entries.forEach(entry => {
                        if (entry.isIntersecting && counter.textContent === '$0') {
                            updateCounter();
                        }
                    });
                }, { threshold: 0.5 });

                observer.observe(counter);
            });
        }

        // ===== MAGNETIC BUTTON EFFECT =====
        function addMagneticEffect() {
            const magneticBtns = document.querySelectorAll('.magnetic-btn');

            magneticBtns.forEach(btn => {
                btn.addEventListener('mousemove', (e) => {
                    const rect = btn.getBoundingClientRect();
                    const x = e.clientX - rect.left - rect.width / 2;
                    const y = e.clientY - rect.top - rect.height / 2;
                    btn.style.transform = `translate(${x * 0.2}px, ${y * 0.2}px)`;
                });

                btn.addEventListener('mouseleave', () => {
                    btn.style.transform = 'translate(0, 0)';
                });
            });
        }

        // ===== FADE-IN OBSERVER =====
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                }
            });
        }, observerOptions);

        // ===== INITIALIZE ALL EFFECTS =====
        window.addEventListener('DOMContentLoaded', function () {
            createParticles();
            animateCounters();
            addTiltEffect();
            addMagneticEffect();

            document.addEventListener('mousemove', createCursorTrail);
            window.addEventListener('scroll', updateProgressBar);

            document.querySelectorAll('.fade-in').forEach(el => observer.observe(el));
            loadUsedCodes();

            // Chat bubble
            initChat();
            document.getElementById('chat-bubble').addEventListener('click', toggleChat);
        });

        // ===== CONTACT FORM =====
        const contactForm = document.querySelector('.contact-form');
        if (contactForm) {
            contactForm.addEventListener('submit', function (e) {
                e.preventDefault();
                alert('Thank you for your message! We will get back to you shortly.');
                this.reset();
            });
        }

        // ===== MOBILE MENU (DRAWER) =====
        const mobileMenu = document.querySelector('.mobile-menu');
        const mobileDrawer = document.getElementById('mobileDrawer');

        if (mobileMenu && mobileDrawer) {
            mobileMenu.addEventListener('click', () => {
                mobileMenu.classList.toggle('open');
                mobileDrawer.classList.toggle('open');
                document.body.style.overflow = mobileDrawer.classList.contains('open') ? 'hidden' : '';
            });
            document.querySelectorAll('.drawer-link').forEach(link => {
                link.addEventListener('click', () => {
                    mobileMenu.classList.remove('open');
                    mobileDrawer.classList.remove('open');
                    document.body.style.overflow = '';
                });
            });
        }

        // ===== ORDER FORM FUNCTIONS =====
        let selectedPaymentMethod = '';
        let usedCodes = new Set();

        function generateUniqueCode() {
            const characters = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
            let code;
            let attempts = 0;
            const maxAttempts = 100;

            do {
                code = '';
                for (let i = 0; i < 7; i++) {
                    code += characters.charAt(Math.floor(Math.random() * characters.length));
                }
                attempts++;

                if (attempts > maxAttempts) {
                    console.error('Failed to generate unique code after', maxAttempts, 'attempts');
                    break;
                }
            } while (usedCodes.has(code));

            usedCodes.add(code);

            try {
                const storedCodes = JSON.parse(localStorage.getItem('maxpriUsedCodes') || '[]');
                storedCodes.push(code);
                localStorage.setItem('maxpriUsedCodes', JSON.stringify(storedCodes));
            } catch (e) {
                console.error('Failed to store code:', e);
            }

            return code;
        }

        function loadUsedCodes() {
            try {
                const storedCodes = JSON.parse(localStorage.getItem('maxpriUsedCodes') || '[]');
                usedCodes = new Set(storedCodes);
            } catch (e) {
                console.error('Failed to load used codes:', e);
            }
        }

        function selectPackage(packageName, price) {
            document.getElementById('package').value = packageName;
            updatePrice();
            document.getElementById('orderForm').scrollIntoView({ behavior: 'smooth', block: 'start' });
        }

        function updatePrice() {
            const packageSelect = document.getElementById('package');
            const selectedOption = packageSelect.options[packageSelect.selectedIndex];
            const price = selectedOption.dataset.price ? parseInt(selectedOption.dataset.price) : 0;

            const deposit = Math.round(price * 0.3);
            const balance = price - deposit;

            document.getElementById('summaryPackage').textContent = selectedOption.text || 'Not selected';
            document.getElementById('summaryDeposit').textContent = '$' + deposit.toLocaleString();
            document.getElementById('summaryBalance').textContent = '$' + balance.toLocaleString();
            document.getElementById('summaryTotal').textContent = '$' + price.toLocaleString();
        }

        function selectPayment(method, event) {
            selectedPaymentMethod = method;
            document.getElementById('paymentMethod').value = method;

            document.querySelectorAll('.payment-method').forEach(pm => {
                pm.classList.remove('selected');
            });

            event.currentTarget.classList.add('selected');

            const cardDetails = document.getElementById('cardDetails');
            if (method === 'card') {
                cardDetails.classList.add('active');
                document.getElementById('cardNumber').required = true;
                document.getElementById('cardExpiry').required = true;
                document.getElementById('cardCvv').required = true;
                document.getElementById('cardName').required = true;
            } else {
                cardDetails.classList.remove('active');
                document.getElementById('cardNumber').required = false;
                document.getElementById('cardExpiry').required = false;
                document.getElementById('cardCvv').required = false;
                document.getElementById('cardName').required = false;
            }
        }

        // Card number formatting
        document.getElementById('cardNumber')?.addEventListener('input', function (e) {
            let value = e.target.value.replace(/\s/g, '');
            let formattedValue = value.match(/.{1,4}/g)?.join(' ') || value;
            e.target.value = formattedValue;
        });

        // Expiry date formatting
        document.getElementById('cardExpiry')?.addEventListener('input', function (e) {
            let value = e.target.value.replace(/\D/g, '');
            if (value.length >= 2) {
                value = value.slice(0, 2) + '/' + value.slice(2, 4);
            }
            e.target.value = value;
        });

        // CVV numbers only
        document.getElementById('cardCvv')?.addEventListener('input', function (e) {
            e.target.value = e.target.value.replace(/\D/g, '');
        });

        // Order form submission
        document.getElementById('orderForm')?.addEventListener('submit', function (e) {
            e.preventDefault();

            if (!selectedPaymentMethod) {
                alert('Please select a payment method');
                return;
            }

            const formData = {
                firstName: document.getElementById('firstName').value,
                lastName: document.getElementById('lastName').value,
                email: document.getElementById('email').value,
                phone: document.getElementById('phone').value,
                company: document.getElementById('company').value,
                package: document.getElementById('package').value,
                projectDescription: document.getElementById('projectDescription').value,
                timeline: document.getElementById('timeline').value,
                paymentMethod: selectedPaymentMethod
            };

            if (selectedPaymentMethod === 'card') {
                formData.cardNumber = document.getElementById('cardNumber').value;
                formData.cardExpiry = document.getElementById('cardExpiry').value;
                formData.cardCvv = document.getElementById('cardCvv').value;
                formData.cardName = document.getElementById('cardName').value;
            }

            console.log('Order submitted:', formData);

            const confirmationCode = generateUniqueCode();
            document.getElementById('confirmationCode').textContent = confirmationCode;
            document.getElementById('orderModal').classList.add('active');

            this.reset();
            selectedPaymentMethod = '';
            document.getElementById('paymentMethod').value = '';
            document.querySelectorAll('.payment-method').forEach(pm => pm.classList.remove('selected'));
            document.getElementById('cardDetails').classList.remove('active');
            updatePrice();
            document.getElementById('summaryPackage').textContent = 'Not selected';
        });

        function copyConfirmationCode() {
            const code = document.getElementById('confirmationCode').textContent;
            navigator.clipboard.writeText(code).then(() => {
                alert('Confirmation code copied!');
            }).catch(() => {
                alert('Could not copy code. Please copy it manually.');
            });
        }

        function closeModal() {
            document.getElementById('orderModal').classList.remove('active');
        }

        window.addEventListener('click', function (e) {
            const modal = document.getElementById('orderModal');
            if (e.target === modal) {
                closeModal();
            }
        });
        // ===== AI CHAT WIDGET =====
        let chatOpen = false;
        let chatPanel, chatMessages, chatInput, chatSendBtn, chatBadge;

        function initChat() {
            chatPanel = document.getElementById('chat-panel');
            chatMessages = document.getElementById('chatMessages');
            chatInput = document.getElementById('chatInput');
            chatSendBtn = document.getElementById('chatSendBtn');
            chatBadge = document.getElementById('chat-badge');
        }

        function toggleChat() {
            if (!chatPanel) initChat();
            chatOpen = !chatOpen;
            chatPanel.classList.toggle('open', chatOpen);
            if (chatOpen) {
                chatInput.focus();
                if (chatBadge) chatBadge.classList.add('hidden');
            }
        }

        function addChatMsg(text, type) {
            const isBot = type === 'bot' || type === 'bot typing';
            const row = document.createElement('div');
            row.className = 'chat-row' + (isBot ? '' : ' user');

            if (isBot) {
                const av = document.createElement('div');
                av.className = 'chat-row-avatar';
                av.innerHTML = '<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M12 2C6.48 2 2 6.02 2 11c0 2.67 1.19 5.07 3.08 6.74L4 22l4.5-1.5C9.56 20.81 10.75 21 12 21c5.52 0 10-4.02 10-9S17.52 2 12 2z"/></svg>';
                row.appendChild(av);
            }

            const d = document.createElement('div');
            d.className = 'chat-msg ' + (isBot ? 'bot' : 'user');

            if (type === 'bot typing') {
                d.innerHTML = '<div class="typing-dots"><span></span><span></span><span></span></div>';
            } else {
                d.textContent = text;
            }
            row.appendChild(d);
            chatMessages.appendChild(row);
            chatMessages.scrollTop = chatMessages.scrollHeight;
            return row;
        }

        function chipSend(text) {
            // Hide chips after first use
            const chips = document.getElementById('chatChips');
            if (chips) chips.style.display = 'none';
            chatInput.value = text;
            sendChat();
        }

        async function sendChat() {
            const text = chatInput.value.trim();
            if (!text) return;
            chatInput.value = '';
            chatSendBtn.disabled = true;

            // Hide quick chips after first message
            const chips = document.getElementById('chatChips');
            if (chips) chips.style.display = 'none';

            addChatMsg(text, 'user');
            const typingRow = addChatMsg('', 'bot typing');
            try {
                const res = await fetch('https://geminiapi.maxpri.workers.dev', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        model: 'claude-sonnet-4-20250514',
                        max_tokens: 1000,
                        system: `You are the friendly, knowledgeable AI assistant for Maxpri Technologies — a software engineering company that designs, develops, and maintains scalable, high-performance applications.\n\nKey facts about Maxpri:\n- Services: Custom app development, system architecture, performance optimization, automation & tooling, legacy system modernization, maintenance & support\n- Packages: Starter ($170, 2-4 wk), Professional ($360, 6-12 wk), Enterprise ($800, custom timeline)\n- Maxpri Valley: An all-in-one AI workspace for business at valley.maxpri.workers.dev\n- Philosophy: Clean code, modular design, security-first, minimal technical debt, systems-first mindset\n- Contact: daniel.aronbabu.mailbox@gmail.com | +1 (555) 123-4567\n- Also runs a computer repair division as a client relationship channel\n\nBe concise, warm, and helpful. Keep answers under 3 sentences unless explaining a complex topic. Direct prospects to contact us or choose a package when appropriate.`,
                        messages: [{ role: 'user', content: text }]
                    })
                });
                const data = await res.json();
                const reply = data.content?.find(b => b.type === 'text')?.text || 'Sorry, I couldn\'t get a response right now. Email us at daniel.aronbabu.mailbox@gmail.com!';
                typingRow.remove();
                addChatMsg(reply, 'bot');
            } catch {
                typingRow.remove();
                addChatMsg('Connection issue. Email us at daniel.aronbabu.mailbox@gmail.com!', 'bot');
            }
            chatSendBtn.disabled = false;
            chatInput.focus();
        }
        // ===== WE BUILD ANIMATION =====

