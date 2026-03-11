# Home Page Buttons, Inner Pages & Footer — Complete Extract for Migration

This file contains **all home page buttons** (with their links), **full content** of the **Sponsor (Partners)** page, **hero Models & Professionals** inner pages, **discover-path** buttons and their **inner page content**, and **footer links** with **page content** references. Use this single document to add these buttons and pages to another website.

---

## 1. Home Page — All Buttons and Links

### 1.1 Hero / Top Nav (JettonHero)

| Button / Link | href |
|---------------|------|
| Home | `/` |
| Models | `/models` |
| Castings | `/casting` |
| Premium | `/directory` |
| Marketplace | `/marketplace` |
| Partners | `/sponsor` |
| Log in | `/login` |
| Sign up | `/signup` |
| Get Started (hero CTA) | from `heroData.primaryCTA` — typically links to signup or discover |
| Learn More (hero CTA) | from `heroData.secondaryCTA` |

### 1.2 Home Page Body (app/page.tsx)

| Button / Link | href |
|---------------|------|
| I'm New to the spotlight | `/discover-path/im-new-to-the-spotlight` |
| I'm a full-time model | `/discover-path/im-a-full-time-model` |
| I'm an influencer with a passion for creating | `/discover-path/im-an-influencer-with-a-passion-for-creating` |
| I'm a creative photographer | `/discover-path/im-a-creative-photographer` |
| I'm a Stylist | `/discover-path/im-a-stylist` |
| I'm a talent Artist | `/discover-path/im-a-talent-artist` |
| Connect Now | `/discover-path/were-more-than-a-brand` |
| Get Started | `/discover-path/we-are-your-go-to-agency` |
| Case study cards | `/case-studies/{id}` |
| Sign up now | `/signup` |
| Contact (button) | `/contact` |

---

## 2. Sponsor Page (Partners) — Full Content

**Route:** `/sponsor` (navbar: **Partners** → `/sponsor`)

### 2.1 Left Section — Partnership Info

**Headline**
- **Title:** Partner with Us and Unlock New Opportunities  
- **Subtitle:** Join Our Exclusive Brand Network — Partner with a platform that connects thousands of talents with opportunities in the modeling industry.

**Benefits**
1. **Targeted Reach**  
   - Connect with models, agencies, photographers, and industry professionals  
   - Thousands of active users monthly  

2. **Brand Visibility**  
   - Showcase your brand to the right audience  
   - High engagement rates in the industry  

3. **Strategic Partnership**  
   - Build meaningful relationships with industry leaders  
   - Exclusive networking opportunities  

**Why Partner with Model Management?**
- Model Management Mauritius is the leading platform connecting talent with opportunities in the modeling industry.
- Our platform serves models, agencies, photographers, and brands across the region.
- Partner with us to gain visibility, build brand recognition, and contribute to the growth of the creative industry.

### 2.2 Right Section — Become a Partner Form

**Form header**
- **Title:** Become a Partner  
- **Subtitle:** Fill out the form below and we'll create a custom package for you  

**Form fields**
- **I'm Interested In** * — dropdown: Brand Partnership | Affiliate Partnership  
- **Full Name** * — placeholder: Enter your full name  
- **Email Address** * — placeholder: Enter your email address  
- **Phone Number** * — placeholder: Enter your phone number  
- **Company Name** — placeholder: Enter your company name  
- **Website** — placeholder: https://example.com  
- **Message** * — placeholder: Tell us about your partnership goals and what you're looking for...  

**Submit button states**
- Default: Submit Application (Send icon)  
- Submitting: Submitting Application... (spinner)  
- Success: Application Sent! (CheckCircle)  
- Error: Try Again (AlertCircle)  

**Messages**
- Success: Thank you! Your application has been submitted successfully. We'll get back to you soon.  
- Error: Failed to submit application. Please try again.  

---

## 3. Hero “Models” and “Professionals” — Inner Pages

### 3.1 Models (`/models`)

- **Purpose:** Professional models directory (browse/search verified models).  
- **Content type:** Dynamic listing (models loaded from backend).  
- **Page copy (SEO):** Title: “Professional Models Directory | Model Management Mauritius”. Description: “Browse 200+ verified professional models in Mauritius. Find fashion models, commercial models, runway models, and more. Connect directly with talented models for your projects.”  
- **UI:** Grid/list of model cards; filters/search. No static long-form copy to migrate beyond meta and any “empty state” or section headings in `ModelsClient`.

### 3.2 Models & Talents alternative (`/modelsTalents` if linked elsewhere)

**Hero**
- Headline: Dreamed of modeling? Now’s your chance!  
- Subline: Originality is what brands are falling in love with  

