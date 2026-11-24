import React, { useEffect, useMemo, useState } from "react";
import { createRoot } from "react-dom/client";
import { createClient } from "@supabase/supabase-js";
import { MapPin, CalendarDays, Heart, Send, ChevronDown, Clock3, ExternalLink, Flower2, MessageCircle } from "lucide-react";
import "./styles.css";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || "https://ymyqpywwfpnbahpmitsp.supabase.co";
const supabaseKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY || import.meta.env.VITE_SUPABASE_ANON_KEY || "sb_publishable_-aVdAObkumJrcU8zKhaeiw_1xV9DSfW";
const supabase = createClient(supabaseUrl, supabaseKey);
const WEDDING = new Date("2026-12-08T20:30:00+06:00");
const MAP = "https://www.google.com/maps/search/?api=1&query=RB+Convention+Hall%2C+Arakan+Road%2C+Chandgaon%2C+Chattogram+4212";

function FallingFlowers() {
  const decorations=["✿","❀","✾","✿","❀","❧"];
  return <div className="falling-flowers" aria-hidden="true">{Array.from({length:30},(_,i)=><span key={i} className={decorations[i%decorations.length]==="❧"?"leaf":""} style={{"--i":i,"--x":`${(i*47+7)%100}%`}}>{decorations[i%decorations.length]}</span>)}</div>;
}
function FloralArt({className=""}) {
 return <svg className={`floral-art ${className}`} viewBox="0 0 250 430" aria-hidden="true">
  <g fill="none" stroke="#9c8964" strokeWidth="2"><path d="M80 420Q45 300 110 170T175 5"/><path d="M80 350Q20 300 25 230"/><path d="M98 280Q175 245 205 160"/><path d="M120 190Q65 145 73 85"/><path d="M150 120Q195 90 205 48"/></g>
  <g fill="#a18b61"><ellipse cx="28" cy="244" rx="9" ry="23" transform="rotate(-28 28 244)"/><ellipse cx="50" cy="287" rx="9" ry="22" transform="rotate(35 50 287)"/><ellipse cx="76" cy="112" rx="8" ry="20" transform="rotate(-35 76 112)"/><ellipse cx="171" cy="216" rx="9" ry="24" transform="rotate(50 171 216)"/><ellipse cx="195" cy="75" rx="8" ry="20" transform="rotate(42 195 75)"/><ellipse cx="129" cy="340" rx="8" ry="23" transform="rotate(52 129 340)"/></g>
  <g fill="#57151d"><circle cx="115" cy="290" r="37"/><circle cx="65" cy="205" r="31"/><circle cx="166" cy="145" r="26"/></g>
  {[{x:115,y:290,r:37},{x:65,y:205,r:31},{x:166,y:145,r:26}].map((p,i)=><g key={i} transform={`translate(${p.x} ${p.y})`} fill={i===1?"#7d2730":"#70202a"}>{Array.from({length:9},(_,j)=><ellipse key={j} rx={p.r*.35} ry={p.r*.62} transform={`rotate(${j*40})`}/>) }<circle r="9" fill="#d2b37d"/><circle r="3" fill="#4a1519"/></g>)}
  <g fill="#f4e7d4"><circle cx="145" cy="230" r="18"/><circle cx="158" cy="222" r="15"/><circle cx="171" cy="237" r="17"/><circle cx="42" cy="328" r="13"/><circle cx="57" cy="335" r="12"/></g>
 </svg>;
}
function Cover({onOpen}) {
 const [opening,setOpening]=useState(false);
 return <section className={`cover ${opening?"opening":""}`}>
  <div className="cover-paper"/><FallingFlowers/>
  <div className="save-date">SAVE THE DATE</div>
  <div className="envelope-scene">
   <div className="letter"><div className="avatar-shape"><div/></div></div>
   <div className="envelope-back"/>
   <div className="cover-bouquet"><FloralArt/></div>
   <div className="envelope-front"><div className="wax-seal"><Heart/></div></div>
   <button className="envelope-hit" onClick={()=>{if(!opening){setOpening(true);setTimeout(onOpen,1500)}}} aria-label="Open invitation"/>
  </div>
  <div className="cover-couple"><span>Saqib</span><i>&</i><span>Richie</span></div>
  <div className="cover-hint">Click to open your invitation <ChevronDown size={16}/></div>
 </section>;
}
function SectionTitle({eyebrow,title}) {return <div className="section-title"><span>{eyebrow}</span><h2>{title}</h2><i>✦</i></div>}
function Countdown() {
 const [now,setNow]=useState(new Date());
 useEffect(()=>{const t=setInterval(()=>setNow(new Date()),1000);return()=>clearInterval(t)},[]);
 const diff=Math.max(0,WEDDING-now);
 const parts=[["Days",Math.floor(diff/86400000)],["Hours",Math.floor(diff%86400000/3600000)],["Min",Math.floor(diff%3600000/60000)],["Sec",Math.floor(diff%60000/1000)]];
 return <div className="countdown">{parts.map(([label,value])=><div key={label}><b>{String(value).padStart(2,"0")}</b><small>{label}</small></div>)}</div>;
}
function Calendar() {
 const days=["Mo","Tu","We","Th","Fr","Sa","Su"];
 const cells=Array.from({length:35},(_,i)=>i>=1&&i<=31?i:null);
 return <div className="calendar"><div className="calendar-script">December 2026</div><div className="calendar-grid">{days.map(d=><b key={d}>{d}</b>)}{cells.map((d,i)=><span key={i} className={d===8?"chosen":""}>{d===8?<><span className="calendar-day">8</span><Heart size={28} fill="none" strokeWidth={1.5}/></>:d}</span>)}</div><a href="https://calendar.google.com/calendar/render?action=TEMPLATE&text=Wedding+of+Saqib+%26+Richie&dates=20261208T143000Z/20261208T170000Z&details=Wedding+reception&location=RB+Convention+Hall%2C+Chattogram" target="_blank" rel="noreferrer"></a></div>;
}
function Guestbook() {
 const [name,setName]=useState(""),[message,setMessage]=useState(""),[wishes,setWishes]=useState([]),[status,setStatus]=useState(""),[busy,setBusy]=useState(false);
 useEffect(()=>{
  if(!supabase){setStatus("Guestbook setup is not connected yet.");return;}
  let active=true;
  supabase.from("wedding_wishes").select("id,guest_name,message,created_at").order("created_at",{ascending:false}).limit(30).then(({data,error})=>{if(!active)return;if(error)setStatus("Could not load wishes. Please check the Supabase setup.");else setWishes(data||[])});
  const channel=supabase.channel("wedding-wishes-live").on("postgres_changes",{event:"INSERT",schema:"public",table:"wedding_wishes"},payload=>setWishes(old=>[payload.new,...old.filter(x=>x.id!==payload.new.id)].slice(0,30))).subscribe();
  return()=>{active=false;supabase.removeChannel(channel)};
 },[]);
 const submit=async e=>{
  e.preventDefault();if(!supabase){setStatus("The guestbook is not connected yet. The website owner needs to finish the Supabase setup.");return}
  const cleanName=name.trim().slice(0,80),cleanMessage=message.trim().slice(0,1200);
  if(!cleanName||!cleanMessage){setStatus("Please enter your name and wishes.");return}
  setBusy(true);setStatus("");
  try{
   const {data,error}=await supabase.from("wedding_wishes").insert({guest_name:cleanName,message:cleanMessage}).select().single();
   if(error){console.error("Could not save wedding wish:",error);setStatus("Sorry, your wish could not be sent. Please check your connection and try again.");return}
   setWishes(old=>[data,...old.filter(x=>x.id!==data.id)].slice(0,30));
   setName("");setMessage("");setStatus("Your wish has been sent. Thank you!");
   fetch("/api/notify",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({name:cleanName,message:cleanMessage})}).catch(error=>console.error("Could not send wedding wish notification:",error));
  }catch(error){
   console.error("Could not save wedding wish:",error);
   setStatus("Sorry, your wish could not be sent. Please check your connection and try again.");
  }finally{setBusy(false)}
 };
 return <section className="guestbook-section section-wrap" id="guestbook">
  <SectionTitle eyebrow="Leave a Little Love" title="Guestbook"/>
  <div className="guestbook-card"><FloralArt className="guest-flower"/><h3>Send your wishes</h3><p className="guest-intro">Share a little love and blessings with us.</p>
   <form onSubmit={submit}><input required maxLength={80} value={name} onChange={e=>setName(e.target.value)} placeholder="Enter your name *"/><textarea required maxLength={1200} rows={4} value={message} onChange={e=>setMessage(e.target.value)} placeholder="Enter your wishes *"/><button disabled={busy} type="submit">{busy?"Sending...":"Send wishes"} <Send size={16}/></button></form>
   {status&&<p className="form-status" role="status">{status}</p>}
   <div className="wish-list">{wishes.length?wishes.map(w=><article className="wish-item" key={w.id}><div><strong>{w.guest_name}</strong><time>{new Date(w.created_at).toLocaleDateString("en-GB",{day:"numeric",month:"short"})}</time></div><p>{w.message}</p></article>):<p className="empty-wishes">No wishes yet. Be the first!</p>}</div>
  </div>
 </section>;
}
function Invitation() {
 return <main className="invitation"><FallingFlowers/>
  <section className="intro section-wrap"><div className="intro-names"><span>Saqib</span><i>&</i><span>Richie</span></div><section className="ceremony-card">
   <FloralArt className="ceremony-flower"/><h2>Ceremony Info</h2>
   <div className="parents"><div><small>Mr. & Mrs.</small><b>Aminul Islam</b><b>Rukeya Begum Nargis</b><p>Amin Mansion-2, K.B. Aman Ali Road, Boro Koborsthan, Rahattarpul, Bakalia, Chattogram.</p></div><div><small>Mr. & Mrs.</small><b>Faridur Rahman</b><b>Sajada Begum</b><p>Shikdar Para, Faridur Rahman Bari, Chakaria Paurashava, P.S., Chakaria, Cox’s Bazar.</p></div></div>
   <h3>We joyfully announce<br/>the wedding of our children</h3><div className="couple-full"><span>Md Shahidul Islam Sakib</span><small>Groom</small><i>&</i><span>Tasfiatul Mustafa Richie</span><small>Bride</small></div>
  </section></section>
  <section className="reception-section section-wrap"><div className="reception-card"><FloralArt className="reception-flower"/><h2>Reception Info</h2><h3>The reception will take place at:</h3><div className="reception-time"><span>20:30</span><span>Tuesday</span></div><div className="date-row"><b>08</b><span>December<br/><strong>2026</strong></span></div><p className="count-title">Countdown</p><Countdown/><Calendar/><a className="calendar-link" href="https://calendar.google.com/calendar/render?action=TEMPLATE&text=Wedding+of+Saqib+%26+Richie&dates=20261208T143000Z/20261208T170000Z&location=RB+Convention+Hall%2C+Chattogram" target="_blank" rel="noreferrer"><CalendarDays size={15}/> Add to Calendar</a></div></section>
  <section className="map-section section-wrap"><SectionTitle eyebrow="Find Us" title="The Venue"/><div className="map-frame"><iframe title="RB Convention Hall location map" src="https://www.google.com/maps?q=RB%20Convention%20Hall%2C%20Arakan%20Road%2C%20Chandgaon%2C%20Chattogram%204212&output=embed" loading="lazy" referrerPolicy="no-referrer-when-downgrade" allowFullScreen/></div><a className="directions" href={MAP} target="_blank" rel="noreferrer"><MapPin size={17}/> Get directions <ExternalLink size={14}/></a></section>
  <Guestbook/>
  <footer className="footer"><Heart fill="currentColor"/><p>Your presence would be the greatest gift we could receive!</p><span>Saqib & Richie · December 8, 2026</span></footer>
 </main>;
}
function App(){const [opened,setOpened]=useState(false);return opened?<Invitation/>:<Cover onOpen={()=>setOpened(true)}/>;}
createRoot(document.getElementById("root")).render(<React.StrictMode><App/></React.StrictMode>);
