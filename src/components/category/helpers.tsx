import { DATA_CATEGORIES } from "./DATA";

export const optionCategories = DATA_CATEGORIES.map(item => ({
    label: item.name,
    value: item.id
}))