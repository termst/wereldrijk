// Shared geometry helpers for building era maps.
const fs=require('fs');
const pc=require('polygon-clipping');
const W=2000,H=994,EQ=637,RAD=2000/(2*Math.PI);
const LON0=-169;
const projX=lon=>(lon-LON0)/360*W;
const projY=lat=>{lat=Math.max(-85,Math.min(85,lat));return EQ-RAD*1.25*Math.log(Math.tan(Math.PI/4+0.4*lat*Math.PI/180))};
const unprojY=y=>(2.5*Math.atan(Math.exp((EQ-y)/RAD/1.25*1))-0.625*Math.PI)*180/Math.PI; // inverse miller
function decRing(s){let q=10;if(s[0]==='h'){q=100;s=s.slice(1)}const a=s.split(',');const o=[];let x=0,y=0;for(let i=0;i<a.length;i+=2){x+=+a[i];y+=+a[i+1];o.push([x/q,y/q])}return o}
function encRing(pts){let px=0,py=0;const o=[];for(const [x,y] of pts){const X=Math.round(x*100),Y=Math.round(y*100);o.push(X-px,Y-py);px=X;py=Y}return 'h'+o.join(',')}
function ringArea(r){let a=0;for(let i=0,j=r.length-1;i<r.length;j=i++)a+=(r[j][0]+r[i][0])*(r[j][1]-r[i][1]);return a/2}
function polyArea(mp){let a=0;for(const poly of mp)poly.forEach((r,i)=>{const v=Math.abs(ringArea(r));a+=i?-v:v});return a}
function bboxOf(mp){const b=[1e9,1e9,-1e9,-1e9];for(const poly of mp)for(const r of poly)for(const [x,y] of r){if(x<b[0])b[0]=x;if(y<b[1])b[1]=y;if(x>b[2])b[2]=x;if(y>b[3])b[3]=y}return b}
const bbHit=(a,b)=>a[0]<=b[2]&&b[0]<=a[2]&&a[1]<=b[3]&&b[1]<=a[3];
// project a lon/lat (Multi)Polygon geometry to map coords, unwrapping across the map edge
function projGeom(g){const polys=g.type==='Polygon'?[g.coordinates]:g.type==='MultiPolygon'?g.coordinates:[];const out=[];
  for(const poly of polys){const rings=poly.map(ring=>{let prev=null;return ring.map(([lo,la])=>{if(prev!=null){while(lo-prev>180)lo-=360;while(prev-lo>180)lo+=360}prev=lo;return [lo,la]})});
    // normalise so the ring's first lon is inside [LON0, LON0+360)
    let sh=0;const f=rings[0][0][0];while(f+sh<LON0)sh+=360;while(f+sh>=LON0+360)sh-=360;
    const base=rings.map(r=>r.map(([lo,la])=>[projX(lo+sh),projY(la)]));
    const bb=bboxOf([base]);
    if(bb[0]>=0&&bb[2]<=W){out.push(base);continue}
    for(const off of [-W,0,W]){const sh2=base.map(r=>r.map(([x,y])=>[x+off,y]));const b2=bboxOf([sh2]);if(b2[2]<0||b2[0]>W)continue;
      try{const c=pc.intersection([sh2],[[[0,-50],[W,-50],[W,H+50],[0,H+50],[0,-50]]]);for(const p of c)out.push(p)}catch(e){}}}
  return out}
function loadBase(){const M=JSON.parse(fs.readFileSync(__dirname+'/map.json','utf8'));
  M.regions.forEach((r,i)=>{r.i=i;r.mp=r.p.map(pl=>pl.map(s=>{const pts=decRing(s);const ring=pts.slice();ring.push(pts[0]);return ring}));r.bb=bboxOf(r.mp);r.area=polyArea(r.mp)});return M}
module.exports={pc,W,H,projX,projY,unprojY,decRing,encRing,ringArea,polyArea,bboxOf,bbHit,projGeom,loadBase};
