# In the app's terminology, a "card" is a pair of a word and its translation
class Card
  attr_reader :question, :answer

  def initialize(question:, answer:)
    @question = question
    @answer = answer
  end

  def self.all_for(source:, target:)
    Word.all.map do |word|
      new(question: word[source.to_sym], answer: word[target.to_sym])
    end
  end

  def as_json(_options = {})
    {
      question: question,
      answer: answer
    }
  end
end
