# Forms & Inner Pages — Full Content Extract for Migration

This file contains **all form sections, fields, labels, placeholders, and options**, plus **full content of all case-study inner pages** and other key inner pages, for migration to a new site.

---

# PART 1 — ALL FORMS (Sections, Fields, Labels, Placeholders, Options)

---

## 1.1 Signup — `/signup`

**Step 1 — Create Account**

| Section | Field name | Label | Placeholder / options | Required |
|--------|------------|--------|------------------------|----------|
| — | name | Full Name | Enter your full name | Yes |
| — | email | Email Address | Enter your email | Yes |
| — | phone | Phone Number | Enter your phone number | Yes |
| — | password | Password | Create a password (min. 6 characters) | Yes |
| — | confirmPassword | Confirm Password | Confirm your password | Yes |
| — | agreeToTerms | — | I agree to the Terms of Service and Privacy Policy (checkbox) | Yes |

**Buttons:** Back to Home | Create Account (loading: Creating Account...)  
**Footer:** Already have an account? Sign in here → `/login`  
**Validation messages:** Please fill in all fields | Passwords do not match | Password must be at least 6 characters | Please agree to the terms and conditions  
**Error link:** Sign in here (if email already exists)

**Step 2 — Verify Email (OTP)**

| Field | Label | Placeholder | Required |
|-------|--------|-------------|----------|
| otp | VERIFICATION CODE | Enter 6-digit code | Yes (6 digits) |

**Copy:** We've sent a 6-digit verification code to **{email}** | Can't find it? Check your spam / junk folder. The code expires in 10 minutes.  
**Buttons:** Back to Form | VERIFY EMAIL (loading: Verifying...)  
**Resend:** Didn't receive the code? RESEND CODE / RESEND IN {n}s  

---

## 1.2 Login — `/login`

| Field | Label | Placeholder | Required |
|-------|--------|-------------|----------|
| email | Email Address | Enter your email | Yes |
| password | Password | Enter your password | Yes |

**Headers:** Welcome Back | Sign in to your account to continue  
**Links:** Forgot your password? → `/forgot-password`  
**Buttons:** Back to Home | Sign In (loading: Signing in...)  
**Footer:** Don't have an account? Sign up → `/signup`  

---

## 1.3 Forgot Password — `/forgot-password`

**Form**

| Field | Label | Placeholder | Required |
|-------|--------|-------------|----------|
| email | Email Address | Enter your email address | Yes |

**Headers:** Reset Password | Enter your email address and we'll send you a link to reset your password.  
**Buttons:** Back to Login | Send Reset Link (loading: Sending...)  
**Footer:** Remember your password? Sign in | Don't have an account? Sign up  

**Success state**

- **Title:** Check Your Email  
- **Text:** We've sent a password reset link to **{email}**  
- **Instructions:** Please check your email and click the link to reset your password. The link will expire in 1 hour for security reasons.  
- **Buttons:** Send Another Email | Back to Login  

**Error messages:** No account found with this email address. | Please enter a valid email address. | Too many attempts. Please try again later. | Failed to send password reset email. Please try again.  

---

## 1.4 Contact — `/contact`

**Left side (info)**

- **Title:** Get in Touch  
- **Subtitle:** We'd love to hear from you. Send us a message and we'll respond as soon as possible.  
- **Email Us:** info@modelmanagement.mu — We'll respond within 24 hours  
- **Call Us:** +230 468 6969 — Mon-Fri from 8am to 6pm  
- **Visit Us:** 2nd Floor, Unity House, Rue Du Savoir, Cybercity, Ebene | **Mauritius**, 72201  
- **Company:** Flash Communications Ltd | address | Website: www.theflashgroups.com  
- **Follow Us:** Stay updated with our latest news and updates (Instagram, TikTok, LinkedIn, Facebook)  

**Form — Send Message**

| Field | Label | Placeholder | Required |
|-------|--------|-------------|----------|
| name | Full Name | Enter your full name | Yes |
| email | Email Address | Enter your email address | Yes |
| message | Message | Tell us how we can help you... | Yes |

