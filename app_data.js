// --- Mocking Family Data (читает имена из localStorage) ---

/**
 * Возвращает отображаемое имя для члена семьи.
 * Ищет сохраненное имя в localStorage; если его нет, возвращает имя по умолчанию.
 * @param {string} id - Уникальный ID члена семьи ('father', 'mother', 'child').
 * @returns {string} - Отображаемое имя.
 */
function getMemberDisplayName(id) {
    // В settings_family.html вы используете member_name_id
    const storedName = localStorage.getItem(`member_name_${id}`);
    
    // Определяем имя по умолчанию
    let defaultName = '';
    switch (id) {
        case 'father':
            defaultName = 'Папа';
            break;
        case 'mother':
            defaultName = 'Мама';
            break;
        case 'child':
            defaultName = 'Ребенок';
            break;
        default:
            defaultName = 'Гость';
            break;
    }

    return storedName || defaultName;
}

/**
 * Возвращает полный список членов семьи с их текущими именами, инициалами и цветами.
 * Используется для рендеринга аналитических данных.
 * @returns {Array<Object>} Список объектов { id, role, currentName, iconInitial, color }.
 */
function getFamilyMembers() {
    // Цвета соответствуют стилям в settings_family.html
    const familyRoles = [
        { id: 'father', role: 'Основной пользователь', color: '#EE3124' },
        { id: 'mother', role: 'Взрослый', color: '#C02929' },
        { id: 'child', role: 'Ребенок', color: '#801818' }
    ];

    return familyRoles.map(member => {
        const currentName = getMemberDisplayName(member.id);
        return {
            id: member.id,
            role: member.role,
            color: member.color,
            currentName: currentName,
            iconInitial: currentName.charAt(0).toUpperCase()
        };
    });
}


// --- Mocking Transactions Data ---

const MOCK_CATEGORIES = [
    { id: 'products', name: 'Продукты', icon: 'fa-shopping-basket', color: '#54A8C7' },
    { id: 'transport', name: 'Транспорт', icon: 'fa-bus', color: '#8E44AD' },
    { id: 'house', name: 'Дом', icon: 'fa-home', color: '#1ABC9C' },
    { id: 'cafes', name: 'Кафе и рестораны', icon: 'fa-utensils', color: '#F39C12' },
    { id: 'salary', name: 'Зарплата', icon: 'fa-hand-holding-usd', color: '#27AE60' },
    { id: 'other', name: 'Прочее', icon: 'fa-ellipsis-h', color: '#95A5A6' },
];

function getTransactionCategories() {
    return MOCK_CATEGORIES;
}

// Helper to get category name
function getCategoryNameById(id) {
    return MOCK_CATEGORIES.find(cat => cat.id === id)?.name || 'Неизвестно';
}

// Mock Transactions data (dates adjusted to be recent for charts)
const MOCK_TRANSACTIONS = [
    // Income
    { id: 1, type: 'income', amount: 150000, categoryId: 'salary', description: 'Зарплата (Папа)', date: '2025-11-25', memberId: 'father' },
    // Father's expenses
    { id: 2, type: 'expense', amount: 3500, categoryId: 'products', description: 'Супермаркет', date: '2025-11-28', memberId: 'father' },
    { id: 3, type: 'expense', amount: 1200, categoryId: 'transport', description: 'Бензин', date: '2025-11-27', memberId: 'father' },
    { id: 4, type: 'expense', amount: 4500, categoryId: 'house', description: 'Квартплата', date: '2025-11-20', memberId: 'father' },
    // Mother's expenses
    { id: 5, type: 'expense', amount: 2500, categoryId: 'products', description: 'Продуктовый рынок', date: '2025-11-28', memberId: 'mother' },
    { id: 6, type: 'expense', amount: 1800, categoryId: 'cafes', description: 'Обед с коллегами', date: '2025-11-26', memberId: 'mother' },
    { id: 7, type: 'expense', amount: 500, categoryId: 'transport', description: 'Такси', date: '2025-11-26', memberId: 'mother' },
    // Child's expenses
    { id: 8, type: 'expense', amount: 700, categoryId: 'cafes', description: 'Мороженое', date: '2025-11-28', memberId: 'child' },
    { id: 9, type: 'expense', amount: 300, categoryId: 'other', description: 'Игровая валюта', date: '2025-11-27', memberId: 'child' },
    // More expenses
    { id: 10, type: 'expense', amount: 1500, categoryId: 'products', description: 'Продукты', date: '2025-11-25', memberId: 'father' },
    { id: 11, type: 'expense', amount: 900, categoryId: 'transport', description: 'Метро', date: '2025-11-24', memberId: 'mother' },
    { id: 12, type: 'expense', amount: 1800, categoryId: 'cafes', description: 'Ужин в ресторане', date: '2025-11-23', memberId: 'father' },
    { id: 13, type: 'expense', amount: 400, categoryId: 'other', description: 'Книжный магазин', date: '2025-11-22', memberId: 'mother' },
];

/**
 * Фильтрует транзакции по заданным параметрам.
 * В этой версии игнорируются фильтры, кроме периода, для простоты.
 */
function getFamilyTransactions(startDate, endDate) {
    const start = new Date(startDate);
    const end = new Date(endDate);

    const filteredTransactions = MOCK_TRANSACTIONS.filter(t => {
        const tDate = new Date(t.date);
        // Фильтруем по дате
        return tDate >= start && tDate <= end;
    });
    
    // Добавляем display-информацию (имя, иконка, цвет)
    return filteredTransactions.map(t => ({
        ...t,
        categoryName: getCategoryNameById(t.categoryId),
        memberName: getMemberDisplayName(t.memberId),
        categoryIcon: getTransactionCategories().find(c => c.id === t.categoryId)?.icon || 'fa-question-circle',
        categoryColor: getTransactionCategories().find(c => c.id === t.categoryId)?.color || '#95A5A6',
    })).sort((a, b) => new Date(b.date) - new Date(a.date));
}

/**
 * Mock function to calculate total expenses for a family member.
 * @param {string} memberId - ID члена семьи.
 * @returns {number} - Общая сумма расходов.
 */
function getMemberTotalExpense(memberId) {
    return MOCK_TRANSACTIONS
        .filter(t => t.type === 'expense' && t.memberId === memberId)
        .reduce((sum, t) => sum + t.amount, 0);
}
