// Populate the sidebar
//
// This is a script, and not included directly in the page, to control the total size of the book.
// The TOC contains an entry for each page, so if each page includes a copy of the TOC,
// the total size of the page becomes O(n**2).
class MDBookSidebarScrollbox extends HTMLElement {
    constructor() {
        super();
    }
    connectedCallback() {
        this.innerHTML = '<ol class="chapter"><li class="chapter-item expanded "><span class="chapter-link-wrapper"><a href="index.html"><strong aria-hidden="true">1.</strong> Overview</a></span></li><li class="chapter-item expanded "><span class="chapter-link-wrapper"><a href="cheating.html"><strong aria-hidden="true">2.</strong> Cheating</a></span><ol class="section"><li class="chapter-item expanded "><span class="chapter-link-wrapper"><a href="cheats.html"><strong aria-hidden="true">2.1.</strong> Cheats</a></span><ol class="section"><li class="chapter-item expanded "><span class="chapter-link-wrapper"><a href="infocom13.html"><strong aria-hidden="true">2.1.1.</strong> Infocom version 1-3 games</a></span></li><li class="chapter-item expanded "><span class="chapter-link-wrapper"><a href="cutthroads.html"><strong aria-hidden="true">2.1.2.</strong> Cutthroats</a></span></li><li class="chapter-item expanded "><span class="chapter-link-wrapper"><a href="enchanter.html"><strong aria-hidden="true">2.1.3.</strong> Enchanter</a></span></li><li class="chapter-item expanded "><span class="chapter-link-wrapper"><a href="sorcerer.html"><strong aria-hidden="true">2.1.4.</strong> Sorcerer</a></span></li><li class="chapter-item expanded "><span class="chapter-link-wrapper"><a href="spellbreaker.html"><strong aria-hidden="true">2.1.5.</strong> Spellbreaker</a></span></li><li class="chapter-item expanded "><span class="chapter-link-wrapper"><a href="planetfall.html"><strong aria-hidden="true">2.1.6.</strong> Planetfall</a></span></li></ol><li class="chapter-item expanded "><span class="chapter-link-wrapper"><a href="finding_cheats.html"><strong aria-hidden="true">2.2.</strong> Finding cheats</a></span></li></ol><li class="chapter-item expanded "><span class="chapter-link-wrapper"><a href="v6.html"><strong aria-hidden="true">3.</strong> Version 6 games</a></span></li><li class="chapter-item expanded "><span class="chapter-link-wrapper"><a href="man.html"><strong aria-hidden="true">4.</strong> Man page</a></span></li><li class="chapter-item expanded "><span class="chapter-link-wrapper"><a href="downloads.html"><strong aria-hidden="true">5.</strong> Downloads</a></span></li></ol>';
        // Set the current, active page, and reveal it if it's hidden
        let current_page = document.location.href.toString().split('#')[0].split('?')[0];
        if (current_page.endsWith('/')) {
            current_page += 'index.html';
        }
        const links = Array.prototype.slice.call(this.querySelectorAll('a'));
        const l = links.length;
        for (let i = 0; i < l; ++i) {
            const link = links[i];
            const href = link.getAttribute('href');
            if (href && !href.startsWith('#') && !/^(?:[a-z+]+:)?\/\//.test(href)) {
                link.href = path_to_root + href;
            }
            // The 'index' page is supposed to alias the first chapter in the book.
            // Check both with and without the '.html' suffix to be robust against pretty URLs
            if (link.href.replace(/\.html$/, '') === current_page.replace(/\.html$/, '')
                || i === 0
                && path_to_root === ''
                && current_page.endsWith('/index.html')) {
                link.classList.add('active');
                let parent = link.parentElement;
                while (parent) {
                    if (parent.tagName === 'LI' && parent.classList.contains('chapter-item')) {
                        parent.classList.add('expanded');
                    }
                    parent = parent.parentElement;
                }
            }
        }
        // Track and set sidebar scroll position
        this.addEventListener('click', e => {
            if (e.target.tagName === 'A') {
                const clientRect = e.target.getBoundingClientRect();
                const sidebarRect = this.getBoundingClientRect();
                sessionStorage.setItem('sidebar-scroll-offset', clientRect.top - sidebarRect.top);
            }
        }, { passive: true });
        const sidebarScrollOffset = sessionStorage.getItem('sidebar-scroll-offset');
        sessionStorage.removeItem('sidebar-scroll-offset');
        if (sidebarScrollOffset !== null) {
            // preserve sidebar scroll position when navigating via links within sidebar
            const activeSection = this.querySelector('.active');
            if (activeSection) {
                const clientRect = activeSection.getBoundingClientRect();
                const sidebarRect = this.getBoundingClientRect();
                const currentOffset = clientRect.top - sidebarRect.top;
                this.scrollTop += currentOffset - parseFloat(sidebarScrollOffset);
            }
        } else {
            // scroll sidebar to current active section when navigating via
            // 'next/previous chapter' buttons
            const activeSection = document.querySelector('#mdbook-sidebar .active');
            if (activeSection) {
                activeSection.scrollIntoView({ block: 'center' });
            }
        }
        // Toggle buttons
        const sidebarAnchorToggles = document.querySelectorAll('.chapter-fold-toggle');
        function toggleSection(ev) {
            ev.currentTarget.parentElement.parentElement.classList.toggle('expanded');
        }
        Array.from(sidebarAnchorToggles).forEach(el => {
            el.addEventListener('click', toggleSection);
        });
    }
}
window.customElements.define('mdbook-sidebar-scrollbox', MDBookSidebarScrollbox);

