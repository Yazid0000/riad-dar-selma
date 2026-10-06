"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { demanderReservation, type EtatReservation } from "@/app/actions/reservation";
import { rooms } from "@/data/rooms";
import { Link } from "@/i18n/navigation";
import { valeursVides, type Champ, type Erreurs } from "@/lib/reservation";
import Icone from "../Icone";

const ordreChamps: Champ[] = ["arrivee", "depart", "personnes", "chambre", "nom", "email", "message"];
const obligatoires: Champ[] = ["arrivee", "depart", "personnes", "nom", "email"];

const styleChamp =
  "h-13 w-full rounded-none border border-line-strong bg-field px-3 text-base font-normal text-text focus-visible:outline-offset-0 aria-invalid:border-error";

export default function Formulaire({ chambreInitiale }: { chambreInitiale: string }) {
  const t = useTranslations("Contact");
  const tNav = useTranslations("Nav");
  const locale = useLocale();
  const [etat, action, enCours] = useActionState<EtatReservation, FormData>(demanderReservation, { statut: "vide" });
  // « Modifier ma demande » réaffiche le formulaire rempli, sans renvoyer.
  const [edition, setEdition] = useState(false);
  const titreConfirmation = useRef<HTMLHeadingElement>(null);

  const v = etat.statut === "vide" ? { ...valeursVides, chambre: chambreInitiale } : etat.valeurs;
  const erreurs: Erreurs = etat.statut === "erreurs" ? etat.erreurs : {};
  // Numéro de la demande déjà envoyée ("" tant que rien n'est parti) : renvoyé avec le formulaire
  // pour que le riad sache qu'une modification remplace la demande précédente.
  const reference = etat.statut === "vide" ? "" : etat.reference;

  // Après chaque réponse du serveur : focus sur le premier champ en erreur, ou sur la confirmation.
  useEffect(() => {
    if (etat.statut === "erreurs") {
      const premier = ordreChamps.find((c) => etat.erreurs[c]);
      if (premier) document.getElementById(premier)?.focus();
    }
    if (etat.statut === "envoye") titreConfirmation.current?.focus();
  }, [etat]);

  // Texte d'erreur d'un champ, ou undefined. La capacité a besoin du nom de la chambre et de son maximum.
  const erreur = (c: Champ) => {
    const code = erreurs[c];
    if (!code) return undefined;
    const chambre = rooms.find((r) => r.slug === v.chambre);
    return t(`erreurs.${c}.${code}`, { nom: chambre?.nom ?? "", max: chambre?.capacite ?? 0 });
  };

  // Attributs communs à chaque champ : lien avec son message d'erreur pour les lecteurs d'écran.
  const attributs = (c: Champ) => ({
    id: c,
    name: c,
    "aria-required": obligatoires.includes(c) || undefined,
    "aria-invalid": erreurs[c] ? true : undefined,
    "aria-describedby": erreurs[c] ? `erreur-${c}` : undefined,
  });

  const libelle = (c: Champ, contenu: React.ReactNode, place = "") => (
    <label htmlFor={c} className={`flex flex-col gap-2 text-sm font-semibold ${place}`}>
      {t(`champs.${c}`)}
      {contenu}
      {erreurs[c] && (
        <span id={`erreur-${c}`} className="text-[13px] font-medium text-error">
          {erreur(c)}
        </span>
      )}
    </label>
  );

  if (etat.statut === "envoye" && !edition) {
    const date = (d: string) =>
      new Intl.DateTimeFormat(locale, { day: "numeric", month: "long" }).format(new Date(`${d}T12:00:00`));
    const recap = [
      { cle: t("confirmation.numero"), valeur: etat.reference },
      {
        cle: t("confirmation.dates"),
        valeur: t("confirmation.datesValeur", { debut: date(v.arrivee), fin: date(v.depart) }),
      },
      { cle: t("confirmation.personnes"), valeur: v.personnes === "5" ? t("champs.personnesMax") : v.personnes },
      {
        cle: t("confirmation.chambre"),
        valeur: rooms.find((r) => r.slug === v.chambre)?.nom ?? t("champs.sansPreference"),
      },
      { cle: t("confirmation.transfert"), valeur: v.transfert ? t("confirmation.oui") : t("confirmation.non") },
    ];

    return (
      <div className="flex flex-col items-start gap-6 bg-bg-2 px-5 py-6 lg:p-12">
        <div aria-hidden="true" className="h-8 w-6 rounded-arch bg-accent" />
        <div className="flex flex-col gap-3">
          <h2 ref={titreConfirmation} tabIndex={-1} className="font-display text-h2-small font-medium outline-none">
            {t("confirmation.titre", { prenom: v.nom.split(" ")[0] })}
          </h2>
          <p className="text-muted">
            {t("confirmation.texte", { email: v.email })}
            {etat.modification && ` ${t("confirmation.remplace")}`}
          </p>
        </div>
        <dl className="grid self-stretch border-t border-line lg:grid-cols-2">
          {recap.map((r) => (
            <div key={r.cle} className="flex flex-col gap-0.5 border-b border-line py-4 pr-4">
              <dt className="text-[13px] text-muted">{r.cle}</dt>
              <dd className="font-semibold">{r.valeur}</dd>
            </div>
          ))}
        </dl>
        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            onClick={() => setEdition(true)}
            className="h-12 rounded-full border border-accent px-5.5 text-[15px] font-semibold text-accent hover:bg-accent/10"
          >
            {t("confirmation.modifier")}
          </button>
          <Link
            href="/"
            className="grid h-12 place-items-center px-5.5 text-[15px] font-semibold underline underline-offset-4"
          >
            {t("confirmation.accueil")}
          </Link>
        </div>
      </div>
    );
  }

  return (
    <form
      // Après une action, React remet le formulaire à ses valeurs par défaut, mais un <select> ne relit
      // defaultValue qu'à sa création. Changer la key à chaque réponse recrée le formulaire avec ce qui a été saisi.
      key={JSON.stringify(etat)}
      // noValidate : on garde nos propres messages d'erreur (traduits, sous les champs) au lieu des bulles du navigateur.
      noValidate
      action={(formData) => {
        setEdition(false);
        action(formData);
      }}
      className="grid grid-cols-2 content-start gap-x-gap gap-y-6 bg-bg-2 px-5 py-6 lg:p-12"
    >
      {(etat.statut === "erreurs" || etat.statut === "erreurEnvoi") && (
        <div role="alert" className="col-span-2 border-l-3 border-error bg-field px-4 py-3.5 text-sm">
          {etat.statut === "erreurs" ? t("bandeau") : t("erreurEnvoi")}
        </div>
      )}

      {libelle(
        "arrivee",
        <input type="date" defaultValue={v.arrivee} className={styleChamp} {...attributs("arrivee")} />,
      )}
      {libelle("depart", <input type="date" defaultValue={v.depart} className={styleChamp} {...attributs("depart")} />)}
      {libelle(
        "personnes",
        <select defaultValue={v.personnes} className={styleChamp} {...attributs("personnes")}>
          {["1", "2", "3", "4", "5"].map((n) => (
            <option key={n} value={n}>
              {n === "5" ? t("champs.personnesMax") : n}
            </option>
          ))}
        </select>,
      )}
      {libelle(
        "chambre",
        <select defaultValue={v.chambre} className={styleChamp} {...attributs("chambre")}>
          <option value="">{t("champs.sansPreference")}</option>
          {rooms.map((r) => (
            <option key={r.slug} value={r.slug}>
              {r.nom}
            </option>
          ))}
        </select>,
      )}
      {libelle(
        "nom",
        <input type="text" autoComplete="name" defaultValue={v.nom} className={styleChamp} {...attributs("nom")} />,
        "col-span-2 lg:col-span-1",
      )}
      {libelle(
        "email",
        <input
          type="email"
          autoComplete="email"
          defaultValue={v.email}
          className={styleChamp}
          {...attributs("email")}
        />,
        "col-span-2 lg:col-span-1",
      )}
      {libelle(
        "message",
        <textarea
          rows={4}
          defaultValue={v.message}
          className={`${styleChamp} h-auto resize-y py-3.5`}
          {...attributs("message")}
        />,
        "col-span-2",
      )}

      {/* Vraie case à cocher (accessible au clavier), cachée visuellement et remplacée par le carré dessiné à côté. */}
      <label className="col-span-2 grid cursor-pointer grid-cols-[24px_minmax(0,1fr)] items-start gap-3.5 border border-line-strong bg-field p-4.5 hover:border-text">
        <input type="checkbox" name="transfert" defaultChecked={v.transfert} className="peer sr-only" />
        <span
          aria-hidden="true"
          className="grid size-5.5 place-items-center border-[1.5px] border-text text-transparent peer-checked:border-accent peer-checked:bg-accent peer-checked:text-on-accent peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-accent"
        >
          <Icone nom="check" className="size-4" />
        </span>
        <span className="flex flex-col gap-0.5">
          <strong className="text-[15px] font-semibold">{t("transfertTitre")}</strong>
          <span className="text-sm text-muted">{t("transfertTexte")}</span>
        </span>
      </label>

      <input type="hidden" name="reference" value={reference} />

      {/* Piège à robots, invisible pour les humains */}
      <input name="site" tabIndex={-1} autoComplete="off" aria-hidden="true" className="hidden" />

      <div className="col-span-2 mt-2 flex flex-col justify-between gap-4 lg:flex-row lg:items-center">
        <span className="text-[13px] text-muted">{t("confidentialite")}</span>
        <button
          type="submit"
          disabled={enCours}
          className="bouton min-h-14 max-w-full shrink-0 px-7.5 py-3 text-center whitespace-normal! disabled:opacity-60"
        >
          {enCours ? t("envoi") : tNav("reserver")}
        </button>
      </div>
    </form>
  );
}
