# In the app's terminology, a "deck" is a set of "cards"
class Deck
  attr_reader :code, :name, :header, :cards

  def initialize(code:, name:, header:, cards:)
    @code = code
    @name = name
    @header = header
    @cards = cards
  end

  def self.all
    language_codes = %w[en es fr ru]
    # removing the current locale from the available languages —
    # so that English speakers won't see the choice of English language
    language_codes -= [I18n.locale.to_s]
    language_codes.map do |language_code|
      cards = Card.all_for(source: I18n.locale.to_s, target: language_code)
      new(
        code: language_code,
        name: I18n.t("decks.#{language_code}.name"),
        header: I18n.t("decks.#{language_code}.header"),
        cards: cards
      )
    end
  end

  def self.find(code)
    all.find { |deck| deck.code == code }
  end

  def as_json(_options = {})
    {
      code: code,
      name: name,
      header: header,
      cards: cards.map(&:as_json)
    }
  end
end
