import type { NomIcone } from "@/components/Icone";

// Les six chambres. Les noms sont des noms propres, identiques en français et en anglais.
// Les textes traduits (accroche, équipements…) sont dans messages/, sous « Chambre ».
// \u00a0 = espace insécable (le nombre et son unité restent sur la même ligne).
// photo = identifiant Unsplash (la partie après « photo- » dans l'adresse de l'image).

// cle → libellé dans messages (Chambre.equipements.cle), icone → Icone.tsx
const equipements: { cle: string; icone: NomIcone }[] = [
  { cle: "linge", icone: "bed" },
  { cle: "clim", icone: "ac_unit" },
  { cle: "wifi", icone: "wifi" },
  { cle: "douche", icone: "shower" },
  { cle: "produits", icone: "spa" },
  { cle: "petitDejeuner", icone: "coffee" },
];

// Bande de photos sous la photo principale. La maquette montre les mêmes pour chaque chambre ;
// pour en donner d'autres à une chambre, remplace « photos: photosCommunes » par sa propre liste.
// cle → légende dans messages (Chambre.photos.cle), largeur = [mobile, desktop] en px.
const photosCommunes = [
  { cle: "teteDeLit", photo: "1681949290093-9e91718f26d3", largeur: [280, 520] },
  { cle: "salleDEau", photo: "1659614536075-2cf8f82cf9db", largeur: [200, 340] },
  { cle: "fenetre", photo: "1750859537685-24f071b0ae8f", largeur: [300, 620] },
  { cle: "petitDejeuner", photo: "1786799445379-56a35a6d323d", largeur: [220, 400] },
];

// Format des cartes dans les rangées de chambres (accueil et « Les autres chambres »).
// [mobile, desktop] en px ; « haut » décale la carte vers le bas pour le rythme irrégulier.
export type FormatCarte = { largeur: number[]; hauteur: number[]; haut: number[]; arche: boolean };

export type Room = {
  slug: string;
  nom: string;
  capacite: number;
  surface: number; // en m²
  lit: string;
  prix: number; // prix de départ par nuit, en euros
  prixPour?: number;
  photo: string;
  photos: { cle: string; photo: string; largeur: number[] }[];
  equipements: { cle: string; icone: NomIcone }[];
  carte: FormatCarte;
};

export const rooms: Room[] = [
  {
    slug: "safran",
    nom: "Safran",
    capacite: 2,
    surface: 22,
    lit: "160\u00a0cm",
    prix: 140,
    photo: "1675621926040-b514257d5941",
    photos: photosCommunes,
    equipements,
    carte: { largeur: [260, 440], hauteur: [340, 580], haut: [0, 0], arche: true },
  },
  {
    slug: "jasmin",
    nom: "Jasmin",
    capacite: 2,
    surface: 20,
    lit: "160\u00a0cm",
    prix: 150,
    photo: "1583845112203-29329902332e",
    photos: photosCommunes,
    equipements,
    carte: { largeur: [200, 320], hauteur: [250, 420], haut: [40, 120], arche: false },
  },
  {
    slug: "cedre",
    nom: "Cèdre",
    capacite: 2,
    surface: 24,
    lit: "180\u00a0cm",
    prix: 160,
    photo: "1636536621353-2a64208dc574",
    photos: photosCommunes,
    equipements,
    carte: { largeur: [240, 400], hauteur: [300, 520], haut: [12, 40], arche: true },
  },
  {
    slug: "neroli",
    nom: "Néroli",
    capacite: 3,
    surface: 28,
    lit: "180 + 90\u00a0cm",
    prix: 180,
    photo: "1592229505726-ca121723b8ef",
    photos: photosCommunes,
    equipements,
    carte: { largeur: [210, 300], hauteur: [260, 400], haut: [48, 160], arche: false },
  },
  {
    slug: "indigo",
    nom: "Indigo",
    capacite: 2,
    surface: 22,
    lit: "180\u00a0cm",
    prix: 170,
    photo: "1698752160561-ec7faca92b9f",
    photos: photosCommunes,
    equipements,
    carte: { largeur: [230, 360], hauteur: [290, 480], haut: [20, 80], arche: true },
  },
  {
    slug: "suite-atlas",
    nom: "Suite Atlas",
    capacite: 4,
    surface: 48,
    lit: "180 + 2×90\u00a0cm",
    prix: 260,
    // Le prix de la suite s'entend pour 4 personnes (« par nuit pour 4 »).
    prixPour: 4,
    photo: "1782939355626-8df602c595fb",
    photos: photosCommunes,
    equipements: [...equipements, { cle: "terrasse", icone: "deck" }, { cle: "baignoire", icone: "bathtub" }],
    carte: { largeur: [300, 560], hauteur: [380, 640], haut: [0, 0], arche: true },
  },
];
