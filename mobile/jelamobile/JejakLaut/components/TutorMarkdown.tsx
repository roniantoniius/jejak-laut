import React, { useState } from 'react';
import { Modal, View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';

type TutorMarkdownModalProps = {
  visible: boolean;
  onClose: () => void;
};

type Step = {
  id: string;
  title: string;
  details: string;
};

const steps: Step[] = [
  {
    id: '1',
    title: 'Heading',
    details:`Gunakan simbol **#** untuk membuat heading. Jumlah simbol **#** menentukan tingkat heading:
# Heading 1 (besar dan utama)
## Heading 2 (sub-level)
### Heading 3 (lebih kecil)\n\nPastikan menambahkan spasi setelah simbol **#** agar Markdown mengenali format heading.`,
  },
  {
    id: '2',
    title: 'Italic dan Bold',
    details: 'Gunakan * atau _ untuk membuat teks *italic*, dan ** atau __ untuk membuat teks **bold**. Anda juga dapat menggabungkannya untuk **_kombinasi italic dan bold_**:\n- *Italic*: *teks* atau _teks_\n- **Bold**: **teks** atau __teks__\n- ***Italic dan Bold***: ***teks*** atau ___teks___.',
  },
  {
    id: '3',
    title: 'List',
    details: 'Markdown mendukung dua jenis daftar:\n- **List Tidak Terurut**: Gunakan - atau *\n  Contoh:\n  - Item 1\n  - Item 2\n  * Item 3\n\n- **List Terurut**: Gunakan angka diikuti titik (.)\n  Contoh:\n  1. Item 1\n  2. Item 2\n  3. Item 3\n\nAnda juga dapat membuat daftar bertingkat dengan menambahkan indentasi.',
  },
  {
    id: '4',
    title: 'Link',
    details: 'Gunakan format **[teks](url)** untuk membuat link:\nContoh:\n- [Google](https://www.google.com)\n- [Markdown Guide](https://www.markdownguide.org)\n\nUntuk menambahkan tooltip, gunakan format berikut:\n[teks](url "tooltip").',
  },
  {
    id: '5',
    title: 'Tabel',
    details: 'Gunakan simbol **|** untuk membuat tabel. Setiap baris terdiri dari kolom-kolom yang dipisahkan oleh **|**. Gunakan tanda **-** di bawah header untuk membuat garis:\nContoh:\n| Header 1  | Header 2  | Header 3  |\n|-----------|-----------|-----------|\n| Data 1    | Data 2    | Data 3    |\n| Data 4    | Data 5    | Data 6    |\n\nAnda dapat menyesuaikan perataan kolom:\n- **Kiri**: :---\n- **Kanan**: ---:\n- **Tengah**: :---:',
  },
  {
    id: '6',
    title: 'Code Block',
    details: 'Gunakan backtick **`** untuk membuat kode inline atau blok kode:\n- **Kode Inline**: Gunakan satu backtick:\n  Contoh: `console.log("Hello World");`\n\n- **Blok Kode**: Gunakan tiga backtick di baris atas dan bawah:\n\n\```javascript\nfunction hello() {\n  console.log("Hello World");\n}\n\```\n\nAnda juga dapat menambahkan nama bahasa setelah tiga backtick untuk highlighting.',
  },
  {
    id: '7',
    title: 'Blockquote',
    details: 'Gunakan simbol **>** di awal baris untuk membuat blockquote. Gunakan lebih dari satu **>** untuk nested blockquote:\nContoh:\n> Ini adalah blockquote.\n>> Ini adalah nested blockquote.',
  },
  {
    id: '8',
    title: 'Garis Horizontal',
    details: 'Gunakan tiga atau lebih tanda **-**, **_**, atau ***** untuk membuat garis horizontal:\nContoh:\n---\n___\n***\n\nIni sering digunakan untuk memisahkan bagian dalam dokumen.',
  },
  {
    id: '9',
    title: 'Gambar',
    details: 'Gunakan format **![teks alternatif](url)** untuk menambahkan gambar:\nContoh:\n![Logo](https://via.placeholder.com/150)\n\nAnda juga dapat menambahkan tooltip:\n![Logo](https://via.placeholder.com/150 "Tooltip")',
  },
];


export const TutorMarkdownModal: React.FC<TutorMarkdownModalProps> = ({ visible, onClose }) => {
  const [expanded, setExpanded] = useState<string | null>(null);

  const toggleAccordion = (id: string) => {
    setExpanded(expanded === id ? null : id);
  };

  return (
    <Modal visible={visible} transparent={true} animationType="slide">
      <View style={styles.modalBackground}>
        <View style={styles.modalContent}>
          <Text style={styles.title}>Apa Itu Markdown?</Text>
          <Text style={styles.subtitle}>Markdown adalah format teks yang ringan serta terstruktur secara efisien dalam segi pemformatan.</Text>
          <FlatList
            data={steps}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <View style={styles.accordionContainer}>
                <TouchableOpacity
                  onPress={() => toggleAccordion(item.id)}
                  style={styles.accordionHeader}
                >
                  <Text style={styles.stepTitle}>{item.title}</Text>
                </TouchableOpacity>
                {expanded === item.id && (
                  <View style={styles.accordionContent}>
                    <Text style={styles.detailsText}>{item.details}</Text>
                  </View>
                )}
              </View>
            )}
          />
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Text style={styles.closeButtonText}>Tutup</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalBackground: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    margin: 20,
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 10,
    maxHeight: '80%',
  },
  title: {
    fontSize: 22,
    fontFamily: 'Montserrat-Bold',
    color: '#052844',
    marginBottom: 10,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    fontFamily: 'Montserrat-Medium',
    color: '#052844',
    marginBottom: 10,
    textAlign: 'center',
  },
  accordionContainer: {
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    overflow: 'hidden',
  },
  accordionHeader: {
    padding: 10,
    backgroundColor: '#f9f9f9',
  },
  accordionContent: {
    padding: 10,
    backgroundColor: '#fff',
  },
  stepTitle: {
    fontSize: 16,
    fontFamily: 'Montserrat-Bold',
    color: '#052844',
  },
  detailsText: {
    fontSize: 14,
    fontFamily: 'Montserrat',
    color: '#333',
  },
  closeButton: {
    backgroundColor: '#052844',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  closeButtonText: {
    fontFamily: 'Montserrat-Bold',
    color: 'white',
    fontSize: 16,
  },
});