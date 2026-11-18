// Build one historical era for Wereldrijk: split the game's 922 regions along the historical borders
// of that time and write eras/<id>.js (only the changes against the 2026 map).
// usage: node build.js <eraId> [outDir]
const fs=require('fs');const path=require('path');
const G=require('./geo.js');const pc=G.pc;
const ERAS=require('./eras.js');
const NAMES=require('./names_nl.js');

const id=process.argv[2];const outDir=process.argv[3]||path.join(__dirname,'../../eras');
const E=ERAS.find(e=>e.id===id);if(!E){console.error('unknown era',id);process.exit(1)}
const M=G.loadBase();const R=M.regions;const NR=R.length;
const HB=process.env.HB||path.join(__dirname,'historical-basemaps/geojson');

/* ---------- layers (painter order: later wins) ---------- */
const layers=[];
const nationKey=p=>{const nm=p.NAME,sj=p.SUBJECTO;if(nm==null)return null;
  if(E.map&&E.map[nm]!==undefined)return E.map[nm];if(sj&&E.map&&E.map[sj]!==undefined&&E.subj!==false)return E.map[sj];
  if(E.subj!==false&&sj&&sj!==nm)return sj;return nm};
for(const B of (E.bases||[{f:E.base}])){if(!B.f)continue;const g=JSON.parse(fs.readFileSync(path.join(HB,B.f+'.geojson'),'utf8'));
  for(const f of g.features){const nm=f.properties.NAME;if(B.only&&!B.only.includes(nm))continue;if(B.skip&&B.skip.includes(nm))continue;
    let k=nationKey(f.properties);if(k==null)continue;const mp=G.projGeom(f.geometry);if(!mp.length)continue;const bb=G.bboxOf(mp);
    // groups: every feature in a lon/lat box that the era does not name itself becomes one nation (e.g. the many Aboriginal peoples)
    for(const gr of E.groups||[]){if(E.map&&E.map[nm]!==undefined)break;const cx=(bb[0]+bb[2])/2,cy=(bb[1]+bb[3])/2;const [lo0,la0,lo1,la1]=gr.box;
      if(cx>=G.projX(lo0)&&cx<=G.projX(lo1)&&cy<=G.projY(la0)&&cy>=G.projY(la1)&&!(gr.keep||[]).includes(nm)){k=gr.k;break}}
    layers.push({k,mp,bb,src:nm})}}
const lonlatPoly=pts=>G.projGeom({type:'Polygon',coordinates:[[...pts,pts[0]]]});
const regIdxByName={};R.forEach((r,i)=>{regIdxByName[r.nm]=i});
const modKeys={};M.nations.forEach((d,i)=>{modKeys[d.k]=i});
for(const op of E.paint||[]){const [k,what]=op;let mp=[];
  if(Array.isArray(what)&&typeof what[0]==='number'){throw new Error('bad paint '+k)}
  if(Array.isArray(what)&&Array.isArray(what[0]))mp=lonlatPoly(what);            // polygon in lon/lat
  else{const list=Array.isArray(what)?what:[what];                                  // modern countries or region names
    for(const w of list){if(w.startsWith('@')){const i=regIdxByName[w.slice(1)];if(i==null)throw new Error('no region '+w);mp.push(...R[i].mp)}
      else{const n=modKeys[w];if(n==null)throw new Error('no modern country '+w);R.forEach(r=>{if(r.n===n)mp.push(...r.mp)})}}}
  if(mp.length)layers.push({k,mp,bb:G.bboxOf(mp),src:'paint'})}

/* ---------- intersect every region with the layers ---------- */
const safe=(f,a,b)=>{try{return f(a,b)}catch(e){return null}};
const pieces=[];// per region: {k: mp}
for(const r of R){let rem=r.mp;const got={};
  for(let li=layers.length-1;li>=0&&rem.length;li--){const L=layers[li];if(!G.bbHit(r.bb,L.bb))continue;
    const it=safe(pc.intersection,rem,L.mp);if(!it||!it.length)continue;const a=G.polyArea(it);if(a<=1e-6)continue;
    got[L.k]=got[L.k]?(safe(pc.union,got[L.k],it)||got[L.k].concat(it)):it;const d=safe(pc.difference,rem,L.mp);if(d)rem=d}
  pieces.push({got,rem})}