**CTA:** Track casting openings → `/casting`  

**Section: Where professionals find tomorrow’s top models**
- Subheading: Casting calls made for everyone.  
- Feature cards: A vast selection of casting calls; Endless opportunities to get discovered; A constantly growing list of gigs; Countless casting calls happening now.  
- CTA: Sign Up now → `/signup`  

**How It Works**
- Title: Start Your Modeling Journey  
- Subtitle: 3 easy steps to kickstart your career in the modelling industry.  
- Step 1: Build Your Profile — Upload your top photos, info, and Instagram to get noticed by brands, photographers, and agencies.  
- (Steps 2–3 in `app/modelsTalents/page.tsx`.)

### 3.3 Professionals (`/professionals`)

**Hero**
- Headline: Simplify your model search  
- Subline: Take charge of discovering models and talent with ease.  

**CTA:** Sign Up → `/signup`  

**Section: How can Model Management help you?**
- Subheading: Find the perfect talent for your projects with our comprehensive platform  
- Browse our directory or create a casting call — Submit your casting calls to access thousands of professional models.  
- Discover thousands of models — Access a variety of verified and talented individuals.  
- Directly connect with models or book online — Hire professional models for your projects with ease.  

**CTAs:** Create a Casting → `/casting` | Discover More → `/models` | Reach Out → `/contact`  

**Why Model Management Mauritius?**
- All-in-One Platform — User-friendly tools to manage everything from casting to bookings  
- Cost-Effective — Access talented models for free collaborations or at your desired rates  
- 1.5k+ Models in Mauritius — Connect directly with over 1,500 active and diverse models in Mauritius  

**Final CTAs**
- Choose below to explore further! — Photographer | Brand | Talent (all → `/signup`)  
- The Fast Track to Top Talent — Register for free and discover how effective our platform is! — Start Now → `/signup`  

---

## 4. Discover-Path Buttons and Full Inner Page Content

### 4.1 I'm New to the spotlight  
**Button:** I'm New to the spotlight  
**href:** `/discover-path/im-new-to-the-spotlight`

**Inner page content**

- **Hero:** Where new faces begin their modeling careers | New to modeling? Your journey starts here! | **Sign Up Now** → `/signup`  
- **Your Modeling Journey Starts Here**  
  Modeling isn’t just for a select few. Our agency celebrates diversity and inclusivity, welcoming aspiring models of all ages, sizes, backgrounds, and experiences. Whether you’re just starting out or exploring your potential, there’s a place for your unique beauty in the modeling world. **Get Started** → `/signup`  
- **New to Modeling? There’s a Place for You**  
  You don’t need prior experience. Opportunity cards:  
  - Fashion Modeling — Learn the runway and showcase designer collections | Learn More  
  - Brand Modeling — Take part in brand campaigns and marketing projects | Learn More  
  - Fitness Modeling — Work with health and wellness brands | Learn More  
  - Plus-Size Modeling — Celebrate diversity and represent all body types | Learn More  
  CTA: Start Application → `/signup`  
- **Defining Talent**  
  In modeling, “talent” isn’t just about looks. We value personality, confidence, and ability to bring energy.  
  - Confidence — Trust yourself and embrace your natural qualities  
  - Personality — Let your true self shine in front of the camera  
  - Versatility — Be open to different styles, poses, and concepts  
  - Professionalism — Show up prepared, reliable, and ready to grow  
  CTA: Find Your Type → `/signup`  
- **How to create profile**  
  - 01 Set Up Your Profile — Sign up and create your modeling profile, highlighting your look, style, and personality.  
  - 02 Showcase Your Photos — Upload your best shots to show agencies and brands your potential.  
  - 03 Get Noticed — Be discovered by agencies or apply directly to beginner modeling opportunities.  
  - 04 Start Your Journey — Land your first modeling gigs and build your career with trusted industry partners.  
  CTA: Get Started → `/signup`  
- **Discover Model Academy**  
  Explore our complete learning resources for new models. Posing Mastery | Industry Insights | Confidence Building | Portfolio Development. CTA: COMING SOON  
- **Footer CTA:** Ready to Start Your Modeling Journey? Join thousands of successful models who found their path through our platform. Create your free profile today. **Start for free** → `/signup`  

---

### 4.2 I'm a full-time model  
**Button:** I'm a full-time model  
**href:** `/discover-path/im-a-full-time-model`

**Inner page content**

