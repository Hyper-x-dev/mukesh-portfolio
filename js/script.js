
/* UI helpers: theme toggle, modal handling, animations */
(function(){
    'use strict';

    // Theme: persist preference on documentElement as class 'light'
    var themeToggle = null;
    function setTheme(isLight){
        var root = document.documentElement;
        if(isLight){ root.classList.add('light'); themeToggle && themeToggle.setAttribute('aria-pressed','true'); themeToggle.textContent = '☀️'; }
        else{ root.classList.remove('light'); themeToggle && themeToggle.setAttribute('aria-pressed','false'); themeToggle.textContent = '🌙'; }
        try{ localStorage.setItem('themeLight', isLight ? '1' : '0'); }catch(e){}
    }

    function toggleTheme(){ setTheme(!document.documentElement.classList.contains('light')); }

    // Generic modal helpers
    function openModal(overlaySelector, modalSelector){
        var ov = document.querySelector(overlaySelector);
        var md = document.querySelector(modalSelector);
        if(ov && md){ ov.style.display = 'flex'; md.style.display = 'block'; md.classList.add('show'); setTimeout(function(){ md.style.opacity = 1; },20); }
    }
    function closeModal(overlaySelector, modalSelector){
        var ov = document.querySelector(overlaySelector);
        var md = document.querySelector(modalSelector);
        if(md){ md.style.display = 'none'; md.classList.remove('show'); }
        if(ov){ ov.style.display = 'none'; }
    }

    // Expose legacy function names used in HTML
    window.show = function(){ openModal('.over', '.pop'); };
    window.clos = function(){ closeModal('.over', '.pop'); };
    window.sho = function(){ openModal('.overl', '.popu'); };
    window.cl = function(){ closeModal('.overl', '.popu'); };
    window.showed = function(){ openModal('.overlay', '.popup'); };
    window.clp = function(){ closeModal('.overlay', '.popup'); };

    // Close on overlay click or Escape
    document.addEventListener('click', function(e){
        if(e.target.matches('.over, .overl, .overlay')){
            e.target.style.display = 'none';
            var mod = e.target.querySelector('.pop, .popu, .popup');
            // also hide any visible modal elements
            document.querySelectorAll('.pop, .popu, .popup').forEach(function(m){ m.style.display = 'none'; });
        }
    }, true);
    document.addEventListener('keydown', function(e){ if(e.key === 'Escape'){ document.querySelectorAll('.over, .overl, .overlay').forEach(function(o){ o.style.display = 'none'; }); document.querySelectorAll('.pop, .popu, .popup').forEach(function(m){ m.style.display = 'none'; }); } });

    // Skill bar animation
    function animateSkills(){
        document.querySelectorAll('.bar-fill').forEach(function(el){
            // width can be set via text content or data attribute, fallback to 60/70/80
            var val = el.getAttribute('data-percent') || el.textContent.replace('%','').trim() || '60';
            el.style.width = parseInt(val,10) + '%';
        });
    }

    // Navigation helper
    window.move = function(){ console.log('move clicked'); window.scrollTo({top:0,behavior:'smooth'}); };

    // Init on DOM ready
    document.addEventListener('DOMContentLoaded', function(){
        themeToggle = document.getElementById('themeToggle');
        try{ var pref = localStorage.getItem('themeLight'); setTheme(pref === '1'); }catch(e){}
        if(themeToggle){ themeToggle.addEventListener('click', toggleTheme); }

        // animate skills after small delay
        setTimeout(animateSkills, 350);
        // enable smooth scrolling for nav links
        document.querySelectorAll('.site-nav a').forEach(function(a){
            a.addEventListener('click', function(ev){
                var href = a.getAttribute('href');
                if(href && href.startsWith('#')){
                    ev.preventDefault();
                    var target = document.querySelector(href);
                    if(target) target.scrollIntoView({behavior:'smooth',block:'start'});
                }
            });
        });

        // focus management for modals
        ['.pop','.popu','.popup'].forEach(function(sel){
            var node = document.querySelector(sel);
            if(node){
                node.addEventListener('transitionend', function(){ if(node.style.display !== 'none'){ node.setAttribute('tabindex','-1'); node.focus(); } });
            }
        });
    });

})();


