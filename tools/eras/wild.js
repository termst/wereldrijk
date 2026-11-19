// Peoples without a state of their own: hunter-gatherers, herders, farming and archaeological cultures, loose tribal groups.
// Matched on the key and the Dutch name (some eras give such a group its own numbers, like the Aboriginals as ABO).
// The game marks them w:1: they plan no wars of conquest, make no pacts, never win, and their land counts for the win line
// only once a state holds it.
const RX=new RegExp([
  'hunter','gatherer','nomad','peoples?\\b','tribes','farmers','cultures?\\b','pastoral','herder','fishing','foraging','fichers',
  '\\bBantu','Khoisan','S[áa]a?mi\\b','Inuit','Inupiaq','Thule','Dorset','Siberians','Papuans?\\b','Polynesians','Aborig','Samoy',
  'Tungus','Proto-','Paleo-','\\bBalts\\b','Slavs','\\bAinus?\\b','M[aā]oris?\\b','Guanches','Arawaks','Taino','Kalinago','Shuar',
  'Athaba[sk]can','Chukchi','Itelmen','Nganasan','Touareg','Kiowa','Abnaki','Paiute','Muskogee','Illinois','Wichita','\\bCrow\\b',
  'Santee','Osage','Mescalero','\\bUte\\b','Teton','\\bErie\\b','Shawnee','Yup.ik','Apache','Cochim','Guachi','Tepehuane','\\bCree\\b',
  'Shoshoni','Innu\\b','Obiwa','atsaot','Guanahatabeyes','Point Peninsula','Chorrera','El Paraiso','Austronesians','Iron Age chieftain',
  'Mon-Khmer','Dravidians','^Thai$','^Malays$','^Arabs$','Norsemen','^Celts$','^Tibetans$','Kryvichs','Polanes','Severians','Frisians','Saxons',
  '^Alans$','Prussians','Curonians','Oromo'].join('|'),'i');
module.exports=(k,name)=>RX.test(k)||RX.test(name||'');
