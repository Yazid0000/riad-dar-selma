// Lancer avec : npm test
import assert from "node:assert/strict";
import { test } from "node:test";
import { formatReference, nouvelleReference, valeursVides, valider, type Valeurs } from "./reservation.ts";

const aujourdhui = "2026-10-06";
const capacites = { safran: 2, "suite-atlas": 4 };
const ok: Valeurs = {
  ...valeursVides,
  arrivee: "2026-11-12",
  depart: "2026-11-16",
  personnes: "4",
  chambre: "suite-atlas",
  nom: "Claire Martin",
  email: "claire@exemple.fr",
};

test("une demande complète passe", () => {
  assert.deepEqual(valider(ok, aujourdhui, capacites), {});
});

test("formulaire vide : les champs obligatoires sont signalés", () => {
  assert.deepEqual(valider(valeursVides, aujourdhui, capacites), {
    arrivee: "requis",
    depart: "requis",
    nom: "requis",
    email: "requis",
  });
});

test("l'exemple d'erreurs de la maquette", () => {
  const v = {
    ...ok,
    arrivee: "2026-11-12",
    depart: "2026-11-10",
    personnes: "3",
    chambre: "safran",
    nom: "",
    email: "claire@",
  };
  assert.deepEqual(valider(v, aujourdhui, capacites), {
    depart: "ordre",
    personnes: "capacite",
    nom: "requis",
    email: "format",
  });
});

test("départ le jour de l'arrivée refusé, arrivée passée refusée", () => {
  assert.equal(valider({ ...ok, depart: ok.arrivee }, aujourdhui, capacites).depart, "ordre");
  assert.equal(valider({ ...ok, arrivee: "2026-10-05" }, aujourdhui, capacites).arrivee, "passe");
  assert.equal(valider({ ...ok, arrivee: aujourdhui }, aujourdhui, capacites).arrivee, undefined);
});

test("valeurs trafiquées refusées", () => {
  assert.equal(valider({ ...ok, chambre: "palais" }, aujourdhui, capacites).chambre, "format");
  assert.equal(valider({ ...ok, personnes: "12" }, aujourdhui, capacites).personnes, "requis");
  assert.equal(valider({ ...ok, nom: "x".repeat(101) }, aujourdhui, capacites).nom, "long");
});

test("numéro de demande : format DS-XXXX, valeurs trafiquées refusées", () => {
  for (let i = 0; i < 200; i++) assert.match(nouvelleReference(), formatReference);
  for (const faux of ["", "DS-4K7", "DS-4K7Q5", "ds-4k7q", "DS-4O7Q", "DS-4K7Q\nBcc: x@y.z"]) {
    assert.equal(formatReference.test(faux), false, faux);
  }
});