/* ---------- decide: keep whole or split ---------- */
const MINKM=E.minKm||2500,MINT=E.minThick||10;// km² and km
const kmPerPx=r=>Math.sqrt(r.km/Math.max(1e-9,r.area));
function perim(mp){let p=0;for(const poly of mp)for(const ring of poly)for(let i=1;i<ring.length;i++)p+=Math.hypot(ring[i][0]-ring[i-1][0],ring[i][1]-ring[i-1][1]);return p}
const owner=new Array(NR).fill(null);const split={};// region -> [{k,mp}]
R.forEach((r,i)=>{const P=pieces[i];const ks=Object.keys(P.got);if(!ks.length)return;
  const s=kmPerPx(r);const sz=ks.map(k=>{const a=G.polyArea(P.got[k]);return {k,a,km:a*s*s,th:2*a/Math.max(1e-9,perim(P.got[k]))*s}}).sort((x,y)=>y.a-x.a);
  const force=E.splitAll||(E.splitRegions&&E.splitRegions.includes(r.nm));
  // pieces of nations the era names itself may be small; borders between unnamed cultures only split a region when both sides are big
  const key=k=>!!(E.nations&&E.nations[k])||E.splitAll;
  const sig=sz.filter(x=>x.km>=(force?MINKM*.4:MINKM)&&x.th>=MINT&&x.a>=r.area*(force?.01:key(x.k)?.04:(E.cultFrac||.3)));
  if(sig.length<=1||r.tiny){owner[i]=sig.length?sig[0].k:sz[0].k;return}
  // split: insignificant bits and uncovered land go to the touching/nearest significant piece
  const keep=sig.map(x=>({k:x.k,mp:P.got[x.k]}));
  const rest=[];for(const x of sz)if(!sig.includes(x))rest.push(...P.got[x.k]);rest.push(...P.rem);
  for(const poly of rest){if(Math.abs(G.polyArea([poly]))<1e-9)continue;const bb=G.bboxOf([poly]);const c=[(bb[0]+bb[2])/2,(bb[1]+bb[3])/2];
    let best=0,bd=1e18;keep.forEach((q,qi)=>{const d=distToMp(c,q.mp);if(d<bd){bd=d;best=qi}});keep[best].mp=safe(pc.union,keep[best].mp,[poly])||keep[best].mp.concat([poly])}
  owner[i]=keep[0].k;split[i]=keep});
function distToMp(p,mp){let d=1e18;for(const poly of mp)for(const ring of poly)for(let i=1;i<ring.length;i++){const v=segDist(p,ring[i-1],ring[i]);if(v<d)d=v}return d}
function segDist(p,a,b){const dx=b[0]-a[0],dy=b[1]-a[1];const L=dx*dx+dy*dy;let t=L?((p[0]-a[0])*dx+(p[1]-a[1])*dy)/L:0;t=Math.max(0,Math.min(1,t));return Math.hypot(p[0]-a[0]-t*dx,p[1]-a[1]-t*dy)}

// regions without any historical owner: take the nation of the neighbours (land first, then sea), else the nearest
for(let pass=0;pass<40;pass++){let ch=0;R.forEach((r,i)=>{if(owner[i]!=null)return;const cnt={};for(const j of [...r.a,...r.s])if(owner[j]!=null)cnt[owner[j]]=(cnt[owner[j]]||0)+(r.a.includes(j)?2:1);const ks=Object.keys(cnt);if(ks.length){owner[i]=ks.sort((a,b)=>cnt[b]-cnt[a])[0];ch++}});if(!ch)break}
R.forEach((r,i)=>{if(owner[i]!=null)return;let bd=1e18,b=null;R.forEach((q,j)=>{if(owner[j]==null||j===i)return;const d=Math.hypot(q.l[0]-r.l[0],q.l[1]-r.l[1]);if(d<bd){bd=d;b=owner[j]}});owner[i]=b});
// explicit fixes by region name
for(const [nm,k] of Object.entries(E.fix||{})){const i=regIdxByName[nm];if(i==null)throw new Error('fix: no region '+nm);owner[i]=k;delete split[i]}

/* ---------- build the new region list ---------- */
// out[i] for i<NR describes base region i (piece 0 if split); extra pieces are appended
const out=R.map((r,i)=>({i,parent:i,k:owner[i],mp:split[i]?split[i][0].mp:r.mp,orig:!split[i]}));
const kids={};R.forEach((r,i)=>{if(!split[i])return;kids[i]=[i];for(let q=1;q<split[i].length;q++){out.push({i:out.length,parent:i,k:split[i][q].k,mp:split[i][q].mp,orig:false});kids[i].push(out.length-1)}});
// normalise geometry of new pieces: rings as closed point lists, rounded to 0.01
for(const o of out){if(o.orig)continue;o.mp=o.mp.map(poly=>poly.map(ring=>{const pts=ring.map(([x,y])=>[Math.round(x*100)/100,Math.round(y*100)/100]);const dd=[];for(const p of pts){const l=dd[dd.length-1];if(!l||l[0]!==p[0]||l[1]!==p[1])dd.push(p)}if(dd.length&&(dd[0][0]!==dd[dd.length-1][0]||dd[0][1]!==dd[dd.length-1][1]))dd.push(dd[0]);return dd}).filter(r=>r.length>=4)).filter(p=>p.length)}

