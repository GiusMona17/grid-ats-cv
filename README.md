# Curriculum Vitae Personalizzabile

Un generatore di CV moderno, responsivo e personalizzabile che permette di creare un curriculum professionale con sezioni personalizzabili, layout flessibile e funzionalità di esportazione in PDF.

## ✨ Caratteristiche

- **Design Responsivo**: Funziona perfettamente su mobile, tablet e desktop
- **Sezioni Personalizzabili**: Aggiungi, rimuovi e riordina le sezioni secondo le tue esigenze
- **Modalità Editing Sicura**: Sistema di autenticazione per proteggere le modifiche
- **Drag & Drop**: Riordina facilmente le sezioni trascinandole
- **Esportazione PDF**: Genera una versione PDF professionale del tuo CV
- **Temi Multipli**: Scegli tra vari temi di colore
- **Salvataggio Automatico**: I tuoi dati vengono salvati automaticamente nel browser
- **ATS Friendly**: Struttura ottimizzata per i sistemi di tracking dei candidati

## 🚀 Come Iniziare

### Prerequisiti

- Node.js 16+
- Bun o npm

### Installazione

```bash
# Clona il repository
git clone https://github.com/your-username/cv-personalizzabile.git

# Cambia directory
cd cv-personalizzabile

# Installa le dipendenze
bun install
# oppure
npm install

# Avvia il server di sviluppo
bun run dev
# oppure
npm run dev
```

### Build per Produzione

```bash
# Genera la build di produzione
bun run build
# oppure
npm run build

# Anteprima della build di produzione
bun run preview
# oppure
npm run preview
```

## 🔐 Autenticazione

Per accedere alla modalità editing e modificare il curriculum, è necessario effettuare il login.

### Credenziali Demo

- **Username**: `admin`
- **Password**: `cv2024`

> ⚠️ **Importante**: In un ambiente di produzione, sostituisci queste credenziali con un sistema di autenticazione sicuro.

## 📖 Come Usare

### Visualizzazione del CV

1. Visita il sito - il curriculum sarà immediatamente visibile
2. Usa il pulsante "Download PDF" per scaricare una versione PDF

### Modalità Editing

1. Clicca su "Edit Mode" nella barra superiore
2. Inserisci le credenziali di accesso
3. Una volta autenticato, potrai:
   - Modificare titolo e sottotitolo cliccandoci sopra
   - Aggiungere nuove sezioni con "Add Section"
   - Modificare il contenuto delle sezioni esistenti
   - Trascinare le sezioni per riordinarle
   - Eliminare sezioni non necessarie
   - Cambiare il tema del CV

### Funzionalità Disponibili

#### Sezioni Supportate
- **Profilo**: Informazioni personali, foto, app create, interessi
- **Esperienza**: Lavori precedenti con descrizioni dettagliate
- **Competenze**: Categorie di skills organizzate per tipologia
- **Formazione**: Percorso educativo e certificazioni
- **Interessi**: Hobby e interessi personali
- **App**: Applicazioni o progetti sviluppati
- **Sezione Personalizzata**: Contenuto completamente personalizzabile

#### Personalizzazione
- **Temi**: Light, Dark, Blue, Teal, Purple, Red
- **Layout**: Drag & drop per riorganizzare le sezioni
- **Contenuto**: Editor integrato per ogni sezione

#### Esportazione
- **PDF High-Quality**: Mantiene formattazione e colori
- **Nome File Automatico**: Basato sul titolo del CV
- **Compatibilità ATS**: Struttura ottimizzata per i sistemi di parsing

## 🔧 Configurazione

### Personalizzazione delle Credenziali

Per modificare le credenziali di accesso, edita il file `src/components/LoginModal.tsx`:

```typescript
const ADMIN_CREDENTIALS = {
  username: 'tuo-username',
  password: 'tua-password'
};
```

### Durata della Sessione

La sessione di editing dura 2 ore. Per modificare questa durata, edita il file `src/services/authService.ts`:

```typescript
// Durata sessione in millisecondi (default: 2 ore)
const SESSION_DURATION = 2 * 60 * 60 * 1000;
```

## 🎨 Struttura del Progetto

```
src/
├── components/          # Componenti React
│   ├── CVSection.tsx       # Sezione singola del CV
│   ├── CVSectionWrapper.tsx # Wrapper per sezioni
│   ├── LoginModal.tsx      # Modal di autenticazione
│   ├── PDFExportButton.tsx # Bottone esportazione PDF
│   └── ...
├── services/           # Servizi e utilità
│   ├── cvService.ts       # Gestione dati CV
│   └── authService.ts     # Gestione autenticazione
├── types.ts           # Definizioni TypeScript
└── App.tsx           # Componente principale
```

## 🛠 Tecnologie Utilizzate

- **React 18** con TypeScript
- **Tailwind CSS** per gli stili
- **Vite** come build tool
- **html2canvas & jsPDF** per l'esportazione PDF
- **Bun** come package manager (opzionale)

## 🚀 Deployment

Il progetto è configurato per il deployment su Netlify con le seguenti impostazioni:

- **Build Command**: `bun run build`
- **Publish Directory**: `dist`
- **Redirects**: Configurato per SPA

## 📝 Sviluppo

### Script Disponibili

```bash
# Sviluppo
bun run dev

# Build
bun run build

# Linting e formattazione
bun run lint
bun run format

# Anteprima
bun run preview
```

### Aggiunta di Nuove Sezioni

Per aggiungere un nuovo tipo di sezione:

1. Aggiungi il tipo in `src/types.ts`
2. Crea il caso nel `createDefaultContent` in `src/services/cvService.ts`
3. Aggiungi il rendering in `src/components/CVSection.tsx`
4. Aggiorna `AddSectionButton.tsx` con la nuova opzione

## 🤝 Contribuire

1. Fai un fork del progetto
2. Crea un branch per la tua feature (`git checkout -b feature/AmazingFeature`)
3. Commit le modifiche (`git commit -m 'Add some AmazingFeature'`)
4. Push al branch (`git push origin feature/AmazingFeature`)
5. Apri una Pull Request

## 📄 Licenza

Questo progetto è sotto licenza MIT. Vedi il file `LICENSE` per maggiori dettagli.

## 🐛 Segnalazione Bug

Se trovi un bug, apri una issue nel repository GitHub includendo:
- Descrizione del problema
- Passi per riprodurlo
- Comportamento atteso vs comportamento attuale
- Screenshot se applicabili

## 💡 Suggerimenti

Per suggerimenti di nuove funzionalità o miglioramenti, apri una issue con il tag "enhancement".

---

**Nota**: Questo è un progetto dimostrativo. Per un uso in produzione, implementa un sistema di autenticazione robusto e sicuro.