- **Hero:** Advance Your Full-Time Modeling Career | Take your modeling journey further with premium tools, exclusive casting opportunities, and direct connections with industry professionals. Perfect for full-time models ready to grow their portfolio and reach new heights. **Sign up now** → `/signup`  
- **For Full-Time Models**  
  You’ve already built your experience and proven your talent in modeling. Now it’s time to access advanced tools, exclusive opportunities, and industry connections that will take your career to the next level. **Get Started** → `/signup`  
- **Advanced Professional Tools**  
  Unlock powerful features created for established models:  
  - Exclusive Casting Access — Get direct invitations to premium casting calls and brand collaborations  
  - Performance Analytics — Track your bookings, engagement, and career growth with detailed insights  
  - Portfolio Management — Build and customize a professional portfolio that highlights your best work  
  - Global Opportunities — Connect with top international agencies and brands to expand your reach  
  CTA: Explore Pro Features → `/signup`  
- **Pro Benefits That Accelerate Your Career**  
  - Priority Placement — Your profile is featured at the top of searches and casting opportunities  
  - Direct Brand Access — Connect straight with key decision-makers at top brands and agencies  
  - Advanced Analytics — Gain detailed insights into profile views, applications, and bookings  
  - Exclusive Events — Attend industry workshops, networking sessions, and special modeling events  
  CTA: Upgrade to Pro → `/signup`  
- **Direct Industry Connections**  
  Connect directly with top agencies, major brands, and industry decision-makers.  
  - Top Agencies — Direct access to leading modeling agencies worldwide  
  - Major Brands — Exclusive casting calls from global fashion and lifestyle brands  
  - Industry Events — Priority access to fashion weeks, trade shows, and networking events  
  CTA: Connect Now → `/signup`  
- **Footer CTA:** Ready to Elevate Your Career? Join thousands of professional models who have accelerated their careers with our advanced platform. **Upgrade to Pro** → `/signup`  

---

### 4.3 I'm an influencer with a passion for creating  
**Button:** I'm an influencer with a passion for creating  
**href:** `/discover-path/im-an-influencer-with-a-passion-for-creating`

**Inner page content**

- **Hero:** Content Creation & Influence | Transform your creativity into a thriving career. Connect with brands, build your audience, and monetize your content through our comprehensive platform designed for influencers and content creators. **Learn More** → `/signup`  
- **Build Your Digital Empire**  
  Whether you're a seasoned influencer or just starting your content creation journey, our platform provides the tools, connections, and opportunities you need to turn your passion into a profitable career. **Get Started** → `/signup`  
- **Diverse Content Creation Opportunities**  
  - Social Media Content — Create engaging posts, stories, and videos for major brands  
  - Video Production — Produce commercials, product demos, and lifestyle videos  
  - Photography Shoots — Professional photo shoots for campaigns and catalogs  
  - Live Streaming — Host live events, product launches, and interactive sessions  
  CTA: Explore Opportunities → `/signup`  
- **Tools to Build Your Influence**  
  - Audience Analytics — Track your growth, engagement rates, and audience demographics  
  - Brand Matching — Connect with brands that align with your niche and values  
  - Content Calendar — Plan and schedule your content strategy for maximum impact  
  - Collaboration Network — Connect with other creators for cross-promotion opportunities  
  CTA: Access Tools → `/signup`  
- **Monetize Your Content**  
  - Brand Partnerships — Collaborate with major brands for sponsored content and campaigns  
  - Affiliate Marketing — Earn commissions by promoting products and services you love  
  - Content Licensing — License your content to brands and media outlets for additional income  
  CTA: Start Earning → `/signup`  
- **Footer CTA:** Ready to Build Your Influence? Join thousands of successful content creators who have turned their passion into profit. **Start Creating** → `/signup`  

---

### 4.4 I'm a creative photographer  
**Button:** I'm a creative photographer  
**href:** `/discover-path/im-a-creative-photographer`

**Inner page content**

- **Hero:** Connect with exceptional talent for your creative vision | Find the perfect models and subjects for your photography projects, from fashion shoots to artistic portraits. Bring your creative vision to life with our diverse network of professional talent. **Join as Photographer** → `/signup`  
- **Photography & Creative Arts**  
  Whether you're a fashion photographer, portrait artist, or commercial photographer, our platform connects you with exceptional models who understand your creative vision. From runway-ready talent to unique subjects for artistic projects, find the perfect match for your photography needs. **Get Started** → `/signup`  
- **Creative Services We Support**  
  - Fashion Photography — Connect with models for high-end fashion shoots and editorial work  
  - Portrait Sessions — Find the perfect subjects for your portrait and artistic photography  
  - Commercial Projects — Source professional models for advertising and commercial campaigns  
  - Creative Collaborations — Partner with models for experimental and artistic photography  
  CTAs: Learn More (per card), Start Your Project → `/signup`  
