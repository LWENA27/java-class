/**
 * 🎓 LESSON: Multi-Language Translations
 * 
 * WHAT IS i18n?
 * "i18n" means "internationalization" (i + 18 letters + n)
 * It's how we make apps work in multiple languages
 * 
 * HOW IT WORKS:
 * 1. Store all text in translation files (not hardcoded)
 * 2. User selects language (English, Swahili, etc.)
 * 3. App shows text in selected language
 * 
 * EXAMPLE:
 * Instead of: <h1>Menu Items</h1>
 * We use: <h1>{t('menuItems')}</h1>
 * Then t('menuItems') returns "Menu Items" or "Vyakula" based on language
 */

export const translations = {
    // 🇬🇧 ENGLISH
    en: {
        // Menu Management Page
        menuItems: 'Menu Items',
        menuSubtitle: 'Manage your restaurant menu items',
        addMenuItem: 'Add Menu Item',
        editMenuItem: 'Edit Menu Item',
        
        // Table Headers
        id: 'ID',
        name: 'Name',
        description: 'Description',
        price: 'Price',
        category: 'Category',
        stock: 'Stock',
        status: 'Status',
        actions: 'Actions',
        
        // Form Labels
        nameLabel: 'Name',
        descriptionLabel: 'Description',
        priceLabel: 'Price (TSH)',
        categoryLabel: 'Category',
        stockLabel: 'Stock Quantity',
        photoLabel: 'Photo',
        availableLabel: 'Available for ordering',
        
        // Categories
        mainDishes: 'Main Dishes',
        sides: 'Sides',
        drinks: 'Drinks',
        desserts: 'Desserts',
        selectCategory: 'Select category',
        
        // Buttons
        cancel: 'Cancel',
        save: 'Save',
        addItem: 'Add Item',
        updateItem: 'Update Item',
        edit: 'Edit',
        copy: 'Copy',
        delete: 'Delete',
        
        // Status
        available: 'Available',
        notAvailable: 'Not Available',
        
        // Messages
        loading: 'Loading menu items...',
        noData: 'No menu items found. Click "Add Menu Item" to create one.',
        itemAdded: 'Menu item added successfully!',
        itemUpdated: 'Menu item updated successfully!',
        itemDeleted: 'Menu item deleted successfully!',
        deleteConfirm: 'Are you sure you want to delete this item?',
        
        // Errors
        nameRequired: 'Name is required',
        priceRequired: 'Price must be greater than 0',
        categoryRequired: 'Category is required',
        fileTooLarge: 'File size must be less than 2MB',
        invalidFileType: 'Please upload an image file (JPEG, PNG)',
        
        // Placeholders
        namePlaceholder: 'e.g., Ugali & Fish',
        descriptionPlaceholder: 'Describe your dish...',
        pricePlaceholder: 'e.g., 15000',
        stockPlaceholder: 'e.g., 50',
        
        // Other
        fileHint: 'Max 2MB, JPEG or PNG only',
        required: '*',
        
        // Sidebar
        dashboard: 'Dashboard',
        manageMenu: 'Manage Menu',
        todaysMenu: "Today's Menu",
        orders: 'Orders',
        customerFeedback: 'Customer Feedback',
        reports: 'Reports',
        qrCodes: 'QR Codes',
        settings: 'Settings',
        logout: 'Logout',
        
        // Daily Menu Page
        dailyMenu: 'Daily Menu',
        dailyMenuSubtitle: 'Manage menu items available for specific dates',
        selectDate: 'Select Date',
        viewMenu: 'View Menu',
        addToDailyMenu: 'Add to Daily Menu',
        menuItem: 'Menu Item',
        selectItem: 'Select item',
        specialPrice: 'Special Price (TSH)',
        specialPriceOptional: 'Special Price (optional)',
        originalPrice: 'Original Price',
        photo: 'Photo',
        noDailyMenuItems: 'No items in the daily menu for this date.',
        itemAddedToDailyMenu: 'Item added to daily menu successfully!',
        itemUpdatedInDailyMenu: 'Daily menu item updated successfully!',
        itemRemovedFromDailyMenu: 'Item removed from daily menu successfully!',
        removeDailyMenuConfirm: 'Are you sure you want to remove this item from the daily menu?',
        date: 'Date'
    },
    
    // 🇹🇿 SWAHILI
    sw: {
        // Menu Management Page
        menuItems: 'Vyakula',
        menuSubtitle: 'Simamia vyakula vya mkahawa wako',
        addMenuItem: 'Ongeza Chakula',
        editMenuItem: 'Badilisha Chakula',
        
        // Table Headers
        id: 'Nambari',
        name: 'Jina',
        description: 'Maelezo',
        price: 'Bei',
        category: 'Aina',
        stock: 'Idadi',
        status: 'Hali',
        actions: 'Vitendo',
        
        // Form Labels
        nameLabel: 'Jina',
        descriptionLabel: 'Maelezo',
        priceLabel: 'Bei (TSH)',
        categoryLabel: 'Aina ya Chakula',
        stockLabel: 'Idadi ya Stock',
        photoLabel: 'Picha',
        availableLabel: 'Inapatikana kwa maagizo',
        
        // Categories
        mainDishes: 'Vyakula Vikuu',
        sides: 'Vyakula Vidogo',
        drinks: 'Vinywaji',
        desserts: 'Vitafunwa',
        selectCategory: 'Chagua aina',
        
        // Buttons
        cancel: 'Ghairi',
        save: 'Hifadhi',
        addItem: 'Ongeza Chakula',
        updateItem: 'Badilisha Chakula',
        edit: 'Hariri',
        copy: 'Nakili',
        delete: 'Futa',
        
        // Status
        available: 'Inapatikana',
        notAvailable: 'Haipatikani',
        
        // Messages
        loading: 'Inapakia vyakula...',
        noData: 'Hakuna chakula. Bonyeza "Ongeza Chakula" kutengeneza kipya.',
        itemAdded: 'Chakula kimeongezwa!',
        itemUpdated: 'Chakula kimebadilishwa!',
        itemDeleted: 'Chakula kimefutwa!',
        deleteConfirm: 'Una uhakika unataka kufuta chakula hiki?',
        
        // Errors
        nameRequired: 'Jina linahitajika',
        priceRequired: 'Bei lazima iwe zaidi ya 0',
        categoryRequired: 'Aina ya chakula inahitajika',
        fileTooLarge: 'Ukubwa wa faili lazima usiwe zaidi ya 2MB',
        invalidFileType: 'Tafadhali pakia picha (JPEG, PNG)',
        
        // Placeholders
        namePlaceholder: 'mfano, Ugali na Samaki',
        descriptionPlaceholder: 'Eleza chakula chako...',
        pricePlaceholder: 'mfano, 15000',
        stockPlaceholder: 'mfano, 50',
        
        // Other
        fileHint: 'Upeo wa 2MB, JPEG au PNG tu',
        required: '*',
        
        // Sidebar
        dashboard: 'Dashibodi',
        manageMenu: 'Simamia Menyu',
        todaysMenu: 'Menyu ya Leo',
        orders: 'Maagizo',
        customerFeedback: 'Maoni ya Wateja',
        reports: 'Ripoti',
        qrCodes: 'Misimbo ya QR',
        settings: 'Mipangilio',
        logout: 'Toka',
        
        // Daily Menu Page
        dailyMenu: 'Menyu ya Siku',
        dailyMenuSubtitle: 'Simamia vyakula vinavyopatikana kwa siku maalum',
        selectDate: 'Chagua Tarehe',
        viewMenu: 'Ona Menyu',
        addToDailyMenu: 'Ongeza kwenye Menyu ya Siku',
        menuItem: 'Chakula',
        selectItem: 'Chagua chakula',
        specialPrice: 'Bei Maalum (TSH)',
        specialPriceOptional: 'Bei Maalum (hiari)',
        originalPrice: 'Bei ya Asili',
        photo: 'Picha',
        noDailyMenuItems: 'Hakuna vyakula kwenye menyu ya siku hii.',
        itemAddedToDailyMenu: 'Chakula kimeongezwa kwenye menyu ya siku!',
        itemUpdatedInDailyMenu: 'Chakula kimebadilishwa kwenye menyu ya siku!',
        itemRemovedFromDailyMenu: 'Chakula kimeondolewa kutoka menyu ya siku!',
        removeDailyMenuConfirm: 'Una uhakika unataka kuondoa chakula hiki kutoka menyu ya siku?',
        date: 'Tarehe'
    },
    
    // 🇫🇷 FRENCH
    fr: {
        // Menu Management Page
        menuItems: 'Articles du Menu',
        menuSubtitle: 'Gérez les articles de menu de votre restaurant',
        addMenuItem: 'Ajouter un Article',
        editMenuItem: 'Modifier l\'Article',
        
        // Table Headers
        id: 'ID',
        name: 'Nom',
        description: 'Description',
        price: 'Prix',
        category: 'Catégorie',
        stock: 'Stock',
        status: 'Statut',
        actions: 'Actions',
        
        // Form Labels
        nameLabel: 'Nom',
        descriptionLabel: 'Description',
        priceLabel: 'Prix (TSH)',
        categoryLabel: 'Catégorie',
        stockLabel: 'Quantité en Stock',
        photoLabel: 'Photo',
        availableLabel: 'Disponible pour commander',
        
        // Categories
        mainDishes: 'Plats Principaux',
        sides: 'Accompagnements',
        drinks: 'Boissons',
        desserts: 'Desserts',
        selectCategory: 'Sélectionner une catégorie',
        
        // Buttons
        cancel: 'Annuler',
        save: 'Enregistrer',
        addItem: 'Ajouter',
        updateItem: 'Mettre à jour',
        edit: 'Modifier',
        copy: 'Copier',
        delete: 'Supprimer',
        
        // Status
        available: 'Disponible',
        notAvailable: 'Non Disponible',
        
        // Messages
        loading: 'Chargement des articles...',
        noData: 'Aucun article trouvé. Cliquez sur "Ajouter un Article".',
        itemAdded: 'Article ajouté avec succès!',
        itemUpdated: 'Article mis à jour avec succès!',
        itemDeleted: 'Article supprimé avec succès!',
        deleteConfirm: 'Êtes-vous sûr de vouloir supprimer cet article?',
        
        // Errors
        nameRequired: 'Le nom est requis',
        priceRequired: 'Le prix doit être supérieur à 0',
        categoryRequired: 'La catégorie est requise',
        fileTooLarge: 'La taille du fichier doit être inférieure à 2 Mo',
        invalidFileType: 'Veuillez télécharger une image (JPEG, PNG)',
        
        // Placeholders
        namePlaceholder: 'ex., Ugali & Poisson',
        descriptionPlaceholder: 'Décrivez votre plat...',
        pricePlaceholder: 'ex., 15000',
        stockPlaceholder: 'ex., 50',
        
        // Other
        fileHint: 'Max 2 Mo, JPEG ou PNG uniquement',
        required: '*',
        
        // Sidebar
        dashboard: 'Tableau de Bord',
        manageMenu: 'Gérer le Menu',
        todaysMenu: 'Menu du Jour',
        orders: 'Commandes',
        customerFeedback: 'Avis Clients',
        reports: 'Rapports',
        qrCodes: 'Codes QR',
        settings: 'Paramètres',
        logout: 'Déconnexion',
        
        // Daily Menu Page
        dailyMenu: 'Menu Quotidien',
        dailyMenuSubtitle: 'Gérez les articles disponibles pour des dates spécifiques',
        selectDate: 'Sélectionner la Date',
        viewMenu: 'Voir le Menu',
        addToDailyMenu: 'Ajouter au Menu Quotidien',
        menuItem: 'Article du Menu',
        selectItem: 'Sélectionner un article',
        specialPrice: 'Prix Spécial (TSH)',
        specialPriceOptional: 'Prix Spécial (facultatif)',
        originalPrice: 'Prix Original',
        photo: 'Photo',
        noDailyMenuItems: 'Aucun article dans le menu quotidien pour cette date.',
        itemAddedToDailyMenu: 'Article ajouté au menu quotidien avec succès!',
        itemUpdatedInDailyMenu: 'Article du menu quotidien mis à jour avec succès!',
        itemRemovedFromDailyMenu: 'Article retiré du menu quotidien avec succès!',
        removeDailyMenuConfirm: 'Êtes-vous sûr de vouloir retirer cet article du menu quotidien?',
        date: 'Date'
    }
};

// 🎓 LESSON: Language helper functions
export const getLanguages = () => [
    { code: 'en', name: 'English', flag: '🇬🇧' },
    { code: 'sw', name: 'Kiswahili', flag: '🇹🇿' },
    { code: 'fr', name: 'Français', flag: '🇫🇷' }
];

export const getTranslation = (lang, key) => {
    return translations[lang]?.[key] || translations.en[key] || key;
};
