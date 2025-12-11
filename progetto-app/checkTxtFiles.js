// checkTxtFiles.mjs
// 🔹 Esegui con: node checkTxtFiles.mjs in PowerShell

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Percorso base del progetto
const baseDir = 'C:\\padel-app\\progetto-app';

// Funzione ricorsiva per trovare tutti i file .txt
function getAllTxtFiles(dir, fileList = []) {
  const files = fs.readdirSync(dir);

  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);

    if (stat.isDirectory()) {
      getAllTxtFiles(filePath, fileList);
    } else if (file.toLowerCase().endsWith('.txt')) {
      fileList.push(filePath);
    }
  });

  return fileList;
}

// Controllo esistenza e dimensione
function checkTxtFiles() {
  console.log(`🔍 Scansione file .txt in: ${baseDir}\n`);

  if (!fs.existsSync(baseDir)) {
    console.error('❌ Percorso non trovato! Controlla baseDir.');
    return;
  }

  const txtFiles = getAllTxtFiles(baseDir);

  if (txtFiles.length === 0) {
    console.log('⚠️ Nessun file .txt trovato.');
    return;
  }

  console.log(`✅ Trovati ${txtFiles.length} file .txt:\n`);
  txtFiles.forEach(file => {
    const stats = fs.statSync(file);
    const size = stats.size;
    console.log(`- ${file} | Dimensione: ${size} byte ${size === 0 ? '⚠️ VUOTO' : ''}`);
  });
}

// Avvio
checkTxtFiles();
