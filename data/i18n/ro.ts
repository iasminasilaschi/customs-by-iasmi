/**
 * Conținutul în română: poveștile proiectelor, pașii, materialele, lecțiile,
 * textele alternative și legendele pozelor, legendele din hero și de pe
 * Instagram. Engleza rămâne sursa în data/portfolio.ts, data/media.ts și
 * data/instagram.ts; aici stă doar traducerea.
 *
 * Ce lipsește de aici apare în engleză (nimic nu se strică). Pozele sunt
 * legate după `src`, deci reordonarea lor în data/portfolio.ts nu încurcă
 * nimic; o poză nouă are nevoie doar de o linie nouă aici.
 */

export interface PhotoText {
  alt: string;
  caption?: string;
}

export interface PieceText {
  title?: string;
  subtitle?: string;
  story?: string;
  processSteps?: string[];
  materials?: string[];
  time?: string;
  learned?: string[];
  processNote?: string;
  cover?: PhotoText;
  before?: PhotoText;
  after?: PhotoText;
  /** Chapter titles and notes, in the same order as in data/portfolio.ts. */
  chapters?: { title: string; note?: string }[];
  /** Gallery, chapter and making-of photos, by `src`. */
  photos?: Record<string, PhotoText>;
}

/** Tags are shared between projects, so they're translated once. */
export const roTags: Record<string, string> = {
  "hand-painted": "pictat de mână",
  anime: "anime",
  "one piece": "one piece",
  "fan art": "fan art",
  "custom initials": "inițiale personalizate",
  gift: "cadou",
  sushi: "sushi",
  cats: "pisici",
  "black sneakers": "sneakers negri",
  florals: "flori",
  "cherry blossoms": "flori de cireș",
  remake: "refăcut",
  "white sneakers": "sneakers albi",
  "tattoo inspo": "inspirație din tatuaje",
  "fine line": "linii fine",
  minimalist: "minimalist",
  "graduation cap": "tocă de absolvire",
  medicine: "medicină",
  "anatomical heart": "inimă anatomică",
};

/** Instagram link labels on project pages. */
export const roInstagramLabels: Record<string, string> = {
  "See the photos on Instagram": "Vezi pozele pe Instagram",
  "See the post on Instagram": "Vezi postarea pe Instagram",
  "Watch the reel": "Vezi reelul",
};

const op = "/work/one-piece-sneakers";
const sc = "/work/sushi-cats";
const cb = "/work/cherry-blossoms";
const tc = "/work/tattoo-cats";
const dr = "/work/doctor-cu-suflet-si-ratiune";
const sp = "/work/superpower-called-empathy";

