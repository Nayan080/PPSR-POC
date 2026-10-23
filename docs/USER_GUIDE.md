# AssetCheck — User Guide (Hinglish)

Yeh guide aapko step-by-step batayegi ki AssetCheck kaise use karna hai — login se lekar search karne, result samajhne aur history dekhne tak. Mobile, tablet aur computer — teeno par app same tarah se kaam karta hai.

---

## 1. AssetCheck kya hai?

AssetCheck ek **independent service** hai jo Australia ke **PPSR (Personal Property Securities Register)** mein search karke aapko batata hai ki kisi vehicle ya asset par **loan / security interest** to nahi hai.

Simple bhasha mein:

- Agar aap koi **used car** khareed rahe ho, to pehle check karo ki us par kisi finance company ka paisa baaki to nahi hai.
- Agar aap kisi **company ko loan** de rahe ho, to check karo ki uske assets pehle se kisi aur ke paas giravi (security) to nahi hain.
- Har **VIN search** ke saath aapko vehicle details bhi milti hain — aur yeh bhi ki gaadi **written-off** (accident mein total loss) ya **stolen** (chori) report hui hai ya nahi.

> **Dhyan dein:** AssetCheck sarkari website nahi hai. Yeh AFSA (Australian Financial Security Authority) se affiliated nahi hai. Results PPSR se laaye jaate hain.

---

## 2. Website (Landing page)

App kholte hi (`/` address par) sabse pehle **landing page** aata hai. Upar menu mein yeh sections hain — click karte hi page usi section par scroll ho jaata hai:

| Section | Kya milega |
| --- | --- |
| **Home** | AssetCheck kya karta hai, aur ek example result ka preview |
| **How it works** | 3 steps mein search kaise hota hai, aur har search mein kya-kya milta hai |
| **About** | Yeh service kiske liye hai — private buyers, dealers, lenders/brokers |
| **Pricing** | Per-search price aur plans (Pay as you go, Business, Enterprise) |

Upar right mein **Log in** aur **Sign up** buttons hain. Agar aap pehle se logged in ho, to unki jagah **"Go to dashboard"** dikhta hai.

> **Mobile par:** Upar right mein **☰ (menu)** icon dabao — sections aur Log in / Sign up wahan milenge.

---

## 3. Account banana aur Login karna

### Naya account

1. Landing page par **"Sign up"** (ya login page par **"Create an account"**) par click karo.
2. Apna **Given name**, **Family name**, aur (agar hai to) **Organisation** ka naam bharo.
3. **Email** aur **Password** daalo (password kam se kam 8 characters ka hona chahiye).
4. Password dobara **Confirm password** mein likho.
5. Terms and conditions wala box tick karo aur **"Create account"** dabao.

Account bante hi aap seedha Dashboard par pahunch jaoge.

### Login

1. **Email address** aur **Password** daalo.
2. **"Log in"** button dabao.

> **Demo ke liye:** `demo@ppsr.test` / `Password123!`

### Logout

Upar right corner mein apne naam (mobile par aapke **initials**, jaise "AM") par click karo → **"Log out"**.

> Security ke liye, browser tab band karte hi aap automatically logout ho jaate ho. Agar kaafi der tak kuch nahi kiya to session expire ho jaata hai aur dobara login karna padta hai.

---

## 4. Dashboard (Home screen)

Login ke baad aap **Dashboard** (`/dashboard`) par pahunchte ho. Logo par click karke bhi yahin wapas aa sakte ho. Yahan aapko milega:

| Section | Kya batata hai |
| --- | --- |
| **Quick VIN search** | Seedha yahin se gaadi ka VIN daal kar search kar sakte ho |
| **Searches this month** | Is mahine aapne kitne search kiye |
| **Spend this month** | Is mahine searches par kitna kharcha hua |
| **With security interests (30 days)** | Pichhle 30 din ke kitne searches mein loan / interest mila |
| **Written-off or stolen (30 days)** | Pichhle 30 din mein kitni gaadiyan written-off ya stolen nikli |
| **Recent searches** | Aapke latest searches — kisi par bhi click karke result dobara dekh sakte ho |

