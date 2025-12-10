import { useState } from 'react';
import { Badge } from './components/ui/badge';
import { TranslationCard } from './components/TranslationCard';
import { StandardCard } from './components/StandardCard';
import { AnnotationSection } from './components/AnnotationSection';

// Data structure for display
interface TranslationRecord {
  id: string;
  english_text: string;
  textbook_grade: string;
  target_grade: string;
  target_age: string;
  domain: string;
  subject: string;
  spanish_translation: string;
  valid_translation: boolean;
  validation_reason: string;
  tokens: number;
  attempts: number;
  success: boolean;
  final_status: string;
  flesh_grade: number;
  fernandez_huerta_score: number;
  fernandez_huerta_grade: number;
  fernandez_huerta_age: string;
}

interface Standard {
  id: string;
  description: string;
}

interface GroupedSample {
  id: string;
  english_text: string;
  textbook_grade: string;
  domain: string;
  subject: string;
  translations: TranslationRecord[];
  standards: Standard[];
}

// Demo data
const demoSample: GroupedSample = {
  id: "17cbcbbd",
  english_text: "Golgi Apparatus: As proteins leave the endoplasmic reticulum, they move to a structure that looks like the flattened sacs and tubes shown in Figures 3 and 4. This structure can be thought of as a cell's warehouse. The Golgi apparatus receives proteins and other newly formed materials from the ER, packages them, and distributes them to other parts of the cell or to the outside of the cell.",
  textbook_grade: "Middle School",
  domain: "Life Science",
  subject: "Looking Inside Cells",
  translations: [
    {
      id: "17cbcbbd",
      english_text: "Golgi Apparatus: As proteins leave the endoplasmic reticulum, they move to a structure that looks like the flattened sacs and tubes shown in Figures 3 and 4. This structure can be thought of as a cell's warehouse. The Golgi apparatus receives proteins and other newly formed materials from the ER, packages them, and distributes them to other parts of the cell or to the outside of the cell.",
      textbook_grade: "Middle School",
      target_grade: "5th",
      target_age: "10-11",
      domain: "Life Science",
      subject: "Looking Inside Cells",
      spanish_translation: "El aparato de Golgi: Las proteínas salen de la red interna de la célula y van a un espacio dentro de la célula con bolsas y tubos planos, como se muestra en las Figuras 3 y 4. Este espacio es como un almacén. El aparato de Golgi recibe proteínas y otras cosas nuevas, las organiza y las lleva a otras partes de la célula o fuera de ella.",
      valid_translation: true,
      validation_reason: "",
      tokens: 8988,
      attempts: 4,
      success: true,
      final_status: "SUCCESS_EXACT",
      flesh_grade: 10.60294117647059,
      fernandez_huerta_score: 84.01411764705881,
      fernandez_huerta_grade: 5,
      fernandez_huerta_age: "10-11"
    },
    {
      id: "17cbcbbd",
      english_text: "Golgi Apparatus: As proteins leave the endoplasmic reticulum, they move to a structure that looks like the flattened sacs and tubes shown in Figures 3 and 4. This structure can be thought of as a cell's warehouse. The Golgi apparatus receives proteins and other newly formed materials from the ER, packages them, and distributes them to other parts of the cell or to the outside of the cell.",
      textbook_grade: "Middle School",
      target_grade: "6th",
      target_age: "11-12",
      domain: "Life Science",
      subject: "Looking Inside Cells",
      spanish_translation: "El aparato de Golgi es como un sistema de entrega dentro de la célula. Recibe proteínas y las organiza para enviarlas a donde la célula las necesite.",
      valid_translation: true,
      validation_reason: "",
      tokens: 10370,
      attempts: 5,
      success: true,
      final_status: "SUCCESS_EXACT",
      flesh_grade: 10.60294117647059,
      fernandez_huerta_score: 73.07000000000001,
      fernandez_huerta_grade: 6,
      fernandez_huerta_age: "11-12"
    },
    {
      id: "17cbcbbd",
      english_text: "Golgi Apparatus: As proteins leave the endoplasmic reticulum, they move to a structure that looks like the flattened sacs and tubes shown in Figures 3 and 4. This structure can be thought of as a cell's warehouse. The Golgi apparatus receives proteins and other newly formed materials from the ER, packages them, and distributes them to other parts of the cell or to the outside of the cell.",
      textbook_grade: "Middle School",
      target_grade: "7th-8th",
      target_age: "12-14",
      domain: "Life Science",
      subject: "Looking Inside Cells",
      spanish_translation: "Aparato de Golgi: A medida que las proteínas abandonan el retículo endoplásmico, se mueven a una estructura que se asemeja a las bolsas y tubos achatados mostrados en las Figuras 3 y 4. Esta estructura se puede pensar como una especie de almacén de la célula. El aparato de Golgi recibe proteínas y otros materiales recién formados del retículo endoplásmico, los empaqueta y los distribuye a otras partes de la célula o al exterior de la célula.",
      valid_translation: true,
      validation_reason: "",
      tokens: 1307,
      attempts: 1,
      success: true,
      final_status: "SUCCESS_EXACT",
      flesh_grade: 10.60294117647059,
      fernandez_huerta_score: 62.997662337662334,
      fernandez_huerta_grade: 7.5,
      fernandez_huerta_age: "12-14"
    }
  ],
  standards: [
    {
      id: "MS-LS1-2",
      description: "Develop and use a model to describe the function of a cell as a whole and ways the parts of cells contribute to the function. [Clarification Statement: Emphasis is on the cell functioning as a whole system and the primary role of identified parts of the cell, specifically the nucleus, chloroplasts, mitochondria, cell membrane, and cell wall.] [Assessment Boundary: Assessment of organelle structure/function relationships is limited to the cell wall and cell membrane.]"
    },
    {
      id: "MS-LS1-3",
      description: "Use argument supported by evidence for how the body is a system of interacting subsystems composed of groups of cells. [Clarification Statement: Emphasis is on the conceptual understanding that cells form tissues and tissues form organs specialized for particular body functions.] [Assessment Boundary: Assessment does not include the mechanism of one body system independent of others.]"
    },
    {
      id: "6-8.LS1.A",
      description: "All living things are made up of cells, which is the smallest unit that can be said to be alive. An organism may consist of one single cell (unicellular) or many different numbers and types of cells (multicellular). Within cells, special structures are responsible for particular functions, and the cell membrane forms the boundary that controls what enters and leaves the cell."
    }
  ]
};