export const roPieces: Record<string, PieceText> = {
  "one-piece-sneakers": {
    title: "One Piece, cu o notă personală",
    subtitle: "Zoro, Luffy și inițiale personalizate în stil One Piece: un cadou pictat de mână, purtat intens un an întreg.",
    cover: {
      alt: "Perechea One Piece pictată de mână, un pantof peste altul: Zoro cu trei săbii pe pantoful drept, Luffy cu pălăria de paie și un dragon pe cel stâng.",
    },
    story:
      "Perechea asta a fost un cadou pentru un mare fan One Piece și a durat mult: cam o lună, lucrând la ea cu pauze. Scenele le-a ales chiar el. E pictată doar partea exterioară a fiecărui pantof, plus călcâiele: Zoro pe pantoful drept, iar Luffy cu un dragon pe cel stâng.\n\nAm început cu călcâiele. Cel drept poartă logo-ul One Piece. Pentru cel stâng am avut ideea mea preferată din tot proiectul: inițialele lui, R·M·A, desenate în același stil ca logo-ul. Micile detalii din jurul literelor sunt în spiritul One Piece, dar sunt ideile mele, alese să se potrivească cu numele. Îmi place enorm cât de asortate și drăguțe arată cele două călcâie împreună și cât de personală a devenit perechea.\n\nApoi a venit adevăratul test. Îi poartă de un an: ploaie, soare, zi și noapte, condus, plimbări lungi, fără pic de milă. Logica lui era „dacă îi stric, știu cine mi-i repară.” Îi curăță des cu peria și, după un an, vopseaua arată tot impecabil. Aș zice că au trecut testul cu brio, și cu toate culorile intacte.",
    processSteps: [
      "Îndepărtarea finisajului de fabrică de pe tot pantoful, cu acetonă și bile de vată",
      "Șlefuire cu șmirghel de mai multe granulații, ca vopseaua să se prindă bine",
      "Curățarea suprafeței cu peria",
      "Schițarea desenelor pe piele",
      "Întâi călcâiele: logo-ul One Piece pe dreptul, inițialele R·M·A pe stângul",
      "Panourile exterioare: Zoro pe pantoful drept, Luffy și un dragon pe cel stâng",
      "Vopsele Angelus în straturi foarte subțiri, cu uscare între ele",
      "Sigilare cu Angelus flat finisher, plus un strat de finisaj pentru canapele din piele, pentru protecție în plus",
    ],
    materials: [
      "Acetonă + bile de vată, pentru îndepărtarea finisajului",
      "Șmirghel de mai multe granulații",
      "Vopsele pentru piele Angelus",
      "Angelus flat finisher",
      "Finisaj pentru canapele din piele, ca strat în plus",
    ],
    time: "Cam o lună, lucrând cu pauze",
    processNote: "Videoclipul vine curând, după ce îl editez! Până atunci, două instantanee de pe parcurs.",
    photos: {
      [`${op}/01.jpg`]: { alt: "Pantoful stâng purtat, proaspăt pictat: Luffy cu pălăria de paie și un dragon albastru lângă călcâi.", caption: "Proaspăt pictat: Luffy și dragonul pe pantoful stâng." },
      [`${op}/02.jpg`]: { alt: "Pantoful drept purtat, proaspăt pictat: Zoro cu săbiile lui și un afiș WANTED lângă călcâi.", caption: "Proaspăt pictat: Zoro pe pantoful drept." },
      [`${op}/03.jpg`]: { alt: "Spatele ambilor pantofi, proaspăt pictați: inițialele R·M·A pe călcâiul stâng și logo-ul One Piece pe cel drept.", caption: "Călcâiele: R·M·A în stil One Piece, lângă logo-ul adevărat." },
      [`${op}/04.jpg`]: { alt: "Perechea după un an, un pantof peste altul într-o poză de studio, cu Zoro și Luffy încă vii la culoare.", caption: "După un an de purtat zilnic." },
      [`${op}/05.jpg`]: { alt: "Spatele pantofilor după un an: tălpi uzate, dar inițialele și logo-ul pictate sunt intacte.", caption: "Călcâiele după un an. Tălpile arată kilometrii; vopseaua nu." },
      [`${op}/making-01.jpg`]: { alt: "Pantoful drept cu o schiță în creion a lui Zoro și un afiș WANTED pictat, cu bandă adezivă pe margine, iar în spate culorile de bază ale pantofului stâng.", caption: "Zoro încă o schiță în creion, Luffy în culori de bază în spatele lui." },
      [`${op}/making-04.jpg`]: { alt: "Prim-plan cu afișul WANTED pictat și logo-ul One Piece de pe călcâi.", caption: "Afișul și logo-ul, pictate în straturi subțiri." },
    },
  },

  "sushi-cats": {
    title: "Pisici sushi",
    subtitle: "Patru pisici roșcate pe post de patru feluri de sushi, pictate de mână pe Air Force 1 negri, de ziua unei prietene foarte bune.",
    cover: {
      alt: "Perechea de Air Force 1 negri: o pisică roșcată care iese dintr-un maki învelit în nori pe pantoful din față și o pisică ghemuită într-un inel de orez pe pantoful din spate.",
    },
    story:
      "Perechea asta a fost un cadou de ziua uneia dintre cele mai bune prietene ale mele. Tot ce a cerut a fost o pereche de Air Force 1 negri: poate face 10.000 de pași în ei și tot sunt comozi, iar negrul nu se murdărește la fel de ușor ca albul. Așa că am primit prima mea provocare adevărată: pot picta pe sneakers negri? Spoiler: oh, da, pot.\n\nDesignul a fost în întregime al meu; ea nu a avut niciun cuvânt de spus. Știam doar că iubește sushi și iubește pisicile, așa că le-am combinat: sushi desenat ca pisici. O pisică portocalie joacă rolul somonului, orezul alb și pufos face un contrast superb pe pielea neagră, iar la unele, o foaie neagră de nori completează atmosfera de sushi. M-am inspirat din desene drăguțe cu pisici-sushi găsite online, cel mai probabil pe Pinterest, dar din păcate nu-mi mai amintesc artistul.\n\nPrima mea idee a fost cu totul altă pisică, ținând o furculiță și un cuțit. Am desenat-o pe bandă adezivă și am probat-o pe pantof, dar nu mi-a plăcut cum arăta. Era prea „portret” pentru lateralul unui sneaker, care cere ceva mai „peisaj”. Și, oricum, cine mănâncă sushi cu furculița și cuțitul?\n\nRuloul și makiul erau de la sine înțelese: cele mai simple sushi, pe care le adoră toată lumea. Pentru celelalte două părți aveam nevoie de forme mai late, iar singurul sushi „peisaj” e nigiri. Așa că am făcut două: un nigiri clasic, cu pisica întinsă pe patul ei de orez, și un nigiri cu nori, în care pisica e învelită, gata de somn, cu foaia de nori pe post de pătură. Un gunkan era prea înalt pentru pantofi, așa că a ajuns pe cutia Nike, ca mic bonus.\n\nAm început pe 22 aprilie 2022 și am terminat pe 27 aprilie, la 4:37 dimineața, ca să fiu exactă. Nu cel mai sănătos mod de a lucra: obișnuiam să las totul pe ultima sută de metri, iar ziua ei trecuse deja.",
    processSteps: [
      "O primă idee, o pisică cu furculiță și cuțit, desenată pe bandă adezivă, apoi abandonată",
      "Îndepărtarea finisajului doar acolo unde urmau pisicile, ca negrul să rămână neatins",
      "Conturarea fiecărei pisici cu bandă adezivă și pictarea culorilor de bază în interior, în straturi subțiri",
      "Dezlipirea benzii",
      "Detaliile de contur cu un marker negru Posca: fețe, dungi și lăbuțe",
      "Sigilarea",
      "O pisică gunkan pe cutia pantofilor, ca ultim detaliu",
    ],
    materials: [
      "Vopsele pentru piele (atunci nu Angelus, iar marca nu mi-o mai amintesc)",
      "Marker negru Posca, pentru detalii",
      "Bandă adezivă, pentru conturul pisicilor",
      "Un sigilant",
    ],
    time: "5 zile, între 22 și 27 aprilie 2022 (terminat la 4:37 dimineața)",
    learned: [
      "Da, se poate picta pe sneakers negri.",
      "Lateralul unui sneaker vrea desene late, tip peisaj. Cele înalte nu stau bine.",
      "Nu toate vopselele pentru piele sunt la fel: cele folosite atunci nu erau la fel de bune ca Angelus.",
      "Pictatul până la 4:37 dimineața termină un cadou, dar nu e un mod sănătos de a lucra.",
    ],
    photos: {
      [`${sc}/01.jpg`]: { alt: "Un sneaker negru cu o pisică roșcată care iese dintr-o cupă neagră de nori acoperită cu orez alb, cu lăbuțele peste margine.", caption: "Pisica-maki, iscodind din foaia ei de nori." },
      [`${sc}/02.jpg`]: { alt: "Prim-plan cu o pisică roșcată pictată într-un inel rotund de orez alb, cu o fâșie de nori, pe un sneaker negru.", caption: "Pisica-rulou, cuibărită în inelul ei de orez." },
      [`${sc}/03.jpg`]: { alt: "Prim-plan cu o pisică roșcată tărcată, întinsă pe un pat alb de orez, pictată pe piele neagră.", caption: "Pisica-nigiri, întinsă pe patul ei de orez." },
      [`${sc}/04.jpg`]: { alt: "O pisică roșcată adormită pe orez, sub o pătură neagră de nori, pe pantoful din față, cu pisica-nigiri pe pantoful din spate.", caption: "Pisica nigiri-cu-nori, învelită sub pătura ei de nori, cu pisica-nigiri în spate." },
      [`${sc}/05.jpg`]: { alt: "Un colaj de patru poze cu fiecare parte a perechii, fiecare cu altă pisică sushi.", caption: "Toate cele patru părți, toate cele patru pisici." },
      [`${sc}/06.jpg`]: { alt: "Perechea pe cutia Nike, cu o pisică gunkan pictată pe cutie.", caption: "Perechea cu cutia, unde a ajuns ideea cu gunkanul." },
      [`${sc}/making-01.jpg`]: { alt: "O pisică ținând o furculiță și un cuțit, desenată pe bandă adezivă și lipită pe lateralul unui sneaker negru.", caption: "Prima idee, desenată pe bandă și probată. Prea înaltă pentru pantof, și cine mănâncă sushi cu furculița și cuțitul?" },
      [`${sc}/making-02.jpg`]: { alt: "Bandă adezivă pe pantof, cu forma pisicii-maki decupată și umplută cu culori de bază portocalii și albe.", caption: "Pisica-maki conturată cu bandă, cu culorile de bază pictate în interior." },
      [`${sc}/making-03.jpg`]: { alt: "Pisica-rulou în culori de bază plate, portocaliu și alb, pe piele neagră, imediat după ce s-a dezlipit banda.", caption: "Banda jos: pisica-rulou în culori de bază." },
      [`${sc}/making-04.jpg`]: { alt: "Pisica-rulou cu primele detalii de contur, cu pantoful cu pisica-maki și borcanele de vopsea în fundal.", caption: "Detalii de contur pe pisica-rulou, cu pisica-maki și vopselele mele în spate." },
    },
  },

  "cherry-blossoms": {
    title: "Flori de cireș, a doua încercare",
    subtitle: "Pictați în grabă pentru o excursie la câmpurile cu lalele, stricați, curățați până la alb și pictați din nou un an mai târziu. Ca lumea, de data asta.",
    cover: {
      alt: "Perechea refăcută, un pantof peste altul: Air Force 1 albi cu Swoosh-uri roz și flori de cireș roz cu mijlocul auriu, pe ramuri maro.",
    },
    story:
      "Povestea mea preferată, pentru că are o răsturnare de situație. Am pictat perechea asta atât de în grabă, atât de pe ultima sută de metri, încât s-a stricat. Chiar s-a stricat. Totul întins, groaznic.\n\nEra un cadou de ziua aceleiași prietene foarte bune pentru care am pictat pisicile sushi, iar ziua asta venea cu o excursie la Amsterdam. Voia să-i poarte în câmpurile cu lalele, așa că pantofii trebuiau să fie gata. Spre rușinea mea, am început în seara de 15 aprilie 2023 și am pictat doar Swoosh-urile. Pe 16 aprilie, la 22:48, am început schițele în creion ale florilor. Pe 17 aprilie, la 13:00, florile aveau primul strat de roz, încă fără niciun detaliu. I-am terminat pe 18 aprilie la 2:17, iar pe 19 aprilie, la 5:40 dimineața, ne urcam în avion. Doar câteva ore de pictat efectiv, împrăștiate pe zilele alea. Mult prea puțin pentru o pereche ca asta.\n\nNu aveam răbdare, nu aveam produse bune, iar pregătirea a fost superficială. Nu era timp să construiesc detaliile în straturi: aveam nevoie ca galbenul și celelalte culori deschise să se vadă imediat, complet opace. Așa că am făcut cel mai logic lucru în momentul ăla: straturi groase. Multă vopsea. Și, Doamne, ce lecție am învățat. Culorile s-au scurs și s-au amestecat, iar o parte a ajuns pe materialul textil din partea de sus a pantofului, pe unde bagi piciorul. Măcar i-a purtat în câmpurile cu lalele. Dar a meritat? Probabil că nu. Trebuia să încep mai devreme și să-i fac cum trebuie.\n\nApoi a venit răsturnarea de situație: am scos tot designul. A fost prima mea curățare completă și m-a învățat multe. Poți curăța o pereche până înapoi la alb și o poți lua de la capăt. E și taaare greu. Vopseaua intră în cusăturile mici, iar ele se agață de culoare de parcă le-ar depinde viața de asta. Gulerul textil a fost cel mai rău: am frecat și iar am frecat, am folosit tone de acetonă și perii, iar până la urmă cred că am revopsit unele părți cu alb ca să ascund paguba. Dacă te uiți atent, încă se vede roz pe la cusături. Destul de poetic.\n\nUn an mai târziu, pe 27 aprilie 2024, i-am primit înapoi. Au fost complet curați pe 7 mai și gata pe 10 mai. Același design, dar de data asta cu vopsele Angelus, mai multă îndemânare și experiență, un ritm mai relaxat și timp adevărat să le acord atenție.",
    processSteps: [
      "2023: întâi Swoosh-urile, apoi schițele în creion ale florilor",
      "2023: straturi groase, ca să acopere culorile deschise dintr-o dată. S-au scurs și s-au amestecat",
      "2024: scoaterea întregului design cu acetonă, perii și multă frecare",
      "Revopsirea cu alb a petelor celor mai încăpățânate",
      "Florile roz, de data asta cu Angelus",
      "Ramuri maro-aurii și buline mici",
      "Mijloace aurii și detalii roz pe fiecare floare",
      "Swoosh-urile roz, la final",
    ],
    materials: [
      "Vopsele pentru piele Angelus, pentru varianta refăcută",
      "Multă acetonă și perii, ca să scot primul design",
      "Vopsea albă, ca să acopăr ce n-a vrut să iasă",
      "Prima dată: vopsele pe care nu le-aș mai folosi",
    ],
    time: "Prima încercare: câteva ore grăbite, 15–18 aprilie 2023. Varianta refăcută: curățată între 27 aprilie și 7 mai 2024, pictată până pe 10 mai.",
    learned: [
      "Straturile groase fac culorile deschise să acopere repede, apoi se scurg și se amestecă. Acum pictez cele mai fine straturi, câte o picătură de culoare pe rând.",
      "Acoperă gulerul textil cu bandă cât pictezi. Să scoți vopseaua din el e un chin.",
      "Un design poate fi scos complet și repictat, dar cusăturile nu-ți mai dau niciodată culoarea înapoi de tot.",
      "Graba m-a costat până la urmă mult mai mult timp decât dacă aș fi făcut totul cum trebuie.",
    ],
    before: {
      alt: "Prima variantă, purtată: flori roz întinse și vopsea galbenă scursă pe gulerul textil și pe șireturi.",
      caption: "2023, prima încercare",
    },
    after: {
      alt: "Varianta refăcută: flori de cireș roz, curate și clare, cu mijlocul auriu, pe ramuri maro.",
      caption: "2024, varianta refăcută",
    },
    chapters: [
      {
        title: "Prima încercare, aprilie 2023",
        note: "Începută mult prea târziu, pictată în straturi groase, terminată la 2:17 noaptea, cu o zi înainte de zbor.",
      },
    ],
    processNote: "Varianta refăcută, 2024: curățată până la alb, apoi pictată din nou, încet.",
    photos: {
      [`${cb}/01.jpg`]: { alt: "Partea interioară a pantofului stâng refăcut: un Swoosh roz, flori de cireș cu mijlocul auriu pe ramuri subțiri maro și petale în cădere.", caption: "Varianta refăcută: pantoful stâng, interior." },
      [`${cb}/04.jpg`]: { alt: "Partea exterioară a pantofului stâng refăcut: un Swoosh roz, cu ramuri de flori de cireș roz cu mijlocul auriu lângă vârf și lângă călcâi, și petale în cădere.", caption: "Varianta refăcută: pantoful stâng, exterior." },
      [`${cb}/02.jpg`]: { alt: "Călcâiul pantofului stâng refăcut: o ramură de flori de cireș roz cu mijlocul auriu, sub logo-ul Nike Air.", caption: "O ramură înflorită care înconjoară călcâiul." },
      [`${cb}/03.jpg`]: { alt: "Partea interioară a pantofului drept refăcut, aproape gata: flori de cireș cu mijlocul auriu de-a lungul ramurilor maro, cu Swoosh-ul încă alb și cusături roz.", caption: "Aproape gata: mijloacele aurii sunt puse, Swoosh-ul încă alb." },
      [`${cb}/first-01.jpg`]: { alt: "Un Air Force 1 alb ținut într-o mână, cu Swoosh-ul pictat în roz pal.", caption: "15 aprilie, seara: doar Swoosh-urile." },
      [`${cb}/first-02.jpg`]: { alt: "Ambii pantofi pe o masă, cu Swoosh-uri roz pal, restul încă alb.", caption: "Ambele Swoosh-uri roz, nimic altceva încă." },
      [`${cb}/first-03.jpg`]: { alt: "Doi pantofi unul lângă altul, cu Swoosh-uri roz și schițe fine în creion ale florilor pe piele.", caption: "16 aprilie, 22:48: schițele în creion ale florilor." },
      [`${cb}/first-04.jpg`]: { alt: "Un pantof ținut în fața unui perete portocaliu, cu Swoosh roz și contururi fine în creion ale florilor.", caption: "Schițele, de aproape." },
      [`${cb}/first-05.jpg`]: { alt: "Prim-plan cu panoul din spate al pantofului: flori și petale roz, plate, peste linii subțiri de creion.", caption: "17 aprilie: primul strat de roz, încă fără detalii." },
      [`${cb}/first-06.jpg`]: { alt: "Un pantof ținut în față, cu flori roz, celălalt pantof în spate, pe cutia lui.", caption: "Un pantof înaintea celuilalt." },
      [`${cb}/first-07.jpg`]: { alt: "Ambii pantofi gata, pe o pătură cu model și pe cutia pantofilor: Swoosh-uri roz și flori roz cu mijlocul galben pe ramuri maro.", caption: "Gata, pe 18 aprilie la 2:17 noaptea." },
      [`${cb}/first-08.jpg`]: { alt: "Ambii pantofi gata, din spate, cu ramuri înflorite de-a lungul lateralelor.", caption: "Groși, strălucitori și gata la limită." },
      [`${cb}/first-09.jpg`]: { alt: "Un pantof din prima variantă după ce a fost purtat: flori roz încețoșate și vopsea galbenă întinsă pe gulerul textil.", caption: "Mai târziu: galbenul s-a scurs pe gulerul textil." },
      [`${cb}/first-10.jpg`]: { alt: "Cealaltă parte a unui pantof din prima variantă: flori întinse una în alta și pete galbene de-a lungul gulerului.", caption: "Culori amestecate între ele." },
      [`${cb}/first-11.jpg`]: { alt: "Un pantof din prima variantă, cu șireturi: flori tulburi lângă călcâi și piele pătată și uzată.", caption: "Stricați. E timpul să scot totul." },
      [`${cb}/first-12.jpg`]: { alt: "A patra parte a primei variante: flori întinse și urme galbene lângă șireturi.", caption: "Toate cele patru părți trebuiau salvate." },
      [`${cb}/making-01.jpg`]: { alt: "Un pantof pe o masă după ce designul vechi a fost scos: din nou alb, cu puțin roz rămas în cusăturile din jurul Swoosh-ului.", caption: "Complet curățat. Aproape." },
      [`${cb}/making-02.jpg`]: { alt: "Prim-plan cu un Swoosh curățat, cu cusăturile încă rozalii.", caption: "Rozul încă se ascunde în cusături. Destul de poetic." },
      [`${cb}/making-03.jpg`]: { alt: "Prim-plan cu Swoosh-ul de pe cealaltă parte: piele albă cu cusături rozalii.", caption: "Cusăturile s-au agățat de culoare de parcă le-ar fi depins viața de asta." },
      [`${cb}/making-04.jpg`]: { alt: "Un pantof ținut într-o mână, cu flori și petale roz, plate, pictate pe laterale.", caption: "Florile se întorc, în roz plat." },
      [`${cb}/making-05.jpg`]: { alt: "Călcâiul unui pantof ținut într-o mână, cu flori mici roz de o parte și de alta.", caption: "Flori în jurul călcâiului." },
      [`${cb}/making-06.jpg`]: { alt: "O pensulă care amestecă vopsea maro-aurie pe o paletă.", caption: "Amestec maroul auriu pentru ramuri." },
      [`${cb}/making-07.jpg`]: { alt: "Un pantof pe o pătură închisă la culoare, cu ramuri subțiri maro și buline aurii adăugate printre florile roz.", caption: "Ramuri și buline mici." },
      [`${cb}/making-08.jpg`]: { alt: "Ambele călcâie unul lângă altul, fiecare cu o ramură maro cu flori roz.", caption: "Ambele călcâie, cu ramurile puse." },
      [`${cb}/making-09.jpg`]: { alt: "Ambii pantofi pe partea interioară, unul deasupra celuilalt, cu flori roz pe ramuri maro.", caption: "Ambele părți interioare." },
      [`${cb}/making-10.jpg`]: { alt: "Partea interioară a unui pantof, cu ramuri înflorite lângă vârf și lângă călcâi.", caption: "Construiesc detaliile." },
      [`${cb}/making-11.jpg`]: { alt: "Ambele călcâie din spate, cu ramuri înflorite și petale.", caption: "Aproape gata, înainte de mijloacele aurii." },
    },
  },

  "tattoo-cats": {
    title: "Pisici-tatuaj",
    subtitle: "Opt tatuaje fine cu pisici și două lăbuțe mici pe Air Force 1 albi, un cadou de ziua unei prietene foarte bune.",
    cover: {
      alt: "Pantoful drept din lateral: o pisică adormită într-o inimă cu o semilună lângă călcâi și o pisică întinzându-se după un fluture lângă vârf, cu pantoful stâng și pisica lui cu luna în spate.",
    },
    story:
      "Un cadou de ziua unei alte prietene foarte bune, de la câțiva dintre noi împreună. Îi plac lucrurile elegante, minimaliste și drăguțe, și iubește pisicile, așa că ideea a fost simplă, elegantă, discretă. Baza a fost din nou o pereche de Air Force 1, dar o ediție interesantă, cu un vibe pe dos: logo-ul Nike Air de pe călcâi e întors.\n\nCăutând pisici, am găsit atât de multe tatuaje cu pisici taaare drăguțe. Așa că, practic, am tatuat pantofii cu pisici. Din păcate, nu-mi amintesc artiștii; tatuajele veneau cel mai probabil de pe Pinterest. Făcând asta, am descoperit că inspirația din tatuaje e perfectă pentru detalii discrete pe pantofi.\n\nFiecare parte a unui Air Force 1 e împărțită în două de panoul din mijloc cu logo-ul Nike, așa că fiecare parte are un panou în față și unul în spate. Asta a însemnat 8 tatuaje, câte 2 pe fiecare parte, deci 8 pisici de desenat. Am printat acasă toate tatuajele care mi-au plăcut, dimensionate pentru panouri înainte de print, apoi le-am decupat și le-am așezat pe pantofi până când totul a arătat drăguț și asortat. Decupajele astea de hârtie le-am făcut doar ca să-i întreb pe prietenii cu care făceam cadoul dacă le place, și noroc că am și pozele. Ca detaliu drăguț, am adăugat lăbuțe de pisică pe călcâie: se potrivesc taaare bine, rămân discrete și leagă toată atmosfera cu pisici.\n\nAm început pe 18 noiembrie 2023, la 1:48 noaptea, și am terminat în aceeași zi, la 5:02 dimineața. O noapte albă, pentru că ziua ei era chiar atunci.\n\nLucrul de care sunt cu adevărat mândră: i-a spălat la mașină de cel puțin două ori, iar desenele sunt încă acolo, doar puțin decolorate pe alocuri. Și asta cu vopselele mele vechi, nu Angelus, și fără să las destul timp între straturi. Cu Angelus și un ritm mai bun, sunt sigură că i-aș putea face și mai rezistenți.",
    processSteps: [
      "Adunarea tatuajelor drăguțe cu pisici și alegerea a 8: un panou în față și unul în spate pe fiecare parte",
      "Dimensionarea lor pentru panouri și printarea pe imprimanta de acasă",
      "Decuparea și așezarea lor pe pantofi, ca să plănuiesc un aranjament asortat și să-i întreb pe prieteni dacă le place",
      "Îndepărtarea finisajului de pe panouri cu acetonă și bile de vată",
      "Pictarea celor 8 pisici în linii fine negre, cu o pensulă subțire, cu mici accente de roșu",
      "O lăbuță mică de pisică pe fiecare călcâi",
      "Straturi de finisaj deasupra",
    ],
    materials: [
      "Vopsele pentru piele (cele vechi, nu Angelus)",
      "O pensulă subțire, pentru liniile fine",
      "Acetonă și bile de vată, pentru îndepărtarea finisajului",
      "Un finisaj",
      "Imprimanta de acasă, hârtie și foarfecă, pentru machetă",
    ],
    time: "O noapte: 18 noiembrie 2023, de la 1:48 la 5:02 dimineața.",
    learned: [
      "Inspirația din tatuaje e perfectă pentru detalii discrete pe pantofi.",
      "Decupajele printate din hârtie sunt o metodă rapidă să plănuiești un aranjament și să primești un „da” înainte să pictezi.",
      "Graba costă rezistență: lasă timp suficient între straturile de vopsea și cele de finisaj.",
      "Cu vopsele Angelus și un ritm mai bun, același design ar rezista și mai mult.",
    ],
    photos: {
      [`${tc}/01.jpg`]: { alt: "Partea exterioară a pantofului drept: o pisică adormită într-o inimă cu o semilună și o floare roșie lângă călcâi, și o pisică întinzându-se spre un fluture lângă vârf.", caption: "Pantoful drept, exterior: o pisică adormită într-o inimă și una care se întinde după un fluture." },
      [`${tc}/02.jpg`]: { alt: "Partea interioară a pantofului stâng, ținut în mână: o pisică așezată pe o semilună cu o stea și o floare roșie lângă călcâi, și o pisică tăvălindu-se pe spate sub un fluture lângă vârf.", caption: "Pantoful stâng, interior: pisica de pe lună și o pisică tăvălindu-se pe spate." },
      [`${tc}/03.jpg`]: { alt: "Partea exterioară a pantofului stâng, ținut în mână: o pisică lungă care se întinde, cu o floare roșie la coadă, lângă vârf, iar lângă călcâi o pisică așezată cu un fluture, deasupra unei pisici ghemuite într-un cerc de flori mici roșii.", caption: "Pantoful stâng, exterior: o întindere lungă și o pisică ghemuită în flori." },
      [`${tc}/04.jpg`]: { alt: "Partea interioară a pantofului drept, ținut în mână: o pisică care se întinde lângă vârf, iar lângă călcâi o pisică lângă o inimă desenată dintr-o singură linie care se termină cu o floare roșie.", caption: "Pantoful drept, interior: încă o întindere și o pisică cu o inimă dintr-o singură linie." },
      [`${tc}/05.jpg`]: { alt: "Călcâiul unui pantof: logo-ul Nike Air în relief, întors cu susul în jos, și o mică lăbuță neagră de pisică pictată pe călcâi.", caption: "O lăbuță mică pe fiecare călcâi, sub logo-ul întors." },
      [`${tc}/making-01.jpg`]: { alt: "Unul dintre Air Force 1 albi înainte de pictat, cu un Swoosh irizat.", caption: "Înainte: alb curat, cu un Swoosh irizat." },
      [`${tc}/making-02.jpg`]: { alt: "Partea interioară a pantofului stâng, cu două tatuaje printate, decupate și lipite: o pisică pe o semilună pe panoul din spate și o pisică cu un fluture pe panoul din față.", caption: "Macheta din hârtie: tatuaje printate, dimensionate și decupate, puse acolo unde urmau pisicile." },
      [`${tc}/making-03.jpg`]: { alt: "Partea exterioară a pantofului stâng, cu tatuaje printate lipite: o pisică sub o semilună pe panoul din față și două pisici cu flori și un fluture pe panoul din spate.", caption: "Pantoful stâng, exterior, în hârtie." },
      [`${tc}/making-04.jpg`]: { alt: "Partea interioară a pantofului drept, cu tatuaje printate lipite: o pisică zveltă cu o floricică pe panoul din față și o pisică cu o inimă dintr-o linie și un fluture pe panoul din spate.", caption: "Pantoful drept, interior, în hârtie." },
      [`${tc}/making-05.jpg`]: { alt: "Partea exterioară a pantofului drept, cu tatuaje printate lipite: o pisică adormită într-o inimă pe panoul din spate și o pisică întinzându-se după un fluture pe panoul din față.", caption: "Pantoful drept, exterior, în hârtie." },
    },
  },

  "doctor-cu-suflet-si-ratiune": {
    subtitle: "Flori, un stetoscop și propriile ei cuvinte: o tocă delicată, roz, pictată de mână pentru Patri.",
    cover: {
      alt: "Prim-plan cu toca de absolvire gata, ținută spre cameră: flori roz, frunze verzi, un stetoscop auriu cu roz și cuvintele „doctor cu suflet și rațiune 2026”.",
    },
    story:
      "Patri a găsit online o poză de inspirație și a folosit ChatGPT ca s-o facă a ei, cu propriile cuvinte deja puse: „doctor cu suflet și rațiune”. Poza aia a fost tot briefing-ul și, sincer, e un mod frumos de a folosi AI-ul: iei ceva ce iubești și îl personalizezi. Pozele făcute cu AI nu sunt mereu realiste de pictat, dar de data asta a fost genul fericit și util. Partea mea a fost să transform AI-ul în realitate, 1:1, cu mâinile mele, și cred că toca adevărată a ieșit chiar mai frumoasă decât referința: fidelă, dar reală și drăguță, și foarte ea.\n\nStetoscopul e partea de care sunt cea mai mândră. Am stat o veșnicie pe umbrele lui, ca să iasă aproape 3D în loc să pară plat, iar bulinele mici albe de pe toată toca i-au dat atâta viață. M-am chinuit mult prea mult cu frunzele, amestecând Angelus Avocado și Olive până când verdele a fost cum trebuie, apoi dându-le margini și detalii în alte nuanțe. Florile au avut nevoie de atâtea nuanțe de roz și de burgund mai închis până când paleta s-a potrivit. Iar anul a primit propriul lui mic detaliu personalizat, în partea de jos a tocii.",
    processSteps: [
      "Referința lui Patri: o poză de inspirație pe care a personalizat-o cu ChatGPT",
      "Schiță pe hârtie, transferată pe tocă cu hârtie de transfer albă",
      "Straturi de bază albe, ca culorile să rămână vii pe negru",
      "Culorile de bază: roz, verde și auriu",
      "Umbre și lumini pe stetoscop",
      "Detalii pe flori și frunze, buline mici albe",
      "Retușuri și margini mai clare cu vopsea neagră",
      "Angelus flat finisher, în caz că ploua în ziua cea mare",
    ],
    materials: [
      "Vopsele pentru piele Angelus",
      "Angelus Avocado + Olive, amestecate pentru frunze",
      "Angelus 2-Soft",
      "Hârtie de transfer albă",
      "Angelus flat finisher",
    ],
    time: "Aproximativ 20 de ore de pictat, în vreo două săptămâni (în paralel cu o a doua tocă)",
    learned: [
      "Hârtia de transfer obișnuită, cu grafit, e practic invizibilă pe o tocă neagră, iar trasul peste ea cu creta albă nu a salvat-o. Hârtia de transfer albă mi-a schimbat viața.",
      "Vopseaua neagră e radiera mea: am folosit-o ca să repar pete rătăcite, să ascut margini neclare și chiar să remodelez litere. Cei doi „o” din „doctor” arătau ca niște veri, nu ca niște frați, până când am acoperit cu negru părți din ei.",
    ],
    photos: {
      [`${dr}/01.jpg`]: { alt: "Patri, văzută din spate în ziua absolvirii, purtând toca în fața unui leagăn acoperit cu flori." },
      [`${dr}/02.jpg`]: { alt: "Toca gata, fotografiată pe un fundal deschis." },
      [`${dr}/03.jpg`]: { alt: "Prim-plan cu un crin roz și capul stetoscopului, auriu și umbrit." },
      [`${dr}/04.jpg`]: { alt: "Prim-plan cu coroana de flori și cuvântul „doctor”, scris de mână." },
      [`${dr}/05.jpg`]: { alt: "Partea dreaptă a tocii, cu tubul stetoscopului și anul 2026 în partea de jos." },
      [`${dr}/06.jpg`]: { alt: "Prim-plan din unghi cu literele, florile și stetoscopul." },
      [`${dr}/07.jpg`]: { alt: "Toca gata, ținută în aer liber, în lumină naturală." },
      [`${dr}/08.jpg`]: { alt: "Toca la ceremonia de absolvire, cu artificii și confetti în spate." },
      [`${dr}/09.jpg`]: { alt: "Toca gata, ținută în fața unui perete alb." },
      [`${dr}/making-01.jpg`]: { alt: "O tocă goală ținută în fața unui monitor pe care se vede referința.", caption: "Toca goală, cu referința lui Patri pe ecran." },
      [`${dr}/making-02.jpg`]: { alt: "O schiță albă, slabă și incompletă, pe tocă.", caption: "Prima încercare: hârtie de transfer obișnuită plus creta albă. Abia vedeam ceva." },
      [`${dr}/making-03.jpg`]: { alt: "O schiță în creion pe hârtie, lipită peste tocă.", caption: "Schița pe hârtie, lipită peste tocă pentru transfer." },
      [`${dr}/making-04.jpg`]: { alt: "Tot designul transferat în linii subțiri albe pe tocă.", caption: "A doua încercare, cu hârtie de transfer albă. Mult mai bine." },
      [`${dr}/making-05.jpg`]: { alt: "Designul umplut cu un prim strat subțire de alb.", caption: "Primul strat de bază alb, ca culorile să rămână vii pe negru." },
      [`${dr}/making-06.jpg`]: { alt: "Stratul de bază alb, mai opac.", caption: "Mai mult alb. Materialul negru bea vopseaua." },
      [`${dr}/making-07.jpg`]: { alt: "Culori de bază plate, roz, verde și auriu, pe tocă.", caption: "Culorile de bază: roz, verde și auriu." },
      [`${dr}/making-08.jpg`]: { alt: "Prim-plan cu capul auriu al stetoscopului, cu umbrele în lucru.", caption: "Umbresc capul stetoscopului, partea mea preferată." },
      [`${dr}/making-09.jpg`]: { alt: "Prim-plan cu olivele stetoscopului, cu lumini, și vopselele în fundal.", caption: "Olivele primesc umbre și strălucire." },
      [`${dr}/making-10.jpg`]: { alt: "Toca cu unele flori detaliate și altele încă plate.", caption: "Detaliile florilor, una câte una." },
      [`${dr}/making-11.jpg`]: { alt: "Toca cu toate florile detaliate.", caption: "Toate florile gata." },
      [`${dr}/making-12.jpg`]: { alt: "Toca cu buline mici albe pe o parte din design.", caption: "La jumătatea bulinelor albe." },
      [`${dr}/making-13.jpg`]: { alt: "Toca gata, în fața unui perete alb.", caption: "Gata." },
    },
  },

  "superpower-called-empathy": {
    // the title quotes the words painted on the cap, which are in English
    subtitle: "„…and it's called empathy.” O inimă anatomică din care înfloresc flori, pictată pentru Andreea.",
    cover: {
      alt: "Andreea purtând toca gata la absolvire: o inimă anatomică roșie cu flori roz și cuvintele „You have a superpower and it's called empathy”.",
    },
    story:
      "Andreea s-a îndrăgostit de o tocă găsită pe Pinterest, o inimă din care cresc flori ca dintr-o vază, dar îi plăceau cuvintele de pe altă tocă. Așa că mi le-a trimis pe amândouă: designul de pe una, textul de pe cealaltă. Să le potrivesc împreună a fost treaba mea.\n\nPrima mea schiță punea textul prea jos și părea descentrat. (Am întrebat-o în glumă dacă nu putem șterge un cuvânt.) În schimb, am șters tot textul și am luat-o de la capăt, până când totul a stat frumos lângă inimă.\n\nPartea cea mai distractivă a fost estomparea. Inima a avut nevoie de multă, ca umbrele și luminile foarte subtile să pară unitare, iar pe flori am estompat roz la marginile petalelor în alb spre mijloc. Puțin Angelus 2-Soft a făcut vopseaua mai fluidă, așa că culorile s-au topit una în alta și mai frumos.",
    processSteps: [
      "Două referințe de pe Pinterest: designul de la una, cuvintele de la alta",
      "Schiță pe hârtie, apoi redesenată când primul text a ieșit prea jos",
      "Schița transferată pe tocă, în alb",
      "Straturi de bază albe sub tot",
      "Culoare, cu multă estompare pe inimă și pe petale",
      "Detalii pe inimă și pe flori",
      "Curățenie și margini mai clare cu vopsea neagră",
      "Angelus flat finisher, în caz că ploua în ziua cea mare",
    ],
    materials: [
      "Vopsele pentru piele Angelus",
      "Angelus 2-Soft, pentru o estompare mai fină",
      "Hârtie de transfer albă",
      "Angelus flat finisher",
    ],
    time: "Aproximativ 20 de ore de pictat, în vreo două săptămâni (în paralel cu o a doua tocă)",
    learned: [
      "Angelus 2-Soft subțiază vopseaua și o păstrează flexibilă. Super pentru estompare, groaznic pentru detalii fine, iar tocile oricum nu trebuie să se îndoaie, așa că majoritatea detaliilor au ieșit cu vopsea simplă.",
      "Amestecată 1:1 cu 2-Soft, baza mea albă era atât de subțire încât toca neagră o absorbea. Unele litere au avut nevoie de vreo șapte straturi.",
      "Absolvirea a fost în aer liber, într-un parc, așa că ambele toci au primit un strat de Angelus flat finisher, pentru orice eventualitate, în caz că ploua.",
    ],
    photos: {
      [`${sp}/01.jpg`]: { alt: "Andreea, văzută din spate în ziua absolvirii, purtând toca pe un leagăn acoperit cu flori." },
      [`${sp}/02.jpg`]: { alt: "Toca pe capul Andreei la absolvire, în lumină naturală." },
      [`${sp}/03.jpg`]: { alt: "Toca gata, în cutia ei." },
      [`${sp}/04.jpg`]: { alt: "Prim-plan din unghi cu inima, florile și literele albe." },
      [`${sp}/05.jpg`]: { alt: "Prim-plan cu inima roșie estompată, cu flori roz și buline albe." },
      [`${sp}/06.jpg`]: { alt: "Prim-plan cu petalele estompate din roz în alb." },
      [`${sp}/07.jpg`]: { alt: "Toca gata, fotografiată pe un fundal deschis." },
      [`${sp}/making-01.jpg`]: { alt: "O schiță în creion pe hârtie ținută deasupra tocii, cu textul slab și prea jos.", caption: "Prima schiță pe hârtie. Textul stătea prea jos și părea descentrat." },
      [`${sp}/making-02.jpg`]: { alt: "O schiță redesenată pe hârtie, cu textul mai apăsat, pus lângă inimă.", caption: "Redesenată de la zero, ca să încapă cuvintele lângă inimă." },
      [`${sp}/making-03.jpg`]: { alt: "Designul transferat în linii subțiri albe pe tocă.", caption: "Schița transferată pe tocă, în alb." },
      [`${sp}/making-04.jpg`]: { alt: "Designul umplut parțial cu vopsea de bază albă.", caption: "Intră straturile de bază albe." },
      [`${sp}/making-05.jpg`]: { alt: "Prim-plan cu litere albe pe material negru, încă inegale.", caption: "Literele după câteva straturi. Toca a absorbit atât de mult alb." },
      [`${sp}/making-06.jpg`]: { alt: "Tot designul pictat în alb.", caption: "Tot designul în alb." },
      [`${sp}/making-07.jpg`]: { alt: "Primele tonuri de roz pe inimă și pe flori.", caption: "Începe culoarea." },
      [`${sp}/making-08.jpg`]: { alt: "Prim-plan cu inima într-o culoare de bază roz, plată, cu linii închise pentru vene.", caption: "Culoarea de bază a inimii, înainte de estompare." },
      [`${sp}/making-09.jpg`]: { alt: "Toca cu toate culorile de bază puse.", caption: "Toate culorile puse." },
      [`${sp}/making-10.jpg`]: { alt: "Inima cu umbre și vene detaliate.", caption: "Detaliile inimii: vene, umbre și lumini." },
      [`${sp}/making-11.jpg`]: { alt: "Toca cu florile din jurul inimii detaliate.", caption: "Detaliile florilor, cu margini roz estompate în mijloace albe." },
      [`${sp}/making-12.jpg`]: { alt: "Toca gata, pe un fundal deschis.", caption: "Gata." },
    },
  },
};