**Headers:** Send Message | Fill out the form below and we'll get back to you  
**Button:** Send Message | Sending Message... | Message Sent! | (error state)  

---

## 1.5 Report — `/report`

**Left side (info)**

- **Title:** Report & Complaints  
- **Subtitle:** We take all reports seriously. Help us maintain a safe and professional platform by reporting any issues or concerns.  
- **Report Misconduct:** Report inappropriate behavior, harassment, or violations of our terms — We investigate all reports within 24-48 hours  
- **Safety Concerns:** Report safety issues, suspicious activity, or security concerns — Your safety is our top priority  
- **Technical Issues:** Report bugs, technical problems, or platform issues — Help us improve the platform  
- **Important Information:**  
  - All reports are confidential and reviewed by our team  
  - False reports may result in account suspension  
  - For urgent safety concerns, contact us directly  
  - We will follow up on your report within 48 hours  

**Form — Submit Report**

| Field | Label | Placeholder / options | Required |
|-------|--------|------------------------|----------|
| name | Full Name | Enter your full name | Yes |
| email | Email Address | Enter your email address | Yes |
| reportType | Report Type | Select report type | Yes |
| — | — | Harassment or Inappropriate Behavior | option |
| — | — | Safety Concern | option |
| — | — | Fraud or Scam | option |
| — | — | Technical Issue | option |
| — | — | Inappropriate Content | option |
| — | — | Other | option |
| subject | Subject | Brief description of the issue | Yes |
| message | Detailed Description | Please provide detailed information about the issue, including dates, times, and any relevant details... | Yes |

**Headers:** Submit Report | Please provide as much detail as possible to help us investigate your concern  
**Button:** Submit Report | Submitting Report... | Report Submitted! | Try Again (error)  
**Success:** Thank you! Your report has been submitted successfully. We will investigate and get back to you within 48 hours.  
**Error:** Failed to submit report. Please try again.  

---

## 1.6 Careers Application — `/footer/careers`

**Form — Ready to Make a Difference? Apply Today!**

| Field | Label | Placeholder / options | Required |
|-------|--------|------------------------|----------|
| fullName | Full Name | Enter your full name | Yes |
| position | Position Applying For | Choose your desired position | Yes |
| — | — | Model Lead | option |
| — | — | Model Manager | option |
| — | — | Other (Please specify in cover letter) | option |
| email | Your Email | Enter your email address | Yes |
| phone | Phone Number | Enter your phone number | Yes |
| coverLetter | Cover Letter | Tell us why you're interested in joining our team... | No (max 1000 chars, counter shown) |
| file | Upload Resume / CV / Documents | Drag & Drop or Browse Files — Max. 20 MB (PDF & various document formats), max 4 files | Yes |

**Button:** Submit Application | Submitting Application... | Application Submitted!  
**Success:** Thank you! Your application has been submitted successfully. We'll review it and get back to you soon.  
**Error:** Failed to submit application. Please try again.  

---

## 1.7 Post Casting — `/dashboard/post-casting` (Professionals)

**Section 1 — Casting Type** (cards, single choice)

- Paid Shoot — Professional paid modeling assignment  
- Collaborative Shoot — Trade for portfolio/experience (TFP/TFCD)  
- Content Creation — Social media content, UGC, or brand collaboration  

**Section 2 — Basic Information**

| Field | Label | Placeholder | Required |
|-------|--------|-------------|----------|
| title | Casting Title | e.g., Fashion Photoshoot for Summer Collection | Yes |
| description | Description | Provide detailed description of the project, concept, and what you're looking for... | Yes |

**Section 3 — Location & Timeline**

| Field | Label | Placeholder / options | Required |
|-------|--------|------------------------|----------|
| location | Location | Select Location (dropdown: Mauritius districts + cities + international list) | Yes |
| customLocation | Enter Custom Location | e.g., Flic en Flac, Mauritius (if Location = Other) | If Other |
| isRemote | — | Remote/Self-shot content (checkbox) | No |
| shootDate | Shoot Date | date picker | Yes |
| applicationDeadline | Application Deadline | date picker | Yes |
| duration | Duration | Select Duration | No |
| — | — | 1-2 hours (Quick shoot) | option |
| — | — | Half day (3-4 hours) | option |
| — | — | Full day (6-8 hours) | option |
| — | — | Multiple days (2-3 days) | option |
| — | — | Extended project (1+ weeks) | option |