export default function App() {
  const [darkMode] = useState(false);

  return (
    <div className={darkMode ? 'dark' : ''}>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
        {/* Header Bar */}
        <header className="border-b bg-white dark:bg-gray-800 sticky top-0 z-10 shadow-sm">
          <div className="max-w-[1600px] mx-auto px-6 py-4">
            <div className="flex items-center justify-between gap-4 flex-wrap">
              <h1 className="text-gray-900 dark:text-white">Translation Review — Annotation Tool</h1>

              <div className="flex items-center gap-3 flex-wrap">
                <Badge variant="secondary">
                  Demo Sample
                </Badge>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="max-w-[1600px] mx-auto px-6 py-6">

          {/* Translation Cards */}
          <div className="mb-6">
            <h2 className="text-lg mb-3 text-gray-900 dark:text-white">Translations</h2>
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
              {demoSample.translations.map((translation, index) => (
                <TranslationCard key={index} translation={translation} index={index} />
              ))}
            </div>
          </div>

          {/* Standards Section */}
          <div className="mb-6">
            <h2 className="text-lg mb-3 text-gray-900 dark:text-white">AI Standards</h2>
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
              {demoSample.standards.map((standard, index) => (
                <StandardCard key={index} standard={standard} />
              ))}
            </div>
          </div>

          {/* Annotation Section */}
          <AnnotationSection
            translations={demoSample.translations}
            standards={demoSample.standards}
          />
        </main>
      </div>
    </div>
  );
}
