(function () {
  "use strict";

  var STORE_KEY = "kvnSyntheticPilotV8A";
  var RELEASE_LABEL = "v8a synthetic candidate";
  var CLASS_COUNTS = [
    ["Playgroup",10],["Nursery A",13],["Nursery B",13],["KG-1 A",16],["KG-1 B",16],
    ["KG-2 A",13],["KG-2 B",12],["Grade 1",27],["Grade 2",17]
  ];
  var CLASS_TEACHERS={"Playgroup":"Teacher A","Nursery A":"Teacher B","Nursery B":"Teacher C","KG-1 A":"Teacher D","KG-1 B":"Teacher E","KG-2 A":"Teacher F","KG-2 B":"Teacher G","Grade 1":"Teacher H","Grade 2":"Teacher I"};
  var STAFF = [
    ["Yukti","Coordinator"],["Ahmad","Operations & Finance"],["Teacher A","Class Teacher"],["Teacher B","Class Teacher"],
    ["Teacher C","Class Teacher"],["Teacher D","Class Teacher"],["Teacher E","Class Teacher"],["Teacher F","Class Teacher"],
    ["Teacher G","Class Teacher"],["Teacher H","Class Teacher"],["Teacher I","Class Teacher"],["Support A","Support"],
    ["Support B","Support"],["Support C","Support"],["Support D","Support"],["Support E","Support"],["Support F","Support"],["Support G","Support"],
    ["Kitchen A","Kitchen"],["Kitchen B","Kitchen"],["Driver A","Transport"],["Guard A","Gate"]
  ];
  var TEACHERS=STAFF.filter(function(s){return s[1]==="Class Teacher";});
  var SUPPORT_STAFF=STAFF.filter(function(s){return ["Support","Kitchen","Transport","Gate"].indexOf(s[1])>=0;});
  var DEFAULT_LEADERS={COORDINATOR:"Yukti",OPERATIONS:"Ahmad"};
  var SCHOOL_FEE_CATEGORIES=["Tuition","Admission / re-enrolment","Activity","Books & stationery","Other school fee"];
  var TRANSPORT_CATEGORIES=["None","Bronze route","Gold route"];
  var SUPPORT_DUTIES={
    "Support A":["Drinking water, fire equipment and first aid","Daily / monthly"],
    "Support B":["Stock receipt, issue and store count","Daily"],
    "Support C":["Fee receipt filing and stationery","Daily / weekly"],
    "Support D":["Toilets, cleaning and facilities round","Daily"],
    "Support E":["Classroom readiness and minor repairs","Daily"],
    "Support F":["Playground, garden watering and hazards","Daily"],
    "Support G":["Grounds, waste, pest check and maintenance","Weekly"],
    "Kitchen A":["Kitchen opening hygiene, meal and food-use log","Daily"],
    "Kitchen B":["Groceries, cylinders, vessels and waste","Daily / weekly"],
    "Driver A":["Vehicle, route, child handover and fuel log","Each trip / monthly"],
    "Guard A":["Gate, visitor and child-release register","Daily"]
  };
  var ROUTINE_CHECKS=[
    {area:"Facilities",title:"Drinking water and tank check",owner:"Support A",frequency:"Daily",status:"review"},
    {area:"Facilities",title:"Toilets and hand-wash readiness",owner:"Support D",frequency:"Daily",status:"good"},
    {area:"Facilities",title:"Classrooms, furniture and minor repairs",owner:"Support E",frequency:"Daily",status:"good"},
    {area:"Facilities",title:"Fire exits and electrical hazards",owner:"Support A",frequency:"Weekly",status:"problem"},
    {area:"Kitchen",title:"Opening hygiene and clean vessels",owner:"Kitchen A",frequency:"Daily",status:"good"},
    {area:"Kitchen",title:"Meal, attendance and ingredient-use log",owner:"Kitchen A",frequency:"Daily",status:"review"},
    {area:"Kitchen",title:"Groceries, LPG cylinder and waste check",owner:"Kitchen B",frequency:"Daily",status:"good"},
    {area:"Garden",title:"Garden watering and plant condition",owner:"Support F",frequency:"Daily",status:"good"},
    {area:"Garden",title:"Grounds, playground and boundary hazards",owner:"Support G",frequency:"Weekly",status:"review"},
    {area:"Gate & transport",title:"Visitor, gate and child-release log",owner:"Guard A",frequency:"Daily",status:"good"},
    {area:"Gate & transport",title:"Vehicle, route and child handover check",owner:"Driver A",frequency:"Each trip",status:"review"}
  ];
  var PERSONAS = {
    swati:{id:"swati",name:"Swati",role:"Head",view:"HEAD"},
    yukti:{id:"yukti",name:"Yukti",role:"Coordinator & Admin",view:"COORDINATOR"},
    ahmad:{id:"ahmad",name:"Ahmad",role:"Operations & Finance",view:"FINANCE"},
    teacher:{id:"teacher",name:"Teacher A",role:"Class Teacher",view:"TEACHER"},
    support:{id:"support",name:"Support A",role:"Support",view:"SUPPORT"}
  };
  var WORK_AREAS = [
    {id:"attendance",label:"Attendance",caption:"Classes, staff, cover",modules:["Attendance","Staff & cover"],accent:"#2f806d"},
    {id:"students",label:"Students & admissions",caption:"137 synthetic students",modules:["Admissions","People"],accent:"#b4872e"},
    {id:"academics",label:"Learning",caption:"Plans, assessment, progress",modules:["Academics","Learning portfolio","Progress","Assessment"],accent:"#6d6aa7"},
    {id:"fees",label:"Fees & transport",caption:"Receipts, dues, reconciliation",modules:["Fees","Transport"],accent:"#b5563e"},
    {id:"staff",label:"Teachers & staff",caption:"22 synthetic staff",modules:["Staff operations","People"],accent:"#3c758d"},
    {id:"inventory",label:"Inventory & expenses",caption:"Stock, purchases, petty cash",modules:["Inventory","Expenses","Books & stationery"],accent:"#9a6c2f"},
    {id:"calendar",label:"Calendar & compliance",caption:"Cadence, reminders, evidence",modules:["Calendar","Compliance"],accent:"#2e7b60"},
    {id:"facilities",label:"Facilities & safety",caption:"Rounds, 5S, maintenance",modules:["Facilities","5S","Maintenance","Safeguarding"],accent:"#a33f39"},
    {id:"questions",label:"Tasks & questions",caption:"Replies stay with the work",modules:["Work","Internal comms","Communications"],accent:"#6b7080"},
    {id:"parents",label:"Parents",caption:"Controlled notices and consent",modules:["Parents"],accent:"#9a5b7f"},
    {id:"reports",label:"Reports & audit",caption:"Exceptions before detail",modules:["Reports","Oversight","Release"],accent:"#395b74"},
    {id:"catalog",label:"All 228 features",caption:"Search the frozen catalogue",modules:[],accent:"#165b4e"}
  ];
  var WORKS_NOW_IDS=[
    "ATT-001","ATT-002","ATT-003","ATT-005","FEE-001","FEE-002","FEE-003","FEE-005","FEE-011",
    "INV-001","INV-002","INV-003","INV-010","FOD-003","FOD-004","BKS-002","BKS-003","EXP-001","EXP-003",
    "WRK-001","WRK-002","WRK-003","PPL-002","PPL-005","PPL-006","CAL-002","RPT-001","RPT-002","RPT-003",
    "FAC-001","FAC-002","FAC-005","FAC-006","FAC-007","FAC-008","FAC-009","FAC-012","FAC-013","FAC-014",
    "HLP-001","HLP-002","UX-001","UX-002","UX-003","UX-004","UX-005","UX-006","UX-007","UX-008",
    "CMP-001","TRN-001","INT-008","REL-004"
  ];
  var PARTIAL_IDS=[
    "ATT-004","ATT-006","ATT-009","ATT-010","STF-001","STF-002","STF-003","STF-004","STF-005",
    "FEE-004","FEE-008","FEE-009","FEE-010","INV-004","INV-005","INV-006","INV-007","INV-011",
    "FOD-001","FOD-002","FOD-005","BKS-001","EXP-002","EXP-004","EXP-005","WRK-004","WRK-005",
    "PPL-001","PPL-003","PPL-004","CAL-001","CAL-007","INT-001","INT-002","INT-004","INT-005","INT-006",
    "FAC-003","FAC-004","FAC-010","FAC-011","5S-001","5S-002","5S-003","5S-004","5S-005",
    "HLP-003","HLP-004","HLP-005","HLP-006","PRI-002","PRI-003","PRI-004","PRI-005","OVS-002","OVS-005",
    "UX-009","UX-010","CMP-002","CMP-003","CMP-004","SAFE-001","SCL-001","SCL-005","REL-001","REL-002","VIS-001"
  ];
  var ACCESS = {
    HEAD:["attendance","students","academics","fees","staff","inventory","calendar","facilities","questions","parents","reports","catalog"],
    COORDINATOR:["attendance","students","academics","staff","calendar","facilities","questions","parents","reports","catalog"],
    FINANCE:["students","fees","staff","inventory","calendar","facilities","questions","reports","catalog"],
    TEACHER:["attendance","academics","calendar","questions","parents","catalog"],
    SUPPORT:["inventory","calendar","facilities","questions","catalog"]
  };
  var TEXT = {
    EN:{home:"Home",look:"Look",more:"More",people:"My team",areas:"Choose the work",training:"TRAINING",welcome:"Only the work you need is shown.",ask:"Ask Saras"},
    HI:{home:"मुख्य",look:"देखें",more:"अधिक",people:"मेरी टीम",areas:"काम चुनें",training:"अभ्यास",welcome:"केवल जरूरी काम दिखाया गया है।",ask:"सरस से पूछें"},
    GU:{home:"મુખ્ય",look:"જુઓ",more:"વધુ",people:"મારી ટીમ",areas:"કામ પસંદ કરો",training:"તાલીમ",welcome:"ફક્ત જરૂરી કામ બતાવ્યું છે.",ask:"સરસને પૂછો"},
    MR:{home:"मुख्य",look:"पाहा",more:"अधिक",people:"माझी टीम",areas:"काम निवडा",training:"प्रशिक्षण",welcome:"फक्त आवश्यक काम दाखवले आहे.",ask:"सरसला विचारा"}
  };
  var FULL_COPY={
    HI:{"Synthetic records only. No live school data is affected.":"केवल अभ्यास रिकॉर्ड। स्कूल का वास्तविक डेटा प्रभावित नहीं होता।","v7.0 provisional pilot":"v7.0 अस्थायी अभ्यास","PROVISIONAL PILOT":"अस्थायी अभ्यास","My work":"मेरा काम","My team":"मेरी टीम","Tap your donut to open only your decisions.":"केवल अपने निर्णय खोलने के लिए अपना डोनट दबाएँ।","Tap a person to see only their work":"किसी व्यक्ति का काम देखने के लिए उसका डोनट दबाएँ","Assign Primary responsibilities":"मुख्य जिम्मेदारियाँ सौंपें","My operations":"मेरे संचालन","My coordination":"मेरा समन्वय","Class attendance":"कक्षा उपस्थिति","Teachers":"शिक्षक","Learning & replies":"पढ़ाई और उत्तर","Students":"विद्यार्थी","Fees":"शुल्क","Food & cylinders":"भोजन और सिलेंडर","Stock register":"स्टॉक रजिस्टर","Expenses":"खर्च","Stationery":"स्टेशनरी","Transport":"परिवहन","Support team":"सहायक टीम","Need action":"कार्रवाई चाहिए","Green · completed":"हरा · पूरा","Orange · needs review":"नारंगी · समीक्षा","Red · overdue or blocked":"लाल · देर या रुकावट","Good":"ठीक","Review":"समीक्षा","Problem":"समस्या","Pending":"लंबित","Works now":"अभी काम करता है","Synthetic/browser-only":"केवल अभ्यास/इस ब्राउज़र में","Later":"बाद में","Record location: this browser only":"रिकॉर्ड का स्थान: केवल यह ब्राउज़र","Not connected":"जुड़ा नहीं है","Open":"खोलें","Close":"बंद करें","Save":"सहेजें","Add student":"विद्यार्थी जोड़ें","Search student, class or ID":"विद्यार्थी, कक्षा या आईडी खोजें","Back to classes":"कक्षाओं पर वापस","Students by class":"कक्षा के अनुसार विद्यार्थी","Total students":"कुल विद्यार्थी","Class teacher":"कक्षा शिक्षक","Fee account by student":"विद्यार्थी के अनुसार शुल्क खाता","Record fee receipt":"शुल्क रसीद दर्ज करें","Full familiar fee table":"पूरा परिचित शुल्क तालिका","School fee":"स्कूल शुल्क","Transport fee":"परिवहन शुल्क","Donation":"दान","Total collection":"कुल संग्रह","Funds received":"प्राप्त धन","Available":"उपलब्ध","Purchases, additions and consumption":"खरीद, जोड़ और उपयोग","Questions and replies":"प्रश्न और उत्तर","Awaiting reply":"उत्तर की प्रतीक्षा","Responsibilities":"जिम्मेदारियाँ","Execution assigned to":"काम सौंपा गया","Substitute / backup":"वैकल्पिक / बैकअप","Primary":"मुख्य","Approver":"अनुमोदक","Cadence":"अवधि","Save Primary":"मुख्य जिम्मेदारी सहेजें","Save team assignment":"टीम जिम्मेदारी सहेजें","Listen":"बोलें","Stop listening":"सुनना बंद करें","Ask or describe the problem":"प्रश्न पूछें या समस्या बताएँ","Send":"भेजें","More · school controls":"अधिक · स्कूल नियंत्रण","Operational registers":"संचालन रजिस्टर","Later · after secure connection":"बाद में · सुरक्षित कनेक्शन के बाद"},
    GU:{"Synthetic records only. No live school data is affected.":"ફક્ત અભ્યાસ રેકોર્ડ. શાળાનો વાસ્તવિક ડેટા અસરગ્રસ્ત નથી.","v7.0 provisional pilot":"v7.0 અસ્થાયી અભ્યાસ","PROVISIONAL PILOT":"અસ્થાયી અભ્યાસ","My work":"મારું કામ","My team":"મારી ટીમ","Tap your donut to open only your decisions.":"ફક્ત તમારા નિર્ણયો ખોલવા માટે તમારું ડોનટ દબાવો.","Tap a person to see only their work":"વ્યક્તિનું કામ જોવા માટે તેનું ડોનટ દબાવો","Assign Primary responsibilities":"મુખ્ય જવાબદારીઓ સોંપો","My operations":"મારું સંચાલન","My coordination":"મારું સંકલન","Class attendance":"વર્ગ હાજરી","Teachers":"શિક્ષકો","Learning & replies":"અભ્યાસ અને જવાબો","Students":"વિદ્યાર્થીઓ","Fees":"ફી","Food & cylinders":"ભોજન અને સિલિન્ડર","Stock register":"સ્ટોક રજિસ્ટર","Expenses":"ખર્ચ","Stationery":"સ્ટેશનરી","Transport":"પરિવહન","Support team":"સહાયક ટીમ","Need action":"કાર્ય જરૂરી","Green · completed":"લીલું · પૂર્ણ","Orange · needs review":"નારંગી · સમીક્ષા","Red · overdue or blocked":"લાલ · મોડું અથવા અટકેલું","Good":"સારું","Review":"સમીક્ષા","Problem":"સમस्या","Pending":"બાકી","Works now":"હમણાં કાર્યરત","Synthetic/browser-only":"ફક્ત અભ્યાસ/આ બ્રાઉઝરમાં","Later":"પછી","Record location: this browser only":"રેકોર્ડનું સ્થાન: ફક્ત આ બ્રાઉઝર","Not connected":"જોડાયેલ નથી","Open":"ખોલો","Close":"બંધ કરો","Save":"સાચવો","Add student":"વિદ્યાર્થી ઉમેરો","Search student, class or ID":"વિદ્યાર્થી, વર્ગ અથવા આઈડી શોધો","Back to classes":"વર્ગો પર પાછા","Students by class":"વર્ગ પ્રમાણે વિદ્યાર્થીઓ","Total students":"કુલ વિદ્યાર્થીઓ","Class teacher":"વર્ગ શિક્ષક","Fee account by student":"વિદ્યાર્થી પ્રમાણે ફી ખાતું","Record fee receipt":"ફી રસીદ નોંધો","Full familiar fee table":"પૂર્ણ ઓળખીતું ફી ટેબલ","School fee":"શાળા ફી","Transport fee":"પરિવહન ફી","Donation":"દાન","Total collection":"કુલ વસૂલાત","Funds received":"મળેલ નાણાં","Available":"ઉપલબ્ધ","Purchases, additions and consumption":"ખરીદી, ઉમેરો અને વપરાશ","Questions and replies":"પ્રશ્નો અને જવાબો","Awaiting reply":"જવાબની રાહ","Responsibilities":"જવાબદારીઓ","Execution assigned to":"કાર્ય સોંપેલ","Substitute / backup":"બદલી / બેકઅપ","Primary":"મુખ્ય","Approver":"મંજૂર કરનાર","Cadence":"આવર્તન","Save Primary":"મુખ્ય જવાબદારી સાચવો","Save team assignment":"ટીમ સોંપણી સાચવો","Listen":"બોલો","Stop listening":"સાંભળવાનું બંધ કરો","Ask or describe the problem":"પ્રશ્ન પૂછો અથવા સમસ્યા લખો","Send":"મોકલો","More · school controls":"વધુ · શાળા નિયંત્રણ","Operational registers":"સંચાલન રજિસ્ટર","Later · after secure connection":"પછી · સુરક્ષિત જોડાણ પછી"},
    MR:{"Synthetic records only. No live school data is affected.":"फक्त सराव नोंदी. शाळेच्या खऱ्या डेटावर परिणाम होत नाही.","v7.0 provisional pilot":"v7.0 तात्पुरता सराव","PROVISIONAL PILOT":"तात्पुरता सराव","My work":"माझे काम","My team":"माझी टीम","Tap your donut to open only your decisions.":"फक्त तुमचे निर्णय उघडण्यासाठी तुमचा डोनट दाबा.","Tap a person to see only their work":"व्यक्तीचे काम पाहण्यासाठी त्याचा डोनट दाबा","Assign Primary responsibilities":"मुख्य जबाबदाऱ्या सोपवा","My operations":"माझे संचालन","My coordination":"माझे समन्वयन","Class attendance":"वर्ग उपस्थिती","Teachers":"शिक्षक","Learning & replies":"अभ्यास आणि उत्तरे","Students":"विद्यार्थी","Fees":"शुल्क","Food & cylinders":"अन्न आणि सिलिंडर","Stock register":"साठा नोंदवही","Expenses":"खर्च","Stationery":"स्टेशनरी","Transport":"वाहतूक","Support team":"सहाय्यक टीम","Need action":"कृती आवश्यक","Green · completed":"हिरवे · पूर्ण","Orange · needs review":"नारिंगी · तपासणी","Red · overdue or blocked":"लाल · उशीर किंवा अडथळा","Good":"ठीक","Review":"तपासणी","Problem":"समस्या","Pending":"प्रलंबित","Works now":"आता कार्यरत","Synthetic/browser-only":"फक्त सराव/या ब्राउझरमध्ये","Later":"नंतर","Record location: this browser only":"नोंद स्थान: फक्त हा ब्राउझर","Not connected":"जोडलेले नाही","Open":"उघडा","Close":"बंद करा","Save":"जतन करा","Add student":"विद्यार्थी जोडा","Search student, class or ID":"विद्यार्थी, वर्ग किंवा आयडी शोधा","Back to classes":"वर्गांकडे परत","Students by class":"वर्गानुसार विद्यार्थी","Total students":"एकूण विद्यार्थी","Class teacher":"वर्ग शिक्षक","Fee account by student":"विद्यार्थ्यानुसार शुल्क खाते","Record fee receipt":"शुल्क पावती नोंदवा","Full familiar fee table":"पूर्ण परिचित शुल्क तक्ता","School fee":"शाळेचे शुल्क","Transport fee":"वाहतूक शुल्क","Donation":"देणगी","Total collection":"एकूण वसुली","Funds received":"मिळालेला निधी","Available":"उपलब्ध","Purchases, additions and consumption":"खरेदी, भर आणि वापर","Questions and replies":"प्रश्न आणि उत्तरे","Awaiting reply":"उत्तराची प्रतीक्षा","Responsibilities":"जबाबदाऱ्या","Execution assigned to":"काम सोपवले","Substitute / backup":"बदली / बॅकअप","Primary":"मुख्य","Approver":"मंजूर करणारा","Cadence":"वारंवारता","Save Primary":"मुख्य जबाबदारी जतन करा","Save team assignment":"टीम नेमणूक जतन करा","Listen":"बोला","Stop listening":"ऐकणे थांबवा","Ask or describe the problem":"प्रश्न विचारा किंवा समस्या लिहा","Send":"पाठवा","More · school controls":"अधिक · शाळा नियंत्रण","Operational registers":"संचालन नोंदवही","Later · after secure connection":"नंतर · सुरक्षित जोडणीनंतर"}
  };
  var TERM_COPY={
    HI:[["Coordinator & Admin","समन्वयक और प्रशासन"],["Operations & Finance","संचालन और वित्त"],["Class Teacher","कक्षा शिक्षक"],["Synthetic working flow","अभ्यास कार्य प्रवाह"],["Synthetic role testing","अभ्यास भूमिका परीक्षण"],["Only the work you need is shown","केवल आपका जरूरी काम दिखाया गया है"],["Nothing waiting for Swati","स्वाति के लिए कुछ लंबित नहीं"],["My decisions","मेरे निर्णय"],["teachers and classes","शिक्षक और कक्षाएँ"],["fees and inventory","शुल्क और भंडार"],["full record","पूरा रिकॉर्ड"],["assigned work","सौंपा गया काम"],["responsible person","जिम्मेदार व्यक्ति"],["needs review","समीक्षा चाहिए"],["overdue or blocked","देर या रुकावट"],["complete","पूरा"],["School fee","स्कूल शुल्क"],["Transport fee","परिवहन शुल्क"],["Base Fees","मूल शुल्क"],["Donation Amount","दान राशि"],["Total Fees","कुल शुल्क"],["Paid","भुगतान"],["Balance","शेष"],["Child's Name","बच्चे का नाम"],["Father's Name","पिता का नाम"],["Mobile Number","मोबाइल नंबर"],["Admission Year","प्रवेश वर्ष"],["Current Grade","वर्तमान कक्षा"],["Village Name","गाँव"],["Attendance","उपस्थिति"],["Menu","भोजन सूची"],["Quantity","मात्रा"],["Price","राशि"],["Vendor","विक्रेता"],["Comments","टिप्पणी"],["Item","वस्तु"],["Category","श्रेणी"],["Model Number If applicable","मॉडल नंबर"],["Remark","टिप्पणी"],["Date","तारीख"],["Day","दिन"],["Driver","चालक"],["Vehicle","वाहन"],["Time Slot","समय"],["Work","काम"],["Tasks","कार्य"],["Compliance","अनुपालन"],["Questions","प्रश्न"],["Replies","उत्तर"],["Teacher","शिक्षक"],["Teachers","शिक्षक"],["Student","विद्यार्थी"],["Students","विद्यार्थी"],["Class","कक्षा"],["Classes","कक्षाएँ"],["Head","प्रधान"],["Support","सहायक"],["Primary","मुख्य"],["Backup","बैकअप"],["Owner","जिम्मेदार"],["Status","स्थिति"],["Open","खोलें"],["Add","जोड़ें"],["Save","सहेजें"],["Search","खोजें"],["Later","बाद में"]],
    GU:[["Coordinator & Admin","સંકલન અને વહીવટ"],["Operations & Finance","સંચાલન અને નાણાં"],["Class Teacher","વર્ગ શિક્ષક"],["Synthetic working flow","અભ્યાસ કાર્યપ્રવાહ"],["Synthetic role testing","અભ્યાસ ભૂમિકા પરીક્ષણ"],["Only the work you need is shown","ફક્ત તમારું જરૂરી કામ બતાવ્યું છે"],["Nothing waiting for Swati","સ્વાતિ માટે કશું બાકી નથી"],["My decisions","મારા નિર્ણયો"],["teachers and classes","શિક્ષકો અને વર્ગો"],["fees and inventory","ફી અને સ્ટોક"],["full record","પૂર્ણ રેકોર્ડ"],["assigned work","સોંપાયેલ કામ"],["responsible person","જવાબદાર વ્યક્તિ"],["needs review","સમીક્ષા જરૂરી"],["overdue or blocked","મોડું અથવા અટકેલું"],["complete","પૂર્ણ"],["School fee","શાળા ફી"],["Transport fee","પરિવહન ફી"],["Base Fees","મૂળ ફી"],["Donation Amount","દાન રકમ"],["Total Fees","કુલ ફી"],["Paid","ચૂકવેલ"],["Balance","બાકી"],["Child's Name","બાળકનું નામ"],["Father's Name","પિતાનું નામ"],["Mobile Number","મોબાઇલ નંબર"],["Admission Year","પ્રવેશ વર્ષ"],["Current Grade","વર્તમાન વર્ગ"],["Village Name","ગામ"],["Attendance","હાજરી"],["Menu","મેનુ"],["Quantity","જથ્થો"],["Price","રકમ"],["Vendor","વિક્રેતા"],["Comments","ટિપ્પણી"],["Item","વસ્તુ"],["Category","શ્રેણી"],["Model Number If applicable","મોડેલ નંબર"],["Remark","ટિપ્પણી"],["Date","તારીખ"],["Day","દિવસ"],["Driver","ડ્રાઇવર"],["Vehicle","વાહન"],["Time Slot","સમય"],["Work","કામ"],["Tasks","કાર્યો"],["Compliance","અનુપાલન"],["Questions","પ્રશ્નો"],["Replies","જવાબો"],["Teacher","શિક્ષક"],["Teachers","શિક્ષકો"],["Student","વિદ્યાર્થી"],["Students","વિદ્યાર્થીઓ"],["Class","વર્ગ"],["Classes","વર્ગો"],["Head","પ્રધાન"],["Support","સહાયક"],["Primary","મુખ્ય"],["Backup","બેકઅપ"],["Owner","જવાબદાર"],["Status","સ્થિતિ"],["Open","ખોલો"],["Add","ઉમેરો"],["Save","સાચવો"],["Search","શોધો"],["Later","પછી"]],
    MR:[["Coordinator & Admin","समन्वय आणि प्रशासन"],["Operations & Finance","संचालन आणि वित्त"],["Class Teacher","वर्ग शिक्षक"],["Synthetic working flow","सराव कार्यप्रवाह"],["Synthetic role testing","सराव भूमिका चाचणी"],["Only the work you need is shown","फक्त तुमचे आवश्यक काम दाखवले आहे"],["Nothing waiting for Swati","स्वातीसाठी काहीही प्रलंबित नाही"],["My decisions","माझे निर्णय"],["teachers and classes","शिक्षक आणि वर्ग"],["fees and inventory","शुल्क आणि साठा"],["full record","पूर्ण नोंद"],["assigned work","सोपवलेले काम"],["responsible person","जबाबदार व्यक्ती"],["needs review","तपासणी आवश्यक"],["overdue or blocked","उशीर किंवा अडथळा"],["complete","पूर्ण"],["School fee","शाळेचे शुल्क"],["Transport fee","वाहतूक शुल्क"],["Base Fees","मूळ शुल्क"],["Donation Amount","देणगी रक्कम"],["Total Fees","एकूण शुल्क"],["Paid","भरले"],["Balance","बाकी"],["Child's Name","मुलाचे नाव"],["Father's Name","वडिलांचे नाव"],["Mobile Number","मोबाइल नंबर"],["Admission Year","प्रवेश वर्ष"],["Current Grade","सध्याचा वर्ग"],["Village Name","गाव"],["Attendance","उपस्थिती"],["Menu","जेवण सूची"],["Quantity","प्रमाण"],["Price","रक्कम"],["Vendor","विक्रेता"],["Comments","टिप्पणी"],["Item","वस्तू"],["Category","वर्गवारी"],["Model Number If applicable","मॉडेल नंबर"],["Remark","टिप्पणी"],["Date","तारीख"],["Day","दिवस"],["Driver","चालक"],["Vehicle","वाहन"],["Time Slot","वेळ"],["Work","काम"],["Tasks","कामे"],["Compliance","अनुपालन"],["Questions","प्रश्न"],["Replies","उत्तरे"],["Teacher","शिक्षक"],["Teachers","शिक्षक"],["Student","विद्यार्थी"],["Students","विद्यार्थी"],["Class","वर्ग"],["Classes","वर्ग"],["Head","प्रमुख"],["Support","सहाय्यक"],["Primary","मुख्य"],["Backup","बॅकअप"],["Owner","जबाबदार"],["Status","स्थिती"],["Open","उघडा"],["Add","जोडा"],["Save","जतन करा"],["Search","शोधा"],["Later","नंतर"]]
  };
  var EXTRA_COPY={
    HI:{"Tap the ring or Open; each tracker opens directly":"रिंग या खोलें दबाएँ; हर खाता सीधे खुलेगा","Tap the ring or Open; Students leads to all 9 class donuts":"रिंग या खोलें दबाएँ; विद्यार्थी पहले सभी 9 कक्षाओं के डोनट दिखाता है","All nine classes remain selectable":"सभी नौ कक्षाएँ चुनी जा सकती हैं","Coverage, presence and assigned work":"बदली, उपस्थिति और सौंपा गया काम","Plans, questions and follow-up":"योजनाएँ, प्रश्न और आगे की कार्रवाई","Open 9 class donuts first":"पहले 9 कक्षा डोनट खोलें","POCSO, DPDP, owner and frequency":"POCSO, DPDP, जिम्मेदार और आवृत्ति","Full student fee table and balances":"विद्यार्थियों की पूरी शुल्क तालिका और शेष","Menu, use and stock":"भोजन सूची, उपयोग और भंडार","Kitchen, furniture and electronics":"रसोई, फर्नीचर और इलेक्ट्रॉनिक्स","Opex, bills and approvals":"खर्च, बिल और स्वीकृतियाँ","Books, stationery, additions and issues":"किताबें, स्टेशनरी, जोड़ और वितरण","Routes and transport-fee balance":"मार्ग और परिवहन शुल्क शेष","Daily and weekly routine checks":"दैनिक और साप्ताहिक नियमित जाँच","Owner, backup, frequency and evidence":"जिम्मेदार, बैकअप, आवृत्ति और प्रमाण","All 11 people, duties and frequency":"सभी 11 लोग, जिम्मेदारियाँ और आवृत्ति","Search this report":"यह रिपोर्ट खोजें","All colours":"सभी रंग","Quick add / issue":"जल्दी जोड़ें / जारी करें","New item":"नई वस्तु","Existing item":"मौजूदा वस्तु","What happened?":"क्या हुआ?","Add stock":"भंडार जोड़ें","Issue / consume":"जारी / उपयोग करें","Compliance and recurring checks":"अनुपालन और नियमित जाँच","Regular activity":"नियमित गतिविधि","Responsible":"जिम्मेदार","Frequency":"आवृत्ति","Record":"दर्ज करें","Facilities & garden":"सुविधाएँ और बगीचा","Regular work under Ahmad.":"अहमद के अधीन नियमित काम।","Photo evidence":"फोटो प्रमाण","Later · shared record":"बाद में · साझा रिकॉर्ड"},
    GU:{"Tap the ring or Open; each tracker opens directly":"રિંગ અથવા ખોલો દબાવો; દરેક હિસાબ સીધો ખુલશે","Tap the ring or Open; Students leads to all 9 class donuts":"રિંગ અથવા ખોલો દબાવો; વિદ્યાર્થીઓ પહેલા તમામ 9 વર્ગના ડોનટ બતાવે છે","All nine classes remain selectable":"તમામ નવ વર્ગ પસંદ કરી શકાય છે","Coverage, presence and assigned work":"બદલી, હાજરી અને સોંપાયેલ કામ","Plans, questions and follow-up":"યોજનાઓ, પ્રશ્નો અને અનુસરણ","Open 9 class donuts first":"પહેલા 9 વર્ગ ડોનટ ખોલો","POCSO, DPDP, owner and frequency":"POCSO, DPDP, જવાબદાર અને આવર્તન","Full student fee table and balances":"વિદ્યાર્થીઓની સંપૂર્ણ ફી યાદી અને બાકી","Menu, use and stock":"મેનુ, વપરાશ અને સ્ટોક","Kitchen, furniture and electronics":"રસોડું, ફર્નિચર અને ઇલેક્ટ્રોનિક્સ","Opex, bills and approvals":"ખર્ચ, બિલ અને મંજૂરી","Books, stationery, additions and issues":"પુસ્તકો, સ્ટેશનરી, ઉમેરો અને જાવક","Routes and transport-fee balance":"રૂટ અને પરિવહન ફીની બાકી","Daily and weekly routine checks":"દૈનિક અને સાપ્તાહિક નિયમિત તપાસ","Owner, backup, frequency and evidence":"જવાબદાર, બેકઅપ, આવર્તન અને પુરાવો","All 11 people, duties and frequency":"તમામ 11 લોકો, ફરજો અને આવર્તન","Search this report":"આ રિપોર્ટ શોધો","All colours":"બધા રંગ","Quick add / issue":"ઝડપથી ઉમેરો / આપો","New item":"નવી વસ્તુ","Existing item":"હાલની વસ્તુ","What happened?":"શું થયું?","Add stock":"સ્ટોક ઉમેરો","Issue / consume":"આપો / વાપરો","Compliance and recurring checks":"અનુપાલન અને નિયમિત તપાસ","Regular activity":"નિયમિત પ્રવૃત્તિ","Responsible":"જવાબદાર","Frequency":"આવર્તન","Record":"નોંધો","Facilities & garden":"સુવિધાઓ અને બગીચો","Regular work under Ahmad.":"અહમદ હેઠળનું નિયમિત કામ.","Photo evidence":"ફોટો પુરાવો","Later · shared record":"પછી · સહિયારો રેકોર્ડ"},
    MR:{"Tap the ring or Open; each tracker opens directly":"रिंग किंवा उघडा दाबा; प्रत्येक नोंद थेट उघडेल","Tap the ring or Open; Students leads to all 9 class donuts":"रिंग किंवा उघडा दाबा; विद्यार्थी आधी सर्व 9 वर्गांचे डोनट दाखवतो","All nine classes remain selectable":"सर्व नऊ वर्ग निवडता येतात","Coverage, presence and assigned work":"बदली, उपस्थिती आणि सोपवलेले काम","Plans, questions and follow-up":"योजना, प्रश्न आणि पुढील कार्यवाही","Open 9 class donuts first":"आधी 9 वर्ग डोनट उघडा","POCSO, DPDP, owner and frequency":"POCSO, DPDP, जबाबदार आणि वारंवारता","Full student fee table and balances":"विद्यार्थ्यांची पूर्ण शुल्क यादी आणि बाकी","Menu, use and stock":"जेवण सूची, वापर आणि साठा","Kitchen, furniture and electronics":"स्वयंपाकघर, फर्निचर आणि इलेक्ट्रॉनिक्स","Opex, bills and approvals":"खर्च, बिले आणि मंजुरी","Books, stationery, additions and issues":"पुस्तके, स्टेशनरी, भर आणि वाटप","Routes and transport-fee balance":"मार्ग आणि वाहतूक शुल्क बाकी","Daily and weekly routine checks":"दैनिक आणि साप्ताहिक नियमित तपासणी","Owner, backup, frequency and evidence":"जबाबदार, बॅकअप, वारंवारता आणि पुरावा","All 11 people, duties and frequency":"सर्व 11 लोक, जबाबदाऱ्या आणि वारंवारता","Search this report":"हा अहवाल शोधा","All colours":"सर्व रंग","Quick add / issue":"पटकन भरा / द्या","New item":"नवीन वस्तू","Existing item":"उपलब्ध वस्तू","What happened?":"काय झाले?","Add stock":"साठा भरा","Issue / consume":"द्या / वापरा","Compliance and recurring checks":"अनुपालन आणि नियमित तपासणी","Regular activity":"नियमित कृती","Responsible":"जबाबदार","Frequency":"वारंवारता","Record":"नोंद करा","Facilities & garden":"सुविधा आणि बाग","Regular work under Ahmad.":"अहमदच्या अधीन नियमित काम.","Photo evidence":"फोटो पुरावा","Later · shared record":"नंतर · सामायिक नोंद"}
  };
  var V7_COPY={
    HI:{"Messages & tasks":"संदेश और कार्य","My reminders & messages":"मेरे अनुस्मारक और संदेश","Seven-day work record":"सात दिन का कार्य रिकॉर्ड","New reminder, task or question":"नया अनुस्मारक, कार्य या प्रश्न","Waiting for me":"मेरे उत्तर की प्रतीक्षा","Sent by me":"मेरे द्वारा भेजे गए","My reminders":"मेरे अनुस्मारक","Work conversations":"कार्य वार्तालाप","Task, question, reply and status remain in one record":"कार्य, प्रश्न, उत्तर और स्थिति एक ही रिकॉर्ड में रहते हैं","Find as you type":"लिखते ही खोजें","Results change immediately":"परिणाम तुरंत बदलते हैं","Colour":"रंग","Type":"प्रकार","From":"किससे","To":"किसको","Latest reply / update":"नवीनतम उत्तर / अपडेट","Open / reply":"खोलें / उत्तर दें","Action report":"कार्रवाई रिपोर्ट","Live role records · filter, then act from the same row":"जीवित भूमिका रिकॉर्ड · छाँटें, फिर उसी पंक्ति से कार्रवाई करें","Live work rows":"जीवित कार्य पंक्तियाँ","Visible audit entries":"दिखने वाली ऑडिट प्रविष्टियाँ","Open and update":"खोलें और अपडेट करें","Balance quantity":"शेष मात्रा","Average rate":"औसत दर","Balance value":"शेष मूल्य","Movement history":"आवागमन इतिहास","Add stock":"स्टॉक जोड़ें","Issue stock":"स्टॉक जारी करें","Stock in / purchase":"स्टॉक आवक / खरीद","Stock out / issue":"स्टॉक जावक / जारी","Rate per unit":"प्रति इकाई दर","Movement value":"आवागमन मूल्य"},
    GU:{"Messages & tasks":"સંદેશા અને કાર્યો","My reminders & messages":"મારા સ્મરણપત્રો અને સંદેશા","Seven-day work record":"સાત દિવસનો કાર્ય રેકોર્ડ","New reminder, task or question":"નવું સ્મરણપત્ર, કાર્ય અથવા પ્રશ્ન","Waiting for me":"મારા જવાબની રાહ","Sent by me":"મેં મોકલેલું","My reminders":"મારા સ્મરણપત્રો","Work conversations":"કાર્ય સંવાદ","Task, question, reply and status remain in one record":"કાર્ય, પ્રશ્ન, જવાબ અને સ્થિતિ એક જ રેકોર્ડમાં રહે છે","Find as you type":"લખતાં જ શોધો","Results change immediately":"પરિણામ તરત બદલાય છે","Colour":"રંગ","Type":"પ્રકાર","From":"કોની પાસેથી","To":"કોને","Latest reply / update":"નવો જવાબ / સુધારો","Open / reply":"ખોલો / જવાબ આપો","Action report":"કાર્યવાહી રિપોર્ટ","Live role records · filter, then act from the same row":"જીવંત ભૂમિકા રેકોર્ડ · ગાળો, પછી એ જ પંક્તિથી કાર્યવાહી કરો","Live work rows":"જીવંત કાર્ય પંક્તિઓ","Visible audit entries":"દેખાતી ઓડિટ નોંધો","Open and update":"ખોલો અને સુધારો","Balance quantity":"બાકી જથ્થો","Average rate":"સરેરાશ દર","Balance value":"બાકી મૂલ્ય","Movement history":"આવક-જાવક ઇતિહાસ","Add stock":"સ્ટોક ઉમેરો","Issue stock":"સ્ટોક આપો","Stock in / purchase":"સ્ટોક આવક / ખરીદી","Stock out / issue":"સ્ટોક જાવક / આપો","Rate per unit":"એકમ દીઠ દર","Movement value":"આવક-જાવક મૂલ્ય"},
    MR:{"Messages & tasks":"संदेश आणि कामे","My reminders & messages":"माझी स्मरणपत्रे आणि संदेश","Seven-day work record":"सात दिवसांची कार्य नोंद","New reminder, task or question":"नवीन स्मरणपत्र, काम किंवा प्रश्न","Waiting for me":"माझ्या उत्तराची प्रतीक्षा","Sent by me":"मी पाठवलेले","My reminders":"माझी स्मरणपत्रे","Work conversations":"कार्य संवाद","Task, question, reply and status remain in one record":"काम, प्रश्न, उत्तर आणि स्थिती एकाच नोंदीत राहतात","Find as you type":"लिहिताच शोधा","Results change immediately":"निकाल लगेच बदलतात","Colour":"रंग","Type":"प्रकार","From":"कोणाकडून","To":"कोणाला","Latest reply / update":"नवीन उत्तर / सुधारणा","Open / reply":"उघडा / उत्तर द्या","Action report":"कार्यवाही अहवाल","Live role records · filter, then act from the same row":"चालू भूमिका नोंदी · गाळा, मग त्याच ओळीतून कृती करा","Live work rows":"चालू कामाच्या ओळी","Visible audit entries":"दिसणाऱ्या ऑडिट नोंदी","Open and update":"उघडा आणि सुधारणा करा","Balance quantity":"शिल्लक प्रमाण","Average rate":"सरासरी दर","Balance value":"शिल्लक मूल्य","Movement history":"आवक-जावक इतिहास","Add stock":"साठा भरा","Issue stock":"साठा द्या","Stock in / purchase":"साठा आवक / खरेदी","Stock out / issue":"साठा जावक / वाटप","Rate per unit":"प्रति एकक दर","Movement value":"आवक-जावक मूल्य"}
  };
  ["HI","GU","MR"].forEach(function(code){Object.assign(EXTRA_COPY[code],V7_COPY[code]);});
  Object.assign(FULL_COPY.HI,{"Listen":"सुनें","Problem":"समस्या","Items":"वस्तुएँ","Need action":"कार्रवाई चाहिए","Value":"मूल्य","Used":"उपयोग किया","Funds register":"धन रजिस्टर","Movement":"आवागमन","Rate":"दर","My assigned work":"मेरा सौंपा गया काम","My operating scope":"मेरे काम का दायरा","Leadership continuity":"नेतृत्व निरंतरता","Primary responsibilities":"मुख्य जिम्मेदारियाँ","Executor":"कार्यकर्ता","Substitute":"वैकल्पिक व्यक्ति","Reason / until":"कारण / अंतिम तिथि","Save assignment":"जिम्मेदारी सहेजें","Role-holder":"भूमिका धारक","Substitute or replace":"विकल्प या प्रतिस्थापन","Balance qty":"शेष मात्रा","Item name":"वस्तु का नाम","Tap Listen and speak in the selected language. Browser permission is requested only after your tap.":"सुनें दबाकर चुनी हुई भाषा में बोलें। अनुमति केवल आपके दबाने के बाद माँगी जाएगी।"});
  Object.assign(FULL_COPY.GU,{"Listen":"સાંભળો","Problem":"સમસ્યા","Items":"વસ્તુઓ","Need action":"કાર્ય જરૂરી","Value":"મૂલ્ય","Used":"વપરાયેલ","Funds register":"નાણાં રજિસ્ટર","Movement":"આવક-જાવક","Rate":"દર","My assigned work":"મને સોંપાયેલ કામ","My operating scope":"મારા કાર્યનો વ્યાપ","Leadership continuity":"નેતૃત્વ સાતત્ય","Primary responsibilities":"મુખ્ય જવાબદારીઓ","Executor":"કાર્ય કરનાર","Substitute":"બદલી વ્યક્તિ","Reason / until":"કારણ / અંતિમ તારીખ","Save assignment":"જવાબદારી સાચવો","Role-holder":"ભૂમિકા ધારક","Substitute or replace":"બદલી અથવા પ્રતિસ્થાપન","Balance qty":"બાકી જથ્થો","Item name":"વસ્તુનું નામ","Tap Listen and speak in the selected language. Browser permission is requested only after your tap.":"સાંભળો દબાવી પસંદ કરેલી ભાષામાં બોલો. પરવાનગી તમારા દબાવ્યા પછી જ માંગવામાં આવશે."});
  Object.assign(FULL_COPY.MR,{"Listen":"ऐका","Problem":"समस्या","Items":"वस्तू","Need action":"कृती आवश्यक","Value":"मूल्य","Used":"वापरले","Funds register":"निधी नोंदवही","Movement":"आवक-जावक","Rate":"दर","My assigned work":"मला सोपवलेले काम","My operating scope":"माझ्या कामाची व्याप्ती","Leadership continuity":"नेतृत्व सातत्य","Primary responsibilities":"मुख्य जबाबदाऱ्या","Executor":"काम करणारा","Substitute":"बदली व्यक्ती","Reason / until":"कारण / अंतिम तारीख","Save assignment":"जबाबदारी जतन करा","Role-holder":"भूमिका धारक","Substitute or replace":"बदली किंवा प्रतिस्थापन","Balance qty":"शिल्लक प्रमाण","Item name":"वस्तूचे नाव","Tap Listen and speak in the selected language. Browser permission is requested only after your tap.":"ऐका दाबून निवडलेल्या भाषेत बोला. परवानगी तुमच्या दाबल्यानंतरच विचारली जाईल."});
  Object.assign(FULL_COPY.HI,{"v8a synthetic candidate":"v8a अभ्यास उम्मीदवार"});
  Object.assign(FULL_COPY.GU,{"v8a synthetic candidate":"v8a અભ્યાસ ઉમેદવાર"});
  Object.assign(FULL_COPY.MR,{"v8a synthetic candidate":"v8a सराव उमेदवार"});

  function initialState() {
    return {
      schemaVersion:81,currentUser:"swati",nav:"home",language:"EN",voice:false,attendanceClass:"Playgroup",studentClassView:"",operationsSection:"overview",routineStatuses:{},
      feePage:1,catalogPage:1,feeExpanded:false,feeFilter:{query:"",className:"",slab:"",status:""},catalogFilter:{query:"",module:"",status:""},
      leadership:{
        COORDINATOR:{role:"Coordinator & Admin",holder:"Yukti",original:"Yukti",mode:"Permanent",from:"2026-09-22",until:"",reason:"Initial approved role-holder"},
        OPERATIONS:{role:"Operations & Finance",holder:"Ahmad",original:"Ahmad",mode:"Permanent",from:"2026-09-22",until:"",reason:"Initial approved role-holder"}
      },
      students:makeStudents(),attendance:{},supportAttendance:{},receipts:[],inventory:[
        {item:"Notebooks",category:"School stores",openingQty:46,openingAvgRate:60,qty:86,avgRate:60,status:"good"},{item:"First-aid refills",category:"Safety",openingQty:4,openingAvgRate:175,qty:4,avgRate:175,status:"review"},
        {item:"Cleaning liquid",category:"Housekeeping",openingQty:2,openingAvgRate:220,qty:2,avgRate:220,status:"problem"},{item:"Printer paper",category:"School stores",openingQty:9,openingAvgRate:280,qty:9,avgRate:280,status:"review"},
        {item:"Rice",category:"Food",openingQty:32,openingAvgRate:55,qty:28,avgRate:55,status:"good"},{item:"Lentils",category:"Food",openingQty:8,openingAvgRate:110,qty:8,avgRate:110,status:"review"},{item:"Cooking oil",category:"Food",openingQty:3,openingAvgRate:150,qty:3,avgRate:150,status:"problem"},
        {item:"English readers",category:"Books",openingQty:22,openingAvgRate:180,qty:42,avgRate:180,status:"good"},{item:"Drawing books",category:"Books",openingQty:18,openingAvgRate:75,qty:18,avgRate:75,status:"review"}
      ],
      inventoryMovements:[
        {id:"M-402",at:"21 Sep 08:40",item:"Rice",category:"Food",kind:"Consumption",direction:"Issued",qty:4,rate:55,amount:220,balanceAfter:28,supplier:"—",person:"Kitchen A",reason:"Daily meal"},
        {id:"M-401",at:"20 Sep 15:20",item:"Notebooks",category:"School stores",kind:"Purchase / addition",direction:"Received",qty:40,rate:60,amount:2400,balanceAfter:86,supplier:"Synthetic supplier",person:"Ahmad",reason:"Supplier delivery"},
        {id:"M-400",at:"19 Sep 12:30",item:"English readers",category:"Books",kind:"Purchase / addition",direction:"Received",qty:20,rate:180,amount:3600,balanceAfter:42,supplier:"Synthetic bookseller",person:"Ahmad",reason:"Classroom library addition"}
      ],
      expenses:[
        {id:"E-201",at:"20 Sep",category:"Housekeeping",detail:"Cleaning supplies",quantity:"Assorted",amount:1850,person:"Ahmad",vendor:"Synthetic supplier",accountHolder:"Training account",mode:"Training",comments:"Checked",status:"good"},
        {id:"E-202",at:"21 Sep",category:"Food",detail:"Weekly vegetables",quantity:"Assorted",amount:3260,person:"Kitchen A",vendor:"Synthetic vendor",accountHolder:"Training account",mode:"Training",comments:"Needs review",status:"review"}
      ],
      foodLog:[
        {date:"19 Sep",day:"Friday",attendance:"128/137",menu:"Dal rice",oil:"300 ml",toor:"3.5 kg",rice:"9 kg",vegetables:"—",roti:"—",poha:"—",chana:"—",besan:"—",curd:"—",doughOil:"—",status:"good"},
        {date:"20 Sep",day:"Saturday",attendance:"121/137",menu:"Poha",oil:"300 ml",toor:"—",rice:"—",vegetables:"—",roti:"—",poha:"8 kg",chana:"—",besan:"—",curd:"—",doughOil:"—",status:"review"}
      ],
      transportRoster:makeTransportRoster(),
      fundLedger:[
        {id:"F-101",at:"19 Sep",type:"Funds received",source:"Synthetic school operating advance",amount:50000,person:"Ahmad",reference:"TRN-101",status:"good"},
        {id:"F-102",at:"20 Sep",type:"Funds used",source:"Cleaning supplies · E-201",amount:-1850,person:"Ahmad",reference:"E-201",status:"good"},
        {id:"F-103",at:"21 Sep",type:"Funds committed",source:"Weekly vegetables · E-202",amount:-3260,person:"Kitchen A",reference:"E-202",status:"review"}
      ],
      feeLedger:makeFeeLedger(),
      responsibilities:[
        {area:"Student records and admissions",primary:"Yukti",assignee:"Yukti",backupAssignee:"Teacher I",backupLockedByHead:false,leaderBackup:"—",approver:"Swati",cadence:"Daily / admission"},
        {area:"Class attendance",primary:"Yukti",assignee:"Teacher A",backupAssignee:"Teacher B",backupLockedByHead:false,leaderBackup:"—",approver:"Swati",cadence:"Daily"},
        {area:"Academics, assessment and learning",primary:"Yukti",assignee:"Teacher C",backupAssignee:"Teacher D",backupLockedByHead:false,leaderBackup:"—",approver:"Swati",cadence:"Weekly / term"},
        {area:"Teacher coverage and staff administration",primary:"Yukti",assignee:"Teacher B",backupAssignee:"Teacher I",backupLockedByHead:false,leaderBackup:"—",approver:"Swati",cadence:"Daily"},
        {area:"Support attendance and duties",primary:"Ahmad",assignee:"Support A",backupAssignee:"Support B",backupLockedByHead:false,leaderBackup:"Yukti",approver:"Swati",cadence:"Daily"},
        {area:"Fees and receipts",primary:"Ahmad",assignee:"Ahmad",backupAssignee:"Support C",backupLockedByHead:false,leaderBackup:"Yukti",approver:"Swati",cadence:"Daily"},
        {area:"Funds received and available",primary:"Ahmad",assignee:"Ahmad",backupAssignee:"Support C",backupLockedByHead:false,leaderBackup:"Yukti",approver:"Swati",cadence:"Daily"},
        {area:"Inventory and stock",primary:"Ahmad",assignee:"Support B",backupAssignee:"Support C",backupLockedByHead:false,leaderBackup:"Yukti",approver:"Swati",cadence:"Daily / weekly"},
        {area:"Books and stationery",primary:"Ahmad",assignee:"Support C",backupAssignee:"Support B",backupLockedByHead:false,leaderBackup:"Yukti",approver:"Swati",cadence:"Weekly"},
        {area:"Expenses, purchases and vendors",primary:"Ahmad",assignee:"Ahmad",backupAssignee:"Support C",backupLockedByHead:false,leaderBackup:"Yukti",approver:"Swati",cadence:"Daily / monthly"},
        {area:"Kitchen, food and LPG",primary:"Ahmad",assignee:"Kitchen A",backupAssignee:"Kitchen B",backupLockedByHead:false,leaderBackup:"Yukti",approver:"Swati",cadence:"Daily"},
        {area:"Transport and child handover",primary:"Ahmad",assignee:"Driver A",backupAssignee:"Guard A",backupLockedByHead:false,leaderBackup:"Yukti",approver:"Swati",cadence:"Each trip"},
        {area:"Facilities, garden and maintenance",primary:"Ahmad",assignee:"Support D",backupAssignee:"Support F",backupLockedByHead:false,leaderBackup:"Yukti",approver:"Swati",cadence:"Daily / weekly"},
        {area:"Gate, visitors and security",primary:"Ahmad",assignee:"Guard A",backupAssignee:"Support A",backupLockedByHead:false,leaderBackup:"Yukti",approver:"Swati",cadence:"Daily"},
        {area:"POCSO and child protection",primary:"Yukti",assignee:"Yukti",backupAssignee:"Teacher I",backupLockedByHead:false,leaderBackup:"—",approver:"Swati",cadence:"Monthly / quarterly"},
        {area:"DPDP, consent and data access",primary:"Yukti",assignee:"Yukti",backupAssignee:"Teacher I",backupLockedByHead:false,leaderBackup:"—",approver:"Swati",cadence:"Monthly / term"},
        {area:"Parent communication and consent",primary:"Yukti",assignee:"Teacher E",backupAssignee:"Teacher F",backupLockedByHead:false,leaderBackup:"—",approver:"Swati",cadence:"As needed"},
        {area:"Calendar, cadence and reminders",primary:"Yukti",assignee:"Yukti",backupAssignee:"Teacher I",backupLockedByHead:false,leaderBackup:"—",approver:"Swati",cadence:"Daily / monthly"},
        {area:"Reports, audit and period close",primary:"Ahmad",assignee:"Ahmad",backupAssignee:"Yukti",backupLockedByHead:true,leaderBackup:"Yukti",approver:"Swati",cadence:"Weekly / monthly"},
        {area:"Tasks, questions and escalations",primary:"Yukti",assignee:"Yukti",backupAssignee:"Ahmad",backupLockedByHead:true,leaderBackup:"—",approver:"Swati",cadence:"Daily"}
      ],
      tasks:[
        {id:"T-101",title:"Review Nursery A attendance gap",owner:"Yukti",createdBy:"Yukti",kind:"Task",status:"review",due:"Today",group:"Attendance"},
        {id:"T-102",title:"Confirm substitute for Grade 1",owner:"Yukti",createdBy:"Yukti",kind:"Task",status:"problem",due:"Now",group:"Staff"},
        {id:"T-103",title:"Check two unpaid transport balances",owner:"Ahmad",createdBy:"Ahmad",kind:"Task",status:"review",due:"Today",group:"Fees"},
        {id:"T-104",title:"Recount cleaning liquid",owner:"Ahmad",createdBy:"Support A",kind:"Task",status:"problem",due:"Yesterday",group:"Inventory"},
        {id:"T-105",title:"Close drinking-water check",owner:"Support A",createdBy:"Ahmad",kind:"Task",status:"pending",due:"Today",group:"Safety"},
        {id:"T-106",title:"Reply to teacher timetable question",owner:"Yukti",createdBy:"Teacher B",kind:"Question",status:"pending",due:"Today",group:"Question"},
        {id:"T-107",title:"Monthly DPDP access review",owner:"Yukti",createdBy:"Yukti",kind:"Task",status:"good",due:"28 Sep",group:"Compliance"},
        {id:"T-108",title:"Verify fee receipt sequence",owner:"Ahmad",createdBy:"Ahmad",kind:"Task",status:"good",due:"25 Sep",group:"Fees"},
        {id:"T-120",title:"Review pilot feedback after Yukti and Ahmad test",owner:"Swati",createdBy:"Swati",kind:"Reminder",status:"pending",due:"30 Sep",group:"Reminder"},
        {id:"T-121",title:"Confirm whether the support roster names are final",owner:"Ahmad",createdBy:"Swati",kind:"Question",status:"pending",due:"26 Sep",group:"Question"},
        {id:"T-122",title:"Confirm the nine class-teacher assignments",owner:"Yukti",createdBy:"Swati",kind:"Question",status:"pending",due:"26 Sep",group:"Question"}
      ],
      obligations:[
        {id:"CMP-01",category:"Child protection",title:"POCSO reporting readiness and concern register",owner:"Yukti",backup:"Teacher I",frequency:"Monthly",due:"30 Sep",status:"pending",evidence:"Restricted checklist; attachments Later"},
        {id:"CMP-02",category:"Child protection",title:"Safeguarding briefing and code-of-conduct acknowledgement",owner:"Yukti",backup:"Teacher I",frequency:"Quarterly",due:"05 Oct",status:"review",evidence:"Attendance and acknowledgement list"},
        {id:"CMP-03",category:"Data protection",title:"DPDP child-data access and purpose review",owner:"Yukti",backup:"Ahmad",frequency:"Monthly",due:"28 Sep",status:"review",evidence:"Access list; secure vault Later"},
        {id:"CMP-04",category:"Data protection",title:"Guardian notice, consent and retention review",owner:"Yukti",backup:"Ahmad",frequency:"Term",due:"15 Oct",status:"pending",evidence:"Approved notice; digital consent Later"},
        {id:"CMP-05",category:"Fire & emergency",title:"Fire equipment, exits and emergency numbers",owner:"Support A",backup:"Ahmad",frequency:"Monthly",due:"24 Sep",status:"problem",evidence:"Checklist now; photo evidence Later"},
        {id:"CMP-06",category:"Fire & emergency",title:"Evacuation and emergency drill",owner:"Ahmad",backup:"Yukti",frequency:"Quarterly",due:"10 Oct",status:"pending",evidence:"Drill record; reminder Later"},
        {id:"CMP-07",category:"Health & water",title:"Drinking-water and tank hygiene check",owner:"Support A",backup:"Ahmad",frequency:"Weekly",due:"Today",status:"review",evidence:"Checklist; lab file link Later"},
        {id:"CMP-08",category:"Health & water",title:"First-aid stock, expiry and incident register",owner:"Support A",backup:"Ahmad",frequency:"Monthly",due:"05 Oct",status:"good",evidence:"Expiry and incident list"},
        {id:"CMP-09",category:"Food safety",title:"Kitchen hygiene, food storage and pest check",owner:"Kitchen A",backup:"Kitchen B",frequency:"Daily / weekly",due:"Today",status:"review",evidence:"Kitchen checklist; photos Later"},
        {id:"CMP-10",category:"Food safety",title:"LPG cylinder, regulator and supplier record",owner:"Kitchen B",backup:"Ahmad",frequency:"Weekly",due:"25 Sep",status:"good",evidence:"Cylinder log; bill link Later"},
        {id:"CMP-11",category:"Facilities",title:"Toilets, classrooms, playground and boundary round",owner:"Support D",backup:"Ahmad",frequency:"Daily",due:"Today",status:"review",evidence:"Facilities checklist"},
        {id:"CMP-12",category:"Facilities",title:"Electrical, building and repair risk review",owner:"Support E",backup:"Ahmad",frequency:"Monthly",due:"03 Oct",status:"pending",evidence:"Repair and escalation log"},
        {id:"CMP-13",category:"Transport",title:"Vehicle, driver, route and child-handover check",owner:"Driver A",backup:"Ahmad",frequency:"Each trip / monthly",due:"Today",status:"review",evidence:"Route and vehicle log"},
        {id:"CMP-14",category:"Security",title:"Visitor, gate and authorised child-release register",owner:"Guard A",backup:"Ahmad",frequency:"Daily",due:"Today",status:"good",evidence:"Gate register"},
        {id:"CMP-15",category:"Certificates",title:"School, building, fire, water and food documents review",owner:"Ahmad",backup:"Yukti",frequency:"Annual / expiry",due:"31 Oct",status:"pending",evidence:"Document index; secure file links Later"},
        {id:"CMP-16",category:"Governance",title:"Local statutory and affiliation checklist confirmation",owner:"Swati",backup:"Yukti",frequency:"Annual / when changed",due:"31 Oct",status:"pending",evidence:"External legal verification Later"}
      ],
      questions:[
        {id:"Q-31",from:"Teacher B",to:"Yukti",question:"Can I correct yesterday's attendance?",answer:"Yes. Open Attendance, choose the date and use Correct. The original mark remains in history.",status:"answered"},
        {id:"Q-32",from:"Support B",to:"Ahmad",question:"Who approves the cleaning purchase?",answer:"",status:"open"}
      ],
      events:[
        {date:"21 Sep",title:"Staff briefing",owner:"Yukti",status:"good"},
        {date:"24 Sep",title:"Fire equipment inspection",owner:"Support A",status:"problem"},
        {date:"28 Sep",title:"Child-data access review",owner:"Yukti",status:"review"},
        {date:"30 Sep",title:"Safeguarding review",owner:"Yukti",status:"pending"}
      ],
      audit:[
        {at:"Today 09:12",actor:"Yukti",action:"Marked Nursery B attendance"},
        {at:"Today 08:54",actor:"Ahmad",action:"Recorded synthetic receipt R-204"},
        {at:"Yesterday",actor:"Support A",action:"Reported cleaning-liquid shortage"}
      ],
      taskRecords:{
        "T-101":[{at:"Today 09:20",actor:"Yukti",note:"Asked Nursery A teacher to verify the two missing marks."}],
        "T-104":[{at:"Yesterday 16:10",actor:"Support A",note:"Counted two sealed bottles in the store."}],
        "T-120":[{at:"21 Sep",actor:"Swati",note:"Reminder created for my own follow-up."}],
        "T-121":[{at:"21 Sep",actor:"Swati",note:"Please confirm the real names before the roster is connected."}],
        "T-122":[{at:"21 Sep",actor:"Swati",note:"Please confirm teacher names against all nine classes."}]
      },
      dailyWork:[
        {date:"15 Sep",day:"Tue",good:4,review:3,problem:1},{date:"16 Sep",day:"Wed",good:5,review:2,problem:1},
        {date:"17 Sep",day:"Thu",good:4,review:4,problem:1},{date:"18 Sep",day:"Fri",good:6,review:3,problem:1},
        {date:"19 Sep",day:"Sat",good:7,review:3,problem:2},{date:"20 Sep",day:"Sun",good:6,review:4,problem:2},
        {date:"21 Sep",day:"Mon",good:0,review:0,problem:0}
      ]
    };
  }

  function makeStudents() {
    var list=[], n=1;
    CLASS_COUNTS.forEach(function (entry) {
      for (var i=0;i<entry[1];i+=1) {
        list.push({id:"S"+String(n).padStart(3,"0"),name:"Student "+String(n).padStart(3,"0"),className:entry[0],guardian:"Guardian "+String(n).padStart(3,"0"),active:true});
        n+=1;
      }
    });
    return list;
  }

  function makeFeeLedger() {
    return makeStudents().map(function(s,i){
      var slab=i%5===0?"Gold":"Bronze";
      var base=600,donation=slab==="Gold"?1200:0,transport=i%4===0?0:600,total=base+donation+transport;
      var months=["July","August","September","October","November","December","January","February","March","April"],paidMonths=i%7===0?1:i%4===0?2:3;
      var row={id:"KVN"+(i+1),student:s.name,father:"Synthetic guardian",mobile:"00000 00000",admissionYear:"26-27 (Training)",className:s.className,currentGrade:s.className,sex:i%2?"F":"M",ethnicity:"Synthetic",service:"Training category",village:"Training village",slab:slab,schoolCategory:"Tuition",schoolDue:(base+donation)*3,schoolPaid:(base+donation)*paidMonths,donation:donation,transportCategory:transport?slab+" route":"None",transportDue:transport*3,transportPaid:transport*paidMonths,totalFees:total,months:{}};
      months.forEach(function(m,mi){row.months[m]=mi<paidMonths?total:0;});
      return row;
    });
  }
  function makeTransportRoster() {
    return makeStudents().map(function(s,i){return {id:i+1,student:s.name,father:"Synthetic guardian",grade:s.className,sex:i%2?"F":"M",village:"Training village",mobile:"00000 00000",timeSlot:i%3===0?"08:00–08:35":"08:15–08:50",vehicle:i%4===0?"Non-Transport":i%2?"Yellow-01":"White-01",driver:i%4===0?"—":"Driver A",status:i%11===0?"review":"good"};});
  }

  var DATA_GATEWAY={
    mode:"synthetic-local",
    load:function(){return localStorage.getItem(STORE_KEY);},
    save:function(snapshot){localStorage.setItem(STORE_KEY,JSON.stringify(snapshot));},
    clear:function(){localStorage.removeItem(STORE_KEY);}
  };
  function loadState() {
    try {
      var saved=JSON.parse(DATA_GATEWAY.load());
      if(saved&&saved.schemaVersion===81&&saved.students&&saved.students.length===137&&saved.feeLedger&&saved.feeLedger.length===137){
        saved.studentClassView="";saved.operationsSection=saved.operationsSection||"overview";saved.supportAttendance=saved.supportAttendance||{};
        saved.feePage=Number(saved.feePage)||1;saved.catalogPage=Number(saved.catalogPage)||1;saved.feeExpanded=Boolean(saved.feeExpanded);saved.feeFilter=saved.feeFilter||{query:"",className:"",slab:"",status:""};saved.catalogFilter=saved.catalogFilter||{query:"",module:"",status:""};
        return saved;
      }
    } catch(ignore) {}
    return initialState();
  }
  var state=loadState();
  var panelDialog=document.getElementById("panelDialog");
  var formDialog=document.getElementById("formDialog");
  var sarasDialog=document.getElementById("sarasDialog");
  var SARAS_TEMPLATE=sarasDialog.innerHTML;
  var activeModule="";
  var busy=false;
  var speechRecognition=null;

  function refreshDailyWork() {
    if(!state.dailyWork||!state.dailyWork.length)return;
    var all=(state.tasks||[]).concat(state.obligations||[]),last=state.dailyWork[state.dailyWork.length-1];
    last.good=all.filter(function(x){return x.status==="good";}).length;
    last.review=all.filter(function(x){return x.status==="review"||x.status==="pending";}).length;
    last.problem=all.filter(function(x){return x.status==="problem";}).length;
  }
  function save() { refreshDailyWork();DATA_GATEWAY.save(state); }
  function esc(value) { return String(value==null?"":value).replace(/[&<>"']/g,function(c){return {"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c];}); }
  function t(key) { return (TEXT[state.language]||TEXT.EN)[key]||TEXT.EN[key]||key; }
  function tr(value) {
    var original=String(value==null?"":value),map=FULL_COPY[state.language]||{},trimmed=original.trim();
    if(!trimmed||state.language==="EN")return original;
    var translated=map[trimmed]||(EXTRA_COPY[state.language]||{})[trimmed];
    if(!translated){
      translated=trimmed
        .replace(/^(\d+) need action$/,function(_,n){return state.language==="HI"?n+" कार्य बाकी":state.language==="GU"?n+" કાર્ય બાકી":n+" कृती बाकी";})
        .replace(/^(\d+) students$/,function(_,n){return state.language==="HI"?n+" विद्यार्थी":state.language==="GU"?n+" વિદ્યાર્થીઓ":n+" विद्यार्थी";})
        .replace(/^Green (\d+)$/,function(_,n){return (state.language==="HI"?"हरा ":state.language==="GU"?"લીલું ":"हिरवे ")+n;})
        .replace(/^Orange (\d+)$/,function(_,n){return (state.language==="HI"?"नारंगी ":state.language==="GU"?"નારંગી ":"नारिंगी ")+n;})
        .replace(/^Red (\d+)$/,function(_,n){return (state.language==="HI"?"लाल ":state.language==="GU"?"લાલ ":"लाल ")+n;});
      translated=translated
        .replace(/^(\d+) red$/,function(_,n){return n+" "+(state.language==="GU"?"લાલ":"लाल");})
        .replace(/^(\d+) orange$/,function(_,n){return n+" "+(state.language==="HI"?"नारंगी":state.language==="GU"?"નારંગી":"नारिंगी");})
        .replace(/^(\d+) green$/,function(_,n){return n+" "+(state.language==="HI"?"हरे":state.language==="GU"?"લીલા":"हिरवे");});
      if(translated===trimmed){
        translated=trimmed;(TERM_COPY[state.language]||[]).forEach(function(pair){var safe=pair[0].replace(/[.*+?^${}()|[\]\\]/g,"\\$&");translated=translated.replace(new RegExp("\\b"+safe+"\\b","g"),pair[1]);});
        if(translated===trimmed)return original;
      }
    }
    return original.replace(trimmed,translated);
  }
  function applyLanguage(root) {
    if(!root||state.language==="EN")return;
    var walker=document.createTreeWalker(root,NodeFilter.SHOW_TEXT),nodes=[],node;
    while((node=walker.nextNode()))nodes.push(node);
    nodes.forEach(function(n){n.nodeValue=tr(n.nodeValue);});
    root.querySelectorAll("[placeholder],[aria-label],[title]").forEach(function(el){["placeholder","aria-label","title"].forEach(function(a){if(el.hasAttribute(a))el.setAttribute(a,tr(el.getAttribute(a)));});});
    root.querySelectorAll("[data-copy]").forEach(function(el){el.textContent=tr(el.getAttribute("data-copy"));});
  }
  function allStaffNames(){return STAFF.map(function(s){return s[0];});}
  function uniquePeople(names){return names.filter(function(name,index){return name&&names.indexOf(name)===index;});}
  function activeLeader(roleCode){return state.leadership&&state.leadership[roleCode]&&state.leadership[roleCode].holder||DEFAULT_LEADERS[roleCode];}
  function primaryLeaders(){return uniquePeople([activeLeader("COORDINATOR"),activeLeader("OPERATIONS")]);}
  function teamForPrimary(primary,headOverride){
    if(headOverride)return uniquePeople(allStaffNames().concat(["Swati"]));
    if(primary===activeLeader("OPERATIONS"))return uniquePeople([primary].concat(supportNames()));
    return uniquePeople([activeLeader("COORDINATOR")].concat(teacherNames()));
  }
  function user() {
    var base=PERSONAS[state.currentUser]||PERSONAS.swati;
    if(base.view==="COORDINATOR")return Object.assign({},base,{name:activeLeader("COORDINATOR")});
    if(base.view==="FINANCE")return Object.assign({},base,{name:activeLeader("OPERATIONS")});
    return base;
  }
  function canMutateOperations(){return user().view==="FINANCE";}
  function canManageStudents(){return user().view==="COORDINATOR";}
  function canMarkStudentAttendance(){return user().view==="COORDINATOR"||user().view==="TEACHER";}
  function denyMutation(area){audit("Denied unauthorised mutation in "+area,{entity:"Authority"});toast("View only. This action belongs to the assigned role.");}
  function catalogFor(modules) { return (window.KVN_CATALOG||[]).filter(function(x){return modules.indexOf(x.module)>=0;}); }
  function statusLabel(s) { return {good:"Good",review:"Review",problem:"Problem",pending:"Pending"}[s]||s; }
  function currency(value) { return "₹"+Number(value||0).toLocaleString("en-IN"); }
  function rateMoney(value) { return "₹"+Number(value||0).toLocaleString("en-IN",{minimumFractionDigits:2,maximumFractionDigits:2}); }
  function inventoryValue(item) { return Number(item.qty||0)*Number(item.avgRate||0); }
  function inventoryPositionWithout(itemName,excludedMovementId) {
    var item=state.inventory.find(function(row){return row.item===itemName;});if(!item)return null;
    var qty=Number(item.openingQty||0),avgRate=Number(item.openingAvgRate||0),valid=true;
    state.inventoryMovements.slice().reverse().forEach(function(movement){
      if(!valid||movement.item!==itemName||movement.reversed||movement.contra||movement.id===excludedMovementId)return;
      var movementQty=Number(movement.qty||0),movementRate=Number(movement.rate||0);
      if(movement.direction==="Received"){
        var newQty=qty+movementQty;avgRate=newQty?(qty*avgRate+movementQty*movementRate)/newQty:0;qty=newQty;
      } else {
        if(movementQty>qty){valid=false;return;}qty-=movementQty;
      }
    });
    return valid?{qty:qty,avgRate:qty?avgRate:0}:null;
  }
  function byOwner(name) { return state.tasks.filter(function(x){return x.owner===name;}); }
  function teacherNames() { return TEACHERS.map(function(s){return s[0];}); }
  function supportNames() { return SUPPORT_STAFF.map(function(s){return s[0];}); }
  function roleTeamNames() {
    var v=user().view;
    if(v==="COORDINATOR")return uniquePeople([activeLeader("COORDINATOR")].concat(teacherNames()));
    if(v==="FINANCE")return uniquePeople([activeLeader("OPERATIONS")].concat(supportNames()));
    return [user().name];
  }
  function visibleTasks(includeGood) {
    var v=user().view, names=roleTeamNames();
    return state.tasks.filter(function(x){
      var inScope=v==="HEAD"?x.owner==="Swati":names.indexOf(x.owner)>=0;
      if(!inScope)return false;
      if(includeGood)return true;
      return x.status!=="good";
    });
  }
  function visibleWorkThreads() {
    var v=user().view,names=roleTeamNames();
    return state.tasks.filter(function(x){
      var creator=x.createdBy||x.owner;
      if(v==="HEAD")return x.owner==="Swati"||creator==="Swati";
      if(v==="COORDINATOR"||v==="FINANCE")return names.indexOf(x.owner)>=0||names.indexOf(creator)>=0;
      return x.owner===user().name||creator===user().name;
    });
  }
  function canOpenTask(task) {
    return visibleWorkThreads().some(function(x){return x.id===task.id;});
  }
  function visibleQuestions() {
    var names=roleTeamNames();
    return state.questions.filter(function(q){return user().view==="HEAD"?(q.to==="Swati"||q.from==="Swati"):names.indexOf(q.to)>=0||q.from===user().name;});
  }
  function visibleObligations() {
    var names=roleTeamNames();
    return state.obligations.filter(function(o){return user().view==="HEAD"?(o.owner==="Swati"||o.backup==="Swati"):names.indexOf(o.owner)>=0||names.indexOf(o.backup)>=0;});
  }
  function primaryOptionList(selected) {
    return primaryLeaders().map(function(name){return "<option value='"+esc(name)+"' "+(name===selected?"selected":"")+">"+esc(name)+"</option>";}).join("");
  }
  function delegateOptionList(primary,selected,headOverride) {
    var people=teamForPrimary(primary,headOverride);
    return people.map(function(name){return "<option value='"+esc(name)+"' "+(name===selected?"selected":"")+">"+esc(name)+"</option>";}).join("");
  }
  function backupOptionList(primary,selected,headOverride) {
    return "<option value=''>Not decided</option>"+delegateOptionList(primary,selected,headOverride);
  }
  function assignableTaskPeople() {
    if(user().view==="HEAD")return uniquePeople(["Swati"].concat(allStaffNames()));
    if(user().view==="COORDINATOR")return uniquePeople([activeLeader("COORDINATOR")].concat(teacherNames()));
    if(user().view==="FINANCE")return uniquePeople([activeLeader("OPERATIONS")].concat(supportNames()));
    return [user().name];
  }
  function statusLegend() {
    return "<div class='status-legend' aria-label='Task status colours'><span class='status-chip good'>Green · completed</span><span class='status-chip review'>Orange · needs review</span><span class='status-chip problem'>Red · overdue or blocked</span></div>";
  }
  function recordSourceNote() {
    return "<div class='record-source'><div><strong>Record location: this browser only</strong><span>Shared KVN Sheets and Drive files are not connected in this synthetic pilot.</span></div><span class='status-chip pending'>Later · shared record</span></div>";
  }
  function uniqueValues(values) {
    return values.filter(function(v,i,a){return v&&a.indexOf(v)===i;}).sort();
  }
  function reportFilterBar(tableId,placeholder,filters) {
    filters=filters||[];
    var selects=filters.map(function(f){return "<label><span>"+esc(f.label)+"</span><select data-report-filter='"+esc(tableId)+"' data-filter-key='"+esc(f.key)+"'><option value=''>All "+esc(f.label.toLowerCase())+"</option>"+uniqueValues(f.values||[]).map(function(v){return "<option value='"+esc(v)+"'>"+esc(v)+"</option>";}).join("")+"</select></label>";}).join("");
    return "<div class='report-filters' aria-label='Report filters'><label class='report-search'><span>Find as you type</span><input type='search' data-report-query='"+esc(tableId)+"' placeholder='"+esc(placeholder)+"' autocomplete='off'><small>Results change immediately</small></label>"+selects+"<label><span>Colour</span><select data-report-status='"+esc(tableId)+"'><option value=''>All colours</option><option value='good'>Green</option><option value='review'>Orange</option><option value='problem'>Red</option><option value='pending'>Pending</option></select></label><span class='filter-count' data-report-count='"+esc(tableId)+"'></span></div>";
  }
  function applyReportFilter(tableId) {
    var table=document.getElementById(tableId);if(!table)return;
    var q=document.querySelector("[data-report-query='"+tableId+"']"),status=document.querySelector("[data-report-status='"+tableId+"']"),needle=String(q&&q.value||"").toLowerCase(),wanted=status&&status.value||"",shown=0;
    var selected=Array.from(document.querySelectorAll("[data-report-filter='"+tableId+"']")).map(function(el){return {key:el.dataset.filterKey,value:el.value};});
    table.querySelectorAll("tbody tr").forEach(function(row){var matchesText=!needle||row.textContent.toLowerCase().indexOf(needle)>=0,matchesStatus=!wanted||row.dataset.status===wanted,matchesBusiness=selected.every(function(f){return !f.value||row.dataset[f.key]===f.value;}),visible=matchesText&&matchesStatus&&matchesBusiness;row.hidden=!visible;if(visible)shown+=1;});
    var count=document.querySelector("[data-report-count='"+tableId+"']");if(count)count.textContent=shown+" rows";
  }
  function teamNamesForPerson(name) {
    if(name===activeLeader("COORDINATOR"))return uniquePeople([name].concat(teacherNames()));
    if(name===activeLeader("OPERATIONS"))return uniquePeople([name].concat(supportNames()));
    return [name];
  }
  function recordsForPerson(name) {
    var names=teamNamesForPerson(name),records=[];
    state.tasks.forEach(function(x){if(names.indexOf(x.owner)>=0)records.push(x);});
    state.obligations.forEach(function(o){if(names.indexOf(o.owner)>=0||names.indexOf(o.backup)>=0)records.push(o);});
    return records;
  }
  function countsFor(name) {
    var c={good:0,review:0,problem:0,pending:0};
    recordsForPerson(name).forEach(function(x){c[x.status]=(c[x.status]||0)+1;});
    return c;
  }
  function pct(c) {
    var total=c.good+c.review+c.problem+c.pending;
    if(!total) return {good:0,review:0,problem:0,pending:100};
    return {good:c.good/total*100,review:(c.review+c.pending)/total*100,problem:c.problem/total*100,pending:0};
  }
  function donut(name,label,empty) {
    var c=countsFor(name), p=pct(c), due=c.review+c.pending+c.problem;
    return "<div class='donut"+(empty?" empty":"")+"' style='--good:"+p.good+";--review:"+p.review+";--problem:"+p.problem+";--pending:"+p.pending+"' aria-label='"+esc(name)+": "+due+" need attention'><div class='donut-center'><strong>"+(empty?"0":due)+"</strong><span>"+esc(label||"Due now")+"</span></div></div>";
  }
  function metricRow(c) {
    return "<div class='metric-row three'><div class='metric good'>Green "+c.good+"</div><div class='metric review'>Orange "+(c.review+c.pending)+"</div><div class='metric problem'>Red "+c.problem+"</div></div>";
  }
  function toast(message) {
    var el=document.getElementById("toast"); el.textContent=message; el.classList.add("show");
    clearTimeout(toast.timer); toast.timer=setTimeout(function(){el.classList.remove("show");},2600);
  }
  function cloneData(value){
    if(value==null)return null;
    try{return JSON.parse(JSON.stringify(value));}catch(ignore){return String(value);}
  }
  function nowStamp(){return new Date().toISOString();}
  function nextId(rows,prefix,start){
    var max=(rows||[]).reduce(function(found,row){var match=String(row&&row.id||"").match(new RegExp("^"+prefix+"-(\\d+)$"));return match?Math.max(found,Number(match[1])):found;},Number(start||0));
    return prefix+"-"+String(max+1).padStart(3,"0");
  }
  function audit(action,meta) {
    meta=meta||{};state.audit=state.audit||[];
    state.audit.unshift({id:nextId(state.audit,"AUD",0),at:nowStamp(),actor:user().name,action:action,entity:meta.entity||"General",before:cloneData(meta.before),after:cloneData(meta.after),reason:meta.reason||"",effectiveFrom:meta.effectiveFrom||"",effectiveUntil:meta.effectiveUntil||""});
    save();
  }
  function closeDialogs() {
    [panelDialog,formDialog,sarasDialog].forEach(function(d){if(d.open)d.close();});
  }
  function downloadCsv(filename,headers,rows) {
    var csv=[headers].concat(rows).map(function(row){return row.map(function(v){return '"'+String(v==null?"":v).replace(/"/g,'""')+'"';}).join(",");}).join("\n");
    var url=URL.createObjectURL(new Blob(["\ufeff"+csv],{type:"text/csv;charset=utf-8"})),link=document.createElement("a");
    link.href=url;link.download=filename;document.body.appendChild(link);link.click();link.remove();URL.revokeObjectURL(url);audit("Exported "+filename);toast("Excel-ready export created.");
  }
  function dialogHead(kicker,title,dialogId) {
    return "<div class='dialog-head'><div><p class='eyebrow'>"+esc(kicker)+"</p><h2>"+esc(title)+"</h2></div><button class='icon-button' data-close='"+dialogId+"' aria-label='Close'>×</button></div>";
  }
  function statusChip(s) { return "<span class='status-chip "+esc(s)+"'>"+esc(statusLabel(s))+"</span>"; }

  function renderShell(content) {
    var u=user();
    document.documentElement.lang={EN:"en",HI:"hi",GU:"gu",MR:"mr"}[state.language]||"en";
    document.getElementById("app").innerHTML=
      "<header class='topbar'><div class='brand'><div class='brand-mark'>KVN</div><div class='brand-copy'><strong>KVN School OS</strong><span>"+esc(u.name)+" · "+esc(u.role)+" · "+t("training")+"</span></div></div>"+
      "<div class='top-actions'><button class='profile-button' data-action='profiles' aria-label='Change test role'>"+esc(u.name)+" ▾</button><label class='language-control'><span class='sr-only'>Language</span><select id='languageSelect' aria-label='Language'><option value='EN' "+(state.language==="EN"?"selected":"")+">English</option><option value='HI' "+(state.language==="HI"?"selected":"")+">हिन्दी</option><option value='GU' "+(state.language==="GU"?"selected":"")+">ગુજરાતી</option><option value='MR' "+(state.language==="MR"?"selected":"")+">मराठी</option></select></label><button class='voice-button' data-action='voice' aria-pressed='"+state.voice+"' aria-label='Speech on or off'>"+(state.voice?"Voice on":"Voice off")+"</button></div></header>"+
      "<div class='status-strip'><span>Synthetic records only. No live school data is affected.</span><span>"+RELEASE_LABEL+"</span></div>"+
      content+
      "<button class='saras-fab' data-action='saras'>"+t("ask")+"</button>"+
      "<nav class='bottom-nav' aria-label='Primary'><button class='nav-button "+(state.nav==="home"?"active":"")+"' data-nav='home'>"+t("home")+"</button><button class='nav-button "+(state.nav==="look"?"active":"")+"' data-nav='look'>"+t("look")+"</button><button class='nav-button "+(state.nav==="more"?"active":"")+"' data-nav='more'>"+t("more")+"</button></nav>";
    document.getElementById("app").setAttribute("aria-busy","false");
    applyLanguage(document.getElementById("app"));
  }

  function pageHead(title,subtitle) {
    return "<div class='page-head'><div><p class='eyebrow'>"+esc(user().view)+" workspace</p><h1>"+esc(title)+"</h1><p class='subtle'>"+esc(subtitle)+"</p></div><span class='pilot-badge'>PROVISIONAL PILOT</span></div>";
  }
  function personCard(name,role,empty) {
    var c=countsFor(name);
    return "<button class='person-card' data-action='person' data-person='"+esc(name)+"' aria-label='Open "+esc(name)+" dashboard'>"+donut(name,empty?"Ready":"Need action",empty)+"<span class='person-name'>"+esc(name)+"</span><span class='person-role'>"+esc(role)+"</span><span class='mini-status'><span class='mini-pill red-text'>"+c.problem+" red</span><span class='mini-pill orange-text'>"+(c.review+c.pending)+" orange</span><span class='mini-pill green-text'>"+c.good+" green</span></span><span class='card-open'>Open "+esc(name)+" →</span></button>";
  }
  function countsFrom(records) {
    var c={good:0,review:0,problem:0,pending:0};
    records.forEach(function(x){c[x.status]=(c[x.status]||0)+1;});
    return c;
  }
  function routineStatus(check) {
    return state.routineStatuses&&state.routineStatuses[check.title]||check.status;
  }
  function summaryDonutCard(title,caption,moduleId,records) {
    var c=countsFrom(records),p=pct(c),due=c.review+c.pending+c.problem;
    var ring="<div class='donut' style='--good:"+p.good+";--review:"+p.review+";--problem:"+p.problem+";--pending:0' aria-label='"+esc(title)+": "+due+" need action'><div class='donut-center'><strong>"+due+"</strong><span>Need action</span></div></div>";
    var target=moduleId.indexOf("student-class:")===0?"data-action='student-class' data-class='"+esc(moduleId.slice(14))+"'":moduleId.indexOf("ops:")===0?"data-action='ops-section' data-section='"+esc(moduleId.slice(4))+"'":moduleId.indexOf("routine:")===0?"data-action='routine-area' data-area='"+esc(moduleId.slice(8))+"'":"data-action='module' data-module='"+esc(moduleId)+"'";
    return "<button class='person-card operation-card' "+target+" aria-label='Open "+esc(title)+"'>"+ring+"<span class='person-name'>"+esc(title)+"</span><span class='person-role'>"+esc(caption)+"</span><span class='mini-status'><span class='mini-pill red-text'>"+c.problem+" red</span><span class='mini-pill orange-text'>"+(c.review+c.pending)+" orange</span><span class='mini-pill green-text'>"+c.good+" green</span></span><span class='card-open'>Open →</span></button>";
  }
  function ahmadSummary(heading) {
    var feeRecords=state.feeLedger.map(function(r){var b=r.schoolDue+r.transportDue-r.schoolPaid-r.transportPaid;return {status:b<=0?"good":b>5000?"problem":"review"};});
    var foodRecords=state.inventory.filter(function(x){return x.category==="Food";}).concat(state.expenses.filter(function(x){return x.category==="Food";}));
    var stockRecords=state.inventory.filter(function(x){return x.category!=="Food"&&x.category!=="Books";});
    var stationeryRecords=state.inventory.filter(function(x){return x.category==="Books"||x.category==="School stores";});
    var transportRecords=state.feeLedger.filter(function(r){return r.transportDue>0;}).map(function(r){var b=r.transportDue-r.transportPaid;return {status:b<=0?"good":b>1200?"problem":"review"};});
    var supportSet=[activeLeader("OPERATIONS")].concat(supportNames());
    var supportRecords=state.tasks.filter(function(x){return supportSet.indexOf(x.owner)>=0;}).concat(state.obligations.filter(function(x){return supportSet.indexOf(x.owner)>=0||supportSet.indexOf(x.backup)>=0;}));
    var facilityRecords=ROUTINE_CHECKS.map(function(x){return {status:routineStatus(x)};});
    var complianceRecords=state.obligations.filter(function(x){return supportSet.indexOf(x.owner)>=0;});
    return "<div class='section-head first-section'><h2>"+esc(heading||"My operations")+"</h2><small>Tap the ring or Open; each tracker opens directly</small></div><section class='people-grid operations-grid tracker-grid compact-donuts'>"+
      summaryDonutCard("Fees","Full student fee table and balances","ops:fees",feeRecords)+
      summaryDonutCard("Food & cylinders","Menu, use and stock","ops:food",foodRecords)+
      summaryDonutCard("Stock register","Kitchen, furniture and electronics","ops:stock",stockRecords)+
      summaryDonutCard("Expenses","Opex, bills and approvals","ops:expenses",state.expenses)+
      summaryDonutCard("Stationery","Books, stationery, additions and issues","ops:stationery",stationeryRecords)+
      summaryDonutCard("Transport","Routes and transport-fee balance","ops:transport",transportRecords)+
      summaryDonutCard("Facilities & garden","Daily and weekly routine checks","facilities",facilityRecords)+
      summaryDonutCard("Compliance","Owner, backup, frequency and evidence","calendar",complianceRecords)+
      summaryDonutCard("Support team","All 11 people, duties and frequency","staff",supportRecords)+
      summaryDonutCard("Messages & tasks","Questions, replies and assigned work","questions",visibleWorkThreads())+"</section>";
  }
  function yuktiSummary(heading) {
    var classRecords=CLASS_COUNTS.map(function(c,i){return {status:i===1?"review":i===6?"problem":"good"};});
    var teacherRecords=TEACHERS.map(function(t,i){return {status:i===2?"review":"good"};});
    var learningRecords=state.tasks.filter(function(x){return ["Attendance","Staff","Question","Compliance"].indexOf(x.group)>=0&&teamNamesForPerson(activeLeader("COORDINATOR")).indexOf(x.owner)>=0;});
    var studentRecords=state.students.slice(0,18).map(function(s,i){return {status:i===7?"review":"good"};});
    var complianceRecords=state.obligations.filter(function(x){return x.owner===activeLeader("COORDINATOR")||teacherNames().indexOf(x.owner)>=0;});
    return "<div class='section-head first-section'><h2>"+esc(heading||"My coordination")+"</h2><small>Tap the ring or Open; Students leads to all 9 class donuts</small></div><section class='people-grid operations-grid compact-donuts'>"+
      summaryDonutCard("Class attendance","All nine classes remain selectable","attendance",classRecords)+
      summaryDonutCard("Teachers","Coverage, presence and assigned work","staff",teacherRecords)+
      summaryDonutCard("Messages & tasks","Questions, replies and follow-up","questions",learningRecords)+
      summaryDonutCard("Students","Open 9 class donuts first","students",studentRecords)+
      summaryDonutCard("Compliance","POCSO, DPDP, owner and frequency","calendar",complianceRecords)+"</section>";
  }
  function calendarSummary() {
    var c={good:0,review:0,problem:0,pending:0};
    state.events.forEach(function(e){c[e.status]+=1;});
    return "<section class='card card-pad card-gold'><div class='calendar-card'>"+donut("calendar","Need attention",false).replace(/style='[^']*'/,"style='--good:25;--review:25;--problem:25;--pending:25'")+"<div class='calendar-copy'><p class='eyebrow'>School operating calendar</p><strong>Today is ready, with 2 checks due</strong><p>Next: Fire equipment inspection · 24 Sep</p><button class='text-button' data-action='module' data-module='calendar'>Open calendar</button></div></div>"+metricRow(c)+"</section>";
  }
  function assignedCard() {
    var tasks=visibleTasks(true),c={good:0,review:0,problem:0,pending:0};
    tasks.forEach(function(x){c[x.status]=(c[x.status]||0)+1;});
    return "<section class='card card-pad'><div class='calendar-card'>"+donut(user().name,"Need action",false)+"<div class='calendar-copy'><p class='eyebrow'>My assigned work</p><strong>"+(c.review+c.problem+c.pending)+" items need a response</strong><p>"+c.problem+" red · "+(c.review+c.pending)+" orange</p><button class='text-button' data-action='module' data-module='questions'>Open assigned work</button></div></div>"+metricRow(c)+"</section>";
  }
  function peopleForRole() {
    var v=user().view;
    if(v==="HEAD") return [[activeLeader("COORDINATOR"),"Teachers, classes and coordination",false],[activeLeader("OPERATIONS"),"Support staff, fees and inventory",false],["Soon","Unassigned future responsibility",true]];
    if(v==="COORDINATOR") return [];
    if(v==="FINANCE") return [];
    return [];
  }
  function workAreas() {
    var allowed=ACCESS[user().view]||[];
    return WORK_AREAS.filter(function(w){return allowed.indexOf(w.id)>=0;}).map(function(w){
      var count=w.id==="catalog"?(window.KVN_CATALOG||[]).length:catalogFor(w.modules).length;
      return "<button class='work-button' style='--accent:"+w.accent+"' data-action='module' data-module='"+w.id+"'><strong>"+esc(w.label)+"</strong><span>"+esc(w.caption)+" · "+count+" catalogue tasks</span></button>";
    }).join("");
  }
  function classOverview() {
    return "<div class='class-grid'>"+CLASS_COUNTS.map(function(c,i){
      var present=Math.max(0,c[1]-(i%4)); var percent=Math.round(present/c[1]*100);
      return "<button class='card class-card' data-action='attendance-class' data-class='"+esc(c[0])+"'><strong>"+esc(c[0])+"</strong><p>"+present+" of "+c[1]+" present</p><div class='progress'><span style='width:"+percent+"%'></span></div></button>";
    }).join("")+"</div>";
  }
  function ahmadOperationsFlow() {
    var operationsLeader=activeLeader("OPERATIONS"),coordinator=activeLeader("COORDINATOR");
    var rows=[
      ["Support attendance & duties","Support staff",operationsLeader,coordinator,"Swati","staff"],
      ["Fees & receipts",operationsLeader,operationsLeader,coordinator,"Swati","fees"],
      ["Stock & food","Support / Kitchen",operationsLeader,coordinator,"Swati for exception","inventory"],
      ["Expenses","Staff submits",operationsLeader,coordinator,"Swati for material spend","inventory"]
    ];
    return "<div class='section-head'><h2>Operations flow</h2><small>The app table is the browser-local synthetic record · shared Sheets are Later</small></div><div class='table-wrap flow-table'><table><thead><tr><th>Work</th><th>Entered by</th><th>Checked by</th><th>Backup</th><th>Approver</th><th>Open record</th></tr></thead><tbody>"+rows.map(function(r){return "<tr><td><strong>"+esc(r[0])+"</strong></td><td>"+esc(r[1])+"</td><td>"+esc(r[2])+"</td><td>"+esc(r[3])+"</td><td>"+esc(r[4])+"</td><td><button class='text-button' data-action='module' data-module='"+r[5]+"'>Open</button></td></tr>";}).join("")+"</tbody></table></div>";
  }
  function ahmadTrackerIndex() {
    var coordinator=activeLeader("COORDINATOR");
    var rows=[
      ["Fees Tracker","Works now","fees"],["Attendance Tracker",coordinator+"'s responsibility","attendance"],["KVN Master data (student documents)","Later · restricted vault",""] ,["KVN Transport Route","Synthetic/browser-only","transport"],
      ["Food, Groceries and Cylinder Tracker","Synthetic/browser-only","food"],["KVN Stock list","Synthetic/browser-only","stock"],["KVN Expenses","Synthetic/browser-only","expenses"],["Stationery list","Later · source access required","stationery"],
      ["Student daily attendance",coordinator+"'s responsibility","attendance"],["KVN data dashboard","Later · source access required",""] ,["Log Book","Later · shared backend",""] ,["Admission form responses",coordinator+"'s responsibility","students"],
      ["Year Long Academic Plan",coordinator+"'s responsibility","academics"],["KVN school budget","Synthetic/browser-only","expenses"]
    ];
    return "<div class='section-head'><h2>Swati's tracker index</h2><small>Same familiar list; live file links are all marked Later</small></div><div class='table-wrap'><table><thead><tr><th>Tracker</th><th>Status in this pilot</th><th>Open</th></tr></thead><tbody>"+rows.map(function(r){var isLater=r[1].indexOf("Later")===0;return "<tr><td><strong>"+esc(r[0])+"</strong></td><td><span class='status-chip "+(isLater?"pending":r[1].indexOf("Works")===0?"good":"review")+"'>"+esc(r[1])+"</span></td><td>"+(r[2]?(r[2]==="fees"?"<button class='text-button' data-action='ops-section' data-section='fees'>Open</button>":r[2]==="attendance"||r[2]==="students"||r[2]==="academics"?"<span class='small-note'>View by assigned role</span>":"<button class='text-button' data-action='ops-section' data-section='"+r[2]+"'>Open</button>"):"<span class='status-chip pending'>Later</span>")+"</td></tr>";}).join("")+"</tbody></table></div>";
  }
  function headFocus() {
    var c=countsFor("Swati"),due=c.review+c.pending+c.problem;
    return "<section class='card card-pad head-focus'><div class='head-focus-top'><div><p class='eyebrow'>My work</p><h2>Swati’s decisions only</h2><p class='subtle'>Tap your donut to open only your decisions. No teacher, substitute, fee or support task is assigned to Swati by default.</p></div><div class='action-row'><button class='primary-button' data-action='module' data-module='questions'>My reminders & messages</button><button class='secondary-button' data-action='module' data-module='people'>Assign Primary responsibilities</button></div></div><button class='self-donut-card' data-action='person' data-person='Swati'>"+donut("Swati","My decisions",false)+"<span><strong>"+(due?due+" items for you":"Nothing waiting for Swati")+"</strong><small>"+esc(activeLeader("COORDINATOR"))+" and "+esc(activeLeader("OPERATIONS"))+" decide routine work; Swati can override from Responsibilities.</small></span></button>"+metricRow(c)+"</section>";
  }
  function renderHome() {
    var u=user(), people=peopleForRole();
    var html="<main class='page'>"+pageHead(u.name+" · "+u.role,t("welcome"));
    if(u.view==="HEAD")html+=headFocus();
    else if(u.view==="FINANCE")html+=ahmadSummary();
    else if(u.view==="COORDINATOR")html+=yuktiSummary();
    else html+="<div class='summary-grid'>"+assignedCard()+"<section class='card card-pad'><p class='eyebrow'>My operating scope</p><h2>"+(u.view==="COORDINATOR"?"9 classes · 137 students · "+TEACHERS.length+" teachers":"Assigned work only")+"</h2><p class='subtle'>Only the records assigned to this role are shown.</p><div class='action-row'><button class='secondary-button' data-nav='look'>View my exceptions</button></div></section></div>";
    if(people.length){
      html+="<div class='section-head'><h2>"+t("people")+"</h2><small>Tap a person to see only their work</small></div><section class='people-grid'>"+people.map(function(p){return personCard(p[0],p[1],p[2]);}).join("")+"</section>";
    }
    if(u.view!=="HEAD"&&u.view!=="FINANCE"&&u.view!=="COORDINATOR")html+="<div class='section-head'><h2>"+t("areas")+"</h2><small>Only work assigned to this role</small></div><section class='work-grid'>"+workAreas()+"</section>";
    html+="</main>";
    renderShell(html);
  }

  function renderLook() {
    var exceptions=visibleTasks(false);
    var questions=visibleQuestions(),obligations=visibleObligations();
    var html="<main class='page'>"+pageHead("Look · "+(user().view==="HEAD"?"my decisions":"my exceptions first"),"Each role sees only the deviations it owns or supervises.");
    html+="<section class='module-summary'><div class='card stat-card'><strong>"+exceptions.length+"</strong><span>Need attention</span></div><div class='card stat-card'><strong>"+exceptions.filter(function(x){return x.status==="problem";}).length+"</strong><span>Overdue</span></div><div class='card stat-card'><strong>"+questions.filter(function(x){return x.status==="open";}).length+"</strong><span>Unanswered</span></div><div class='card stat-card'><strong>"+obligations.filter(function(x){return x.status!=="good";}).length+"</strong><span>Compliance due</span></div></section>";
    html+=statusLegend()+"<div class='section-head'><h2>Work needing attention</h2><small>Tap to see the responsible person and record</small></div><section class='exception-list'>"+exceptions.map(function(x){
      return "<article class='exception-item'><div class='exception-bar "+x.status+"'></div><div><strong>"+esc(x.title)+"</strong><p>"+esc(x.group)+" · Owner "+esc(x.owner)+" · Due "+esc(x.due)+"</p></div><button class='secondary-button' data-action='task' data-id='"+x.id+"'>Open</button></article>";
    }).join("")+"</section>";
    var week=state.dailyWork||[],weekTotals=week.reduce(function(c,d){c.good+=d.good;c.review+=d.review;c.problem+=d.problem;return c;},{good:0,review:0,problem:0});
    html+="<div class='section-head'><h2>Seven-day work record</h2><small>Completed, needs review, and overdue or blocked · synthetic browser-local records</small></div><section class='card card-pad'>"+metricRow({good:weekTotals.good,review:weekTotals.review,problem:weekTotals.problem,pending:0})+"<div class='table-wrap compact-table'><table id='weekTable'><thead><tr><th>Date</th><th>Day</th><th>Green · completed</th><th>Orange · needs review</th><th>Red · overdue or blocked</th></tr></thead><tbody>"+week.map(function(d){return "<tr><td>"+esc(d.date)+"</td><td>"+esc(d.day)+"</td><td><strong>"+d.good+"</strong></td><td><strong>"+d.review+"</strong></td><td><strong>"+d.problem+"</strong></td></tr>";}).join("")+"</tbody></table></div></section>";
    html+="</main>"; renderShell(html);
  }

  function moduleCounts() {
    var counts={};
    (window.KVN_CATALOG||[]).forEach(function(x){counts[x.module]=(counts[x.module]||0)+1;});
    return counts;
  }
  function renderMore() {
    var controls=[
      {id:"people",title:user().view==="HEAD"?"Assign responsibilities":"My team assignments",caption:"Primary, executor and backup"},
      {id:"calendar",title:"Compliance & calendar",caption:"Owner, backup, frequency and evidence · reminders Later"},
      {id:"reports",title:"Reports & audit",caption:"Corrections, receipts and history"},
      {id:"fees",title:"View fees",caption:user().view==="FINANCE"?"Record receipts and reconcile":"Read-only balances and receipts"},
      {id:"inventory",title:"View stock & funds",caption:user().view==="FINANCE"?"Add, issue, batch and reconcile":"Read-only balance, rate and value"},
      {id:"facilities",title:"Facilities & routines",caption:"Kitchen, garden, gate and safety"},
      {id:"catalog",title:"All 228 catalogue rows",caption:"Search once; each undemonstrated row says Later"}
    ].filter(function(c){return hasAccess(c.id);});
    var html="<main class='page'>"+pageHead("More · school controls","Open occasional work, responsibilities, audit and the complete catalogue.");
    html+="<section class='work-grid compact-controls'>"+controls.map(function(c){return "<button class='work-button"+(c.id==="people"?" responsibility-entry":"")+"' data-action='module' data-module='"+c.id+"'><strong>"+esc(c.title)+"</strong><span>"+esc(c.caption)+"</span></button>";}).join("")+"</section>";
    if(user().view==="FINANCE")html+="<details class='card card-pad compact-details'><summary>"+esc(activeLeader("OPERATIONS"))+"’s full tracker flow and source index</summary>"+ahmadOperationsFlow()+ahmadTrackerIndex()+"</details>";
    html+="<div class='inline-status-note capability-inline'><span class='status-chip good'>Works now</span><span>Synthetic role screens and browser-local records.</span><span class='status-chip pending'>Later</span><span>Marked beside the affected control or row—no separate backlog.</span></div>";
    html+="<section class='card card-pad card-gold compact-governance'><div><strong>PROVISIONAL PILOT</strong><p class='subtle'>No live school data. Status is never silently promoted.</p></div><button class='secondary-button' data-action='reset'>Reset synthetic data</button></section></main>";
    renderShell(html);
  }
  function render() {
    if(state.nav==="look") renderLook(); else if(state.nav==="more") renderMore(); else renderHome();
  }

  function openProfiles() {
    var options=[
      ["swati","Swati","Head · full oversight"],
      ["yukti",activeLeader("COORDINATOR"),"Coordinator · teachers and classes"],
      ["ahmad",activeLeader("OPERATIONS"),"Operations · support, fees and inventory"],
      ["teacher","Teacher A","Own-class work"],
      ["support","Support A","Assigned operational duties"]
    ];
    document.getElementById("panelContent").innerHTML=dialogHead("Synthetic role testing","Choose who is using the app","panelDialog")+"<div class='exception-list'>"+options.map(function(o){
      return "<button class='work-button' data-action='choose-profile' data-profile='"+o[0]+"'><strong>"+o[1]+"</strong><span>"+o[2]+"</span></button>";
    }).join("")+"</div><p class='small-note'>In Live, identity and permissions will come from the bound staff roster. This prototype stores only the selected test role on this device.</p>";
    panelDialog.showModal();
  }
  function openPerson(name) {
    var names=teamNamesForPerson(name),tasks=state.tasks.filter(function(x){return names.indexOf(x.owner)>=0;}),obligations=state.obligations.filter(function(x){return names.indexOf(x.owner)>=0||names.indexOf(x.backup)>=0;}),questions=state.questions.filter(function(q){return names.indexOf(q.to)>=0||names.indexOf(q.from)>=0;}),c=countsFor(name);
    var leaderWorkspace=name===activeLeader("COORDINATOR")?yuktiSummary(name+" · classes and teachers"):name===activeLeader("OPERATIONS")?ahmadSummary(name+" · support and operations"):"";
    document.getElementById("panelContent").innerHTML=dialogHead("Responsibility view",name,"panelDialog")+
      leaderWorkspace+
      "<section class='card card-pad'><div class='calendar-card'>"+donut(name,"Need action",name==="Soon")+"<div><h3>"+(tasks.length+obligations.length?tasks.length+obligations.length+" tasks and compliances":"No responsibility assigned yet")+"</h3><p class='subtle'>This detail opens only after you choose the person. It includes work through their team.</p></div></div>"+metricRow(c)+"</section>"+
      "<div class='section-head'><h2>Tasks</h2><small>Responsible person and next action</small></div>"+
      (tasks.length?"<div class='exception-list'>"+tasks.map(function(x){return "<article class='exception-item'><div class='exception-bar "+x.status+"'></div><div><strong>"+esc(x.title)+"</strong><p>Responsible: "+esc(x.owner)+" · "+esc(x.group)+" · Due "+esc(x.due)+"</p></div><button class='secondary-button' data-action='task' data-id='"+x.id+"'>Open</button></article>";}).join("")+"</div>":"<div class='empty-state'><strong>Ready for a future assignment</strong>Swati can assign a Primary responsibility.</div>")+
      "<div class='section-head'><h2>Compliance</h2><small>Owner, backup, evidence and status</small></div>"+(obligations.length?"<div class='exception-list'>"+obligations.map(function(o){return "<article class='exception-item'><div class='exception-bar "+o.status+"'></div><div><strong>"+esc(o.title)+"</strong><p>Owner "+esc(o.owner)+" · Backup "+esc(o.backup)+" · Due "+esc(o.due)+"</p></div><button class='secondary-button' data-action='obligation' data-id='"+o.id+"'>Open</button></article>";}).join("")+"</div>":"<div class='empty-state'><strong>No compliance item assigned</strong></div>")+
      "<div class='section-head'><h2>Questions and replies</h2><small>Original wording is preserved</small></div>"+(questions.length?"<div class='audit-list'>"+questions.map(function(q){return "<div class='audit-row'><time>"+esc(q.from)+" → "+esc(q.to)+"</time><div><strong>"+esc(q.question)+"</strong><br><span class='small-note'>"+(q.answer?esc(q.answer):"Awaiting reply")+"</span></div></div>";}).join("")+"</div>":"<div class='empty-state'><strong>No questions</strong></div>")+
      (user().view==="HEAD"?"<div class='action-row'><button class='primary-button' data-action='module' data-module='people'>Assign Primary responsibilities</button></div>":"");
    panelDialog.showModal();
  }
  function hasAccess(moduleId) {
    if(moduleId==="people") return user().view==="HEAD"||user().view==="COORDINATOR"||user().view==="FINANCE";
    return (ACCESS[user().view]||[]).indexOf(moduleId)>=0;
  }
  function deny(moduleId) {
    audit("Denied unauthorised access to "+moduleId);
    document.getElementById("panelContent").innerHTML=dialogHead("Permission boundary","This work is not assigned to "+user().name,"panelDialog")+"<div class='locked-note'>The screen is blocked by role authority. Hiding a button alone is not treated as permission.</div><p class='subtle'>Ask the Primary owner or an authorised temporary delegate. Swati can change assignments from Roles & responsibilities.</p>";
    panelDialog.showModal();
  }
  function openModule(id) {
    if(!hasAccess(id)){deny(id);return;}
    activeModule=id;
    var title=(WORK_AREAS.find(function(w){return w.id===id;})||{label:"Roles & responsibilities"}).label;
    if(id==="staff"&&user().view==="FINANCE")title="Support team";
    if(id==="staff"&&user().view==="COORDINATOR")title="Teachers";
    if(id==="people"&&user().view==="HEAD")title="Assign Primary responsibilities";
    if(id==="people"&&(user().view==="FINANCE"||user().view==="COORDINATOR"))title="Assign work within my team";
    document.getElementById("panelContent").innerHTML=dialogHead("Synthetic working flow",title,"panelDialog")+moduleBody(id);
    panelDialog.showModal();
    document.querySelectorAll("[data-report-query]").forEach(function(el){applyReportFilter(el.dataset.reportQuery);});
  }
  function moduleBody(id) {
    if(id==="attendance") return attendanceBody();
    if(id==="students") return studentsBody();
    if(id==="fees") return feesBody();
    if(id==="staff") return staffBody();
    if(id==="inventory") return inventoryBody();
    if(id==="calendar") return calendarBody();
    if(id==="people") return responsibilitiesBody();
    if(id==="questions") return questionsBody();
    if(id==="reports") return reportsBody();
    if(id==="catalog") return catalogBody("");
    if(id==="facilities") return facilitiesBody();
    if(id==="academics") return genericBody(["Academics","Learning portfolio","Progress","Learning planning","Assessment"]);
    if(id==="parents") return genericBody(["Parents","Communications","Feedback"]);
    return genericBody([]);
  }
  function attendanceBody() {
    var rows=state.students.filter(function(s){return s.className===state.attendanceClass&&s.active;});
    var saved=state.attendance[state.attendanceClass]||{},editable=canMarkStudentAttendance();
    return (!editable?"<div class='locked-note'><strong>View only.</strong> Student attendance is marked by the assigned teacher or Coordinator.</div>":"")+"<form id='attendanceForm' class='stack-form'><label for='classSelect'>Class</label><select id='classSelect' name='className' data-action='change-class'>"+CLASS_COUNTS.map(function(c){return "<option "+(c[0]===state.attendanceClass?"selected":"")+">"+esc(c[0])+"</option>";}).join("")+"</select><p class='field-hint'>The selector always comes from the authoritative nine-class master.</p><div class='attendance-list'>"+rows.map(function(s){return "<label class='check-row'><input type='checkbox' name='present' value='"+s.id+"' "+(saved[s.id]!==false?"checked":"")+" "+(editable?"":"disabled")+"><span>"+esc(s.name)+"</span></label>";}).join("")+"</div>"+(editable?"<button class='primary-button' type='submit'>Save "+esc(state.attendanceClass)+" attendance</button>":"")+"<p class='field-hint'>Repeated taps cannot create a duplicate submission. Corrections retain audit history.</p></form>";
  }
  function studentsBody() {
    var classFirst=user().view==="COORDINATOR"||user().view==="HEAD";
    if(classFirst&&!state.studentClassView){
      return "<section class='module-summary two-summary'><div class='card stat-card'><strong>137</strong><span>Total students</span></div><div class='card stat-card'><strong>9</strong><span>Classes</span></div></section><div class='section-head'><h2>Students by class</h2><small>Teacher and class total first; list opens after the class is chosen</small></div><section class='people-grid class-donut-grid'>"+CLASS_COUNTS.map(function(c,i){var records=state.students.filter(function(s){return s.className===c[0];}).map(function(s,j){return {status:j===i%5?"review":"good"};});return summaryDonutCard(c[0],CLASS_TEACHERS[c[0]]+" · "+c[1]+" students","student-class:"+c[0],records);}).join("")+"</section>";
    }
    var selected=classFirst?state.studentClassView:"",addControl=canManageStudents()?"<button class='primary-button' data-action='add-student'>Add student</button>":"";
    return (selected?"<div class='class-list-head'><button class='secondary-button' data-action='student-classes'>← Back to classes</button><div><strong>"+esc(selected)+"</strong><span>Class teacher: "+esc(CLASS_TEACHERS[selected])+" · "+state.students.filter(function(s){return s.className===selected&&s.active;}).length+" students</span></div></div>":"")+"<div class='catalog-toolbar'><input id='studentSearch' type='search' placeholder='Search student, class or ID' aria-label='Search students'>"+addControl+"</div><p class='field-hint'>137 authoritative synthetic students across all nine classes.</p><div id='studentResults' class='table-wrap'>"+studentRows("",selected)+"</div>";
  }
  function studentRows(q,className) {
    q=String(q||"").toLowerCase();
    var rows=state.students.filter(function(s){return (!className||s.className===className)&&(!q||[s.id,s.name,s.className].join(" ").toLowerCase().indexOf(q)>=0);}).slice(0,30);
    return "<table><thead><tr><th>ID</th><th>Student</th><th>Class</th><th>Status</th></tr></thead><tbody>"+rows.map(function(s){return "<tr><td>"+s.id+"</td><td>"+esc(s.name)+"</td><td>"+esc(s.className)+"</td><td>"+(s.active?statusChip("good"):statusChip("pending"))+"</td></tr>";}).join("")+"</tbody></table>";
  }
  function feesBody() {
    var due=0,paid=0;state.feeLedger.forEach(function(r){due+=r.schoolDue+r.transportDue;paid+=r.schoolPaid+r.transportPaid;});
    function statuses(kind){return state.feeLedger.map(function(r){var d=kind==="school"?r.schoolDue:kind==="transport"?r.transportDue:kind==="donation"?r.donation*3:r.schoolDue+r.transportDue;var p=kind==="school"?r.schoolPaid:kind==="transport"?r.transportPaid:kind==="donation"?Math.min(r.schoolPaid,r.donation*3):r.schoolPaid+r.transportPaid;return {status:d===0||p>=d?"good":p===0?"problem":"review"};});}
    var mutationControls=canMutateOperations()?"<button class='primary-button' data-action='new-receipt'>Record fee receipt</button><button class='secondary-button' data-action='batch-fees'>Batch fee entry</button>":"<span class='status-chip review'>View only · Operations records receipts</span>";
    var feeFilter=state.feeFilter||{},classes=uniqueValues(state.feeLedger.map(function(r){return r.className;})),slabs=uniqueValues(state.feeLedger.map(function(r){return r.slab;}));
    return recordSourceNote()+"<section class='people-grid operations-grid fee-type-grid'>"+
      summaryDonutCard("School fee","Base fee paid, part-paid or unpaid","ops:fees",statuses("school"))+
      summaryDonutCard("Donation","Donation component by slab","ops:fees",statuses("donation"))+
      summaryDonutCard("Transport fee","Route fee paid, part-paid or unpaid","ops:transport",statuses("transport"))+
      summaryDonutCard("Total collection","Combined balance and follow-up","ops:fees",statuses("total"))+"</section>"+
      "<section class='module-summary'><div class='card stat-card'><strong>"+currency(due)+"</strong><span>Total charged through September</span></div><div class='card stat-card'><strong>"+currency(paid)+"</strong><span>Paid</span></div><div class='card stat-card'><strong>"+currency(Math.max(0,due-paid))+"</strong><span>Balance</span></div><div class='card stat-card'><strong>"+state.feeLedger.length+"</strong><span>Students</span></div></section><div class='action-row'>"+mutationControls+"<button class='secondary-button' data-action='export-fees'>Export fee table for Excel</button></div>"+
      "<div class='section-head'><h2>Fee account by student</h2><small>Compact mobile view first · 25 rows per page</small></div><div class='report-filters fee-filters'><label class='report-search'><span>Find as you type</span><input id='feeSearch' type='search' value='"+esc(feeFilter.query||"")+"' placeholder='Student, ID, class or village'><small>Searches all 137 students</small></label><label><span>Class</span><select id='feeClassFilter'><option value=''>All classes</option>"+classes.map(function(value){return "<option "+(feeFilter.className===value?"selected":"")+">"+esc(value)+"</option>";}).join("")+"</select></label><label><span>Slab</span><select id='feeSlabFilter'><option value=''>All slabs</option>"+slabs.map(function(value){return "<option "+(feeFilter.slab===value?"selected":"")+">"+esc(value)+"</option>";}).join("")+"</select></label><label><span>Balance status</span><select id='feeStatusFilter'><option value=''>All statuses</option><option value='good' "+(feeFilter.status==="good"?"selected":"")+">Paid</option><option value='review' "+(feeFilter.status==="review"?"selected":"")+">Part paid</option><option value='problem' "+(feeFilter.status==="problem"?"selected":"")+">Unpaid / high balance</option></select></label></div><div class='action-row'><button class='secondary-button' data-action='toggle-fee-columns'>"+(state.feeExpanded?"Use compact mobile columns":"Show full monthly columns")+"</button></div><div id='feeResults' class='table-wrap familiar-table fee-table-wrap'>"+feeTableRows()+"</div><div class='section-head'><h2>Recent receipts</h2><small>School and transport stay separate; corrections use contra</small></div>"+(state.receipts.length?"<div class='audit-list'>"+state.receipts.map(function(r){return "<div class='audit-row'><time>"+esc(r.id)+"</time><div><strong>"+esc(r.student)+" · "+currency(r.school+r.transport)+" "+(r.reversed?"· REVERSED":"")+"</strong><br><span class='small-note'>"+esc(r.schoolCategory||"School")+" "+currency(r.school)+" · "+esc(r.transportCategory||"Transport")+" "+currency(r.transport)+" · "+esc(r.mode||"Training")+" · "+esc(r.reference||"No reference")+"</span>"+(canMutateOperations()&&!r.reversed?"<br><button class='text-button' data-action='reverse-receipt' data-receipt-id='"+esc(r.id)+"'>Reverse with audit</button>":"")+"</div></div>";}).join("")+"</div>":"<div class='empty-state'><strong>No new synthetic receipts</strong>Use Record fee receipt to test the full flow.</div>");
  }
  function feeRowStatus(r){var balance=Math.max(0,r.schoolDue+r.transportDue-r.schoolPaid-r.transportPaid);return balance===0?"good":balance>r.totalFees?"problem":"review";}
  function feeTableRows() {
    var filter=state.feeFilter||{},query=String(filter.query||"").toLowerCase(),months=["July","August","September","October","November","December","January","February","March","April"],pageSize=25;
    var filtered=state.feeLedger.filter(function(r){return (!query||[r.id,r.student,r.className,r.slab,r.village].join(" ").toLowerCase().indexOf(query)>=0)&&(!filter.className||r.className===filter.className)&&(!filter.slab||r.slab===filter.slab)&&(!filter.status||feeRowStatus(r)===filter.status);});
    var pages=Math.max(1,Math.ceil(filtered.length/pageSize));state.feePage=Math.min(Math.max(1,state.feePage||1),pages);var start=(state.feePage-1)*pageSize,rows=filtered.slice(start,start+pageSize);
    var compactHead="<tr><th>Child's Name</th><th>Current Grade</th><th>Total Fees</th><th>Paid</th><th>Balance</th></tr>",fullHead="<tr><th>Sr.No.</th><th>Child's Name</th><th>Father's Name</th><th>Mobile Number</th><th>Admission Year</th><th>Grade</th><th>Current Grade</th><th>Sex</th><th>Ethnicity</th><th>Service</th><th>Village Name</th><th>Slab</th><th>Base Fees</th><th>Donation Amount</th><th>Transport Fees</th><th>Total Fees</th>"+months.map(function(m){return "<th>"+m+"</th>";}).join("")+"<th>Paid</th><th>Balance</th></tr>";
    var body=rows.map(function(r){var balance=Math.max(0,r.schoolDue+r.transportDue-r.schoolPaid-r.transportPaid),rowStatus=feeRowStatus(r);if(!state.feeExpanded)return "<tr data-status='"+rowStatus+"'><td><strong>"+esc(r.student)+"</strong><br><span class='small-note'>"+esc(r.id)+"</span></td><td>"+esc(r.currentGrade)+"</td><td>"+currency(r.totalFees)+"</td><td>"+currency(r.schoolPaid+r.transportPaid)+"</td><td>"+statusChip(rowStatus)+"<br>"+currency(balance)+"</td></tr>";return "<tr data-status='"+rowStatus+"'><td>"+esc(r.id)+"</td><td><strong>"+esc(r.student)+"</strong></td><td>"+esc(r.father)+"</td><td>"+esc(r.mobile)+"</td><td>"+esc(r.admissionYear)+"</td><td>"+esc(r.className)+"</td><td>"+esc(r.currentGrade)+"</td><td>"+esc(r.sex)+"</td><td>"+esc(r.ethnicity)+"</td><td>"+esc(r.service)+"</td><td>"+esc(r.village)+"</td><td>"+esc(r.slab)+"</td><td>"+currency((r.schoolDue/3)-r.donation)+"</td><td>"+currency(r.donation)+"</td><td>"+currency(r.transportDue/3)+"</td><td>"+currency(r.totalFees)+"</td>"+months.map(function(m){return "<td>"+(r.months[m]?currency(r.months[m]):"—")+"</td>";}).join("")+"<td>"+currency(r.schoolPaid+r.transportPaid)+"</td><td>"+statusChip(rowStatus)+"<br>"+currency(balance)+"</td></tr>";}).join("");
    return "<table id='feeTable' class='"+(state.feeExpanded?"fee-expanded":"fee-compact")+"'><thead>"+(state.feeExpanded?fullHead:compactHead)+"</thead><tbody>"+body+"</tbody></table><div class='pager'><span>"+(filtered.length?start+1:0)+"–"+Math.min(start+pageSize,filtered.length)+" of "+filtered.length+"</span><button class='secondary-button' data-action='fee-page' data-page='"+(state.feePage-1)+"' "+(state.feePage<=1?"disabled":"")+">Previous</button><button class='secondary-button' data-action='fee-page' data-page='"+(state.feePage+1)+"' "+(state.feePage>=pages?"disabled":"")+">Next</button></div>";
  }
  function staffBody() {
    var roster=user().view==="FINANCE"?SUPPORT_STAFF:user().view==="COORDINATOR"?TEACHERS:STAFF;
    var title=user().view==="FINANCE"?"Support team under "+activeLeader("OPERATIONS"):user().view==="COORDINATOR"?"Teachers coordinated by "+activeLeader("COORDINATOR"):"Complete staff register";
    var isSupport=user().view==="FINANCE",present=roster.filter(function(s){return state.supportAttendance[s[0]]!==false;}).length;
    var attendanceForm=isSupport?"<form id='supportAttendanceForm' class='stack-form support-attendance'><div class='section-head'><h2>Support attendance today</h2><small>"+esc(activeLeader("OPERATIONS"))+"’s team only · student attendance remains with "+esc(activeLeader("COORDINATOR"))+"/teachers</small></div><div class='attendance-list'>"+roster.map(function(s){return "<label class='check-row'><input type='checkbox' name='presentSupport' value='"+esc(s[0])+"' "+(state.supportAttendance[s[0]]!==false?"checked":"")+"><span>"+esc(s[0])+" · "+esc(s[1])+"</span></label>";}).join("")+"</div><button class='primary-button' type='submit'>Save support attendance</button><p class='field-hint'>Corrections create a new audit entry; they do not erase the earlier save.</p></form>":"";
    return "<div class='locked-note'><strong>"+title+".</strong> "+(isSupport?"All 11 support people are shown with their regular duty and attendance. The Coordinator backs the Operations leader, not every worker.":user().view==="COORDINATOR"?"Only the teacher team is shown.":"This register follows the selected role boundary.")+"</div>"+(isSupport?"<div class='inline-status-note'><span class='status-chip review'>Synthetic names</span><span>Replacing these labels with the approved staff roster is <strong>Later</strong>.</span></div>":"")+"<div class='module-summary three-summary'><div class='card stat-card'><strong>"+roster.length+"</strong><span>Visible staff</span></div><div class='card stat-card'><strong>"+present+"</strong><span>Present today</span></div><div class='card stat-card'><strong>"+(roster.length-present)+"</strong><span>Absent / review</span></div></div>"+attendanceForm+reportFilterBar("staffTable","Person, role or duty",[{key:"role",label:"Role",values:roster.map(function(s){return s[1];})},{key:"frequency",label:"Frequency",values:roster.map(function(s){return (SUPPORT_DUTIES[s[0]]||["","As assigned"])[1];})}])+"<div class='table-wrap'><table id='staffTable'><thead><tr><th>Person</th><th>Role</th><th>Today</th><th>Reports to</th><th>Regular duty</th><th>Frequency</th></tr></thead><tbody>"+roster.map(function(s){var assigned=state.responsibilities.filter(function(r){return r.assignee===s[0];}).map(function(r){return r.area;}),duty=SUPPORT_DUTIES[s[0]]||[(assigned.length?assigned.join(", "):"Assigned class work"),"As assigned"],rowStatus=isSupport&&state.supportAttendance[s[0]]===false?"review":"good";return "<tr data-status='"+rowStatus+"' data-role='"+esc(s[1])+"' data-frequency='"+esc(duty[1])+"'><td><strong>"+esc(s[0])+"</strong></td><td>"+esc(s[1])+"</td><td>"+statusChip(rowStatus)+"</td><td>"+(isSupport?esc(activeLeader("OPERATIONS")):s[1]==="Class Teacher"?esc(activeLeader("COORDINATOR")):"Head")+"</td><td>"+esc(duty[0])+"</td><td>"+esc(duty[1])+"</td></tr>";}).join("")+"</tbody></table></div>";
  }
  function operationsNav(active) {
    var sections=[["overview","Overview"],["food","Food & cylinders"],["stock","Stock register"],["expenses","Expenses"],["stationery","Stationery"],["transport","Transport"]];
    return "<div class='segmented tracker-tabs'>"+sections.map(function(s){return "<button class='"+(active===s[0]?"active":"")+"' data-action='ops-section' data-section='"+s[0]+"'>"+esc(s[1])+"</button>";}).join("")+"</div>";
  }
  function foodTrackerBody() {
    var foodAction=canMutateOperations()?"<button class='primary-button' data-action='food-entry'>Add daily food record</button>":"<span class='status-chip review'>View only</span>";
    return recordSourceNote()+operationsNav("food")+"<div class='action-row'>"+foodAction+"</div><div class='section-head'><h2>Food and groceries daily tracker</h2><small>Familiar headings from Swati's September tracker · synthetic rows</small></div>"+reportFilterBar("foodTable","Date, menu or ingredient",[{key:"day",label:"Day",values:state.foodLog.map(function(x){return x.day;})},{key:"menu",label:"Menu",values:state.foodLog.map(function(x){return x.menu;})}])+"<div class='table-wrap familiar-table'><table id='foodTable'><thead><tr><th>Date</th><th>Day</th><th>Attendance</th><th>Menu</th><th>Oil</th><th>Toor Daal</th><th>Rice</th><th>Sabzi</th><th>Roti</th><th>Poha</th><th>Kabuli Chana</th><th>Besan</th><th>Curd</th><th>Oil in Dough</th><th>Status</th></tr></thead><tbody>"+state.foodLog.map(function(x){return "<tr data-status='"+esc(x.status)+"' data-day='"+esc(x.day)+"' data-menu='"+esc(x.menu)+"'><td>"+esc(x.date)+"</td><td>"+esc(x.day)+"</td><td>"+esc(x.attendance)+"</td><td>"+esc(x.menu)+"</td><td>"+esc(x.oil)+"</td><td>"+esc(x.toor)+"</td><td>"+esc(x.rice)+"</td><td>"+esc(x.vegetables)+"</td><td>"+esc(x.roti)+"</td><td>"+esc(x.poha)+"</td><td>"+esc(x.chana)+"</td><td>"+esc(x.besan)+"</td><td>"+esc(x.curd)+"</td><td>"+esc(x.doughOil)+"</td><td>"+statusChip(x.status)+"</td></tr>";}).join("")+"</tbody></table></div><div class='later-inline'><span class='status-chip pending'>Later</span><strong>Cylinder supplier file and bill links</strong><span>after secure Drive connection</span></div>";
  }
  function stockTrackerBody(section) {
    var rows=state.inventory.filter(function(x){return section==="stationery"?(x.category==="Books"||x.category==="School stores"):(x.category!=="Books");});
    var totalQty=rows.reduce(function(n,x){return n+Number(x.qty||0);},0),totalValue=rows.reduce(function(n,x){return n+inventoryValue(x);},0),low=rows.filter(function(x){return x.status!=="good";}).length;
    var actionControls=canMutateOperations()?"<button class='primary-button' data-action='quick-inventory'>Add or issue stock</button><button class='secondary-button' data-action='batch-inventory'>Batch stock entry</button><button class='secondary-button' data-action='inventory-entry'>New item</button>":"<span class='status-chip review'>View only · Operations records stock movements</span>";
    return recordSourceNote()+operationsNav(section)+"<section class='module-summary three-summary'><div class='card stat-card'><strong>"+rows.length+"</strong><span>Items</span></div><div class='card stat-card'><strong>"+totalQty.toLocaleString("en-IN")+"</strong><span>Total balance quantity</span></div><div class='card stat-card'><strong>"+currency(totalValue)+"</strong><span>Balance value · "+low+" need action</span></div></section><div class='action-row'>"+actionControls+"</div><div class='section-head'><h2>"+(section==="stationery"?"Books and stationery":"Stock register")+"</h2><small>Search as you type or select category/colour; item details open from the same row</small></div>"+reportFilterBar("stockTable","Start typing an item name, category or remark",[{key:"category",label:"Category",values:rows.map(function(x){return x.category;})}])+"<div class='table-wrap familiar-table'><table id='stockTable'><thead><tr><th>S. N.</th><th>Item name</th><th>Category</th><th>Balance qty</th><th>Average rate</th><th>Balance value</th><th>Status</th><th>Action</th></tr></thead><tbody>"+rows.map(function(x,i){var rowActions=canMutateOperations()?"<div class='row-actions'><button class='text-button' data-action='inventory-move' data-kind='Add' data-item='"+esc(x.item)+"'>Add</button><button class='text-button' data-action='inventory-move' data-kind='Issue' data-item='"+esc(x.item)+"'>Issue</button></div>":"<span class='small-note'>View only</span>";return "<tr data-status='"+esc(x.status)+"' data-category='"+esc(x.category)+"'><td>"+(i+1)+"</td><td><button class='item-link' data-action='inventory-item' data-item='"+esc(x.item)+"'>"+esc(x.item)+"</button></td><td>"+esc(x.category)+"</td><td><strong>"+Number(x.qty||0).toLocaleString("en-IN")+"</strong></td><td>"+rateMoney(x.avgRate)+"</td><td><strong>"+currency(inventoryValue(x))+"</strong></td><td>"+statusChip(x.status)+"</td><td>"+rowActions+"</td></tr>";}).join("")+"</tbody></table></div>"+(section==="stationery"?"<div class='later-inline'><span class='status-chip pending'>Later</span><strong>Connected source file</strong><span>the exact live Stationery Sheet link is not connected</span></div>":"");
  }
  function expenseTrackerBody() {
    var expenseActions=canMutateOperations()?"<button class='primary-button' data-action='fund-entry'>Add funds received</button><button class='primary-button' data-action='expense-entry'>Add expense</button>":"<span class='status-chip review'>View only</span>";
    return recordSourceNote()+operationsNav("expenses")+"<div class='action-row'>"+expenseActions+"</div><div class='section-head'><h2>Expense register</h2><small>Familiar September expense headings · synthetic rows</small></div>"+reportFilterBar("expenseTable","Item, person, vendor or category",[{key:"category",label:"Category",values:state.expenses.map(function(x){return x.category;})},{key:"person",label:"Person",values:state.expenses.map(function(x){return x.person;})}])+"<div class='table-wrap familiar-table'><table id='expenseTable'><thead><tr><th>Sr.No</th><th>Date</th><th>Item</th><th>Cross Check</th><th>Quantity</th><th>Price</th><th>RM</th><th>Vendor</th><th>Account Holder Name</th><th>Category</th><th>Mode</th><th>Comments</th><th>Status</th><th>Link</th></tr></thead><tbody>"+state.expenses.map(function(x,i){return "<tr data-status='"+esc(x.status)+"' data-category='"+esc(x.category)+"' data-person='"+esc(x.person)+"'><td>"+(i+1)+"</td><td>"+esc(x.at)+"</td><td><strong>"+esc(x.detail)+"</strong></td><td>"+(x.status==="good"?"✓":"—")+"</td><td>"+esc(x.quantity||"—")+"</td><td>"+currency(x.amount)+"</td><td>"+esc(x.person)+"</td><td>"+esc(x.vendor||"—")+"</td><td>"+esc(x.accountHolder||"—")+"</td><td>"+esc(x.category)+"</td><td>"+esc(x.mode||"—")+"</td><td>"+esc(x.comments||"—")+"</td><td>"+statusChip(x.status)+"</td><td><span class='status-chip pending'>Later</span></td></tr>";}).join("")+"</tbody></table></div>";
  }
  function transportTrackerBody() {
    var transportAction=canMutateOperations()?"<button class='primary-button' data-action='transport-entry'>Add or update transport assignment</button>":"<span class='status-chip review'>View only</span>";
    return recordSourceNote()+operationsNav("transport")+"<div class='action-row'>"+transportAction+"</div><div class='section-head'><h2>Transport route register</h2><small>Familiar route-chart columns · all 137 synthetic students</small></div>"+reportFilterBar("transportTable","Child, class, village, vehicle or driver",[{key:"grade",label:"Class",values:state.transportRoster.map(function(x){return x.grade;})},{key:"vehicle",label:"Vehicle",values:state.transportRoster.map(function(x){return x.vehicle;})}])+"<div class='table-wrap familiar-table'><table id='transportTable'><thead><tr><th>Sr.No</th><th>Child Name</th><th>Father's Name</th><th>Grade</th><th>Sex</th><th>Village</th><th>Mobile Number</th><th>Time Slot</th><th>Vehicle</th><th>Driver</th><th>Status</th></tr></thead><tbody>"+state.transportRoster.map(function(x){return "<tr data-status='"+esc(x.status)+"' data-grade='"+esc(x.grade)+"' data-vehicle='"+esc(x.vehicle)+"'><td>"+x.id+"</td><td><strong>"+esc(x.student)+"</strong></td><td>"+esc(x.father)+"</td><td>"+esc(x.grade)+"</td><td>"+esc(x.sex)+"</td><td>"+esc(x.village)+"</td><td>"+esc(x.mobile)+"</td><td>"+esc(x.timeSlot)+"</td><td>"+esc(x.vehicle)+"</td><td>"+esc(x.driver)+"</td><td>"+statusChip(x.status)+"</td></tr>";}).join("")+"</tbody></table></div>";
  }
  function inventoryBody() {
    var section=state.operationsSection||"overview";
    if(section==="food")return foodTrackerBody();
    if(section==="stock"||section==="stationery")return stockTrackerBody(section);
    if(section==="expenses")return expenseTrackerBody();
    if(section==="transport")return transportTrackerBody();
    var received=state.fundLedger.filter(function(x){return x.amount>0;}).reduce(function(n,x){return n+x.amount;},0);
    var used=Math.abs(state.fundLedger.filter(function(x){return x.amount<0&&x.status==="good";}).reduce(function(n,x){return n+x.amount;},0));
    var committed=Math.abs(state.fundLedger.filter(function(x){return x.amount<0&&x.status!=="good";}).reduce(function(n,x){return n+x.amount;},0));
    var available=received-used-committed;
    var materials=state.inventory.filter(function(x){return x.category!=="Books";});
    var books=state.inventory.filter(function(x){return x.category==="Books";});
    function stockRows(rows){return rows.map(function(x){var actions=canMutateOperations()?"<button class='text-button' data-action='inventory-move' data-kind='Add' data-item='"+esc(x.item)+"'>Add</button> <button class='text-button' data-action='inventory-move' data-kind='Issue' data-item='"+esc(x.item)+"'>Issue</button>":"<span class='small-note'>View only</span>";return "<tr><td><button class='item-link' data-action='inventory-item' data-item='"+esc(x.item)+"'>"+esc(x.item)+"</button></td><td>"+esc(x.category)+"</td><td>"+x.qty+"</td><td>"+rateMoney(x.avgRate)+"</td><td>"+currency(inventoryValue(x))+"</td><td>"+statusChip(x.status)+"</td><td>"+actions+"</td></tr>";}).join("");}
    var operationsActions=canMutateOperations()?"<button class='primary-button' data-action='quick-inventory'>Quick add / issue</button><button class='secondary-button' data-action='batch-inventory'>Batch stock entry</button><button class='secondary-button' data-action='inventory-entry'>New item</button><button class='secondary-button' data-action='fund-entry'>Add funds</button><button class='secondary-button' data-action='expense-entry'>Add expense</button>":"<span class='status-chip review'>View only · "+esc(activeLeader("OPERATIONS"))+" records money and stock</span>";
    return recordSourceNote()+operationsNav("overview")+"<section class='module-summary'><div class='card stat-card'><strong>"+currency(received)+"</strong><span>Funds received</span></div><div class='card stat-card'><strong>"+currency(used)+"</strong><span>Used</span></div><div class='card stat-card'><strong>"+currency(committed)+"</strong><span>Committed</span></div><div class='card stat-card'><strong>"+currency(available)+"</strong><span>Available</span></div></section>"+
      "<div class='action-row'>"+operationsActions+"<button class='secondary-button' data-action='export-inventory'>Export</button></div>"+
      "<div class='section-head'><h2>Funds register</h2><small>Received, used, committed and available</small></div><div class='table-wrap'><table><thead><tr><th>ID / date</th><th>Entry</th><th>Source or purpose</th><th>Amount</th><th>Person</th><th>Status</th></tr></thead><tbody>"+state.fundLedger.map(function(f){return "<tr><td>"+esc(f.id)+"<br><span class='small-note'>"+esc(f.at)+"</span></td><td>"+esc(f.type)+"</td><td>"+esc(f.source)+"<br><span class='small-note'>"+esc(f.reference)+"</span></td><td>"+currency(f.amount)+"</td><td>"+esc(f.person)+"</td><td>"+statusChip(f.status)+"</td></tr>";}).join("")+"</tbody></table></div>"+
      "<div class='section-head'><h2>Materials, food and consumables</h2><small>Balance, average rate and value after every movement</small></div><div class='table-wrap'><table><thead><tr><th>Item</th><th>Category</th><th>Balance qty</th><th>Average rate</th><th>Balance value</th><th>Status</th><th>Action</th></tr></thead><tbody>"+stockRows(materials)+"</tbody></table></div>"+
      "<div class='section-head'><h2>Books and stationery inventory</h2><small>Additions and issues are retained below</small></div><div class='table-wrap'><table><thead><tr><th>Item</th><th>Category</th><th>Balance qty</th><th>Average rate</th><th>Balance value</th><th>Status</th><th>Action</th></tr></thead><tbody>"+stockRows(books)+"</tbody></table></div>"+
      "<div class='section-head'><h2>Purchases, additions and issues</h2><small>Every movement retains quantity, rate, value and resulting balance</small></div><div class='table-wrap'><table><thead><tr><th>ID / date</th><th>Item</th><th>Movement</th><th>In qty</th><th>Out qty</th><th>Rate</th><th>Value</th><th>Balance qty</th><th>Recorded by / reason</th></tr></thead><tbody>"+state.inventoryMovements.map(function(m){var incoming=m.direction==="Received";return "<tr><td>"+esc(m.id)+"<br><span class='small-note'>"+esc(m.at)+"</span></td><td><button class='item-link' data-action='inventory-item' data-item='"+esc(m.item)+"'>"+esc(m.item)+"</button><br><span class='small-note'>"+esc(m.category||"Other")+"</span></td><td>"+esc(m.kind||m.direction)+"</td><td>"+(incoming?m.qty:"—")+"</td><td>"+(incoming?"—":m.qty)+"</td><td>"+rateMoney(m.rate)+"</td><td>"+currency(m.amount||0)+"</td><td>"+esc(m.balanceAfter==null?"—":m.balanceAfter)+"</td><td>"+esc(m.person)+"<br><span class='small-note'>"+esc(m.reason)+"</span></td></tr>";}).join("")+"</tbody></table></div>"+
      "<div class='section-head'><h2>Food and operating expenses</h2><small>Every entry links to the funds register</small></div><div class='table-wrap'><table><thead><tr><th>ID / date</th><th>Category</th><th>Detail</th><th>Amount</th><th>Entered by</th><th>Status</th></tr></thead><tbody>"+state.expenses.map(function(x){return "<tr><td>"+esc(x.id)+"<br><span class='small-note'>"+esc(x.at)+"</span></td><td>"+esc(x.category)+"</td><td>"+esc(x.detail)+"</td><td>"+currency(x.amount)+"</td><td>"+esc(x.person)+"</td><td>"+statusChip(x.status)+"</td></tr>";}).join("")+"</tbody></table></div>";
  }
  function calendarBody() {
    var names=roleTeamNames(),rows=user().view==="HEAD"?state.obligations:state.obligations.filter(function(o){return names.indexOf(o.owner)>=0||names.indexOf(o.backup)>=0;});
    return "<div class='action-row'><button class='primary-button' data-action='add-event'>Add synthetic event</button><button class='secondary-button later-button' disabled><span class='status-chip pending'>Later</span> Calendar / message reminders</button></div><div class='section-head'><h2>Upcoming</h2><small>Saved on this browser only; no reminder is sent</small></div><div class='exception-list compact-list'>"+state.events.filter(function(e){return user().view==="HEAD"||names.indexOf(e.owner)>=0;}).map(function(e){return "<article class='exception-item'><div class='exception-bar "+e.status+"'></div><div><strong>"+esc(e.title)+"</strong><p>"+esc(e.date)+" · Owner "+esc(e.owner)+"</p></div>"+statusChip(e.status)+"</article>";}).join("")+"</div><div class='section-head'><h2>Compliance and recurring checks</h2><small>"+rows.length+" assigned rows · owner, backup, frequency and evidence together</small></div>"+complianceTable(rows);
  }
  function complianceTable(rows) {
    rows=rows||state.obligations;
    return "<div class='inline-status-note'><span class='status-chip review'>Operational checklist</span><span>Local legal/certificate verification is marked <strong>Later</strong> in the affected evidence row.</span></div>"+reportFilterBar("complianceTable","POCSO, DPDP, owner, category or frequency",[{key:"category",label:"Category",values:rows.map(function(o){return o.category;})},{key:"owner",label:"Owner",values:rows.map(function(o){return o.owner;})},{key:"frequency",label:"Frequency",values:rows.map(function(o){return o.frequency;})}])+"<div class='table-wrap'><table id='complianceTable'><thead><tr><th>Category</th><th>Obligation</th><th>Owner</th><th>Backup</th><th>Frequency</th><th>Due</th><th>Evidence / Later</th><th>Status</th></tr></thead><tbody>"+rows.map(function(o){return "<tr data-status='"+esc(o.status)+"' data-category='"+esc(o.category||"School")+"' data-owner='"+esc(o.owner)+"' data-frequency='"+esc(o.frequency)+"'><td>"+esc(o.category||"School")+"</td><td><strong>"+esc(o.title)+"</strong></td><td>"+esc(o.owner)+"</td><td>"+esc(o.backup)+"</td><td>"+esc(o.frequency)+"</td><td>"+esc(o.due)+"</td><td>"+esc(o.evidence)+"</td><td><button class='text-button' data-action='obligation' data-id='"+o.id+"'>"+statusChip(o.status)+"</button></td></tr>";}).join("")+"</tbody></table></div>";
  }
  function leadershipBody(){
    if(user().view!=="HEAD")return "";
    var cards=["COORDINATOR","OPERATIONS"].map(function(code){var role=state.leadership[code];return "<article class='card leadership-card'><p class='eyebrow'>"+esc(role.role)+"</p><h3>"+esc(role.holder)+"</h3><p>"+esc(role.mode)+(role.until?" · until "+esc(role.until):"")+"</p><span class='small-note'>"+esc(role.reason)+"</span><button class='secondary-button' data-action='edit-leader' data-role-code='"+code+"'>Substitute or replace</button></article>";}).join("");
    return "<div class='section-head first-section'><h2>Leadership continuity</h2><small>Swati may appoint an acting or permanent replacement</small></div><section class='leadership-grid'>"+cards+"</section><div class='locked-note'><strong>Safe transfer.</strong> Open work moves to the replacement; completed history remains with the original person. Every change records before, after, reason and effective dates.</div>";
  }
  function responsibilitiesBody() {
    var isHead=user().view==="HEAD",isLeader=user().view==="COORDINATOR"||user().view==="FINANCE";
    var rows=isHead?state.responsibilities:state.responsibilities.filter(function(r){return r.primary===user().name;});
    var note=isHead?"All 20 primary workstreams are shown. Swati may change Primary, executor and substitute, lock the substitute, and give a reason and end date.":"Your Primary role is fixed by Swati. You may change execution and an unlocked substitute only inside your own team.";
    var body=rows.map(function(r){
      var i=state.responsibilities.indexOf(r),locked=!isHead&&r.backupLockedByHead;
      var primaryCell=isHead?"<select data-resp-field='primary' data-index='"+i+"' aria-label='Primary for "+esc(r.area)+"'>"+primaryOptionList(r.primary)+"</select>":"<strong>"+esc(r.primary)+"</strong><span class='small-note'>Fixed by Swati</span>";
      var assigneeCell=isHead?"<select data-resp-field='assignee' data-index='"+i+"' aria-label='Execution assignee for "+esc(r.area)+"'>"+delegateOptionList(r.primary,r.assignee,true)+"</select>":"<select data-delegate-field='assignee' data-index='"+i+"' aria-label='Execution assignee for "+esc(r.area)+"'>"+delegateOptionList(r.primary,r.assignee,false)+"</select>";
      var backupCell=locked?"<strong>"+esc(r.backupAssignee||"Not decided")+"</strong><span class='small-note'>Locked by Swati</span>":isHead?"<select data-resp-field='backup-assignee' data-index='"+i+"' aria-label='Substitute for "+esc(r.area)+"'>"+backupOptionList(r.primary,r.backupAssignee,true)+"</select>":"<select data-delegate-field='backup-assignee' data-index='"+i+"' aria-label='Substitute for "+esc(r.area)+"'>"+backupOptionList(r.primary,r.backupAssignee,false)+"</select>";
      var reason="<input data-resp-field='reason' data-index='"+i+"' aria-label='Reason for "+esc(r.area)+"' placeholder='Why is this changing?' value='"+esc(r.reason||"")+"'>";
      var expiry="<input data-resp-field='expiry' data-index='"+i+"' type='date' aria-label='End date for "+esc(r.area)+"' value='"+esc(r.expiry||"")+"'>";
      return "<tr><td data-label='Responsibility'><strong>"+esc(r.area)+"</strong><span class='small-note'>"+esc(r.cadence)+" · Approver "+esc(r.approver)+"</span></td><td data-label='Primary'>"+primaryCell+"</td><td data-label='Executor'>"+assigneeCell+"</td><td data-label='Substitute'>"+backupCell+"</td><td data-label='Reason / until'>"+reason+expiry+"</td><td data-label='Save'><button class='primary-button compact-button' data-action='"+(isHead?"save-responsibility":"save-delegation")+"' data-index='"+i+"'>"+(isHead?"Save assignment":"Save team assignment")+"</button></td></tr>";
    }).join("");
    return leadershipBody()+"<div class='section-head'><h2>Primary responsibilities</h2><small>"+rows.length+" visible workstreams</small></div><div class='locked-note'><strong>Three-level authority.</strong> "+note+"</div><div class='table-wrap responsibility-table' style='margin-top:14px'><table><thead><tr><th>Responsibility</th><th>Primary</th><th>Executor</th><th>Substitute</th><th>Reason / until</th><th>Save</th></tr></thead><tbody>"+body+"</tbody></table></div>";
  }
  function questionsBody() {
    var relevant=visibleWorkThreads(),me=user().name,waiting=relevant.filter(function(x){return x.owner===me&&x.status!=="good";}).length,sent=relevant.filter(function(x){return (x.createdBy||x.owner)===me&&x.owner!==me;}).length,reminders=relevant.filter(function(x){return (x.kind||x.group)==="Reminder"&&x.owner===me;}).length;
    var people=uniqueValues(relevant.reduce(function(a,x){return a.concat([x.owner,x.createdBy||x.owner]);},[]));
    return "<div class='action-row'><button class='primary-button' data-action='new-task'>New reminder, task or question</button></div><section class='module-summary three-summary'><div class='card stat-card'><strong>"+waiting+"</strong><span>Waiting for me</span></div><div class='card stat-card'><strong>"+sent+"</strong><span>Sent by me</span></div><div class='card stat-card'><strong>"+reminders+"</strong><span>My reminders</span></div></section>"+statusLegend()+"<div class='section-head'><h2>Work conversations</h2><small>Task, question, reply and status remain in one record</small></div>"+reportFilterBar("messageTable","Work, person, reply or due date",[{key:"kind",label:"Type",values:relevant.map(function(x){return x.kind||x.group||"Task";})},{key:"owner",label:"To",values:people},{key:"creator",label:"From",values:people}])+"<div class='table-wrap'><table id='messageTable'><thead><tr><th>Type</th><th>Work or question</th><th>From</th><th>To</th><th>Due</th><th>Latest reply / update</th><th>Status</th><th>Open</th></tr></thead><tbody>"+relevant.map(function(x){var creator=x.createdBy||x.owner,kind=x.kind||x.group||"Task",records=state.taskRecords&&state.taskRecords[x.id]||[],latest=records[0];return "<tr data-status='"+esc(x.status)+"' data-kind='"+esc(kind)+"' data-owner='"+esc(x.owner)+"' data-creator='"+esc(creator)+"'><td><strong>"+esc(kind)+"</strong></td><td>"+esc(x.title)+"</td><td>"+esc(creator)+"</td><td>"+esc(x.owner)+"</td><td>"+esc(x.due)+"</td><td>"+(latest?"<strong>"+esc(latest.actor)+"</strong><br><span class='small-note'>"+esc(latest.note)+"</span>":"<span class='small-note'>No reply yet</span>")+"</td><td>"+statusChip(x.status)+"</td><td><button class='text-button' data-action='task' data-id='"+x.id+"'>Open / reply</button></td></tr>";}).join("")+"</tbody></table></div>";
  }
  function reportsBody() {
    var names=roleTeamNames(),head=user().view==="HEAD";
    var tasks=head?state.tasks:state.tasks.filter(function(x){return names.indexOf(x.owner)>=0;});
    var obligations=head?state.obligations:state.obligations.filter(function(o){return names.indexOf(o.owner)>=0||names.indexOf(o.backup)>=0;});
    var auditRows=(state.audit||[]).filter(function(a){return head||names.indexOf(a.actor)>=0;});
    var actionRows=tasks.map(function(x){return {id:x.id,type:x.kind||x.group||"Task",title:x.title,owner:x.owner,due:x.due,status:x.status,action:"task"};}).concat(obligations.map(function(o){return {id:o.id,type:"Compliance",title:o.title,owner:o.owner,due:o.due+" · "+o.frequency,status:o.status,action:"obligation"};}));
    var counts=countsFrom(actionRows),shortcuts=user().view==="FINANCE"?[["Fees","fees"],["Stock & funds","inventory"],["Support team","staff"],["Compliance","calendar"],["Messages","questions"]]:user().view==="COORDINATOR"?[["Attendance","attendance"],["Students by class","students"],["Teachers","staff"],["Compliance","calendar"],["Messages","questions"]]:[["My messages","questions"],["Responsibilities","people"],["Fees","fees"],["Stock & funds","inventory"],["Compliance","calendar"]];
    var auditHtml=auditRows.map(function(a){var timing=[a.effectiveFrom&&"from "+a.effectiveFrom,a.effectiveUntil&&"until "+a.effectiveUntil].filter(Boolean).join(" · ");var detail=a.before!=null||a.after!=null?"<details class='audit-detail'><summary>Show before and after</summary><div><strong>Before</strong><pre>"+esc(JSON.stringify(a.before,null,2))+"</pre><strong>After</strong><pre>"+esc(JSON.stringify(a.after,null,2))+"</pre></div></details>":"";return "<div class='audit-row'><time>"+esc(a.at)+"</time><div><strong>"+esc(a.actor)+" · "+esc(a.entity||"General")+"</strong><br><span class='small-note'>"+esc(a.action)+"</span>"+(a.reason?"<br><span class='small-note'>Reason: "+esc(a.reason)+"</span>":"")+(timing?"<br><span class='small-note'>"+esc(timing)+"</span>":"")+detail+"</div></div>";}).join("");
    return "<div class='action-row report-shortcuts'>"+shortcuts.map(function(s){return "<button class='secondary-button' data-action='module' data-module='"+s[1]+"'>"+esc(s[0])+"</button>";}).join("")+"</div><section class='module-summary'><div class='card stat-card'><strong>"+actionRows.length+"</strong><span>Live work rows</span></div><div class='card stat-card'><strong>"+(counts.review+counts.pending)+"</strong><span>Need review</span></div><div class='card stat-card'><strong>"+counts.problem+"</strong><span>Overdue or blocked</span></div><div class='card stat-card'><strong>"+auditRows.length+"</strong><span>Visible audit entries</span></div></section><div class='section-head'><h2>Action report</h2><small>Live role records · filter, then act from the same row</small></div>"+reportFilterBar("actionReportTable","Work, owner, due date or type",[{key:"type",label:"Type",values:actionRows.map(function(x){return x.type;})},{key:"owner",label:"Owner",values:actionRows.map(function(x){return x.owner;})}])+"<div class='table-wrap'><table id='actionReportTable'><thead><tr><th>Type</th><th>Work</th><th>Owner</th><th>Due / frequency</th><th>Status</th><th>Action</th></tr></thead><tbody>"+actionRows.map(function(x){return "<tr data-status='"+esc(x.status)+"' data-type='"+esc(x.type)+"' data-owner='"+esc(x.owner)+"'><td>"+esc(x.type)+"</td><td><strong>"+esc(x.title)+"</strong></td><td>"+esc(x.owner)+"</td><td>"+esc(x.due)+"</td><td>"+statusChip(x.status)+"</td><td><button class='text-button' data-action='"+x.action+"' data-id='"+x.id+"'>Open and update</button></td></tr>";}).join("")+"</tbody></table></div><div class='section-head'><h2>Audit history</h2><small>Append-only in this synthetic browser · permanent server audit comes with GAS</small></div><div class='audit-list'>"+auditHtml+"</div>";
  }
  function facilitiesBody() {
    var areas=["Facilities","Kitchen","Garden","Gate & transport"];
    return "<div class='locked-note'><strong>Regular work under "+esc(activeLeader("OPERATIONS"))+".</strong> Tap a donut to filter the same table below. A red check creates a recorded finding; safety work still needs independent approval.</div><section class='people-grid operations-grid compact-donuts routine-donuts'>"+areas.map(function(area){var rows=ROUTINE_CHECKS.filter(function(x){return x.area===area;}).map(function(x){return {status:routineStatus(x)};});return summaryDonutCard(area,rows.length+" recurring checks","routine:"+area,rows);}).join("")+"</section>"+reportFilterBar("routineTable","Area, activity, person or frequency",[{key:"area",label:"Area",values:ROUTINE_CHECKS.map(function(c){return c.area;})},{key:"owner",label:"Owner",values:ROUTINE_CHECKS.map(function(c){return c.owner;})},{key:"frequency",label:"Frequency",values:ROUTINE_CHECKS.map(function(c){return c.frequency;})}])+"<div class='table-wrap'><table id='routineTable'><thead><tr><th>Area</th><th>Regular activity</th><th>Responsible</th><th>Frequency</th><th>Status</th><th>Record</th></tr></thead><tbody>"+ROUTINE_CHECKS.map(function(c){var status=routineStatus(c);return "<tr data-status='"+esc(status)+"' data-area='"+esc(c.area)+"' data-owner='"+esc(c.owner)+"' data-frequency='"+esc(c.frequency)+"'><td>"+esc(c.area)+"</td><td><strong>"+esc(c.title)+"</strong></td><td>"+esc(c.owner)+"</td><td>"+esc(c.frequency)+"</td><td>"+statusChip(status)+"</td><td><button class='text-button' data-action='facility-check' data-check='"+esc(c.title)+"'>Open</button></td></tr>";}).join("")+"</tbody></table></div><div class='later-inline'><span class='status-chip pending'>Later</span><strong>Photo evidence</strong><span>at each check after secure Drive storage and consent controls</span></div>";
  }
  function genericBody(modules) {
    var rows=catalogFor(modules);
    return "<div class='inline-status-note'><span class='status-chip review'>Reference area</span><span>Each row says whether this browser pilot works now, demonstrates only part, or remains Later.</span></div><div class='table-wrap'><table><thead><tr><th>ID</th><th>Work</th><th>Primary role</th><th>Status</th></tr></thead><tbody>"+rows.map(function(x){var s=catalogCapability(x);return "<tr><td>"+esc(x.id)+"</td><td>"+esc(x.task)+"</td><td>"+esc(x.role)+"</td><td>"+capabilityChip(s)+"</td></tr>";}).join("")+"</tbody></table></div>";
  }
  function catalogCapability(row) {
    if(WORKS_NOW_IDS.indexOf(row.id)>=0)return "now";
    if(PARTIAL_IDS.indexOf(row.id)>=0)return "partial";
    return "later";
  }
  function capabilityChip(status) {
    return "<span class='status-chip "+(status==="now"?"good":status==="partial"?"review":"pending")+"'>"+(status==="now"?"Works now":status==="partial"?"Partial":"Later")+"</span>";
  }
  function capabilityCounts() {
    var c={now:0,partial:0,later:0};(window.KVN_CATALOG||[]).forEach(function(x){c[catalogCapability(x)]+=1;});return c;
  }
  function catalogBody(moduleFilter) {
    var modules=Object.keys(moduleCounts()).sort(),counts=capabilityCounts(),filter=state.catalogFilter||{query:"",module:"",status:""};if(moduleFilter)filter.module=moduleFilter;
    return "<section class='module-summary three-summary'><div class='card stat-card'><strong>"+counts.now+"</strong><span>Works now in this pilot</span></div><div class='card stat-card'><strong>"+counts.partial+"</strong><span>Partial demonstration</span></div><div class='card stat-card'><strong>"+counts.later+"</strong><span>Later</span></div></section><div class='catalog-toolbar catalog-toolbar-three'><input id='catalogSearch' type='search' value='"+esc(filter.query||"")+"' placeholder='Find ID, task, module or role as you type' aria-label='Search feature catalogue' autocomplete='off'><select id='catalogModule' aria-label='Filter by module'><option value=''>All modules</option>"+modules.map(function(m){return "<option "+(m===filter.module?"selected":"")+" value='"+esc(m)+"'>"+esc(m)+"</option>";}).join("")+"</select><select id='catalogStatus' aria-label='Filter by delivery status'><option value=''>All statuses</option><option value='now' "+(filter.status==="now"?"selected":"")+">Works now</option><option value='partial' "+(filter.status==="partial"?"selected":"")+">Partial</option><option value='later' "+(filter.status==="later"?"selected":"")+">Later</option></select></div><p class='field-hint'>Search changes the rows immediately. Status describes this browser pilot—not the earlier GAS build.</p><div id='catalogResults' class='table-wrap familiar-table'>"+catalogRows()+"</div>";
  }
  function catalogRows() {
    var filter=state.catalogFilter||{},q=String(filter.query||"").toLowerCase(),pageSize=25;
    var filtered=(window.KVN_CATALOG||[]).filter(function(x){return (!filter.module||x.module===filter.module)&&(!filter.status||catalogCapability(x)===filter.status)&&(!q||[x.id,x.module,x.task,x.role].join(" ").toLowerCase().indexOf(q)>=0);});
    var pages=Math.max(1,Math.ceil(filtered.length/pageSize));state.catalogPage=Math.min(Math.max(1,state.catalogPage||1),pages);var start=(state.catalogPage-1)*pageSize,rows=filtered.slice(start,start+pageSize);
    return "<table><thead><tr><th>ID</th><th>Module</th><th>Task</th><th>Primary role</th><th>Status</th></tr></thead><tbody>"+rows.map(function(x){return "<tr><td>"+esc(x.id)+"</td><td>"+esc(x.module)+"</td><td>"+esc(x.task)+"</td><td>"+esc(x.role)+"</td><td>"+capabilityChip(catalogCapability(x))+"</td></tr>";}).join("")+"</tbody></table><div class='pager'><span>"+(filtered.length?start+1:0)+"–"+Math.min(start+pageSize,filtered.length)+" of "+filtered.length+"</span><button class='secondary-button' data-action='catalog-page' data-page='"+(state.catalogPage-1)+"' "+(state.catalogPage<=1?"disabled":"")+">Previous</button><button class='secondary-button' data-action='catalog-page' data-page='"+(state.catalogPage+1)+"' "+(state.catalogPage>=pages?"disabled":"")+">Next</button></div>";
  }

  function openTask(id) {
    var x=state.tasks.find(function(a){return a.id===id;}); if(!x)return;
    if(user().view!=="HEAD"&&!canOpenTask(x)){audit("Denied task record access to "+id);deny("questions");return;}
    var records=(state.taskRecords&&state.taskRecords[x.id])||[];
    var creator=x.createdBy||x.owner,kind=x.kind||x.group||"Task";
    document.getElementById("formContent").innerHTML=dialogHead(kind+" · "+creator+" → "+x.owner,x.id,"formDialog")+"<div class='thread-summary'><strong>"+esc(x.title)+"</strong><span>From "+esc(creator)+" · To "+esc(x.owner)+" · Due "+esc(x.due)+"</span></div><form id='taskForm' class='stack-form'><input type='hidden' name='taskId' value='"+x.id+"'><label for='taskStatus'>Status</label><select id='taskStatus' name='status'><option value='good' "+(x.status==="good"?"selected":"")+">Green · completed</option><option value='review' "+(x.status==="review"?"selected":"")+">Orange · needs review</option><option value='problem' "+(x.status==="problem"?"selected":"")+">Red · overdue or blocked</option><option value='pending' "+(x.status==="pending"?"selected":"")+">Pending reply or action</option></select><p class='field-hint'>The status is visible to the sender, responsible person and authorised team lead.</p><label for='taskRemark'>Reply or work update</label><textarea id='taskRemark' name='remark' placeholder='Reply, say what was done, or describe what is blocking it' required></textarea><p class='field-hint'>Every save records the person, time, words and status. Material safety or compliance items still require an independent approver.</p><button class='primary-button' type='submit'>Send reply / save update</button></form><div class='section-head'><h2>Conversation and work record</h2><small>Newest first · original wording remains above</small></div>"+(records.length?"<div class='audit-list'>"+records.map(function(r){return "<div class='audit-row'><time>"+esc(r.at)+"</time><div><strong>"+esc(r.actor)+"</strong><br><span class='small-note'>"+esc(r.note)+"</span></div></div>";}).join("")+"</div>":"<div class='empty-state'><strong>No reply yet</strong>The first saved reply will appear here.</div>");
    formDialog.showModal();
  }
  function addStudentForm() {
    document.getElementById("formContent").innerHTML=dialogHead("Synthetic student","Add student","formDialog")+"<form id='studentForm' class='stack-form'><label for='studentName'>Student name</label><input id='studentName' name='name' placeholder='Enter a synthetic name' required><p class='field-hint'>Do not enter any real child information in this prototype.</p><label for='studentClass'>Class</label><select id='studentClass' name='className'>"+CLASS_COUNTS.map(function(c){return "<option>"+esc(c[0])+"</option>";}).join("")+"</select><label for='guardianName'>Guardian label</label><input id='guardianName' name='guardian' placeholder='For example: Guardian 138' required><p class='field-hint'>A duplicate name is blocked for review.</p><button class='primary-button' type='submit'>Add synthetic student</button></form>";
    formDialog.showModal();
  }
  function receiptForm() {
    document.getElementById("formContent").innerHTML=dialogHead("Fees","Record synthetic receipt","formDialog")+"<form id='receiptForm' class='stack-form'><label for='receiptStudent'>Student</label><input id='receiptStudent' name='student' list='studentList' placeholder='Type an exact student name' required><datalist id='studentList'>"+state.students.slice(0,137).map(function(s){return "<option value='"+esc(s.name)+"'>"+esc(s.id+" · "+s.className)+"</option>";}).join("")+"</datalist><p class='field-hint'>The save is blocked unless the name matches the authoritative student master.</p><label for='schoolCategory'>School fee category</label><select id='schoolCategory' name='schoolCategory'>"+SCHOOL_FEE_CATEGORIES.map(function(x){return "<option>"+esc(x)+"</option>";}).join("")+"</select><label for='schoolFee'>School fee amount received</label><input id='schoolFee' name='school' type='number' inputmode='decimal' min='0' step='0.01' placeholder='0' required><label for='transportCategory'>Transport category</label><select id='transportCategory' name='transportCategory'>"+TRANSPORT_CATEGORIES.map(function(x){return "<option>"+esc(x)+"</option>";}).join("")+"</select><label for='transportFee'>Transport amount received</label><input id='transportFee' name='transport' type='number' inputmode='decimal' min='0' step='0.01' placeholder='0' required><label for='receiptMode'>Payment mode</label><select id='receiptMode' name='mode'><option>Cash</option><option>Bank</option><option>UPI</option><option>Training</option></select><label for='receiptReference'>Receipt / payment reference</label><input id='receiptReference' name='reference' placeholder='Unique receipt or bank reference' required><p class='field-hint'>The same reference cannot be saved twice. Corrections use a contra entry.</p><button class='primary-button' type='submit'>Save and issue receipt</button></form>";
    formDialog.showModal();
  }
  function batchFeeForm(){
    simpleForm("batchFees","Batch fee entry","<label for='batchFeeRows'>Rows</label><textarea id='batchFeeRows' name='rows' placeholder='Student 001 | 600 | 0 | Cash | BATCH-001' required></textarea><p class='field-hint'>One row per line: exact student name | school amount | transport amount | mode | unique reference. Every row is validated before anything is saved.</p>");
  }
  function batchInventoryForm(){
    simpleForm("batchInventory","Batch stock entry","<label for='batchInventoryRows'>Rows</label><textarea id='batchInventoryRows' name='rows' placeholder='Add | Rice | 10 | 55 | Supplier delivery' required></textarea><p class='field-hint'>One row per line: Add or Issue | exact item | quantity | rate for Add | reason. Every row is validated before anything is saved.</p>");
  }
  function newTaskForm(){
    simpleForm("newTask","New reminder, task or question","<label for='newTaskKind'>Type</label><select id='newTaskKind' name='kind'><option>Reminder</option><option>Task</option><option>Question</option></select><p class='field-hint'>Use Reminder for yourself, Task for work, or Question when a reply is required.</p><label for='newTaskTitle'>Message or work</label><input id='newTaskTitle' name='title' placeholder='Write the reminder, task or exact question' required><label for='newTaskOwner'>Responsible person</label><select id='newTaskOwner' name='owner'>"+assignableTaskPeople().map(function(name){return "<option value='"+esc(name)+"'>"+esc(name)+"</option>";}).join("")+"</select><p class='field-hint'>Swati may assign any active staff member. Leaders may assign only inside their own team.</p><label for='newTaskDue'>Due date</label><input id='newTaskDue' name='due' type='date' required><p class='field-hint'>The reply and every later update stay attached to this record and audit.</p>");
  }
  function simpleForm(kind,title,fields) {
    document.getElementById("formContent").innerHTML=dialogHead("Synthetic entry",title,"formDialog")+"<form id='"+kind+"Form' class='stack-form'>"+fields+"<button class='primary-button' type='submit'>Save</button></form>";
    if(!formDialog.open)formDialog.showModal();
  }
  function leadershipForm(roleCode){
    if(user().view!=="HEAD"){denyMutation("leadership roles");return;}
    var role=state.leadership[roleCode];if(!role)return;
    var other=roleCode==="COORDINATOR"?activeLeader("OPERATIONS"):activeLeader("COORDINATOR");
    var options=allStaffNames().filter(function(name){return name!==other;}).map(function(name){return "<option value='"+esc(name)+"' "+(name===role.holder?"selected":"")+">"+esc(name)+"</option>";}).join("");
    document.getElementById("formContent").innerHTML=dialogHead("Leadership continuity",role.role,"formDialog")+"<form id='leadershipForm' class='stack-form'><input type='hidden' name='roleCode' value='"+esc(roleCode)+"'><label for='leaderHolder'>Role-holder</label><select id='leaderHolder' name='holder'>"+options+"</select><p class='field-hint'>The same person cannot hold both leadership roles in this pilot.</p><label for='leaderMode'>Change type</label><select id='leaderMode' name='mode'><option "+(role.mode==="Acting"?"selected":"")+">Acting</option><option "+(role.mode==="Permanent"?"selected":"")+">Permanent</option></select><label for='leaderFrom'>Effective from</label><input id='leaderFrom' name='effectiveFrom' type='date' value='"+esc(role.from||"")+"' required><label for='leaderUntil'>Effective until</label><input id='leaderUntil' name='effectiveUntil' type='date' value='"+esc(role.until||"")+"'><p class='field-hint'>Required for an acting appointment; leave blank for a permanent appointment.</p><label for='leaderReason'>Reason</label><textarea id='leaderReason' name='reason' placeholder='Why is this substitute or replacement required?' required>"+esc(role.reason||"")+"</textarea><p class='field-hint'>Open work transfers to the new holder; completed history is preserved.</p><button class='primary-button' type='submit'>Save leadership change</button></form>";
    formDialog.showModal();
  }
  function quickInventoryForm(selectedItem,selectedKind) {
    var items=state.inventory.slice().sort(function(a,b){return a.item.localeCompare(b.item);});
    selectedItem=selectedItem||items[0].item;selectedKind=selectedKind||"Add";
    simpleForm("quickInventory","Add or issue stock","<label for='quickKind'>Movement</label><select id='quickKind' name='kind'><option value='Add' "+(selectedKind==="Add"?"selected":"")+">Stock in / purchase</option><option value='Issue' "+(selectedKind==="Issue"?"selected":"")+">Stock out / issue</option></select><p class='field-hint'>Stock in needs quantity and rate. Stock out needs quantity only.</p><label for='quickItem'>Existing item</label><select id='quickItem' name='item'>"+items.map(function(x){return "<option value='"+esc(x.item)+"' "+(x.item===selectedItem?"selected":"")+">"+esc(x.item)+"</option>";}).join("")+"</select><p id='quickBalance' class='balance-callout'></p><label for='quickQty'>Quantity</label><input id='quickQty' name='qty' type='number' inputmode='decimal' min='0.01' step='0.01' placeholder='Enter quantity' required><p class='field-hint'>The issue cannot exceed the current balance.</p><div id='quickRateWrap'><label for='quickRate'>Rate per unit</label><input id='quickRate' name='rate' type='number' inputmode='decimal' min='0.01' step='0.01' placeholder='Enter purchase rate'><p class='field-hint'>Required only for stock in. The new weighted average is calculated automatically.</p></div><div class='calculation-box'><span>Movement value</span><strong id='quickValuePreview'>₹0</strong><small id='quickValueHint'>Quantity × rate</small></div><label for='quickReason'>Purpose / reference</label><input id='quickReason' name='reason' placeholder='Purchase, class, kitchen or other purpose' required><p class='field-hint'>One save updates balance, average rate, value and movement history.</p>");
    updateQuickInventoryPreview();
  }
  function updateQuickInventoryPreview() {
    var kind=document.getElementById("quickKind"),itemEl=document.getElementById("quickItem"),qtyEl=document.getElementById("quickQty"),rateEl=document.getElementById("quickRate"),wrap=document.getElementById("quickRateWrap");if(!kind||!itemEl)return;
    var item=state.inventory.find(function(x){return x.item===itemEl.value;});if(!item)return;
    var incoming=kind.value==="Add",qty=Number(qtyEl&&qtyEl.value||0),rate=incoming?Number(rateEl&&rateEl.value||0):Number(item.avgRate||0),value=qty*rate;
    wrap.hidden=!incoming;rateEl.required=incoming;rateEl.disabled=!incoming;
    document.getElementById("quickBalance").innerHTML="<strong>Current balance:</strong> "+Number(item.qty||0).toLocaleString("en-IN")+" · average rate "+rateMoney(item.avgRate)+" · value "+currency(inventoryValue(item));
    document.getElementById("quickValuePreview").textContent=currency(value);
    document.getElementById("quickValueHint").textContent=incoming?"Quantity × entered rate":"Quantity × current average rate (automatic)";
  }
  function openInventoryItem(itemName) {
    var item=state.inventory.find(function(x){return x.item===itemName;});if(!item)return;
    var moves=state.inventoryMovements.filter(function(m){return m.item===itemName;});
    var itemActions=canMutateOperations()?"<button class='primary-button' data-action='inventory-move' data-kind='Add' data-item='"+esc(item.item)+"'>Add stock</button><button class='secondary-button' data-action='inventory-move' data-kind='Issue' data-item='"+esc(item.item)+"'>Issue stock</button>":"<span class='status-chip review'>View only · "+esc(activeLeader("OPERATIONS"))+" records movements</span>";
    document.getElementById("formContent").innerHTML=dialogHead("Stock item",item.item,"formDialog")+"<section class='module-summary three-summary'><div class='card stat-card'><strong>"+Number(item.qty||0).toLocaleString("en-IN")+"</strong><span>Balance quantity</span></div><div class='card stat-card'><strong>"+rateMoney(item.avgRate)+"</strong><span>Average rate</span></div><div class='card stat-card'><strong>"+currency(inventoryValue(item))+"</strong><span>Balance value</span></div></section><div class='action-row'>"+itemActions+"</div><div class='section-head'><h2>Movement history</h2><small>Newest first · corrections append a contra record</small></div>"+(moves.length?"<div class='table-wrap'><table><thead><tr><th>Date / ID</th><th>Movement</th><th>In</th><th>Out</th><th>Rate</th><th>Value</th><th>Balance</th><th>Reason / correction</th></tr></thead><tbody>"+moves.map(function(m){var incoming=m.direction==="Received",correction=m.reversed?"<span class='status-chip problem'>Reversed</span>":m.contra?"<span class='status-chip review'>Contra</span>":canMutateOperations()?"<button class='text-button' data-action='reverse-stock' data-movement-id='"+esc(m.id)+"'>Correct</button>":"";return "<tr class='"+(m.reversed?"reversed-row":"")+"'><td>"+esc(m.at)+"<br><span class='small-note'>"+esc(m.id)+"</span></td><td>"+esc(m.kind||m.direction)+"</td><td>"+(incoming?m.qty:"—")+"</td><td>"+(incoming?"—":m.qty)+"</td><td>"+rateMoney(m.rate)+"</td><td>"+currency(m.amount)+"</td><td>"+esc(m.balanceAfter==null?"—":m.balanceAfter)+"</td><td>"+esc(m.reason||"—")+"<br>"+correction+"</td></tr>";}).join("")+"</tbody></table></div>":"<div class='empty-state'><strong>No movement recorded yet</strong></div>");
    formDialog.showModal();
  }
  function sarasOpen() {
    sarasDialog.innerHTML=SARAS_TEMPLATE;
    if(!sarasDialog.open) sarasDialog.showModal();
    renderSarasMessages();
    applyLanguage(sarasDialog);
  }
  function renderSarasMessages() {
    var el=document.getElementById("sarasMessages");
    if(!state.sarasMessages) state.sarasMessages=[{role:"assistant",text:localText("Tell me what you are trying to do. I will use approved KVN guidance or route the exact question to the responsible person.","बताइए आप क्या करना चाहते हैं। मैं स्वीकृत KVN मार्गदर्शन से उत्तर दूँगी या आपका वही प्रश्न जिम्मेदार व्यक्ति को भेजूँगी।","તમે શું કરવા માંગો છો તે કહો. હું મંજૂર KVN માર્ગદર્શનથી જવાબ આપીશ અથવા તમારો મૂળ પ્રશ્ન જવાબદાર વ્યક્તિને મોકલીશ.","तुम्हाला काय करायचे आहे ते सांगा. मी मंजूर KVN मार्गदर्शनातून उत्तर देईन किंवा तुमचा मूळ प्रश्न जबाबदार व्यक्तीकडे पाठवेन.")}];
    el.innerHTML=state.sarasMessages.map(function(m){return "<div class='message "+m.role+"'>"+esc(m.text)+"</div>";}).join("");
    el.scrollTop=el.scrollHeight;
  }
  function localText(en,hi,gu,mr){return {EN:en,HI:hi,GU:gu,MR:mr}[state.language]||en;}
  function localizedPersonName(name){
    if(name===DEFAULT_LEADERS.COORDINATOR)return localText("Yukti","युक्ति","યુક્તિ","युक्ती");
    if(name===DEFAULT_LEADERS.OPERATIONS)return localText("Ahmad","अहमद","અહમદ","अहमद");
    return name;
  }
  function sarasAnswer(q) {
    var s=q.toLowerCase(),coordinator=localizedPersonName(activeLeader("COORDINATOR")),operationsLeader=localizedPersonName(activeLeader("OPERATIONS"));
    if(s.indexOf("attendance")>=0) return localText("Open Attendance, choose the class from all nine classes, mark the children and save once. "+coordinator+" can correct a saved mark with history preserved.","उपस्थिति खोलें, नौ कक्षाओं में से कक्षा चुनें, बच्चों को चिन्हित करें और एक बार सहेजें। "+coordinator+" इतिहास सुरक्षित रखते हुए सुधार कर सकते हैं।","હાજરી ખોલો, નવ વર્ગમાંથી વર્ગ પસંદ કરો, બાળકોને ચિહ્નિત કરો અને એકવાર સાચવો. "+coordinator+" ઇતિહાસ જાળવીને સુધારો કરી શકે છે.","उपस्थिती उघडा, नऊ वर्गांतून वर्ग निवडा, मुलांना चिन्हांकित करा आणि एकदा जतन करा. "+coordinator+" इतिहास राखून सुधारणा करू शकतात.");
    if(s.indexOf("fee")>=0||s.indexOf("receipt")>=0) return localText(operationsLeader+" records fees. School, donation and transport amounts stay separate. The full familiar table shows paid and balance.",operationsLeader+" शुल्क दर्ज करते हैं। स्कूल, दान और परिवहन राशि अलग रहती है। पूरी परिचित तालिका भुगतान और शेष दिखाती है।",operationsLeader+" ફી નોંધે છે. શાળા, દાન અને પરિવહનની રકમ અલગ રહે છે. પૂર્ણ ઓળખીતું ટેબલ ચૂકવેલ અને બાકી બતાવે છે.",operationsLeader+" शुल्क नोंदवतात. शाळा, देणगी आणि वाहतूक रक्कम वेगळी राहते. पूर्ण परिचित तक्ता भरलेली आणि बाकी रक्कम दाखवतो.");
    if(s.indexOf("backup")>=0||s.indexOf("responsib")>=0||s.indexOf("substitute")>=0) return localText("Swati assigns each Primary responsibility to the current leaders, "+coordinator+" or "+operationsLeader+". She may also appoint their substitutes or replacements. Each leader can delegate only inside their own team.","स्वाति हर मुख्य जिम्मेदारी वर्तमान प्रमुखों, "+coordinator+" या "+operationsLeader+" को देती हैं। वे उनके विकल्प या प्रतिस्थापन भी नियुक्त कर सकती हैं। हर प्रमुख केवल अपनी टीम में काम सौंप सकता है।","સ્વાતિ દરેક મુખ્ય જવાબદારી વર્તમાન નેતાઓ, "+coordinator+" અથવા "+operationsLeader+"ને સોંપે છે. તેઓ તેમની બદલી અથવા પ્રતિસ્થાપન પણ નિયુક્ત કરી શકે છે. દરેક નેતા ફક્ત પોતાની ટીમમાં કામ સોંપી શકે છે.","स्वाती प्रत्येक मुख्य जबाबदारी सध्याच्या प्रमुखांना, "+coordinator+" किंवा "+operationsLeader+" यांना देते. ती त्यांची बदली किंवा प्रतिस्थापनही नेमू शकते. प्रत्येक प्रमुख फक्त आपल्या टीममध्ये काम सोपवू शकतो.");
    if(s.indexOf("aadhaar")>=0||s.indexOf("adhar")>=0||s.indexOf("document")>=0) return localText("Aadhaar and document files are Later. "+operationsLeader+" may eventually update document status, but unrestricted vault access is not allowed.","आधार और दस्तावेज फाइलें बाद में जुड़ेंगी। "+operationsLeader+" बाद में दस्तावेज स्थिति अपडेट कर सकते हैं, लेकिन पूरा वॉल्ट खुला नहीं होगा।",operationsLeader+" માટે આધાર અને દસ્તાવેજ ફાઇલો પછી જોડાશે. દસ્તાવેજની સ્થિતિ સુધારી શકાશે, પરંતુ આખું વોલ્ટ ખુલ્લું નહીં હોય.","आधार आणि दस्तऐवज फाइल्स नंतर जोडल्या जातील. "+operationsLeader+" नंतर दस्तऐवज स्थिती बदलू शकतात, पण संपूर्ण व्हॉल्ट खुला नसेल.");
    if(s.indexOf("sheet")>=0||s.indexOf("drive")>=0||s.indexOf("file")>=0||s.indexOf("record")>=0) return localText("This pilot saves only on this browser. Shared Sheets and Drive files are Later, after secure backend/GAS connection. Do not enter real school data here.","यह अभ्यास केवल इस ब्राउज़र में सहेजता है। साझा शीट और ड्राइव सुरक्षित backend/GAS जुड़ने के बाद आएँगे। यहाँ वास्तविक स्कूल डेटा न डालें।","આ અભ્યાસ ફક્ત આ બ્રાઉઝરમાં સાચવે છે. શેર કરેલી Sheets અને Drive સુરક્ષિત backend/GAS જોડાયા પછી આવશે. અહીં વાસ્તવિક શાળા ડેટા ન નાખો.","हा सराव फक्त या ब्राउझरमध्ये जतन होतो. सामायिक Sheets आणि Drive सुरक्षित backend/GAS जोडल्यानंतर येतील. येथे खरा शाळेचा डेटा टाकू नका.");
    if(s.indexOf("swati")>=0) return localText("Swati first sees her own donut. "+coordinator+" and "+operationsLeader+" team work opens only after their donuts are chosen.","स्वाति पहले अपना डोनट देखती हैं। "+coordinator+" और "+operationsLeader+" का टीम काम केवल उनका डोनट चुनने पर खुलता है।","સ્વાતિ પ્રથમ પોતાનું ડોનટ જુએ છે. "+coordinator+" અને "+operationsLeader+"નું ટીમ કામ તેમનું ડોનટ પસંદ કર્યા પછી જ ખૂલે છે.","स्वातीला प्रथम स्वतःचा डोनट दिसतो. "+coordinator+" आणि "+operationsLeader+" यांचे टीम काम त्यांचा डोनट निवडल्यानंतरच उघडते.");
    return "";
  }
  function setMicChrome(mode){
    var button=document.getElementById("sarasMic"); if(!button)return;
    if(mode==="listening"){
      button.setAttribute("aria-pressed","true");
      button.innerHTML="<span class='mic-glyph' aria-hidden='true'>■</span><span data-copy='Stop listening'>Stop listening</span>";
    } else {
      button.setAttribute("aria-pressed","false");
      button.innerHTML="<span class='mic-glyph' aria-hidden='true'>🎙</span><span data-copy='Listen'>Listen</span>";
    }
    applyLanguage(button);
  }
  function startSarasMic() {
    var Recognition=window.SpeechRecognition||window.webkitSpeechRecognition,button=document.getElementById("sarasMic"),status=document.getElementById("sarasMicStatus");
    if(!Recognition){status.textContent="Microphone speech entry is not supported by this browser. Type the question instead.";button.disabled=true;return;}
    if(speechRecognition){speechRecognition.stop();return;}
    speechRecognition=new Recognition();speechRecognition.lang={EN:"en-IN",HI:"hi-IN",GU:"gu-IN",MR:"mr-IN"}[state.language]||"en-IN";speechRecognition.interimResults=true;speechRecognition.continuous=false;
    setMicChrome("listening");status.textContent="Listening in "+document.getElementById("languageSelect").selectedOptions[0].text+"…";
    speechRecognition.onresult=function(event){var words="";for(var i=event.resultIndex;i<event.results.length;i+=1)words+=event.results[i][0].transcript;document.getElementById("sarasQuestion").value=words;};
    speechRecognition.onerror=function(event){status.textContent=event.error==="not-allowed"?"Microphone permission was not allowed. You can type the question.":"I could not hear clearly. Tap Listen to try again or type the question.";};
    speechRecognition.onend=function(){speechRecognition=null;setMicChrome("idle");if(document.getElementById("sarasQuestion").value)status.textContent="Your words are ready. Check them, then tap Send.";applyLanguage(sarasDialog);};
    speechRecognition.start();
  }

  document.addEventListener("click",function(e){
    var nav=e.target.closest("[data-nav]"); if(nav){state.nav=nav.dataset.nav;save();render();return;}
    var close=e.target.closest("[data-close]"); if(close){document.getElementById(close.dataset.close).close();return;}
    var action=e.target.closest("[data-action]"); if(!action)return;
    var a=action.dataset.action;
    if(["fund-entry","inventory-entry","expense-entry","food-entry","transport-entry","quick-inventory","inventory-move","new-receipt","batch-fees","batch-inventory"].indexOf(a)>=0&&!canMutateOperations()){denyMutation("operations and finance");return;}
    if(a==="profiles") openProfiles();
    else if(a==="choose-profile"){state.currentUser=action.dataset.profile;state.nav="home";state.studentClassView="";state.operationsSection="overview";save();panelDialog.close();render();toast("Now testing as "+user().name);}
    else if(a==="voice"){state.voice=!state.voice;save();render();if(state.voice&&window.speechSynthesis){speechSynthesis.cancel();speechSynthesis.speak(new SpeechSynthesisUtterance(document.querySelector("h1").textContent));}}
    else if(a==="saras") sarasOpen();
    else if(a==="saras-mic") startSarasMic();
    else if(a==="edit-leader") leadershipForm(action.dataset.roleCode);
    else if(a==="person") openPerson(action.dataset.person);
    else if(a==="student-class"){state.studentClassView=action.dataset.class;save();openModule("students");}
    else if(a==="student-classes"){state.studentClassView="";save();openModule("students");}
    else if(a==="ops-section"){state.operationsSection=action.dataset.section;save();openModule(action.dataset.section==="fees"?"fees":"inventory");}
    else if(a==="routine-area"){var routineQuery=document.querySelector("[data-report-query='routineTable']");if(routineQuery){routineQuery.value=action.dataset.area;applyReportFilter("routineTable");routineQuery.scrollIntoView({block:"center"});}}
    else if(a==="module"){closeDialogs();openModule(action.dataset.module);}
    else if(a==="task"){closeDialogs();openTask(action.dataset.id);}
    else if(a==="attendance-class"){state.attendanceClass=action.dataset.class;save();openModule("attendance");}
    else if(a==="add-student"){if(!canManageStudents()){denyMutation("student records");return;}addStudentForm();}
    else if(a==="new-receipt"){if(!canMutateOperations()){denyMutation("fees");return;}receiptForm();}
    else if(a==="batch-fees"){if(!canMutateOperations()){denyMutation("fees");return;}batchFeeForm();}
    else if(a==="batch-inventory"){if(!canMutateOperations()){denyMutation("inventory");return;}batchInventoryForm();}
    else if(a==="fee-page"){state.feePage=Math.max(1,Number(action.dataset.page)||1);save();var feeResults=document.getElementById("feeResults");if(feeResults)feeResults.innerHTML=feeTableRows();}
    else if(a==="toggle-fee-columns"){state.feeExpanded=!state.feeExpanded;save();openModule("fees");}
    else if(a==="reverse-receipt"){
      if(!canMutateOperations()){denyMutation("fees");return;}
      var receipt=state.receipts.find(function(row){return row.id===action.dataset.receiptId;});if(!receipt||receipt.reversed){toast("Receipt is already reversed or unavailable.");return;}
      var receiptLedger=state.feeLedger.find(function(row){return row.student===receipt.student;});if(!receiptLedger){toast("Student ledger not found.");return;}
      receiptLedger.schoolPaid=Math.max(0,receiptLedger.schoolPaid-receipt.school);receiptLedger.transportPaid=Math.max(0,receiptLedger.transportPaid-receipt.transport);receipt.reversed=true;receipt.reversedAt=nowStamp();receipt.reversedBy=user().name;
      audit("Reversed fee receipt "+receipt.id,{entity:"Fee receipt",before:{reversed:false,student:receipt.student,school:receipt.school,transport:receipt.transport},after:receipt,reason:"Contra correction"});openModule("fees");toast("Receipt reversed by contra entry; original retained.");
    }
    else if(a==="reverse-stock"){
      if(!canMutateOperations()){denyMutation("inventory");return;}
      var correctionMovement=state.inventoryMovements.find(function(row){return row.id===action.dataset.movementId;});
      if(!correctionMovement||correctionMovement.reversed||correctionMovement.contra){toast("Movement is already corrected or unavailable.");return;}
      simpleForm("reverseStock","Correct stock movement "+correctionMovement.id,"<input type='hidden' name='movementId' value='"+esc(correctionMovement.id)+"'><p class='balance-callout'><strong>Original:</strong> "+esc(correctionMovement.direction)+" "+esc(correctionMovement.qty)+" · "+esc(correctionMovement.item)+" · "+currency(correctionMovement.amount)+"</p><label for='stockCorrectionReason'>Correction reason</label><textarea id='stockCorrectionReason' name='reason' placeholder='Why must this movement be reversed?' required></textarea><p class='field-hint'>The original is retained and a contra record is appended. The balance and weighted average are recalculated from retained history.</p>");
    }
    else if(a==="quick-inventory"){if(!canMutateOperations()){denyMutation("inventory");return;}quickInventoryForm();}
    else if(a==="inventory-item") openInventoryItem(action.dataset.item);
    else if(a==="inventory-move"){if(!canMutateOperations()){denyMutation("inventory");return;}quickInventoryForm(action.dataset.item,action.dataset.kind);}
    else if(a==="save-responsibility"){
      if(user().view!=="HEAD"){audit("Denied responsibility assignment change");deny("people");return;}
      var ri=Number(action.dataset.index),rr=state.responsibilities[ri],beforeResponsibility=cloneData(rr);
      var primaryEl=document.querySelector("[data-resp-field='primary'][data-index='"+ri+"']"),newPrimary=primaryEl&&primaryEl.value;
      var assigneeEl=document.querySelector("[data-resp-field='assignee'][data-index='"+ri+"']"),newAssignee=assigneeEl&&assigneeEl.value;
      var headBackupEl=document.querySelector("[data-resp-field='backup-assignee'][data-index='"+ri+"']"),headBackup=headBackupEl&&headBackupEl.value;
      var reasonEl=document.querySelector("[data-resp-field='reason'][data-index='"+ri+"']"),reason=String(reasonEl&&reasonEl.value||"").trim();
      var expiryEl=document.querySelector("[data-resp-field='expiry'][data-index='"+ri+"']"),expiry=expiryEl&&expiryEl.value||"";
      if(primaryLeaders().indexOf(newPrimary)<0){toast("Choose one of the current leadership role-holders.");return;}
      if(!reason){toast("Enter the reason before saving an assignment change.");return;}
      if(teamForPrimary(newPrimary,true).indexOf(newAssignee)<0||headBackup&&teamForPrimary(newPrimary,true).indexOf(headBackup)<0){toast("Choose an active staff member.");return;}
      if(headBackup&&headBackup===newAssignee){toast("Executor and substitute must be different people.");return;}
      rr.primary=newPrimary;rr.assignee=newAssignee;rr.backupAssignee=headBackup||"";rr.backupLockedByHead=Boolean(headBackup);rr.leaderBackup=newPrimary===activeLeader("OPERATIONS")?activeLeader("COORDINATOR"):activeLeader("OPERATIONS");rr.approver="Swati";rr.reason=reason;rr.expiry=expiry;
      audit("Swati changed responsibility "+rr.area,{entity:"Responsibility",before:beforeResponsibility,after:rr,reason:reason,effectiveUntil:expiry});openModule("people");toast("Primary, executor and substitute saved with audit.");
    }
    else if(a==="save-delegation"){
      var di=Number(action.dataset.index),dr=state.responsibilities[di];
      if((user().view!=="COORDINATOR"&&user().view!=="FINANCE")||dr.primary!==user().name){audit("Denied cross-team delegation change");deny("people");return;}
      var beforeDelegation=cloneData(dr),delegateEl=document.querySelector("[data-delegate-field='assignee'][data-index='"+di+"']"),delegate=delegateEl&&delegateEl.value,allowedPeople=assignableTaskPeople();
      if(allowedPeople.indexOf(delegate)<0){toast("Choose a person from your own team.");return;}
      var backupEl=document.querySelector("[data-delegate-field='backup-assignee'][data-index='"+di+"']"),backupChoice=backupEl&&backupEl.value;
      if(!dr.backupLockedByHead&&backupChoice&&allowedPeople.indexOf(backupChoice)<0){toast("Choose a substitute from your own team.");return;}
      var delegationReasonEl=document.querySelector("[data-resp-field='reason'][data-index='"+di+"']"),delegationReason=String(delegationReasonEl&&delegationReasonEl.value||"").trim();
      var delegationExpiryEl=document.querySelector("[data-resp-field='expiry'][data-index='"+di+"']"),delegationExpiry=delegationExpiryEl&&delegationExpiryEl.value||"";
      if(!delegationReason){toast("Enter the reason before changing a team assignment.");return;}
      if(backupChoice&&backupChoice===delegate){toast("Executor and substitute must be different people.");return;}
      dr.assignee=delegate;if(!dr.backupLockedByHead)dr.backupAssignee=backupChoice||"";dr.reason=delegationReason;dr.expiry=delegationExpiry;
      audit(user().name+" changed execution of "+dr.area,{entity:"Delegation",before:beforeDelegation,after:dr,reason:delegationReason,effectiveUntil:delegationExpiry});openModule("people");toast("Executor and substitute saved within your team.");
    }
    else if(a==="catalog-module"){state.catalogFilter={query:"",module:action.dataset.catalogModule,status:""};state.catalogPage=1;save();openModule("catalog");}
    else if(a==="catalog-page"){state.catalogPage=Math.max(1,Number(action.dataset.page)||1);save();var catalogResults=document.getElementById("catalogResults");if(catalogResults)catalogResults.innerHTML=catalogRows();}
    else if(a==="add-event") simpleForm("event","Add synthetic event","<label for='eventTitle'>Event</label><input id='eventTitle' name='title' placeholder='For example: Parent meeting' required><label for='eventDate'>Date</label><input id='eventDate' name='date' type='date' required><label for='eventOwner'>Responsible person</label><input id='eventOwner' name='owner' placeholder='Name the Primary owner' required><p class='field-hint'>This stays on this browser. Google Calendar and reminders are Later.</p>");
    else if(a==="fund-entry") simpleForm("fund","Add funds received","<label for='fundSource'>Source</label><input id='fundSource' name='source' placeholder='Who provided the funds?' required><label for='fundAmount'>Amount received</label><input id='fundAmount' name='amount' type='number' inputmode='decimal' min='0.01' step='0.01' placeholder='0' required><label for='fundReference'>Reference</label><input id='fundReference' name='reference' placeholder='Bank, receipt or approval reference' required><p class='field-hint'>Funds become available only after this entry is saved and audited.</p>");
    else if(a==="inventory-entry") simpleForm("inventory","Add a completely new item","<label for='invCategory'>Category</label><select id='invCategory' name='category'><option>School stores</option><option>Books</option><option>Food</option><option>Kitchen</option><option>Furniture</option><option>Electronics</option><option>Housekeeping</option><option>Safety</option><option>Other</option></select><p class='field-hint'>Choose where the new item belongs.</p><label for='invItem'>New item name</label><input id='invItem' name='item' placeholder='For example: Garden hose' required><p class='field-hint'>Existing items should use Add or Issue from their row.</p><label for='invQty'>Opening balance quantity</label><input id='invQty' name='qty' type='number' inputmode='decimal' min='0' step='0.01' placeholder='0' required><label for='invRate'>Opening rate per unit</label><input id='invRate' name='rate' type='number' inputmode='decimal' min='0' step='0.01' placeholder='0' required><p class='field-hint'>Opening value is quantity × rate.</p><label for='invModel'>Model number, if applicable</label><input id='invModel' name='model' placeholder='Model or serial number'><label for='invReason'>Remark</label><input id='invReason' name='reason' placeholder='Purpose, unit or condition' required><p class='field-hint'>This creates one new master item and one opening-stock movement.</p>");
    else if(a==="expense-entry") simpleForm("expense","Record food or operating expense","<label for='expenseCategory'>Category</label><select id='expenseCategory' name='category'><option>Food</option><option>Housekeeping</option><option>Maintenance</option><option>Transport</option><option>School stores</option><option>Other</option></select><label for='expenseDetail'>Item / expense detail</label><input id='expenseDetail' name='detail' placeholder='What was purchased or paid?' required><label for='expenseQty'>Quantity</label><input id='expenseQty' name='quantity' placeholder='Number, unit or varied'><label for='expenseAmount'>Price / amount</label><input id='expenseAmount' name='amount' type='number' inputmode='decimal' min='0.01' step='0.01' placeholder='0' required><label for='expensePerson'>RM / submitted by</label><input id='expensePerson' name='person' placeholder='Name of staff member' required><label for='expenseVendor'>Vendor</label><input id='expenseVendor' name='vendor' placeholder='Supplier or payee'><label for='expenseAccount'>Account holder name</label><input id='expenseAccount' name='accountHolder' placeholder='Account holder'><label for='expenseMode'>Mode</label><input id='expenseMode' name='mode' placeholder='Cash, bank or training'><label for='expenseComments'>Comments</label><input id='expenseComments' name='comments' placeholder='Purpose or approval note'><p class='field-hint'>Bill/file link is marked Later until secure Drive is connected. The expense remains pending until independently checked.</p>");
    else if(a==="food-entry") simpleForm("foodLog","Add daily food record","<label for='foodDate'>Date</label><input id='foodDate' name='date' type='date' required><label for='foodAttendance'>Attendance</label><input id='foodAttendance' name='attendance' placeholder='For example 120/137' required><label for='foodMenu'>Menu</label><input id='foodMenu' name='menu' placeholder='Meal served' required><label for='foodOil'>Oil</label><input id='foodOil' name='oil' placeholder='For example 300 ml'><label for='foodToor'>Toor Daal</label><input id='foodToor' name='toor' placeholder='Quantity or —'><label for='foodRice'>Rice</label><input id='foodRice' name='rice' placeholder='Quantity or —'><label for='foodVegetables'>Sabzi</label><input id='foodVegetables' name='vegetables' placeholder='Quantity or —'><label for='foodOther'>Other ingredients / remark</label><input id='foodOther' name='other' placeholder='Roti, poha, chana, besan, curd or oil in dough'><p class='field-hint'>Cylinder bill/photo links remain Later until secure Drive is connected.</p>");
    else if(a==="transport-entry") simpleForm("transport","Add or update transport assignment","<label for='transportStudent'>Student</label><input id='transportStudent' name='student' list='studentList' placeholder='Search student name' required><datalist id='studentList'>"+state.students.map(function(s){return "<option value='"+esc(s.name)+"'>"+esc(s.className)+"</option>";}).join("")+"</datalist><label for='transportVillage'>Village</label><input id='transportVillage' name='village' placeholder='Village or stop' required><label for='transportTime'>Time slot</label><input id='transportTime' name='timeSlot' placeholder='For example 08:00–08:35' required><label for='transportVehicle'>Vehicle / route</label><input id='transportVehicle' name='vehicle' placeholder='Yellow-01, White-01 or Non-Transport' required><label for='transportDriver'>Driver</label><input id='transportDriver' name='driver' placeholder='Assigned driver'><p class='field-hint'>This updates only the synthetic route table on this browser.</p>");
    else if(a==="export-fees") {var exportMonths=["July","August","September","October","November","December","January","February","March","April"];downloadCsv("KVN_fee_register.csv",["Sr.No.","Child's Name","Father's Name","Mobile Number","Admission Year","Grade","Current Grade","Sex","Ethnicity","Service","Village Name","Slab","Base Fees","Donation Amount","Transport Fees","Total Fees"].concat(exportMonths).concat(["Paid","Balance"]),state.feeLedger.map(function(r){return [r.id,r.student,r.father,r.mobile,r.admissionYear,r.className,r.currentGrade,r.sex,r.ethnicity,r.service,r.village,r.slab,(r.schoolDue/3)-r.donation,r.donation,r.transportDue/3,r.totalFees].concat(exportMonths.map(function(m){return r.months[m]||0;})).concat([r.schoolPaid+r.transportPaid,Math.max(0,r.schoolDue+r.transportDue-r.schoolPaid-r.transportPaid)]);}));}
    else if(a==="export-inventory"){
      var exportRows=state.fundLedger.map(function(f){return ["Funds",f.id,f.at,f.type,f.source,"","",f.amount,"",f.person,f.status];})
        .concat(state.inventoryMovements.map(function(m){return ["Stock",m.id,m.at,m.kind||m.direction,m.item,m.direction==="Received"?m.qty:"",m.direction==="Received"?"":m.qty,m.rate,m.amount,m.person,m.reason+" · balance "+m.balanceAfter];}))
        .concat(state.expenses.map(function(x){return ["Expense",x.id,x.at,x.category,x.detail,"","",x.amount,x.amount,x.person,x.status];}));
      downloadCsv("KVN_operations_register.csv",["Register","ID","Date","Type","Detail","In quantity","Out quantity","Rate","Value / amount","Person","Status, reason or balance"],exportRows);
    }
    else if(a==="new-task") newTaskForm();
    else if(a==="obligation") openTaskForObligation(action.dataset.id);
    else if(a==="facility-check") simpleForm("facility","Facility check · "+action.dataset.check,"<input type='hidden' name='check' value='"+esc(action.dataset.check)+"'><label for='facilityStatus'>Status</label><select id='facilityStatus' name='status'><option value='good'>Good</option><option value='review'>Needs review</option><option value='problem'>Problem</option></select><p class='field-hint'>Choose the colour seen today.</p><label for='facilityNote'>Finding and evidence</label><textarea id='facilityNote' name='note' placeholder='Describe what you saw and the next action' required></textarea><p class='field-hint'><strong>Later:</strong> photo evidence after secure Drive storage, consent and role access.</p>");
    else if(a==="reset"){if(confirm("Reset only the synthetic records on this device?")){DATA_GATEWAY.clear();state=initialState();render();toast("Synthetic records reset.");}}
  });

  function openTaskForObligation(id) {
    var o=state.obligations.find(function(x){return x.id===id;}); if(!o)return;
    simpleForm("obligation","Compliance · "+o.title,"<input type='hidden' name='obligationId' value='"+o.id+"'><label for='oblStatus'>Status</label><select id='oblStatus' name='status'><option value='good' "+(o.status==="good"?"selected":"")+">Completed, evidence ready</option><option value='review' "+(o.status==="review"?"selected":"")+">Needs review</option><option value='problem' "+(o.status==="problem"?"selected":"")+">Problem</option><option value='pending' "+(o.status==="pending"?"selected":"")+">Pending approval</option></select><label for='oblEvidence'>Evidence note</label><textarea id='oblEvidence' name='evidence' placeholder='Describe the evidence or reason' required>"+esc(o.evidence||"")+"</textarea><p class='field-hint'>Material safety and compliance work cannot be self-approved.</p>");
  }

  document.addEventListener("change",function(e){
    if(e.target.id==="languageSelect"){
      var selectedLanguageName=e.target.options[e.target.selectedIndex].text,wasSarasOpen=sarasDialog.open;
      state.language=e.target.value;save();render();
      if(wasSarasOpen)sarasOpen();
      toast("Language: "+selectedLanguageName);
    }
    if(e.target.matches("[data-action='change-class']")){state.attendanceClass=e.target.value;save();document.getElementById("panelContent").innerHTML=dialogHead("Synthetic working flow","Attendance","panelDialog")+attendanceBody();}
    if(e.target.id==="catalogModule"||e.target.id==="catalogStatus"){state.catalogFilter.query=document.getElementById("catalogSearch").value;state.catalogFilter.module=document.getElementById("catalogModule").value;state.catalogFilter.status=document.getElementById("catalogStatus").value;state.catalogPage=1;save();document.getElementById("catalogResults").innerHTML=catalogRows();}
    if(["feeClassFilter","feeSlabFilter","feeStatusFilter"].indexOf(e.target.id)>=0){state.feeFilter.className=document.getElementById("feeClassFilter").value;state.feeFilter.slab=document.getElementById("feeSlabFilter").value;state.feeFilter.status=document.getElementById("feeStatusFilter").value;state.feePage=1;save();document.getElementById("feeResults").innerHTML=feeTableRows();}
    if(e.target.matches("[data-report-status]"))applyReportFilter(e.target.dataset.reportStatus);
    if(e.target.matches("[data-report-filter]"))applyReportFilter(e.target.dataset.reportFilter);
    if(e.target.id==="quickKind"||e.target.id==="quickItem")updateQuickInventoryPreview();
  });
  document.addEventListener("input",function(e){
    if(e.target.id==="studentSearch") document.getElementById("studentResults").innerHTML=studentRows(e.target.value,(user().view==="COORDINATOR"||user().view==="HEAD")?state.studentClassView:"");
    if(e.target.id==="catalogSearch"){state.catalogFilter.query=e.target.value;state.catalogPage=1;save();document.getElementById("catalogResults").innerHTML=catalogRows();}
    if(e.target.id==="feeSearch"){state.feeFilter.query=e.target.value;state.feePage=1;save();document.getElementById("feeResults").innerHTML=feeTableRows();}
    if(e.target.matches("[data-report-query]"))applyReportFilter(e.target.dataset.reportQuery);
    if(e.target.id==="quickQty"||e.target.id==="quickRate")updateQuickInventoryPreview();
  });
  document.addEventListener("submit",function(e){
    e.preventDefault();
    if(busy){toast("Already saving. Please wait.");return;}
    busy=true; setTimeout(function(){busy=false;},500);
    var f=e.target, data=new FormData(f);
    if(f.id==="leadershipForm"){
      if(user().view!=="HEAD"){busy=false;formDialog.close();denyMutation("leadership roles");return;}
      var roleCode=String(data.get("roleCode")||""),leaderRole=state.leadership[roleCode];if(!leaderRole){busy=false;toast("Leadership role not found.");return;}
      var newHolder=String(data.get("holder")||""),changeMode=String(data.get("mode")||"Permanent"),effectiveFrom=String(data.get("effectiveFrom")||""),effectiveUntil=String(data.get("effectiveUntil")||""),leaderReason=String(data.get("reason")||"").trim();
      var otherHolder=roleCode==="COORDINATOR"?activeLeader("OPERATIONS"):activeLeader("COORDINATOR");
      if(allStaffNames().indexOf(newHolder)<0||newHolder===otherHolder){busy=false;toast("Choose a different active staff member for this role.");return;}
      if(!leaderReason||!effectiveFrom){busy=false;toast("Reason and effective-from date are required.");return;}
      if(changeMode==="Acting"&&!effectiveUntil){busy=false;toast("An acting appointment needs an end date.");return;}
      if(effectiveUntil&&effectiveUntil<effectiveFrom){busy=false;toast("End date cannot be before the start date.");return;}
      var beforeLeader=cloneData(leaderRole),oldHolder=leaderRole.holder;
      state.leadership[roleCode]={role:leaderRole.role,holder:newHolder,original:leaderRole.original||DEFAULT_LEADERS[roleCode],mode:changeMode,from:effectiveFrom,until:changeMode==="Acting"?effectiveUntil:"",reason:leaderReason};
      state.responsibilities.forEach(function(row){if(row.primary===oldHolder)row.primary=newHolder;if(row.assignee===oldHolder)row.assignee=newHolder;if(row.backupAssignee===oldHolder)row.backupAssignee=newHolder;if(row.leaderBackup===oldHolder)row.leaderBackup=newHolder;});
      state.tasks.forEach(function(task){if(task.owner===oldHolder&&task.status!=="good"){task.owner=newHolder;state.taskRecords[task.id]=state.taskRecords[task.id]||[];state.taskRecords[task.id].unshift({at:nowStamp(),actor:"Swati",note:"Open work transferred from "+oldHolder+" to "+newHolder+" with leadership change."});}});
      state.questions.forEach(function(question){if(question.to===oldHolder&&question.status!=="answered")question.to=newHolder;});
      state.obligations.forEach(function(item){if(item.owner===oldHolder&&item.status!=="good")item.owner=newHolder;if(item.backup===oldHolder)item.backup=newHolder;});
      state.events.forEach(function(event){if(event.owner===oldHolder&&event.status!=="good")event.owner=newHolder;});
      audit("Swati changed "+leaderRole.role+" role-holder from "+oldHolder+" to "+newHolder,{entity:"Leadership",before:beforeLeader,after:state.leadership[roleCode],reason:leaderReason,effectiveFrom:effectiveFrom,effectiveUntil:effectiveUntil});
      save();formDialog.close();openModule("people");toast("Leadership role and open work transferred with audit.");
    } else if(f.id==="attendanceForm"){
      if(!canMarkStudentAttendance()){busy=false;denyMutation("student attendance");return;}
      var beforeAttendance=cloneData(state.attendance[state.attendanceClass]||{}),map={}; state.students.filter(function(s){return s.className===state.attendanceClass;}).forEach(function(s){map[s.id]=false;});
      data.getAll("present").forEach(function(id){map[id]=true;}); state.attendance[state.attendanceClass]=map;
      audit("Saved "+state.attendanceClass+" attendance with "+Object.values(map).filter(Boolean).length+" present",{entity:"Student attendance",before:beforeAttendance,after:map,reason:"Daily attendance save"}); save(); panelDialog.close(); toast("Attendance saved and read back.");
    } else if(f.id==="supportAttendanceForm"){
      if(user().view!=="FINANCE"){busy=false;denyMutation("support attendance");return;}
      var beforeSupportAttendance=cloneData(state.supportAttendance),presentSupport=data.getAll("presentSupport");state.supportAttendance={};
      supportNames().forEach(function(name){state.supportAttendance[name]=presentSupport.indexOf(name)>=0;});
      audit("Saved support attendance with "+presentSupport.length+" of "+supportNames().length+" present",{entity:"Support attendance",before:beforeSupportAttendance,after:state.supportAttendance,reason:"Daily attendance"});save();panelDialog.close();toast("Support attendance saved with audit.");
    } else if(f.id==="studentForm"){
      if(!canManageStudents()){busy=false;denyMutation("student records");return;}
      var name=String(data.get("name")).trim();
      if(state.students.some(function(s){return s.name.toLowerCase()===name.toLowerCase();})){busy=false;toast("Possible duplicate blocked for review.");return;}
      var id="S"+String(state.students.length+1).padStart(3,"0");
      state.students.push({id:id,name:name,className:data.get("className"),guardian:data.get("guardian"),active:true}); audit("Added synthetic student "+id); save(); formDialog.close(); openModule("students"); toast("Synthetic student added.");
    } else if(f.id==="receiptForm"){
      if(!canMutateOperations()){busy=false;formDialog.close();denyMutation("fees");return;}
      var school=Number(data.get("school")),transport=Number(data.get("transport")),receiptStudent=String(data.get("student")||"").trim(),receiptReference=String(data.get("reference")||"").trim(),receiptMode=String(data.get("mode")||"Training");
      if(school+transport<=0){busy=false;toast("Enter a school or transport amount.");return;}
      var ledger=state.feeLedger.find(function(x){return x.student===receiptStudent;});if(!ledger){busy=false;toast("Choose an exact student from the authoritative master.");return;}
      if(school>Math.max(0,ledger.schoolDue-ledger.schoolPaid)||transport>Math.max(0,ledger.transportDue-ledger.transportPaid)){busy=false;toast("Receipt exceeds the outstanding school or transport balance.");return;}
      if(!receiptReference){busy=false;toast("Enter a unique receipt or payment reference.");return;}
      if(state.receipts.some(function(row){return String(row.reference||"").toLowerCase()===receiptReference.toLowerCase();})){busy=false;toast("That receipt reference already exists. Duplicate blocked.");return;}
      var rid=nextId(state.receipts,"R",204),beforeLedger=cloneData(ledger);state.receipts.unshift({id:rid,student:receiptStudent,schoolCategory:data.get("schoolCategory"),school:school,transportCategory:data.get("transportCategory"),transport:transport,mode:receiptMode,reference:receiptReference,reversed:false,at:nowStamp()});
      ledger.schoolPaid+=school;ledger.transportPaid+=transport;ledger.schoolCategory=data.get("schoolCategory");ledger.transportCategory=data.get("transportCategory");
      audit("Recorded synthetic fee receipt "+rid,{entity:"Fee receipt",before:beforeLedger,after:{receipt:state.receipts[0],ledger:ledger},reason:receiptReference});save();formDialog.close();openModule("fees");toast("Receipt saved. School and transport remain separate.");
    } else if(f.id==="batchFeesForm"){
      if(!canMutateOperations()){busy=false;formDialog.close();denyMutation("fees");return;}
      var feeLines=String(data.get("rows")||"").split(/\r?\n/).map(function(line){return line.trim();}).filter(Boolean),feeBatch=[],knownReferences={},simulatedFeeBalances={};
      state.receipts.forEach(function(row){knownReferences[String(row.reference||"").toLowerCase()]=true;});
      state.feeLedger.forEach(function(row){simulatedFeeBalances[row.student]={school:Math.max(0,row.schoolDue-row.schoolPaid),transport:Math.max(0,row.transportDue-row.transportPaid)};});
      for(var fi=0;fi<feeLines.length;fi+=1){var feeParts=feeLines[fi].split("|").map(function(part){return part.trim();}),feeStudent=state.feeLedger.find(function(row){return row.student===feeParts[0];}),feeSchool=Number(feeParts[1]),feeTransport=Number(feeParts[2]),feeMode=feeParts[3],feeReference=feeParts[4],remaining=feeStudent&&simulatedFeeBalances[feeStudent.student];if(feeParts.length<5||!feeStudent||feeSchool<0||feeTransport<0||feeSchool+feeTransport<=0||!feeMode||!feeReference||knownReferences[String(feeReference).toLowerCase()]||feeSchool>remaining.school||feeTransport>remaining.transport){busy=false;toast("Batch row "+(fi+1)+" is invalid, duplicated or exceeds balance. Nothing was saved.");return;}remaining.school-=feeSchool;remaining.transport-=feeTransport;knownReferences[String(feeReference).toLowerCase()]=true;feeBatch.push({ledger:feeStudent,student:feeParts[0],school:feeSchool,transport:feeTransport,mode:feeMode,reference:feeReference});}
      if(!feeBatch.length){busy=false;toast("Enter at least one batch row.");return;}
      feeBatch.forEach(function(row){var receiptId=nextId(state.receipts,"R",204);state.receipts.unshift({id:receiptId,student:row.student,schoolCategory:"Tuition",school:row.school,transportCategory:row.transport?"Batch transport":"None",transport:row.transport,mode:row.mode,reference:row.reference,reversed:false,at:nowStamp(),batch:true});row.ledger.schoolPaid+=row.school;row.ledger.transportPaid+=row.transport;});
      audit("Recorded "+feeBatch.length+" batch fee receipts",{entity:"Fee batch",after:feeBatch.map(function(row){return {student:row.student,school:row.school,transport:row.transport,reference:row.reference};}),reason:"Validated batch entry"});save();formDialog.close();openModule("fees");toast(feeBatch.length+" fee rows saved after full validation.");
    } else if(f.id==="reverseStockForm"){
      if(!canMutateOperations()){busy=false;formDialog.close();denyMutation("inventory");return;}
      var movementId=String(data.get("movementId")||""),movement=state.inventoryMovements.find(function(row){return row.id===movementId;}),correctionReason=String(data.get("reason")||"").trim();
      if(!movement||movement.reversed||movement.contra){busy=false;toast("Movement is already corrected or unavailable.");return;}
      if(!correctionReason){busy=false;toast("Enter a correction reason.");return;}
      var correctedPosition=inventoryPositionWithout(movement.item,movement.id);if(!correctedPosition){busy=false;toast("This correction would make a later issue exceed stock. Reverse the later movement first.");return;}
      var correctedItem=state.inventory.find(function(row){return row.item===movement.item;}),beforeCorrection={movement:cloneData(movement),item:cloneData(correctedItem)};
      movement.reversed=true;movement.reversedAt=nowStamp();movement.reversedBy=user().name;movement.reversalReason=correctionReason;
      correctedItem.qty=correctedPosition.qty;correctedItem.avgRate=correctedPosition.avgRate;correctedItem.status=correctedItem.qty<=2?"problem":correctedItem.qty<=8?"review":"good";
      var contraId=nextId(state.inventoryMovements,"M",402);state.inventoryMovements.unshift({id:contraId,at:nowStamp(),item:movement.item,category:movement.category,kind:"Reversal / contra of "+movement.id,direction:movement.direction==="Received"?"Issued":"Received",qty:Number(movement.qty||0),rate:Number(movement.rate||0),amount:Number(movement.amount||0),balanceAfter:correctedItem.qty,supplier:"—",person:user().name,reason:correctionReason,contra:true,originalMovementId:movement.id});
      audit("Reversed stock movement "+movement.id+" with contra "+contraId,{entity:"Inventory correction",before:beforeCorrection,after:{movement:movement,contra:state.inventoryMovements[0],item:correctedItem},reason:correctionReason});save();formDialog.close();openInventoryItem(movement.item);toast("Stock correction saved; original and contra are retained.");
    } else if(f.id==="batchInventoryForm"){
      if(!canMutateOperations()){busy=false;formDialog.close();denyMutation("inventory");return;}
      var stockLines=String(data.get("rows")||"").split(/\r?\n/).map(function(line){return line.trim();}).filter(Boolean),stockBatch=[],simulated={};state.inventory.forEach(function(item){simulated[item.item]={qty:Number(item.qty),avgRate:Number(item.avgRate)};});
      for(var si=0;si<stockLines.length;si+=1){var stockParts=stockLines[si].split("|").map(function(part){return part.trim();}),stockKind=stockParts[0],stockItem=state.inventory.find(function(item){return item.item===stockParts[1];}),stockQty=Number(stockParts[2]),stockRate=Number(stockParts[3]),stockReason=stockParts[4];if(stockParts.length<5||["Add","Issue"].indexOf(stockKind)<0||!stockItem||stockQty<=0||stockKind==="Add"&&stockRate<=0||!stockReason){busy=false;toast("Stock batch row "+(si+1)+" is invalid. Nothing was saved.");return;}var simulatedItem=simulated[stockItem.item];if(stockKind==="Issue"&&simulatedItem.qty<stockQty){busy=false;toast("Stock batch row "+(si+1)+" would over-issue "+stockItem.item+". Nothing was saved.");return;}if(stockKind==="Add"){var simulatedNewQty=simulatedItem.qty+stockQty;simulatedItem.avgRate=(simulatedItem.qty*simulatedItem.avgRate+stockQty*stockRate)/simulatedNewQty;simulatedItem.qty=simulatedNewQty;}else{stockRate=simulatedItem.avgRate;simulatedItem.qty-=stockQty;}stockBatch.push({kind:stockKind,item:stockItem,qty:stockQty,rate:stockRate,reason:stockReason});}
      if(!stockBatch.length){busy=false;toast("Enter at least one stock batch row.");return;}
      stockBatch.forEach(function(row){var oldQty=Number(row.item.qty),oldRate=Number(row.item.avgRate),newQty=row.kind==="Add"?oldQty+row.qty:oldQty-row.qty;if(row.kind==="Add")row.item.avgRate=(oldQty*oldRate+row.qty*row.rate)/newQty;row.item.qty=newQty;row.item.status=newQty<=2?"problem":newQty<=8?"review":"good";state.inventoryMovements.unshift({id:nextId(state.inventoryMovements,"M",402),at:nowStamp(),item:row.item.item,category:row.item.category,kind:row.kind==="Add"?"Batch stock in":"Batch stock out",direction:row.kind==="Add"?"Received":"Issued",qty:row.qty,rate:row.rate,amount:row.qty*row.rate,balanceAfter:newQty,supplier:"—",person:user().name,reason:row.reason,batch:true});});
      audit("Recorded "+stockBatch.length+" batch stock movements",{entity:"Stock batch",after:stockBatch.map(function(row){return {kind:row.kind,item:row.item.item,qty:row.qty,rate:row.rate,reason:row.reason};}),reason:"Validated batch entry"});save();formDialog.close();openModule("inventory");toast(stockBatch.length+" stock rows saved after full validation.");
    } else if(f.id==="taskForm"){
      var task=state.tasks.find(function(x){return x.id===data.get("taskId");});
      if(!task||(user().view!=="HEAD"&&!canOpenTask(task))){busy=false;formDialog.close();deny("questions");return;}
      var beforeTask=cloneData(task);task.status=data.get("status")||task.status;
      state.taskRecords=state.taskRecords||{};state.taskRecords[task.id]=state.taskRecords[task.id]||[];state.taskRecords[task.id].unshift({at:"Just now",actor:user().name,note:String(data.get("remark")).trim()+" · "+statusLabel(task.status)});
      audit("Replied to "+task.id+" and updated it to "+statusLabel(task.status),{entity:"Task",before:beforeTask,after:task,reason:String(data.get("remark")||"").trim()});save();formDialog.close();openModule("questions");toast("Reply, status and audit record saved.");
    } else if(f.id==="eventForm"){
      state.events.push({date:data.get("date"),title:data.get("title"),owner:data.get("owner"),status:"pending"});audit("Added synthetic calendar event "+data.get("title"));save();formDialog.close();openModule("calendar");toast("Event added to the synthetic calendar.");
    } else if(f.id==="quickInventoryForm"){
      if(!canMutateOperations()){busy=false;formDialog.close();denyMutation("inventory");return;}
      var quickItem=state.inventory.find(function(x){return x.item===data.get("item");}),quickQty=Number(data.get("qty")),quickKind=data.get("kind"),oldQty=Number(quickItem&&quickItem.qty||0),oldRate=Number(quickItem&&quickItem.avgRate||0),quickRate=quickKind==="Add"?Number(data.get("rate")):oldRate,beforeInventoryItem=cloneData(quickItem);
      if(!quickItem||quickQty<=0){busy=false;toast("Choose an existing item and a quantity.");return;}
      if(quickKind==="Add"&&quickRate<=0){busy=false;toast("Enter the purchase rate for stock in.");return;}
      if(quickKind==="Issue"&&quickItem.qty<quickQty){busy=false;toast("Cannot issue more than the available quantity.");return;}
      var movementValue=quickQty*quickRate,newQty=quickKind==="Add"?oldQty+quickQty:oldQty-quickQty;
      if(quickKind==="Add")quickItem.avgRate=newQty?(oldQty*oldRate+movementValue)/newQty:quickRate;
      quickItem.qty=newQty;quickItem.status=quickItem.qty<=2?"problem":quickItem.qty<=8?"review":"good";
      state.inventoryMovements.unshift({id:nextId(state.inventoryMovements,"M",402),at:nowStamp(),item:quickItem.item,category:quickItem.category,kind:quickKind==="Add"?"Stock in":"Stock out",direction:quickKind==="Add"?"Received":"Issued",qty:quickQty,rate:quickRate,amount:movementValue,balanceAfter:newQty,supplier:"—",person:user().name,reason:String(data.get("reason")||"Routine stock movement")});
      audit((quickKind==="Add"?"Stock in ":"Stock out ")+quickQty+" "+quickItem.item+" valued at "+currency(movementValue),{entity:"Inventory",before:beforeInventoryItem,after:quickItem,reason:String(data.get("reason")||"Routine stock movement")});save();formDialog.close();openModule("inventory");toast(quickItem.item+" saved · balance "+quickItem.qty+" · value "+currency(inventoryValue(quickItem))+".");
    } else if(f.id==="inventoryForm"){
      if(!canMutateOperations()){busy=false;formDialog.close();denyMutation("inventory");return;}
      var newName=String(data.get("item")).trim(),found=state.inventory.find(function(x){return x.item.toLowerCase()===newName.toLowerCase();}),qty=Number(data.get("qty")),openingRate=Number(data.get("rate"));
      if(found){busy=false;toast("That item already exists. Use Quick add / issue.");return;}
      state.inventory.push({item:newName,category:data.get("category"),openingQty:0,openingAvgRate:0,qty:qty,avgRate:openingRate,model:data.get("model")||"",remark:data.get("reason"),status:"review"});
      state.inventoryMovements.unshift({id:nextId(state.inventoryMovements,"M",402),at:nowStamp(),item:newName,category:data.get("category"),kind:"New item / opening stock",direction:"Received",qty:qty,rate:openingRate,amount:qty*openingRate,balanceAfter:qty,supplier:"—",person:user().name,reason:data.get("reason")});
      audit("Added new synthetic inventory item "+newName);save();formDialog.close();openModule("inventory");toast("New item added. Future movements use Quick add / issue.");
    } else if(f.id==="fundForm"){
      if(!canMutateOperations()){busy=false;formDialog.close();denyMutation("funds");return;}
      var fid=nextId(state.fundLedger,"F",103);state.fundLedger.unshift({id:fid,at:nowStamp(),type:"Funds received",source:data.get("source"),amount:Number(data.get("amount")),person:user().name,reference:data.get("reference"),status:"good"});
      audit("Recorded synthetic funds received "+fid);save();formDialog.close();openModule("inventory");toast("Funds received and available balance updated.");
    } else if(f.id==="expenseForm"){
      if(!canMutateOperations()){busy=false;formDialog.close();denyMutation("expenses");return;}
      var eid=nextId(state.expenses,"E",202);state.expenses.unshift({id:eid,at:nowStamp(),category:data.get("category"),detail:data.get("detail"),quantity:data.get("quantity")||"—",amount:Number(data.get("amount")),person:data.get("person"),vendor:data.get("vendor")||"—",accountHolder:data.get("accountHolder")||"—",mode:data.get("mode")||"—",comments:data.get("comments")||"—",status:"review"});
      state.fundLedger.unshift({id:nextId(state.fundLedger,"F",103),at:nowStamp(),type:"Funds committed",source:data.get("detail")+" · "+eid,amount:-Number(data.get("amount")),person:data.get("person"),reference:eid,status:"review"});
      audit("Recorded synthetic expense "+eid+" for review");state.operationsSection="expenses";save();formDialog.close();openModule("inventory");toast("Expense saved for independent review.");
    } else if(f.id==="foodLogForm"){
      if(!canMutateOperations()){busy=false;formDialog.close();denyMutation("food records");return;}
      state.foodLog.unshift({date:data.get("date"),day:"Recorded",attendance:data.get("attendance"),menu:data.get("menu"),oil:data.get("oil")||"—",toor:data.get("toor")||"—",rice:data.get("rice")||"—",vegetables:data.get("vegetables")||"—",roti:data.get("other")||"—",poha:"—",chana:"—",besan:"—",curd:"—",doughOil:"—",status:"review"});
      audit("Added synthetic daily food record");state.operationsSection="food";save();formDialog.close();openModule("inventory");toast("Food record saved for review.");
    } else if(f.id==="transportForm"){
      if(!canMutateOperations()){busy=false;formDialog.close();denyMutation("transport");return;}
      var transportRecord=state.transportRoster.find(function(x){return x.student===data.get("student");});
      if(!transportRecord){busy=false;toast("Choose a student from the synthetic master.");return;}
      var beforeTransport=cloneData(transportRecord);transportRecord.village=data.get("village");transportRecord.timeSlot=data.get("timeSlot");transportRecord.vehicle=data.get("vehicle");transportRecord.driver=data.get("driver")||"—";transportRecord.status="review";
      audit("Updated synthetic transport assignment for "+transportRecord.student,{entity:"Transport",before:beforeTransport,after:transportRecord,reason:"Route assignment update"});state.operationsSection="transport";save();formDialog.close();openModule("inventory");toast("Transport assignment saved for review.");
    } else if(f.id==="newTaskForm"){
      var selectedOwner=data.get("owner"),selectedKind=data.get("kind")||"Task",taskTitle=String(data.get("title")||"").trim();
      if(assignableTaskPeople().indexOf(selectedOwner)<0){busy=false;audit("Denied cross-team task assignment");formDialog.close();deny("questions");return;}
      if(selectedKind==="Reminder"&&selectedOwner!==user().name){busy=false;toast("A reminder is for yourself. Choose Task or Question for another person.");return;}
      if(!taskTitle){busy=false;toast("Enter the task or question before saving.");return;}
      var nid=nextId(state.tasks,"T",122);state.tasks.push({id:nid,title:taskTitle,owner:selectedOwner,createdBy:user().name,kind:selectedKind,status:"pending",due:data.get("due"),group:selectedKind});
      state.taskRecords=state.taskRecords||{};state.taskRecords[nid]=[{at:nowStamp(),actor:user().name,note:selectedKind+" created."}];
      audit("Created "+selectedKind.toLowerCase()+" "+nid+" for "+selectedOwner,{entity:"Task",after:{id:nid,title:taskTitle,owner:selectedOwner,due:data.get("due")},reason:"Direct assignment"});save();formDialog.close();openModule("questions");toast(selectedKind+" saved for "+selectedOwner+".");
    } else if(f.id==="obligationForm"){
      var ob=state.obligations.find(function(x){return x.id===data.get("obligationId");});if(!ob){busy=false;toast("Compliance item not found.");return;}
      var beforeObligation=cloneData(ob),evidenceNote=String(data.get("evidence")||"").trim();if(!evidenceNote){busy=false;toast("Enter the evidence note.");return;}
      var requestedComplianceStatus=data.get("status"),selfApprovalBlocked=requestedComplianceStatus==="good"&&user().name===ob.owner;ob.status=selfApprovalBlocked?"review":requestedComplianceStatus;ob.evidence=evidenceNote;ob.submittedBy=user().name;ob.submittedAt=nowStamp();
      audit("Updated compliance item "+ob.id+" with evidence note",{entity:"Compliance",before:beforeObligation,after:ob,reason:evidenceNote});save();formDialog.close();openModule("calendar");toast(selfApprovalBlocked?"Evidence saved for independent approval; self-approval was blocked.":"Compliance status and evidence saved. Approval remains separate.");
    } else if(f.id==="facilityForm"){
      var routine=ROUTINE_CHECKS.find(function(x){return x.title===data.get("check");});if(routine){state.routineStatuses=state.routineStatuses||{};state.routineStatuses[routine.title]=data.get("status");}
      audit("Recorded "+data.get("check")+" with status "+data.get("status")+": "+String(data.get("note")).trim());save();formDialog.close();openModule("facilities");toast("Routine check recorded.");
    } else if(f.id==="sarasForm"){
      var q=String(data.get("question")||"").trim();if(!q){busy=false;toast("Type or speak a question before sending.");return;}
      state.sarasMessages=state.sarasMessages||[];state.sarasMessages.push({role:"user",text:q});
      var ans=sarasAnswer(q);
      if(ans){state.sarasMessages.push({role:"assistant",text:ans});}
      else {
        var owner=/fee|money|stock|support/i.test(q)?activeLeader("OPERATIONS"):activeLeader("COORDINATOR"),ownerDisplay=localizedPersonName(owner);
        ans=localText("I could not safely answer that from approved KVN guidance. I preserved your exact question and routed it to "+ownerDisplay+" so you do not need to repeat it.","मैं स्वीकृत KVN मार्गदर्शन से इसका सुरक्षित उत्तर नहीं दे सकी। आपका वही प्रश्न सुरक्षित रखकर "+ownerDisplay+" को भेज दिया है।","મંજૂર KVN માર્ગદર્શનમાંથી હું સુરક્ષિત જવાબ આપી શકી નથી. તમારો મૂળ પ્રશ્ન સાચવીને "+ownerDisplay+"ને મોકલ્યો છે.","मंजूर KVN मार्गदर्शनातून मी सुरक्षित उत्तर देऊ शकले नाही. तुमचा मूळ प्रश्न जतन करून "+ownerDisplay+"कडे पाठवला आहे.");
        state.sarasMessages.push({role:"assistant",text:ans});
        state.questions.push({id:nextId(state.questions,"Q",32),from:user().name,to:owner,question:q,answer:"",status:"open"});
        var routedId=nextId(state.tasks,"T",122);state.tasks.push({id:routedId,title:"Reply: "+q,owner:owner,createdBy:user().name,kind:"Question",status:"pending",due:"Today",group:"Question"});
        state.taskRecords=state.taskRecords||{};state.taskRecords[routedId]=[{at:nowStamp(),actor:user().name,note:"Question routed by Saras."}];
        audit("Saras routed an unanswered question to "+owner,{entity:"Question",after:{taskId:routedId,owner:owner,question:q},reason:"No approved local answer"});
      }
      save();f.reset();renderSarasMessages();if(state.voice&&window.speechSynthesis&&ans){speechSynthesis.cancel();var spoken=new SpeechSynthesisUtterance(ans);spoken.lang={EN:"en-IN",HI:"hi-IN",GU:"gu-IN",MR:"mr-IN"}[state.language]||"en-IN";speechSynthesis.speak(spoken);}
    }
  });

  window.addEventListener("error",function(){toast("This screen could not finish. Your previous saved state is still available.");});
  var languageObserver=new MutationObserver(function(mutations){mutations.forEach(function(m){m.addedNodes.forEach(function(n){if(n.nodeType===1)applyLanguage(n);});});});
  [panelDialog,formDialog,sarasDialog].forEach(function(el){languageObserver.observe(el,{childList:true,subtree:true});});
  if((window.KVN_CATALOG||[]).length!==228){console.warn("Catalogue mismatch", (window.KVN_CATALOG||[]).length);}
  render();
}());