**Section 4 — Payment & Compensation** (shown if casting type = paid-shoot)

| Field | Label | Placeholder / options | Required |
|-------|--------|------------------------|----------|
| paymentAmount | Payment Amount | 0 | If paid |
| paymentCurrency | Currency | MUR (₨), USD ($), EUR (€), GBP (£), CAD (C$), AUD (A$) | No |
| paymentType | Payment Type | Select Type | No |
| — | — | Per Hour (Professional rate) | option |
| — | — | Per Day (Standard day rate) | option |
| — | — | Project Rate (Fixed amount) | option |
| — | — | Performance Based (Commission) | option |
| — | — | Negotiable | option |
| additionalCompensation | Additional Compensation | e.g., Travel expenses, meals, portfolio images, etc. | No |

**Section 5 — Model Requirements**

| Field | Label | Placeholder / options | Required |
|-------|--------|------------------------|----------|
| gender | Gender | Female, Male, Non-binary, Any (checkboxes) | No |
| ageMin | Age Range (Min) | 16 (min 16, max 65) | No |
| ageMax | Age Range (Max) | 65 | No |
| heightMin | Height Range (Min cm) | 160 (140–220) | No |
| heightMax | Height Range (Max cm) | 180 | No |
| ethnicities | Ethnicity | Asian, Black/African, Hispanic/Latino, Middle Eastern, Native American, Pacific Islander, White/Caucasian, Mixed, Any (checkboxes) | No |
| experience | Experience Level | Select Experience | No |
| — | — | Beginner (0-1 years), Intermediate (1-3 years), Experienced (3-5 years), Professional (5+ years), Any | options |
| numberOfModels | Number of Models | 1 (1–20) | No |
| specialRequirements | Special Requirements | Any specific skills, looks, or requirements... | No |
| nudityLevel | Nudity Level | No nudity - Fully clothed | default |
| — | — | Implied nudity - Suggestive but covered | option |
| — | — | Artistic nude - Tasteful artistic content | option |
| — | — | Partial nudity - Some skin exposure | option |

**Section 6 — Wardrobe & Styling**

| Field | Label | Placeholder | Required |
|-------|--------|-------------|----------|
| wardrobeProvided | — | Wardrobe provided (checkbox) | No |
| wardrobeDetails | — | Describe the wardrobe provided... (textarea, if checked) | No |
| makeupProvided | — | Makeup/Hair styling provided (checkbox) | No |
| makeupDetails | — | Describe styling services provided... (textarea, if checked) | No |

**Section 7 — Additional Details**

| Field | Label | Required |
|-------|--------|----------|
| travelRequired | Travel required (checkbox) | No |
| accommodationProvided | Accommodation provided (checkbox) | No |
| mealProvided | Meals provided (checkbox) | No |
| additionalPerks | Additional Perks | No (textarea: Any other benefits or perks offered...) |

**Section 8 — Reference Images/Videos**

