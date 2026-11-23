# chatturai.com — React version: deploy guide

## Kya badla, kya nahi

| | |
|---|---|
| **React mein** | `/`, `/portfolio`, `/about-us`, `/contact`, `/privacy-policy`, `/terms-condition` |
| **PHP (Yii) mein hi** | `/admin`, `/book-a-call`, `/thank-you`, `/site/save-booking`, contact form ka backend (enquiry save/email) |
| **Design** | Same `themes/advanced/css/style.css` file use hoti hai, server pe jaisi hai waisi. HTML structure, classes, text, images, videos live site se match kiye gaye hain. |
| **SEO** | Har page ka apna prerendered HTML hai, same title/description ke saath. Google ko pehle jaisa poora content dikhega. |
| **Tracking** | Meta Pixel, Microsoft Clarity aur Lucky Orange same IDs ke saath hain. Har page change pe PageView fire hota hai. |

## Server pe upload (5–10 min)

1. **Backup lo.** cPanel → File Manager mein site ka root folder kholo (jahan `index.php`, `themes/`, `media/`, `assets/` hain). Poora folder zip karke download kar lo. Purani `.htaccess` ki copy alag se bhi rakh lo.
2. **Purani `.htaccess` dekho.** Agar usme koi extra rule hai, jaise HTTPS ya www redirect, to woh rule nayi `.htaccess` ke `RewriteEngine On` ke turant neeche copy kar do.
3. **`chatturai-upload.zip` ka content usi root folder mein upload karo:**
   - `index.html`, `portfolio.html`, `about-us.html`, `contact.html`, `privacy-policy.html`, `terms-condition.html`
   - `react-assets/` folder
   - `.htaccess` (purani wali replace hogi)
4. **Kuch bhi delete MAT karo.** `index.php`, `themes/`, `media/`, `assets/` aur Yii ke saare folders (protected/vendor/config/runtime…) waise hi rehne do. Admin, booking funnel aur contact backend inhi pe chalte hain.

## Live hone ke baad check karo

- [ ] Saare 6 pages khulte hain aur design pehle jaisa hai (Ctrl+Shift+R se hard refresh)
- [ ] Mobile pe menu (burger) khulta hai
- [ ] Home pe showreel chalti hai aur video thumbnails click karne pe play hote hain
- [ ] `/contact` pe ek test enquiry bhejo → "Thanks. It's with us." dikhe → admin panel/email mein enquiry aayi ho
- [ ] `/admin` login aur `/book-a-call` pehle jaise kaam kar rahe hain

## Agar kuch gadbad ho (rollback, 1 min)

Nayi `.htaccess` hata kar purani wapas daal do, aur `index.html` delete ya rename kar do. Site turant purane PHP version pe aa jayegi.

## Aage content badalna ho

Source code `chatturai-react-source.zip` mein hai:
```
npm install
npm run dev      # local preview (CSS/images live site se aate hain)
npm run build    # dist/ folder banta hai → wahi upload karna hai
```
- Team members: `src/components/Bits.jsx` → `TEAM`
- Portfolio videos: `src/pages/Portfolio.jsx` → `FILMS`, `TRAILERS`, `REELS` (Mux playback IDs)
- Home ke selected films / prices: `src/pages/Home.jsx`
- Page titles/descriptions: `src/seo.js`

## Contact form kaise kaam karta hai

React form submit hone pe:
1. `GET /contact?legacy=1` se Yii ka fresh CSRF token leta hai
2. `POST /contact` pe wahi fields bhejta hai jo purana form bhejta tha (`Contact[full_name]`, `Contact[email]`, `Contact[phone_number]`, `Contact[country_code]`, `Contact[subject]`, `Contact[message]`)

`.htaccess` ye dono requests `index.php` (Yii) ko bhejti hai, isliye enquiry pehle jaise save/email hoti hai. Validation messages bhi Yii wale hi hain.
