"use server";

import { Resend } from "resend";
import { rooms } from "@/data/rooms";
import {
  formatReference,
  lireFormulaire,
  nouvelleReference,
  valider,
  type Erreurs,
  type Valeurs,
} from "@/lib/reservation";

// Les quatre états possibles du formulaire. « valeurs » permet de réafficher ce que la personne a saisi.
// « reference » : numéro de la demande déjà envoyée que l'on modifie ("" pour une nouvelle demande).
export type EtatReservation =
  | { statut: "vide" }
  | { statut: "erreurs"; valeurs: Valeurs; erreurs: Erreurs; reference: string }
  | { statut: "erreurEnvoi"; valeurs: Valeurs; reference: string }
  | { statut: "envoye"; valeurs: Valeurs; reference: string; modification: boolean };

const capacites = Object.fromEntries(rooms.map((r) => [r.slug, r.capacite]));

// Server Action : ce code s'exécute uniquement sur le serveur.
// La clé API n'est donc jamais envoyée au navigateur, et la vérification ne peut pas être contournée.
export async function demanderReservation(_etat: EtatReservation, formData: FormData): Promise<EtatReservation> {
  const valeurs = lireFormulaire(formData);

  // Le numéro vient du navigateur (champ caché) : on ne garde que s'il a exactement le bon format.
  // Présent = la personne modifie une demande déjà envoyée.
  const precedente = String(formData.get("reference") ?? "");
  const modification = formatReference.test(precedente);
  const reference = modification ? precedente : "";

  // Piège à robots : ce champ est caché aux humains. S'il est rempli, c'est un spam :
  // on affiche la confirmation sans rien envoyer.
  if (formData.get("site"))
    return { statut: "envoye", valeurs, reference: reference || nouvelleReference(), modification };

  // La date du jour à Marrakech (format AAAA-MM-JJ), quel que soit le fuseau du serveur.
  const aujourdhui = new Intl.DateTimeFormat("en-CA", { timeZone: "Africa/Casablanca" }).format(new Date());
  const erreurs = valider(valeurs, aujourdhui, capacites);
  if (Object.keys(erreurs).length > 0) return { statut: "erreurs", valeurs, erreurs, reference };

  const cle = process.env.RESEND_API_KEY;
  const destinataire = process.env.CONTACT_EMAIL;
  if (!cle || !destinataire) {
    console.error("RESEND_API_KEY ou CONTACT_EMAIL manquant dans les variables d'environnement");
    return { statut: "erreurEnvoi", valeurs, reference };
  }

  const v = valeurs;
  const numero = reference || nouvelleReference();
  const chambre = rooms.find((r) => r.slug === v.chambre)?.nom ?? "Pas de préférence";
  // Les retours à la ligne sont retirés du nom pour qu'on ne puisse pas glisser d'en-têtes dans le sujet.
  const resume = `${v.nom.replace(/\s+/g, " ")}, du ${v.arrivee} au ${v.depart}`;
  // E-mail destiné au riad : il reste en français, quelle que soit la langue du visiteur.
  // Un e-mail envoyé ne se modifie pas : une modification part comme un nouvel e-mail, marqué comme tel,
  // avec le même numéro (on retrouve les deux en cherchant le numéro dans la boîte mail).
  const resend = new Resend(cle);
  const { error } = await resend.emails.send({
    from: "Riad Dar Selma <onboarding@resend.dev>",
    to: destinataire,
    replyTo: v.email,
    subject: modification
      ? `Modification de la demande ${numero} (remplace la précédente) : ${resume}`
      : `Demande de réservation ${numero} : ${resume}`,
    text: [
      modification
        ? `MODIFICATION de la demande ${numero} : cette version remplace la précédente.`
        : `Demande ${numero}`,
      "",
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
    return { statut: "erreurEnvoi", valeurs, reference };
  }
  return { statut: "envoye", valeurs, reference: numero, modification };
}
