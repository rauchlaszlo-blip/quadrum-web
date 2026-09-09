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
    const consent=localStorage.getItem(storageKey);
    if(consent==="accepted") loadClarity();
    else if(consent!=="declined") showConsent();
    addConsentSettings();
    instrument();
  });
})();