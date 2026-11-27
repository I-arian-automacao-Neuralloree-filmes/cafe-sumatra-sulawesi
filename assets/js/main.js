(function(){
'use strict';
var C=window.CAFE_CONFIG||{};
var rm=matchMedia('(prefers-reduced-motion: reduce)').matches;
var fine=matchMedia('(hover:hover) and (pointer:fine)').matches;
var ph=function(v){return !v||/PREENCHER/i.test(v)};
var $=function(s,r){return (r||document).querySelector(s)};
var $$=function(s,r){return Array.prototype.slice.call((r||document).querySelectorAll(s))};
var lang='pt';
var vh=innerHeight;addEventListener('resize',function(){vh=innerHeight});

/* ---------- i18n ---------- */
function setLang(l){
  lang=l;document.documentElement.lang=l==='en'?'en':'pt-BR';
  $$('[data-en]').forEach(function(el){
    if(el.dataset.pt===undefined)el.dataset.pt=el.innerHTML;
    el.innerHTML=l==='en'?el.dataset.en:el.dataset.pt;
  });
  $$('.lang button').forEach(function(b){b.classList.toggle('on',b.dataset.l===l)});
  try{localStorage.setItem('cafeLang',l)}catch(e){}
  contactInfo();
  splitHeadline();
}
$$('.lang button').forEach(function(b){b.onclick=function(){setLang(b.dataset.l)}});

/* ---------- contact ---------- */
function contactInfo(){
  var emailRow=$('#emailRow'),waRow=$('#waRow');
  if(ph(C.email)){emailRow.hidden=true;$('#cEmail').innerHTML=''}
  else{emailRow.hidden=false;$('#cEmail').innerHTML='<a href="mailto:'+C.email+'">'+C.email+'</a>'}
  if(ph(C.whatsapp)){waRow.hidden=true;$('#dockWa').hidden=true}
  else{
    waRow.hidden=false;
    $('#cWa').innerHTML='<a href="https://wa.me/'+C.whatsapp+'" target="_blank" rel="noopener">'+(C.phoneLabel||C.whatsapp)+'</a>';
    var dwa=$('#dockWa');dwa.hidden=false;dwa.href='https://wa.me/'+C.whatsapp;
  }
}
if(C.parentSite)$('#back').href=C.parentSite;
$('#form').addEventListener('submit',function(e){
  e.preventDefault();var f=e.target,m=$('#msg');
  if(!f.nome.value.trim()||!f.contato.value.trim()){m.textContent=lang==='en'?'Please fill in name and contact.':'Preencha nome e contato.';return}
  var body='Nome: '+f.nome.value+'\nEmpresa: '+f.empresa.value+'\nContato: '+f.contato.value+'\nInteresse: '+f.interesse.value+'\n\n'+f.msg.value;
  if(!ph(C.whatsapp)){window.open('https://wa.me/'+C.whatsapp+'?text='+encodeURIComponent(body),'_blank','noopener');m.textContent='✓';return}
  if(!ph(C.email)){location.href='mailto:'+C.email+'?subject='+encodeURIComponent('Café Sumatra & Sulawesi Premium — '+f.interesse.value)+'&body='+encodeURIComponent(body);m.textContent='✓';return}
  m.textContent=lang==='en'?'Our contact channel is being set up. Please check back shortly.':'Nosso canal de contato está sendo configurado. Volte em breve.';
});

/* ---------- scroll loop: header, dock, progress, parallax ---------- */
var nav=$('#nav'),dock=$('#dock'),prog=$('#progress'),px=$$('[data-parallax]'),ticking=false;
function frame(){
  var y=window.scrollY,max=document.documentElement.scrollHeight-vh;
  nav.classList.toggle('solid',y>24);
  if(dock)dock.classList.toggle('show',y>vh*.55);
  if(prog)prog.style.setProperty('--p',max>0?Math.min(1,y/max).toFixed(4):0);
  if(!rm){
    for(var i=0;i<px.length;i++){
      var el=px[i],k=parseFloat(el.getAttribute('data-parallax')),host=el.parentElement,r=host.getBoundingClientRect();
      if(r.bottom<-200||r.top>vh+200)continue;
      var off=(r.top+r.height/2)-vh/2;
      el.style.translate='0 '+(-off*k).toFixed(1)+'px';
    }
  }
  ticking=false;
}
function req(){if(!ticking){ticking=true;requestAnimationFrame(frame)}}
addEventListener('scroll',req,{passive:true});addEventListener('resize',req);frame();

/* ---------- menu overlay ---------- */
var btn=$('#menuBtn'),ov=$('#overlay');
function setMenu(open){
  ov.classList.toggle('open',open);
  nav.classList.toggle('open',open);
  btn.setAttribute('aria-expanded',open);
  btn.setAttribute('aria-label',open?(lang==='en'?'Close menu':'Fechar menu'):(lang==='en'?'Open menu':'Abrir menu'));
  ov.setAttribute('aria-hidden',!open);
  if(open)ov.removeAttribute('inert');else ov.setAttribute('inert','');
  document.body.classList.toggle('lock',open);
}
btn.addEventListener('click',function(){setMenu(btn.getAttribute('aria-expanded')!=='true')});
$$('a',ov).forEach(function(a){a.addEventListener('click',function(){setMenu(false)})});
addEventListener('keydown',function(e){if(e.key==='Escape'&&ov.classList.contains('open'))setMenu(false)});
matchMedia('(min-width:861px)').addEventListener('change',function(e){if(e.matches&&ov.classList.contains('open'))setMenu(false)});

/* ---------- hero headline ---------- */
function splitHeadline(){
  var h1=$('#h1');if(!h1)return;
  var src=lang==='en'?(h1.dataset.en||h1.dataset.pt):h1.dataset.pt;
  if(!src)src=h1.dataset.pt||h1.innerHTML;
  h1.innerHTML=src;
  h1.classList.remove('go');
  if(rm){h1.classList.add('go');return}
  var n=0;
  (function walk(node){
    Array.prototype.slice.call(node.childNodes).forEach(function(c){
      if(c.nodeType===3){
        var frag=document.createDocumentFragment();
        c.textContent.split(/(\s+)/).forEach(function(t){
          if(!t)return;
          if(/^\s+$/.test(t)){frag.appendChild(document.createTextNode(' '));return}
          var w=document.createElement('span');w.className='w';
          var i=document.createElement('i');i.textContent=t;i.style.setProperty('--i',n++);
          w.appendChild(i);frag.appendChild(w);
        });
        node.replaceChild(frag,c);
      }else if(c.nodeType===1){
        if(c.tagName==='EM'||c.tagName==='I'){
          var w2=document.createElement('span');w2.className='w';
          var i2=document.createElement('i');i2.style.setProperty('--i',n++);
          var em=c.cloneNode(true);
          node.replaceChild(w2,c);w2.appendChild(i2);i2.appendChild(em);
        }else walk(c);
      }
    });
  })(h1);
  requestAnimationFrame(function(){requestAnimationFrame(function(){h1.classList.add('go')})});
}

/* ---------- reveal ---------- */
$$('.stats,.regions,.pillars,.snap,.gal,.steps').forEach(function(p){
  $$(':scope > .rv, :scope > li.rv, :scope > figure.rv, :scope > .pcard, :scope > article.rv, :scope > .pillar.rv, :scope > .stat',p).forEach(function(c,i){c.style.setProperty('--i',i)});
});
if('IntersectionObserver' in window&&!rm){
  var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}})},{threshold:.12,rootMargin:'0px 0px -6% 0px'});
  $$('.rv').forEach(function(el){io.observe(el)});
}else{$$('.rv').forEach(function(el){el.classList.add('in')})}

