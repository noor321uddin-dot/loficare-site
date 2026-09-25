/* Legal pages: drafts for legal review. Text in [brackets] is a placeholder the legal team fills in.
   English is the reviewed text; each section carries a Bangla summary for the Bangla route. */
export type LegalSection = { id: string; h: string; hBn: string; body: string[]; summaryBn: string };
export type LegalDoc = { slug: 'privacy' | 'terms'; title: string; titleBn: string; updated: string; intro: string; introBn: string; sections: LegalSection[] };

export const privacy: LegalDoc = {
  slug: 'privacy',
  title: 'Privacy notice',
  titleBn: 'গোপনীয়তা নোটিশ',
  updated: '2026-09-26',
  intro:
    'This notice explains what LofiCare collects when you use this website and the demo and trial forms, why, where it is kept, and what you can ask us to do with it. The LofiCare platform itself, the system a facility runs on, is covered by the customer agreement each facility signs. Under that agreement the facility decides how patient data is used and LofiCare processes it on the facility’s instructions.',
  introBn:
    'এই ওয়েবসাইট ও ডেমো/ট্রায়াল ফর্ম ব্যবহার করলে লফিকেয়ার কী সংগ্রহ করে, কেন করে, কোথায় রাখে, আর আপনি কী চাইতে পারেন, এই নোটিশে তা সহজ ভাষায় বলা আছে। লফিকেয়ার প্ল্যাটফর্ম, অর্থাৎ যে সিস্টেমে প্রতিষ্ঠান চলে, তা প্রতিটি প্রতিষ্ঠানের সাথে সই করা গ্রাহক চুক্তির আওতায়।',
  sections: [
    {
      id: 'who', h: 'Who we are', hBn: 'আমরা কারা',
      body: ['LofiCare is operated by [legal entity name], [registered address], Chittagong, Bangladesh. For anything in this notice, write to [privacy email] or call [phone].'],
      summaryBn: 'লফিকেয়ার পরিচালনা করে [আইনি প্রতিষ্ঠানের নাম], চট্টগ্রাম, বাংলাদেশ। এই নোটিশ নিয়ে যেকোনো প্রশ্নে [গোপনীয়তা ইমেইল] এ লিখুন।',
    },
    {
      id: 'scope', h: 'What this notice covers', hBn: 'এই নোটিশ যা কভার করে',
      body: ['The website at [domain], the demo request form, the free trial form, the WhatsApp and phone links, and the optional analytics on this site. It does not cover the LofiCare platform, patient records, or any facility’s own website.'],
      summaryBn: 'এই ওয়েবসাইট, ডেমো ও ট্রায়াল ফর্ম, হোয়াটসঅ্যাপ ও ফোন লিংক, আর সম্মতিভিত্তিক অ্যানালিটিক্স। লফিকেয়ার প্ল্যাটফর্ম বা রোগীর রেকর্ড এর আওতায় নয়।',
    },
    {
      id: 'collect', h: 'What we collect', hBn: 'আমরা যা সংগ্রহ করি',
      body: [
        'What you type into a form: your name, facility name and type, your role, number of branches, phone number, email address, and any message.',
        'Technical details when a form is sent: a shortened, salted hash of your IP address, your browser type, the page you sent it from, and the time. We do not store your IP address itself.',
        'Your preferences: your chosen language and colour mode, and your analytics consent choice. These stay in your browser.',
        'Analytics, only if you accept: page views and which buttons were used, with no personal data attached. Nothing is measured before you accept.',
      ],
      summaryBn: 'ফর্মে আপনি যা লেখেন: নাম, প্রতিষ্ঠান, পদ, ফোন, ইমেইল, বার্তা। পাঠানোর সময়ের কারিগরি তথ্য: আইপি ঠিকানার সংক্ষিপ্ত হ্যাশ (আইপি নিজে নয়), ব্রাউজার, পাঠানোর পাতা, সময়। আপনার ভাষা, রঙের মোড ও সম্মতির পছন্দ আপনার ব্রাউজারেই থাকে। অ্যানালিটিক্স শুধু আপনি সম্মতি দিলে, কোনো ব্যক্তিগত তথ্য ছাড়া।',
    },
    {
      id: 'why', h: 'Why we use it', hBn: 'কেন ব্যবহার করি',
      body: [
        'To reply to your demo or trial request, and to set up your chamber or facility if you go ahead.',
        'To keep the forms working and free of abuse.',
        'To understand which parts of the site are read, only with your consent.',
        'We do not sell personal data, and we do not use it to advertise to you.',
      ],
      summaryBn: 'আপনার ডেমো বা ট্রায়ালের অনুরোধের জবাব দিতে ও সেটআপ করতে, ফর্মকে অপব্যবহার থেকে বাঁচাতে, আর সম্মতি থাকলে সাইটের কোন অংশ পড়া হয় তা বুঝতে। আমরা ব্যক্তিগত তথ্য বিক্রি করি না, বিজ্ঞাপনে ব্যবহার করি না।',
    },
    {
      id: 'where', h: 'Where it is kept and who sees it', hBn: 'কোথায় থাকে, কে দেখে',
      body: [
        'Form submissions are stored on a server in [hosting region, to be confirmed by the team]. A copy is sent to our customer system at [provider] and by email to our sales team so that we can reply.',
        'The people who see it are the LofiCare team members who handle demos and trials, and the providers named here who store or deliver it on our behalf under contract: [list of processors].',
      ],
      summaryBn: 'ফর্মের তথ্য [হোস্টিং অঞ্চল, টিম নিশ্চিত করবে] সার্ভারে থাকে। জবাব দিতে একটি কপি আমাদের গ্রাহক সিস্টেম ও বিক্রয় দলের ইমেইলে যায়। দেখেন শুধু ডেমো ও ট্রায়াল সামলানো লফিকেয়ার টিম ও চুক্তিবদ্ধ সেবাদাতারা।',
    },
    {
      id: 'retention', h: 'How long we keep it', hBn: 'কতদিন রাখি',
      body: [
        'Demo and trial requests: [24 months] from the last contact, then deleted.',
        'Submissions our filters mark as spam: [30 days].',
        'Server logs: [30 days].',
        'You can ask us to delete your request sooner at any time.',
      ],
      summaryBn: 'ডেমো ও ট্রায়াল অনুরোধ: শেষ যোগাযোগের পর [২৪ মাস]। স্প্যাম হিসেবে চিহ্নিত: [৩০ দিন]। আপনি চাইলে আগেই মুছে দিই।',
    },
    {
      id: 'rights', h: 'Your rights', hBn: 'আপনার অধিকার',
      body: [
        'You can ask what we hold about you, ask us to correct it, ask us to delete it, or object to how we use it. Write to [privacy email]. We answer within [30 days].',
        'If you are not satisfied with our answer, you may complain to the authority responsible for data protection in Bangladesh: [authority name and contact, legal team to confirm].',
      ],
      summaryBn: 'আমাদের কাছে থাকা তথ্য জানতে, সংশোধন করতে, মুছতে বা ব্যবহারে আপত্তি জানাতে [গোপনীয়তা ইমেইল] এ লিখুন। [৩০ দিনের] মধ্যে জবাব দিই। সন্তুষ্ট না হলে বাংলাদেশের তথ্য-সুরক্ষা কর্তৃপক্ষের কাছে অভিযোগ করতে পারেন।',
    },
    {
      id: 'security', h: 'Security', hBn: 'নিরাপত্তা',
      body: [
        'Data travels to us over an encrypted connection. Access to stored requests is limited to the people who need it.',
        'On the LofiCare platform, every sensitive action is written to an append-only audit trail that nobody, including a facility owner, can edit.',
      ],
      summaryBn: 'তথ্য এনক্রিপ্টেড সংযোগে আসে। সংরক্ষিত অনুরোধে প্রবেশাধিকার সীমিত। লফিকেয়ার প্ল্যাটফর্মে প্রতিটি সংবেদনশীল কাজ অ্যাপেন্ড-অনলি অডিট ট্রেইলে লেখা হয়, যা মালিকও বদলাতে পারেন না।',
    },
    {
      id: 'children', h: 'Children', hBn: 'শিশু',
      body: ['This website and its forms are for facilities and doctors. They are not directed at children, and we do not knowingly collect children’s data through them.'],
      summaryBn: 'এই সাইট ও ফর্ম প্রতিষ্ঠান ও চিকিৎসকদের জন্য, শিশুদের জন্য নয়।',
    },
    {
      id: 'law', h: 'The law that applies', hBn: 'প্রযোজ্য আইন',
      body: ['This notice is written to follow the data-protection rules that apply in Bangladesh. [Legal team: name the governing law, any registration or licence numbers, and the date of the last legal review.]'],
      summaryBn: 'এই নোটিশ বাংলাদেশে প্রযোজ্য তথ্য-সুরক্ষা নিয়ম মেনে লেখা। আইন দল এখানে প্রযোজ্য আইনের নাম দেবে।',
    },
    {
      id: 'changes', h: 'Changes', hBn: 'পরিবর্তন',
      body: ['When this notice changes, the date at the top changes with it. Material changes are announced on this page.'],
      summaryBn: 'নোটিশ বদলালে উপরের তারিখ বদলায়, বড় পরিবর্তন এই পাতায় জানানো হয়।',
    },
    {
      id: 'contact', h: 'Contact', hBn: 'যোগাযোগ',
      body: ['[privacy email], [phone], [postal address].'],
      summaryBn: '[গোপনীয়তা ইমেইল], [ফোন], [ঠিকানা]।',
    },
  ],
};

