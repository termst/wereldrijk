// Punische oorlogen, april 218 v.Chr.: Hannibal vertrekt uit Spanje naar Italië. Carthago op zijn grootst (met Iberië).
const {S}=require('./ancient_common.js');
const italyS=[[7.6,44.15],[10.0,44.0],[12.4,44.35],[13.6,43.5],[14.8,42.0],[16.2,41.9],[18.6,40.2],[16.6,37.8],[15.5,37.9],[12.0,41.4],[10.5,42.9],[8.8,44.0]];
const sicily=[[12.3,38.3],[15.7,38.3],[15.4,36.6],[12.4,37.6]];
const iberia=[[-9.6,36.8],[-9.6,43.9],[-1.5,43.6],[3.4,42.5],[3.4,41.5],[0.9,40.8],[0,38.8],[-2,36.6],[-5.6,35.9]];
const barcid=[[-9.0,37.0],[-7.4,37.2],[-6.2,38.6],[-4.8,39.6],[-2.6,40.5],[-0.7,41.0],[0.9,41.0],[0.2,39.6],[-0.4,38.5],[-1.6,37.0],[-2.5,36.6],[-5.6,36.0],[-7.3,37.0]];
const coele=[[34.2,31.3],[34.6,32.6],[35.1,33.4],[35.6,34.6],[36.4,34.0],[36.4,31.5],[35.0,29.3],[34.3,30.6]];
module.exports={lead:['ROM','CAR'],id:'punisch',nm:'Punische oorlogen',y:-218,m:4,tier:'klassiek',base:'world_bc200',
  pc:1500,dens:.4,milPer:8,ag:.3,minKm:1500,minThick:4,
  map:{'Rome':'ROM','Carthage':'CAR','Kingdom of Syphax':'SYP','Kingdom of Gala':'MAS','Mauretania':'MAU','Ptolemaic Kingdom':'PTO','Seleucid Kingdom':'SEL',
    'Macedon and Hellenic League':'MAC','Pergamon':'PRG','Parthia':'PAR','Bactria':'BAC','Han Empire':'QIN','Mauryan Empire':'MAR','minor states':'ANA','?':'THR',
    'Dardania':'ILL','Celts':'KEL','Bosporan Kingdom':'BOS','Scythians':'SCY','Nabatean Kingdom':'NAB','Arabs':'Arabs'},
  paint:[
    ['KEL',[[-4.8,48.6],[2.5,51.2],[6.5,51.6],[8.3,49],[7.6,47.6],[6.8,45.9],[6.8,44.0],[4.0,43.4],[3.0,42.4],[-1.8,43.4],[-1.3,46.0]]],['IBE',iberia],['CAR',barcid],['CAR',S.carthAfr],['CAR',S.baleares],
    ['ROM',italyS],['ROM',sicily],['ROM',S.sardinia],['ROM',S.corsica],['SYR',[[14.6,37.6],[15.4,37.6],[15.35,36.6],[14.6,36.7]]],
    ['KEC',[[6.8,45.9],[12.5,45.9],[12.4,44.5],[10.0,44.1],[7.6,44.3],[6.8,45.0]]],
    ['PTO',S.egypt],['PTO',S.cyrenaica],['PTO',coele],['PTO',['Cyprus']],
    ['AET',S.aetolia],['SPA',[[22.0,37.4],[23.0,37.4],[23.2,36.4],[22.4,36.4],[21.9,36.8]]],['EPI',S.epirus],
  ],
  nations:{
    ROM:{nm:'Romeinse Republiek',pop:4,mil:110,pc:2500,bud:8,ag:.8,cap:[12.48,41.9]},
    CAR:{nm:'Carthago',pop:3.5,mil:100,pc:3000,bud:9,ag:.8,cap:[10.32,36.85]},
    SYR:{nm:'Syracuse (Hiëro II)',pop:.25,mil:10,pc:2800,bud:.6,ag:.2,cap:[15.29,37.07]},
    KEC:{nm:'Cisalpijnse Galliërs (Boii en Insubres)',pop:1,mil:40,pc:1300,bud:.3,ag:.7},
    IBE:{nm:'Keltiberiërs en Lusitaniërs',pop:2,mil:50,pc:1200,bud:.3,ag:.5},
    SYP:{nm:'Numidië (Syphax)',pop:.8,mil:30,pc:1200,bud:.3,ag:.5},MAS:{nm:'Numidië (Gala)',pop:.5,mil:20,pc:1200,bud:.2,ag:.5},MAU:{nm:'Mauretanië',pop:.6,mil:15,pc:1100,bud:.2,ag:.3},
    PTO:{nm:'Ptolemeïsche Rijk (Egypte)',pop:6,mil:75,pc:2800,bud:10,ag:.5,cap:[29.92,31.2]},SEL:{nm:'Seleucidische Rijk',pop:12,mil:80,pc:2300,bud:12,ag:.75,cap:[36.17,36.2]},
    MAC:{nm:'Macedonië en de Helleense Bond',pop:1.2,mil:30,pc:2000,bud:2,ag:.65,cap:[22.52,40.76]},AET:{nm:'Aetolische Bond',pop:.2,mil:10,pc:1600,bud:.3,ag:.6},
    SPA:{nm:'Sparta',pop:.1,mil:5,pc:1800,bud:.2,ag:.5},EPI:{nm:'Epirus',pop:.2,mil:6,pc:1500,bud:.2,ag:.3},PRG:{nm:'Pergamon',pop:.4,mil:10,pc:2600,bud:.8,ag:.4,cap:[27.18,39.13]},
    ANA:{nm:'Anatolische koninkrijken (Bithynië, Pontus, Cappadocië)',pop:3,mil:40,pc:1600,bud:1.5,ag:.4},THR:{nm:'Thraciërs',pop:1,mil:30,pc:1100,bud:.3,ag:.5},ILL:{nm:'Illyriërs en Dardaniërs',pop:.6,mil:15,pc:1000,bud:.2,ag:.6},
    KEL:{nm:'Galliërs',pop:5,mil:150,pc:1200,bud:1,ag:.5},BOS:{nm:'Bosporaanse Rijk',pop:.3,mil:8,pc:1800,bud:.3,ag:.3},SCY:{nm:'Sarmaten en Scythen',pop:2,mil:80,pc:900,bud:.4,ag:.7},NAB:{nm:'Nabateeërs',pop:.3,mil:8,pc:2000,bud:.3,ag:.3,cap:[35.44,30.33]},
    PAR:{nm:'Parthië',pop:1.5,mil:30,pc:1500,bud:.8,ag:.7},BAC:{nm:'Grieks-Bactrische Rijk',pop:2.5,mil:40,pc:1800,bud:1.5,ag:.6,cap:[66.9,36.75]},
    QIN:{nm:'Qin-dynastie',pop:20,mil:500,pc:1500,bud:10,ag:.75,cap:[108.9,34.3]},MAR:{nm:'Mauryarijk',pop:30,mil:250,pc:1300,bud:10,ag:.4,cap:[85.14,25.6]},
    'Xiongnu':{nm:'Xiongnu',pop:1.5,mil:150,pc:800,bud:.6,ag:.85},
  },
  al:[['CAR','KEC'],['CAR','MAS'],['ROM','SYR'],['ROM','PRG'],['MAC','PTO'],['AET','SPA']],
  war:[['ROM','CAR'],['ROM','KEC'],['MAC','AET'],['MAC','SPA'],['SEL','PTO'],['QIN','Xiongnu']],
  tr:[['ROM','PTO'],['CAR','PTO'],['SEL','BAC'],['SEL','MAR'],['ROM','MAS']],
};
