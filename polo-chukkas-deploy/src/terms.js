// The club's booking terms, as shown in the app (TermsSheet.jsx). The working
// copy the committee reviews is the shared "TPPC Booking Terms and Conditions"
// doc; this file is that text, kept in step by hand.
//
// TERMS_VERSION is what a member accepts. Change it whenever the terms change
// in a way members should see: everyone signed in is asked to accept again
// before their next booking (see `needTerms` in PoloChukkas.jsx).

export const TERMS_VERSION = '2026-10-22';

// Who the club is, and how its dark screens look. TermsSheet.jsx, the Home
// dashboard (HomeDashboard.jsx, luxTheme.js) and the email-link page
// (AuthActionPage.jsx) all read it, so those files are the same in every app
// and only this block changes from club to club.
//   name / short / place   the full name, the short name for calendar
//                          titles, and the town for the foot of an email
//   slug                   a prefix for this app's own device keys and
//                          calendar files (tppc-…), never shown
//   crest / crestRound     the badge, and whether to set it in a white round
//   burgundy               the app's own --burgundy, which the dark theme
//                          re-points at gold wherever it is written inline
//   colors                 the dark palette: bg, card, card2 (a raised card),
//                          line, burg (buttons), gold, gold2 (brighter, for
//                          text), cream (text), muted, dim (the footer)
export const TERMS_CLUB = {
  name: 'Tedworth Park Polo Club', short: 'Tedworth Park', place: 'Tidworth, Wiltshire', slug: 'tppc',
  crest: '/tppc-crest.png', crestRound: true,
  burgundy: '#6b1f2a',
  colors: {
    bg: '#120d0b', card: '#1f1714', card2: '#2a1f1a', line: '#3d2e24', burg: '#6b1f2a',
    gold: '#b8924a', gold2: '#d4a85a', cream: '#f4ecd8', muted: '#b3a48c', dim: '#9c8d77',
  },
};
export const TERMS_DRAFT = true; // shows "Draft — awaiting committee review"

// The points a member reads before ticking "I accept".
export const TERMS_SUMMARY = [
  'Sessions are for a set date, so there is no 14-day cooling-off period. Cancel in time (section 4) and there is no charge; after that, or if you don’t turn up, the full charge stands.',
  'Prices come from the club’s price list and are shown before you book. You pay by card through a secure Stripe payment link.',
  'Polo carries a real risk of falls and injury. Wear an HPA-standard helmet with the chin strap fastened, and tell the coach about any medical condition.',
  'If you bring your own pony, you are responsible for its fitness, passport, vaccinations and insurance.',
  'We use your details to run bookings, as the privacy notice explains.',
];

