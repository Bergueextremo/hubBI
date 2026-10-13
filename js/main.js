(() => {
  const year = document.getElementById('year');
  if (year) year.textContent = String(new Date().getFullYear());
  const toggle = document.querySelector('.menu-toggle');
  const mobile = document.getElementById('mobileMenu');
  const iconUse = toggle?.querySelector('use');
  const closeMenu = () => {if(!mobile||!toggle)return;mobile.hidden=true;toggle.setAttribute('aria-expanded','false');toggle.setAttribute('aria-label','Abrir menu');iconUse?.setAttribute('href','#i-menu')};
  toggle?.addEventListener('click', () => {if(!mobile)return;const opening=mobile.hidden;mobile.hidden=!opening;toggle.setAttribute('aria-expanded',String(opening));toggle.setAttribute('aria-label',opening?'Fechar menu':'Abrir menu');iconUse?.setAttribute('href',opening?'#i-x':'#i-menu')});
  mobile?.querySelectorAll('a').forEach(a=>a.addEventListener('click',closeMenu));
  document.addEventListener('keydown',e=>{if(e.key==='Escape')closeMenu()});
  if ('IntersectionObserver' in window && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    const io=new IntersectionObserver((entries,obs)=>entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('visible');obs.unobserve(entry.target)}}),{threshold:.08,rootMargin:'0px 0px -30px 0px'});
    document.querySelectorAll('.reveal').forEach((el,i)=>{el.style.transitionDelay=`${Math.min(i % 4,3)*55}ms`;io.observe(el)});
  } else document.querySelectorAll('.reveal').forEach(el=>el.classList.add('visible'));
  const form=document.getElementById('leadForm');
  const error=document.getElementById('formError');
  const caption=document.getElementById('formCaption');
  const phoneField=document.getElementById('telefone');
  phoneField?.addEventListener('input',e=>{
    const el=e.target; if(!(el instanceof HTMLInputElement))return;
    const d=el.value.replace(/\D/g,'').replace(/^55(?=\d{10,11}$)/,'').slice(0,11);
    if(d.length>=7)el.value=`(${d.slice(0,2)}) ${d.slice(2,d.length===11?7:6)}-${d.slice(d.length===11?7:6)}`;
    else if(d.length>2)el.value=`(${d.slice(0,2)}) ${d.slice(2)}`;
    else el.value=d;
  });
  form?.addEventListener('submit',e=>{
    e.preventDefault();
    if(!(form instanceof HTMLFormElement))return;
    const fields=new FormData(form);
    const text=k=>String(fields.get(k)||'').trim();
    const phone=text('telefone').replace(/\D/g,'');
    const valid=form.checkValidity() && phone.length>=10 && phone.length<=11;
    if(!valid){
      if(error)error.hidden=false;
      if(phone.length<10||phone.length>11)phoneField?.setCustomValidity('Informe seu WhatsApp com DDD.');
      else phoneField?.setCustomValidity('');
      form.reportValidity();
      return;
    }
    phoneField?.setCustomValidity('');
    if(error)error.hidden=true;
    const lines=[
      '📊 *NOVO LEAD — HUB BI*',
      '',
      `👤 *Nome:* ${text('nome')}`,
      `📱 *WhatsApp:* ${text('telefone')}`,
      `🏢 *Empresa:* ${text('empresa')}`,
      `🏷️ *Segmento:* ${text('segmento')}`,
      `🎯 *Principal objetivo:* ${text('objetivo')}`,
      `📝 *Desafio:* ${text('mensagem')||'Não informado'}`,
      '',
      '✅ Autorizou contato via WhatsApp: Sim',
      '🌐 Origem: formulário do site Hub BI'
    ];
    const url=`https://wa.me/5561993702380?text=${encodeURIComponent(lines.join('\n'))}`;
    // An explicit user action opens WhatsApp with a prepared message. Only the visitor can confirm sending it.
    const opened=window.open(url,'_blank');
    if (opened) { try { opened.opener = null; } catch (_) {} }
    else window.location.href=url;
    if(caption){caption.textContent='Mensagem preparada! Confirme o envio na conversa aberta do WhatsApp para concluir.';caption.setAttribute('role','status')}
  });
  phoneField?.addEventListener('input',()=>phoneField.setCustomValidity(''));
  // Mapa interativo de segmentos: sem dependências ou rastreamento.
  const network=document.getElementById('businessNetwork');
  const networkSector=document.getElementById('networkSector');
  const networkDetail=document.getElementById('networkDetail');
  network?.querySelectorAll('.network-node').forEach(button=>button.addEventListener('click',()=>{
    network.querySelectorAll('.network-node').forEach(node=>{node.classList.remove('active');node.setAttribute('aria-pressed','false')});
    button.classList.add('active');button.setAttribute('aria-pressed','true');
    if(networkSector)networkSector.textContent=button.dataset.sector||'';
    if(networkDetail)networkDetail.textContent=button.dataset.detail||'';
  }));
  const chatWidget=document.getElementById('chatWidget');
  const chatToggle=document.getElementById('chatToggle');
  const chatPanel=document.getElementById('chatPanel');
  const chatClose=document.getElementById('chatClose');
  const chatSend=document.getElementById('chatSend');
  const chatReply=document.getElementById('chatReply');
  const setChatOpen=(open)=>{
    if(!chatPanel||!chatToggle||!chatWidget)return;
    chatPanel.hidden=!open;chatWidget.classList.toggle('is-open',open);
    chatToggle.setAttribute('aria-expanded',String(open));
    chatToggle.setAttribute('aria-label',open?'Fechar atendimento Hub BI':'Abrir atendimento Hub BI');
    if(open)chatClose?.focus();else chatToggle.focus();
  };
  chatToggle?.addEventListener('click',()=>setChatOpen(chatPanel?.hidden));
  chatClose?.addEventListener('click',()=>setChatOpen(false));
  document.addEventListener('keydown',e=>{if(e.key==='Escape'&&chatPanel&&!chatPanel.hidden)setChatOpen(false)});
  chatPanel?.querySelectorAll('.chat-options button').forEach(button=>button.addEventListener('click',()=>{
    chatPanel.querySelectorAll('.chat-options button').forEach(item=>item.classList.remove('selected'));
    button.classList.add('selected');
    const message=button.dataset.message||'Olá! Gostaria de saber mais sobre a Hub BI.';
    if(chatReply){chatReply.hidden=false;chatReply.textContent=message;}
    if(chatSend)chatSend.href=`https://wa.me/5561993702380?text=${encodeURIComponent(message)}`;
  }));
})();
