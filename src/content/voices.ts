/* Doctors in their own words. This file is the only source the Voices section reads.
   Every entry below is marked `sample: true`: an invented quote and a stock portrait, kept only so the
   layout can be seen. The section labels them as samples and the build prints a warning while any remain.
   Replace them with real quotes (name, role, chamber, the words unedited) before launch, and drop the flag. */
export type Locale = 'en' | 'bn';
export type Text = string | { en: string; bn: string };
export type Voice = {
  quote: Text;
  name: Text;
  role: Text;
  place: Text;
  photo?: string;
  since?: Text;
  sample?: boolean;
};
export const pick = (v: Text | undefined, locale: Locale): string => (v === undefined ? '' : typeof v === 'string' ? v : v[locale] || v.en);

export const voices: Voice[] = [
  {
    sample: true,
    photo: '/voices/sample-1.webp',
    quote: {
      en: 'My assistant used to start every morning on the phone. Now patients pick their own slot and I see the day’s list before I leave home.',
      bn: 'আমার সহকারীর প্রতিটা সকাল শুরু হতো ফোনে। এখন রোগীরা নিজেরাই সময় বেছে নেন, আর বাসা থেকে বের হওয়ার আগেই আমি দিনের তালিকা দেখে নিই।',
    },
    name: { en: 'Dr. Farzana Haque', bn: 'ডা. ফারজানা হক' },
    role: { en: 'Medicine', bn: 'মেডিসিন' },
    place: { en: 'Chattogram', bn: 'চট্টগ্রাম' },
    since: { en: 'Founding cohort', bn: 'প্রতিষ্ঠাতা দল' },
  },
  {
    sample: true,
    photo: '/voices/sample-2.webp',
    quote: {
      en: 'Parents with a sick child do not want to sit in a corridor guessing. The serial on their phone tells them when to come in.',
      bn: 'অসুস্থ শিশু নিয়ে মা-বাবা করিডোরে বসে অনুমান করতে চান না। ফোনের সিরিয়াল বলে দেয় কখন ভেতরে আসতে হবে।',
    },
    name: { en: 'Dr. Tanvir Ahmed', bn: 'ডা. তানভীর আহমেদ' },
    role: { en: 'Paediatrics', bn: 'শিশুরোগ' },
    place: { en: 'Dhaka', bn: 'ঢাকা' },
    since: { en: 'Founding cohort', bn: 'প্রতিষ্ঠাতা দল' },
  },
  {
    sample: true,
    quote: {
      en: 'The reminder the day before does what my receptionist could not do alone. The chairs are full at the times we planned.',
      bn: 'আগের দিনের রিমাইন্ডার সেটাই করে যা আমার রিসেপশনিস্ট একা পারতেন না। যে সময় ঠিক করেছি, সে সময়েই চেয়ারগুলো ভরা থাকে।',
    },
    name: { en: 'Dr. Nusrat Jahan', bn: 'ডা. নুসরাত জাহান' },
    role: { en: 'Gynaecology', bn: 'স্ত্রীরোগ' },
    place: { en: 'Sylhet', bn: 'সিলেট' },
    since: { en: 'Founding cohort', bn: 'প্রতিষ্ঠাতা দল' },
  },
];
