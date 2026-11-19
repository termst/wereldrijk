// Mark the peoples without a state (w:1, see wild.js) in the built eras without a full rebuild. build.js writes the same flag.
// usage: node flag_wild.js [erasDir]
const fs=require('fs'),path=require('path'),vm=require('vm');
const ERAS=require('./eras.js');const isWild=require('./wild.js');const dir=process.argv[2]||path.join(__dirname,'../../eras');
for(const E of ERAS){const f=path.join(dir,E.id+'.js');if(!fs.existsSync(f))continue;
  const ctx={window:{}};vm.runInNewContext(fs.readFileSync(f,'utf8'),ctx);const ERA=ctx.window.ERA;let w=0;
  ERA.nations.forEach(d=>{delete d.w;if(isWild(d.k,d.name)){d.w=1;w++}});
  fs.writeFileSync(f,'window.ERA='+JSON.stringify(ERA)+';\n');console.log(E.id,'nations',ERA.nations.length,'without a state',w)}
