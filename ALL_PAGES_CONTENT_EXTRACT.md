# Complete Contents Extract — Navbar, Footer, and All Inner Pages (for Migration)

This file contains the **full extracted text and structure** of the navbar, footer, and all inner pages (footer pages, discover-path, case-studies, report, company-details, etc.) so you can migrate content into a new site. Copy sections as needed.

---

## 1. Navbar (ContentNav)

**Component:** `app/components/ContentNav.tsx`

**Structure:**
- **Top bar:** Logo (left) — links to home/dashboard/select-role/become-model/register/admin depending on user; Auth (right).
- **Logo link (getHomeLink):** Admin → `/admin`; Logged-in with registration complete → `/dashboard`; Model → `/become-model`; Professional → `/register`; User (no role) → `/select-role`; Guest → `/`.
- **Logo image:** `/images/logo/logomain.png`, alt "Model Management Logo".

**When user is logged in and has completed registration:**
- **Nav pills:** Dashboard | Models | Castings | Premium | Marketplace | Partners
- **Auth block:** User avatar (profile photo or default), "View Profile" (title), display name or "Admin", **Log Out** button.
- **Profile link:** `/profile/{user.uid}`.

**When user is not logged in:**
- **Nav pills:** Home | Models | Castings | Premium | Marketplace | Partners
- **Auth block:** **Login** → `/login`, **Sign Up** → `/signup`.

**Links (href → label):**
- `/` or `/dashboard` → Home or Dashboard
- `/models` → Models
- `/casting` → Castings
- `/directory` → Premium
- `/marketplace` → Marketplace
- `/sponsor` → Partners

**Mobile:**
- Hamburger (Menu/X), same pill labels, then "View Profile" + "Log Out" or "Login" + "Sign Up".
- Overlay closes on link click.

---

## 2. Footer

**Component:** `app/components/Footer.tsx`  
**Hidden on:** `/admin` and sub-routes.

**Structure:**

**Company**
- **About us** → `/footer/about-us`
- **Careers** → `/footer/careers`
- **Blog** → `/footer/blog`

**Help**
- **How It Works** → `/footer/how-it-works`
- **Modelling Advice** → `/footer/modelling-advice`
- **Safety & Trust** → `/footer/safety-and-trust`
- **Contact** → `/contact`
- **Report Issue** → `/report`

**Legal**
- **Privacy Policy** → `/footer/privacy-policy`
- **Terms of Service** → `/footer/terms-of-service`
- **Company Details** → `/company-details`

**Social Media**
- Instagram: https://www.instagram.com/modelmanagement.mu
- TikTok: https://www.tiktok.com/@modelmanagement.mu
- LinkedIn: https://www.linkedin.com/company/modelmanagementmu/
- Facebook: https://www.facebook.com/share/1ANVtr2N8x/

**Footer bottom**
- © {year} Model Management. All rights reserved.

---

## 3. Footer pages — full content

### 3.1 About Us — `/footer/about-us`

**Hero**
- **Title:** About Us  
- **Subtitle:** Transforming the Modeling Industry

**Intro**
- Model Management Mauritius is an innovative online platform dedicated to revolutionizing the way models and talents connect with clients across the globe. Founded by Basant Lallah, Managing Director of Flash Communications Ltd., our platform streamlines the process of sourcing diverse talent for a wide range of projects.

**Card 1 — For Aspiring and Established Models**
- Whether you are a beginner, a professional model, an influencer, or simply exploring opportunities to showcase your unique look, we welcome you to join our inclusive community. We believe that diversity enriches the industry, and modeling is an opportunity accessible to all.

**Card 2 — For Clients and Industry Professionals**
- Photographers, brands, casting directors, agencies, small businesses, and production companies can post paid jobs, collaboration shoots, or other projects. Our platform provides direct access to a carefully curated selection of talented and diverse models, enabling you to find the perfect match for your creative vision.

**Full-Service Campaign Management**
- For comprehensive campaign management, our experienced casting team is available to assist. Please contact us to discuss your requirements and let us help bring your vision to fruition.
- **Button:** Contact Us → `/contact`

---

### 3.2 Careers — `/footer/careers`

**Hero**
- **Title:** Join Our Team  
- **Subtitle:** An inclusive, supportive, and welcoming environment where you can genuinely grow and thrive.