// original segments with their neighbour, per base region
const origSegs=R.map(r=>{const segs=[];r.p.forEach((pl,pi)=>pl.forEach((s,ri)=>{const pts=G.decRing(s);const e=r.e[pi][ri].split(',').map(Number);let k=0;for(let j=0;j<e.length;j+=2){for(let c=0;c<e[j+1];c++){segs.push([pts[k],pts[k+1],e[j]]);k++}}}));return segs});
function segsOf(mp){const s=[];for(const poly of mp)for(const ring of poly)for(let i=1;i<ring.length;i++)s.push([ring[i-1],ring[i]]);return s}
const pieceSegs={};for(const i in kids)for(const q of kids[i])pieceSegs[q]=segsOf(out[q].mp);
// which piece of split base region b lies at point m (closest piece boundary)
function pieceAt(b,m,exclude){let best=-1,bd=1e18;for(const q of kids[b]){if(q===exclude)continue;for(const [a,c] of pieceSegs[q]){const d=segDist(m,a,c);if(d<bd){bd=d;best=q}}}return [best,bd]}
function resolve(nb,m){if(nb<0)return -1;if(!kids[nb])return nb;return pieceAt(nb,m)[0]}
function encodeE(list){const o=[];for(const v of list){const l=o.length-2;if(l>=0&&o[l]===v)o[l+1]++;else o.push(v,1)}return o.join(',')}
const needE=new Set();for(const i in kids){for(const q of kids[i])needE.add(q);for(const j of R[i].a)needE.add(j);for(const j of R[i].s)needE.add(j);
  for(const [,, nb] of origSegs[i])if(nb>=0)needE.add(nb)}
for(const q of needE){const o=out[q];const par=o.parent;
  if(o.orig){// unchanged geometry: only neighbours that were split need resolving
    const r=R[par];o.e=r.e.map((pl,pi)=>pl.map((s,ri)=>{const pts=G.decRing(r.p[pi][ri]);const e=s.split(',').map(Number);const L=[];let k=0;for(let j=0;j<e.length;j+=2)for(let c=0;c<e[j+1];c++){const m=[(pts[k][0]+pts[k+1][0])/2,(pts[k][1]+pts[k+1][1])/2];L.push(resolve(e[j],m));k++}return encodeE(L)}));continue}
  const os=origSegs[par];
  o.e=o.mp.map(poly=>poly.map(ring=>{const L=[];for(let i=1;i<ring.length;i++){const m=[(ring[i-1][0]+ring[i][0])/2,(ring[i-1][1]+ring[i][1])/2];
      let bd=1e18,nb=-1;for(const [a,c,n] of os){const d=segDist(m,a,c);if(d<bd){bd=d;nb=n}}
      if(bd<.03)L.push(resolve(nb,m));else{const [p,d]=pieceAt(par,m,q);L.push(d<.05?p:(bd<.6?resolve(nb,m):p))}}
    return encodeE(L)}))}

/* ---------- adjacency, sea links, coast, label, area ---------- */
const eNb=o=>{const s=new Set();for(const pl of o.e)for(const str of pl){const e=str.split(',').map(Number);for(let j=0;j<e.length;j+=2)if(e[j]>=0)s.add(e[j])}return s};
const bbOf=o=>o.bb||(o.bb=G.bboxOf(o.mp));
const near=(a,b,d)=>{const A=bbOf(a),B=bbOf(b);return A[0]-d<=B[2]&&B[0]-d<=A[2]&&A[1]-d<=B[3]&&B[1]-d<=A[3]};
const isCoast=o=>{for(const pl of o.e)for(const str of pl){const e=str.split(',').map(Number);for(let j=0;j<e.length;j+=2)if(e[j]<0)return true}return false};
const expand=(j,from)=>kids[j]?kids[j].filter(q=>near(out[q],from,1.5)):[j];
for(const o of out){if(!needE.has(o.i))continue;const r=R[o.parent];
  const en=eNb(o);const aOnly=r.a.filter(j=>!origSegs[o.parent].some(s=>s[2]===j));
  const a=new Set(en);for(const j of aOnly)for(const q of expand(j,o))if(q!==o.i&&near(out[q],o,1.5))a.add(q);
  o.a=[...a].sort((x,y)=>x-y);o.c=isCoast(o)?1:0;
  const s=new Set();if(o.c||o.orig)for(const j of r.s){const cand=kids[j]?kids[j].filter(q=>out[q].c!==0):[j];let best=cand[0],bd=1e18;for(const q of cand){const B=bbOf(out[q]),A=bbOf(o);const d=Math.hypot((A[0]+A[2])/2-(B[0]+B[2])/2,(A[1]+A[3])/2-(B[1]+B[3])/2);if(d<bd){bd=d;best=q}}if(best!=null&&best!==o.i)s.add(best)}
  o.s=[...s]}
