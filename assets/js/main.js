(function(){
const C=window.CAFE_CONFIG||{};
const ph=v=>!v||/PREENCHER/i.test(v);
const $=s=>document.querySelector(s);
// ---- i18n (PT in markup, EN in data-en)
let lang='pt';
function setLang(l){
  lang=l;document.documentElement.lang=l==='en'?'en':'pt-BR';
  document.querySelectorAll('[data-en]').forEach(el=>{
    if(el.dataset.pt===undefined)el.dataset.pt=el.innerHTML;
    el.innerHTML=l==='en'?el.dataset.en:el.dataset.pt;
  });
  document.querySelectorAll('.lang button').forEach(b=>b.classList.toggle('on',b.dataset.l===l));
  try{localStorage.setItem('cafeLang',l)}catch(e){}
  contactInfo();
}
document.querySelectorAll('.lang button').forEach(b=>b.onclick=()=>setLang(b.dataset.l));
// ---- contact
function contactInfo(){
  const em=ph(C.email)?`<span class="ph-note">${lang==='en'?'coming soon':'em breve'}</span>`:`<a href="mailto:${C.email}">${C.email}</a>`;
  const wa=ph(C.whatsapp)?`<span class="ph-note">${lang==='en'?'coming soon':'em breve'}</span>`:`<a href="https://wa.me/${C.whatsapp}" target="_blank" rel="noopener">${C.phoneLabel||C.whatsapp}</a>`;
  $('#cEmail').innerHTML=em;$('#cWa').innerHTML=wa;
}
if(C.parentSite)$('#back').href=C.parentSite;
$('#form').addEventListener('submit',e=>{
  e.preventDefault();const f=e.target,m=$('#msg');
  if(!f.nome.value.trim()||!f.contato.value.trim()){m.textContent=lang==='en'?'Please fill in name and contact.':'Preencha nome e contato.';return}
  const body=`Nome: ${f.nome.value}\nEmpresa: ${f.empresa.value}\nContato: ${f.contato.value}\nInteresse: ${f.interesse.value}\n\n${f.msg.value}`;
  if(!ph(C.whatsapp)){window.open(`https://wa.me/${C.whatsapp}?text=${encodeURIComponent(body)}`,'_blank');m.textContent='✓';return}
  if(!ph(C.email)){location.href=`mailto:${C.email}?subject=${encodeURIComponent('Café Sumatra & Sulawesi Premium — '+f.interesse.value)}&body=${encodeURIComponent(body)}`;m.textContent='✓';return}
  m.textContent=lang==='en'?'Our contact channel is being set up. Please check back shortly.':'Nosso canal de contato está sendo configurado. Volte em breve.';
});
document.querySelectorAll('a[href="#contato"]').forEach(a=>a.addEventListener('click',()=>{}));
// ---- nav solid
const nav=$('#nav');const on=()=>nav.classList.toggle('solid',scrollY>40);addEventListener('scroll',on,{passive:true});on();
// ---- reveal
const io=new IntersectionObserver(es=>es.forEach(x=>{if(x.isIntersecting){x.target.classList.add('in');io.unobserve(x.target)}}),{threshold:.12});
document.querySelectorAll('.rv:not(.in)').forEach(el=>io.observe(el));
// ---- videos (lazy, orientation-aware)
const mob=matchMedia('(max-width:860px)').matches;
const v=(n)=>`assets/video/${n}-${mob?'9x16':'16x9'}`;
function lazyVideo(el,name,autoplay){
  el.poster=v(name)+'-poster.webp';
  const o=new IntersectionObserver(es=>es.forEach(x=>{
    if(x.isIntersecting){
      if(!el.src){el.src=v(name)+'.mp4';}
      if(autoplay&&!matchMedia('(prefers-reduced-motion:reduce)').matches)el.play().catch(()=>{});
    }else if(autoplay)el.pause();
  }),{threshold:.25});o.observe(el);
}
lazyVideo($('#vLoop'),'torra-loop',true);
const vf=$('#vFilm'),fr=$('#filmFrame');lazyVideo(vf,'origem',false);
$('#pbtn').onclick=()=>{if(!vf.src)vf.src=v('origem')+'.mp4';vf.play();fr.classList.add('playing')};
vf.onended=()=>fr.classList.remove('playing');
vf.onclick=()=>{vf.paused?vf.play():vf.pause()};
// ---- gallery: shows whatever exists in assets/img/gallery-N.(webp|jpg)
const gal=$('#gal');const N=6;let found=0;
function tryImg(i,exts){
  const fig=document.createElement('figure');gal.appendChild(fig);
  const next=()=>{
    if(!exts.length){if(i>3){fig.remove();return}const p=document.createElement('div');p.className='ph';p.textContent=lang==='en'?'In preparation':'Em preparação';p.dataset.en='In preparation';p.dataset.pt='Em preparação';fig.appendChild(p);return}
    const ext=exts.shift(),im=new Image();im.loading='lazy';im.alt='Café Sumatra & Sulawesi Premium';
    im.onload=()=>{fig.appendChild(im);found++};im.onerror=next;im.src=`assets/img/gallery-${i}.${ext}`;
  };next();
}
for(let i=1;i<=N;i++)tryImg(i,['webp','jpg']);
// ---- init
let saved='pt';try{saved=localStorage.getItem('cafeLang')}catch(e){}
setLang(saved);
})();
