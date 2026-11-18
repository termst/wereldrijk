// Mongoolse veroveringen, maart 1279: Koeblai Khan verslaat de laatste Song (Yamen). Het Mongoolse Rijk op zijn grootst,
// verdeeld over vier khanaten: de Yuan (Grote Khan), de Gouden Horde, het Il-kanaat en het Chagatai-kanaat.
const {N}=require('./late_names.js');
module.exports={lead:['YUA','GOL','ILK','CHG'],id:'mongolen',nm:'Mongoolse veroveringen',y:1279,m:3,tier:'middel',base:'world_1279',
  pc:1500,dens:1,milPer:6,ag:.3,minKm:1500,minThick:5,
  map:{'Great Khanate':'YUA','Tibet':'YUA','Khanate of the Golden Horde':'GOL','Chagatai Khanate':'CHG','Ilkhanate':'ILK','Seljuk Caliphate':'RUM','Ryazan':'RUS','Novgorod':'NOV','Mamluke Sultanate':'MAM',
    'Sultanate of Delhi':'DEL','Byzantine Empire':'BYZ','Holy Roman Empire':'HRE','France':'FRA','English territory':'ENG','Castile':'CAS','Hungary':'HUN','Shogun Japan (Kamakura)':'JAP','Đại Việt':'DAI'},
  paint:[
    ['ACR',[[34.9,32.4],[35.3,33.5],[35.7,34.6],[35.95,34.5],[35.4,33.2],[35.05,32.4]]],
    ['CIL',[[34.0,36.2],[32.5,36.1],[34.6,37.4],[36.6,37.6],[36.2,36.9],[36.0,36.3]]],
  ],
  nations:{
    YUA:{nm:'Yuan-rijk (Koeblai Khan)',pop:75,mil:800,pc:2000,bud:40,ag:.85,cap:[116.4,39.9],col:'#c9a227'},
    GOL:{nm:'Gouden Horde',pop:5,mil:200,pc:1300,bud:5,ag:.8,cap:[47.4,47.9],col:'#b5832a'},
    ILK:{nm:'Il-kanaat',pop:10,mil:200,pc:1800,bud:8,ag:.8,cap:[46.08,38.07],col:'#a8722e'},
    CHG:{nm:'Chagatai-kanaat (Kaidu)',pop:3,mil:150,pc:1300,bud:3,ag:.85,cap:[81.3,43.9],col:'#8f6a2c'},
    MAM:{nm:'Mammelukken (Egypte)',pop:5,mil:60,pc:2200,bud:5,ag:.6,cap:[31.24,30.05]},DEL:{nm:'Sultanaat Delhi',pop:20,mil:150,pc:1500,bud:6,ag:.6,cap:[77.2,28.6]},
    BYZ:{nm:'Byzantijnse Rijk',pop:5,mil:30,pc:2000,bud:3,ag:.4,cap:[28.98,41.01]},RUM:{nm:'Sultanaat Rum (vazal)',pop:2,mil:20,pc:1600,bud:1,ag:.3},
    RUS:{nm:'Russische vorstendommen (vazallen)',pop:4,mil:30,pc:1300,bud:1,ag:.3},NOV:{nm:'Republiek Novgorod',pop:.6,mil:12,pc:1700,bud:.6,ag:.3},
    ACR:{nm:'Kruisvaardersstaten (Akko)',pop:.2,mil:5,pc:2500,bud:.4,ag:.3,cap:[35.08,32.93]},CIL:{nm:'Armeens Cilicië',pop:.4,mil:10,pc:2000,bud:.4,ag:.4},
    HRE:{nm:'Heilige Roomse Rijk',pop:14,mil:60,pc:1700,bud:5,ag:.4,cap:[16.37,48.21]},FRA:{nm:'Koninkrijk Frankrijk',pop:15,mil:50,pc:1800,bud:5,ag:.5,cap:[2.35,48.86]},
    ENG:{nm:'Koninkrijk Engeland',pop:4,mil:30,pc:1800,bud:2,ag:.55,cap:[-0.13,51.5]},CAS:{nm:'Castilië',pop:4,mil:30,pc:1600,bud:2,ag:.5,cap:[-4.72,41.65]},
    HUN:{nm:'Koninkrijk Hongarije',pop:2,mil:30,pc:1500,bud:1,ag:.4,cap:[18.65,47.5]},JAP:{nm:'Japan (Kamakura-shogunaat)',pop:6,mil:60,pc:1600,bud:2,ag:.4,cap:[139.55,35.32]},
    DAI:{nm:'Đại Việt (Trần)',pop:3,mil:100,pc:1300,bud:1,ag:.5,cap:[105.85,21.03]},
    'Mali':{nm:'Rijk van Mali',pop:8,mil:80,pc:1500,bud:3,ag:.5,cap:[-8.0,11.6]},
  },
  al:[['YUA','ILK'],['GOL','CHG'],['GOL','MAM'],['ILK','CIL'],['ILK','RUM'],['GOL','RUS'],['MAM','BYZ'],['ACR','ILK']],
  war:[['YUA','CHG'],['GOL','ILK'],['ILK','MAM'],['YUA','JAP'],['MAM','ACR'],['YUA','DAI'],['YUA','Pagan']],
  tr:[['GOL','BYZ'],['ILK','BYZ'],['MAM','BYZ'],['YUA','ILK'],['FRA','ENG']],
};
module.exports.extraNames=N;
