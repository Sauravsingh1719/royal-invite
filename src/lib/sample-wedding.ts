export const sampleDesignOneWedding = {
  templateId: "design-one" as const,
  bride: {
    name: "[Your Bride Name]",
    parents: "D/o Smt. Sangeeta & Shri Manoj Singh [Bride's Parents Description]",
    image: "/bride.jpg",
    traits: [
      "💖 Ghar Ki Ladli Beti [Trait 1]",
      "🤪 Fun Loving & Clumsy [Trait 2]",
      "🗣️ Talkative & Cheerful [Trait 3]",
    ],
  },
  groom: {
    name: "[Your Groom Name]",
    parents: "S/o Smt. Rekha & Shri Arvind Rai [Groom's Parents Description]",
    image: "/groom.jpg",
    traits: [
      "👔 Ghar Ka Ladla Beta [Trait 1]",
      "🧘‍♂️ Responsible & Calm [Trait 2]",
      "📅 Always Well-Planned [Trait 3]",
    ],
  },
  couple: {
    image: "/couple.jpg",
    quote: "Different hearts. Different worlds. One beautiful destiny. [Your Custom Tagline / Love Quote]",
  },
  event: {
    dateText: "Thursday, 11th December 2026 [Your Wedding Date]",
    timeText: "11:00 AM Onwards [Your Ceremony Time]",
    isoDate: new Date("2026-12-11T11:00:00.000Z"),
    venueTitle: "The Bliss Motel & Resort [Your Venue Name]",
    venueAddress: "GT Karnal Road, New Delhi, 110036 [Your Full Venue Address]",
    googleMapsUrl: "https://maps.google.com",
  },
  defaultFamilySignOff: "Singh & Rai [Your Family Sign-Off]",
};

export const sampleDesignTwoWedding = {
  templateId: "design-two" as const,
  bride: {
    name: "[Your Bride Name]",
    parents: "D/o Smt. Sangeeta & Shri Manoj Singh [Bride's Parents]",
    image: "/bride.jpg",
  },
  groom: {
    name: "[Your Groom Name]",
    parents: "S/o Smt. Rekha & Shri Arvind Rai [Groom's Parents]",
    image: "/groom.jpg",
  },
  couple: {
    image: "/couple.jpg",
  },
  event: {
    dateText: "11th December 2026 [Your Wedding Date]",
    timeText: "11:00 AM [Your Auspicious Time]",
    isoDate: new Date("2026-12-11T11:00:00.000Z"),
    venueTitle: "The Bliss Motel & Resort [Your Palace/Resort]",
    venueAddress: "New Delhi, 110036 [City & Pincode]",
    googleMapsUrl: "https://maps.google.com",
  },
  defaultFamilySignOff: "Singh [Your Family Name]",
};