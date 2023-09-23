class Word
  def self.all
    @all ||= [
      { en: "Apple",  es: "Manzana",  fr: "Pomme",      ru: "Яблоко"  },
      { en: "Mother", es: "Madre",    fr: "Mère",       ru: "Мама"    },
      { en: "Cat",    es: "Gato",     fr: "Chat",       ru: "Кот"     },
      { en: "Dog",    es: "Perro",    fr: "Chien",      ru: "Собака"  },
      { en: "Milk",   es: "Leche",    fr: "Lait",       ru: "Молоко"  },
      { en: "Night",  es: "Noche",    fr: "Nuit",       ru: "Ночь"    },
      { en: "Hi",     es: "Hola",     fr: "Bonjour",    ru: "Привет"  },
      { en: "Bye",    es: "Adiós",    fr: "Au revoir",  ru: "Пока"    },
      { en: "Buy",    es: "Comprar",  fr: "Acheter",    ru: "Купить"  },
      { en: "Water",  es: "Agua",     fr: "Eau",        ru: "Вода"    }
    ]
  end
end
