// Vérification d'une demande de réservation. Fonctions pures, sans import :
// utilisées par la Server Action et testées par reservation.test.ts (npm test).

export type Valeurs = {
  arrivee: string; // AAAA-MM-JJ
  depart: string;
  personnes: string; // "1" à "5" ("5" = 5 ou plus)
  chambre: string; // slug, ou "" = pas de préférence
  nom: string;
  email: string;
  message: string;
  transfert: boolean;
};

export type Champ = Exclude<keyof Valeurs, "transfert">;
// Chaque code correspond à un message dans messages/xx.json : Contact.erreurs.<champ>.<code>
export type CodeErreur = "requis" | "passe" | "ordre" | "capacite" | "format" | "long";
export type Erreurs = Partial<Record<Champ, CodeErreur>>;

export const valeursVides: Valeurs = {
  arrivee: "",
  depart: "",
  personnes: "2",
  chambre: "",
  nom: "",
  email: "",
  message: "",
  transfert: false,
};

const champs: Champ[] = ["arrivee", "depart", "personnes", "chambre", "nom", "email", "message"];

export function lireFormulaire(formData: FormData): Valeurs {
  const v = { ...valeursVides, transfert: formData.get("transfert") === "on" };
  for (const c of champs) v[c] = String(formData.get(c) ?? "").trim();
  return v;
}

// Numéro de demande, ex. « DS-4K7Q ». Il relie une demande et ses modifications dans la boîte mail du riad.
// Alphabet sans 0/O ni 1/I, qu'on confond à la lecture.
const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
export const formatReference = /^DS-[A-HJ-NP-Z2-9]{4}$/;

export function nouvelleReference(): string {
  const tirage = crypto.getRandomValues(new Uint32Array(4));
  return "DS-" + Array.from(tirage, (n) => alphabet[n % alphabet.length]).join("");
}

const formatDate = /^\d{4}-\d{2}-\d{2}$/;
const formatEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// aujourdhui : "AAAA-MM-JJ" à Marrakech. capacites : { slug: nombre de personnes max }.
// Les dates au format AAAA-MM-JJ se comparent directement comme du texte.
export function valider(v: Valeurs, aujourdhui: string, capacites: Record<string, number>): Erreurs {
  const e: Erreurs = {};

  if (!formatDate.test(v.arrivee)) e.arrivee = "requis";
  else if (v.arrivee < aujourdhui) e.arrivee = "passe";

  if (!formatDate.test(v.depart)) e.depart = "requis";
  else if (formatDate.test(v.arrivee) && v.depart <= v.arrivee) e.depart = "ordre";

  if (v.chambre && !(v.chambre in capacites)) e.chambre = "format";

  if (!/^[1-5]$/.test(v.personnes)) e.personnes = "requis";
  else if (v.chambre in capacites && Number(v.personnes) > capacites[v.chambre]) e.personnes = "capacite";

  if (!v.nom) e.nom = "requis";
  else if (v.nom.length > 100) e.nom = "long";

  if (!v.email) e.email = "requis";
  else if (v.email.length > 200 || !formatEmail.test(v.email)) e.email = "format";

  if (v.message.length > 5000) e.message = "long";

  return e;
}