- Upload mood boards, reference images, or example content (optional)  
- Accept: image/*, video/* — Choose Files (0/5)  

**Section 9 — Contact Information**

| Field | Label | Placeholder | Required |
|-------|--------|-------------|----------|
| contactEmail | Contact Email | your@email.com | Yes |
| contactPhone | Contact Phone | +1 (555) 000-0000 | No |
| portfolioRequired | — | Portfolio required for application (checkbox) | No |

**Section 10 — Usage Rights & Legal**

| Field | Label | Placeholder | Required |
|-------|--------|-------------|----------|
| usageRights | Usage Rights | Describe how the images/content will be used... | No |
| contractDetails | Contract Details | Any contract terms or legal requirements... | No |

**Submit:** Post Casting | Posting...  
**Disclaimer:** Your casting will be reviewed by our team before going live. This usually takes 24-48 hours.  

---

## 1.8 Marketplace Offer (Post Offer Modal) — `/dashboard/mymarketplace`

**Modal title:** Post a Marketplace Offer  
**Subtitle:** Share your services with models looking for opportunities  

**Section 1 — Basic**

| Field | Label | Placeholder | Required |
|-------|--------|-------------|----------|
| title | Title | e.g., Professional Portrait Session, Makeup Service | Yes |
| phone | Phone Number | e.g., +230 5XXX XXXX | Yes |
| email | Email | e.g., your@email.com | Yes |
| description | Description | Describe your offer in detail... Include what you offer, pricing, location, and any other relevant information. | Yes |

**Section 2 — Social Media & Website (Optional)**

| Field | Label | Placeholder | Required |
|-------|--------|-------------|----------|
| website | Website | https://yourwebsite.com | No |
| instagram | Instagram | @username or profile URL | No |
| facebook | Facebook | Profile or page URL | No |
| tiktok | TikTok | @username or profile URL | No |
| linkedin | LinkedIn | Profile URL | No |
| twitter | Twitter/X | @username or profile URL | No |

**Section 3 — Photos**

- **Label:** Photos * (Up to 6 images)  
- **Help:** Upload high-quality images to showcase your offer  
- **Upload:** Click to upload photos | You can upload X more photo(s) | Maximum reached  
- **Validation:** Max 6 photos, max 50MB per file, image only. At least one photo required.  

**Button:** Post Offer | Posting... | Posted Successfully!  
**Success message:** Your offer has been submitted for review!  
**Error examples:** You can upload a maximum of 6 photos | File too large (50MB) | Please upload at least one photo | Premium required message  

---

## 1.9 Become Model — `/become-model` (Two steps)

**Step 1 — Sections & fields**

**1. Personal Information **\***  
- Username * (placeholder: Username)  
- First name / Last name (or full name fields as in form)  
- Date of birth * (placeholder: Select your date of birth) — calendar  
- Gender * (dropdown: Select your gender)  
- Ethnicity * (dropdown: Select your ethnicity)  
- Nationality * (dropdown: Select your nationality)  
- Location * (dropdown: Select your location); if Other → Custom Location  
- Phone Number * (country code + number, optional WhatsApp checkbox)  
- **Languages Spoken *** (multi-select, required)  

**2. Physical Measurements **\***  
- Height (cm), Weight (kg), Chest/Bust, Waist, Hips, Dress size, Shoe size  
- Eye color, Hair color, Body type  

**3. Modeling Disciplines **\***  
- Multi-select (e.g. Runway, Commercial, Editorial, Fitness, etc.)  

**4. Categories **\***  
- Multi-select (e.g. Fashion, Swimwear, Lingerie, etc.)  

**5. Social Media Presence **\*** (at least one)  
- Instagram (placeholder: Instagram Handle (@yourusername))  
- TikTok (placeholder: TikTok Handle (@yourusername))  
- Twitter (placeholder: Twitter Handle (@yourusername))  
- Other social media + URL/handle  

**6. Portfolio Images **\***  
- 4–6 images; accept JPEG, JPG, PNG, WebP  
- Upload area, preview grid, remove per image  

**Step 1 buttons:** Back to Role Selection | Continue to Verification (loading: Saving Progress...)  
**Disclaimer:** After clicking continue, your progress will be saved and you'll be able to upload your verification documents. You can complete the verification step later - your progress is automatically saved.  

**Step 2 — Verification**

**1. Identity Verification **\***  
- **ID/Passport Number *** — placeholder: Enter your ID or Passport number  
- **ID/Passport Photo *** — single image upload  
- Privacy message: Your Privacy & Safety Matter (bullets: used only for verification, stored securely, not shared, etc.; link to Privacy Policy)  
- **Selfie with ID *** — one image  

**Step 2 buttons:** Back to Step 1 | Submit Application  

*(Exact dropdown options for gender, ethnicity, nationality, location, disciplines, categories come from become-model page; copy from `app/become-model/page.tsx` if needed.)*

---

## 1.10 Register (Professional) — `/register`

**Sections (typical structure)**

1. **Professional Type** — Cards: Photographer, Brand, Agency, etc. (single choice).  
2. **Profile/Logo** — Company logo or profile image upload.  
3. **Contact** — Phone Number * (with country code, optional WhatsApp).  
4. **Company & Location** — Company Name (placeholder: Enter your company or agency name), BRN Number (placeholder: Enter your Business Registration Number), Company Website (placeholder: https://www.yourcompany.com (optional)), Location (dropdown: Select your location).  
5. **Bio** — Bio (textarea).  

**Submit:** Submit / loading state.  

*(Full field list in `app/register/page.tsx`.)*

---

## 1.11 Admin Login — `/admin/login`

| Field | Label | Required |
|-------|--------|----------|
| email | Email | Yes |
| password | Password | Yes |

**Headers:** Admin Portal | Please login with your administrator credentials  
**Button:** Login to Admin Panel | Logging in...  

---

# PART 2 — CASE-STUDIES INNER PAGES (Full Content)

---

## 2.1 From Struggles to Success — `/case-studies/from-struggles-to-success`

**Route:** `/case-studies/from-struggles-to-success`  
**Image:** `/images/case-studies/new/case study 1 (inside).webp`  

**Hero**
- **Back:** Back to Homepage → `/`
- **Category:** Case Study 1
- **Title:** From Struggles to Success: How model management empowers every model
- **Subtitle:** Empowering models through transparency, technology, and fair practices

**The Challenge**
The modelling industry may appear glamorous from the outside, but many models face real challenges behind the scenes. Unstable income, inconsistent job opportunities, and the constant pressure to maintain a perfect image often lead to stress and insecurity. Many aspiring talents struggle to find the right guidance, face unfair working conditions, and experience difficulties managing travel, schedules, and finances. Additionally, short career spans and limited access to transparent contracts make it even harder for models to build long-term, sustainable careers.

**Stats (3 cards)**
- 100% — Verified Professionals
- Secure — Smart Contracts
- Transparent — Fair Practices

**Our Solution**
At Modelmanagement.mu, we aim to change this reality by creating a safer, smarter, and more empowering environment for models. Our platform connects models directly with verified professionals, ensuring transparency and trust in every collaboration. Through our smart contract system, all agreements are clear and secure, protecting the rights of both models and professionals. We also provide resources, training opportunities, and visibility tools that help models showcase their talent and build a personal brand beyond traditional agencies.

**The Impact**
By combining technology, education, and fair practices, Modelmanagement.mu bridges the gap between models and the industry. We help talents take control of their careers, access more opportunities, and work confidently with local and international brands. Our goal is simple: to make the modelling journey not only successful but also safe, transparent, and sustainable for every model who joins our platform.

**CTA**
- **Title:** Ready to take control of your modelling career?
- **Text:** Join Modelmanagement.mu and experience a safer, smarter, and more empowering modelling journey
- **Button:** Join Now → `/signup`

---

## 2.2 Why We Created Modelmanagement in Mauritius — `/case-studies/why-we-created-modelmanagement-mauritius`

**Route:** `/case-studies/why-we-created-modelmanagement-mauritius`  
**Image:** `/images/case-studies/new/CASE_STUDY_3.webp`  

**Hero**
- **Back:** Back to Homepage → `/`
- **Category:** Case Study 3
- **Title:** Why We Created Modelmanagement in Mauritius
- **Subtitle:** Bridging the gap between local talent and global opportunities

**The Challenge**
The modelling world has evolved faster than ever before. Around the globe, digital platforms, and social media have transformed the way models are discovered and hired. Today, opportunities no longer depend only on physical agencies or location talented individuals can build successful careers from anywhere in the world. However, in Mauritius, this global momentum has yet to be fully embraced. Despite the island's growing creative energy, talented people often lack the visibility, guidance, and structure needed to reach international standards.

**Stats (3 cards)**
- Global — Reach
- Local — Talent
- Rising — Hub

**Our Vision**
That is where Modelmanagement.mu was born out of a vision to bridge this gap. We saw that Mauritius is full of potential: diverse faces, unique stories, and ambitious individuals ready to shine. What was missing was a platform to connect them to real opportunities, protect their rights, and empower them to grow professionally. Modelmanagement.mu was created to give local talent the same tools and exposure enjoyed by models in larger markets.

**The Impact**
We aim to position Mauritius as a rising hub in the modelling and creative industries a place where passion meets professionalism. By embracing diversity, technology, and ethical practices, we're not just building a platform; we're building a movement that puts Mauritian talent on the global stage.

**CTA**
- **Title:** Ready to put Mauritian talent on the global stage?
- **Text:** Join Modelmanagement.mu and be part of the movement
- **Button:** Join Now → `/signup`

---

## 2.3 All Faces. All Backgrounds. One Platform. — `/case-studies/all-faces-all-backgrounds`

**Route:** `/case-studies/all-faces-all-backgrounds`  
**Image:** `/images/case-studies/new/CASE_STUDY_2_inside.webp`  

**Hero**
- **Back:** Back to Homepage → `/`
- **Category:** Case Study 2
- **Title:** All Faces. All Backgrounds. One Platform.
- **Subtitle:** Where Passion Matters More Than Perfection

**The Challenge**
The modelling industry has long been seen as glamorous full of lights, cameras, and international fame. But behind the spotlight lies a reality many aspiring models know too well: uncertainty, competition, and pressure to fit into narrow beauty standards. Many talented individuals are overlooked simply because they don't fit a "typical" mold whether it's due to their skin color, body shape, or cultural background. Others face unstable income, lack of professional guidance, or fear of exploitation in an industry that often values looks over integrity.

**Stats (3 cards)**
- All — Faces Welcome
- Passion — Over Perfection
- Fair — Opportunities

**Our Mission**
At Modelmanagement.mu, we believe it's time to redefine what it means to be a model. Our mission is to create a platform where talent, motivation, and professionalism matter more than perfection. Whether you're tall or petite, dark-skinned or fair, curvy or slim if you are passionate, hardworking, and ready to grow, we are here to help you build your career.

Our system is designed to make modelling accessible, transparent, and fair. Through verified professional listings and secure smart contracts, models can collaborate confidently with brands, photographers, and agencies. Every partnership is protected ensuring fair pay, clear agreements, and mutual respect. We also help models develop professional portfolios, improve their visibility through digital tools, and gain access to training resources that enhance their confidence and skills.

**The Impact**
But Modelmanagement.mu is more than a platform it's a community. We celebrate individuality and diversity, giving every model a chance to shine in their own unique way. Our approach is to guide, not gatekeep; to empower, not exploit. By combining technology, mentorship, and inclusive values, we're helping models transform challenges into opportunities.

In a world where trends change daily, true impact comes from authenticity. At Modelmanagement.mu, we're building the next generation of models confident, diverse, and fearless ready to represent the beauty of real people everywhere.

**CTA**
- **Title:** Ready to showcase your unique talent?
- **Text:** Join a platform where passion matters more than perfection
- **Button:** Join Now → `/signup`

---

# PART 3 — OTHER INNER PAGES (Reference)

- **Discover-path pages:** Full content for each slug is in `app/discover-path/[slug]/page.tsx` (e.g. im-new-to-the-spotlight, im-a-full-time-model, were-more-than-a-brand, we-are-your-go-to-agency, im-an-influencer-with-a-passion-for-creating, im-a-creative-photographer, im-a-stylist, im-a-talent-artist). Copy from those files for migration.  
- **Footer sub-pages (how-it-works, safety-and-trust, modelling-advice, terms, blog posts):** Full text is in `ALL_PAGES_CONTENT_EXTRACT.md` and in each `app/footer/.../page.tsx`.  
- **Dashboard account (Personal, Public, Notifications):** Field sets follow Firestore user/model/profile structure; see `app/dashboard/account/*` and `WEBSITE_COMPLETE_WORKING_BRIEF.md`.  

Use this file together with **ALL_PAGES_CONTENT_EXTRACT.md**, **MIGRATION_PAGE_CONTENTS.md**, and **WEBSITE_COMPLETE_WORKING_BRIEF.md** for a complete migration of forms and inner pages to your new site.