- **How It Works**  
  - 01 Create Your Profile — Set up your photographer profile showcasing your style and portfolio  
  - 02 Browse Models — Search through our diverse network of professional models  
  - 03 Connect & Collaborate — Reach out to models and arrange your photography sessions  
  - 04 Create Amazing Work — Produce stunning photography with professional talent  
  CTA: Get Started → `/signup`  
- **Why Model Management Mauritius?**  
  All-in-One Platform | Cost-Effective | 1.5k+ Models (same as other discover-path pages).  
- **Footer CTA:** Ready to Create Amazing Photography? Join our community of photographers and creative professionals. **Join as Photographer** → `/signup`  

---

### 4.5 I'm a Stylist  
**Button:** I'm a Stylist  
**href:** `/discover-path/im-a-stylist`

**Inner page content**

- **Hero:** I'm a Stylist | Transform your passion for fashion into a thriving styling career. Connect with models, photographers, and brands to create stunning fashion content. **Join Network** → `/signup` | **Learn More** → `/contact`  
- **How It Works**  
  - 01 Create Your Stylist Profile — Sign up and showcase your styling expertise, portfolio, and unique aesthetic.  
  - 02 Upload Your Portfolio — Add your best styling work, fashion shoots, and creative projects to attract clients.  
  - 03 Connect with Models & Brands — Network with models, photographers, and brands looking for talented stylists.  
  - 04 Land Styling Opportunities — Secure fashion shoots, editorial work, and brand collaborations.  
- **Why Choose ModelHub for Styling?**  
  - Portfolio Showcase — Display your styling work and creative vision to attract the right clients and opportunities.  
  - Network Building — Connect with models, photographers, makeup artists, and brands to build your professional network.  
  - Job Opportunities — Access fashion shoots, editorial work, brand campaigns, and celebrity styling opportunities.  
  - Career Growth — Build your reputation and expand your client base through our trusted platform.  

---

### 4.6 I'm a talent Artist  
**Button:** I'm a talent Artist  
**href:** `/discover-path/im-a-talent-artist`

**Inner page content**

- **Hero:** I'm a Talent Artist | Transform your artistic vision into stunning collaborations. Connect with models, photographers, and brands to create extraordinary creative content. **Showcase Talent** → `/signup` | **Learn More** → `/contact`  
- **How It Works**  
  - 01 Create Your Artist Profile — Sign up and showcase your artistic talent, portfolio, and creative vision to attract collaborations.  
  - 02 Upload Your Portfolio — Add your best artistic work, creative projects, and unique style to showcase your talent.  
  - 03 Connect with Models & Brands — Network with models, photographers, and brands looking for talented artists and creative collaborators.  
  - 04 Land Creative Opportunities — Secure artistic collaborations, creative projects, and brand partnerships.  
- **Why Choose ModelHub for Artists?**  
  - Portfolio Showcase — Display your artistic work and creative vision to attract the right collaborations and opportunities.  
  - Creative Network — Connect with models, photographers, stylists, and brands to build your creative network.  
  - Artistic Opportunities — Access creative projects, artistic collaborations, brand campaigns, and exhibition opportunities.  
  - Career Growth — Build your artistic reputation and expand your creative portfolio through our trusted platform.  

---

### 4.7 Connect Now (Were more than a brand)  
**Button:** Connect Now  
**href:** `/discover-path/were-more-than-a-brand`

**Inner page content**

- **Hero:** Elevate Your Modeling Career from Day One | Are you an aspiring model or a seasoned professional looking to refine your image and maximize your opportunities? We're here to help!  
- **Model Management Content**  
  At Model Management Mauritius, we specialize in comprehensive Model Management — building your unique image, managing your career, and securing those essential bookings.  
- **Our Service Offerings**  
  - Personal Brand Development — We craft a compelling and authentic image tailored to your strengths and aspirations. From styling and portfolio guidance to personal branding, we ensure you stand out in the competitive industry.  
  - Booking & Shoot Coordination — From the moment you join us, we handle all aspects of your modeling journey. We book your photoshoots, coordinate schedules, select the right photographers, stylists, and makeup artists to bring your vision to life.  
  - Ongoing Career Management — We continuously manage your bookings, negotiate contracts, and provide career advice. Our goal is to build your reputation and open doors to new opportunities.  
  - Portfolio Building — We help you develop a high-quality portfolio that showcases your versatility and unique look — essential for attracting top clients and agencies.  
- **Why Choose Us?**  
  - Dedicated Support from Day 1 — We're with you every step of the way, from initial image creation to your first booking.  
  - Industry Expertise — Our team has deep connections within the fashion and modeling industry.  
  - Personalized Approach — We tailor our services to match your individual goals and style.  
  - Success-Driven — Our mission is to elevate your career and turn your modeling dreams into reality.  