/** Homepage hero rotation: caption + photo description, by project slug. */
export const roHero: Record<string, { caption: string; alt: string }> = {
  "one-piece-sneakers": {
    caption: "perechea One Piece, după un an de purtat zilnic",
    alt: "O pereche de sneakers One Piece pictați de mână, un pantof peste altul: Zoro cu trei săbii pe un pantof, Luffy cu pălăria de paie pe celălalt.",
  },
  "sushi-cats": {
    caption: "pisici sushi, un cadou de ziua unei prietene foarte bune",
    alt: "Perechea de Air Force 1 negri: o pisică roșcată care iese dintr-un maki învelit în nori pe pantoful din față și o pisică ghemuită într-un inel de orez pe pantoful din spate.",
  },
  "cherry-blossoms": {
    caption: "flori de cireș, stricate o dată și refăcute un an mai târziu",
    alt: "Perechea refăcută, un pantof peste altul: Air Force 1 albi cu Swoosh-uri roz și flori de cireș roz cu mijlocul auriu, pe ramuri maro.",
  },
  "tattoo-cats": {
    caption: "pisici-tatuaj, încă acolo după două spălări la mașină",
    alt: "Pantoful drept din lateral: o pisică adormită într-o inimă cu o semilună lângă călcâi și o pisică întinzându-se după un fluture lângă vârf, cu pantoful stâng și pisica lui cu luna în spate.",
  },
};

/** Instagram tiles on the homepage, by post URL. */
export const roInstagram: Record<string, { caption: string; alt: string }> = {
  "https://www.instagram.com/reel/Dd1_4IEtR9P/": {
    caption: "Toca lui Patri prinde viață: „asta vreau să fiu”.",
    alt: "Prim-plan cu un crin roz și stetoscopul auriu, umbrit, de pe toca lui Patri.",
  },
  "https://www.instagram.com/p/DduCNfajTcy/": {
    caption: "Patri în ziua absolvirii, apoi procesul în sens invers, înapoi la schiță.",
    alt: "Patri, văzută din spate, purtând toca în fața unui leagăn acoperit cu flori.",
  },
  "https://www.instagram.com/p/DddqoOLDYcu/": {
    caption: "Andreea la absolvire, apoi tot ce s-a întâmplat în culise.",
    alt: "Andreea, văzută din spate, purtând toca pe un leagăn acoperit cu flori.",
  },
  "https://www.instagram.com/p/Dd2CVFTjbWe/": {
    caption: "Toci de absolvire personalizate: amândouă, gata, în studio (adică apartamentul meu, lol).",
    alt: "Ambele toci gata, fotografiate împreună, una ținută în mână.",
  },
};