**Intro**
- **Title:** Careers at Model Management  
- Our talented, friendly team operates as one, breaking down departmental barriers to offer everyone the chance to learn about all aspects of the business and our clients. We are pioneers, innovators, and creators, committed to celebrating diversity, encouraging knowledge sharing, and nurturing development to shape the future of media and Model Management all together.

**Open Positions**

**Job 1: Model Lead (Full-Time)**
- Are you passionate about the fashion and entertainment industry? Do you have a knack for talent management and building professional relationships? We are seeking a dedicated and dynamic Model Lead to join our team and elevate our talent management services.
- **Key Responsibilities:** Talent Management (primary point of contact for models, guidance on careers, image, professional growth); Bookings and Scheduling (coordinate castings, photoshoots, assignments, schedules, travel); Contract Negotiation (fair terms and compensation); Client Relations (liaison between models and clients); Business Development (promotional materials, casting snapshots/videos, build models' profiles).
- **Skills and Qualifications:** Industry Knowledge; Business Acumen (business, marketing, communications advantageous); Talent Management Skills (negotiation, branding, contract management); Networking; Organizational Skills.
- Join us and play a pivotal role in shaping the careers of talented models while driving our agency's success forward!

**Job 2: Model Manager (Full-Time)**
- Are you passionate about the fashion and modeling industry? Do you have a talent for nurturing talent, building relationships, and managing details? We're looking for a dynamic and dedicated Model Manager to join our team!
- **Key Responsibilities:** Talent Scouting and Development; Client and Agency Relations; Booking and Scheduling; Administrative Duties (contracts, payments, paperwork); Career Building (portfolios, promotional materials); Event Attendance (industry events, networking, scouting).
- **Skills and Traits:** Resilience; Organizational Skills; Communication and Negotiation; Dedication and Persistence; Business Acumen; Flexibility.
- If you're ready to make a mark in the fashion industry and support emerging talent, we want to hear from you!

**Application form section**
- **Title:** Ready to Make a Difference? Apply Today!  
- **Subtitle:** Join our dynamic team and start your journey with Model Management  
- **Fields:** Full Name*, Position Applying For* (dropdown: Model Lead, Model Manager, Other); Your Email*, Phone Number*; Cover Letter (placeholder: Tell us why you're interested in joining our team..., max 1000 chars); Upload Resume / CV / Documents* (drag & drop or browse, max 20 MB, PDF/doc/docx/txt, max 4 files).  
- **Submit:** Submit Application | Submitting Application... | Application Submitted!  
- **Success message:** Thank you! Your application has been submitted successfully. We'll review it and get back to you soon.  
- **Error:** Failed to submit application. Please try again.

---

### 3.3 How It Works — `/footer/how-it-works`

**Title:** How We Operate  
**Subtitle:** Discover how ModelManagement.mu connects models and professionals in Mauritius  

**Cards**
- **For Models** → `/footer/how-it-works/models` — Learn how to create your profile, get discovered, and start your modeling journey in Mauritius  
- **For Professionals** → `/footer/how-it-works/professionals` — Discover how to find talent, post castings, and build your creative network on our platform  

---

### 3.4 How It Works — For Models — `/footer/how-it-works/models`

- **Back:** ← Back to How It Works → `/footer/how-it-works`  
- **Title:** How It Works  
- **Subtitle:** A new way to experience modeling in Mauritius  

**Intro:** ModelManagement.mu brings a modern, safe, and transparent approach to modeling. Whether you are just starting out or already experienced, our platform connects real people with real opportunities from photoshoots and brand campaigns to creative collaborations.

**Step 1 — Create your profile**  
Join for free and build your profile with your photos, videos, and basic information. Show your personality and what makes you unique because here, everyone has potential. Our team reviews every profile to keep the community professional and safe.

**Step 2 — Get Approved!**  
Once your profile is uploaded and viewed, we'll send you an update, so you can start exploring. You will have access to online tools and advice to help you understand the modeling world and progress gradually, with confidence.

**Step 3 — Get Noticed**  
Brands, photographers, and agencies regularly look for new faces in Mauritius and abroad. Once they discover your profile, they can contact you directly or send you a secure job offer through the platform no middleman, no confusion.

**Step 4 — Build Your Reputation**  
After every collaboration, both models and professionals can share feedback and reviews. This helps create trust and ensures fair, respectful experiences for everyone.

**CTA**
- **Title:** Start Your Journey Today  
- No experience? No problem. Modeling is no longer just for a few it is for everyone who wants to express themselves, gain confidence, and work with great people.  
- Join ModelManagement.mu today and be part of a new modeling community in Mauritius.  
- **Button:** Become a Model → `/become-model`  

---

### 3.5 How It Works — For Professionals — `/footer/how-it-works/professionals`

- **Back:** ← Back to How It Works  
- **Title:** How It Works — For Professionals  
- **Subtitle:** Connecting with Real Talent Has Never Been Easier  

**Intro:** ModelManagement.mu helps brands, photographers, and creative professionals in Mauritius discover and collaborate with talented models safely, quickly, and transparently. Whether you are organizing a photoshoot, a campaign, or a small creative project, our platform makes finding the right people simple and reliable.

**Step 1 — Create Your Professional Profile**  
Start by signing up for free and creating your professional account. Add your company name, area of expertise, and what type of talent you are looking for whether it's fashion, commercial, or lifestyle models. A verified profile builds trust and attracts the right people to your projects.

**Step 2 — Post a Casting or Project**  
Once registered, you can post a casting call describing your project, the look you're searching for, the location, and other details. You decide who can apply, giving you full control and visibility over the selection process.

**Step 3 — Discover and Connect**  
Browse through hundreds of local and international model profiles. Each model has verified photos, measurements, and information to help you find the perfect match. You can contact them directly through our secure messaging system to discuss ideas, availability, and rates.

**Step 4 — Manage Applications Easily**  
All your casting applications appear in one place. You can shortlist and confirm bookings directly from your dashboard. The platform helps you save time and stay organized while keeping everything professional.

**CTA**
- **Title:** Start Today  
- Join ModelManagement.mu and discover a new way to connect with models in Mauritius.  
- No agencies, no complicated processes just a smart, safe, and simple way to find talent that fits your vision.  
- **Button:** Join as Professional → `/register`  

---

### 3.6 Terms of Service (hub) — `/footer/terms-of-service`

**Title:** Terms of Use  
**Intro:** Please click on one of the links below to see the terms which are relevant to you.

**Links**
- **Models** → `/footer/terms-of-service/models` — Terms and conditions for models accessing MODELMANAGEMENT.MU  
- **Agencies** → `/footer/terms-of-service/agencies` — Terms and conditions for agencies accessing MODELMANAGEMENT.MU  
- **Agents** → `/footer/terms-of-service/agents` — Terms and conditions for agents accessing MODELMANAGEMENT.MU  
- **Other Industry Professionals** → `/footer/terms-of-service/professionals` — Terms and conditions for other industry professionals accessing MODELMANAGEMENT.MU  

---

### 3.7 Privacy Policy — `/footer/privacy-policy`

**Title:** Privacy and Policy  

**Intro:** This privacy policy applies to the website **MODELMANAGEMENT.MU**

**How do we process the information you give us?**  
When you join the MODELMANAGEMENT.MU website, we want you to be informed and confident about how we process your information. We collect them in order to enhance your experience, helping you get the most out of your membership and to connect and collaborate with other professionals in a business-to-business environment. Do not worry, your data is always treated with care and respect and we never share it with third parties.

**What data do we collect? (Applicable only for Models)**  
Name, Email address, Phone Number, Location, Gender, Website or portfolio link, Password (encrypted), Date of birth, Information about transactions, Date registered, recent login, uploaded images, followers, liked/favorites, Ethnicity, nationality, hair and eye colour, height, shoe size, bust, waist, hips, dress size, Languages spoken, Modeling categories and specialties, Preferred locations, Date when you apply to castings or accepted/declined a booking, "About me" free text, Payment information, reviews/comments, Social media links, Uploaded images, ID Number, A selfie of you with it.

**Requirements for photographers, brands, agencies, etc.**  
Name and company name, Email, Location, Gender, Password (encrypted), Date of birth, Transaction information, Date registered, recent login, uploaded images, followers, liked/favorites, "About me", Phone number, Social media links, Uploaded images.

**Which service providers we share your data with?**  
We partner with various companies to deliver services. For Premium we work with trusted payment providers like MCB. Links: Google Firebase privacy, Resend privacy, Bunny.net privacy, Mastercard global privacy notice. We use MCB to verify identity documents; MCB collects images of ID, facial images, ID numbers, addresses, fraud signals, device information; MCB shares data with us and uses it for fraud detection and services.

**With whom do we share your data with?**  
We do not share your data with any third parties without your permission, except when required by law.

**Data retention / Where stored / Legal grounds**  
If you keep being a user we will retain your information. All data is stored on our secure servers in Firebase and Bunny.net. Legal basis: company's legitimate interests, in accordance with the Data Protection Act 2017.

**What is this data used for?**  
We use the information to understand user activity and enhance our services, personalize experience, share relevant content. We may contact you via email, phone, SMS, WhatsApp, or Facebook Messenger for account updates. For models: notifications about messages, casting invitations, likes, follows, platform updates, promotions, surveys, tips, news. For professionals: pending approval, missing details, reminders to publish/update castings. ModelManagement.mu processes personal data in accordance with the Mauritius Data Protection Act 2017.

**IP addresses and Cookies**  
We keep a brief record of your IP address to protect from spam and security threats. We use cookies to optimize your journey, remember settings, session data, and refine site usage. You can turn off cookies via your browser; this might limit certain features.

**Technical Security Measures**  
We will report data breaches to the relevant data protection authority within 72 hours and notify affected users via email.

**How to manage your personal data?**  
Data is used to give you and other users the best experience. You have the right to edit or erase certain information (may make the site less useful). You have the right to have your account and information erased — contact info@modelmanagement.mu. Email preferences can be changed in Edit my profile; certain important emails may still be sent. You can request to see details of personal information we hold — contact info@modelmanagement.mu; proof of identity may be required; we may charge a fee; requests take up to 30 days.

**How Do We Update This Privacy Policy?**  
We may update at any time; a notice will be displayed on this page. If you do not agree, you may request deletion of your account and data. Contact: info@modelmanagement.mu.

**Contact info:**  
Contact number: +230 468 6969  
Email: info@theflashgroups.com  
Address: Flash Communications Ltd, 2nd Floor, Unity House, Rue du Savoir, Cybercity, Ebene, Mauritius 72201  

---

### 3.8 Safety and Trust — `/footer/safety-and-trust`

**Title:** Safety and Trust  
**Intro:** ModelManagement.mu is a safe and reliable community for the modeling industry. We are constantly improving our tools to make sure both models and professionals can work together in a secure and transparent environment.

**Cards**
- **The Essentials to Know** → `/footer/safety-and-trust/what-you-should-know` — Model Agreements, reservations, reviews, secure chats, and verification.  
- **Safety Guidelines** → `/footer/safety-and-trust/avoid-scammers` — Practical tips to stay safe when talking to photographers, agencies, or agents.  
- **Scamming Examples** → `/footer/safety-and-trust/scamming-examples` — Recognize common red flags and respond the right way.  
- **Our Values** → `/footer/safety-and-trust/code-of-conduct` — Community rules for models, talent, and professionals.  

---

### 3.9 Safety — The Essentials to Know — `/footer/safety-and-trust/what-you-should-know`

- **Back:** ← Back to Safety & Trust  
- **Title:** The Essentials to know  

**Model Agreement**  
It is a contract between a professional (photographer, brand, etc.) and a model once a booking is confirmed. It helps both sides know exactly what to expect and protects everyone's rights.

**Types of Contracts**  
1. Unpaid / Collaboration Projects (TFP): Used for non-commercial projects; model receives photos, videos, or products; often for portfolio building.  
2. Paid Jobs: Includes payment, usage rights, project conditions.

**Benefits:** Transparency; Protection (image rights, payments); Trust; Saves time.  
**For Models:** You'll know how images/videos will be used and payment; contract protects image rights; helps identify serious professionals.  
**For Professionals:** Ensures model commitment; keeps things organized; reduces risk.  
**How It Works:** (1) Professional fills in project details and signs Model agreements (TFP or paid); (2) Model receives and signs; (3) Both signed → professional gets copy by email.  
Note: Model agreements available for all models applying to castings or booked directly; models must be 18+ or have legal guardian; ModelManagement.mu only provides the platform.

**Digital Reservation**  
Online Bookings allow professionals to book models directly through ModelManagement.mu. Both sides are supported and protected. Benefits: Safe and secure; no agents/middlemen; team support before, during, after shoot; easy access to models for all project types.

**Evaluate Your Collaboration**  
All verified members can leave reviews about others they've worked with. Moderation team checks every review. Benefits: Reviews show professionalism and reliability; (list continues in page).

*(Full list of sections and bullets is in `app/footer/safety-and-trust/what-you-should-know/page.tsx`; copy Verification, Secure Chats, etc. from that file for migration.)*

---

### 3.10 Modelling Advice — `/footer/modelling-advice`

**Title:** Modelling Advice  
**Subtitle:** Explore our expert modelling tips and guidance to help you succeed in your career  
**Intro:** Every model whether just starting out or already established needs guidance at some point. Our collection of advice articles is designed to help you save time, avoid common mistakes, and make confident decisions throughout your modelling journey in Mauritius and beyond.

**Cards (title → description → route)**
1. Practical Tips for Models — Our best advice for aspiring models in Mauritius—from professionalism to self-care → `/footer/modelling-advice/practical-tips`  
2. Tips for the Best Shoots — What every model should know before stepping in front of the camera → `/footer/modelling-advice/best-shoots`  
3. Model Academies & Training — Learn, grow, and gain confidence through professional training programs → `/footer/modelling-advice/model-academies`  
4. Modeling Workshops — Discover workshops that help you refine your skills and build confidence → `/footer/modelling-advice/modeling-workshops`  
5. How is a Real Model — What to expect from a real modeling journey—the dedication and rewards → `/footer/modelling-advice/real-model`  
6. Aspiring Models — Your first confident steps into the world of modeling → `/footer/modelling-advice/aspiring-models`  
7. Glossary of Modeling Terms — Learn the key modeling terms you'll hear every day in the industry → `/footer/modelling-advice/glossary`  
8. Build the Right Portfolio — Show your best self with a professional, authentic portfolio → `/footer/modelling-advice/build-portfolio`  
9. Discover Your Confidence — Explore different types of modeling and find where you belong → `/footer/modelling-advice/discover-confidence`  
10. Capture Your Own Photos — How to take professional modeling photos yourself with confidence → `/footer/modelling-advice/self-photography`  

---

### 3.11 Blog (listing) — `/footer/blog`

**Hero**
- **Back:** Back to Homepage → `/`  
- **Title:** Blog & Insights  
- **Subtitle:** Explore the latest trends, insights, and stories from the modeling industry  

**Posts (id, title, excerpt, category, date, readTime, image)**
1. ai-digital-revolution — The Digital Revolution: Technology & AI in Modern Modeling — The modeling industry is undergoing one of its most significant transformations... — Technology — December 24, 2025 — 5 min read — /images/blogs/blog1.webp  
2. diversity-representation — The Evolution of Diversity & Representation in Modeling — The modeling industry is undergoing a profound cultural shift... — Culture — December 24, 2025 — 6 min read — /images/blogs/blog2.webp  
3. the-pulse-of-change-fashion-evolution — The Pulse of Change: Fashion Evolution & The Modern Model — Fashion has never been a static industry... — Fashion — December 24, 2025 — 6 min read — /images/blogs/blog3.webp  

**Card CTA:** Read More →  

**Blog post page example (ai-digital-revolution):**
- **Back:** Back to Blog → `/footer/blog`  
- **Category:** Technology  
- **Title:** The Digital Revolution: Technology & AI in Modern Modeling  
- **Meta:** December 24, 2025, 5 min read  
- **Lead:** The modeling industry is currently undergoing one of its most significant transformations since the advent of high-fashion photography. At the heart of this shift is the rapid integration of artificial intelligence (AI) and advanced digital technology...  
- **Section:** AI-Driven Creativity and Casting — (paragraphs in `app/footer/blog/ai-digital-revolution/page.tsx`)  
- *(Copy full body from each blog post file for migration.)*

---

### 3.12 Support — `/footer/support`

**Title:** Support  
**Section 1:** Need help? Our support team is here for you. Check our FAQ or contact us directly.  
**Contact Support:** Email: support@modelnext.com | Phone: +1 (555) 987-6543  
**Help Resources:** Frequently Asked Questions → `/footer/faq`, Contact Form → `/contact`  

---

### 3.13 Press — `/footer/press`

**Title:** Press  
**Section 1:** Find our latest press releases, media coverage, and news about Model Management Mauritius.  
**Recent News:**  
- 2025: Model Management Mauritius launches new AI-powered talent matching.  
- 2024: Featured in "Top 10 Modeling Platforms" by FashionTech Magazine.  
- 2023: Partnership with Global Talent Network announced.  
**Media Contact:** Email: press@modelnext.com  

---

### 3.14 Company Details — `/company-details`

**Title:** Company Details  
**Company name:** Flash Communications Ltd.  
**Address:** 2nd Floor, Unity House, Rue Du Savoir, Cybercity, Ebene, **Mauritius**  
**Registration:** VAT Number: 27261152 | Company Registration Number: C1412073  
**Website:** theflashgroups.com (https://www.theflashgroups.com)  
**Copyright:** © {year} Model Management Mauritius. All rights reserved.  

---

## 4. Report page — `/report`

**Left — Info**
- **Title:** Report & Complaints  
- **Subtitle:** We take all reports seriously. Help us maintain a safe and professional platform by reporting any issues or concerns.  
- **Report Misconduct:** Report inappropriate behavior, harassment, or violations of our terms. We investigate all reports within 24-48 hours.  
- **Safety Concerns:** Report safety issues, suspicious activity, or security concerns.  

**Form**
- **Fields:** Full Name*, Email*, Report Type* (dropdown), Subject*, Message*  
- **Submit:** Submit Report | Sending... | Success/Error message  
*(Exact labels and options are in `app/report/page.tsx`.)*

---

## 5. Discover-path pages — content summary

### 5.1 I'm New to the Spotlight — `/discover-path/im-new-to-the-spotlight`

**Hero:** Where new faces begin their modeling careers | New to modeling? Your journey starts here! | **Sign Up Now** → `/signup`  

**Your Modeling Journey Starts Here**  
Modeling isn't just for a select few. Our agency celebrates diversity and inclusivity, welcoming aspiring models of all ages, sizes, backgrounds, and experiences. Whether you're just starting out or exploring your potential, there's a place for your unique beauty in the modeling world. **Get Started**  

**New to Modeling? There's a Place for You**  
You don't need prior experience to start. Our agency welcomes newcomers of all shapes, sizes, and backgrounds.  

**Opportunity cards:** Fashion Modeling (Learn the runway...) | Brand Modeling (Brand campaigns...) | Fitness Modeling (Health and wellness brands) | Plus-Size Modeling (Celebrate diversity...). Each: **Learn More** / **Start Application**  

**Defining Talent**  
In modeling, "talent" isn't just about looks. We value personality, confidence, and ability to bring energy.  
**Features:** Confidence | Personality | Versatility | Professionalism  
**CTA:** Find Your Type  

**How to create profile**  
Steps: 01 Set Up Your Profile — Sign up and create your modeling profile... | 02 Showcase Your Photos | 03 Get Noticed | 04 Start Your Journey  
**CTA:** Get Started  

**Discover Model Academy**  
Explore our complete learning resources for new models. Posing Mastery | Industry Insights | Confidence Building | Portfolio Development. **COMING SOON**  

**Ready to Start Your Modeling Journey?**  
Join thousands of successful models who found their path through our platform. Create your free profile today. **Start for free**  

---

### 5.2 Other discover-path pages (route + theme)

- `/discover-path/im-a-full-time-model` — Full-time model path  
- `/discover-path/were-more-than-a-brand` — We're more than a brand  
- `/discover-path/we-are-your-go-to-agency` — We are your go-to agency  
- `/discover-path/im-an-influencer-with-a-passion-for-creating` — Influencer / creating  
- `/discover-path/im-a-creative-photographer` — Creative photographer  
- `/discover-path/im-a-stylist` — Stylist  
- `/discover-path/im-a-talent-artist` — Talent artist  

*(Copy full body from each `app/discover-path/[slug]/page.tsx` for migration.)*

---

## 6. Case-studies pages

### 6.1 From Struggles to Success — `/case-studies/from-struggles-to-success`

**Back:** Back to Homepage → `/`  
**Category:** Case Study 1  
**Title:** From Struggles to Success: How model management empowers every model  
**Subtitle:** Empowering models through transparency, technology, and fair practices  

**The Challenge**  
The modelling industry may appear glamorous from the outside, but many models face real challenges behind the scenes. Unstable income, inconsistent job opportunities, and the constant pressure to maintain a perfect image often lead to stress and insecurity. Many aspiring talents struggle to find the right guidance, face unfair working conditions, and experience difficulties managing travel, schedules, and finances. Additionally, short career spans and limited access to transparent contracts make it even harder for models to build long-term, sustainable careers.

**Stats:** 100% Verified Professionals | Secure Smart Contracts | Transparent Fair Practices  

**Our Solution**  
At Modelmanagement.mu, we aim to change this reality by creating a safer, smarter, and more empowering environment for models. Our platform connects models directly with verified professionals, ensuring transparency and trust in every collaboration. Through our smart contract system, all agreements are clear and secure, protecting the rights of both models and professionals. We also provide resources, training opportunities, and visibility tools that help models showcase their talent and build a personal brand beyond traditional agencies.

**The Impact**  
By combining technology, education, and fair practices, Modelmanagement.mu bridges the gap between models and the industry. We help talents take control of their careers, access more opportunities, and work confidently with local and international brands. Our goal is simple: to make the modelling journey not only successful but also safe, transparent, and sustainable for every model who joins our platform.

**CTA:** Ready to take control of your modelling career? Join Modelmanagement.mu and experience a safer, smarter, and more empowering modelling journey. **Join Now** → `/signup`  

---

### 6.2 Other case-studies (route, title, description)

- `/case-studies/why-we-created-modelmanagement-mauritius` — Why Modelmanagement.mu in Mauritius — Bridging the gap between local talent and global opportunities  
- `/case-studies/all-faces-all-backgrounds` — All Faces. All Backgrounds. One Platform. — Where Passion Matters More Than Perfection  

*(Copy full body from each `app/case-studies/[slug]/page.tsx` for migration.)*

---

## 7. Contact page (reminder)

**Get in Touch:** We'd love to hear from you...  
**Email:** info@modelmanagement.mu — We'll respond within 24 hours  
**Call:** +230 468 6969 — Mon-Fri 8am to 6pm  
**Visit:** 2nd Floor, Unity House, Rue Du Savoir, Cybercity, Ebene, Mauritius 72201  
**Company:** Flash Communications Ltd | Website: www.theflashgroups.com  
**Form:** Send Message — Full Name*, Email*, Message* — Send Message  

*(Full text is in MIGRATION_PAGE_CONTENTS.md.)*

---

## 8. Terms sub-pages and other footer sub-pages

- **Terms for Models / Agencies / Agents / Professionals:** Full legal text lives in `app/footer/terms-of-service/models/page.tsx`, `agencies`, `agents`, `professionals`. Open each file and copy the full body for migration.  
- **Safety sub-pages (avoid-scammers, scamming-examples, code-of-conduct):** Same — copy from `app/footer/safety-and-trust/[slug]/page.tsx`.  
- **Modelling-advice sub-pages (practical-tips, best-shoots, glossary, etc.):** Copy from `app/footer/modelling-advice/[slug]/page.tsx`.  
- **Blog posts (diversity-representation, the-pulse-of-change-fashion-evolution):** Copy from `app/footer/blog/[id]/page.tsx`.  

---

## 9. File reference for extraction

| Content | File(s) |
|--------|--------|
| Navbar | `app/components/ContentNav.tsx` |
| Footer | `app/components/Footer.tsx` |
| About Us | `app/footer/about-us/page.tsx` |
| Careers | `app/footer/careers/page.tsx` |
| How It Works | `app/footer/how-it-works/page.tsx`, `how-it-works/models/page.tsx`, `how-it-works/professionals/page.tsx` |
| Terms | `app/footer/terms-of-service/page.tsx`, `terms-of-service/models|agencies|agents|professionals/page.tsx` |
| Privacy | `app/footer/privacy-policy/page.tsx` |
| Safety & Trust | `app/footer/safety-and-trust/page.tsx`, `safety-and-trust/what-you-should-know|avoid-scammers|scamming-examples|code-of-conduct/page.tsx` |
| Modelling Advice | `app/footer/modelling-advice/page.tsx`, `modelling-advice/*/page.tsx` |
| Blog | `app/footer/blog/page.tsx`, `blog/ai-digital-revolution|diversity-representation|the-pulse-of-change-fashion-evolution/page.tsx` |
| Support, Press | `app/footer/support/page.tsx`, `app/footer/press/page.tsx` |
| Company Details | `app/company-details/page.tsx` |
| Report | `app/report/page.tsx` |
| Discover-path | `app/discover-path/[slug]/page.tsx` |
| Case-studies | `app/case-studies/[slug]/page.tsx` |

Use this extract together with **MIGRATION_PAGE_CONTENTS.md** and **WEBSITE_COMPLETE_WORKING_BRIEF.md** for a full content and structure migration to your new site.