/* ---------- videos ---------- */
var mob=matchMedia('(max-width:860px)').matches;
var vpath=function(n){return 'assets/video/'+n+'-'+(mob?'9x16':'16x9')};
function lazyVideo(el,name,autoplay){
  if(!el)return;
  el.poster=vpath(name)+'-poster.webp';
  var o=new IntersectionObserver(function(es){es.forEach(function(x){
    if(x.isIntersecting){
      if(!el.src)el.src=vpath(name)+'.mp4';
      if(autoplay&&!rm)el.play().catch(function(){});
    }else if(autoplay)el.pause();
  })},{threshold:.25});
  o.observe(el);
}
lazyVideo($('#vLoop'),'torra-loop',true);
var vf=$('#vFilm'),fr=$('#filmFrame');
lazyVideo(vf,'origem',false);
if($('#pbtn'))$('#pbtn').onclick=function(){if(!vf.src)vf.src=vpath('origem')+'.mp4';vf.play();fr.classList.add('playing')};
if(vf){vf.onended=function(){fr.classList.remove('playing')};vf.onclick=function(){vf.paused?vf.play():vf.pause()}}

/* ---------- snap carousels ---------- */
$$('[data-snap]').forEach(function(sn){
  var wrap=sn.parentNode,dots=$('[data-dots]',wrap),items=$$(':scope > li',sn),cur=0;
  if(!dots||!items.length)return;
  items.forEach(function(it,i){
    var b=document.createElement('button');b.type='button';b.setAttribute('aria-label','Ir para o item '+(i+1));
    b.addEventListener('click',function(){go(i)});dots.appendChild(b);
  });
  var bs=$$('button',dots);
  function go(i){var it=items[Math.max(0,Math.min(items.length-1,i))];sn.scrollTo({left:it.offsetLeft-(sn.clientWidth-it.clientWidth)/2,behavior:rm?'auto':'smooth'})}
  function upd(){
    var c=sn.scrollLeft+sn.clientWidth/2,best=0,bd=1e9;
    items.forEach(function(it,i){var d=Math.abs(it.offsetLeft+it.clientWidth/2-c);if(d<bd){bd=d;best=i}});
    cur=best;bs.forEach(function(b,i){if(i===best)b.setAttribute('aria-current','true');else b.removeAttribute('aria-current')});
  }
  var t=false;sn.addEventListener('scroll',function(){if(!t){t=true;requestAnimationFrame(function(){upd();t=false})}},{passive:true});
  upd();
  var ar=$('[data-arrows]',wrap);
  if(ar){var prev=$('[data-prev]',ar),next=$('[data-next]',ar);if(prev)prev.addEventListener('click',function(){go(cur-1)});if(next)next.addEventListener('click',function(){go(cur+1)})}
});