- **CTAs:** Get Started Today! — Contact Us (opens Brand Partnership modal); Footer: Ready to Start Your Modeling Journey? **Start for free** (opens modal).  

---

### 4.8 Get Started (We are your go-to agency)  
**Button:** Get Started  
**href:** `/discover-path/we-are-your-go-to-agency`

**Inner page content**

- **Hero:** Full-Service Campaign Management | Elevate Your Brand with Expert Campaign Solutions  
- **Campaign Management**  
  At Model Management, we specialize in delivering comprehensive campaign management services tailored to showcase the best talent and elevate your brand. Our full-service approach ensures every aspect of your campaign – from talent selection to execution – is handled with precision, creativity, and professionalism.  
- **Why Choose Our Campaign Management Service?**  
  - Expert Talent Acquisition — We identify and secure the perfect models and talents that align with your brand vision.  
  - Strategic Planning — Our team develops customized campaign strategies to maximize impact and engagement.  
  - Creative Direction — From concept to execution, we ensure your campaign is visually stunning and brand consistent.  
  - Logistics & Coordination — We handle location scouting, casting, scheduling, and all logistical details.  
  - Media & Content Management — We oversee photoshoots, videos, and digital content creation.  
  - Performance Monitoring — Our team tracks campaign success and provides detailed analytics to optimize future efforts.  
- **Our Process**  
  1. Initial Consultation — Understanding your brand, goals, and target audience.  
  2. Talent Casting — Curating a selection of models and talents tailored to your campaign.  
  3. Concept Development — Designing creative concepts that resonate with your brand identity.  
  4. Execution — Managing all aspects of the shoot, production, and deployment.  
  5. Post-Campaign Analysis — Evaluating results and delivering insights for continuous improvement.  
- **CTA:** Let's Create Something Extraordinary — Get Started Today (opens Agency Campaign modal).  
- **Agency Resources**  
  - Talent Management — Advanced tools for managing model portfolios and career development with real-time analytics  
  - Industry Networking — Connect with international agencies and industry professionals worldwide  
  - Career Development — Provide professional guidance and strategic career planning for long-term success  
  - Global Opportunities — Access to international markets and exclusive opportunities for your models  
  CTA: Access Resources (opens modal).  
- **Why Model Management Mauritius?**  
  All-in-One Platform | Cost-Effective | 1.5k+ Models (same as above).  
- **Footer CTA:** Ready to Build Powerful Brand Partnerships? **Partner with Us** (opens modal).  

---

## 5. Footer Links and Page Contents

### 5.1 Footer Structure (from Footer.tsx)

**Company**
- About us → `/footer/about-us`
- Careers → `/footer/careers`
- Blog → `/footer/blog`

**Help**
- How It Works → `/footer/how-it-works`
- Modelling Advice → `/footer/modelling-advice`
- Safety & Trust → `/footer/safety-and-trust`
- Contact → `/contact`
- Report Issue → `/report`

**Legal**
- Privacy Policy → `/footer/privacy-policy`
- Terms of Service → `/footer/terms-of-service`
- Company Details → `/company-details`

**Social**
- Instagram, TikTok, LinkedIn, Facebook (URLs in Footer.tsx).

---

### 5.2 Full content of each footer page

Below is the **full content** of every page linked from the footer so you can migrate without opening another file.

---

#### About us — `/footer/about-us`

**Hero**
- **Title:** About Us  
- **Subtitle:** Transforming the Modeling Industry

**Intro**  
Model Management Mauritius is an innovative online platform dedicated to revolutionizing the way models and talents connect with clients across the globe. Founded by Basant Lallah, Managing Director of Flash Communications Ltd., our platform streamlines the process of sourcing diverse talent for a wide range of projects.

**Card 1 — For Aspiring and Established Models**  
Whether you are a beginner, a professional model, an influencer, or simply exploring opportunities to showcase your unique look, we welcome you to join our inclusive community. We believe that diversity enriches the industry, and modeling is an opportunity accessible to all.

**Card 2 — For Clients and Industry Professionals**  
Photographers, brands, casting directors, agencies, small businesses, and production companies can post paid jobs, collaboration shoots, or other projects. Our platform provides direct access to a carefully curated selection of talented and diverse models, enabling you to find the perfect match for your creative vision.

**Full-Service Campaign Management**  
For comprehensive campaign management, our experienced casting team is available to assist. Please contact us to discuss your requirements and let us help bring your vision to fruition.  
- **Button:** Contact Us → `/contact`

