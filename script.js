const GITHUB_USERNAME = 'matthewmammano';
const GITHUB_CONTRIBUTIONS_API = `https://github-contributions-api.jogruber.de/v4/${GITHUB_USERNAME}?y=last`;
const BAR_CHARS = ['▂', '▃', '▄', '▅', '▆', '▇', '█'];
const ZERO_WEEK_CHAR = '_';
const CONTRIBUTION_WEEKS = 52;
const PROJECTS_VISIBLE_COUNT = 6;

function contributionsToBars(days) {
  const weeks = [];
  for (let i = days.length % 7; i < days.length; i += 7) {
    const week = days.slice(i, i + 7);
    weeks.push(week.reduce((sum, d) => sum + d.count, 0));
  }
  const recentWeeks = weeks.slice(-CONTRIBUTION_WEEKS);
  const max = Math.max(...recentWeeks, 1);
  return recentWeeks.map(count => count === 0 ? ZERO_WEEK_CHAR : BAR_CHARS[Math.ceil((count / max) * (BAR_CHARS.length - 1))]).join('');
}

function loadContributionBars() {
  const el = document.querySelector('.footer-chart');
  if (!el) return;
  fetch(GITHUB_CONTRIBUTIONS_API)
    .then(res => res.json())
    .then(data => { el.textContent = contributionsToBars(data.contributions); })
    .catch(() => { el.closest('footer').classList.add('no-chart'); });
}

function renderNav(nav) {
  return nav.map(n => `<a href="#${n.id}">${n.label}</a>`).join('');
}

function renderMeta(meta) {
  return meta.map(m => {
    const value = m.href ? `<a href="${m.href}" class="v">${m.value}</a>` : `<span class="v">${m.value}</span>`;
    return `<div><span class="k">${m.key}</span>&nbsp;&nbsp; ${value}</div>`;
  }).join('');
}

function renderExperience(experience) {
  return experience.map(company => `
    <div class="role-item" data-tags="${company.tags.join(' ')}">
      <div class="role-head">
        <img class="role-logo" src="${company.logo}" alt="${company.company} logo" loading="lazy" decoding="async">
        <div class="role-group-title">${company.company}</div>
      </div>
      <div class="role-sub-list">
        ${company.roles.map(role => `
          <div class="role-sub-item">
            <div class="role-sub-item-head">
              <span class="role-sub-item-title">${role.title}</span>
              <span class="role-sub-item-meta">${role.meta}</span>
            </div>
            ${role.desc ? `<p>${role.desc}</p>` : ''}
          </div>
        `).join('')}
      </div>
    </div>
  `).join('');
}

function renderProjects(projects) {
  return projects.map((p, i) => `
    <div class="card${i >= PROJECTS_VISIBLE_COUNT ? ' card-extra' : ''}" data-tags="${p.tags.join(' ')}">
      ${p.image
      ? (p.link ? `<a class="card-img-link" href="${p.link}" target="_blank" rel="noopener"><img src="${p.image}" alt="${p.alt}" loading="lazy" decoding="async"></a>` : `<img src="${p.image}" alt="${p.alt}" loading="lazy" decoding="async">`)
      : (p.link ? `<a class="card-noimg mono" href="${p.link}" target="_blank" rel="noopener">${p.title}</a>` : `<div class="card-noimg mono">${p.title}</div>`)}
      <div class="card-body">
        <div class="card-meta">${p.meta}</div>
        <h3>${p.link ? `<a href="${p.link}" target="_blank" rel="noopener">${p.title}</a>` : p.title}</h3>
        <p class="card-desc">${p.desc}</p>
      </div>
    </div>
  `).join('');
}

function renderEducation(education) {
  return education.map(e => `
    <div class="edu-row">
      <div>
        <div class="name">${e.name}${e.note ? ` <span class="note">${e.note}</span>` : ''}</div>
        <div class="sub">${e.sub}</div>
      </div>
      <div class="date">${e.date}</div>
    </div>
  `).join('');
}

function renderContact(contact) {
  return contact.map(c => `<a href="${c.href}">${c.label}</a>`).join('');
}

