// Optimasi JS Portfolio 🚀
(function () {
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }

  function init() {
    const navToggle = document.getElementById("nav-toggle");
    const navMenu = document.getElementById("nav-menu");
    const navLinks = document.querySelectorAll(".nav-link");
    const navbar = document.querySelector(".navbar");
    const contactForm = document.getElementById("contact-form");
    const skillsSection = document.getElementById("skills");
    const skillBars = document.querySelectorAll(".skill-progress");

    // --- Dark/Light Mode Toggle ---
    const themeToggle = document.getElementById("theme-toggle");
    if (themeToggle) {
      if (localStorage.getItem("theme") === "light") {
        document.body.classList.add("light-theme");
        themeToggle.innerHTML = `<i class="fas fa-sun"></i>`;
      }

      themeToggle.addEventListener("click", () => {
        document.body.classList.toggle("light-theme");

        if (document.body.classList.contains("light-theme")) {
          localStorage.setItem("theme", "light");
          themeToggle.innerHTML = `<i class="fas fa-sun"></i>`;
        } else {
          localStorage.setItem("theme", "dark");
          themeToggle.innerHTML = `<i class="fas fa-moon"></i>`;
        }
      });
    }

    // --- 1. Mobile Menu Toggle ---
    if (navToggle && navMenu) {
      navToggle.addEventListener("click", () => {
        navMenu.classList.toggle("active");
      });
    }
    navLinks.forEach((link) => {
      link.addEventListener("click", () => navMenu?.classList.remove("active"));
    });

    // --- 2. Scroll Handler (digabung & throttle pakai rAF) ---
    let ticking = false;
    function handleScroll() {
      const scrollY = window.scrollY + 100;

      // Navbar scrolled
      if (scrollY > 150) {
        navbar?.classList.add("scrolled");
      } else {
        navbar?.classList.remove("scrolled");
      }

      // Highlight nav active section
      document.querySelectorAll("section[id]").forEach((section) => {
        const top = section.offsetTop - 100;
        const bottom = top + section.offsetHeight;
        const id = section.getAttribute("id");
        const link = document.querySelector(`.nav-link[href="#${id}"]`);
        if (scrollY >= top && scrollY < bottom) {
          navLinks.forEach((l) => l.classList.remove("active"));
          link?.classList.add("active");
        }
      });

      // Skill bars animate
      if (skillsSection) {
        const rect = skillsSection.getBoundingClientRect();
        if (rect.top < window.innerHeight * 0.8) {
          skillBars.forEach((bar) => {
            const width = bar.getAttribute("data-width") || bar.style.width;
            bar.style.transition = "none";
            bar.style.width = "0";
            setTimeout(() => {
              bar.style.transition = "width 2s ease-out";
              bar.style.width = width;
            }, 10);
          });
          // Hentikan animasi skill bar setelah jalan sekali
          skillsSection.dataset.animated = "true";
        }
      }

      ticking = false;
    }

    window.addEventListener("scroll", () => {
      if (!ticking) {
        requestAnimationFrame(handleScroll);
        ticking = true;
      }
    });
    handleScroll();

    // --- 3. Smooth Scroll ---
    navLinks.forEach((link) => {
      link.addEventListener("click", (e) => {
        e.preventDefault();
        const targetId = link.getAttribute("href").substring(1);
        const target = document.getElementById(targetId);
        if (target) {
          const offset = target.offsetTop - 70;
          window.scrollTo({ top: offset, behavior: "smooth" });
        }
      });
    });

    // --- 4. Form Handling ---
    if (contactForm) {
      const msgBox = document.createElement("div");
      msgBox.style.marginTop = "10px";
      msgBox.style.fontSize = "0.9rem";
      contactForm.appendChild(msgBox);

      contactForm.addEventListener("submit", function (e) {
        e.preventDefault();
        const { name, email, message } = this;
        const submitBtn = this.querySelector("button[type='submit']");

        if (
          !name.value.trim() ||
          !email.value.trim() ||
          !message.value.trim()
        ) {
          msgBox.textContent = "⚠️ Mohon isi semua kolom.";
          msgBox.style.color = "orange";
          return;
        }
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value)) {
          msgBox.textContent = "❌ Email tidak valid.";
          msgBox.style.color = "red";
          return;
        }

        const originalText = submitBtn.textContent;
        submitBtn.disabled = true;
        submitBtn.textContent = "Mengirim...";
        msgBox.textContent = "";

        setTimeout(() => {
          msgBox.textContent = "✅ Pesan berhasil dikirim!";
          msgBox.style.color = "lightgreen";
          contactForm.reset();
          submitBtn.disabled = false;
          submitBtn.textContent = originalText;
        }, 1500);
      });
    }

    // --- 5. Tilt Card (optimized dengan rAF) ---
    if (window.innerWidth > 768) {
      document
        .querySelectorAll(
          ".skill-card, .project-card, .about-card, .contact-form"
        )
        .forEach((card) => {
          let rafId;
          card.addEventListener("mousemove", (e) => {
            if (rafId) cancelAnimationFrame(rafId);
            rafId = requestAnimationFrame(() => {
              const rect = card.getBoundingClientRect();
              const x = e.clientX - rect.left;
              const y = e.clientY - rect.top;
              const centerX = rect.width / 2;
              const centerY = rect.height / 2;
              const rotateX = (y - centerY) / 15;
              const rotateY = (centerX - x) / 15;
              card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(20px)`;
            });
          });
          card.addEventListener("mouseleave", () => {
            card.style.transform =
              "perspective(1000px) rotateX(0) rotateY(0) translateZ(0)";
          });
        });
    }

    // --- 6. Custom Cursor (nonaktif di mobile) ---
    if (window.innerWidth > 768) {
      const cursor = document.createElement("div");
      const follower = document.createElement("div");
      cursor.classList.add("custom-cursor");
      follower.classList.add("cursor-follower");
      document.body.appendChild(cursor);
      document.body.appendChild(follower);

      let mouseX = 0,
        mouseY = 0,
        followerX = 0,
        followerY = 0;
      document.addEventListener("mousemove", (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        cursor.style.left = mouseX + "px";
        cursor.style.top = mouseY + "px";
      });
      function animateFollower() {
        followerX += (mouseX - followerX) * 0.1;
        followerY += (mouseY - followerY) * 0.1;
        follower.style.left = followerX + "px";
        follower.style.top = followerY + "px";
        requestAnimationFrame(animateFollower);
      }
      animateFollower();
    }

    // --- 7. Intersection Observer ---
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) entry.target.classList.add("animate-in");
        });
      },
      { threshold: 0.1, rootMargin: "0px 0px -100px 0px" }
    );
    document
      .querySelectorAll(
        ".skill-card, .project-card, .about-card, .contact-item, .stat, .section-title, .contact-form, .about-text h3, .about-text p"
      )
      .forEach((el) => observer.observe(el));

    // --- 8. Ripple Effect ---
    document.querySelectorAll(".btn").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        const rect = btn.getBoundingClientRect();
        const ripple = document.createElement("span");
        ripple.classList.add("ripple");
        ripple.style.left = e.clientX - rect.left + "px";
        ripple.style.top = e.clientY - rect.top + "px";
        btn.appendChild(ripple);
        setTimeout(() => ripple.remove(), 800);
      });
    });

    // --- 9. Loading Animation ---
    window.addEventListener("load", () => {
      document.body.style.opacity = "0";
      document.body.style.transition = "opacity 1s ease, transform 1s ease";
      document.body.style.transform = "perspective(1000px) rotateX(5deg)";
      setTimeout(() => {
        document.body.style.opacity = "1";
        document.body.style.transform = "perspective(1000px) rotateX(0deg)";
      }, 100);
    });

    console.log(
      "%c🚀 Portfolio aktif (optimized) dengan efek 3D!",
      "color: #fff; background: #e53935; padding: 5px;"
    );
  }
})();
