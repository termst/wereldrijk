const allPairs=l=>{const o=[];for(let i=0;i<l.length;i++)for(let j=i+1;j<l.length;j++)o.push([l[i],l[j]]);return o};
const blocWar=(A,B,no)=>{const ex=new Set((no||[]).flatMap(([a,b])=>[a+'|'+b,b+'|'+a]));const o=[];for(const a of A)for(const b of B)if(!ex.has(a+'|'+b))o.push([a,b]);return o};
module.exports={allPairs,blocWar};