/* ---------- marquee ---------- */
(function(){
  var set=$('#mset');if(!set)return;
  var srcs=['gallery-1-sm.webp','gallery-2-sm.webp','gallery-3-sm.webp','gallery-4-sm.webp','gallery-5-sm.webp','gallery-6-sm.webp'];
  function add(){srcs.forEach(function(s){var im=document.createElement('img');im.src='assets/img/'+s;im.alt='';im.loading='lazy';im.decoding='async';set.appendChild(im)})}
  add();add();
  var m=$('[data-marquee]');
  if(m&&!rm&&'IntersectionObserver' in window){
    new IntersectionObserver(function(es){m.classList.toggle('paused',!es[0].isIntersecting)}).observe(m);
  }
})();

/* ---------- tilt + magnet ---------- */
if(!rm){
  $$('.gb,.region,.pcard').forEach(function(el){
    el.classList.add('tilt');
    var rt=0;
    function set(e){
      var b=el.getBoundingClientRect(),x=(e.clientX-b.left)/b.width,y=(e.clientY-b.top)/b.height;
      var max=el.offsetWidth>500?3.5:7;
      cancelAnimationFrame(rt);rt=requestAnimationFrame(function(){
        el.style.setProperty('--ry',((x-.5)*2*max).toFixed(2)+'deg');
        el.style.setProperty('--rx',((.5-y)*2*max).toFixed(2)+'deg');
        el.style.setProperty('--mx',(x*100).toFixed(1)+'%');el.style.setProperty('--my',(y*100).toFixed(1)+'%');
      });
    }
    function off(){cancelAnimationFrame(rt);el.classList.remove('hot','moving');el.style.setProperty('--rx','0deg');el.style.setProperty('--ry','0deg')}
    el.addEventListener('pointerenter',function(e){if(e.pointerType==='mouse'){el.classList.add('hot','moving')}});
    el.addEventListener('pointermove',function(e){if(e.pointerType==='mouse')set(e)});
    el.addEventListener('pointerleave',function(e){if(e.pointerType==='mouse')off()});
  });
}
if(!rm&&fine){
  $$('.magnet').forEach(function(b){
    b.addEventListener('pointermove',function(e){
      var r=b.getBoundingClientRect(),x=e.clientX-(r.left+r.width/2),y=e.clientY-(r.top+r.height/2);
      b.style.translate=(x*.22).toFixed(1)+'px '+(y*.32).toFixed(1)+'px';
    });
    b.addEventListener('pointerleave',function(){b.style.translate='0 0'});
  });
}

