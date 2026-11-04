// Temporary sample records: replace placeholder copy, rates, materials, and images with verified artist submissions.
(() => {
  // ARTIST COMMISSION INFORMATION
  // Each artist keeps profile, social, and commission details together.
  // ADD NEW ARTIST HERE
  const artists = [
    {
      id: "artist-mjs-001",
      name: "Michael John Santos",
      profilePicture: "images/Profile Icon/mjasicon Background Removed.png",
      coverPhoto: "images/Profile Icon/proficon.jpeg",
      description: "Available for sketch, painting, and digital art commissions. Share your concept and references to discuss the project details",
      specialization: "UI/UX Design, Digital Art, Illustration",
      socials: {
        facebook: "https://www.facebook.com/michaeljohn.aquino.santos/",
        instagram: "https://www.instagram.com/_k.ae.ll/",
        email: "mailto:michaeljohnsantosss965@gmail.com",
        other: []
      },
      commission: {
        available: "Availability to be confirmed",
        rates: "2,000; confirm the final rate directly with the artist",
        types: ["Sketch", "Painting", "Digital Art"],
        materials: ["Materials to be confirmed"],
        description: "To be confirmed per project; may include digital design tools, drawing materials, or painting supplies",
        guidelines: ["Share a clear brief and references. Confirm the scope, final rate, materials, timeline, and usage with the artist before booking"]
      }
    },
    {
      id: "artist-mjb-002",
      name: "Matt Julius Bianzon",
      profilePicture: "images/Profile Icon/matticon Background Removed.png",
      coverPhoto: "images/drawings/Mattbianzondrawing/coverphoto matt.jpeg",
      description: "Matt Julius Bianzon is a multidisciplinary artist working across illustration, digital art, painting, and graphic design. His portfolio brings together expressive imagery and visual communication, from personal artwork and creative graphics to interface concepts.",
      specialization: "UI/UX Design, Digital Art, Illustration",
      socials: {
        facebook: "https://www.facebook.com/share/1B5PhzCNsi/",
        instagram: "https://www.instagram.com/_strwbiezxcv",
        email: "mailto:mattbianzon43@gmail.com",
        other: []
      },
      commission: {
        available: "Availability to be confirmed",
        rates: "Rate: 3,000; confirm the final rate directly with the artist",
        types: ["Sketch", "Painting", "Plates", "Graphics"],
        materials: ["Materials: To be confirmed per project; portfolio examples include pencils, ink, markers, colored pencils, acrylic paint, illustration board, and digital design tools"],
        description: "Available for sketch, painting, plate, and graphic design commissions. Share your idea and preferred style to discuss the project",
        guidelines: ["Share a clear brief and references. Confirm the scope, final rate, materials, timeline, and usage with the artist before booking"]
      }
    },
    {
      id: "artist-mlf-003",
      name: "Michael Liuenne Faustino",
      profilePicture: "images/Profile Icon/michaelicon Background Removed.png",
      coverPhoto: "images/drawings/michaelfaustinodrawing/michael cover photo.jpeg",
      description: "Michael Liuenne Faustino creates paintings and sketches featuring portraits, pets, sports, and pop culture. His portfolio brings these subjects to life through expressive compositions and a range of visual styles.",
      specialization: "Illustration, Painting, Sketching",
      socials: {
        facebook: "https://www.facebook.com/michael.faustino.77/",
        instagram: "https://www.instagram.com/mikes_mf01/",
        email: "mailto:faustinomichaelliuenne@gmail.com",
        other: []
      },
      commission: {
        available: "Availability to be confirmed",
        rates: "Rate: 5,000; confirm the final rate directly with the artist",
        types: ["Painting", "Sketch"],
        materials: ["To be confirmed per project; portfolio examples include acrylic paint, markers, colored pencils, charcoal, graphite, canvas, and mixed-media paper"],
        description: "Available for painting and sketch commissions, including portraits and character art. Discuss your subject and preferred style with the artist",
        guidelines: ["Share a clear brief and references. Confirm the scope, final rate, materials, timeline, and usage with the artist before booking"]
      }
    },
    {
      id: "artist-pdr-004",
      name: "Paule Daniel Reyes",
      profilePicture: "images/Profile Icon/pauleicon Background Removed.png",
      coverPhoto: "images/Profile Icon/pauleicon.jpeg",
      description: "Paule Daniel Reyes works across painting and sketching, creating portraits, character art, and tribute pieces. His portfolio explores familiar subjects through detailed compositions and expressive imagery.",
      specialization: "Sketching, Digital Art, Character Art",
      socials: {
        facebook: "https://www.facebook.com/share/1FrCmtbe4w/",
        instagram: "https://www.instagram.com/thisis.danyel?dlrf=NHZ5ZHg3amhzZWIw",
        email: "1029pauledanielr@gmail.com",
        other: []
      },
      commission: {
        available: "Availability to be confirmed",
        rates: "Rate: 9,000; confirm the final rate directly with the artist",
        types: ["Sketch", "Digital Art"],
        materials: ["To be confirmed per project; portfolio examples include colored pencils, markers, graphite, fine liners, watercolor, and illustration board"],
        description: "Available for sketch and digital art commissions. Contact the artist to discuss your subject, style, and project requirements",
        guidelines: ["Share a clear brief and references. Confirm the scope, final rate, materials, timeline, and usage with the artist before booking"]
      }
    },
    {
      id: "artist-mcb-005",
      name: "Maria Corinna Chena Balagtas",
      profilePicture: "",
      coverPhoto: "images/drawings/Chenabalagtasdrawing/Paintings/11ee7e61-05e3-4e85-be2e-a9344bf2630b.jpg",
      description: "Maria Corinna Chena Balagtas creates paintings and sketches, including portraits, architectural studies, and character drawings. Her work pairs careful observation with attention to detail.",
      specialization: "Painting, Sketching, Portraiture",
      socials: {
        facebook: "https://www.facebook.com/luna.chnxx",
        instagram: "https://www.instagram.com/chiilisauxe?cplk=MWY5YzB1cGF1cXpmNQ==",
        email: "chenabalagtas17@gmail.com",
        other: []
      },
      commission: {
        available: "Availability to be confirmed",
        rates: "Rate: 1,000; confirm the final rate directly with the artist",
        types: ["Painting", "Sketch"],
        materials: ["To be confirmed per project; portfolio examples include graphite and colored pencils, fine liners, sketch paper, and markers"],
        description: "Available for painting and sketch commissions, including portraits and detailed drawings. Share your concept and references to discuss the project",
        guidelines: ["Share a clear brief and references. Confirm the scope, final rate, materials, timeline, and usage with the artist before booking"]
      }
    },
    {
      id: "artist-es-006",
      name: "Eula Silvestre",
      profilePicture: "images/drawings/euladrawing/eulaprofile Background Removed.png",
      coverPhoto: "images/drawings/euladrawing/eulacoverphoto.png",
      description: "Eula Silvestre's portfolio spans drawing, painting, and architectural studies, including plans, patterns, and portraits. Her work explores structure, detail, and a variety of subjects and styles",
      specialization: "Digital Art, Drawing, Architectural Illustration",
      socials: {
        facebook: "https://www.facebook.com/share/19h38Yivi1/",
        instagram: "https://www.instagram.com/yovlaa_",
        email: "artsyeua@gmail.com",
        other: []
      },
      commission: {
        available: "Availability to be confirmed",
        rates: "Rate: 10,000; confirm the final rate directly with the artist",
        types: ["Digital Art", "Sketch"],
        materials: ["To be confirmed per project; portfolio examples include technical pens, markers, watercolor, colored pencils, ink, charcoal, graphite, and oil pastel"],
        description: "Available for digital art and sketch commissions. Contact the artist to discuss your idea, preferred style, and project details",
        guidelines: ["Share a clear brief and references. Confirm the scope, final rate, materials, timeline, and usage with the artist before booking"]
      }
    }
  ];

  // ADD NEW ARTWORK HERE. Keep IDs unique, link to an existing artist ID, and enter details per artwork.
  // Empty fields mean the artist has not provided that information yet.
  const artworkRecords = [
    
    // ARTWORKS BY MATT JULIUS BIANZON
    {
      id: "art-mjb-001",
      artistId: "artist-mjb-002",
      title: "Starry Constellation",
      category: "Painting",
      image: "images/drawings/Mattbianzondrawing/Paintings/starryconstellation.jpg",
      description: "A cosmic painting depicting a glowing white constellation against a textured purple and blue night sky.",
      story: "This piece was inspired by the quiet beauty of looking up at the night sky. The artist used layered, textured strokes to create a sense of depth in the clouds and cosmos. It represents finding direction among the stars.",
      materials: " Acrylic paint\n Canvas\n Paintbrushes\n White paint for stars",
      productInfo: " Original acrylic painting\n Cosmic/Starry theme\n Portrait orientation",
      price: 1000,
      availability: "Available"
    },
    {
      id: "art-mjb-002",
      artistId: "artist-mjb-002",
      title: "Digital Overload",
      category: "Painting",
      image: "images/drawings/Mattbianzondrawing/Paintings/digital overload.jpg",
      description: "A surreal illustration of a man surrounded by the chaotic elements of modern digital life and technology.",
      story: "The artwork explores how technology connects us while also overloading our senses. Scenes of online meetings, social media apps, and news swirl around a central figure with a geometric head. It is a colorful commentary on navigating the digital age.",
      materials: " Colored pencils\n Fine liner pens\n Illustration board\n Markers",
      productInfo: " Hand-drawn illustration\n Surrealism/Digital Age theme\n High detail",
      price: 500,
      availability: "Available"
    },
    {
      id: "art-mjb-003",
      artistId: "artist-mjb-002",
      title: "Nature's Canvas",
      category: "Mixed Media",
      image: "images/drawings/Mattbianzondrawing/Paintings/natures canvas.jpg",
      description: "A creative landscape drawing where a large green leaf serves as the ground for silhouettes of trees and a deer.",
      story: "This piece merges nature with imagination by using a real dried leaf as the foundation for a miniature world. The silhouettes of the trees and wildlife create a serene, quiet scene. It highlights the beauty of using organic materials in art.",
      materials: " Real dried leaf\n Black ink/marker\n White paper background\n Glue",
      productInfo: " Mixed-media artwork\n Nature-inspired\n Eco-friendly concept",
      price: 1500,
      availability: "Available"
    },
    {
      id: "art-mjb-004",
      artistId: "artist-mjb-002",
      title: "App Interface Concepts",
      category: "Graphics",
      image: "images/drawings/Mattbianzondrawing/Paintings/App Interface Concepts.jpg",
      description: "A series of hand-drawn UI/UX concepts for an app interface and a digital AI assistant.",
      story: "The artist visualized how users would interact with modern applications, from app locks to AI chatbots. These sketches show the thought process behind user-friendly and accessible designs. It perfectly bridges traditional drawing with digital concepts.",
      materials: " Bond paper\n Colored pencils\n Markers\n Gel pens",
      productInfo: " UI/UX conceptual sketches\n Tech-themed\n Four-page layout",
      price: 2000,
      availability: "Available"
    },
    {
      id: "art-mjb-005",
      artistId: "artist-mjb-002",
      title: "Topographic Flow",
      category: "Painting",
      image: "images/drawings/Mattbianzondrawing/Paintings/topographic flow.jpg",
      description: "An abstract acrylic painting featuring bold, wavy lines in green, blue, and yellow.",
      story: "The flowing lines are meant to evoke the calming feeling of rivers or topographic maps. The artist used smooth, continuous strokes to create a sense of movement and depth. It brings a dynamic yet peaceful energy to any space.",
      materials: " Acrylic paint\n Large canvas\n Palette\n Paintbrushes",
      productInfo: " Abstract acrylic painting\n Wave/Topographic motif\n Large format",
      price: 2300,
      availability: "Available"
    },
    {
      id: "art-mjb-006",
      artistId: "artist-mjb-002",
      title: "Physical Desktop Design",
      category: "Painting",
      image: "images/drawings/Mattbianzondrawing/Paintings/physical desktop design.jpg",
      description: "A mixed-media collage imitating a smartphone screen complete with a weather widget, search bar, and apps.",
      story: "This artwork turns a digital interface into a physical piece of art. The artist hand-painted the app icons, search bar, and weather details on a board, adding a cutout photo for the profile. It is a playful take on our reliance on mobile devices.",
      materials: " Illustration board\n Acrylic paint\n Markers\n Printed photo cutout",
      productInfo: " Mixed media collage\n Mobile interface theme\n Hand-painted details",
      price: 700,
      availability: "Available"
    },
    {
      id: "art-mjb-007",
      artistId: "artist-mjb-002",
      title: "Modern House Study",
      category: "Plates",
      image: "images/drawings/Mattbianzondrawing/Plates/arch.jpg",
      description: "An architectural perspective drawing of a modern two-story house with large glass windows.",
      story: "This plate showcases the artist's skill in rendering architectural structures with precise perspective. The use of shading and markers gives the building a realistic sense of volume. It is an excellent study of modern residential design.",
      materials: " Sketch paper\n Technical pens\n Markers\n Ruler",
      productInfo: " Architectural plate\n Modern house design\n Detailed ink and marker work",
      price: 250,
      availability: "Available"
    },
    {
      id: "art-mjb-008",
      artistId: "artist-mjb-002",
      title: "Easecore Lanyard Design",
      category: "Graphics",
      image: "images/drawings/Mattbianzondrawing/Pubmat/easecore lanyard design.jpg",
      description: "A digital mockup of a teal and orange corporate lanyard design with geometric patterns.",
      story: "Designed for corporate identity, this lanyard features bold typography and the company's signature colors. The geometric accents add a modern touch to a practical accessory. It was created to ensure brand visibility during events.",
      materials: " Digital design\n Vector graphics\n Adobe Illustrator",
      productInfo: " Digital lanyard mockup\n Corporate branding\n Customizable design",
      price: 600,
      availability: "Available"
    },
    {
      id: "art-mjb-009",
      artistId: "artist-mjb-002",
      title: "CpE Purple Lanyard",
      category: "Graphics",
      image: "images/drawings/Mattbianzondrawing/Pubmat/purple lanyard.jpg",
      description: "A digital mockup of a purple and black lanyard for a Computer Engineering organization.",
      story: "This design reflects the tech-focused nature of the organization through its sharp text and cool color palette. The geometric accents give it a futuristic feel. It serves as both an ID holder and a statement piece for the students.",
      materials: " Digital design\n Vector graphics\n Adobe Illustrator",
      productInfo: " Digital lanyard mockup\n Organizational branding\n Modern typography",
      price: 850,
      availability: "Available"
    },
    {
      id: "art-mjb-010",
      artistId: "artist-mjb-002",
      title: "Father's Day Tribute",
      category: "Graphics",
      image: "images/drawings/Mattbianzondrawing/Pubmat/father.jpg",
      description: "A digital collage poster celebrating Father's Day with a nostalgic scrapbook aesthetic.",
      story: "The poster uses a corkboard background with elements like a pocket watch, pencil, and a rose. A warm photo of a father and child is centered as the focal point. It conveys a heartfelt message about a father's enduring love.",
      materials: " Digital design\n Photo manipulation\n Adobe Photoshop",
      productInfo: " Digital poster design\n Father's Day theme\n Scrapbook style",
      price: 630,
      availability: "Available"
    },
    {
      id: "art-mjb-011",
      artistId: "artist-mjb-002",
      title: "Code & Execute Lanyard",
      category: "Graphics",
      image: "images/drawings/Mattbianzondrawing/Pubmat/red lanyard.jpg",
      description: "A digital mockup of a red and grey lanyard featuring the text 'Code. Program. Execute.'",
      story: "Designed for a programming or engineering group, this lanyard uses strong red and grey tones. The dynamic text layout emphasizes the group's core activities. It's a sleek and professional accessory for tech events.",
      materials: " Digital design\n Vector graphics\n Adobe Illustrator",
      productInfo: " Digital lanyard mockup\n Tech organization branding\n Minimalist design",
      price: 1300,
      availability: "Available"
    },
    {
      id: "art-mjb-012",
      artistId: "artist-mjb-002",
      title: "Men's Mental Health Awareness",
      category: "Graphics",
      image: "images/drawings/Mattbianzondrawing/Pubmat/men.jpg",
      description: "An awareness poster for Men's Mental Health Month using a retro, textured aesthetic.",
      story: "The poster features two men in a supportive conversation, breaking the stigma around men's mental health. It includes powerful statistics and the message 'Men Cry. Men Break Down.' It is a poignant piece designed to encourage speaking up.",
      materials: " Digital design\n Halftone image effects\n Adobe Photoshop",
      productInfo: " Awareness poster design\n Men's Mental Health theme\n Retro aesthetic",
      price: 1400,
      availability: "Available"
    },
    {
      id: "art-mjb-013",
      artistId: "artist-mjb-002",
      title: "Volleyball Spike",
      category: "Sketch",
      image: "images/drawings/Mattbianzondrawing/sketch/volleyballspike.jpg",
      description: "A dynamic pencil sketch of volleyball players in the middle of a spike and a block.",
      story: "The drawing captures the high energy and tension of a volleyball match. The artist used perspective to put the viewer right in the middle of the action. It highlights the athleticism and focus required in the sport.",
      materials: " Pencil\n Sketch paper\n Eraser",
      productInfo: " Pencil sketch\n Sports theme\n Dynamic composition",
      price: 690,
      availability: "Available"
    },
    {
      id: "art-mjb-014",
      artistId: "artist-mjb-002",
      title: "Roman Colosseum",
      category: "Sketch",
      image: "images/drawings/Mattbianzondrawing/sketch/col.jpg",
      description: "A detailed stippling ink drawing of the Roman Colosseum.",
      story: "Created using thousands of tiny dots, this artwork captures the historical grandeur of the Colosseum. The stippling technique adds texture and depth to the ancient ruins. It is a testament to the artist's patience and precision.",
      materials: " Fine liner pen\n Ink\n Vellum/Paper",
      productInfo: " Stippling ink drawing\n Historical architecture\n High detail",
      price: 300,
      availability: "Available"
    },
    {
      id: "art-mjb-015",
      artistId: "artist-mjb-002",
      title: "Pisa Cathedral Study",
      category: "Sketch",
      image: "images/drawings/Mattbianzondrawing/sketch/pisa.jpg",
      description: "A stippling ink artwork featuring the Pisa Cathedral, the Leaning Tower, and a giant moon.",
      story: "This piece reimagines the iconic Pisa Cathedral complex with a surreal, oversized moon in the background. The meticulous dot work brings out the architectural details of the buildings. It merges historical landmarks with a dreamlike atmosphere.",
      materials: " Fine liner pen\n Ink\n Paper",
      productInfo: " Stippling ink drawing\n Landmark architecture\n Surreal composition",
      price: 950,
      availability: "Available"
    },
        {
      id: "art-mjb-016",
      artistId: "artist-mjb-002",
      title: "Faculty Excellence Award",
      category: "Graphics",
      image: "images/drawings/Mattbianzondrawing/Pubmat/ryan1.png", // I-update ang image path
      description: "A digital congratulatory poster for Engr. Ryan Nolasco for achieving a 97.25% faculty evaluation rating.",
      story: "Highlights the outstanding performance and dedication of the Computer Engineering faculty member for the academic year 2025-2026. Uses warm orange tones to convey excellence and achievement.",
      materials: "• Adobe Photoshop\n• Vector Graphics\n• Typography",
      productInfo: "• Digital poster\n• Academic achievement theme\n• Modern layout",
      price: null,
      availability: "Available"
    },
    {
      id: "art-mjb-017",
      artistId: "artist-mjb-002",
      title: "Outstanding Professor Tribute",
      category: "Graphics",
      image: "images/drawings/Mattbianzondrawing/Pubmat/ryan2.png", // I-update ang image path
      description: "A sleek, blue-themed digital poster honoring Engr. Ryan C. Nolasco as an outstanding professor with a 95.51% rating.",
      story: "Designed to recognize the exceptional teaching performance of the faculty member, featuring a professional portrait and modern tech-inspired elements.",
      materials: "• Adobe Photoshop\n• Photo Manipulation\n• Digital Typography",
      productInfo: "• Digital tribute poster\n• Faculty recognition\n• Corporate aesthetic",
      price: null,
      availability: "Available"
    },
    {
      id: "art-mjb-018",
      artistId: "artist-mjb-002",
      title: "Top Performer Congratulatory Poster",
      category: "Graphics",
      image: "images/drawings/Mattbianzondrawing/Pubmat/ryan3.png", // I-update ang image path
      description: "A celebratory graphic announcing Engr. Ryan Nolasco as a top-performing faculty member with a 97.25% rating.",
      story: "Utilizes dynamic light beams and a festive layout to celebrate academic excellence and hard work in the field of Computer Engineering.",
      materials: "• Adobe Photoshop\n• Light Effects\n• Digital Layout",
      productInfo: "• Celebration poster\n• Academic milestone\n• High-impact design",
      price: null,
      availability: "Available"
    },
    {
      id: "art-mjb-019",
      artistId: "artist-mjb-002",
      title: "Chess Champion Tribute",
      category: "Graphics",
      image: "images/drawings/Mattbianzondrawing/Pubmat/ANGARA ATHLETES (5).png", // I-update ang image path
      description: "A dynamic poster congratulating Engr. Christopher F. Cunanan for winning the Angara Cup Chess Tournament.",
      story: "Captures the intellectual intensity of chess with a dramatic layout. Features the champion holding his cash prize, emphasizing strategy and victory.",
      materials: "• Adobe Photoshop\n• Photo Collage\n• Typography",
      productInfo: "• Sports/Academic achievement poster\n• Dynamic composition\n• Bold typography",
      price: null,
      availability: "Available"
    },
    {
      id: "art-mjb-020",
      artistId: "artist-mjb-002",
      title: "Mental Health Coalition Logo",
      category: "Graphics",
      image: "images/drawings/Mattbianzondrawing/Pubmat/mhc logo.png", // I-update ang image path
      description: "A circular, green-and-gold digital emblem designed for the Bulsu Bustos Mental Health Coalition.",
      story: "Symbolizes mental wellness through a silhouette of a head, incorporating elements like a brain, hands, and a puzzle piece. The green ribbon represents mental health awareness.",
      materials: "• Adobe Illustrator\n• Vector Graphics\n• 3D Rendering effects",
      productInfo: "• Organizational logo\n• Branding design\n• High-resolution digital asset",
      price: null,
      availability: "Available"
    },
    {
      id: "art-mjb-021",
      artistId: "artist-mjb-002",
      title: "Chihuahua ",
      category: "Sketch",
      image: "images/drawings/Mattbianzondrawing/sketch/PUP.png", // I-update ang image path
      description: "A delicate graphite pencil sketch of a small dog, likely a Chihuahua, focusing on its large eyes and ears.",
      story: "The artist captures the alert and endearing expression of the pet. Light feathering strokes are used to depict the soft texture of the dog's fur.",
      materials: "• Graphite pencil\n• Sketch paper",
      productInfo: "• Traditional pencil sketch\n• Animal portrait\n• Realistic shading",
      price: null,
      availability: "Available"
    },
    {
      id: "art-mjb-022",
      artistId: "artist-mjb-002",
      title: "All Saints' Day Graphic",
      category: "Graphics",
      image: "images/drawings/Mattbianzondrawing/Pubmat/allsaintsday.png", // I-update ang image path
      description: "A solemn but elegant digital poster for All Saints' Day, featuring classical religious art and a bible verse.",
      story: "Commemorates the religious holiday with a blend of classical imagery and modern typography. The golden text 'All Saints Day' stands out against the ethereal background.",
      materials: "• Adobe Photoshop\n• Photo Manipulation\n• Digital Typography",
      productInfo: "• Religious event poster\n• Elegant design\n• Classic aesthetics",
      price: null,
      availability: "Available"
    },
    {
      id: "art-mjb-023",
      artistId: "artist-mjb-002",
      title: "Playful Chihuahua Doodle",
      category: "Sketch",
      image: "images/drawings/Mattbianzondrawing/sketch/DOG.png", // I-update ang image path
      description: "A casual ink and pencil sketch of a Chihuahua baring its teeth playfully, drawn on standard lined paper next to a green pencil.",
      story: "This impromptu sketch captures a humorous and expressive moment of a dog's personality. The raw, unpolished style adds charm and authenticity.",
      materials: "• Mechanical pencil\n• Lined paper",
      productInfo: "• Casual sketch\n• Animal drawing\n• Expressive linework",
      price: null,
      availability: "Available"
    },
    {
      id: "art-mjb-024",
      artistId: "artist-mjb-002",
      title: "Chess Team Send-off Poster",
      category: "Graphics",
      image: "images/drawings/Mattbianzondrawing/Pubmat/athletes (3).png", // I-update ang image path
      description: "A motivational poster wishing Joseph Saguillo the best of luck for the upcoming Angara Cup Chess Team Tournament.",
      story: "Features a dynamic portrait of the player in action with a torn-paper aesthetic. It serves as a visual support for the university's representative.",
      materials: "• Adobe Photoshop\n• Photo Manipulation\n• Digital Effects",
      productInfo: "• Sports support poster\n• Motivational theme\n• Modern layout",
      price: null,
      availability: "Available"
    },

    // ARTWORKS BY MICHAEL LIUENNE FAUSTINO
    {
      id: "art-mlf-001",
      artistId: "artist-mlf-003",
      title: "Silent Hill",
      category: "Painting",
      image: "images/drawings/michaelfaustinodrawing/Paintings/silent.jpg",
      description: "A vibrant anime-style painting featuring a dark-haired boy and a red-haired girl against a glowing pink background.",
      story: "This piece captures a tender moment between two anime characters, emphasizing their emotional connection through soft colors and expressive eyes. The bright pinks and reds create a warm, romantic atmosphere. It is a beautiful homage to classic romance anime.",
      materials: " Acrylic paint\n Mixed media paper\n Colored pencils\n Fine liners",
      productInfo: " Anime fan art\n Romantic theme\n Vibrant colors",
      price: 1500,
      availability: "Available"
    },
    {
      id: "art-mlf-002",
      artistId: "artist-mlf-003",
      title: "Loyal Companion",
      category: "Painting",
      image: "images/drawings/michaelfaustinodrawing/Paintings/dog.jpg",
      description: "A detailed acrylic portrait of a small brown and white Shih Tzu dog name 'Mawie' wearing a black shirt.",
      story: "The artist captured the adorable and alert expression of this beloved pet against a soothing blue background. The textured brushstrokes bring out the softness of the dog's fur and the depth of its eyes. It is a heartwarming tribute to a loyal furry friend.",
      materials: " Acrylic paint\n Canvas\n Paintbrushes",
      productInfo: " Pet portrait\n Realistic style\n Original painting",
      price: 990,
      availability: "Available"
    },
    {
      id: "art-mlf-003",
      artistId: "artist-mlf-003",
      title: "Legendary Super Saiyan",
      category: "Painting",
      image: "images/drawings/michaelfaustinodrawing/Paintings/broly.jpg",
      description: "A dynamic painting of Broly from Dragon Ball, featuring his massive muscular form and glowing green hair.",
      story: "This artwork channels the immense, raw energy of the Legendary Super Saiyan. The cosmic background and intense shading highlight the character's power and ferocity. It is a standout piece for any hardcore anime fan.",
      materials: " Markers\n Colored pencils\n Gel pens\n Illustration board",
      productInfo: " Anime fan art\n Dragon Ball theme\n High contrast",
      price: 810,
      availability: "Available"
    },
    {
      id: "art-mlf-004",
      artistId: "artist-mlf-003",
      title: "Legacy of the Mamba",
      category: "Painting",
      image: "images/drawings/michaelfaustinodrawing/Paintings/kobe.jpg",
      description: "A striking mixed-media piece featuring Kobe Bryant in his Lakers jersey alongside a monochromatic portrait of a young woman.",
      story: "The artwork juxtaposes the vibrant energy of basketball legend Kobe Bryant with a deeply realistic, grayscale portrait. The split background of blue and red adds a dramatic contrast, symbolizing different facets of inspiration and legacy.",
      materials: " Acrylic paint\n Charcoal\n Canvas\n Mixed media",
      productInfo: " Sports/Tribute art\n Mixed-media portrait\n Bold composition",
      price: 3500,
      availability: "Available"
    },
    {
      id: "art-mlf-005",
      artistId: "artist-mlf-003",
      title: "Ice Queen",
      category: "Painting",
      image: "images/drawings/michaelfaustinodrawing/Paintings/elsa.jpg",
      description: "A colorful portrait of Elsa from Disney's Frozen, set against a magical, icy blue background.",
      story: "The artist focused on capturing Elsa's delicate features and iconic braided hair. The use of soft blues and whites creates a frosty, enchanting atmosphere that brings the beloved character to life.",
      materials: " Acrylic paint\n Canvas\n Fine brushes",
      productInfo: " Disney fan art\n Portrait\n Cool color palette",
      price: 5000,
      availability: "Available"
    },
    {
      id: "art-mlf-006",
      artistId: "artist-mlf-003",
      title: "Monochrome Muse",
      category: "Sketch",
      image: "images/drawings/michaelfaustinodrawing/Sketch/lisa.jpg",
      description: "A highly detailed, realistic charcoal drawing of a woman with dark hair and a lip piercing.",
      story: "This sketch showcases the artist's mastery of shading and contrast. The intense gaze and gothic aesthetic give the portrait a mysterious and edgy vibe. The meticulous attention to the hair and facial features draws the viewer in.",
      materials: " Charcoal\n Graphite pencil\n Sketch paper",
      productInfo: " Realistic sketch\n Monochrome\n Edgy aesthetic",
      price: 2500,
      availability: "Available"
    },
    {
      id: "art-mlf-007",
      artistId: "artist-mlf-003",
      title: "Shonen Legends",
      category: "Painting",
      image: "images/drawings/michaelfaustinodrawing/Paintings/big 4.jpg",
      description: "A vibrant collage featuring iconic shonen anime protagonists: Luffy, Ichigo, Naruto, and Goku.",
      story: "This piece is a tribute to the legends of anime, bringing together four of the most influential characters in one dynamic composition. The contrasting colors and glowing auras emphasize their unique powers and personalities.",
      materials: " Markers\n Colored pencils\n Illustration board\n Gel pens",
      productInfo: " Anime fan art\n Collage\n Shonen tribute",
      price: 3200,
      availability: "Available"
    },
        {
      id: "art-mlf-008",
      artistId: "artist-mlf-003",
      title: "Silent Reflection",
      category: "Sketch",
      image: "images/drawings/michaelfaustinodrawing/Sketch/michaelart1.jpg", // I-update ang image path
      description: "A realistic charcoal portrait of a woman with her eyes closed, resting her head gently on her shoulder.",
      story: "This piece captures a moment of quiet introspection and vulnerability. The soft shading and high contrast highlight the subject's delicate features and the gentle curve of her posture.",
      materials: " Charcoal\n Graphite pencil\n Sketch paper",
      productInfo: " Realistic portrait\n Monochrome sketch\n High detail",
      price: 2000,
      availability: "Available"
    },
    {
      id: "art-mlf-009",
      artistId: "artist-mlf-003",
      title: "Unleashed Power",
      category: "Sketch",
      image: "images/drawings/michaelfaustinodrawing/Sketch/michaelart2.jpg", // I-update ang image path
      description: "A high-contrast ink and charcoal drawing of a heavily muscled character with wild hair and a menacing grin.",
      story: "Inspired by intense martial arts manga, this piece emphasizes raw power and intimidation. The dramatic lighting and intricate line work bring out the extreme musculature of the figure.",
      materials: " Fine liner pen\n Charcoal\n Illustration board",
      productInfo: " Anime/Manga fan art\n Monochrome\n Dynamic shading",
      price: 3000,
      availability: "Available"
    },
    {
      id: "art-mlf-010",
      artistId: "artist-mlf-003",
      title: "Super Saiyan Meme",
      category: "Painting",
      image: "images/drawings/michaelfaustinodrawing/Paintings/michaelart3.jpg", // I-update ang image path
      description: "A humorous colored pencil drawing of Goku in his Super Saiyan form, making a strained, comedic expression.",
      story: "A playful take on the classic Super Saiyan transformation, giving the legendary hero an exaggerated face. The bright yellow aura and red skin tones add to the lively energy of the piece.",
      materials: " Colored pencils\n Markers\n Drawing paper",
      productInfo: " Anime fan art\n Comedic theme\n Vibrant colors",
      price: 5200,
      availability: "Available"
    },
    {
      id: "art-mlf-011",
      artistId: "artist-mlf-003",
      title: "Warm Embrace",
      category: "Painting",
      image: "images/drawings/michaelfaustinodrawing/Paintings/michaelart5.jpg", // I-update ang image path
      description: "A colorful anime-style illustration of a man in a suit being hugged from behind by a blonde woman against a split blue and warm background.",
      story: "This piece captures a poignant moment of comfort and connection between two characters. The contrasting backgrounds symbolize their different emotional states and the warmth of their bond.",
      materials: " Colored pencils\n Watercolor\n Fine liners",
      productInfo: " Anime illustration\n Emotional scene\n Vibrant palette",
      price: null,
      availability: "Available"
    },
    {
      id: "art-mlf-012",
      artistId: "artist-mlf-003",
      title: "Ultra Instinct",
      category: "Painting",
      image: "images/drawings/michaelfaustinodrawing/Paintings/michaelart6.jpg", // I-update ang image path
      description: "A dynamic marker and colored pencil artwork of Goku in his Ultra Instinct form, surrounded by crackling blue energy.",
      story: "The artist focuses on the serene yet overwhelming power of Goku's Ultra Instinct state. The intense blue aura and highly detailed musculature capture the character's god-like strength and focus.",
      materials: " Markers\n Colored pencils\n Gel pens\n Illustration board",
      productInfo: " Anime fan art\n Dragon Ball theme\n Dynamic action pose",
      price: 1900,
      availability: "Available"
    },
    
    // ARTWORKS BY PAULE DANIEL REYES
    {
      id: "art-prd-001",
      artistId: "artist-pdr-004",
      title: "Frontline Heroes",
      category: "Painting",
      image: "images/drawings/michaelfaustinodrawing/Paintings/covid.jpg",
      description: "A powerful tribute to medical frontliners surrounded by iconic superheroes and saluting citizens.",
      story: "This artwork honors the real-life heroes of the pandemic by placing them alongside fictional superheroes. It symbolizes the collective gratitude of the world for the sacrifices of medical workers. The vibrant colors highlight the hope and resilience they brought during dark times.",
      materials: " Colored pencils\n Markers\n Illustration board\n Gel pens",
      productInfo: " Tribute artwork\n Mixed media\n High detail",
      price: 4500,
      availability: "Available"
    },
    {
      id: "art-prd-002",
      artistId: "artist-pdr-004",
      title: "Excelsior: A Tribute to Stan Lee",
      category: "Painting",
      image: "images/drawings/michaelfaustinodrawing/Paintings/stan lee 1.jpg",
      description: "A colorful portrait of Stan Lee flanked by the Hulk and Captain America.",
      story: "Created to celebrate the legendary creator of Marvel Comics, this piece captures Stan Lee's iconic smile. The inclusion of Hulk and Captain America pays homage to the universe he built. It is a must-have for any true Marvel fan.",
      materials: " Colored pencils\n Markers\n Graphite\n Illustration board",
      productInfo: " Marvel fan art\n Portrait\n Vibrant colors",
      price: 6000,
      availability: "Available"
    },
    {
      id: "art-prd-003",
      artistId: "artist-pdr-004",
      title: "Slam Dunk Classic",
      category: "Painting",
      image: "images/drawings/michaelfaustinodrawing/Paintings/slam dunk.jpg",
      description: "An anime-style illustration of Hanamichi Sakuragi and Haruko Akagi from the classic series Slam Dunk.",
      story: "This piece captures the nostalgic charm of 90s anime, focusing on the beloved characters from the basketball manga. The bright yellow background contrasts perfectly with their dark uniforms. It is a nostalgic tribute to a sports anime classic.",
      materials: " Markers\n Colored pencils\n Fine liners\n Illustration board",
      productInfo: " Anime fan art\n Slam Dunk theme\n Retro style",
      price: 2500,
      availability: "Available"
    },
    {
      id: "art-prd-004",
      artistId: "artist-pdr-004",
      title: "Fanny's Mallet",
      category: "Painting",
      image: "images/drawings/michaelfaustinodrawing/Paintings/fanny.jpg",
      description: "A dynamic illustration of Fanny from Mobile Legends holding her signature mallet, styled with vibrant pinks and blues.",
      story: "The artist captured Fanny's chaotic and playful energy through her expressive pose and iconic outfit. The pink and blue shading emphasizes her vibrant personality. It is a striking piece for fans of DC Comics.",
      materials: " Colored pencils\n Markers\n Gel pens",
      productInfo: " DC fan art\n Character portrait\n Vibrant aesthetic",
      price: 2300,
      availability: "Available"
    },
    {
      id: "art-prd-005",
      artistId: "artist-pdr-004",
      title: "Super Saiyan Power",
      category: "Painting",
      image: "images/drawings/michaelfaustinodrawing/Paintings/gohan.jpg",
      description: "An intense drawing of Gohan in his Super Saiyan form, surrounded by a golden aura and Dragon Balls.",
      story: "This artwork showcases the raw power and determination of Gohan as he charges up his energy. The glowing golden aura and scattered Dragon Balls add a dynamic element to the composition. It is a vibrant tribute to the Dragon Ball franchise.",
      materials: " Colored pencils\n Markers\n Ink\n Sketch paper",
      productInfo: " Anime fan art\n Dragon Ball theme\n Dynamic action pose",
      price: 4200,
      availability: "Available"
    },
    {
      id: "art-prd-006",
      artistId: "artist-pdr-004",
      title: "Youthful Connection",
      category: "Painting",
      image: "images/drawings/michaelfaustinodrawing/Paintings/kimi no.jpg",
      description: "A detailed anime-style drawing of two teenagers looking off in different directions, evoking a sense of wonder.",
      story: "Inspired by the romantic and dramatic aesthetics of modern anime, this piece focuses on the unspoken connection between the two characters. The detailed shading on their uniforms and hair brings them to life. It captures a fleeting moment of youth and curiosity.",
      materials: " Markers\n Colored pencils\n Fine liner pens",
      productInfo: " Anime illustration\n Romantic theme\n Detailed shading",
      price: 1600,
      availability: "Available"
    },
    {
      id: "art-prd-007",
      artistId: "artist-pdr-004",
      title: "Watercolor Idol",
      category: "Painting",
      image: "images/drawings/michaelfaustinodrawing/Paintings/paint.jpg",
      description: "A soft watercolor portrait of a young man, featuring warm tones and expressive eyes.",
      story: "This portrait uses watercolor techniques to create a gentle and lifelike representation of a male figure. The warm, earthy tones give the piece a calming and approachable feel. It highlights the artist's versatility in traditional mediums.",
      materials: " Watercolor\n Watercolor paper\n Fine brushes",
      productInfo: " Watercolor portrait\n Realistic style\n Warm tones",
      price: 5200,
      availability: "Available"
    },
    {
      id: "art-prd-008",
      artistId: "artist-pdr-004",
      title: "The Black Swordsman",
      category: "Painting",
      image: "images/drawings/michaelfaustinodrawing/Paintings/sword art.jpg",
      description: "A side-profile illustration of Kirito from Sword Art Online, featuring his signature black coat.",
      story: "The artwork focuses on the stoic and determined expression of Kirito, the protagonist of Sword Art Online. The cool blue background contrasts with his dark attire, drawing attention to his sharp features. It captures the essence of the virtual reality hero.",
      materials: " Markers\n Colored pencils\n Fine liner",
      productInfo: " Anime fan art\n Sword Art Online theme\n Profile portrait",
      price: 2300,
      availability: "Available"
    },
    {
      id: "art-prd-009",
      artistId: "artist-pdr-004",
      title: "The Dancing Clown",
      category: "Painting",
      image: "images/drawings/michaelfaustinodrawing/Paintings/pennywise.jpg",
      description: "A chillingly realistic portrait of Pennywise the Clown, holding a red balloon.",
      story: "This artwork brings the terrifying essence of Stephen King's 'IT' to life through meticulous shading and eerie details. The contrast of the bright red balloon against the dark, textured clown makeup creates a haunting image. It is perfect for fans of horror.",
      materials: " Colored pencils\n Charcoal\n Black paper",
      productInfo: " Horror art\n Stephen King theme\n Realistic shading",
      price: 1200,
      availability: "Available"
    },
    {
      id: "art-prd-010",
      artistId: "artist-pdr-004",
      title: "Six Paths Sage Mode",
      category: "Painting",
      image: "images/drawings/michaelfaustinodrawing/Paintings/naruto.jpg",
      description: "A powerful depiction of Naruto Uzumaki in his Six Paths Sage Mode with a staff and glowing aura.",
      story: "The artist captured Naruto's ultimate form with intense colors and dynamic action. The glowing aura and his determined expression convey the immense power he wields. It is a striking piece for Naruto enthusiasts.",
      materials: " Colored pencils\n Markers\n Gel pens\n Sketch paper",
      productInfo: " Anime fan art\n Naruto theme\n Action pose",
      price: 3200,
      availability: "Available"
    },

    // ARTWORKS BY MARIA CORINNA CHENA BALAGTAS
    {
      id: "art-mcb-001",
      artistId: "artist-mcb-005",
      title: "Iglesia Ni Cristo Church Study",
      category: "Painting",
      image: "images/drawings/Chenabalagtasdrawing/Paintings/11ee7e61-05e3-4e85-be2e-a9344bf2630b.jpg",
      description: "A detailed architectural illustration of the Iglesia Ni Cristo chapel using earthy brown and white tones.",
      story: "The artist focused on the geometric lines and symmetry of the church's facade. Using markers and fine liners, the piece captures the solemn and majestic presence of the structure.",
      materials: " Marker\n Fine liner\n Sketch paper",
      productInfo: " Architectural illustration\n Earth tone palette\n Detailed linework",
      price: 4500,
      availability: "Available"
    },
    {
      id: "art-mcb-002",
      artistId: "artist-mcb-005",
      title: "Portrait of a Youth",
      category: "Sketch",
      image: "images/drawings/Chenabalagtasdrawing/Sketch/boy1.jpg",
      description: "A detailed graphite pencil portrait of a young man with styled hair and expressive eyes.",
      story: "This sketch focuses on capturing the soft features and intense gaze of the subject. The artist used delicate shading techniques to bring out the texture of the hair and the smoothness of the skin.",
      materials: " Graphite pencil\n Sketch paper\n Eraser",
      productInfo: " Realistic portrait\n Graphite sketch\n High detail",
      price: 3200,
      availability: "Available"
    },
    {
      id: "art-mcb-003",
      artistId: "artist-mcb-005",
      title: "Frontline Embrace",
      category: "Sketch",
      image: "images/drawings/Chenabalagtasdrawing/Sketch/med worker.jpg",
      description: "A poignant pencil sketch of three medical workers in full PPE gently holding a central figure.",
      story: "The artwork serves as a tribute to the tireless efforts and compassion of medical frontliners. The use of soft shading conveys a sense of care and sorrow amidst the pandemic. It highlights the human connection behind the protective gear.",
      materials: " Graphite pencil\n Sketch paper\n Blending stump",
      productInfo: " Pencil sketch\n Tribute artwork\n Emotional composition",
      price: 1600,
      availability: "Available"
    },
    {
      id: "art-mcb-004",
      artistId: "artist-mcb-005",
      title: "The Photographer",
      category: "Sketch",
      image: "images/drawings/Chenabalagtasdrawing/Sketch/black mask.jpg",
      description: "A partially colored sketch of a photographer wearing a cap, black mask, and a camera strap.",
      story: "This piece captures the essence of an observer capturing the world. The contrast between the grayscale figure and the vibrant red and yellow background adds a dynamic element. It reflects the passion for visual storytelling.",
      materials: " Graphite pencil\n Colored pencils\n Fine liner",
      productInfo: " Mixed media sketch\n Modern aesthetic\n Color contrast",
      price: null,
      availability: "Available"
    },
    {
      id: "art-mcb-005",
      artistId: "artist-mcb-005",
      title: "Floral Muse",
      category: "Sketch",
      image: "images/drawings/Chenabalagtasdrawing/Sketch/women.jpg",
      description: "A delicate and ethereal pencil sketch of a woman's face surrounded by intricate floral designs.",
      story: "The artist created a surreal and dreamlike portrait by incorporating floral elements seamlessly into the subject's features. The light pencil strokes give the artwork a soft and gentle aura. It celebrates the harmony between human beauty and nature.",
      materials: " Graphite pencil\n Fine liner (for outlines)\n Sketch paper",
      productInfo: " Ethereal sketch\n Floral motif\n Surreal portrait",
      price: 1050,
      availability: "Available"
    },
    {
      id: "art-mcb-006",
      artistId: "artist-mcb-005",
      title: "Minimalist Gaze",
      category: "Sketch",
      image: "images/drawings/Chenabalagtasdrawing/Sketch/eyes.jpg",
      description: "A minimalist pencil sketch focusing on the eyes, nose, and lips of an anime character.",
      story: "This drawing strips away complex details to focus purely on the expressiveness of the eyes and facial features. The clean lines and subtle shading reflect a simplified approach to character design. It is a study of emotion through minimal art.",
      materials: " Pencil\n Sketch paper",
      productInfo: " Minimalist sketch\n Anime style\n Facial study",
      price: 2300,
      availability: "Available"
    },
    {
      id: "art-mcb-007",
      artistId: "artist-mcb-005",
      title: "Wistful Anime Girl",
      category: "Sketch",
      image: "images/drawings/Chenabalagtasdrawing/Sketch/anime girl.jpg",
      description: "A pencil sketch of an anime girl with long wavy hair and large, expressive eyes.",
      story: "The artwork captures a quiet, pensive moment, highlighting the character's delicate features and voluminous hair. The subtle shading gives depth to the drawing, making the character feel alive. It is a beautiful example of classic anime portraiture.",
      materials: " Graphite pencil\n Fine liner\n Sketch paper",
      productInfo: " Anime sketch\n Expressive character\n Detailed hair",
      price: 1860,
      availability: "Available"
    },
    {
      id: "art-mcb-008",
      artistId: "artist-mcb-005",
      title: "The Smiling Statesman",
      category: "Sketch",
      image: "images/drawings/Chenabalagtasdrawing/Sketch/smiling man.jpg",
      description: "A detailed graphite portrait of a smiling man wearing a suit and tie.",
      story: "This sketch focuses on capturing the cheerful demeanor and realistic facial structure of the subject. The artist paid close attention to the details of the hair and the texture of the suit. It demonstrates a strong grasp of traditional portraiture.",
      materials: " Graphite pencil\n Sketch paper\n Blending tools",
      productInfo: " Realistic portrait\n Graphite drawing\n Expressive smile",
      price: 2300,
      availability: "Available"
    },
    {
      id: "art-mcb-009",
      artistId: "artist-mcb-005",
      title: "Heart of a Fan",
      category: "Sketch",
      image: "images/drawings/Chenabalagtasdrawing/Sketch/maskboy.jpg",
      description: "A pencil sketch of a person in a face mask making a handsome gesture and wearing a watch.",
      story: "The drawing captures the excitement and devotion of a fan or photographer. The use of masks reflects the current era, adding a relatable touch to the artwork. It is a sweet and modern character study.",
      materials: " Graphite pencil\n Sketch paper\n Eraser",
      productInfo: " Character sketch\n Modern theme\n Detailed shading",
      price: 2600,
      availability: "Available"
    },
    {
      id: "art-mcb-010",
      artistId: "artist-mcb-005",
      title: "Window Gaze",
      category: "Sketch",
      image: "images/drawings/Chenabalagtasdrawing/Sketch/window gaze.jpg",
      description: "A side-profile sketch of an anime boy looking out a window with bamboo blinds.",
      story: "The composition uses the window frame to draw the viewer's eye to the character's pensive expression. The vertical lines of the blinds contrast with the soft curves of the boy's hair. It evokes a sense of longing and quiet observation.",
      materials: " Graphite pencil\n Fine liner\n Sketch paper",
      productInfo: " Anime sketch\n Profile view\n Atmospheric composition",
      price: 2100,
      availability: "Available"
    },

    // ARTWORKS BY EULA SILVESTRE
    {
      id: "art-es-001",
      artistId: "artist-es-006",
      title: "Barangay Hall Plan",
      category: "Plates",
      image: "images/drawings/euladrawing/Barangayhall.jpeg",
      description: "A detailed architectural floor plan of a two-story Barangay Hall.",
      story: "This academic plate showcases functional space planning, detailing specific rooms like the detention cell, captain's office, and conference room. The artist utilized precise line work and shading to indicate dimensions and structural layouts.",
      materials: " Technical pens\n Markers\n Watercolor\n Vellum paper",
      productInfo: " Academic plate\n Architectural layout\n Ground and Second floor plan",
      price: 3200,
      availability: "Available"
    },
    {
      id: "art-es-002",
      artistId: "artist-es-006",
      title: "Subdivision Plan",
      category: "Plates",
      image: "images/drawings/euladrawing/Subdivision.jpeg",
      description: "A colorful site development plan layout for a residential subdivision.",
      story: "The artwork highlights zoning strategies, plotting residential blocks, commercial areas, and recreational spaces like a basketball court. The use of vibrant colors makes the complex map easy to read and visually appealing.",
      materials: " Markers\n Technical pens\n Colored pencils\n Tracing paper",
      productInfo: " Site planning plate\n Zoning layout\n Color-coded map",
      price: 550,
      availability: "Available"
    },
    {
      id: "art-es-003",
      artistId: "artist-es-006",
      title: "Color Wheel and Harmonies",
      category: "Drawing",
      image: "images/drawings/euladrawing/Colorwheel.jpeg",
      description: "A hand-drawn color wheel demonstrating various color theories.",
      story: "This academic exercise beautifully illustrates color relationships, including monochromatic, analogous, and complementary palettes. The central spiral gradient demonstrates a flawless transition of hues.",
      materials: " Colored pencils\n Markers\n Technical pens\n Drawing paper",
      productInfo: " Color theory plate\n Educational artwork\n Geometric design",
      price: 1600,
      availability: "Available"
    },
    {
      id: "art-es-004",
      artistId: "artist-es-006",
      title: "Cross Hatching ",
      category: "Sketch",
      image: "images/drawings/euladrawing/crosshatching.jpeg",
      description: "A still-life sketch utilizing precise cross-hatching techniques.",
      story: "A classical drawing exercise focusing on light, shadow, and texture using intersecting line work. The artist successfully rendered the volume of a bottle, a round object, and a wooden block.",
      materials: " Graphite pencil\n Sketch paper",
      productInfo: " Academic sketch\n Still life\n Cross-hatching technique",
      price: 2530,
      availability: "Available"
    },
    {
      id: "art-es-005",
      artistId: "artist-es-006",
      title: "Front and Rear Elevations",
      category: "Plates",
      image: "images/drawings/euladrawing/architectural plate.jpeg",
      description: "Detailed architectural elevations of a modern two-story house.",
      story: "This plate visualizes the exterior design, materials, and structural heights of a residential building. It features precise annotations and a clean, technical aesthetic.",
      materials: " Watercolor\n Markers\n Technical pens",
      productInfo: " Architectural plate\n Elevation drawing\n Exterior design",
      price: 2300,
      availability: "Available"
    },
    {
      id: "art-es-006",
      artistId: "artist-es-006",
      title: "Seascape",
      category: "Painting",
      image: "images/drawings/euladrawing/sunset.jpeg",
      description: "A serene watercolor painting of an ocean at sunset.",
      story: "The artist captures the calming gradient of the sky, transitioning from soft yellows to deep blues. The gentle ripples of the sea are highlighted with white strokes, creating a peaceful atmosphere.",
      materials: " Watercolor\n Watercolor paper\n Fine brushes",
      productInfo: " Watercolor painting\n Landscape\n Sunset theme",
      price: 2360,
      availability: "Available"
    },
    {
      id: "art-es-007",
      artistId: "artist-es-006",
      title: "Linear Flow Patterns",
      category: "Drawing",
      image: "images/drawings/euladrawing/Linear Flow.jpeg",
      description: "A collection of intricate, hand-drawn geometric and linear patterns.",
      story: "This plate explores the meditative nature of continuous line work and spatial arrangement. Six distinct square patterns demonstrate various hypnotic effects achieved through simple lines.",
      materials: " Fine liner pen\n Ink\n Sketch paper",
      productInfo: " Abstract line art\n Pattern study\n Optical illusion",
      price: 2400,
      availability: "Available"
    },
    {
      id: "art-es-008",
      artistId: "artist-es-006",
      title: "Michael John  Clay Figure",
      category: "3D Art",
      image: "images/drawings/euladrawing/Maykeljan.jpeg",
      description: "A handcrafted 3D figure of Michael John Santos made by his beloved baby",
      story: "A fan-made clay sculpture capturing the character's distinct features, accompanied by custom art cards. It showcases the artist's skill in translating 2D anime designs into tangible 3D forms.",
      materials: " Polymer clay\n Acrylic paint\n Sculpting tools",
      productInfo: " 3D Art\n Fan art\n Handmade figure",
      price: 2360,
      availability: "Available"
    },
    {
      id: "art-es-009",
      artistId: "artist-es-006",
      title: "Lisa Portrait",
      category: "Drawing",
      image: "images/drawings/euladrawing/lisablackpink.jpeg",
      description: "A realistic colored pencil portrait of Lisa from BLACKPINK, wearing a blue outfit.",
      story: "The artist focused on capturing the singer's likeness and the soft texture of her blue outfit. The subtle blending of colors brings a lifelike quality to the portrait.",
      materials: " Colored pencils\n Drawing paper",
      productInfo: " Celebrity portrait\n Colored pencil art\n Realistic style",
      price: 1620,
      availability: "Available"
    },
    {
      id: "art-es-010",
      artistId: "artist-es-006",
      title: "Jennie Portrait",
      category: "Drawing",
      image: "images/drawings/euladrawing/Jennieblackpink.png",
      description: "A striking colored pencil portrait of a Jennie from BLACKPINK with vibrant red hair and a black tie.",
      story: "This piece highlights the contrast between the bright red hair and the stark black background. The intense gaze of the subject draws the viewer in.",
      materials: " Colored pencils\n Black paper",
      productInfo: " Portrait\n Colored pencil art\n High contrast",
      price: 1800,
      availability: "Available"
    },
    {
      id: "art-es-011",
      artistId: "artist-es-006",
      title: "Idol Portrait",
      category: "Drawing",
      image: "images/drawings/euladrawing/JisooBlackpink.png",
      description: "A detailed portrait of a K-pop idol (Jisoo) with dark hair.",
      story: "The artist captures the idol's elegant gaze against a dark background, focusing on subtle skin tones and realistic lighting.",
      materials: " Colored pencils\n Drawing paper",
      productInfo: " Celebrity portrait\n Realistic art\n K-pop theme",
      price: 1460,
      availability: "Available"
    },
    {
      id: "art-es-012",
      artistId: "artist-es-006",
      title: "Elegant Woman Profile",
      category: "Drawing",
      image: "images/drawings/euladrawing/elegantwoman.png",
      description: "A delicate portrait of a woman looking over her shoulder.",
      story: "This artwork emphasizes the subject's soft features and the gentle lighting on her face. The use of a dark background makes the subject pop out beautifully.",
      materials: " Colored pencils\n Drawing paper",
      productInfo: " Portrait\n Realistic art\n Side profile",
      price: 1930,
      availability: "Available"
    },
    {
      id: "art-es-013",
      artistId: "artist-es-006",
      title: "Starry Night Remix",
      category: "Painting",
      image: "images/drawings/euladrawing/starrynight.jpeg",
      description: "A creative recreation of Van Gogh's 'Starry Night' with typography.",
      story: "The artist added a bold typographic element with a romantic quote to the classic painting. It blends visual art with poetry, reimagining a masterpiece.",
      materials: " Acrylic paint\n Canvas\n Paintbrushes",
      productInfo: " Masterpiece recreation\n Text art\n Romantic theme",
      price: 1840,
      availability: "Available"
    },
    {
      id: "art-es-014",
      artistId: "artist-es-006",
      title: "Teapot Still Life",
      category: "Sketch",
      image: "images/drawings/euladrawing/Teapot still life.jpeg",
      description: "A realistic charcoal still-life drawing of a teapot, basket, and jar.",
      story: "This piece focuses on rendering metallic textures, highlights, and shadows with high realism. The dramatic lighting gives the composition a three-dimensional depth.",
      materials: " Charcoal\n Graphite\n Sketch paper",
      productInfo: " Still life\n Academic drawing\n Realistic shading",
      price: 1760,
      availability: "Available"
    },
    {
      id: "art-es-015",
      artistId: "artist-es-006",
      title: "Yellow Duckling",
      category: "Drawing",
      image: "images/drawings/euladrawing/duck.jpeg",
      description: "A vibrant painting of a cute yellow duckling swimming in shimmering blue-green water.",
      story: "This piece captures the innocence and playful nature of a baby duck. The artist used expressive, textured strokes to bring out the fluffiness of the duckling and the dynamic movement of the water.",
      materials: " Oil pastel\n Canvas/Paper\n Blending tools",
      productInfo: " Animal artwork\n Original painting\n Vibrant colors",
      price: 1950,
      availability: "Available"
    },

    // ARTWORKS BY MICHAEL JOHN SANTOS
    {
      id: "art-mjs-001",
      artistId: "artist-mjs-001",
      title: "Campus Morning",
      category: "Photography",
      image: "images/drawings/michaeljohndrawing/campus photography.jpg",
      description: "A sunlit architectural photograph of a campus building with green-tinted windows.",
      story: "Capturing the quiet, everyday moments of student life, the artist highlights the play of morning light on the building's facade and the vibrant green grass.",
      materials: " Digital camera\n Photography\n Natural lighting",
      productInfo: " Architectural photography\n Landscape\n High resolution",
      price: 980,
      availability: "Available"
    },
    {
      id: "art-mjs-002",
      artistId: "artist-mjs-001",
      title: "Coffee Fundraiser Poster",
      category: "Graphics",
      image: "images/drawings/michaeljohndrawing/freecoffee.jpg",
      description: "A promotional poster for a coffee fundraiser by the Mental Health Coalition.",
      story: "Designed to attract students with warm colors and a dynamic coffee splash, this layout effectively communicates event details while maintaining a cozy aesthetic.",
      materials: " Adobe Photoshop\n Digital illustration\n Vector graphics",
      productInfo: " Event poster\n Digital design\n Typography layout",
      price: 1730,
      availability: "Available"
    },
    {
      id: "art-mjs-003",
      artistId: "artist-mjs-001",
      title: "Edmi Buds Promo",
      category: "Graphics",
      image: "images/drawings/michaeljohndrawing/Redmibuds.jpg",
      description: "A minimalist commercial graphic for Edmi Buds 3 Lite.",
      story: "Emphasizes the immersive audio experience with a sleek, modern layout featuring a person listening to music, blending product photography with clean typography.",
      materials: " Adobe Photoshop\n Photo manipulation\n Typography",
      productInfo: " Commercial graphic\n Product advertisement\n Minimalist design",
      price: 1550,
      availability: "Available"
    },
    {
      id: "art-mjs-004",
      artistId: "artist-mjs-001",
      title: "Sophomore Recap",
      category: "Graphics",
      image: "images/drawings/michaeljohndrawing/scrapbook.jpg",
      description: "A digital scrapbook design summarizing the Freshies and Sophomore year.",
      story: "Features polaroid-style photos and vintage journal elements to evoke nostalgia. The composition beautifully documents memories and milestones.",
      materials: " Adobe Photoshop\n Texture overlays\n Typography",
      productInfo: " Digital scrapbook\n Memory layout\n Vintage aesthetic",
      price: 1840,
      availability: "Available"
    },
    {
      id: "art-mjs-005",
      artistId: "artist-mjs-001",
      title: "BSCPE 3B Class Officers",
      category: "Graphics",
      image: "images/drawings/michaeljohndrawing/class3b.jpg",
      description: "A formal class officer introduction poster for BSCPE-3B.",
      story: "Highlights the student leaders and their adviser with a futuristic tech background, symbolizing innovation and leadership in engineering.",
      materials: " Adobe Photoshop\n Adobe Illustrator\n Photo grid",
      productInfo: " Organizational poster\n Class profile\n Tech-themed layout",
      price: 1950,
      availability: "Available"
    },
    {
      id: "art-mjs-006",
      artistId: "artist-mjs-001",
      title: "Light and Shadows",
      category: "Photography",
      image: "images/drawings/michaeljohndrawing/AC.jpg",
      description: "A photograph playing with light and shadow through wooden architectural louvers.",
      story: "Explores geometric lines and the warm glow of the afternoon sun. The interplay of light creates a rhythmic pattern across the wooden structure.",
      materials: " Digital camera\n Photography\n Natural light",
      productInfo: " Architectural photography\n Abstract lines\n Warm tones",
      price: 1730,
      availability: "Available"
    },
    {
      id: "art-mjs-007",
      artistId: "artist-mjs-001",
      title: "Happy Birthday Third",
      category: "Graphics",
      image: "images/drawings/michaeljohndrawing/Birthday.jpg",
      description: "A personalized digital birthday greeting card for a classmate named Third.",
      story: "Uses fun typography and pixel art elements to create a festive vibe. It's a playful and customized tribute to celebrate a special day.",
      materials: " Adobe Photoshop\n Digital design\n Typography",
      productInfo: " Greeting card\n Digital art\n Personalized design",
      price: 750,
      availability: "Available"
    },
    {
      id: "art-mjs-008",
      artistId: "artist-mjs-001",
      title: "BSCPE 4B Logo",
      category: "Graphics",
      image: "images/drawings/michaeljohndrawing/4blogo.jpg",
      description: "A 3D rendered organizational logo for BSCPE Batch 4B.",
      story: "Combines mechanical gears and digital lines to represent Computer Engineering. The red and metallic tones give it a professional and strong presence.",
      materials: " 3D modeling software\n Digital rendering\n Lighting",
      productInfo: " 3D logo design\n Organizational branding\n High quality render",
      price: 1460,
      availability: "Available"
    },
    {
      id: "art-mjs-009",
      artistId: "artist-mjs-001",
      title: "Class Schedule Layout",
      category: "Graphics",
      image: "images/drawings/michaeljohndrawing/classsched.jpg",
      description: "A color-coded class schedule layout for the second semester.",
      story: "Organizes complex academic schedules into a clean, readable visual grid. The use of bright, distinct colors helps students easily navigate their weekly subjects.",
      materials: " Adobe Illustrator\n Adobe Photoshop\n Typography",
      productInfo: " Information design\n Schedule layout\n Color-coded grid",
      price: 1630,
      availability: "Available"
    },
    {
      id: "art-mjs-010",
      artistId: "artist-mjs-001",
      title: "Modern Campus Architecture",
      category: "Photography",
      image: "images/drawings/michaeljohndrawing/adminbulsu.jpg",
      description: "An architectural photograph of a modern building with striking red and green glass elements.",
      story: "Highlights the contrast between the bold colors and the clear blue sky. The composition emphasizes the geometric beauty of the campus infrastructure.",
      materials: " Digital camera\n Photography\n Color grading",
      productInfo: " Architectural photography\n Vibrant colors\n Sharp focus",
      price: 1890,
      availability: "Available"
    },
    {
      id: "art-mjs-011",
      artistId: "artist-mjs-001",
      title: "Student ID Design",
      category: "Graphics",
      image: "images/drawings/michaeljohndrawing/studentid.jpg",
      description: "A stylish, custom-designed student ID layout for BSCPE.",
      story: "Incorporates circuit board motifs and academic achievements (GWA). It transforms a standard school ID into a modern piece of digital personal branding.",
      materials: " Adobe Photoshop\n Adobe Illustrator\n Vector graphics",
      productInfo: " ID card design\n Personal branding\n Tech-inspired layout",
      price: 1460,
      availability: "Available"
    },
    {
      id: "art-mjs-012",
      artistId: "artist-mjs-001",
      title: "Minimalist Sky",
      category: "Photography",
      image: "images/drawings/michaeljohndrawing/buildingsky.jpg",
      description: "A minimalist, moody photograph of a building edge against an overcast sky.",
      story: "Uses negative space to emphasize the scale of the structure and the calm atmosphere. The muted colors evoke a sense of quiet reflection.",
      materials: " Digital camera\n Photography\n Minimalist composition",
      productInfo: " Minimalist photography\n Moody aesthetic\n Negative space",
      price: 1290,
      availability: "Available"
    }
    
  ].map((artwork) => ({
    ...artwork,
    artist: artists.find((artist) => artist.id === artwork.artistId).name
  }));

  // GENERAL COMMISSION INFORMATION
  // This is intentionally separate from individual artist rates; replace it with platform-wide policy when available.
const generalCommission = {
  title: "General Commission Information",
  availability: "Availability varies by artist. Contact the selected artist to confirm.",
  pricing: "Rates vary by artist and project. Confirm the final price directly with the artist before booking.",
  services: ["Sketch", "Painting", "Digital Art", "Graphics", "Illustration", "UI/UX Design", "Architectural Illustration"],
  materials: "Materials depend on the artist and project. Confirm the required materials with the artist before booking.",
  description: "Commission services, styles, and requirements vary by artist. Contact an artist to discuss your idea and project details.",
  guidelines: [
    "Share a clear brief and reference images.",
    "Confirm the project scope, final price, materials, and timeline with the artist before booking.",
    "Agree on the delivery format and intended usage of the finished work."
  ]
};

  const byId = (records) => new Map(records.map((record) => [record.id, record]));
  const artistsById = byId(artists);
  const artworksById = byId(artworkRecords);
  const normalizeCategory = (category) => category.trim().toLowerCase()
    .replace(/\s+commission$/, "")
    .replace(/\b(paintings|drawings|artworks)$/, (word) => word.slice(0, -1));
  const api = Object.freeze({
    getAllArtists: () => artists.slice(),
    getArtistById: (id) => artistsById.get(id) || null,
    getArtworkById: (id) => artworksById.get(id) || null,
    getAllArtworks: () => artworkRecords.slice(),
    getArtworksByArtist: (artistId) => artworkRecords.filter((artwork) => artwork.artistId === artistId),
    getArtworkCategoriesByArtist: (artistId) => [...new Set(
      artworkRecords
        .filter((artwork) => artwork.artistId === artistId)
        .map((artwork) => artwork.category)
    )],
    getArtworksByArtistAndCategory: (artistId, category) => {
      const normalizedCategory = normalizeCategory(category);
      return artworkRecords.filter((artwork) =>
        artwork.artistId === artistId && normalizeCategory(artwork.category) === normalizedCategory
      );
    },
    filterArtworksByCategory: (category) => category === "all"
      ? artworkRecords.slice()
      : artworkRecords.filter((artwork) => normalizeCategory(artwork.category) === normalizeCategory(category)),
    shuffleArtworks: (records = artworkRecords) => {
      const shuffled = records.slice();
      for (let i = shuffled.length - 1; i > 0; i -= 1) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
      }
      return shuffled;
    },
    getArtistCommission: (artistId) => artistsById.get(artistId)?.commission || null,
    getGeneralCommission: () => generalCommission,
    getArtistSocials: (artistId) => artistsById.get(artistId)?.socials || null
  });

  window.PMCArtDatabase = api;
})();