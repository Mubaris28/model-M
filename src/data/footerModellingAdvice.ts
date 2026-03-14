export type AdviceSection = {
  title?: string;
  body: string;
  bullets?: string[];
  ctaLabel?: string;
  ctaLink?: string;
};

export type AdvicePageContent = {
  title: string;
  subtitle: string;
  intro: string;
  sections: AdviceSection[];
  tip?: string;
  footerCta?: string;
  buttonLabel?: string;
  buttonLink?: string;
};

export const modellingAdviceContent: Record<string, AdvicePageContent> = {
  "practical-tips": {
    title: "Practical Tips for Models",
    subtitle: "Our Best Advice for Aspiring Models in Mauritius",
    intro: "Being a model in Mauritius is an exciting journey full of opportunities to express yourself, meet creative people, and work with brands both locally and internationally. Here are some useful tips to help you start and grow your modeling career with confidence.",
    sections: [
      { title: "Treat Modeling as Your Own Business", body: "As a model, you are your own brand. Success does not happen overnight—it takes time, effort, and commitment. Be professional, always show up on time, and take each opportunity seriously. Every photoshoot, casting, or collaboration can help you build your reputation." },
      { title: "Present Yourself with Confidence", body: "First impressions count. Be polite, confident, and respectful during castings or photoshoots. Show your natural style—you do not need to overdo it. Keep your look clean and simple, dress appropriately, and let your personality shine. In Mauritius, being genuine and approachable goes a long way." },
      { title: "Take Care of Your Health and Lifestyle", body: "A healthy lifestyle is key to looking and feeling your best. Stay hydrated, eat balanced meals, get enough rest, and try to stay active. Avoid smoking, excessive alcohol, or habits that can harm your skin and energy levels. Remember—a strong and healthy body is your best asset." },
      { title: "Skincare and Haircare", body: "The Mauritian climate can be harsh on your skin and hair, so regular care is important. Use sunscreen, gentle cleansers, and nourishing products suited to your type. Keep makeup light, especially for castings, and always remove it before sleeping. A fresh, natural look is often what clients prefer." },
      { title: "Attend Castings and Local Projects", body: "Every casting or photoshoot is a learning experience. Be punctual, bring your portfolio (or digital comp card), and show enthusiasm. The more you attend, the more people you meet—photographers, stylists, and other professionals who can open new doors for you in the industry." },
      { title: "Be Careful with Agency Contracts", body: "If an agency or brand offers you a contract, take time to read it carefully. Check the duration, commission percentage, cancellation terms, and any fees. In Mauritius, not all agencies operate under the same standards—so do not sign anything if you're unsure. Ask questions or contact ModelManagement.mu for advice before making a decision." },
      { title: "Keep Learning and Stay Positive", body: "The modeling world is competitive, but perseverance pays off. Stay humble, learn from each experience, and be patient with your progress. Believe in your potential and never compare your journey to someone else's—your uniqueness is your strength." },
    ],
    footerCta: "At ModelManagement.mu, we believe that everyone can shine in their own way. With the right mindset, professionalism, and care, you can build a successful modeling path right here in Mauritius.",
    buttonLabel: "Start Your Journey",
    buttonLink: "/become-model",
  },
  "best-shoots": {
    title: "Tips for the Best Shoots",
    subtitle: "What every aspiring model should know before stepping in front of the camera",
    intro: "Whether you are new or experienced, photo shoots are where you build your portfolio, confidence, and reputation. Here's what to keep in mind:",
    sections: [
      { title: "Test Shoots", body: "A test shoot is a free collaboration between a photographer and a model. It helps both build their portfolios and experiment with creative ideas. You don't get paid for it—it is a friendly trade of skills. Always work with trusted, verified photographers to stay safe and get professional results." },
      { title: "Be Professional and Prepared", body: "Come to every shoot on time, rested, and ready. Bring the requested outfits, stay flexible, and keep a positive attitude. Good energy makes the session smoother and leaves a strong impression on photographers and clients." },
      { title: "Communicate Well", body: "Listen carefully to the photographer's direction and do not hesitate to ask questions. Great communication creates better photos and helps you learn faster." },
      { title: "Stay Safe", body: "Unfortunately, not everyone online is genuine. Always verify who you're working with before agreeing to a shoot. When in doubt, contact ModelManagement.mu—we can help connect you with approved local professionals and safe photo sessions." },
    ],
    tip: "Professional photos are an investment in your career. The right photo shoot can open doors to agencies, brands, and creative projects both in Mauritius and abroad.",
  },
  "aspiring-models": {
    title: "Aspiring Models",
    subtitle: "Your first steps into the world of modeling",
    intro: "Starting a modeling journey can feel exciting and a little confusing. Here is how to take your first confident steps.",
    sections: [
      { title: "Know Your Goal", body: "Before anything else, decide what kind of modeling you want to do—fashion, commercial, lifestyle, or influencer work. Knowing your direction helps you focus and avoid wasting time on opportunities that do not fit you." },
      { title: "Learn the Basics", body: "Spend time learning how the industry works. Read about different types of modeling, what agencies expect, and how to prepare for castings. The more informed you are, the easier it will be to make smart choices." },
      { title: "Build Your Portfolio", body: "Good photos are your first introduction to agencies and clients. If possible, book a session with a verified local photographer or join a ModelManagement.mu photo shoot. Keep your pictures clean, natural, and professional—they do not need to be overly edited." },
      { title: "Get Exposure", body: "Create your free profile on ModelManagement.mu. It is your space to showcase your portfolio and connect with real agencies, brands, and photographers. Remember: we are not an agency, but a platform that helps you get discovered safely and quickly." },
      { title: "Stay Smart and Patient", body: "Never pay upfront to be \"accepted\" by an agency—genuine agencies earn from your future bookings, not from sign-up fees. And do not be discouraged by rejection; every model hears \"no\" before they get a \"yes\"." },
    ],
    tip: "Stay professional, stay positive, and keep updating your profile. Every shoot, every connection, and every lesson brings you one step closer to your dream.",
    buttonLabel: "Create Your Profile",
    buttonLink: "/become-model",
  },
  "build-portfolio": {
    title: "Build the Right Portfolio",
    subtitle: "Show your best self: the smart way",
    intro: "Your portfolio is your first impression. Before clients or agencies meet you, they will look at your photos—so make them count.",
    sections: [
      { title: "Know Your Style", body: "Decide what type of modeling suits you best—fashion, commercial, plus-size, or lifestyle. Build your portfolio around that style. Do not try to fit into every category; focus on what highlights your strengths." },
      { title: "Keep It Simple and Professional", body: "Quality always wins over quantity. For new models, 6–12 great photos are enough; for experienced ones, 10–25 works well. Include natural headshots (minimal make-up), full-body photos in clean, fitted outfits, and different expressions or moods to show your range." },
      { title: "Be Authentic", body: "You do not need swimsuit or lingerie shots unless that is the field you want to pursue. Authentic, confident images that represent you are what brands value most in Mauritius today." },
      { title: "Update Regularly", body: "Refresh your photos every few months as you gain experience. A current, polished portfolio helps you stand out and attract better opportunities both locally and internationally." },
    ],
    tip: "Work with verified photographers or join a ModelManagement.mu photo session to get professional Polaroids and portfolio shots safely and affordably.",
    buttonLabel: "Start Building Your Portfolio",
    buttonLink: "/become-model",
  },
  "discover-confidence": {
    title: "Discover Your Confidence",
    subtitle: "Discover your potential with ModelManagement.mu",
    intro: "Many new faces in Mauritius often ask: \"Can I really be a model?\" The truth is—modeling is no longer limited to one look or one body type. The world of modeling today is wide and diverse. Mauritius too is opening up to new types of models—people with confidence, personality, and passion. Below are different types of modeling you can explore.",
    sections: [
      { title: "High Fashion Modeling", body: "This type represents the runways and editorials you see in big fashion cities. Female models in this category are generally between 172cm and 180cm; males 180cm to 188cm. Some local fashion events and brands do look for high-fashion profiles." },
      { title: "Editorial Print Modeling", body: "Editorial modeling involves working for magazines, campaigns, or artistic photography. Mauritius is seeing growth in lifestyle and fashion magazines, as well as tourism and wellness publications." },
      { title: "Commercial Modeling", body: "Commercial models represent real people that consumers can relate to. You might appear in TV ads, billboards, or social media campaigns. In Mauritius, this is one of the most accessible and in-demand types of modeling." },
      { title: "Catalogue & E-Commerce Modeling", body: "Brands and shops need models to display clothing or accessories online. With e-commerce growing fast in Mauritius, many businesses look for models of different sizes, backgrounds, and styles." },
      { title: "Plus-Size Modeling", body: "Plus-size modeling celebrates body positivity and diversity. If you have a US size 12–16 (UK 14–18) and carry yourself with pride and elegance, this path could be perfect for you." },
      { title: "Glamour Modeling", body: "This area focuses on sensuality and confidence—from swimwear and lingerie shoots to artistic photography. If you choose this path, work only with trusted professionals or verified agencies." },
      { title: "Body Parts Modeling", body: "Your hands, eyes, hair, or smile could be your standout feature. Body-part modeling is used in advertising—for example, a hand holding a perfume bottle or a smile in a dental campaign." },
      { title: "TV Commercials & Video Ads", body: "Brands in Mauritius frequently create TV or online ads and need people of all looks, ages, and personalities. Being natural in front of the camera is often enough." },
      { title: "Real-Life & Lifestyle Models", body: "These models represent the everyday Mauritian—the student, the parent, the professional. Companies love to feature authentic people that viewers can connect with." },
      { title: "Influencer Models", body: "With social media shaping trends, brands collaborate with people who have a strong Instagram or TikTok presence. If you have a unique look or style, you can become an influencer model." },
    ],
    footerCta: "No matter your height, age, or size—modeling in Mauritius is open to everyone with confidence, professionalism, and passion. Join ModelManagement.mu today and start discovering where you belong.",
    buttonLabel: "Join ModelManagement.mu",
    buttonLink: "/become-model",
  },
  "glossary": {
    title: "Glossary of Modeling Terms",
    subtitle: "Learn the key modeling terms you'll hear every day",
    intro: "Understanding industry terms will help you feel confident and professional when working with agencies, brands, or photographers. Here are some of the most common ones:",
    sections: [
      { body: "Agency — A company that represents and promotes models to clients. Book / Portfolio — Your collection of photos that shows your range and look. Booker — The person in an agency who manages your castings and jobs. Buyout — Extra payment for how and where your photos will be used. Casting — A meeting or audition where models are selected for a job. Catwalk / Runway — The stage used during fashion shows. Composite Card (Comp Card) — Your professional model card with photos, measurements, and contact details." },
      { body: "Editorial — Photos used in magazines to tell a story or showcase fashion. Fitting — A session where outfits are tried and adjusted before a photoshoot or show." },
      { body: "Go & See — A quick meeting between a model and a potential client. Hair Stylist / Makeup Artist (MUA) — Professionals who style your look for shoots or shows. Lingerie — Stylish undergarments often used in fashion or swimwear shoots. Location — The place where the shoot happens—studio or outdoors." },
      { body: "Model Release — A document you sign to allow the use of your photos. New Face — A new model just entering the industry. Plus Size — Models who represent curvier body types. Polaroids — Simple, natural photos showing your real face and body—no filters or heavy makeup." },
      { body: "Runway — Another term for catwalk. Stylist — The person responsible for clothing and accessories during shoots. Tear Sheet — A page from a magazine showing your published work. Test Shoot (TFP) — A free photo session between model and photographer to build portfolios." },
      { body: "Usage — How and where your image is used and how you will be paid. Wardrobe — The outfits you will wear for a shoot or show." },
    ],
    tip: "Keep learning the language of modeling—it will make working with agencies, photographers, and clients much easier.",
  },
  "model-academies": {
    title: "Model Academies and Training Centers",
    subtitle: "Learn, grow, and gain confidence in your modeling journey",
    intro: "You do not need to go to a modeling school to become a model—but it can be a great way to start. A good course helps you understand the basics, build confidence, and prepare for real opportunities in the industry.",
    sections: [
      { title: "What You Will Learn", body: "Modeling schools teach more than just posing or walking the runway. You will also learn catwalk techniques and posture, camera presence and how to work with photographers, makeup, skincare, and grooming, healthy habits (fitness, nutrition, self-care), and portfolio development. Many schools also focus on self-confidence and personal image." },
      { title: "Choosing the Right School", body: "Not all modeling schools are the same. Do your research—look for reputable programs with experienced trainers or positive reviews. You can also ask other models for recommendations." },
      { title: "Why It Helps", body: "A good modeling course gives you a head start. You will gain skills, learn how to handle castings, and feel more prepared when stepping into the professional world. Most importantly, it helps you discover your unique style as a model." },
    ],
    tip: "Some schools in Mauritius now collaborate with ModelManagement.mu for workshops and photo sessions—a safe, professional way to build experience and confidence.",
  },
  "modeling-workshops": {
    title: "Modeling Workshops",
    subtitle: "Learn, grow, and have fun doing it!",
    intro: "Modeling may look easy, but a little training can make a huge difference. Taking a modeling class helps you gain confidence, learn professional techniques, and understand how the industry really works.",
    sections: [
      { title: "Why Take Modeling Classes?", body: "Even if you are a natural in front of the camera, modeling classes can help you refine your skills. You will learn how to pose, walk, and express emotions confidently—all while discovering your personal style." },
      { title: "What You Will Learn", body: "Depending on the course, classes often include runway and posture training, facial expressions and camera presence, personal styling, skincare, and grooming tips, confidence and public speaking skills, and portfolio and photo-shoot preparation. Some schools also offer combined classes with acting or dance." },
      { title: "Find the Right Class for You", body: "Look for trusted schools or instructors that fit your goals, whether you are a beginner, a plus-size model, a teen, or an adult. Choose a class that feels supportive, professional, and fun." },
    ],
    tip: "Mauritius has growing opportunities for modeling workshops and short training sessions. You can also join ModelManagement.mu events to practice with local photographers and trainers in a safe, encouraging environment.",
  },
  "real-model": {
    title: "How is a Real Model",
    subtitle: "What to expect from a real modeling journey",
    intro: "Many dream of becoming a model—walking in fashion shows, wearing designer clothes, or appearing in ads. But behind the glamour, a modeling career takes hard work, discipline, and consistency. Here is what you should know before stepping in.",
    sections: [
      { title: "Time and Dedication", body: "Modeling does not happen overnight. Building your portfolio, reputation, and connections takes patience and commitment. Stay confident, learn from each experience, and do not let rejection stop you—every successful model started somewhere." },
      { title: "Be Professional", body: "Your attitude is everything. Always show up on time, be polite, and bring positive energy to every photo shoot or event. Long hours are normal, and teamwork matters. People remember models who are easy to work with—that is what leads to repeat bookings." },
      { title: "Stay Open-Minded", body: "The modeling world often means new people, new places, and new opportunities. You might work with international brands visiting Mauritius or even travel abroad someday. Be adaptable—every experience helps you grow personally and professionally." },
      { title: "Enjoy the Journey", body: "Modeling can be exciting but also short-lived, so make the most of it. Learn, connect, and enjoy every moment while preparing for what comes next. Whether you continue in fashion, marketing, or media—the skills you build here will always stay with you." },
    ],
    tip: "Stay grounded, be professional, and never stop improving. At ModelManagement.mu, we're here to help you make the most of your modeling journey safely and confidently.",
  },
  "self-photography": {
    title: "How to Capture Your Own Modeling Photos",
    subtitle: "You do not always need a professional photographer to look professional",
    intro: "With today's phones and cameras, you can take great modeling photos yourself—all you need is good lighting, a clean background, and confidence in front of the camera.",
    sections: [
      { title: "Know Your Angles", body: "Practice your poses in front of a mirror. Learn what makes you look confident and natural—not forced. Relax your face, elongate your neck slightly, and keep your hands loose. Remember: confidence is more powerful than perfection." },
      { title: "Keep It Simple", body: "Use a plain background (white or light-colored) and avoid distractions. Wear fitting clothes that show your shape, and use light, natural makeup if needed. You should always be the focus of the picture—not the background." },
      { title: "Use Good Light", body: "Natural daylight is your best friend. Face a window or shoot outdoors during the morning or late afternoon. Avoid harsh shadows or strong flash—soft light makes your features look clean and natural." },
      { title: "Stay Authentic", body: "Do not copy poses or fake smiles. Show your real personality—brands in Mauritius are looking for models who look real, not overly posed. Be comfortable, confident, and true to yourself." },
      { title: "Experiment and Learn", body: "Take several shots, change angles, and review what works best. The more you practice, the more you'll understand your best expressions and body language." },
    ],
    tip: "Once you've got good-quality photos, upload them to your ModelManagement.mu profile—it is your first step to being seen by agencies, brands, and photographers in Mauritius and abroad.",
    buttonLabel: "Upload Your Photos",
    buttonLink: "/become-model",
  },
};
