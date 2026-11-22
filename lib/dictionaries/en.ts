/**
 * Every interface string on the public site, in English. ro.ts mirrors this
 * shape exactly (TypeScript checks it). Project stories, photo captions and
 * other content live in data/ (English) and data/i18n/ro.ts (Romanian).
 *
 * Placeholders like {name} are filled in with fmt() from lib/i18n-format.ts.
 * Titles split in two (`a` + `em`) are a plain part and an italic part.
 */
export const en = {
  meta: {
    title: "Customs by Iasmi — custom sneakers & wearable art, painted by hand",
    description:
      "A personal creative studio for hand-painted sneakers and wearable art: one-of-one pieces painted by hand, plus custom graduation caps.",
    ogTitle: "Customs by Iasmi — custom sneakers & wearable art",
    ogDescription: "One-of-one sneakers, painted by hand. Send the mood, wear the artwork.",
    keywords: ["custom sneakers", "hand-painted sneakers", "wearable art", "sneaker commission", "custom graduation cap", "iasmi"],
    skip: "Skip to content",
  },
  nav: {
    home: "Home",
    projects: "Projects",
    about: "About",
    contact: "Contact",
    openMenu: "Open menu",
    closeMenu: "Close menu",
    main: "Main",
    mobile: "Mobile",
    language: "Language",
  },
  footer: {
    blurb: "Custom sneakers and graduation caps, painted by hand, one at a time, in Romania.",
    motto: "send the mood, wear the artwork",
    explore: "Explore",
    sayHi: "Say hi on",
    copyright: "every pair is a",
    oneOfOne: "one-of-one.",
    tagline: "Hand-painted · sealed for real life ·",
    privacy: "Privacy",
  },
  hero: {
    kicker: "painted by hand",
    titleA: "Custom sneakers,",
    titleEm: "painted by hand.",
    lede: "Wearable art created from your moodboard, story, colours, and obsessions. Send me the mood and I'll turn it into something you can wear.",
    cta: "Tell me about your dream pair",
    projects: "View my projects",
    location: "Romania",
    stageLabel: "Sneakers I've painted",
    play: "Play the slideshow",
    pause: "Pause the slideshow",
  },
  featured: {
    eyebrow: "Selected projects",
    titleA: "Every piece starts with",
    titleEm: "a story.",
    lede: "A reference photo, a few words that matter, an obsession — then hours of paint.",
    explore: "Explore my projects →",
  },
  instagram: {
    eyebrow: "On Instagram",
    lede: "Finished pieces, graduation days and the whole process, from sketch to sealed.",
    follow: "Follow along →",
    reelLabel: "Reel on Instagram: {caption}",
    postLabel: "Post on Instagram: {caption}",
    reel: "▶ reel",
    post: "post",
  },
  aboutTeaser: {
    eyebrow: "The person behind the paint",
    titleA: "A studio grown from",
    titleEm: "a life of obsessions.",
    lede: "Painting, sneakers, graduation caps, style, travel, gaming, food, a soft spot for Japan — a mosaic of the things I love, slowly turning into a studio.",
    link: "Meet me properly",
  },
  contactCta: {
    kicker: "have an idea for a pair?",
    titleA: "Send me the mood.",
    titleEm: "I'll help shape it.",
    lede: "No pressure, no order forms. Tell me what refuses to leave your brain, or just come say hi.",
    button: "Say hi",
  },
  categories: {
    sneakers: "Sneakers",
    "graduation-caps": "Graduation caps",
    process: "Process",
    sketches: "Sketches",
  },
  card: {
    view: "{title} — view project",
    process: "▶ process",
    dreamUp: "Dream up one like this",
  },
  projects: {
    metaTitle: "Projects",
    metaDescription: "Custom hand-painted sneakers and graduation caps — the projects from Customs by Iasmi.",
    eyebrow: "My projects",
    titleA: "Projects so far —",
    titleEm: "and counting.",
    lede: "Sneakers and graduation caps — everything I've actually made, with the process behind it.",
    filterLabel: "Filter projects by category",
    everything: "Everything",
    emptyTitle: "nothing here yet…",
    emptyText:
      "The first projects are being photographed and written up. In the meantime, you can see everything I post on Instagram.",
  },
  project: {
    back: "← Back to projects",
    story: "The story",
    process: "Process",
    learned: "What I learned",
    materials: "Materials",
    time: "Time",
    makingOfVideo: "{title} — making of",
    beforeAfter: "Before / after",
    before: "before",
    after: "after",
    gallery: "Gallery",
    makingOf: "Making of",
    ctaKicker: "liked this one?",
    ctaTitlePair: "Dreaming of a pair like this — ",
    ctaTitleCap: "Dreaming of a cap like this — ",
    ctaTitleEm: "but yours?",
    ctaTextPair: "Tell me the mood, the story, the colours. No pressure, I just love hearing the ideas.",
    ctaTextCap: "Tell me your words, your field and the things you love. No pressure, I just love hearing the ideas.",
    ctaButtonPair: "Tell me about your dream pair",
    ctaButtonCap: "Tell me about your dream cap",
    notFound: "Not found",
  },
  photos: {
    viewFull: "View full photo: {alt}",
    previous: "Previous photo",
    next: "Next photo",
    close: "Close",
  },
  about: {
    metaTitle: "About",
    metaDescription:
      "The person behind Customs by Iasmi, and how I paint custom sneakers and graduation caps by hand, in four steps.",
    eyebrow: "hi, I'm Iasmi",
    titleA: "I collect obsessions and",
    titleEm: "paint them on things.",
    intro:
      "This is where I collect the things I make, try, paint, design, obsess over — and slowly turn into a studio. Right now the main canvas is sneakers. The second canvas is graduation caps, and I never run out of ideas for what to paint next.",
    moodboard: "this whole site is one big moodboard, honestly",
    mosaicLabel: "Things I love",
    mosaicEyebrow: "The mosaic",
    mosaicTitle: "Things I love, in tiles.",
    howLabel: "How I paint",
    howEyebrow: "How I paint",
    howTitleA: "Four steps,",
    howTitleEm: "lots of patience.",
    howLede: "Every pair goes through the same slow routine, from bare leather to the last coat of sealer.",
    steps: [
      {
        title: "Prep the leather",
        text: "I take the factory finish off with acetone and sand the surface lightly, so the paint really grips.",
      },
      {
        title: "Sketch it on",
        text: "The design goes straight onto the shoe in pencil or crayon, and I nudge it until it sits just right.",
      },
      {
        title: "Paint in thin layers",
        text: "Leather paints, many very thin coats, drying in between. Details and fine lines come last.",
      },
      {
        title: "Seal it for real life",
        text: "A finisher on top, so it survives rain, long walks and daily wear. One pair has been worn hard for a year and still looks fresh.",
      },
    ],
    handmade: "painted by hand, not factory perfect",
    handmadeText:
      "Tiny brush textures, slight asymmetries, layered depth: that's not a flaw, that's the point. A printed shoe is a copy; a painted shoe is an original.",
    tags: ["hand-painted", "sealed & wearable", "authentic base shoes only"],
    authentic:
      "Base shoes are always authentic, bought new or supplied by you. The customization is my own, independent work and isn't affiliated with or endorsed by the shoe brands.",
    socials: "come say hi where I actually live:",
    instagram: "Instagram",
    sayHi: "Say hi",
  },
  contact: {
    metaTitle: "Contact",
    metaDescription:
      "Say hi, or tell me about your dream pair of hand-painted sneakers or a custom graduation cap. DM me on Instagram, write an email, or use the short form.",
    eyebrow: "Contact",
    titleA: "Tell me what refuses to",
    titleEm: "leave your brain.",
    lede: "A dream pair, a cap idea, a question, or just hi. Send me a DM, write an email, or use the little form here. No pressure, I love hearing ideas.",
    instagramNote: "DMs open, come say hi",
    emailLabel: "Email",
    emailNote: "for longer ideas and moodboards",
    formTitle: "Or write to me right here",
    formIntro: "Just a few quick questions. It lands straight in my inbox, and I'll write back by email or on Instagram.",
    refIdea: "I saw “{title}” in your projects and I'd love something in that direction, but made mine. ",
    faqLabel: "Questions",
    faqEyebrow: "Little questions",
    faqTitleA: "Things people",
    faqTitleEm: "often ask.",
    faqLede: "If yours isn't here, just ask. There are no silly questions about painted shoes.",
    faq: [
      {
        question: "How does it work?",
        answer:
          "You tell me the idea (here, by email or in a DM) and we chat about it: the shoes, the colours, the timing. Then I sketch the design onto the shoe, paint it by hand and seal it. Graduation caps work the same way, just planned around the big day.",
      },
      {
        question: "Can I send my own shoes?",
        answer:
          "Yes! A pair you already own is a lovely canvas, even a well-loved one. If you don't have them yet, we can figure out which shoes to get together.",
      },
      {
        question: "Are they actually wearable?",
        answer:
          "Yes. I use leather paints made for shoes, in thin flexible layers, and seal every pair with a finisher. The One Piece pair has been worn through a year of rain, long walks and driving, and still looks great. They're water-resistant, not waterproof, though: treat them like a leather jacket, not a rain boot.",
      },
      {
        question: "How do I take care of them?",
        answer:
          "Wipe them gently with a soft, damp cloth and keep them out of strong sun. No machine washing, soaking or harsh solvents, and avoid deep mud. If something ever needs a touch-up, just message me.",
      },
      {
        question: "Can it be a gift?",
        answer:
          "Absolutely, most of my pairs so far were gifts! Tell me about the person and what they love, and we can keep it a secret until the big day.",
      },
    ],
  },
  form: {
    draftSaved: "draft saved on this device",
    clearDraft: "clear draft",
    draftsLocal: "drafts are saved only on this device",
    cameFromA: "✦ you came from",
    cameFromB: ", I'll see that with your message",
    paintLegend: "What would you love painted?",
    paint: {
      sneakers: { label: "Sneakers", blurb: "a pair of shoes, painted by hand" },
      cap: { label: "A graduation cap", blurb: "a small canvas for a big day" },
      other: { label: "Something else", blurb: "surprise me with the idea" },
    },
    ideaLabel: "Tell me your idea",
    ideaPlaceholder: "The mood, the story, the colours, the obsession. Messy is fine, songs and films count.",
    inspoLabel: "Inspo link",
    inspoPlaceholder: "a Pinterest board, a photo, a post…",
    nameLabel: "Your name",
    namePlaceholder: "Your name",
    replyHint: "How can I write back? One is enough.",
    emailLabel: "Email",
    emailPlaceholder: "you@example.com",
    instagramLabel: "Instagram",
    instagramPlaceholder: "@yourhandle",
    optional: "optional",
    characters: "characters",
    honeypot: "Leave this empty",
    limitedTitle: "Whoa, that's a lot of messages!",
    errorTitle: "Oh no, that didn't go through.",
    limitedText: "Give it a little while and try again. ",
    errorText: "Something hiccuped on my side. Your words are still here, so try again in a minute. ",
    dmA: "Or DM me on Instagram,",
    dmB: ", I read everything there.",
    footnote: "Sent through this site straight to my inbox.",
    privacyLink: "How I handle your data",
    sending: "Sending…",
    send: "Send it my way ✿",
    sentKicker: "got it!",
    sentTitle: "I'll get back to you soon ✿",
    sentTitleName: "I'll get back to you soon, {name} ✿",
    sentText: "Your message is safely in my inbox. Thank you for thinking of me!",
    sendAnother: "send another message",
  },
  validation: {
    ideaShort: "Give me a little more, even two sentences about the vibe help.",
    ideaLong: "That's a lot of love! Keep it under {max} characters and send the rest by email.",
    tooLong: "Keep this under {max} characters, please.",
    inspo: "That doesn't look like a link, e.g. pinterest.com/…",
    name: "Tell me your name, even just a first name.",
    email: "That email doesn't look right.",
    instagram: "That doesn't look like an Instagram handle, e.g. @yourname.",
    needContact: "Add an email or your Instagram, so I can write back.",
  },
  notFound: {
    metaTitle: "Page not found",
    metaDescription: "This page isn't painted yet. Head back to the studio or browse the projects.",
    kicker: "oops — blank canvas",
    titleA: "This page isn't",
    titleEm: "painted yet.",
    text: "Maybe it's on the roadmap, maybe the link drifted. Either way, the studio is this way:",
    home: "Back home",
    projects: "Browse my projects",
  },
  privacy: {
    metaTitle: "Privacy",
    metaDescription:
      "What this site keeps about you (almost nothing), how contact form messages reach me, how long I keep them, and your rights under the GDPR.",
  },
};

type Widen<T> = T extends string
  ? string
  : T extends readonly (infer U)[]
    ? Widen<U>[]
    : T extends object
      ? { [K in keyof T]: Widen<T[K]> }
      : T;

export type Dictionary = Widen<typeof en>;