// coast flags for pieces computed above; for sea links make them symmetric
for(const o of out)if(o.s)for(const j of o.s){const t=out[j];if(t.s&&!t.s.includes(o.i))t.s.push(o.i)}
function label(mp){// point inside the polygon far from its edges (grid search)
  let big=mp[0],ba=-1;for(const p of mp){const a=Math.abs(G.ringArea(p[0]));if(a>ba){ba=a;big=p}}const bb=G.bboxOf([big]);let best=[(bb[0]+bb[2])/2,(bb[1]+bb[3])/2],bd=-1;const N=24;
  for(let ix=0;ix<=N;ix++)for(let iy=0;iy<=N;iy++){const p=[bb[0]+(bb[2]-bb[0])*ix/N,bb[1]+(bb[3]-bb[1])*iy/N];if(!inPoly(p,big))continue;const d=distToMp(p,[big]);if(d>bd){bd=d;best=p}}
  return [Math.round(best[0]*10)/10,Math.round(best[1]*10)/10]}
function inPoly(p,poly){let inside=false;for(const ring of poly)for(let i=0,j=ring.length-1;i<ring.length;j=i++){const a=ring[i],b=ring[j];if((a[1]>p[1])!==(b[1]>p[1])&&p[0]<(b[0]-a[0])*(p[1]-a[1])/(b[1]-a[1])+a[0])inside=!inside}return inside}
for(const o of out){if(o.orig)continue;const r=R[o.parent];o.l=label(o.mp);o.km=Math.max(1,Math.round(r.km*G.polyArea(o.mp)/r.area))}

/* ---------- nations ---------- */
const keys=[...new Set(out.map(o=>o.k))];
const kmByK={};out.forEach(o=>{const km=o.orig?R[o.parent].km:o.km;kmByK[o.k]=(kmByK[o.k]||0)+km});
const ND=E.nations||{};
const XN=E.extraNames||{};
const nations=keys.map(k=>{const d=ND[k]||{};const km=kmByK[k];const nm=d.nm||XN[k]||NAMES[k]||k;
  // defaults from area and how developed the era/area is
  const dens=d.dens!=null?d.dens:(E.dens||1);const pop=d.pop!=null?d.pop:+(Math.max(.02,km/1e6*dens)).toFixed(3);
  const pcap=d.pc!=null?d.pc:(E.pc||1500);const gdp=d.gdp!=null?d.gdp:+(pop*pcap/1000).toFixed(3);
  const mil=d.mil!=null?d.mil:+(pop*(E.milPer||8)).toFixed(2);const bud=d.bud!=null?d.bud:+(gdp*(E.budPer||.03)).toFixed(3);
  return {k,name:nm,gdp,pop,mil,bud,ag:d.ag!=null?d.ag:(E.ag||.35),cap:d.cap||null,km}});
