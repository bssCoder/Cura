import React from "react";
// import ThemeToggle from "../ThemeToggle";
import { useNavigate } from "react-router-dom";

export default function Home() {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-50 to-blue-100 dark:from-gray-900 dark:to-gray-800 transition-colors duration-300">
      {/* <ThemeToggle /> */}
      <main className="flex-1 flex flex-col items-center justify-center px-4 py-12">
        <div className="w-full bg-white/90 dark:bg-gray-900/90 rounded-2xl shadow-xl p-8 md:p-12 mb-8 text-gray-800 dark:text-gray-200 transition-colors duration-300">
          <h1 className="text-4xl md:text-5xl font-extrabold text-blue-700 dark:text-blue-400 mb-4 text-center">
            Cura: Your Medical Assistance Bot
          </h1>
          <p className="text-lg md:text-xl mb-6 text-center">
            Welcome to{" "}
            <span className="font-bold text-blue-600 dark:text-blue-400">
              Cura
            </span>{" "}
            — a state-of-the-art Medical Assistance Bot powered by{" "}
            <span className="font-semibold">
              RAG (Retrieval Augmented Generation)
            </span>
            . Get accurate, relevant, and timely information on a wide range of
            medical topics.
          </p>

          <div className="bg-blue-50 dark:bg-gray-800 rounded-lg p-4 mb-6">
            <h2 className="text-xl font-bold text-blue-800 dark:text-blue-300 mb-2">
              Key Features
            </h2>
            <ul className="list-disc list-inside space-y-1">
              <li>
                Combines retrieval of documents with generative AI for
                context-aware answers.
              </li>
              <li>Extensive medical knowledge base.</li>
              <li>
                Answers about symptoms, conditions, treatments, medications.
              </li>
              <li>
                Integrates with <span className="font-semibold">ChromaDB</span>{" "}
                and <span className="font-semibold">FAISS</span>.
              </li>
            </ul>
          </div>

          <div className="mb-6">
            <h2 className="text-xl font-bold text-blue-800 dark:text-blue-300 mb-2">
              Knowledge Base Highlights
            </h2>
            <ul className="list-disc list-inside space-y-1">
              <li>
                <span className="font-semibold">
                  Current Essentials of Medicine
                </span>{" "}
                (Tierney, Saint, Whooley)
              </li>
              <li>
                <span className="font-semibold">DSM-5</span> (APA)
              </li>
              <li>
                <span className="font-semibold">
                  Disease Handbook for Childcare Providers
                </span>{" "}
                (NH DHHS)
              </li>
              <li>
                <span className="font-semibold">
                  Essentials of Human Nutrition
                </span>{" "}
                (Mann & Truswell)
              </li>
              <li>
                <span className="font-semibold">Indian First Aid Manual</span>{" "}
                (IRCS)
              </li>
              <li>
                <span className="font-semibold">Gerontological Nursing</span>{" "}
                (Kristen L. Mauk)
              </li>
              <li>
                <span className="font-semibold">
                  Clinical Guidelines – Diagnosis and Treatment Manual
                </span>{" "}
                (Dubois et al.)
              </li>
              <li>
                <span className="font-semibold">
                  Pediatric Nursing and Health Care
                </span>{" "}
                (Ethiopia Public Health Initiative)
              </li>
            </ul>
          </div>

          <div className="flex justify-center mt-6">
            <button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-full shadow transition"
            onClick={() => { navigate("/chat")}}>
              Ask Cura
            </button>
          </div>
        </div>
      </main>
      <footer className="w-full text-center py-4 bg-white/80 dark:bg-gray-900 text-gray-600 dark:text-gray-400 text-sm border-t border-gray-200 dark:border-gray-700">
        Made with <span className="text-red-500">♥</span> by Bhawawni Shakar
        Sarswat
      </footer>
    </div>
  );
}