export const terms: LegalDoc = {
  slug: 'terms',
  title: 'Terms of use',
  titleBn: 'ব্যবহারের শর্তাবলী',
  updated: '2026-09-26',
  intro:
    'These terms cover your use of this website and of the free LofiCare Appointments trial started from it. The full LofiCare platform is provided under a separate customer agreement signed with each facility.',
  introBn:
    'এই শর্তাবলী এই ওয়েবসাইট ও এখান থেকে শুরু করা বিনামূল্যের লফিকেয়ার অ্যাপয়েন্টমেন্ট ট্রায়ালের ব্যবহারে প্রযোজ্য। পুরো লফিকেয়ার প্ল্যাটফর্ম প্রতিটি প্রতিষ্ঠানের সাথে সই করা আলাদা গ্রাহক চুক্তিতে দেওয়া হয়।',
  sections: [
    {
      id: 'provider', h: 'Who provides this', hBn: 'কে দিচ্ছে',
      body: ['This website and the trial are provided by [legal entity name], [registered address], Chittagong, Bangladesh.'],
      summaryBn: '[আইনি প্রতিষ্ঠানের নাম], চট্টগ্রাম, বাংলাদেশ।',
    },
    {
      id: 'use', h: 'Using the website', hBn: 'ওয়েবসাইট ব্যবহার',
      body: ['You may read, share and link to this site. You may not scrape it, overload it, send false requests through its forms, or use it to harm anyone. We may block abusive traffic.'],
      summaryBn: 'পড়তে, শেয়ার করতে, লিংক দিতে পারেন। স্ক্র্যাপ করা, অতিরিক্ত চাপ দেওয়া, ভুয়া অনুরোধ পাঠানো বা কারও ক্ষতিতে ব্যবহার করা যাবে না।',
    },
    {
      id: 'trial', h: 'The free appointment trial', hBn: 'বিনামূল্যের অ্যাপয়েন্টমেন্ট ট্রায়াল',
      body: [
        'Start free means LofiCare Appointments for one chamber, set up by us, with your first 500 appointments at no charge and no card required.',
        'After that, you choose whether to upgrade. The price is agreed with you in writing before anything is charged, and it is never taken from this page.',
        'We may change or end the free tier with [30 days] notice to trial users. [Legal team: confirm the notice period and any eligibility conditions.]',
      ],
      summaryBn: 'বিনামূল্যে শুরু মানে এক চেম্বারের জন্য লফিকেয়ার অ্যাপয়েন্টমেন্ট, আমরা সেটআপ করি, প্রথম ৫০০ অ্যাপয়েন্টমেন্ট বিনা খরচে, কার্ড লাগে না। এরপর আপগ্রেড আপনার সিদ্ধান্ত; দাম আগে লিখিতভাবে ঠিক হয়, এই পাতা থেকে কখনো নেওয়া হয় না। [৩০ দিনের] নোটিশে বিনামূল্যের স্তর বদলাতে বা বন্ধ করতে পারি।',
    },
    {
      id: 'claims', h: 'What the site says about the platform', hBn: 'সাইটে প্ল্যাটফর্ম সম্পর্কে যা বলা আছে',
      body: [
        'The site describes what LofiCare does and which modules are available today. Modules marked early access are being built with founding facilities, and their scope and timing can change.',
        'Nothing on this site is medical advice.',
      ],
      summaryBn: 'কোন মডিউল আজ উপলব্ধ তা সাইটে বলা আছে। প্রাথমিক অ্যাক্সেস চিহ্নিত মডিউলগুলো তৈরি হচ্ছে, পরিধি ও সময় বদলাতে পারে। এই সাইটের কিছুই চিকিৎসা পরামর্শ নয়।',
    },
    {
      id: 'your-content', h: 'Your content', hBn: 'আপনার বিষয়বস্তু',
      body: ['What you send through the forms is yours. You give us permission to use it to answer you. The booking pages a doctor publishes through LofiCare Appointments are governed by the trial and, later, by the customer agreement.'],
      summaryBn: 'ফর্মে যা পাঠান তা আপনার; জবাব দিতে ব্যবহারের অনুমতি দেন।',
    },
    {
      id: 'our-content', h: 'Our content', hBn: 'আমাদের বিষয়বস্তু',
      body: ['The LofiCare name, mark, and the words and designs on this site belong to [legal entity name]. Do not copy them for another product.'],
      summaryBn: 'লফিকেয়ার নাম, চিহ্ন ও এই সাইটের লেখা ও নকশা [আইনি প্রতিষ্ঠানের নাম] এর। অন্য পণ্যে নকল করা যাবে না।',
    },
    {
      id: 'liability', h: 'Liability', hBn: 'দায়',
      body: ['The website is provided as it is. To the extent the law allows, we are not liable for loss arising from reliance on this website. [Legal team: set the exact wording and any caps.]'],
      summaryBn: 'ওয়েবসাইট যেমন আছে তেমনই দেওয়া হয়। আইন যতটা অনুমতি দেয়, এই সাইটের উপর নির্ভর করে হওয়া ক্ষতির দায় আমরা নিই না। সঠিক ভাষা আইন দল ঠিক করবে।',
    },
    {
      id: 'law', h: 'Governing law', hBn: 'প্রযোজ্য আইন',
      body: ['These terms are governed by the laws of Bangladesh. Disputes go to the courts of [Chittagong or Dhaka, legal team to confirm].'],
      summaryBn: 'বাংলাদেশের আইন প্রযোজ্য। বিরোধ [চট্টগ্রাম/ঢাকা, আইন দল নিশ্চিত করবে] আদালতে।',
    },
    {
      id: 'contact', h: 'Changes and contact', hBn: 'পরিবর্তন ও যোগাযোগ',
      body: ['When these terms change, the date at the top changes with them. Questions: [contact email], [phone].'],
      summaryBn: 'শর্ত বদলালে উপরের তারিখ বদলায়। প্রশ্ন: [যোগাযোগের ইমেইল], [ফোন]।',
    },
  ],
};
