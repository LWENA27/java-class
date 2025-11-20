/**
 * 🎓 LESSON: Language Context (React Context API)
 * 
 * WHAT IS CONTEXT?
 * Context is like a "global storage" that any component can access
 * Without passing props through every level
 * 
 * ANALOGY:
 * - Without Context: Like passing a message person-to-person
 * - With Context: Like a radio broadcast everyone can hear
 * 
 * WHY USE CONTEXT FOR LANGUAGE?
 * - Every component needs to know current language
 * - Don't want to pass language prop to every component
 * - One place to store and change language
 */

import { createContext, useContext, useState, useEffect } from 'react';
import { translations, getLanguages } from './translations';

// 🎓 LESSON: Create Context
// This creates the "radio broadcast system"
const LanguageContext = createContext();

// 🎓 LESSON: Language Provider Component
// This component wraps our app and provides language to all children
export function LanguageProvider({ children }) {
    // Get saved language from localStorage or default to English
    const [language, setLanguage] = useState(() => {
        const saved = localStorage.getItem('language');
        return saved || 'en';
    });

    // 🎓 LESSON: Save language when it changes
    useEffect(() => {
        localStorage.setItem('language', language);
    }, [language]);

    // 🎓 LESSON: Translation function (t)
    // This is the function components will use to get translated text
    const t = (key) => {
        return translations[language]?.[key] || translations.en[key] || key;
    };

    // 🎓 LESSON: Change language function
    const changeLanguage = (newLang) => {
        if (translations[newLang]) {
            setLanguage(newLang);
        }
    };

    // 🎓 LESSON: Value object
    // Everything we want to share with other components
    const value = {
        language,           // Current language code (en, sw, fr)
        changeLanguage,     // Function to change language
        t,                  // Translation function
        languages: getLanguages()  // Available languages
    };

    return (
        <LanguageContext.Provider value={value}>
            {children}
        </LanguageContext.Provider>
    );
}

// 🎓 LESSON: Custom Hook to use language
// This is a shortcut so components can easily access language
export function useLanguage() {
    const context = useContext(LanguageContext);
    if (!context) {
        throw new Error('useLanguage must be used within LanguageProvider');
    }
    return context;
}