---

#### Careers — `/footer/careers`

**Hero**
- **Title:** Join Our Team  
- **Subtitle:** An inclusive, supportive, and welcoming environment where you can genuinely grow and thrive.

**Intro — Careers at Model Management**  
Our talented, friendly team operates as one, breaking down departmental barriers to offer everyone the chance to learn about all aspects of the business and our clients. We are pioneers, innovators, and creators, committed to celebrating diversity, encouraging knowledge sharing, and nurturing development to shape the future of media and Model Management all together.

**Open Positions**

**Job 1: Model Lead (Full-Time)**  
Are you passionate about the fashion and entertainment industry? Do you have a knack for talent management and building professional relationships? We are seeking a dedicated and dynamic Model Lead to join our team and elevate our talent management services.  
- **Key Responsibilities:** Talent Management (primary point of contact for models, guidance on careers, image, professional growth); Bookings and Scheduling (coordinate castings, photoshoots, assignments, schedules, travel); Contract Negotiation (fair terms and compensation); Client Relations (liaison between models and clients); Business Development (promotional materials, casting snapshots/videos, build models' profiles).  
- **Skills and Qualifications:** Industry Knowledge; Business Acumen (business, marketing, communications advantageous); Talent Management Skills (negotiation, branding, contract management); Networking; Organizational Skills.  
Join us and play a pivotal role in shaping the careers of talented models while driving our agency's success forward!

**Job 2: Model Manager (Full-Time)**  
Are you passionate about the fashion and modeling industry? Do you have a talent for nurturing talent, building relationships, and managing details? We're looking for a dynamic and dedicated Model Manager to join our team!  
- **Key Responsibilities:** Talent Scouting and Development; Client and Agency Relations; Booking and Scheduling; Administrative Duties (contracts, payments, paperwork); Career Building (portfolios, promotional materials); Event Attendance (industry events, networking, scouting).  
- **Skills and Traits:** Resilience; Organizational Skills; Communication and Negotiation; Dedication and Persistence; Business Acumen; Flexibility.  
If you're ready to make a mark in the fashion industry and support emerging talent, we want to hear from you!

**Application form section**
- **Title:** Ready to Make a Difference? Apply Today!  
- **Subtitle:** Join our dynamic team and start your journey with Model Management  
- **Fields:** Full Name*; Position Applying For* (dropdown: Model Lead, Model Manager, Other); Your Email*; Phone Number*; Cover Letter (placeholder: Tell us why you're interested in joining our team..., max 1000 chars); Upload Resume / CV / Documents* (drag & drop or browse, max 20 MB, PDF/doc/docx/txt, max 4 files).  
- **Submit:** Submit Application | Submitting Application... | Application Submitted!  
- **Success message:** Thank you! Your application has been submitted successfully. We'll review it and get back to you soon.  
- **Error:** Failed to submit application. Please try again.

---

#### Blog — `/footer/blog`

**Hero**
- **Back:** Back to Homepage → `/`  
- **Title:** Blog & Insights  
- **Subtitle:** Explore the latest trends, insights, and stories from the modeling industry  

**Posts (id, title, excerpt, category, date, read time, image)**  
1. **ai-digital-revolution** — The Digital Revolution: Technology & AI in Modern Modeling — The modeling industry is undergoing one of its most significant transformations... — Technology — December 24, 2025 — 5 min read — /images/blogs/blog1.webp  
2. **diversity-representation** — The Evolution of Diversity & Representation in Modeling — The modeling industry is undergoing a profound cultural shift... — Culture — December 24, 2025 — 6 min read — /images/blogs/blog2.webp  
3. **the-pulse-of-change-fashion-evolution** — The Pulse of Change: Fashion Evolution & The Modern Model — Fashion has never been a static industry... — Fashion — December 24, 2025 — 6 min read — /images/blogs/blog3.webp  

**Card CTA:** Read More → (each post links to `/footer/blog/[id]`)

---

#### How It Works — `/footer/how-it-works`

**Title:** How We Operate  
**Subtitle:** Discover how ModelManagement.mu connects models and professionals in Mauritius  

**Cards**
- **For Models** → `/footer/how-it-works/models` — Learn how to create your profile, get discovered, and start your modeling journey in Mauritius  
- **For Professionals** → `/footer/how-it-works/professionals` — Discover how to find talent, post castings, and build your creative network on our platform  

---

#### How It Works — For Models — `/footer/how-it-works/models`

- **Back:** ← Back to How It Works → `/footer/how-it-works`  
- **Title:** How It Works  
- **Subtitle:** A new way to experience modeling in Mauritius  

**Intro**  
ModelManagement.mu brings a modern, safe, and transparent approach to modeling. Whether you are just starting out or already experienced, our platform connects real people with real opportunities from photoshoots and brand campaigns to creative collaborations.

**Step 1 — Create your profile**  
Join for free and build your profile with your photos, videos, and basic information. Show your personality and what makes you unique because here, everyone has potential. Our team reviews every profile to keep the community professional and safe.

**Step 2 — Get Approved!**  
Once your profile is uploaded and viewed, we'll send you an update, so you can start exploring. You will have access to online tools and advice to help you understand the modeling world and progress gradually, with confidence.

**Step 3 — Get Noticed**  
Brands, photographers, and agencies regularly look for new faces in Mauritius and abroad. Once they discover your profile, they can contact you directly or send you a secure job offer through the platform — no middleman, no confusion.

**Step 4 — Build Your Reputation**  
After every collaboration, both models and professionals can share feedback and reviews. This helps create trust and ensures fair, respectful experiences for everyone.

**CTA**
- **Title:** Start Your Journey Today  
- No experience? No problem. Modeling is no longer just for a few — it is for everyone who wants to express themselves, gain confidence, and work with great people.  
- Join ModelManagement.mu today and be part of a new modeling community in Mauritius.  
- **Button:** Become a Model → `/become-model`  

---

#### How It Works — For Professionals — `/footer/how-it-works/professionals`

- **Back:** ← Back to How It Works → `/footer/how-it-works`  
- **Title:** How It Works — For Professionals  
- **Subtitle:** Connecting with Real Talent Has Never Been Easier  

**Intro**  
ModelManagement.mu helps brands, photographers, and creative professionals in Mauritius discover and collaborate with talented models safely, quickly, and transparently. Whether you are organizing a photoshoot, a campaign, or a small creative project, our platform makes finding the right people simple and reliable.

**Step 1 — Create Your Professional Profile**  
Start by signing up for free and creating your professional account. Add your company name, area of expertise, and what type of talent you are looking for — whether it's fashion, commercial, or lifestyle models. A verified profile builds trust and attracts the right people to your projects.

**Step 2 — Post a Casting or Project**  
Once registered, you can post a casting call describing your project, the look you're searching for, the location, and other details. You decide who can apply, giving you full control and visibility over the selection process.

**Step 3 — Discover and Connect**  
Browse through hundreds of local and international model profiles. Each model has verified photos, measurements, and information to help you find the perfect match. You can contact them directly through our secure messaging system to discuss ideas, availability, and rates.

**Step 4 — Manage Applications Easily**  
All your casting applications appear in one place. You can shortlist and confirm bookings directly from your dashboard. The platform helps you save time and stay organized while keeping everything professional.

**CTA**
- **Title:** Start Today  
- Join ModelManagement.mu and discover a new way to connect with models in Mauritius.  
- No agencies, no complicated processes — just a smart, safe, and simple way to find talent that fits your vision.  
- **Button:** Join as Professional → `/register`  

---

#### Modelling Advice — `/footer/modelling-advice`

**Title:** Modelling Advice  
**Subtitle:** Explore our expert modelling tips and guidance to help you succeed in your career  

**Intro**  
Every model — whether just starting out or already established — needs guidance at some point. Our collection of advice articles is designed to help you save time, avoid common mistakes, and make confident decisions throughout your modelling journey in Mauritius and beyond.

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

#### Safety & Trust — `/footer/safety-and-trust`

**Title:** Safety and Trust  

**Intro**  
ModelManagement.mu is a safe and reliable community for the modeling industry. We are constantly improving our tools to make sure both models and professionals can work together in a secure and transparent environment.

**Cards**
- **The Essentials to Know** → `/footer/safety-and-trust/what-you-should-know` — Model Agreements, reservations, reviews, secure chats, and verification.  
- **Safety Guidelines** → `/footer/safety-and-trust/avoid-scammers` — Practical tips to stay safe when talking to photographers, agencies, or agents.  
- **Scamming Examples** → `/footer/safety-and-trust/scamming-examples` — Recognize common red flags and respond the right way.  
- **Our Values** → `/footer/safety-and-trust/code-of-conduct` — Community rules for models, talent, and professionals.  

**The Essentials to Know — `/footer/safety-and-trust/what-you-should-know` (full content)**  
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
All verified members can leave reviews about others they've worked with. Moderation team checks every review. Benefits: Reviews show professionalism and reliability.

---

#### Contact — `/contact`

**Title:** Get in Touch  
**Subtitle:** We'd love to hear from you. Send us a message and we'll respond as soon as possible.

**Contact details**
- **Email Us:** info@modelmanagement.mu — We'll respond within 24 hours  
- **Call Us:** +230 468 6969 — Mon-Fri from 8am to 6pm  
- **Visit Us:** 2nd Floor, Unity House, Rue Du Savoir, Cybercity, Ebene, Mauritius 72201  

**Company Information**  
Flash Communications Ltd  
2nd Floor, Unity House, Rue du Savoir, Cybercity, Ebene, Mauritius 72201  
Website: www.theflashgroups.com  

**Form**
- **Fields:** Full Name*, Email*, Message*  
- **Button:** Send Message | Sending... | Success/Error  
- **Success:** Message sent successfully. We'll get back to you soon.  

---

#### Report Issue — `/report`

**Title:** Report & Complaints  
**Subtitle:** We take all reports seriously. Help us maintain a safe and professional platform by reporting any issues or concerns.

**Info**
- **Report Misconduct:** Report inappropriate behavior, harassment, or violations of our terms. We investigate all reports within 24-48 hours.  
- **Safety Concerns:** Report safety issues, suspicious activity, or security concerns.  

**Form**
- **Fields:** Full Name*, Email*, Report Type*, Subject*, Message*  
- **Report Type** (dropdown): Select report type | Harassment or Inappropriate Behavior | Safety Concern | Fraud or Scam | Technical Issue | Inappropriate Content | Other  
- **Submit:** Submit Report | Sending... | Success/Error message  

---

#### Privacy Policy — `/footer/privacy-policy`

**Title:** Privacy and Policy  

**Intro**  
This privacy policy applies to the website **MODELMANAGEMENT.MU**

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

#### Terms of Service — `/footer/terms-of-service`

**Title:** Terms of Use  
**Intro:** Please click on one of the links below to see the terms which are relevant to you.

**Links**
- **Models** → `/footer/terms-of-service/models` — Terms and conditions for models accessing MODELMANAGEMENT.MU  
- **Agencies** → `/footer/terms-of-service/agencies` — Terms and conditions for agencies accessing MODELMANAGEMENT.MU  
- **Agents** → `/footer/terms-of-service/agents` — Terms and conditions for agents accessing MODELMANAGEMENT.MU  
- **Other Industry Professionals** → `/footer/terms-of-service/professionals` — Terms and conditions for other industry professionals accessing MODELMANAGEMENT.MU  

*(Full legal text for each user type lives in the corresponding page files: `app/footer/terms-of-service/models/page.tsx`, `agencies`, `agents`, `professionals`.)*

---

#### Company Details — `/company-details`

**Title:** Company Details  
**Company name:** Flash Communications Ltd.  
**Address:** 2nd Floor, Unity House, Rue Du Savoir, Cybercity, Ebene, **Mauritius**  
**Registration:** VAT Number: 27261152 | Company Registration Number: C1412073  
**Website:** theflashgroups.com (https://www.theflashgroups.com)  
**Copyright:** © {year} Model Management Mauritius. All rights reserved.  

---

## 6. File Reference for Deeper Extraction

| Content | File(s) |
|--------|--------|
| Home buttons | `app/page.tsx`, `app/components/JettonHero.tsx` |
| Sponsor | `app/sponsor/page.tsx` |
| Models directory | `app/models/page.tsx`, `app/models/models-client.*` |
| Models & Talents | `app/modelsTalents/page.tsx` |
| Professionals | `app/professionals/page.tsx` |
| Discover-path | `app/discover-path/im-new-to-the-spotlight/page.tsx`, `im-a-full-time-model/page.tsx`, `im-an-influencer-with-a-passion-for-creating/page.tsx`, `im-a-creative-photographer/page.tsx`, `im-a-stylist/page.tsx`, `im-a-talent-artist/page.tsx`, `were-more-than-a-brand/page.tsx`, `we-are-your-go-to-agency/page.tsx` |
| Footer | `app/components/Footer.tsx` |
| Footer pages | `app/footer/about-us/page.tsx`, `app/footer/careers/page.tsx`, `app/footer/blog/page.tsx`, `app/footer/how-it-works/page.tsx` (+ models, professionals), `app/footer/modelling-advice/page.tsx`, `app/footer/safety-and-trust/page.tsx`, `app/footer/privacy-policy/page.tsx`, `app/footer/terms-of-service/page.tsx` |
| Contact, Report | `app/contact/page.tsx`, `app/report/page.tsx` |
| Company Details | `app/company-details/page.tsx` |

Use this extract together with **ALL_PAGES_CONTENT_EXTRACT.md** and **FORMS_AND_INNER_PAGES_EXTRACT.md** for full content and form migration to your new site.