---

## 5. Search kaise karein

Upar menu mein **"New search"** par jaao. Teen tarah ke search hain:

### (a) Serial number search — gaadi, boat, aircraft ke liye

Yeh sabse common search hai, jaise used car check karne ke liye.

1. **Serial number type** chuno — car ke liye **VIN** (Vehicle Identification Number).
2. **Serial number** box mein VIN likho. Space ya dash (-) daal doge to bhi chalega — app khud saaf kar dega, aur small letters bhi automatically capital ban jaayenge.
3. (Optional) **Your reference** mein apna koi note likho — jaise stock number ya deal number ("Trade-in #4471").
4. **"Search"** dabao.

> **VIN kahan milega?** Gaadi ke windscreen ke neeche (driver side), door frame ke sticker par, ya registration papers mein. VIN hamesha **17 characters** ka hota hai.

### (b) Organisation grantor search — company ke liye

Kisi company ke assets par registered interests dekhne ke liye.

1. **Identifier type** chuno — **ACN**, **ABN**, ARBN ya ARSN.
2. **Identifier number** daalo (ACN 9 digits ka, ABN 11 digits ka hota hai). Spaces chalenge.
3. **"Search"** dabao.

> **Tip:** ABN ke andar company ka ACN hota hai (last 9 digits), isliye ABN se search karoge to ACN wale registrations bhi mil jaayenge.

### (c) Registration number search

Agar aapke paas kisi registration ka **15-digit number** hai, to seedha woh ek registration dekh sakte ho.

> **Mobile par:** Teeno tabs chhote naam se dikhte hain — **Serial no.**, **Organisation**, **Reg. no.**

---

## 6. Result kaise samjhein

Search karte hi result page khul jaata hai.

### Upar wala summary box

| Field | Matlab |
| --- | --- |
| **PPSR search number** | PPSR dwara diya gaya official search number — apne records mein zaroor rakho |
| **Search criteria** | Aapne kya search kiya tha |
| **Searched** | Search kis date aur time par hua |
| **Your reference** | Aapka apna note |
| **Order reference** | Hamara internal number (jaise S-0001004) — support se baat karte waqt kaam aata hai |
| **Fee** | Is search ka charge (GST sahit) |

### Rang (colour) wale result boxes

| Box | Matlab | Aapko kya karna chahiye |
| --- | --- | --- |
| 🟢 **No security interests registered** | Koi loan / interest registered nahi hai | Aage badh sakte ho (baaki checks karke) |
| 🟡 **X security interests registered** | Is property par kisi ka paisa baaki ho sakta hai | Khareedne / loan dene se pehle **secured party se contact karo** |
| 🟢 **Not written off or stolen** | Gaadi par koi negative record nahi | — |
| 🔴 **Recorded as written off** | Gaadi accident mein written-off ho chuki hai | Repair aur re-registration history zaroor check karo |
| 🔴 **Reported stolen** | Gaadi chori ki report hai | **Deal mat karo.** Police se contact karo |

### Vehicle details (sirf VIN search mein)

Make, model, saal, colour, body type, engine number, registration plate, state aur registration expiry date. Agar written-off ya stolen record hai to uski details (state, date, damage) bhi laal box mein dikhengi.

### Registrations list

Har registration mein dikhta hai:

- **Collateral** — kis cheez par interest hai (motor vehicle, equipment, company ke saare assets, etc.)
- **Grantor** — jisne security di (company ka naam aur ACN). Personal vehicles mein privacy ke liye grantor ka naam **nahi dikhaya jaata**.
- **Secured party** — jis finance company / lender ka interest hai, uska address aur email. **Isi se contact karna hota hai.**
- **Registration period** — registration kab se kab tak valid hai
- **PMSI** tag — matlab yeh loan isi cheez ko khareedne ke liye diya gaya tha (iski priority zyada hoti hai)

### Print karna

Result page par **"Print"** button dabao. Print / PDF mein sirf zaroori result aata hai — menu aur buttons apne aap hat jaate hain. Mobile par browser ke share menu se **"Save as PDF"** bhi kar sakte ho.

