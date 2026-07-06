// ==UserScript==
// @name         Super Form Filler Multi-Form (Explicit VAT Match)
// @namespace    http://tampermonkey.net/
// @version      1.9.1
// @description  Riconoscimento P.IVA tramite whitelist esplicita di parole chiave (openapivat, companyvat, vatnumber, ecc.) con e senza separatori.
// @author       Dev Peer
// @match        *://*/*
// @grant        none
// ==UserScript==

(function () {
    "use strict";

    const nomiM = [
        "Mario",
        "Luigi",
        "Giovanni",
        "Francesco",
        "Alessandro",
        "Roberto",
        "Stefano",
        "Marco",
        "Giuseppe",
        "Antonio",
        "Davide",
        "Luca",
        "Vincenzo",
        "Emanuele",
        "Andrea",
    ];
    const nomiF = [
        "Anna",
        "Giulia",
        "Francesca",
        "Elena",
        "Chiara",
        "Laura",
        "Sara",
        "Martina",
        "Silvia",
        "Federica",
        "Giorgia",
        "Alice",
        "Sofia",
        "Valentina",
        "Roberta",
    ];
    const cognomi = [
        "Rossi",
        "Bianchi",
        "Verdi",
        "Ferrari",
        "Russo",
        "Esposito",
        "Romano",
        "Gallo",
        "Costa",
        "Fontana",
        "Lombardi",
        "Moretti",
        "Ricci",
        "Marini",
        "Bruno",
        "Barbieri",
    ];

    const vie = [
        "Via Roma",
        "Via Milano",
        "Via Garibaldi",
        "Via Dante",
        "Corso Vittorio Emanuele",
        "Via Mazzini",
        "Via Cavour",
        "Via Verdi",
        "Via Kennedy",
        "Piazza Italia",
        "Via Aldo Moro",
        "Via Torino",
    ];

    const comuni = [
        { nome: "Roma", codice: "H501", prov: "RM", cap: "00100" },
        { nome: "Milano", codice: "F205", prov: "MI", cap: "20100" },
        { nome: "Torino", codice: "L219", prov: "TO", cap: "10100" },
        { nome: "Palermo", codice: "G273", prov: "PA", cap: "90100" },
        { nome: "Napoli", codice: "F839", prov: "NA", cap: "80100" },
        { nome: "Firenze", codice: "D612", prov: "FI", cap: "50100" },
        { nome: "Bologna", codice: "A944", prov: "BO", cap: "40100" },
        { nome: "Genova", codice: "D969", prov: "GE", cap: "16100" },
        { nome: "Venezia", codice: "L736", prov: "VE", cap: "30100" },
        { nome: "Bari", codice: "A662", prov: "BA", cap: "70100" },
    ];

    const mesiInfo = [
        { lett: "A", num: "01" },
        { lett: "B", num: "02" },
        { lett: "C", num: "03" },
        { lett: "D", num: "04" },
        { lett: "E", num: "05" },
        { lett: "H", num: "06" },
        { lett: "L", num: "07" },
        { lett: "M", num: "08" },
        { lett: "P", num: "09" },
        { lett: "R", num: "10" },
        { lett: "S", num: "11" },
        { lett: "T", num: "12" },
    ];

    const dispari = {
        0: 1,
        1: 0,
        2: 5,
        3: 7,
        4: 9,
        5: 13,
        6: 15,
        7: 17,
        8: 19,
        9: 21,
        A: 1,
        B: 0,
        C: 5,
        D: 7,
        E: 9,
        F: 13,
        G: 15,
        H: 17,
        I: 19,
        J: 21,
        K: 2,
        L: 4,
        M: 18,
        N: 20,
        O: 11,
        P: 3,
        Q: 6,
        R: 8,
        S: 12,
        T: 14,
        U: 16,
        V: 10,
        W: 22,
        X: 25,
        Y: 24,
        Z: 23,
    };
    const pari = {
        0: 0,
        1: 1,
        2: 2,
        3: 3,
        4: 4,
        5: 5,
        6: 6,
        7: 7,
        8: 8,
        9: 9,
        A: 0,
        B: 1,
        C: 2,
        D: 3,
        E: 4,
        F: 5,
        G: 6,
        H: 7,
        I: 8,
        J: 9,
        K: 10,
        L: 11,
        M: 12,
        N: 13,
        O: 14,
        P: 15,
        Q: 16,
        R: 17,
        S: 18,
        T: 19,
        U: 20,
        V: 21,
        W: 22,
        X: 23,
        Y: 24,
        Z: 25,
    };
    const cinMap = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

    function calcolaCodiceCognome(cognome) {
        let c = cognome.toUpperCase().replace(/[^A-Z]/g, "");
        let consonanti = c.replace(/[AEIOU]/g, "");
        let vocali = c.replace(/[^AEIOU]/g, "");
        return (consonanti + vocali + "XXX").substring(0, 3);
    }

    function calcolaCodiceNome(nome) {
        let n = nome.toUpperCase().replace(/[^A-Z]/g, "");
        let consonanti = n.replace(/[AEIOU]/g, "");
        let vocali = n.replace(/[^AEIOU]/g, "");
        if (consonanti.length >= 4)
            return consonanti[0] + consonanti[2] + consonanti[3];
        return (consonanti + vocali + "XXX").substring(0, 3);
    }

    function calcolaCIN(cf15) {
        let somma = 0;
        for (let i = 0; i < 15; i++) {
            const char = cf15[i].toUpperCase();
            if ((i + 1) % 2 !== 0) somma += dispari[char] || 0;
            else somma += pari[char] || 0;
        }
        return cinMap[somma % 26];
    }

    function calcolaLastDigitPIVA(piva10) {
        let x = 0;
        let y = 0;
        for (let i = 0; i < 10; i++) {
            let digit = parseInt(piva10[i], 10);
            if ((i + 1) % 2 !== 0) {
                x += digit;
            } else {
                let temp = digit * 2;
                if (temp > 9) temp -= 9;
                y += temp;
            }
        }
        let t = (x + y) % 10;
        return ((10 - t) % 10).toString();
    }

    function generaPIVAValida() {
        let piva = "";
        for (let i = 0; i < 7; i++)
            piva += Math.floor(Math.random() * 10).toString();
        let prov = Math.floor(Math.random() * 100 + 1)
            .toString()
            .padStart(3, "0");
        piva += prov;
        piva += calcolaLastDigitPIVA(piva);
        return piva;
    }

    function generaCellulareItaliano() {
        const prefissi = [
            "331",
            "333",
            "334",
            "335",
            "338",
            "339",
            "340",
            "342",
            "345",
            "346",
            "347",
            "348",
            "349",
            "320",
            "324",
            "327",
            "328",
            "329",
            "366",
            "380",
            "388",
            "389",
        ];
        let prefisso = prefissi[Math.floor(Math.random() * prefissi.length)];
        let corpo = "";
        for (let i = 0; i < 7; i++)
            corpo += Math.floor(Math.random() * 10).toString();
        return prefisso + corpo;
    }

    function generaProfiloCasuale() {
        const sesso = Math.random() > 0.5 ? "M" : "F";
        const nome =
            sesso === "M"
                ? nomiM[Math.floor(Math.random() * nomiM.length)]
                : nomiF[Math.floor(Math.random() * nomiF.length)];
        const cognome = cognomi[Math.floor(Math.random() * cognomi.length)];
        const comune = comuni[Math.floor(Math.random() * comuni.length)];
        const meseObj = mesiInfo[Math.floor(Math.random() * mesiInfo.length)];

        const giornoVal = Math.floor(Math.random() * 28 + 1);
        const annoNum = Math.floor(Math.random() * 30 + 70);

        let cfBase = "";
        cfBase += calcolaCodiceCognome(cognome);
        cfBase += calcolaCodiceNome(nome);
        cfBase += annoNum.toString();
        cfBase += meseObj.lett;

        let g = giornoVal;
        if (sesso === "F") g += 40;
        cfBase += g.toString().padStart(2, "0");
        cfBase += comune.codice;
        cfBase += calcolaCIN(cfBase);

        const randId = Math.floor(Math.random() * 900 + 100);
        const viaScelta = vie[Math.floor(Math.random() * vie.length)];
        const civico = Math.floor(Math.random() * 120 + 1);

        return {
            nome,
            cognome,
            sesso,
            cf: cfBase,
            piva: generaPIVAValida(),
            cellulare: generaCellulareItaliano(),
            email: `${nome.toLowerCase()}.${cognome.toLowerCase()}${randId}@example.com`,
            dataStandard: `${giornoVal.toString().padStart(2, "0")}/${meseObj.num}/19${annoNum}`,
            dataInputDate: `19${annoNum}-${meseObj.num}-${giornoVal.toString().padStart(2, "0")}`,
            comuneNome: comune.nome,
            provincia: comune.prov,
            cap: comune.cap,
            indirizzo: `${viaScelta} ${civico}`,
        };
    }

    function isVisible(el) {
        if (!el) return false;
        const style = window.getComputedStyle(el);
        return (
            !!(
                el.offsetWidth ||
                el.offsetHeight ||
                el.getClientRects().length
            ) &&
            style.display !== "none" &&
            style.visibility !== "hidden" &&
            style.opacity !== "0"
        );
    }

    function impostaValore(el, valore) {
        if (!el || el.value) return;
        if (el.tagName === "SELECT") {
            const options = Array.from(el.options);
            const targetOpt = options.find(
                (opt) =>
                    opt.value.toLowerCase() === valore.toLowerCase() ||
                    opt.text.toLowerCase().includes(valore.toLowerCase()) ||
                    opt.text.toLowerCase() === valore.toLowerCase(),
            );
            if (targetOpt) el.value = targetOpt.value;
        } else {
            el.value = valore;
        }
        el.dispatchEvent(new Event("input", { bubbles: true }));
        el.dispatchEvent(new Event("change", { bubbles: true }));
    }

    document.addEventListener("dblclick", function (e) {
        const target = e.target;

        if (
            (target.tagName === "INPUT" || target.tagName === "SELECT") &&
            isVisible(target)
        ) {
            const ambito = target.closest("form") || document;
            const elementi = ambito.querySelectorAll("input, select");
            const profiliAssegnati = {};

            elementi.forEach((el) => {
                if (!isVisible(el)) return;

                const nameStr = (el.name || "").toLowerCase();
                const idStr = (el.id || "").toLowerCase();
                const desc =
                    `${nameStr} ${idStr} ${el.placeholder || ""}`.toLowerCase();
                const type = (el.type || "").toLowerCase();

                const parentText = (
                    el.closest(".form-group, td, label, div")?.innerText || ""
                ).toLowerCase();

                let groupKey = null;

                const dataRow =
                    el.getAttribute("data-row") ||
                    el.getAttribute("data-index") ||
                    el.getAttribute("data-id");
                if (dataRow) groupKey = "idx_" + dataRow;

                if (!groupKey) {
                    const matchIndice =
                        `${nameStr} ${idStr}`.match(/\[(\d+)\]/) ||
                        `${nameStr} ${idStr}`.match(/_(\d+)/) ||
                        `${nameStr} ${idStr}`.match(/-(\d+)/);
                    if (matchIndice) groupKey = "idx_" + matchIndice[1];
                }

                if (!groupKey) {
                    const parentContainer = el.closest(
                        'tr, fieldset, .formpart, [class*="block"], [class*="section"]',
                    );
                    if (
                        parentContainer &&
                        !parentContainer.classList.contains("row") &&
                        !parentContainer.classList.contains("form-row")
                    ) {
                        if (!parentContainer.dataset.fillerGroupId) {
                            parentContainer.dataset.fillerGroupId =
                                "gen_" + Math.floor(Math.random() * 100000);
                        }
                        groupKey = parentContainer.dataset.fillerGroupId;
                    }
                }

                if (!groupKey) groupKey = "default";

                if (!profiliAssegnati[groupKey]) {
                    profiliAssegnati[groupKey] = generaProfiloCasuale();
                }

                const p = profiliAssegnati[groupKey];

                // --- ALBERO DI LOGICHE CON PRIORITÀ AGGIORNATA (v1.9.1) ---

                // 1. CAP
                if (
                    desc.includes("cap") ||
                    desc.includes("zip") ||
                    parentText.includes("cap")
                ) {
                    impostaValore(el, p.cap);
                }
                // 2. Provincia
                else if (
                    desc.includes("provincia") ||
                    desc.includes("province") ||
                    nameStr === "prov" ||
                    idStr === "prov" ||
                    parentText.includes("provincia")
                ) {
                    impostaValore(el, p.provincia);
                }
                // 3. Indirizzo di residenza
                else if (
                    (desc.includes("indirizzo") ||
                        desc.includes("address") ||
                        desc.includes("via") ||
                        parentText.includes("indirizzo")) &&
                    !desc.includes("email") &&
                    !desc.includes("mail") &&
                    !parentText.includes("email") &&
                    !parentText.includes("e-mail")
                ) {
                    impostaValore(el, p.indirizzo);
                }
                // 4. Partita IVA (Vince nei campi ibridi + Whitelist esplicita per le varianti VAT)
                else if (
                    desc.includes("piva") ||
                    desc.includes("partitaiva") ||
                    desc.includes("partita_iva") ||
                    desc.includes("partita-iva") ||
                    desc.includes("p.iva") ||
                    parentText.includes("partita iva") ||
                    parentText.includes("p.iva") ||
                    /\bvat\b|openapivat|companyvat|vatnumber|vatnum|openapi[-_]vat|company[-_]vat|vat[-_]num(?:ber)?/.test(
                        desc,
                    )
                ) {
                    impostaValore(el, p.piva);
                }
                // 5. Codice Fiscale
                else if (
                    parentText.includes("codice fiscale") ||
                    parentText.includes("codice_fiscale") ||
                    desc.includes("codicefiscale") ||
                    desc.includes("codice_fiscale") ||
                    nameStr === "cf" ||
                    idStr === "cf" ||
                    el.maxLength === 16
                ) {
                    impostaValore(el, p.cf);
                }
                // 6. Telefono / Cellulare
                else if (
                    type === "tel" ||
                    desc.includes("tel") ||
                    desc.includes("cell") ||
                    desc.includes("phone") ||
                    desc.includes("mob") ||
                    parentText.includes("tel") ||
                    parentText.includes("telefono")
                ) {
                    impostaValore(el, p.cellulare);
                }
                // 7. Cognome
                else if (
                    desc.includes("cognome") ||
                    desc.includes("surname") ||
                    desc.includes("last") ||
                    parentText.includes("cognome")
                ) {
                    impostaValore(el, p.cognome);
                }
                // 8. Nome
                else if (
                    (desc.includes("nome") ||
                        desc.includes("name") ||
                        desc.includes("first") ||
                        parentText.includes("nome")) &&
                    !desc.includes("cognome") &&
                    !parentText.includes("cognome") &&
                    !desc.includes("user")
                ) {
                    impostaValore(el, p.nome);
                }
                // 9. Email
                else if (
                    type === "email" ||
                    desc.includes("email") ||
                    desc.includes("mail") ||
                    parentText.includes("email") ||
                    parentText.includes("e-mail")
                ) {
                    impostaValore(el, p.email);
                }
                // 10. Data di Nascita
                else if (
                    desc.includes("nascita") ||
                    desc.includes("birth") ||
                    type === "date" ||
                    parentText.includes("data")
                ) {
                    impostaValore(
                        el,
                        type === "date" ? p.dataInputDate : p.dataStandard,
                    );
                }
                // 11. Sesso / Genere
                else if (
                    desc.includes("sesso") ||
                    desc.includes("genere") ||
                    desc.includes("gender") ||
                    parentText.includes("genere")
                ) {
                    impostaValore(el, p.sesso);
                }
                // 12. Città / Comune
                else if (
                    desc.includes("comune") ||
                    desc.includes("citta") ||
                    desc.includes("city") ||
                    desc.includes("birthplace") ||
                    parentText.includes("comune") ||
                    parentText.includes("città")
                ) {
                    impostaValore(el, p.comuneNome);
                }
            });
        }
    });
})();
