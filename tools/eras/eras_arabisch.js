// Arabische veroveringen, oktober 732: het Omajjadische kalifaat op zijn grootst, van Spanje tot de Indus.
// Bij Poitiers (Tours) houdt Karel Martel de Arabieren tegen.
const {S}=require('./ancient_common.js');const {N}=require('./medieval_common.js');
module.exports={lead:['UMA','FRA','BYZ'],id:'arabisch',nm:'Arabische veroveringen',y:732,m:10,tier:'middel',base:'world_700',
  pc:1500,dens:.6,milPer:8,ag:.3,minKm:2000,minThick:5,
  names:{tk:['kamelenruiters','kamelenruiter'],jt:['zware ruiters','zware ruiter']},
  map:{'Umayyad Caliphate':'UMA','Mauri':'UMA','Warsenis':'UMA','Aures':'UMA','Barghawata':'UMA','Sasanian Empire':'UMA','Sasanian dependencies':'UMA','Mazun':'UMA','Hejaz':'UMA','Kingdom of Sind':'UMA',
    'Kwarezm':'UMA','Caucasian Albania':'UMA','Armenia':'UMA','Visigothic Kingdom':'UMA','Eastern Roman Empire':'BYZ','Slavs':'SLA','Frankish Kingdom':'FRA','Neustria':'FRA','Vasconia':'FRA',
    'Lombard principalities':'LOM','Göktürks':'GOK','Western Gokturk Khaganate':'TUR','Sui Empire':'TAN','Tufan Empire':'TIB','Khazars':'KHA','Huns':'KHA','Sabirs':'KHA','Danube Bulgars':'BUL','Kingdom of Kashmir':'KAS',
    'Kanauj':'KAN','Kingdom of Kapisa':'KAB','Kingdom of Zunbil':'ZUN','Axum':'AKS','Makkura':'MAK','Nobatia':'MAK','Avars':'AVA','Goths':'KHA'},
  paint:[
    // Spain and Septimania are Arab; Asturias holds out in the mountains; Aquitaine (Odo) has just been beaten
    ['UMA',[[-9.6,36.8],[-9.6,42.0],[-7.0,42.4],[-1.8,42.8],[1.8,42.6],[3.3,42.4],[3.4,41.6],[0.9,40.8],[0,38.8],[-2,36.6],[-5.6,35.9]]],
    ['UMA',[[1.8,43.0],[3.2,42.4],[4.8,43.4],[3.6,44.0],[2.0,43.7]]],
    ['AST',[[-9.4,43.2],[-1.8,43.45],[-3.5,42.7],[-7.0,42.5],[-9.4,42.4]]],
    ['AQU',[[-1.8,43.4],[1.0,43.0],[2.4,43.5],[3.0,44.5],[2.5,46.5],[0.6,47.1],[-2.2,47.1]]],
    ['UMA',S.egypt],['UMA',S.levant],['UMA',S.cyrenaica],['UMA',[[8.3,37.1],[11.2,37.2],[11.2,35.0],[15.5,32.3],[13,32],[10.2,33.5],[8.3,34.8],[6.0,36.0],[3.0,36.8]]],
    ['UMA',[[61,37.5],[64,40.5],[68,41.5],[70.5,40.5],[69,37],[66,37]]],
    ['BYZ',S.sicilyE],['BYZ',S.sicilyW],['BYZ',[[15.6,40.1],[16.6,40.6],[17.3,40.5],[18.6,40.1],[16.6,37.8],[15.6,37.9]]],['BYZ',S.crete],
    ['BYZ',[[11.5,44.6],[12.6,44.9],[13.6,43.5],[12.9,41.8],[12.2,41.6],[11.7,42.2],[12.2,43.0]]],
  ],
  nations:{
    UMA:{nm:'Omajjadisch Kalifaat',pop:34,mil:300,pc:2400,bud:30,ag:.85,cap:[36.29,33.51]},
    BYZ:{nm:'Byzantijnse Rijk',pop:8,mil:80,pc:2400,bud:10,ag:.55,cap:[28.98,41.01]},
    FRA:{nm:'Frankische Rijk (Karel Martel)',pop:7,mil:50,pc:1500,bud:3,ag:.6,cap:[2.35,48.86]},AQU:{nm:'Aquitanië (Odo)',pop:1.5,mil:15,pc:1500,bud:.5,ag:.4,cap:[0.34,46.58]},
    AST:{nm:'Koninkrijk Asturië',pop:.2,mil:4,pc:1200,bud:.1,ag:.6,cap:[-5.85,43.36]},LOM:{nm:'Longobarden (Liutprand)',pop:2.5,mil:30,pc:1600,bud:1,ag:.6,cap:[9.16,45.19]},
    BUL:{nm:'Bulgaarse Rijk',pop:1.5,mil:30,pc:1000,bud:.5,ag:.5},AVA:{nm:'Avaren',pop:.8,mil:40,pc:900,bud:.3,ag:.5},SLA:{nm:'Slavische stammen',pop:2,mil:30,pc:800,bud:.2,ag:.4},
    KHA:{nm:'Chazaren',pop:1.5,mil:100,pc:1100,bud:1,ag:.7},TUR:{nm:'Türgesh-kaganaat',pop:1,mil:100,pc:1000,bud:.8,ag:.8},GOK:{nm:'Tweede Turkse Kaganaat',pop:1.5,mil:120,pc:900,bud:.8,ag:.6},
    TAN:{nm:'Tang-dynastie',pop:50,mil:600,pc:1800,bud:25,ag:.6,cap:[108.9,34.3]},TIB:{nm:'Tibetaanse Rijk',pop:5,mil:100,pc:1000,bud:1.5,ag:.75,cap:[91.1,29.65]},
    KAS:{nm:'Kasjmir (Lalitaditya)',pop:3,mil:50,pc:1300,bud:1,ag:.7},KAN:{nm:'Kanauj (Yashovarman)',pop:12,mil:80,pc:1200,bud:2,ag:.5},KAB:{nm:'Kabul-Shahi',pop:1,mil:20,pc:1100,bud:.3,ag:.5},ZUN:{nm:'Zunbils',pop:.6,mil:15,pc:1000,bud:.2,ag:.5},
    AKS:{nm:'Aksum',pop:1.2,mil:20,pc:1100,bud:.3,ag:.3},MAK:{nm:'Makurië',pop:1,mil:20,pc:1200,bud:.3,ag:.4},
  },
  al:[['FRA','AQU'],['BYZ','KHA'],['BYZ','BUL'],['UMA','KHA']].slice(0,3),
  war:[['UMA','FRA'],['UMA','AQU'],['UMA','KHA'],['UMA','TUR'],['UMA','BYZ'],['UMA','AST'],['UMA','KAB'],['UMA','ZUN'],['TAN','TIB'],['GOK','TAN'],['KAS','TIB']],
  tr:[['UMA','TAN'],['BYZ','FRA'],['UMA','MAK'],['BYZ','LOM'],['TAN','TIB']],
};
module.exports.extraNames=N;