---

## 7. Search history

Menu mein **"Search history"** par jaao.

- Aapke **last 100 searches** dikhte hain, saath mein total kharcha bhi.
- Upar wale box mein **VIN, ACN, apna reference ya search number** likh kar filter karo.
- Kisi bhi row (mobile par card) par tap / click karke **purana result dobara dekho ya print karo**.

> **Important:** Purana result dobara kholne par **naya search nahi hota aur koi charge nahi lagta**. Aapko wahi result dikhta hai jo search ke waqt register mein tha.

### Badges ka matlab

| Badge | Matlab |
| --- | --- |
| **No interests** | Koi security interest nahi mila |
| **2 interests** | Do registrations mile |
| **⚠ Vehicle alert** | Gaadi written-off ya stolen hai |

---

## 8. "Test data" ka message

Agar result ke upar peela (yellow) box dikhe — **"Test data. This result came from the built-in test register…"** — to iska matlab hai ki app abhi **asli PPSR se connected nahi hai** aur result dummy (fictional) data se aaya hai. Aisa result **official certificate nahi hai** aur kisi deal ke liye use nahi karna chahiye.

Page ke neeche (footer mein) bhi status dikhta hai:

| Dot | Matlab |
| --- | --- |
| 🟢 Hara | Asli PPSR se connected |
| 🟡 Peela | Test data (asli register nahi) |
| 🔴 Laal | PPSR abhi available nahi — thodi der baad try karo |

### Test karne ke liye sample data

| Search | Kya milega |
| --- | --- |
| VIN `6T1BF3FK40X012345` | 1 security interest, gaadi clean |
| VIN `MR0FZ22G301234567` | 2 security interests |
| VIN `KMHCT41DAEU123456` | Koi interest nahi, lekin **written off** |
| VIN `WVWZZZ1KZ6W654321` | **Stolen** report |
| ACN `604512378` | Ek company ke 3 registrations |
| Registration no. `202307190311045` | Excavator (machinery) wala registration |

---

## 9. Mobile aur tablet par use karna

- App har screen size par chalta hai — chhote phone (320px) se lekar bade desktop tak.
- Mobile par history aur recent searches **cards** ki tarah dikhte hain — poora card tap karo, result khul jaayega.
- Upar ka menu (Dashboard, New search, Search history) mobile par bhi hamesha dikhta hai.
- Account menu ke liye upar right mein apne **initials** wale gol button par tap karo.

---

## 10. Common problems (Troubleshooting)

| Problem | Solution |
| --- | --- |
| "The email or password you entered is incorrect" | Email / password dobara check karo. Caps Lock off hai ya nahi dekho |
| "Your session ended. Please log in again." | Session expire ho gaya — dobara login karo |
| "A VIN is 17 characters…" ya serial number error | VIN dobara dhyan se dekho. VIN mein **I, O, Q** letters nahi hote — inki jagah 1 aur 0 (zero) hote hain |
| "Enter a 9-digit ACN/ARBN/ARSN or 11-digit ABN" | ACN 9 digits ka, ABN 11 digits ka hota hai — sirf numbers daalo |
| "The PPSR is not connected yet" / "The PPSR service is unavailable" | Register abhi available nahi hai. Kuch der baad try karo. Aisi failed search ka **koi charge nahi lagta** |
| Result mein koi registration nahi, lekin aapko lagta hai loan hai | Check karo ki serial number sahi hai aur sahi **type** (VIN / chassis) chuna hai. Galat type se result nahi milega |

---

## 11. Yaad rakhne wali baatein

1. **Har naya search charge hota hai** — purane results history se free mein dekho.
2. **PPSR search number** apne records mein rakho — yahi official proof hai ki aapne kab search kiya.
3. Security interest mile to **secured party se contact karke clearance letter lo**, tabhi deal karo.
4. Written-off ya stolen alert ko **kabhi ignore mat karo**.
5. "Test data" wala result asli deal ke liye **use mat karo**.