function renderPage(data) {
  document.getElementById('app').innerHTML = `
    <div class="bg-image"></div>
    <div class="layout">
      <aside class="sidebar">
        <div class="brand">${data.name.toLowerCase().replace(/\s+/g, '-')}</div>
        <p class="nav-group-label">SECTIONS</p>
        <nav>${renderNav(data.nav)}</nav>
      </aside>

      <main class="content" id="top">
        <p class="eyebrow">PORTFOLIO</p>
        <h1>${data.name}</h1>
        <p class="role">${data.title} &middot; ${data.location}</p>

        <div class="meta-block">${renderMeta(data.meta)}</div>

        <section id="about">
          <h2>About</h2>
          <p>${data.about}</p>
        </section>

        <section id="experience">
          <h2>Experience</h2>
          <div id="experienceList">${renderExperience(data.experience)}</div>
        </section>

        <section id="projects">
          <h2>Projects</h2>
          <div class="grid" id="projectsGrid">${renderProjects(data.projects)}</div>
          ${data.projects.length > PROJECTS_VISIBLE_COUNT ? `<button class="show-toggle mono" id="projectsToggle" type="button">Show all ${data.projects.length} projects</button>` : ''}
        </section>

        <section id="education">
          <h2>Education</h2>
          ${renderEducation(data.education)}
        </section>

        <section id="contact">
          <h2>Contact</h2>
          <div class="contact-list">${renderContact(data.contact)}</div>
        </section>

        <footer>
          <span class="footer-chart mono" aria-label="${data.name}'s GitHub contribution activity, last 52 weeks"></span>
          <span>${data.footer.right}</span>
        </footer>
      </main>
    </div>
  `;
}

function addTagChips(items, titleSelector) {
  items.forEach(item => {
    const tags = item.dataset.tags.split(' ').filter(Boolean);
    const title = item.querySelector(titleSelector);
    const wrap = document.createElement('div');
    wrap.className = 'name-tags';
    title.replaceWith(wrap);
    wrap.appendChild(title);
    const row = document.createElement('span');
    row.className = 'tag-row';
    tags.forEach(tag => {
      const chip = document.createElement('span');
      chip.className = 'tag-chip';
      chip.textContent = tag;
      row.appendChild(chip);
    });
    wrap.appendChild(row);
  });
}

function addDescToggles() {
  document.querySelectorAll('#projects .card-desc').forEach(desc => {
    if (desc.scrollHeight <= desc.clientHeight + 1) return;
    const toggle = document.createElement('button');
    toggle.className = 'card-more mono';
    toggle.type = 'button';
    toggle.textContent = 'more';
    toggle.addEventListener('click', e => {
      e.stopPropagation();
      const expanded = desc.classList.toggle('expanded');
      toggle.textContent = expanded ? 'hide' : 'more';
    });
    desc.insertAdjacentElement('afterend', toggle);
  });
}

function addProjectsToggle(totalCount) {
  const button = document.getElementById('projectsToggle');
  if (!button) return;
  const grid = document.getElementById('projectsGrid');
  button.addEventListener('click', () => {
    const expanded = grid.classList.toggle('expanded');
    button.textContent = expanded ? 'Show less' : `Show all ${totalCount} projects`;
  });
}

function wireUpBehavior() {
  addTagChips([...document.querySelectorAll('#experienceList .role-item')], '.role-group-title');
  addTagChips([...document.querySelectorAll('#projects .card')], 'h3');
  addDescToggles();
  addProjectsToggle(document.querySelectorAll('#projects .card').length);

  const navLinks = [...document.querySelectorAll('.sidebar nav a')];
  const sections = navLinks.map(a => document.querySelector(a.getAttribute('href')));

  function updateActiveSection() {
    const triggerY = window.innerHeight * 0.15;
    const atBottom = window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - 2;
    const current = atBottom
      ? sections[sections.length - 1]
      : sections.reduce((acc, section) => section.getBoundingClientRect().top <= triggerY ? section : acc, sections[0]);
    navLinks.forEach(a => a.classList.remove('active'));
    navLinks[sections.indexOf(current)].classList.add('active');
  }

  const bgImage = document.querySelector('.bg-image');
  const bgShiftVh = 25;
  let bgTicking = false;

  function updateBgShift() {
    const scrollRange = document.documentElement.scrollHeight - window.innerHeight;
    const progress = scrollRange > 0 ? Math.min(window.scrollY / scrollRange, 1) : 0;
    bgImage.style.transform = `translateY(${progress * -bgShiftVh}vh)`;
    updateActiveSection();
    bgTicking = false;
  }

  window.addEventListener('scroll', () => {
    if (!bgTicking) {
      requestAnimationFrame(updateBgShift);
      bgTicking = true;
    }
  }, { passive: true });

  updateBgShift();
}

fetch('data.json')
  .then(res => res.json())
  .then(data => {
    renderPage(data);
    wireUpBehavior();
    loadContributionBars();
  })
  .catch(() => {
    document.getElementById('app').textContent =
      'Could not load data.json - open this site through a local server (e.g. python3 -m http.server), not by double-clicking the file.';
  });
