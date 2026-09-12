(function(){
  const storageKey="quadrum_clarity_consent";
  const projectId="yfja45bwuy";

  function track(name){
    if(typeof window.clarity==="function") window.clarity("event",name);
  }

  function loadClarity(){
    if(window.__quadrumClarityLoaded) return;
    window.__quadrumClarityLoaded=true;
    (function(c,l,a,r,i,t,y){
      c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
      t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
      y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
    })(window,document,"clarity","script",projectId);
    window.clarity("consentv2",{ad_Storage:"denied",analytics_Storage:"granted"});
    if(location.pathname.endsWith("/koszonjuk.html")) track("ajanlat_elkuldve");
  }

  function setConsent(value){
    localStorage.setItem(storageKey,value);
    document.querySelector(".consent-banner")?.remove();
    if(value==="accepted") loadClarity();
  }

  function showConsent(){
    if(document.querySelector(".consent-banner")) return;
    const box=document.createElement("aside");
    box.className="consent-banner";
    box.setAttribute("aria-label","Látogatottságmérési beállítások");
    box.innerHTML='<div><strong>Segít jobbá tenni az oldalt?</strong><p>Hozzájárulás esetén névtelenített látogatottsági és használati adatokat mérünk a Microsoft Clarity segítségével.</p><a href="adatkezeles.html">Adatkezelési tájékoztató</a></div><div class="consent-actions"><button type="button" data-consent="declined">Elutasítom</button><button type="button" class="accept" data-consent="accepted">Elfogadom</button></div>';
    box.addEventListener("click",function(e){
      const value=e.target.getAttribute("data-consent");
      if(value) setConsent(value);
    });
    document.body.appendChild(box);
  }

  function addConsentSettings(){
    const legal=document.querySelector(".legal-links");
    if(!legal||legal.querySelector(".consent-settings")) return;
    const button=document.createElement("button");
    button.type="button";
    button.className="consent-settings";
    button.textContent="Mérési beállítások";
    button.addEventListener("click",showConsent);
    legal.appendChild(button);
  }

  function addConversionStyles(){
    if(document.getElementById("quadrum-conversion-styles")) return;
    const style=document.createElement("style");
    style.id="quadrum-conversion-styles";
    style.textContent=`
      .hero .hero-sales-note{margin:18px 0 0;font-size:15px;color:#554b42;font-weight:700}
      .hero .actions .btn:first-child{font-size:18px;min-height:54px;padding:14px 24px}
      .conversion-proof{background:#fff;border-top:1px solid #ddd2c5;border-bottom:1px solid #ddd2c5;padding:22px 0}
      .conversion-proof-grid{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:0}
      .conversion-proof-item{padding:6px 22px;border-right:1px solid #ddd2c5}
      .conversion-proof-item:last-child{border-right:0}
      .conversion-proof-item strong{display:block;font-size:16px;margin-bottom:3px;color:#201b16}
      .conversion-proof-item span{display:block;font-size:13px;line-height:1.35;color:#6f675e}
      .brand-relation{margin-top:16px;padding:14px 16px;border-left:4px solid #9a633d;background:#fffdf9;font-weight:700}
      @media(max-width:850px){
        .hero .actions{display:grid;grid-template-columns:1fr}
        .hero .actions .btn:first-child{order:-1;font-size:19px;min-height:58px}
        .hero .hero-sales-note{font-size:14px;margin-top:14px}
        .conversion-proof{padding:8px 0}
        .conversion-proof-grid{grid-template-columns:1fr 1fr}
        .conversion-proof-item{padding:14px 12px;border-right:0;border-bottom:1px solid #ddd2c5}
        .conversion-proof-item:nth-child(odd){border-right:1px solid #ddd2c5}
        .conversion-proof-item:nth-last-child(-n+2){border-bottom:0}
        .conversion-proof-item strong{font-size:14px}
        .conversion-proof-item span{font-size:12px}
      }
    `;
    document.head.appendChild(style);
  }

  function optimizeHomepage(){
    if(location.pathname!=="/" && !location.pathname.endsWith("/index.html")) return;

    document.title="Quadrum Parketta – egyedi fa parketta közvetlenül a gyártótól";
    const meta=document.querySelector('meta[name="description"]');
    if(meta) meta.setAttribute("content","Egyedi fa parketta közvetlenül a magyar gyártótól. Táblaparketta, Chevron és svédpadló meglévő vagy saját minta alapján. Kérjen ajánlatot a Quadrum Parkettától.");

    addConversionStyles();

    const hero=document.querySelector(".hero");
    if(hero){
      const eyebrow=hero.querySelector(".eyebrow");
      const title=hero.querySelector("h1");
      const lead=hero.querySelector(".lead");
      const actions=hero.querySelector(".actions");
      const heroImg=hero.querySelector("img.hero-photo");

      if(eyebrow) eyebrow.textContent="Magyar gyártó · 30 év parkettagyártási tapasztalat";
      if(title) title.textContent="Egyedi fa parketta az Ön elképzelése alapján";
      if(lead) lead.textContent="Valódi fa táblaparketta, Chevron és svédpadló közvetlenül a gyártótól. Válasszon meglévő mintát, egyedi méretet, vagy küldje el saját elképzelését.";
      if(heroImg) heroImg.alt="Egyedi valódi fa parketta – Quadrum Parketta, Signum Parkett Kft.";

      if(actions){
        const links=actions.querySelectorAll("a");
        if(links[0]){links[0].textContent="Kérek ajánlatot";links[0].setAttribute("href","#ajanlat");links[0].addEventListener("click",()=>track("hero_ajanlat_kattintas"));}
        if(links[1]){links[1].textContent="Megnézem a parkettákat";links[1].setAttribute("href","#parkettak");}
        if(!actions.querySelector(".hero-sales-note")){
          const note=document.createElement("p");
          note.className="hero-sales-note";
          note.textContent="Meglévő minta vagy teljesen egyedi tervezés · közvetlen egyeztetés a gyártóval";
          actions.insertAdjacentElement("afterend",note);
        }
      }

      if(!document.querySelector(".conversion-proof")){
        const proof=document.createElement("section");
        proof.className="conversion-proof";
        proof.setAttribute("aria-label","Miért Quadrum Parketta?");
        proof.innerHTML='<div class="wrap conversion-proof-grid"><div class="conversion-proof-item"><strong>Közvetlenül a gyártótól</strong><span>Nincs közvetítő a gyártás és a megrendelő között.</span></div><div class="conversion-proof-item"><strong>Egyedi minta és méret</strong><span>Meglévő kollekció vagy saját ötlet alapján.</span></div><div class="conversion-proof-item"><strong>Valódi fa</strong><span>Rétegelt fa parketta svédpadlótól a táblaparkettáig.</span></div><div class="conversion-proof-item"><strong>30 év tapasztalat</strong><span>Magyar gyártói háttér, európai parkettagyártási tapasztalattal.</span></div></div>';
        hero.insertAdjacentElement("afterend",proof);
      }
    }

    const about=document.querySelector("#rolunk .grid2 > div:first-child");
    if(about && !about.querySelector(".brand-relation")){
      const relation=document.createElement("p");
      relation.className="brand-relation";
      relation.textContent="A Quadrum Parketta a Signum Parkett Kft. saját parkettamárkája és közvetlen gyártói értékesítési oldala.";
      const h2=about.querySelector("h2");
      if(h2) h2.insertAdjacentElement("afterend",relation);
      else about.prepend(relation);
    }

    if(!document.getElementById("quadrum-org-schema")){
      const schema=document.createElement("script");
      schema.type="application/ld+json";
      schema.id="quadrum-org-schema";
      schema.textContent=JSON.stringify({
        "@context":"https://schema.org",
        "@type":"Organization",
        "name":"Quadrum Parketta",
        "legalName":"Signum Parkett Kft.",
        "url":"https://quadrumparkett.com/",
        "description":"Magyar fa parketta gyártó. Egyedi mintás táblaparketta, Chevron és svédpadló közvetlenül a gyártótól."
      });
      document.head.appendChild(schema);
    }
  }

  function instrument(){
    document.querySelector(".floating-quote")?.addEventListener("click",()=>track("erdekel_kattintas"));
    document.querySelectorAll('.prices .price').forEach(el=>el.addEventListener("click",()=>track("termekdoboz_kattintas")));
    document.querySelectorAll('.contact-links a').forEach(el=>el.addEventListener("click",()=>{
      const href=el.getAttribute("href")||"";
      if(href.startsWith("tel:")) track("telefon_kattintas");
      else if(href.startsWith("mailto:")) track("email_kattintas");
      else if(href.includes("wa.me")) track("whatsapp_kattintas");
      else if(href.includes("m.me")) track("messenger_kattintas");
    }));
    const form=document.querySelector("form.form");
    if(form){
      let started=false;
      form.addEventListener("input",()=>{if(!started){started=true;track("urlap_elkezdve")}});
      form.addEventListener("change",()=>{if(!started){started=true;track("urlap_elkezdve")}});
      form.addEventListener("submit",()=>track("urlap_elkuldve"));
      if("IntersectionObserver" in window){
        const observer=new IntersectionObserver(entries=>{
          if(entries.some(entry=>entry.isIntersecting)){track("urlap_elert");observer.disconnect()}
        },{threshold:.25});
        observer.observe(form);
      }
    }
  }

  document.addEventListener("DOMContentLoaded",function(){
    optimizeHomepage();
    const consent=localStorage.getItem(storageKey);
    if(consent==="accepted") loadClarity();
    else if(consent!=="declined") showConsent();
    addConsentSettings();
    instrument();
  });
})();