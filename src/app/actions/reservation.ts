"use server";

import { Resend } from "resend";
import { rooms } from "@/data/rooms";
import { lireFormulaire, valider, type Erreurs, type Valeurs } from "@/lib/reservation";

// Les quatre états possibles du formulaire. « valeurs » permet de réafficher ce que la personne a saisi.
export type EtatReservation =
  | { statut: "vide" }
  | { statut: "erreurs"; valeurs: Valeurs; erreurs: Erreurs }
  | { statut: "erreurEnvoi"; valeurs: Valeurs }
  | { statut: "envoye"; valeurs: Valeurs };

const capacites = Object.fromEntries(rooms.map((r) => [r.slug, r.capacite]));

// Server Action : ce code s'exécute uniquement sur le serveur.
// La clé API n'est donc jamais envoyée au navigateur, et la vérification ne peut pas être contournée.
export async function demanderReservation(_etat: EtatReservation, formData: FormData): Promise<EtatReservation> {
  const valeurs = lireFormulaire(formData);

  // Piège à robots : ce champ est caché aux humains. S'il est rempli, c'est un spam :
  // on affiche la confirmation sans rien envoyer.
  if (formData.get("site")) return { statut: "envoye", valeurs };

  // La date du jour à Marrakech (format AAAA-MM-JJ), quel que soit le fuseau du serveur.
  const aujourdhui = new Intl.DateTimeFormat("en-CA", { timeZone: "Africa/Casablanca" }).format(new Date());
  const erreurs = valider(valeurs, aujourdhui, capacites);
  if (Object.keys(erreurs).length > 0) return { statut: "erreurs", valeurs, erreurs };

  const cle = process.env.RESEND_API_KEY;
  const destinataire = process.env.CONTACT_EMAIL;
  if (!cle || !destinataire) {
    console.error("RESEND_API_KEY ou CONTACT_EMAIL manquant dans les variables d'environnement");
    return { statut: "erreurEnvoi", valeurs };
  }

  const v = valeurs;
  const chambre = rooms.find((r) => r.slug === v.chambre)?.nom ?? "Pas de préférence";
  // E-mail destiné au riad : il reste en français, quelle que soit la langue du visiteur.
  const resend = new Resend(cle);
  const { error } = await resend.emails.send({
    from: "Riad Dar Selma <onboarding@resend.dev>",
    to: destinataire,
    replyTo: v.email,
    // Les retours à la ligne sont retirés du sujet pour qu'on ne puisse pas y glisser d'en-têtes.
    subject: `Demande de réservation : ${v.nom.replace(/\s+/g, " ")}, du ${v.arrivee} au ${v.depart}`,
    text: [
      `Nom : ${v.nom}`,
      `E-mail : ${v.email}`,
      `Arrivée : ${v.arrivee}`,
      `Départ : ${v.depart}`,
      `Personnes : ${v.personnes === "5" ? "5 ou plus" : v.personnes}`,
      `Chambre : ${chambre}`,
      `Transfert aéroport : ${v.transfert ? "oui" : "non"}`,
      "",
      v.message || "(pas de message)",
    ].join("\n"),
  });

  if (error) {
    console.error("Erreur Resend :", error);
    return { statut: "erreurEnvoi", valeurs };
  }
  return { statut: "envoye", valeurs };
}
