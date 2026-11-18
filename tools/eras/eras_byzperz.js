// Byzantijns-Perzische oorlog, september 622: het Sassanidische Perzië op zijn grootst (met Egypte, Syrië en Palestina).
// Keizer Herakleios begint zijn tegenaanval; in Arabië trekt Mohammed van Mekka naar Medina (de Hidjra).
const {S}=require('./ancient_common.js');const {N}=require('./medieval_common.js');
module.exports={lead:['BYZ','PER'],id:'byzperz',nm:'Byzantijns-Perzische oorlog',y:622,m:9,tier:'klassiek',base:'world_600',
  pc:1500,dens:.5,milPer:8,ag:.3,minKm:2000,minThick:5,
  names:{jt:['kataphrakten','kataphrakt']},
  map:{'Eastern Roman Empire':'BYZ','Sasanian Empire':'PER','Sasanian dependencies':'PER','Mazun':'PER','Slavs':'SLA','Ostrogoths':'AVA','Avars':'AVA','Frankish Kingdom':'FRA','Neustria':'FRA','Vasconia':'FRA',
    'Visigothic Kingdom':'VIS','Lombard principalities':'LOM','Göktürks':'GOK','Sui Empire':'TAN','Kanauj':'HAR','Chalukyas':'CHA','Hejaz':'HEJ','Khazars':'KHA','Bulgars':'BUL','Axum':'AKS','Koguryo':'KOG','Yamato':'YAM','Pallavas':'PAL','Shaskanka':'GAU'},
  paint:[
    ['BER',[[-17,21],[-12,28],[-9,30],[-2,32.5],[3,34],[8,34.3],[10,33],[15,31],[20,30],[25,29.5],[25,20],[15,15],[0,15],[-17,15]]],
    ['PER',S.egypt],['PER',S.levant],['PER',[[36.0,36.9],[35.5,38.0],[36.5,39.5],[38.5,40.5],[41.5,41.2],[44,41.3],[44,37.5],[40,37.0],[38.5,36.6]]],
    ['SLA',[[15.0,45.5],[19.0,45.0],[22.5,44.5],[27.5,44.0],[28.0,43.0],[26.5,42.2],[24.0,41.8],[22.5,41.2],[21.0,40.6],[20.0,41.5],[19.5,42.5],[17.5,43.5],[16.0,44.5]]],
    ['BYZ',S.sicilyE],['BYZ',S.sicilyW],['BYZ',S.sardinia],['BYZ',S.corsica],['BYZ',[[15.6,40.1],[16.6,40.6],[17.3,40.5],[18.6,40.1],[16.6,37.8],[15.6,37.9]]],
    ['BYZ',[[11.5,44.6],[12.6,44.9],[13.6,43.5],[12.9,41.8],[12.2,41.6],[11.7,42.2],[12.2,43.0]]],['BYZ',[[7.6,44.1],[10.0,44.0],[9.8,44.4],[8.2,44.4]]],
    ['BYZ',[[8.3,37.1],[11.2,37.2],[11.2,35.0],[15.5,32.3],[13,32],[10.2,33.5],[8.3,34.8],[6.0,36.0],[3.0,36.8]]],
    ['VIS',[[1.5,43.0],[3.2,42.4],[4.5,43.5],[3.6,43.9],[1.8,43.6]]],['BYZ',[[-2.5,37.4],[-0.6,38.4],[-0.6,37.5],[-2.0,36.7]]],
    ['WTK',[[50,47],[80,50],[85,42],[75,37],[60,37],[52,40]]],
  ],
  nations:{
    BYZ:{nm:'Byzantijnse Rijk',pop:12,mil:100,pc:2600,bud:14,ag:.7,cap:[28.98,41.01]},
    PER:{nm:'Sassanidische Rijk (Perzië)',pop:25,mil:200,pc:2400,bud:20,ag:.85,cap:[44.58,33.09]},
    BER:{nm:'Berberse stammen',pop:2,mil:40,pc:800,bud:.3,ag:.5},
    AVA:{nm:'Avaren',pop:1,mil:100,pc:1000,bud:1,ag:.8},SLA:{nm:'Slavische stammen',pop:2,mil:40,pc:800,bud:.2,ag:.5},
    FRA:{nm:'Frankische Rijk (Merovingers)',pop:8,mil:60,pc:1500,bud:3,ag:.55,cap:[2.35,48.86]},VIS:{nm:'Visigotische Rijk',pop:4,mil:40,pc:1500,bud:1.5,ag:.5,cap:[-4.02,39.86]},
    LOM:{nm:'Longobarden',pop:2,mil:30,pc:1500,bud:1,ag:.6,cap:[9.16,45.19]},GOK:{nm:'Oost-Turkse Kaganaat',pop:2,mil:150,pc:900,bud:1.5,ag:.8},
    WTK:{nm:'West-Turkse Kaganaat',pop:2,mil:150,pc:1000,bud:1.5,ag:.7},KHA:{nm:'Chazaren',pop:.8,mil:60,pc:1000,bud:.6,ag:.6},BUL:{nm:'Bulgaren',pop:.6,mil:40,pc:900,bud:.3,ag:.6},
    TAN:{nm:'Tang-dynastie',pop:25,mil:300,pc:1700,bud:12,ag:.7,cap:[108.9,34.3]},HAR:{nm:'Rijk van Harsha (Kanauj)',pop:25,mil:200,pc:1300,bud:6,ag:.7,cap:[79.92,27.05]},
    CHA:{nm:'Chalukya\'s',pop:12,mil:120,pc:1200,bud:3,ag:.6},PAL:{nm:'Pallava\'s',pop:8,mil:60,pc:1300,bud:2,ag:.4},GAU:{nm:'Gauda (Shashanka)',pop:4,mil:30,pc:1200,bud:.8,ag:.5},
    HEJ:{nm:'Hejaz (Mekka en Medina)',pop:.5,mil:10,pc:1200,bud:.2,ag:.4,cap:[39.6,24.47]},AKS:{nm:'Aksum',pop:1.5,mil:30,pc:1300,bud:.6,ag:.4},
    KOG:{nm:'Koguryo',pop:3,mil:100,pc:1200,bud:1,ag:.6},YAM:{nm:'Yamato (Japan)',pop:4,mil:30,pc:1200,bud:1,ag:.3},
  },
  al:[['BYZ','WTK'],['BYZ','KHA'],['PER','AVA'],['AVA','SLA'],['WTK','KHA']],
  war:[['BYZ','PER'],['BYZ','AVA'],['BYZ','SLA'],['TAN','GOK'],['HAR','CHA'],['PER','WTK']],
  tr:[['BYZ','FRA'],['BYZ','AKS'],['PER','TAN'],['BYZ','HEJ'],['PER','HAR']],
};
module.exports.extraNames=N;
