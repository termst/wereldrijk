// Slag bij Kadesh, mei 1274 v.Chr.: Ramses II (Egypte) tegen Muwatalli II (Hettieten) om Syrië.
module.exports={lead:['EGY','HAT','ASS'],id:'kadesh',nm:'Slag bij Kadesh',y:-1274,m:5,tier:'brons',base:'world_bc1000',
  pc:1500,dens:.25,milPer:6,ag:.3,minKm:2500,
  map:{'Egypt':'EGY','Hittites':'HAT','Assyria':'ASS','Babylonia':'BAB','Elam':'ELA','Greek city-states':'MYK','Kingdom of David and Solomon':'EGY',
    'state societies and Aramaean kingdoms':'ARA','Arameans':'ARA','Phrygians':'HAT','Urartu':'NAI','Zhoa':'SHA','Sinic':'SHA','Wu':'BAI','Saba':'ZAR','Kush':'KUS',
    'Thrace':'THR','Cimerians':'CIM','Illyrians':'ILL','Berbers':'LIB'},
  paint:[
    // Egypt holds Nubia up to the fourth cataract and Canaan up to the Orontes
    ['EGY',[[29.5,22.2],[34.0,22.2],[34.6,19.5],[32.5,18.2],[31.0,18.4],[29.5,20.0]]],
    ['EGY',[[34.2,31.3],[34.6,32.6],[35.1,33.4],[35.5,34.1],[36.1,34.3],[36.9,34.0],[36.6,33.0],[36.3,31.8],[35.6,29.6],[34.9,29.5],[34.3,30.6]]],
    // the Hittite empire: Anatolia (with Arzawa) and northern Syria up to Kadesh, Ugarit and Carchemish
    ['HAT',[[26.2,38.3],[26.4,40.1],[28.5,40.6],[31.0,41.0],[33.5,40.6],[35.8,40.8],[38.0,40.1],[39.6,38.6],[40.0,37.3],[38.6,36.2],[38.4,35.4],[36.9,34.4],[36.2,34.5],[35.8,35.2],[35.8,36.2],[36.1,36.7],[34.6,36.8],[32.6,36.1],[30.4,36.3],[28.1,36.6],[26.9,37.6]]],
    // the Kaska tribes on the Black Sea coast, never conquered by the Hittites
    ['KAS',[[31.5,41.4],[35.0,42.1],[37.5,41.2],[38.8,40.9],[37.0,40.6],[34.6,40.9],[32.5,41.0]]],
    // Hanigalbat (what is left of Mitanni), Assyria and Kassite Babylonia
    ['MIT',[[38.6,36.9],[38.6,35.6],[40.6,35.0],[41.6,36.3],[40.6,37.3],[39.4,37.4]]],
    ['ASS',[[41.6,36.3],[41.2,35.0],[43.6,34.3],[44.8,35.4],[44.6,37.3],[42.8,37.5]]],
    ['BAB',[[43.6,34.3],[45.6,34.0],[47.9,31.5],[48.1,29.9],[46.3,29.9],[44.0,31.0],[42.4,33.6]]],
    ['ELA',[[47.9,31.5],[45.6,34.0],[47.5,34.5],[50.5,32.5],[51.0,30.0],[48.1,29.9]]],
    // Alashiya (Cyprus), Mycenaean Greece with Crete
    ['ALA',['Cyprus']],['MYK',[[20.6,36.2],[20.6,39.6],[23.6,40.2],[24.4,38.3],[26.5,36.4],[26.5,34.7],[23.0,34.7]]],
  ],
  nations:{
    EGY:{nm:'Egypte (Nieuwe Rijk)',pop:3.5,mil:60,pc:2600,bud:6,ag:.75,cap:[31.9,30.8]},
    HAT:{nm:'Hettitische Rijk',pop:2.2,mil:47,pc:2100,bud:4,ag:.75,cap:[34.6,40.0]},
    ASS:{nm:'Assyrië',pop:0.9,mil:20,pc:2000,bud:1.2,ag:.8,cap:[43.26,35.46]},
    BAB:{nm:'Babylonië (Kassieten)',pop:1.4,mil:18,pc:2300,bud:1.2,ag:.4,cap:[44.42,32.54]},
    ELA:{nm:'Elam',pop:0.6,mil:12,pc:1900,bud:.6,ag:.5,cap:[48.25,32.19]},
    MIT:{nm:'Hanigalbat (Mitanni)',pop:0.4,mil:8,pc:1800,bud:.3,ag:.3,cap:[40.1,36.85]},
    MYK:{nm:'Myceense Griekenland (Achaeërs)',pop:0.6,mil:15,pc:1900,bud:.6,ag:.55,cap:[22.76,37.73]},
    ALA:{nm:'Alasiya (Cyprus)',pop:0.12,mil:2,pc:2200,bud:.1,ag:.2,cap:[33.4,35.1]},
    KAS:{nm:'Kaska-stammen',pop:0.3,mil:8,pc:800,bud:.1,ag:.7},
    ARA:{nm:'Ahlamu en Suteeërs (nomaden)',pop:0.4,mil:6,pc:700,bud:.05,ag:.5},
    NAI:{nm:'Nairi-stammen',pop:0.4,mil:6,pc:800,bud:.05,ag:.4},
    SHA:{nm:'Shang-dynastie',pop:4,mil:30,pc:1600,bud:2,ag:.55,cap:[114.3,36.1]},
    BAI:{nm:'Baiyue-volken',pop:2,mil:10,pc:800,bud:.2,ag:.3},
    KUS:{nm:'Koesj (Nubische stammen)',pop:0.5,mil:8,pc:900,bud:.1,ag:.4},
    LIB:{nm:'Libiërs (Libu en Meshwesh)',pop:0.5,mil:12,pc:700,bud:.1,ag:.6},
    THR:{nm:'Thraciërs',pop:0.6,mil:10,pc:900,bud:.1,ag:.5},CIM:{nm:'Cimmeriërs',pop:0.4,mil:10,pc:700,bud:.1,ag:.6},ILL:{nm:'Illyriërs',pop:0.4,mil:8,pc:800,bud:.1,ag:.5},
    ZAR:{nm:'Zuid-Arabische stammen',pop:0.4,mil:5,pc:900,bud:.05,ag:.3},
    'Vedic Aryans':{nm:'Vedische Ariërs',pop:3,mil:20,pc:900,bud:.3,ag:.5},'Dravidians':{nm:'Dravidische volken',pop:5,mil:20,pc:800,bud:.3,ag:.3},
    'Olmec':{nm:'Olmeken',pop:0.3,mil:3,pc:1000,bud:.05,ag:.3},
  },
  al:[['HAT','MIT'],['EGY','ALA'],['ASS','ELA']],
  war:[['EGY','HAT'],['ASS','MIT'],['HAT','KAS'],['EGY','LIB']],
  tr:[['EGY','ALA'],['HAT','ALA'],['EGY','MYK'],['HAT','BAB'],['EGY','BAB'],['MYK','ALA']],
};