/* ---------- rain (desktop only) ---------- */
(function(){
  var c=$('#rain');if(!c)return;
  if(rm||matchMedia('(max-width:700px)').matches){c.remove();return}
  var ctx=c.getContext('2d'),drops=[],vis=true;
  function size(){var r=c.getBoundingClientRect();c.width=r.width;c.height=r.height}
  function seed(){
    size();drops=[];
    var n=Math.min(64,Math.floor(c.width/26));
    for(var i=0;i<n;i++)drops.push({x:Math.random()*c.width,y:Math.random()*c.height,l:7+Math.random()*10,s:1.1+Math.random()*1.6,o:.06+Math.random()*.1});
  }
  seed();
  var hidden=false;
  document.addEventListener('visibilitychange',function(){hidden=document.hidden});
  function tick(){
    if(vis&&!hidden){
      ctx.clearRect(0,0,c.width,c.height);
      ctx.strokeStyle='rgba(241,232,216,1)';
      ctx.lineWidth=1;
      drops.forEach(function(d){
        ctx.globalAlpha=d.o;
        ctx.beginPath();ctx.moveTo(d.x,d.y);ctx.lineTo(d.x+.35,d.y+d.l);ctx.stroke();
        d.y+=d.s;d.x+=.12;
        if(d.y>c.height){d.y=-12;d.x=Math.random()*c.width}
      });
    }
    requestAnimationFrame(tick);
  }
  if('IntersectionObserver' in window)new IntersectionObserver(function(es){vis=es[0].isIntersecting}).observe($('.hero'));
  addEventListener('resize',function(){if(innerWidth>700)seed();});
  requestAnimationFrame(tick);
})();

/* ---------- ambient sound ---------- */
(function(){
  var btn=$('#snd'),audio=$('#amb');if(!btn||!audio)return;
  audio.loop=true;audio.preload='none';audio.volume=0;
  var on=false,raf=0;
  function fade(to,ms,done){
    var from=audio.volume,t0=performance.now();
    cancelAnimationFrame(raf);
    (function step(now){
      var p=Math.min(1,(now-t0)/ms);
      audio.volume=from+(to-from)*p;
      if(p<1)raf=requestAnimationFrame(step);
      else if(done)done();
    })(t0);
  }
  function show(){btn.hidden=false;btn.classList.add('show');btn.setAttribute('aria-pressed','false')}
  function hide(){btn.hidden=true;btn.classList.remove('show')}
  // Prefira o OGG (loop exato); o MP3 é fallback. Mostra o botão se qualquer um responder 200.
  Promise.all([
    fetch('assets/audio/templo_ambiente.ogg',{method:'HEAD'}).catch(function(){return {ok:false}}),
    fetch('assets/audio/templo_ambiente.mp3',{method:'HEAD'}).catch(function(){return {ok:false}})
  ]).then(function(rs){
    if(rs.some(function(r){return r&&r.ok}))show();else hide();
  });
  btn.addEventListener('click',function(){
    if(!on){
      audio.volume=0;
      audio.play().then(function(){fade(1,2000);on=true;btn.setAttribute('aria-pressed','true')}).catch(function(){});
    }else{
      fade(0,2000,function(){audio.pause()});on=false;btn.setAttribute('aria-pressed','false');
    }
  });
})();

/* ---------- init ---------- */
var saved='pt';try{saved=localStorage.getItem('cafeLang')||'pt'}catch(e){}
setLang(saved);
})();
