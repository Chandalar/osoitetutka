(function () {
    if (document.getElementById('osoitetutka-ext-btn')) return;

    function extractAddressFromPage() {
        // 1. Kokeillaan Schema.org JSON-LD -dataa (tarkin lähde Etuovessa ja Oikotiessä)
        const scripts = document.querySelectorAll('script[type="application/ld+json"]');
        for (const s of scripts) {
            try {
                const json = JSON.parse(s.textContent);
                const items = Array.isArray(json) ? json : [json];
                for (const obj of items) {
                    const addr = obj.address || (obj.mainEntity && obj.mainEntity.address);
                    if (addr && (addr.streetAddress || addr.addressLocality)) {
                        const parts = [addr.streetAddress, addr.postalCode, addr.addressLocality].filter(Boolean);
                        if (parts.length >= 2) return parts.join(', ');
                    }
                }
            } catch (e) {}
        }

        // 2. Fallback: sivun pääotsikko (h1) tai title
        const h1 = document.querySelector('h1');
        if (h1 && h1.textContent.trim().length > 4) {
            return h1.textContent.trim().replace(/\s+/g, ' ');
        }

        return (document.title || '')
            .replace(/\s*[\|–—-]\s*(etuovi\.com|oikotie(\.fi)?).*$/i, '')
            .trim();
    }

    function injectButton() {
        if (document.getElementById('osoitetutka-ext-btn')) return;
        const addr = extractAddressFromPage();
        if (!addr || addr.length < 4) return;

        const btn = document.createElement('a');
        btn.id = 'osoitetutka-ext-btn';
        btn.href = `https://osoitetutka.web.app/?q=${encodeURIComponent(addr)}`;
        btn.target = '_blank';
        btn.rel = 'noopener noreferrer';
        btn.textContent = '📡 Analysoi Osoitetutkassa';
        btn.title = `Avaa Osoitetutka PRO kohteelle: ${addr}`;
        Object.assign(btn.style, {
            position: 'fixed',
            bottom: '22px',
            right: '22px',
            zIndex: '2147483647',
            background: 'linear-gradient(135deg, #059669, #0284c7)',
            color: '#ffffff',
            fontFamily: 'system-ui, -apple-system, sans-serif',
            fontSize: '13px',
            fontWeight: '700',
            padding: '11px 16px',
            borderRadius: '9999px',
            boxShadow: '0 10px 25px rgba(0, 0, 0, 0.35)',
            border: '2px solid rgba(255, 255, 255, 0.25)',
            textDecoration: 'none',
            cursor: 'pointer',
            transition: 'transform 0.15s ease'
        });
        btn.addEventListener('mouseenter', () => { btn.style.transform = 'scale(1.05)'; });
        btn.addEventListener('mouseleave', () => { btn.style.transform = 'scale(1)'; });
        document.body.appendChild(btn);
    }

    injectButton();
    setTimeout(injectButton, 1500);
})();