export const TERMS_SECTIONS = [
  { h: '1. About these terms', p: [
    "1.1 These terms apply to every booking made with Tedworth Park Polo Club (“the club”, “we”, “us”) through the TPPC app, by email, by phone or in person. These cover chukkas, lessons, club sessions (such as Ladies Only and Instructional Chukkas), courses, clinics, instructional tournaments and pony hire.",
    "1.2 The club is Tedworth Park Polo Club, Tedworth Park, Tidworth, Wiltshire SP9 7AH. Part of the Armed Forces Equine Charity (Registered Charity No. 1184971). Phone 01980 846705 (office) or 07592 404102 (mobile); email info@tedworthparkpolo.com.",
    "1.3 The app is provided for the club by ACT Systems Ltd. Your booking contract is with TPPC, not with ACT Systems.",
    "1.4 You accept these terms when you first sign in to the app, and again each time you make a booking. If you book for someone else (section 2), you confirm they accept these terms too.",
    "1.5 Membership, tournament entry and the club’s rules for play have their own terms. If they conflict with these terms on a booking, these terms apply to that booking.",
    "1.6 If you are booking as a consumer, nothing in these terms affects your statutory rights.",
  ] },
  { h: '2. Bookings', p: [
    "2.1 A booking is confirmed when the app shows it as booked and we send a confirmation email. For chukkas, a confirmed booking is a place on that day’s list, not a promise of particular chukkas, team or ground: the admin makes the draw.",
    "2.2 Each chukka day closes for booking at the cut-off shown in the app. A day may also close early when it is full. A full session may offer a waiting list.",
    "2.3 Joining a waiting list costs nothing and is not a booking. If a place comes up, the club moves you onto the list, the booking is charged as normal and we let you know.",
    "2.4 A lesson is offered as individual, group or both. The first booking decides which it becomes. A group lesson goes ahead only once it has its minimum number of riders (section 5).",
    "2.5 You may book yourself, or a member of your team as recorded by the club. When you book for someone else, you confirm that you have their agreement, that the details you give are correct, and that they accept these terms. The charge goes on their account, not yours.",
    "2.6 Please give accurate details, including your handicap and mobile number. We may cancel a booking made with false details.",
    "2.7 We may refuse a booking for a good reason, such as safety, an unpaid balance or a breach of these terms. If we do, we will tell you why.",
  ] },
  { h: '3. Prices and payment', p: [
    "3.1 Prices are as per the TPPC current price list, which the app reflects before you confirm a booking. The price shown when you book is the price you pay.",
    "3.2 Military and veteran rates apply to players the club has recorded as military or veteran. The club may ask for proof.",
    "3.3 A membership that includes chukka fees covers chukka fees only. Pony hire and lessons are charged separately unless the rate card says otherwise.",
    "3.4 You pay by card through a secure payment link from Stripe, the club’s payment provider. The club never sees or stores your full card details. Payment is due before the session.",
    "3.5 Subsidies from an account managed by the club are applied to applicable sessions only, as per the membership terms of those organisations.",
    "3.6 We may suspend booking for anyone who has not paid for an earlier booking until it is paid.",
  ] },
  { h: '4. Cancelling or changing your booking', p: [
    "4.1 No 14-day cooling-off period. Chukkas, lessons, club sessions, courses and instructional tournaments are leisure services for a specific date. Under regulation 28(1)(b) of the Consumer Contracts (Information, Cancellation and Additional Charges) Regulations 2013, the 14-day right to cancel does not apply to them. Your rights to cancel are those in this section.",
    "4.2 You can cancel or change a booking in the app, from the “Amend or cancel” link in your confirmation email, or by contacting the club. If you cancel before [the day’s booking cut-off / 48 hours before the start], there is no charge: anything you have paid is refunded to the same card. [Committee to confirm the notice period.]",
    "4.3 If you cancel after that point, or do not turn up, the full charge stands without any applicable subsidies.",
    "4.4 A change of chukkas, pony or times that alters the price is re-priced. If you have already paid, the club will settle the difference with you.",
    "4.5 Under certain circumstances, the club may waive a late cancellation fee for illness, injury, or other emergency circumstance (either player or pony), or service duties. Tell us as soon as you can; we may ask for evidence.",
  ] },
  { h: '5. If the club cancels or changes a session', p: [
    "5.1 We may be required to cancel, shorten or move a session for weather, ground or arena conditions, the welfare of the ponies, safety, or too few riders. We will tell you as early as we can, either through the app notice function, via email or phone.",
    "5.2 A group lesson that does not reach its minimum number may be run as a smaller group at the same price, changed to an individual lesson at the individual rate, or cancelled. We will tell you which and ask you before charging you more.",
    "5.3 If we cancel, you may be eligible for a full refund of what you paid for that session, or a credit to use later.",
    "5.4 If a session is cut short after it has started, we may refund or credit the part not played. Exception: if the activity was stopped because of your own conduct (section 7).",
    "5.5 We are not responsible for travel, accommodation or other costs you incur because a session is cancelled for reasons outside our control. This does not affect your statutory rights if the cancellation was our fault.",
  ] },
  { h: '6. Fitness, eligibility and handicaps', p: [
    "6.1 You must be fit and well enough to ride and play, and not under the influence of alcohol or drugs. Inform the club coach before you ride about any medical condition, injury or pregnancy that could affect your safety.",
    "6.2 Riders under 18 need the agreement of a parent or guardian, who accepts these terms for them. Under-16s must be supervised by a responsible adult while at the club.",
    "6.3 Your handicap and stated ability must be accurate. Some sessions have a handicap limit, such as beginners-only instructional sessions. The club or coach may move you to a different chukka, session or pony, or cancel your activity, if deemed necessary for safety.",
    "6.4 You must follow the instructions of the club, coach, captain, umpires and yard staff.",
  ] },
  { h: '7. Safety, equipment and conduct', p: [
    "7.1 Play is under the Hurlingham Polo Association (HPA) rules and guidelines in force at the time, together with the club’s own rules.",
    "7.2 You must wear a polo helmet that meets the current HPA standard. The chin strap must be fastened whenever you are mounted. You also need suitable boots and all other safety equipment the HPA or club rules require for the session.",
    "7.3 Club staff, coaches, ponies, grooms, umpires, officials and other players must always be treated with respect. We may remove you from a session, or refuse future bookings, for dangerous riding, mistreating a pony, abusive behaviour or a serious breach of the rules. No refund is due in that case.",
    "7.4 Umpires’ decisions on the field are final.",
    "7.5 Dogs must be on a lead near the pony lines, the arena and the playing fields.",
  ] },
  { h: '8. Club ponies and your own pony', p: [
    "8.1 When you book you choose a club pony or your own pony; the price for the session is indicated based upon that choice. Club ponies are supplied through Polo Biz Ltd.",
    "8.2 The club decides which club pony you ride and may be required to change for pony welfare or your safety. Report any lameness, injury or tack problem straight away.",
    "8.3 When bringing your own pony, you are responsible for fitness, health, vaccinations, tack and behaviour. All ponies must have a valid passport and up-to-date vaccinations as per HPA rules and guidelines. We may refuse any pony that does not meet the required criteria.",
    "8.4 You are responsible for damage or injury your own pony causes, and you should hold third-party liability insurance for it (section 10).",
  ] },
  { h: '9. Risk and liability', p: [
    "9.1 Polo and riding carry an inherent risk of falls and serious injury, even when everyone takes proper care. Horses can behave unpredictably, and contact between ponies, players, sticks and balls is part of the game. By booking, you accept those inherent risks.",
    "9.2 We will provide our services with reasonable care and skill. We will keep the grounds, arena and facilities reasonably safe, as the Occupiers’ Liability Act 1957 requires.",
    "9.3 Nothing in these terms limits or excludes our liability for death or personal injury caused by our negligence, for fraud, or for anything else the law does not allow us to exclude. This includes your rights under the Consumer Rights Act 2015.",
    "9.4 Otherwise, we are not liable for loss that was not reasonably foreseeable when you booked, or for loss caused by your own breach of these terms or the rules. We are also not liable for loss or damage to personal belongings, vehicles or horseboxes, unless it was caused by our negligence.",
    "9.5 If you book for a business (not as a consumer), our total liability for any booking is limited to the price of that booking. This does not apply to the matters in 9.3.",
  ] },
  { h: '10. Insurance', p: [
    "10.1 We strongly recommend that every rider holds personal accident insurance that covers polo. The club’s insurance does not cover injuries that are nobody’s fault.",
    "10.2 Owners who bring their own pony must hold relevant liability insurance that covers the horse for polo at the club.",
    "10.3 HPA membership includes some cover; it is your responsibility to ensure that you have the correct HPA membership in place before taking part in any polo activity.",
  ] },
  { h: '11. Your information, photos and messages', p: [
    "11.1 We use your details for bookings, tournament entries, taking payment and keeping you safe. Card payments are processed by Stripe, which handles your card details under its own privacy policy. We do this under UK GDPR and the Data Protection Act 2018, as set out in the club’s privacy notice. Your name, handicap and team will be shown on the activity list and in the draw to other members.",
    "11.2 We send booking confirmations, changes, cancellations and reminders by email, and necessary news or updates via the app notice function. These are part of the service, not marketing. We send marketing only if you have agreed to it.",
    "11.3 The club may photograph or film sessions and events and use the pictures on its website and social media. If you do not consent, you must inform the club and we will not use any pictures in which you can be identified.",
  ] },
  { h: '12. Complaints, changes and law', p: [
    "12.1 If something goes wrong, email info@tedworthparkpolo.com. We will acknowledge your complaint within 5 working days and aim to resolve it within 14 days.",
    "12.2 We may be required to update these terms, for example when prices, rules or the law change. A change applies to bookings made after it is published. When important changes are made, you may be required to accept the new terms before your next booking.",
    "12.3 If a court finds part of these terms unenforceable, the rest of these terms still apply.",
    "12.4 These terms are governed by the law of England and Wales. You may bring a claim in the courts of England and Wales, or in your home courts if you live in Scotland or Northern Ireland.",
  ] },
];
