export const farms = [
  {
    id: 1,
    name: "Ekologiczne Warzywa Nowak",
    location: "Warszawa, Mokotów",
    badge: "Gospodarstwo lokalne",
    description:
      "Małe gospodarstwo nastawione na świeże, sezonowe warzywa i bezpośredni kontakt z klientem. Stawiamy na lokalność, prosty skład i wysoką jakość.",
    image:
      "https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&w=1400&q=80",
    coverImageUrl:
      "https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&w=1400&q=80",
    delivery: "Paczkomat / kurier",
    pickup: "Osobisty",
    style: "Bio / lokalnie",
    lat: 52.2297,
    lng: 21.0122,
    products: [
      {
        id: 1,
        name: "Marchew bio",
        price: "8 zł",
        description: "Świeża marchew z ekologicznej uprawy.",
        unit: "kg",
        quantityAvailable: 25,
      },
      {
        id: 2,
        name: "Sałata masłowa",
        price: "6 zł",
        description: "Delikatna, świeża sałata zbierana rano.",
        unit: "szt",
        quantityAvailable: 18,
      },
    ],
  },
  {
    id: 2,
    name: "Pasieka Kowalskich",
    location: "Warszawa, Wawer",
    badge: "Pasieka rodzinna",
    description:
      "Rodzinna pasieka oferująca naturalne miody i produkty pszczele. Dbamy o jakość, sezonowość i lokalny charakter produkcji.",
    image:
      "https://images.unsplash.com/photo-1471193945509-9ad0617afabf?auto=format&fit=crop&w=1400&q=80",
    coverImageUrl:
      "https://images.unsplash.com/photo-1471193945509-9ad0617afabf?auto=format&fit=crop&w=1400&q=80",
    delivery: "Kurier",
    pickup: "Osobisty",
    style: "Naturalne produkty",
    lat: 52.2058,
    lng: 21.0451,
    products: [
      {
        id: 1,
        name: "Miód lipowy",
        price: "22 zł",
        description: "Naturalny miód z lokalnej pasieki.",
        unit: "szt",
        quantityAvailable: 14,
      },
      {
        id: 2,
        name: "Miód wielokwiatowy",
        price: "20 zł",
        description: "Łagodny smak, idealny na co dzień.",
        unit: "szt",
        quantityAvailable: 20,
      },
    ],
  },
  {
    id: 3,
    name: "Wiejskie Jajka Mazury",
    location: "Warszawa, Żoliborz",
    badge: "Małe gospodarstwo",
    description:
      "Niewielkie gospodarstwo oferujące świeże jajka i proste produkty od zwierząt z wolnego wybiegu.",
    image:
      "https://images.unsplash.com/photo-1506976785307-8732e854ad03?auto=format&fit=crop&w=1400&q=80",
    coverImageUrl:
      "https://images.unsplash.com/photo-1506976785307-8732e854ad03?auto=format&fit=crop&w=1400&q=80",
    delivery: "Paczkomat",
    pickup: "Osobisty",
    style: "Wolny wybieg",
    lat: 52.2489,
    lng: 20.9725,
    products: [
      {
        id: 1,
        name: "Jajka z wolnego wybiegu",
        price: "14 zł",
        description: "Jajka od kur z małego gospodarstwa.",
        unit: "opak",
        quantityAvailable: 30,
      },
      {
        id: 2,
        name: "Jajka przepiórcze",
        price: "12 zł",
        description: "Delikatne i świeże, pakowane lokalnie.",
        unit: "opak",
        quantityAvailable: 16,
      },
    ],
  },
];