const nIdx={};nations.forEach((d,i)=>nIdx[d.k]=i);
// game balance for the era: how much of the people can be under arms (mf), what weapons cost (cost), upkeep (upk)
const clampN=(v,a,b)=>Math.max(a,Math.min(b,v));
const top=nations.slice().sort((a,b)=>(b.mil*1000+b.gdp*400)-(a.mil*1000+a.gdp*400)).slice(0,12);
const pct=(a,q)=>{a=a.slice().sort((x,y)=>x-y);return a[Math.min(a.length-1,Math.floor(a.length*q))]};
const MFv=E.mf!=null?E.mf:+clampN(pct(top.map(d=>d.mil*1000/(d.pop*1e6*.012)),.5)*1.1,1,5).toFixed(2);
const COSTv=E.cost!=null?E.cost:+clampN(pct(top.map(d=>d.gdp),.5)/400,.02,1.5).toFixed(3);
const upRaw=d=>{const pc=d.gdp/d.pop*1000;const tk=d.mil*1.2+Math.sqrt(d.bud)*20,jt=Math.sqrt(d.bud)*8+d.bud*1.2,sh=d.bud*.12+Math.sqrt(d.bud)*1.5;return (d.mil*1000*Math.max(300,1.6*pc)/1e9+tk*.005+jt*.03+sh*.12)/(d.gdp*.05)};
const UPKv=E.upk!=null?E.upk:+clampN(.35/pct(top.map(upRaw),.5),.02,1).toFixed(3);
console.log('balance mf',MFv,'cost',COSTv,'upk',UPKv);
// capitals: the region that contains the capital point (if the nation owns it), else its biggest region
const capR={};
nations.forEach((d,n)=>{let best=-1;if(d.cap){const x=G.projX(d.cap[0]),y=G.projY(d.cap[1]);const p=[((x%2000)+2000)%2000,y];
    out.forEach(o=>{if(o.k!==d.k||best>=0)return;const mp=o.orig?R[o.parent].mp:o.mp;if(mp.some(poly=>inPoly(p,poly)))best=o.i})}
  if(best<0){let bk=-1;out.forEach(o=>{if(o.k!==d.k)return;const km=o.orig?R[o.parent].km:o.km;if(km>bk){bk=km;best=o.i}})}
  capR[n]=best});

/* ---------- write ---------- */
const own=new Array(NR);const mod={};const add=[];
const regObj=o=>{const r=R[o.parent];const ob={n:nIdx[o.k]};
  if(o.orig){ob.e=o.e}else{ob.p=o.mp.map(poly=>poly.map(ring=>G.encRing(ring)));ob.e=o.e;ob.l=o.l;ob.km=o.km;ob.m=r.m;ob.b=o.parent}
  if(o.a)ob.a=o.a;if(o.s)ob.s=o.s;if(o.c!=null)ob.c=o.c;return ob};
out.forEach(o=>{if(o.i<NR){own[o.i]=nIdx[o.k];if(!o.orig||needE.has(o.i))mod[o.i]=regObj(o)}else add.push(regObj(o))});
const caps=nations.map((d,n)=>capR[n]);
const pk=(a,b)=>[nIdx[a],nIdx[b]];
const pairs=list=>(list||[]).map(([a,b])=>{if(nIdx[a]==null||nIdx[b]==null){console.warn('pair skipped',a,b);return null}return pk(a,b)}).filter(Boolean);
const ERA={id:E.id,nm:E.nm,y:E.y,m:E.m||1,tier:E.tier,
  nations:nations.map(d=>{const o={k:d.k,name:d.name,gdp:d.gdp,pop:d.pop,mil:d.mil,bud:d.bud,ag:d.ag};const c=(ND[d.k]||{}).col;if(c)o.col=c;return o}),own,mod,add,caps,
  al:pairs(E.al),war:pairs(E.war),tr:pairs(E.tr),nukes:(E.nukes||[]).map(([k,...v])=>[nIdx[k],...v]).filter(x=>x[0]!=null),
  res0:(E.res0||[]).map(([k,...v])=>[nIdx[k],...v]).filter(x=>x[0]!=null),lead:(E.lead||[]).map(k=>nIdx[k]).filter(x=>x!=null),mob:E.mob,upk:UPKv,cost:COSTv,mf:MFv,names:E.names};
fs.mkdirSync(outDir,{recursive:true});
fs.writeFileSync(path.join(outDir,E.id+'.js'),'window.ERA='+JSON.stringify(ERA)+';\n');
// report
const totKm={};out.forEach(o=>{});
const rep=nations.map((d,n)=>({n:d.name,k:d.k,regs:out.filter(o=>o.k===d.k).length,km:Math.round(d.km)})).sort((a,b)=>b.km-a.km);
console.log(E.id,'regions',out.length,'(+'+add.length+')','nations',nations.length,'split',Object.keys(split).length,'size',fs.statSync(path.join(outDir,E.id+'.js')).size);
if(process.env.V)console.log(rep.map(x=>`${x.n} [${x.k}] ${x.regs}r ${x.km}`).join('\n'));
else console.log(rep.slice(0,25).map(x=>`${x.n}:${x.regs}`).join(', '));
const unk=keys.filter(k=>!ND[k]&&!NAMES[k]&&!XN[k]);if(unk.length)console.log('UNNAMED:',unk.join(' | '));
